import React, { useState, useEffect, useRef } from "react";
import "./VideoConference.css";
import { useNavigate } from "react-router-dom";
import { socket } from "../../socket/socketManager";
import { getAuth } from "firebase/auth";

type ChatMessage = { userId: string; message: string; timestamp: string; roomId?: string };
type Participant = { userId: string; socketId: string };

const VideoConference: React.FC = () => {
  const navigate = useNavigate();
  const roomId = "test-room"; // room de prueba

  const [currentUserName, setCurrentUserName] = useState("Invitado");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageDraft, setMessageDraft] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([]);

  // --- Obtener usuario de Firebase y unirse a la room ---
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const name = user.displayName || user.email?.split("@")[0] || "Invitado";
      setCurrentUserName(name);

      // Emitir joinRoom solo después de tener el nombre real
      socket.emit("joinRoom", { userId: name, roomId });
    } else {
      // Si no hay usuario, usar un nombre aleatorio
      const guestName = `Invitado-${Math.random().toString(36).slice(2, 5)}`;
      setCurrentUserName(guestName);
      socket.emit("joinRoom", { userId: guestName, roomId });
    }
  }, []);

  // --- Escuchar mensajes entrantes y usuarios en línea ---
  useEffect(() => {
    const handleIncomingMessage = (payload: ChatMessage) => {
      setMessages((prev) => [...prev, payload]);
    };

    const handleUsersOnline = (users: Participant[]) => {
      setParticipants(users);
    };

    socket.on("chat:message", handleIncomingMessage);
    socket.on("usersOnline", handleUsersOnline);

    return () => {
      socket.off("chat:message", handleIncomingMessage);
      socket.off("usersOnline", handleUsersOnline);
    };
  }, []);

  // --- Enviar mensaje ---
  const handleSendMessage = () => {
    if (!messageDraft.trim()) return;

    const outgoingMessage: ChatMessage = {
      userId: currentUserName,
      roomId,
      message: messageDraft.trim(),
      timestamp: new Date().toISOString(),
    };

    socket.emit("chat:message", outgoingMessage);
    setMessageDraft("");
  };

  const handleEndCall = () => navigate(-1);

  return (
    <div className="conference-container">
      {/* HEADER */}
      <header className="conference-header">
        <div className="header-info">
          <h1 className="logo-text">JoinGo</h1>
          <span className="meeting-id">{roomId}</span>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <div className="conference-content">
        {/* Video Area */}
        <div className="video-area">
          <div className="main-video">
            <div className="video-placeholder">
              <div className="avatar-large">{currentUserName.charAt(0)}</div>
              <p className="video-name">{currentUserName}</p>
            </div>
          </div>

          <div className="participants-grid">
            {participants
              .filter((p) => p.userId !== currentUserName)
              .map((p) => (
                <div key={p.socketId} className="participant-video">
                  <div className="video-placeholder-small">{p.userId.charAt(0)}</div>
                  <span className="participant-label">{p.userId}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Chat Panel */}
        {isChatOpen && (
          <div className="chat-panel">
            <div className="chat-header">
              <h3>Chat</h3>
              <button className="btn-close-chat" onClick={() => setIsChatOpen(false)}>×</button>
            </div>
            <div className="chat-messages">
              {messages.map((msg, i) => {
                const isOwn = msg.userId === currentUserName;
                const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                return (
                  <div key={i} className={isOwn ? "own" : "other"}>
                    <div className="message-header">
                      <span className="message-user">{msg.userId}</span>
                      <span className="message-time">{time}</span>
                    </div>
                    <p className="message-text">{msg.message}</p>
                  </div>
                );
              })}
            </div>
            <div className="chat-input-container">
              <input
                type="text"
                className="chat-input"
                placeholder="Escribe un mensaje..."
                value={messageDraft}
                onChange={(e) => setMessageDraft(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button className="btn-send" onClick={handleSendMessage}>Enviar</button>
            </div>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="controls-bar">
        <button onClick={() => setIsMuted(!isMuted)}>{isMuted ? "🔇" : "🎤"}</button>
        <button onClick={() => setIsVideoOff(!isVideoOff)}>{isVideoOff ? "📷❌" : "📷"}</button>
        <button onClick={() => setIsChatOpen(!isChatOpen)}>💬 Chat</button>
        <button onClick={handleEndCall}>❌ Salir</button>
      </div>
    </div>
  );
};

export default VideoConference;
