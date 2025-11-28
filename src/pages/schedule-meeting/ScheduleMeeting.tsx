import React, { useState } from "react";
import "./ScheduleMeeting.css";
import { useNavigate } from "react-router-dom";
import useMeetingStore from "../../stores/useMeetingStore";

/**
 * ScheduleMeeting Component
 *
 * Provides interface for creating new scheduled video meetings with:
 * - Meeting name and description
 * - Date and time selection (with AM/PM format)
 * - Participant email list management
 * - Meeting settings configuration
 * - Form validation and error handling
 * - Responsive design for mobile and desktop
 *
 * @component
 * @returns {JSX.Element} The meeting scheduling form
 *
 * @example
 * <ScheduleMeeting />
 *
 * @remarks
 * - Validates meeting name, date, and time
 * - Prevents scheduling meetings in the past
 * - Ensures end time is after start time
 * - Supports adding/removing multiple participants
 * - Stores meeting data in meeting store on submission
 *
 * @see useMeetingStore - For meeting data persistence
 */
const ScheduleMeeting: React.FC = () => {
  const navigate = useNavigate();
  const { addMeeting } = useMeetingStore();

  const [meetingName, setMeetingName] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");

  const [participants, setParticipants] = useState<string[]>([]);
  const [participantEmail, setParticipantEmail] = useState("");

  const [settings] = useState({
    waitingRoom: true,
    screenSharing: true,
    privateRoom: false,
    chat: true,
    requirePassword: false,
  });

  /**
   * Adds a participant email to the meeting
   * Validates that email is not empty and not already added
   */
  const handleAddParticipant = () => {
    if (participantEmail && !participants.includes(participantEmail)) {
      setParticipants([...participants, participantEmail]);
      setParticipantEmail("");
    }
  };

  /**
   * Removes a participant email from the meeting
   * @param email - The email address to remove
   */
  const handleRemoveParticipant = (email: string) => {
    setParticipants(participants.filter((p) => p !== email));
  };

  // --- Convert 12h to 24h ---
  const convertTo24h = (h: string): string => {
    const hour = parseInt(h);
    return hour === 12 ? "00" : String(hour).padStart(2, "0");
  };

  const convertTo24hPM = (h: string): string => {
    const hour = parseInt(h);
    return hour === 12 ? "12" : String(hour + 12).padStart(2, "0");
  };

  // --- Generate time options with AM/PM included ---
  const generateTimeOptions = () => {
    const options = [];
    for (let h = 1; h <= 12; h++) {
      for (const m of [0, 15, 30, 45]) {
        const hourStr = String(h).padStart(2, "0");
        const minStr = String(m).padStart(2, "0");
        options.push({
          value: `${h}-${m}-AM`,
          label: `${hourStr}:${minStr} a.m.`,
          hour: h,
          minute: m,
          isPM: false,
        });
      }
    }
    for (let h = 1; h <= 12; h++) {
      for (const m of [0, 15, 30, 45]) {
        const hourStr = String(h).padStart(2, "0");
        const minStr = String(m).padStart(2, "0");
        options.push({
          value: `${h}-${m}-PM`,
          label: `${hourStr}:${minStr} p.m.`,
          hour: h,
          minute: m,
          isPM: true,
        });
      }
    }
    return options;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSubmit = () => {
    setError("");

    if (!meetingName.trim()) {
      setError("Por favor ingresa el nombre de la reunión");
      return;
    }
    if (!date) {
      setError("Por favor selecciona una fecha");
      return;
    }
    if (!startTime) {
      setError("Por favor selecciona la hora de inicio");
      return;
    }
    if (!endTime) {
      setError("Por favor selecciona la hora de cierre");
      return;
    }

    // --- Validate date and time ---
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0];

    const [startH, startM, startPeriod] = startTime.split("-");
    const [endH, endM, endPeriod] = endTime.split("-");

    const startHour24 = startPeriod === "PM" ? convertTo24hPM(startH) : convertTo24h(startH);
    const endHour24 = endPeriod === "PM" ? convertTo24hPM(endH) : convertTo24h(endH);

    const startTimeStr = `${startHour24}:${String(startM).padStart(2, "0")}`;
    const endTimeStr = `${endHour24}:${String(endM).padStart(2, "0")}`;

    const startDateTime = new Date(`${date}T${startTimeStr}`);
    const endDateTime = new Date(`${date}T${endTimeStr}`);

    const isDatePast = date.localeCompare(currentDate) < 0;
    const isStartTimeInvalid = startDateTime < now;
    const isEndTimeInvalid = endDateTime < now;
    const isEndBeforeStart = endTimeStr <= startTimeStr;

    if (isDatePast && (isStartTimeInvalid || isEndTimeInvalid)) {
      setError("Fecha y hora inválidas");
      return;
    }
    if (isDatePast) {
      setError("Fecha inválida");
      return;
    }
    if (isStartTimeInvalid) {
      setError("Hora inválida");
      return;
    }
    if (isEndTimeInvalid) {
      setError("Hora inválida");
      return;
    }
    if (isEndBeforeStart) {
      setError("Hora inválida");
      return;
    }

    // --- Add meeting to store ---
    addMeeting({
      meetingName,
      description: "",
      date,
      startTime: startTimeStr,
      endTime: endTimeStr,
      duration: "",
      participants,
      settings,
    });

    // --- Redirect to dashboard ---
    navigate("/dashboard");
  };

  return (
    <div className="schedule-container">
      <header className="schedule-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </button>
        <h1 className="logo-text">JoinGo</h1>
      </header>

      <main className="schedule-content">
        <div className="schedule-card">
          <h2 className="schedule-title">Programar Reunión</h2>

          <div className="form-group">
            <label>Nombre de la reunión *</label>
            <input
              type="text"
              placeholder="Ej. Reunión de equipo"
              value={meetingName}
              onChange={(e) => setMeetingName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Fecha *</label>
            <input type="date" value={date} onChange={handleDateChange} />
          </div>

          <div className="form-group">
            <label>Hora de inicio *</label>
            <select value={startTime} onChange={(e) => setStartTime(e.target.value)} className="time-select">
              <option value="">Seleccionar hora</option>
              {generateTimeOptions().map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Hora de cierre *</label>
            <select value={endTime} onChange={(e) => setEndTime(e.target.value)} className="time-select">
              <option value="">Seleccionar hora</option>
              {generateTimeOptions().map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="participants-section">
            <h3 className="section-title">Invitar participantes</h3>
            <div className="participants-input">
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={participantEmail}
                onChange={(e) => setParticipantEmail(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddParticipant()}
              />
              <button type="button" className="add-button" onClick={handleAddParticipant}>
                Agregar
              </button>
            </div>
            {participants.length > 0 && (
              <div className="participants-list">
                {participants.map((email) => (
                  <div key={email} className="participant-item">
                    <span className="participant-email">{email}</span>
                    <button type="button" className="remove-button" onClick={() => handleRemoveParticipant(email)}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="action-buttons">
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Cancelar
            </button>
            <button type="button" className="btn-submit" onClick={handleSubmit}>
              Programar Reunión
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ScheduleMeeting;
