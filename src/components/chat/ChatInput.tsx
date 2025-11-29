import React, { useState } from 'react';
import type { ChatMessagePayload } from '../../types/chat';

interface Props {
  meetingId?: string;
  userId: string;
  userName?: string;
  onSend: (payload: ChatMessagePayload) => void;
}

const ChatInput: React.FC<Props> = ({ meetingId, userId, userName, onSend }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const payload: ChatMessagePayload = {
      meetingId,
      userId,
      userName: userName || undefined,
      message: trimmed,
      timestamp: new Date().toISOString(),
      messageId: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
    };
    onSend(payload);
    setText('');
  };

  return (
    <div className="chat-input-container">
      <input
        className="chat-input"
        type="text"
        placeholder="Escribe un mensaje..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        aria-label="Escribe un mensaje"
      />
      <button className="btn-send" onClick={handleSend} aria-label="Enviar mensaje">Enviar</button>
    </div>
  );
};

export default ChatInput;
