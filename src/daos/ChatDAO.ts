import type { ChatMessagePayload } from '../types/chat';

const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:3000';

/**
 * Fetch persisted messages for a meeting via backend REST API.
 * @param meetingId
 * @param opts { limit, before }
 * @param token optional bearer token
 */
export async function getMessages(meetingId: string, opts?: { limit?: number; before?: string }, token?: string) {
  const q = new URLSearchParams();
  if (opts?.limit) q.set('limit', String(opts.limit));
  if (opts?.before) q.set('before', opts.before);
  const url = `${API_BASE}/api/meetings/${encodeURIComponent(meetingId)}/messages?${q.toString()}`;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`Failed to fetch messages: ${res.status}`);
  const data: ChatMessagePayload[] = await res.json();
  return data;
}

export async function postMessage(meetingId: string, payload: ChatMessagePayload, token?: string) {
  const url = `${API_BASE}/api/meetings/${encodeURIComponent(meetingId)}/messages`;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error('Failed to post message');
  return res.json();
}
