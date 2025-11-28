import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth } from '../lib/firebase.config';

const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:3000';

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
            try {
              const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
              const res = await fetch(`${API_BASE}/api/meetings`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ metadata: meetingData }),
              });
              if (!res.ok) {
                console.error('Failed to create meeting on server', await res.text());
                // Fallback: still create a local meeting entry
                const newMeeting: Meeting = {
                  ...meetingData,
                  id: `meeting-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  createdAt: new Date().toISOString(),
                };
                set((state) => ({ meetings: [...state.meetings, newMeeting] }));
                return;
              }

              const payload = await res.json();
              const created = payload?.data ?? null;
              if (created) {
                // normalize server meeting to frontend Meeting shape (metadata may contain UI fields)
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
              // Fallback local create
              const newMeeting: Meeting = {
                ...meetingData,
                id: `meeting-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                createdAt: new Date().toISOString(),
              };
              set((state) => ({ meetings: [...state.meetings, newMeeting] }));
            }
          },

      // Fetch meetings owned by the authenticated user from backend
      fetchMyMeetings: async () => {
        try {
          const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
          const res = await fetch(`${API_BASE}/api/meetings`, {
            method: 'GET',
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          });
          if (!res.ok) {
            console.error('Failed to fetch meetings for user', await res.text());
            return;
          }
          const payload = await res.json();
          const data = payload?.data ?? [];
          if (Array.isArray(data)) {
            // Normalize meetings from server
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
          console.error('Error fetching meetings', err);
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
