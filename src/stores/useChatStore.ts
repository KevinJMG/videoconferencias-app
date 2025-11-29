import { create } from 'zustand';
import type { ChatMessagePayload, OnlineUser } from '../types/chat';

type MessagesMap = Record<string, ChatMessagePayload[]>;

interface ChatState {
  messages: MessagesMap;
  presence: Record<string, OnlineUser[]>; // by meetingId
  isLoading: boolean;
  appendMessage: (meetingId: string | undefined, msg: ChatMessagePayload) => void;
  prependMessages: (meetingId: string | undefined, msgs: ChatMessagePayload[]) => void;
  setPresence: (meetingId: string | undefined, users: OnlineUser[]) => void;
  setLoading: (v: boolean) => void;
  setHistory: (meetingId: string | undefined, msgs: ChatMessagePayload[]) => void;
}

/**
 * Chat Zustand store for messages and presence.
 */
const useChatStore = create<ChatState>((set, get) => ({
  messages: {},
  presence: {},
  isLoading: false,
  appendMessage: (meetingId, msg) => {
    const key = meetingId || 'global';
    const current = get().messages[key] || [];
    // simple dedupe by messageId if present
    const exists = msg.messageId && current.some(m => m.messageId === msg.messageId);
    if (exists) return;
    set({ messages: { ...get().messages, [key]: [...current, msg] } });
  },
  prependMessages: (meetingId, msgs) => {
    const key = meetingId || 'global';
    const current = get().messages[key] || [];
    set({ messages: { ...get().messages, [key]: [...msgs, ...current] } });
  },
  setPresence: (meetingId, users) => {
    const key = meetingId || 'global';
    set({ presence: { ...get().presence, [key]: users } });
  },
  setLoading: (v) => set({ isLoading: v }),
  setHistory: (meetingId, msgs) => {
    const key = meetingId || 'global';
    set({ messages: { ...get().messages, [key]: msgs } });
  }
}));

export default useChatStore;
