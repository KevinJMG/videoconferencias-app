/** Chat message payload shared between client and server */
export interface ChatMessagePayload {
  meetingId?: string;
  userId: string;
  /** Optional display name for the user who sent the message */
  userName?: string;
  message: string;
  timestamp?: string;
  messageId?: string;
}

export interface OnlineUser {
  socketId: string;
  userId: string;
}
