// React import below includes hooks used in this component
import useChatStore from '../../stores/useChatStore';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { initSocket, joinRoom, sendChatMessage, getSocket } from '../../utils/socket';
import useAuthStore from '../../stores/useAuthStore';
import { getMessages } from '../../daos/ChatDAO';
import { auth } from '../../lib/firebase.config';
import React, { useEffect, useMemo } from 'react';

interface Props {
  meetingId?: string;
}

const ChatPanel: React.FC<Props> = ({ meetingId }) => {
  const user = useAuthStore((s) => s.user);

  // Select the messages map and derive the array via useMemo to avoid returning
  // a freshly allocated array from the selector (which can cause infinite update loops).
  const messagesMap = useChatStore((s) => s.messages);
  const messages = useMemo(() => messagesMap[meetingId || 'global'] || [], [messagesMap, meetingId]);
  const appendMessage = useChatStore((s: any) => s.appendMessage as (m: any, p: any) => void);
  const setHistory = useChatStore((s: any) => s.setHistory as (m: any, p: any) => void);
  const setPresence = useChatStore((s: any) => s.setPresence as (m: any, p: any) => void);

  useEffect(() => {
    let mounted = true;

    // Allow joining by meetingId even when there's no authenticated user (guest flow).
    // We still obtain an ID token when available; getIdToken will return null for guests.

    const run = async () => {
      // local helper to obtain current ID token when needed.
      // Prefer Firebase SDK currentUser, but fall back to localStorage.idToken for legacy/fast paths.
      const getIdToken = async () => {
        try {
          const current = auth.currentUser;
          if (current) {
            try {
              return await current.getIdToken();
            } catch (_e) {
              // fall through to fallback
            }
          }
          if (typeof window !== 'undefined' && window.localStorage) {
            const fallback = window.localStorage.getItem('idToken');
            return fallback || null;
          }
          return null;
        } catch (e) {
          return null;
        }
      };

      await initSocket(getIdToken);
      const socket = getSocket();
      if (!socket) return;

      // ensure socket is connected before joining room to avoid race conditions
      if (!socket.connected) {
        await new Promise<void>((resolve) => {
          socket.once('connect', () => resolve());
        });
      }

      // Announce identity to chat server so it can map socketId -> userId
      try {
        if (user?.uid) {
          const s = getSocket();
          s?.emit('newUser', user.uid);
          console.debug('ChatPanel emitted newUser', user.uid);
        }
      } catch (e) {
        // ignore
      }

      // join room if meetingId present
      if (meetingId) {
        joinRoom(meetingId);
      }

      const onMessage = (payload: any) => {
        try {
          const s = getSocket();
          console.debug('ChatPanel.onMessage received on socket', s?.id, 'payload=', payload);
        } catch (e) {}
        appendMessage(payload.meetingId, payload);
      };
      const onPresence = (payload: any) => {
        if (payload?.meetingId) setPresence(payload.meetingId, payload.users || []);
      };

      socket.on('chat:message', onMessage);
      socket.on('usersOnline', onPresence);

      // Re-join the room automatically when socket reconnects
      const onConnect = () => {
        try {
          const s = getSocket();
          console.debug('ChatPanel socket connected event, socketId=', s?.id);
        } catch (e) {}
        if (meetingId) joinRoom(meetingId);
        // On reconnect, re-announce identity so server updates mapping
        try {
          if (user?.uid) {
            const s = getSocket();
            s?.emit('newUser', user.uid);
            console.debug('ChatPanel emitted newUser on reconnect', user.uid);
          }
        } catch (e) {
          // ignore
        }
      };
      socket.on('connect', onConnect);

      try {
        const s = getSocket();
        if (meetingId && s) console.debug('ChatPanel: joined room', meetingId, 'socketId=', s.id);
      } catch (e) {}
      // load history from REST
      try {
        const token = await getIdToken();
        if (meetingId && token) {
          const hist = await getMessages(meetingId, { limit: 50 }, token);
          if (mounted) setHistory(meetingId, hist);
        }
      } catch (e) {
        // ignore for now; UI may show no history
      }

      // cleanup function
      return () => {
        mounted = false;
        try {
          socket.off('chat:message', onMessage);
          socket.off('usersOnline', onPresence);
          socket.off('connect', onConnect);
        } catch (e) {
          // ignore
        }
      };
    };

    const cleanupPromise = run();
    // ensure we remove listeners if run resolves to cleanup function
    return () => {
      // mounted flag will prevent setHistory after unmount
      mounted = false;
      cleanupPromise.then((fn: any) => {
        if (typeof fn === 'function') fn();
      }).catch(() => {});
    };
  }, [meetingId, user, appendMessage, setHistory, setPresence]);

  const handleSend = (payload: any) => {
    // optimistic append
    appendMessage(payload.meetingId, payload);
    // send over socket
    sendChatMessage(payload);
  };

  return (
    <div className="chat-panel-root">
      <div className="chat-messages-list">
        {messages.map((m: any) => (
          <ChatMessage key={m.messageId || m.timestamp} message={m} />
        ))}
      </div>
      <ChatInput meetingId={meetingId} userId={user?.uid || 'anonymous'} userName={user?.displayName || user?.email || undefined} onSend={handleSend} />
    </div>
  );
};

export default ChatPanel;
