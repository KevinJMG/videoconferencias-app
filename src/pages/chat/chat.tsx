import React, { useEffect, useRef, useState } from "react";
import { socket } from "../../socket/socketManager";
import { useParams } from "react-router-dom";

type ChatMessage = { userId: string; message: string; timestamp: string };

const Chat: React.FC = () => {
  const params = useParams(); // no usar tipo genérico
  const roomId = params.roomId; // puede ser undefined
  const usernameRef = useRef(`user-${Math.random().toString(36).slice(2, 8)}`);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageDraft, setMessageDraft] = useState("");

  useEffect(() => {
    if (!roomId) return;
    socket.emit("joinRoom", { userId: usernameRef.current, roomId });
  }, [roomId]);

  useEffect(() => {
    const handleIncomingMessage = (payload: ChatMessage) => {
      setMessages((prev) => [...prev, payload]);
    };

    socket.on("chat:message", handleIncomingMessage);
    return () => {
      socket.off("chat:message", handleIncomingMessage);
    };
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageDraft.trim() || !roomId) return;

    socket.emit("chat:message", {
      userId: usernameRef.current,
      roomId,
      message: messageDraft.trim(),
    });
    setMessageDraft("");
  };

  return (
    <div className="container-page">
      <h1>Room: {roomId || "No room selected"}</h1>
      <div className="chat-window">
        {messages.map((msg, i) => (
          <div key={i} className={msg.userId === usernameRef.current ? "own" : "other"}>
            <b>{msg.userId}</b>: {msg.message}
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage}>
        <input
          value={messageDraft}
          onChange={(e) => setMessageDraft(e.target.value)}
          placeholder="Escribe un mensaje..."
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default Chat;
