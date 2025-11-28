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
  // Try getToken (Firebase SDK). If that yields nothing, fall back to localStorage.idToken
  let token = null as string | null;
  try {
    token = await getToken();
  } catch (_) {
    token = null;
  }
  const fallbackToken = (typeof window !== 'undefined' && window.localStorage) ? window.localStorage.getItem('idToken') : null;
  if (!token && fallbackToken) token = fallbackToken;
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

  // Refresh the handshake token before reconnect attempts so reconnect uses fresh token.
  socket.on('reconnect_attempt', async () => {
    try {
      const newToken = (await getToken()) || ((typeof window !== 'undefined' && window.localStorage) ? window.localStorage.getItem('idToken') : null);
      if (socket && socket.io && socket.io.opts) {
        // ManagerOptions typing may not include 'auth' depending on socket.io-client version;
        // cast to any to safely set the auth token for reconnect attempts.
        (socket.io.opts as any).auth = { token: newToken || undefined };
      }
    } catch (_e) {
      // ignore
    }
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
