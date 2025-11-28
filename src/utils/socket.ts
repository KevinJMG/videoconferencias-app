import { io, Socket } from 'socket.io-client';
import type { ChatMessagePayload } from '../types/chat';

let socket: Socket | null = null;

/**
 * Initialize the socket connection.
 * @param getToken async function that returns a Firebase ID token string
 * @param url optional socket server url
 */
export async function initSocket(getToken: () => Promise<string | null>, url?: string) {
  if (socket) return socket;
  const token = await getToken();
  const serverUrl = url || (import.meta.env.VITE_CHAT_SERVICE_URL as string) || '';
  socket = io(serverUrl, {
    auth: {
      token: token || undefined,
    },
    transports: ['websocket'],
    autoConnect: true,
    // limit reconnection attempts to avoid hot loops when server rejects due to config
    reconnectionAttempts: 3,
    reconnectionDelay: 2000,
  });

  socket.on('connect_error', (err: any) => {
    const msg = err?.message || String(err);
    console.error('Socket connect_error', msg);
    // If server indicates auth subsystem is unavailable (e.g. eisc-chat can't verify tokens),
    // stop further reconnection attempts and cleanup the socket instance so callers can retry later.
    try {
      if (msg && msg.toLowerCase().includes('auth-unavailable')) {
        console.error('Chat service auth unavailable — stopping socket retries.');
        // Capture current socket instance into a local variable to satisfy strict null checks
        const s = socket;
        if (s) {
          if (s.io) s.io.opts.reconnection = false;
          s.disconnect();
          socket = null;
        }
      }
    } catch (_e) {
      // ignore
    }
  });

  return socket;
}

export function getSocket() {
  return socket;
}

export function joinRoom(meetingId: string) {
  if (!socket) return;
  socket.emit('joinRoom', meetingId);
}

export function sendChatMessage(payload: ChatMessagePayload) {
  if (!socket) return;
  socket.emit('chat:message', payload);
}
