import React, { useState, useEffect, useRef, useCallback } from "react";
import "./VideoConference.css";
import { useNavigate, useParams } from "react-router-dom";
import useMeetingStore from "../../stores/useMeetingStore";
import ChatPanel from "../../components/chat/ChatPanel";
import { startVoiceChat, stopVoiceChat, setMicrophoneEnabled } from "../../utils/webRtc";

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
  const [participants] = useState([
    { id: 1, name: "Usuario Principal" },
    { id: 2, name: "Usuario 1" },
    { id: 3, name: "Usuario 2" },
  ]);
  const [voiceReady, setVoiceReady] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Record<string, MediaStream>>({});
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const localAudioRef = useRef<HTMLAudioElement | null>(null);

  const handleRemoteStream = useCallback((peerId: string, stream: MediaStream) => {
    setRemoteStreams((prev) => ({ ...prev, [peerId]: stream }));
  }, []);

  const handlePeerLeft = useCallback((peerId: string) => {
    setRemoteStreams((prev) => {
      if (!prev[peerId]) return prev;
      const copy = { ...prev };
      delete copy[peerId];
      return copy;
    });
  }, []);

  useEffect(() => {
    // If a meetingId is present (user joined by code), open chat panel by default
    if (meetingId) setIsChatOpen(true);
  }, [meetingId]);

  useEffect(() => {
    if (!meetingId) return undefined;
    setVoiceError(null);
    let cleanup: (() => void) | null = null;
    let cancelled = false;

    startVoiceChat(meetingId, {
      onRemoteStream: handleRemoteStream,
      onPeerLeft: handlePeerLeft
    })
      .then(({ stop, localStream: stream }) => {
        if (cancelled) {
          stop();
          return;
        }
        cleanup = stop;
        setVoiceReady(true);
        setLocalStream(stream);
        if (localAudioRef.current) {
          localAudioRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error("Voice chat initialization failed", err);
        setVoiceError("Unable to start voice channel. Check microphone permissions or reload the page.");
      });

    return () => {
      cancelled = true;
      cleanup?.();
      stopVoiceChat();
      setVoiceReady(false);
      setLocalStream(null);
      setRemoteStreams({});
    };
  }, [meetingId, handlePeerLeft, handleRemoteStream]);

  useEffect(() => {
    setMicrophoneEnabled(!isMuted);
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !isMuted;
      });
    }
  }, [isMuted, localStream]);

  const remotePeerCount = Object.keys(remoteStreams).length;

  // Chat messages are handled by the `ChatPanel` component and the global store.
  // Local optimistic message state was removed to avoid duplication and unused-symbol
  // TypeScript errors. Use the chat store or `ChatPanel`'s API to send messages.

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
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div>
              <div className="meeting-id">{meeting?.meetingName || "Reunión"}</div>
              <div style={{ color: '#bbb', fontSize: 12, marginTop: 6 }}>
                ID: <strong style={{ color: '#fff' }}>{meetingId || '—'}</strong>
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontSize: 11,
                  padding: '4px 8px',
                  borderRadius: 999,
                  color: '#fff',
                  backgroundColor: voiceError ? '#7f1d1d' : voiceReady ? '#166534' : '#1d4ed8'
                }}
              >
                {voiceError || (voiceReady ? 'Voice channel connected' : 'Connecting voice channel…')}
              </div>
            </div>
            <button
              className="btn-copy-meeting"
              onClick={async () => {
                if (!meetingId) return;
                try {
                  await navigator.clipboard.writeText(meetingId);
                } catch (e) {
                  // fallback
                  const el = document.createElement('textarea');
                  el.value = meetingId;
                  document.body.appendChild(el);
                  el.select();
                  document.execCommand('copy');
                  document.body.removeChild(el);
                }
              }}
              title="Copiar ID de la reunión"
            >
              Copiar ID
            </button>
          </div>
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
              <span className="participant-name" style={{ fontSize: 12 }}>
                Voice peers: {remotePeerCount + 1}
              </span>
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

        {/* Chat Panel (integrated) */}
        {isChatOpen && <ChatPanel meetingId={meetingId} />}

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
      {voiceError && (
        <div style={{
          margin: '12px auto',
          padding: '8px 12px',
          backgroundColor: '#7f1d1d',
          color: '#fff',
          borderRadius: 8,
          maxWidth: 600,
          textAlign: 'center'
        }}>
          {voiceError}
        </div>
      )}
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
      <audio ref={localAudioRef} autoPlay muted playsInline style={{ display: "none" }} />
      {Object.entries(remoteStreams).map(([peerId, stream]) => (
        <RemoteAudio key={peerId} peerId={peerId} stream={stream} />
      ))}
    </div>
  );
};

  const RemoteAudio: React.FC<{ peerId: string; stream: MediaStream }> = ({ peerId, stream }) => {
    const ref = useRef<HTMLAudioElement | null>(null);
    useEffect(() => {
      if (ref.current) {
        ref.current.srcObject = stream;
      }
    }, [stream]);
    return <audio ref={ref} data-peer-id={peerId} autoPlay playsInline style={{ display: "none" }} />;
  };

  export default VideoConference;
