import type { ChatMessagePayload } from '../types/chat';

// Prefer the new VITE_API_URL env var, fall back to legacy VITE_API_BASE or
// an empty string so the app will use relative URLs when deployed with the
// API on the same origin. Trim any trailing slash for consistency.
const rawApiBase = (import.meta.env.VITE_API_URL as string) || (import.meta.env.VITE_API_BASE as string) || '';
const API_BASE = rawApiBase.replace(/\/$/, '');

/**
 * Fetch persisted messages for a meeting via backend REST API.
 * @param meetingId - The meeting identifier
 * @param opts - Optional pagination params: { limit, before }
 * @param token - Optional Firebase ID token for authenticated requests
 * @returns Array of chat messages
 */
export async function getMessages(
  meetingId: string,
  opts?: { limit?: number; before?: string },
  token?: string
) {
  const q = new URLSearchParams();
  if (opts?.limit) q.set('limit', String(opts.limit));
  if (opts?.before) q.set('before', opts.before);
  const url = `${API_BASE}/api/meetings/${encodeURIComponent(meetingId)}/messages${q.toString() ? `?${q.toString()}` : ''}`;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`Failed to fetch messages: ${res.status}`);
  const data: ChatMessagePayload[] = await res.json();
  return data;
}

/**
 * Persist a chat message to the backend REST API for the given meeting.
 * @param meetingId - The meeting identifier
 * @param payload - The chat message payload to persist
 * @param token - Optional Firebase ID token for authenticated requests
 */
export async function postMessage(meetingId: string, payload: ChatMessagePayload, token?: string) {
  const url = `${API_BASE}/api/meetings/${encodeURIComponent(meetingId)}/messages`;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error('Failed to post message');
  return res.json();
}
