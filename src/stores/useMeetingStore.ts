import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth } from '../lib/firebase.config';

// Prefer `VITE_API_URL` in deployments. Fall back to legacy `VITE_API_BASE` or relative path ''
const API_BASE = (import.meta.env.VITE_API_URL as string) || (import.meta.env.VITE_API_BASE as string) || '';
const API_BASE_CLEAN = API_BASE.replace(/\/$/, '');

export interface Meeting {
  id: string;
  meetingName: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  participants: string[];
  settings: {
    waitingRoom: boolean;
    screenSharing: boolean;
    privateRoom: boolean;
    chat: boolean;
    requirePassword: boolean;
  };
  createdAt: string;
}

type MeetingStore = {
  meetings: Meeting[];
  addMeeting: (meeting: Omit<Meeting, 'id' | 'createdAt'>) => Promise<void>;
  fetchMyMeetings: () => Promise<void>;
  removeMeeting: (id: string) => void;
  updateMeeting: (id: string, meeting: Omit<Meeting, 'id' | 'createdAt'>) => void;
  getMeetingById: (id: string) => Meeting | undefined;
  getUpcomingMeetings: () => Meeting[];
};

const useMeetingStore = create<MeetingStore>()(
  persist(
    (set, get) => ({
      meetings: [],

          // Persist meeting to backend and then store locally. Returns the created meeting from server.
          addMeeting: async (meetingData) => {
            const doFetchWithRetry = async (input: RequestInfo, init?: RequestInit) => {
              const token1 = auth.currentUser ? await auth.currentUser.getIdToken(true) : null;
                console.debug('[useMeetingStore] doFetchWithRetry first attempt token present:', !!token1);
                const headers1 = Object.assign({ 'Content-Type': 'application/json' }, init?.headers || {}, token1 ? { Authorization: `Bearer ${token1}` } : {});
                console.debug('[useMeetingStore] doFetchWithRetry first attempt', { input, headers: headers1 });
                let res;
                try {
                  res = await fetch(input, { ...(init || {}), headers: headers1 });
                } catch (err: any) {
                  console.error('[useMeetingStore] fetch exception (first attempt):', err?.name, err?.message || err);
                  throw err;
                }
              if (res.status !== 401) return res;
              try {
                const token2 = auth.currentUser ? await auth.currentUser.getIdToken(true) : null;
                console.debug('[useMeetingStore] doFetchWithRetry second attempt token present:', !!token2);
                const headers2 = Object.assign({ 'Content-Type': 'application/json' }, init?.headers || {}, token2 ? { Authorization: `Bearer ${token2}` } : {});
                console.debug('[useMeetingStore] doFetchWithRetry second attempt', { input, headers: headers2 });
                try {
                  res = await fetch(input, { ...(init || {}), headers: headers2 });
                } catch (err: any) {
                  console.error('[useMeetingStore] fetch exception (second attempt):', err?.name, err?.message || err);
                  throw err;
                }
                return res;
              } catch (e) {
                return res;
              }
            };

            try {
                  const url = `${API_BASE_CLEAN}/api/meetings`;
                  console.debug('[useMeetingStore] addMeeting calling', { url });
                  const res = await doFetchWithRetry(url, {
                    method: 'POST',
                    body: JSON.stringify({ metadata: meetingData }),
                  });

              if (!res.ok) {
                const bodyText = await res.text().catch(() => '');
                if (res.status === 401) {
                  // NOTE: auto-logout on 401 disabled to allow debugging in deployed environments.
                  // Previously we forced sign-out and redirected to /login here which prevented
                  // developers from inspecting failing requests in production. Instead, log the
                  // condition and return so the UI can surface an error without disrupting the
                  // current session.
                  console.warn('Failed to create meeting on server - unauthorized after retry. Auto-logout disabled for debugging.', bodyText);
                  return;
                }
                console.error('Failed to create meeting on server', res.status, bodyText);
                return;
              }

              const payload = await res.json();
              const created = payload?.data ?? null;
              if (created) {
                const meta = created.metadata || {};
                const normalized: Meeting = {
                  id: created.id,
                  meetingName: meta.meetingName || meta.name || '',
                  description: meta.description || '',
                  date: meta.date || '',
                  startTime: meta.startTime || '',
                  endTime: meta.endTime || '',
                  duration: meta.duration || '',
                  participants: meta.participants || [],
                  settings: meta.settings || { waitingRoom: true, screenSharing: true, privateRoom: false, chat: true, requirePassword: false },
                  createdAt: created.createdAt || new Date().toISOString(),
                };
                set((state) => ({ meetings: [...state.meetings, normalized] }));
              }
            } catch (err) {
              console.error('Error creating meeting', err);
              return;
            }
          },

      // Fetch meetings owned by the authenticated user from backend
      fetchMyMeetings: async () => {
        const doFetchWithRetry = async (url: string, init?: RequestInit) => {
          try {
            const token1 = auth.currentUser ? await auth.currentUser.getIdToken(true) : null;
            console.debug('[useMeetingStore] fetchMyMeetings first attempt token present:', !!token1);
            const headers1 = Object.assign({}, init?.headers || {}, token1 ? { Authorization: `Bearer ${token1}` } : {});
            let res = await fetch(url, { ...(init || {}), headers: headers1 });
            if (res.status !== 401) return res;
            // On 401 try once more with a fresh token
            const token2 = auth.currentUser ? await auth.currentUser.getIdToken(true) : null;
            console.debug('[useMeetingStore] fetchMyMeetings retry token present:', !!token2);
            const headers2 = Object.assign({}, init?.headers || {}, token2 ? { Authorization: `Bearer ${token2}` } : {});
            res = await fetch(url, { ...(init || {}), headers: headers2 });
            return res;
          } catch (err) {
            // Network or CORS error — bubble up for caller to handle
            throw err;
          }
        };

        try {
          const url = `${API_BASE_CLEAN}/api/meetings`;
          console.debug('[useMeetingStore] fetchMyMeetings calling', { url });
          const res = await doFetchWithRetry(url, { method: 'GET' });
          if (!res.ok) {
            // If unauthorized after retry, force logout. For other errors, log for debugging.
            const body = await res.text().catch(() => '');
            if (res.status === 401) {
              // NOTE: auto-logout on 401 disabled to allow debugging and inspection of
              // failing requests. Keep the user signed in and surface a warning instead
              // of forcing a redirect that makes reproduction and debugging harder.
              console.warn('[useMeetingStore] fetchMyMeetings: unauthorized after retry — auto-logout disabled for debugging.', body);
              return;
            }
            console.error('[useMeetingStore] fetchMyMeetings: non-OK response', res.status, body);
            return;
          }

          const payload = await res.json().catch(() => ({}));
          const data = payload?.data ?? [];
          if (Array.isArray(data)) {
            const normalized = data.map((m: any) => {
              const meta = m.metadata || {};
              return {
                id: m.id,
                meetingName: meta.meetingName || meta.name || '',
                description: meta.description || '',
                date: meta.date || '',
                startTime: meta.startTime || '',
                endTime: meta.endTime || '',
                duration: meta.duration || '',
                participants: meta.participants || [],
                settings: meta.settings || { waitingRoom: true, screenSharing: true, privateRoom: false, chat: true, requirePassword: false },
                createdAt: m.createdAt || new Date().toISOString(),
              } as Meeting;
            });
            set(() => ({ meetings: normalized }));
          }
        } catch (err) {
          // Network or unexpected error — do not auto-logout for transient network errors.
          console.error('[useMeetingStore] Error fetching meetings (network/preflight/CORS?)', err);
        }
      },

      removeMeeting: (id) => {
        set((state) => ({
          meetings: state.meetings.filter((meeting) => meeting.id !== id),
        }));
      },

      updateMeeting: (id, meetingData) => {
        set((state) => ({
          meetings: state.meetings.map((meeting) =>
            meeting.id === id
              ? {
                  ...meeting,
                  ...meetingData,
                  id: meeting.id, // Mantener el ID original
                  createdAt: meeting.createdAt, // Mantener la fecha de creación
                }
              : meeting
          ),
        }));
      },

      getMeetingById: (id) => {
        return get().meetings.find((meeting) => meeting.id === id);
      },

      getUpcomingMeetings: () => {
        const now = new Date();
        return get()
          .meetings.filter((meeting) => {
            const meetingDateTime = new Date(`${meeting.date}T${meeting.startTime}`);
            return meetingDateTime >= now;
          })
          .sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.startTime}`);
            const dateB = new Date(`${b.date}T${b.startTime}`);
            return dateA.getTime() - dateB.getTime();
          });
      },
    }),
    {
      name: 'meeting-storage',
    }
  )
);

export default useMeetingStore;
