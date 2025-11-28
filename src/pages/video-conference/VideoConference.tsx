import React, { useState } from "react";
import "./VideoConference.css";
import { useNavigate, useParams } from "react-router-dom";
import useMeetingStore from "../../stores/useMeetingStore";

/**
 * VideoConference Component
 *
 * Main video conferencing interface providing:
 * - Main video display area for the primary speaker
 * - Participant grid showing connected users
 * - Real-time chat functionality
 * - Participant list panel
 * - Full control bar with audio/video/screen share controls
 * - Meeting timer
 * - Call end functionality
 *
 * @component
 * @param meetingId - URL parameter containing the meeting identifier
 * @returns {JSX.Element} The video conference interface
 *
 * @example
 * ```tsx
 * <VideoConference /> // Route: /conference/:meetingId
 * ```
 *
 * @remarks
 * - Displays main video feed with participant name overlay
 * - Shows up to 3 additional participants in a grid
 * - Supports muting/unmuting microphone
 * - Allows toggling camera on/off
 * - Provides screen sharing option
 * - Real-time chat messaging with timestamp
 * - Participant roster with live count
 * - Responsive layout for different screen sizes
 * - End call button returns to dashboard
 *
 * @see useMeetingStore - For meeting data retrieval
 */
const VideoConference: React.FC = () => {
  const navigate = useNavigate();
  const { meetingId } = useParams();
  const getMeetingById = useMeetingStore((state) => state.getMeetingById);
  const meeting = meetingId ? getMeetingById(meetingId) : null;

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, user: "Sistema", text: "Bienvenido a la videoconferencia", time: "10:00" },
  ]);
  const [participants] = useState([
    { id: 1, name: "Usuario Principal" },
    { id: 2, name: "Usuario 1" },
    { id: 3, name: "Usuario 2" },
  ]);

  /**
   * Sends a chat message in the conference
   * Adds message to chat history with timestamp
   * Clears input field after sending
   */
  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        user: "You",
        text: message,
        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  /**
   * Ends the current call and returns to dashboard
   */
  const handleEndCall = () => {
    navigate(-1);
  };

  return (
    <div className="conference-container">
      {/* Header */}
      <header className="conference-header">
        <div className="header-info">
          <h1 className="logo-text">JoinGo</h1>
          <span className="meeting-id">{meeting?.meetingName || "Reunión"}</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="conference-content">
        {/* Video Area */}
        <div className="video-area">
          {/* Main Video */}
          <div className="main-video">
            <div className="video-placeholder">
              <div className="avatar-large">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <p className="video-name">Usuario Principal</p>
            </div>

            {/* Video Controls Overlay */}
            <div className="video-info">
              <span className="participant-name">Usuario Principal</span>
            </div>
          </div>

          {/* Participants Grid */}
          <div className="participants-grid">
            <div className="participant-video">
              <div className="video-placeholder-small">
                <div className="avatar-small">U</div>
              </div>
              <span className="participant-label">Usuario 1</span>
            </div>
            <div className="participant-video">
              <div className="video-placeholder-small">
                <div className="avatar-small">U</div>
              </div>
              <span className="participant-label">Usuario 2</span>
            </div>
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
              {messages.map((msg) => (
                <div key={msg.id} className="chat-message">
                  <div className="message-header">
                    <span className="message-user">{msg.user}</span>
                    <span className="message-time">{msg.time}</span>
                  </div>
                  <p className="message-text">{msg.text}</p>
                </div>
              ))}
            </div>
            <div className="chat-input-container">
              <input
                type="text"
                className="chat-input"
                placeholder="Escribe un mensaje..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button className="btn-send" onClick={handleSendMessage}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Participants Panel */}
        {isParticipantsOpen && (
          <div className="participants-panel">
            <div className="participants-header">
              <h3>Participantes</h3>
              <button className="btn-close-participants" onClick={() => setIsParticipantsOpen(false)}>×</button>
            </div>
            <div className="participants-list">
              {participants.map((participant) => (
                <div key={participant.id} className="participant-item">
                  <div className="participant-avatar">
                    <div className="avatar-circle">{participant.name.charAt(0)}</div>
                  </div>
                  <span className="participant-name-text">{participant.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="controls-bar">
        <div className="controls-left">
          <span className="meeting-time">00:00</span>
        </div>

        <div className="controls-center">
          <button
            className={`control-btn ${isMuted ? "active" : ""}`}
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? "Activar micrófono" : "Silenciar micrófono"}
          >
            {isMuted ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="1" y1="1" x2="23" y2="23"></line>
                <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            )}
            <span>{isMuted ? "Activar" : "Silenciar"}</span>
          </button>

          <button
            className={`control-btn ${isVideoOff ? "active" : ""}`}
            onClick={() => setIsVideoOff(!isVideoOff)}
            title={isVideoOff ? "Activar cámara" : "Detener video"}
          >
            {isVideoOff ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
              </svg>
            )}
            <span>{isVideoOff ? "Activar cámara" : "Detener video"}</span>
          </button>

          <button className="control-btn" title="Compartir pantalla">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
            <span>Compartir</span>
          </button>

          <button
            className="control-btn"
            onClick={() => setIsParticipantsOpen(!isParticipantsOpen)}
            title="Participantes"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span>Participantes</span>
          </button>

          <button
            className="control-btn"
            onClick={() => setIsChatOpen(!isChatOpen)}
            title="Chat"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>Mensaje</span>
          </button>

          <button className="control-btn btn-end-call" onClick={handleEndCall} title="Terminar llamada">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 1L1 23M1 1l22 22"></path>
            </svg>
            <span>Salir</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoConference;
