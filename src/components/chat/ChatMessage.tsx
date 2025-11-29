import React from 'react';
import type { ChatMessagePayload } from '../../types/chat';
import useAuthStore from '../../stores/useAuthStore';

interface Props {
  message: ChatMessagePayload;
}

const ChatMessage: React.FC<Props> = ({ message }) => {
  const time = new Date(message.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const currentUser = useAuthStore((s) => s.user);
  const myUid = currentUser?.uid || 'anonymous';
  const isOutgoing = message.userId === myUid;

  return (
    <div className={`chat-message-item ${isOutgoing ? 'outgoing' : 'incoming'}`}>
      <div className="chat-message-header">
        <strong className="chat-message-user">{message.userName || message.userId}</strong>
        <span className="chat-message-time">{time}</span>
      </div>
      <div className="chat-message-body">{message.message}</div>
    </div>
  );
};

export default ChatMessage;
