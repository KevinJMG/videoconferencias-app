import React, { useState } from "react";
import "./ScheduleMeeting.css";
import { useNavigate } from "react-router-dom";
import useMeetingStore from "../../stores/useMeetingStore";

const ScheduleMeeting: React.FC = () => {
  const navigate = useNavigate();
  const { addMeeting } = useMeetingStore();

  const [formData, setFormData] = useState({
    meetingName: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    duration: "",
  });

  const [participants, setParticipants] = useState<string[]>([]);
  const [participantEmail, setParticipantEmail] = useState("");

  const [settings, setSettings] = useState({
    waitingRoom: true,
    screenSharing: true,
    privateRoom: true,
    chat: true,
    requirePassword: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddParticipant = () => {
    if (participantEmail && !participants.includes(participantEmail)) {
      setParticipants([...participants, participantEmail]);
      setParticipantEmail("");
    }
  };

  const handleRemoveParticipant = (email: string) => {
    setParticipants(participants.filter((p) => p !== email));
  };

  const handleToggleSetting = (setting: keyof typeof settings) => {
    setSettings({ ...settings, [setting]: !settings[setting] });
  };

  const handleSubmit = () => {
    // Validar que al menos tenga nombre y fecha
    if (!formData.meetingName.trim()) {
      alert("Por favor ingresa el tema de la reunión");
      return;
    }

    if (!formData.date) {
      alert("Por favor selecciona una fecha");
      return;
    }

    if (!formData.startTime) {
      alert("Por favor selecciona una hora de inicio");
      return;
    }

    // Guardar la reunión
    addMeeting({
      meetingName: formData.meetingName,
      description: formData.description,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      duration: formData.duration,
      participants: participants,
      settings: settings,
    });

    // Navegar al dashboard
    navigate("/dashboard");
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <div className="schedule-container">
      <header className="schedule-header">
        <button className="back-button" onClick={() => navigate("/dashboard")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </button>
        <h1 className="logo-text">JoinGo</h1>
      </header>

      <main className="schedule-content">
        <h2 className="schedule-title">Programar Videoconferencia</h2>
        <p className="schedule-subtitle">Configura los detalles de tu próxima reunión</p>

        <div className="schedule-grid">
          {/* Vista Previa */}
          <div className="preview-section">
            <div className="preview-card">
              <div className="preview-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
                  <polyline points="17 2 12 7 7 2"></polyline>
                </svg>
              </div>
              <h3 className="preview-title">Vista Previa</h3>
              <div className="preview-info">
                <p className="preview-label">Tema:</p>
                <p className="preview-value">{formData.meetingName || "Sin título"}</p>
              </div>
              <div className="preview-info">
                <p className="preview-label">Fecha:</p>
                <p className="preview-value">{formData.date || "Sin fecha"}</p>
              </div>
              <div className="preview-info">
                <p className="preview-label">Hora:</p>
                <p className="preview-value">
                  {formData.startTime && formData.endTime
                    ? `${formData.startTime} - ${formData.endTime}`
                    : "Sin hora"}
                </p>
              </div>
              <div className="preview-info">
                <p className="preview-label">Sala de espera:</p>
                <p className="preview-value">{settings.waitingRoom ? "Habilitada" : "Deshabilitada"}</p>
              </div>
              <div className="preview-info">
                <p className="preview-label">Chat:</p>
                <p className="preview-value">{settings.chat ? "Habilitado" : "Deshabilitado"}</p>
              </div>
            </div>
          </div>

          {/* Información Básica */}
          <div className="form-section">
            <div className="form-card">
              <div className="form-header">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#155DFC" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <h3>Información Básica</h3>
              </div>

              <div className="form-group">
                <label>¿Cuál es el tema? *</label>
                <input
                  type="text"
                  name="meetingName"
                  placeholder="Ej. Reunión de equipo semanal"
                  value={formData.meetingName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Descripción (opcional)</label>
                <textarea
                  name="description"
                  placeholder="Agenda, temas a tratar, objetivos..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fecha</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Hora de inicio</label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Duración</label>
                  <input
                    type="text"
                    name="duration"
                    placeholder="Ej. 1 hora"
                    value={formData.duration}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Hora de cierre</label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Participantes */}
            <div className="form-card">
              <div className="form-header">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#155DFC" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <h3>Participantes</h3>
              </div>

              <div className="participants-input">
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={participantEmail}
                  onChange={(e) => setParticipantEmail(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddParticipant()}
                />
                <button type="button" className="add-button" onClick={handleAddParticipant}>
                  + Añadir
                </button>
              </div>

              <div className="participants-list">
                {participants.length === 0 ? (
                  <p className="no-participants">Aún no se añadió ningún invitado.</p>
                ) : (
                  participants.map((email) => (
                    <div key={email} className="participant-item">
                      <div className="participant-avatar">{email.charAt(0).toUpperCase()}</div>
                      <span className="participant-email">{email}</span>
                      <button
                        type="button"
                        className="remove-button"
                        onClick={() => handleRemoveParticipant(email)}
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Configuración de la Reunión */}
            <div className="form-card">
              <div className="form-header">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#155DFC" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3"></path>
                </svg>
                <h3>Configuración de la Reunión</h3>
              </div>

              <div className="settings-list">
                <div className="setting-item">
                  <div className="setting-info">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="9" y1="3" x2="9" y2="21"></line>
                    </svg>
                    <div>
                      <p className="setting-title">Habilitar sala de espera</p>
                      <p className="setting-description">Los participantes esperarán tu aprobación</p>
                    </div>
                  </div>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={settings.waitingRoom}
                      onChange={() => handleToggleSetting("waitingRoom")}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <circle cx="12" cy="12" r="4"></circle>
                      <line x1="21.17" y1="8" x2="12" y2="8"></line>
                      <line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
                      <line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
                    </svg>
                    <div>
                      <p className="setting-title">Silenciar al entrar</p>
                      <p className="setting-description">Los participantes entrarán en mudo</p>
                    </div>
                  </div>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={settings.recording}
                      onChange={() => handleToggleSetting("recording")}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                      <line x1="12" y1="18" x2="12.01" y2="18"></line>
                    </svg>
                    <div>
                      <p className="setting-title">Compartir pantalla</p>
                      <p className="setting-description">Permitir a todos la compartir su pantalla</p>
                    </div>
                  </div>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={settings.privateRoom}
                      onChange={() => handleToggleSetting("privateRoom")}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <div>
                      <p className="setting-title">Habilitar chat</p>
                      <p className="setting-description">Que el panel de texto se muestre</p>
                    </div>
                  </div>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={settings.chat}
                      onChange={() => handleToggleSetting("chat")}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    <div>
                      <p className="setting-title">Requerir contraseña</p>
                      <p className="setting-description">Proteger la reunión con una contraseña</p>
                    </div>
                  </div>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={settings.requirePassword}
                      onChange={() => handleToggleSetting("requirePassword")}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>

            {/* Opciones Avanzadas */}
            <div className="form-card advanced-options">
              <div className="form-header">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#155DFC" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
                <h3>Opciones Avanzadas</h3>
              </div>
              <div className="advanced-content">
                <p className="advanced-note">⚠️ Esta sección aún no contiene opciones adicionales</p>
                <ul className="advanced-list">
                  <li>• Sala de espera</li>
                  <li>• Horario</li>
                  <li>• Privacidad</li>
                </ul>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="action-buttons">
              <button type="button" className="btn-cancel" onClick={handleCancel}>
                Cancelar
              </button>
              <button type="button" className="btn-submit" onClick={handleSubmit}>
                Programar Reunión
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ScheduleMeeting;
