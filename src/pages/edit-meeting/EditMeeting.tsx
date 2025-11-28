import React, { useState, useEffect } from "react";
import "../schedule-meeting/ScheduleMeeting.css";
import { useNavigate, useParams } from "react-router-dom";
import useMeetingStore from "../../stores/useMeetingStore";

/**
 * EditMeeting Component
 *
 * Allows users to edit existing scheduled video meetings with:
 * - Meeting name modification
 * - Date and time updates (with AM/PM format)
 * - Participant list management
 * - Meeting settings configuration
 * - Form validation and error handling
 * - Responsive design for mobile and desktop
 *
 * @component
 * @param meetingId - URL parameter containing the unique meeting identifier
 * @returns {JSX.Element} The meeting editing form
 *
 * @example
 * ```tsx
 * <EditMeeting /> // Route: /edit-meeting/:meetingId
 * ```
 *
 * @remarks
 * - Loads existing meeting data on component mount
 * - Converts 24-hour time format to 12-hour AM/PM display
 * - Validates meeting details before saving
 * - Prevents scheduling in the past or with invalid times
 * - Redirects to dashboard if meeting not found
 *
 * @see useMeetingStore - For meeting data retrieval and updates
 */
const EditMeeting: React.FC = () => {
  const navigate = useNavigate();
  const { meetingId } = useParams<{ meetingId: string }>();
  const { getMeetingById, updateMeeting } = useMeetingStore();

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
   * Loads meeting data from store on component mount
   * Converts stored 24-hour times to 12-hour AM/PM format for display
   * Redirects to dashboard if meeting ID is invalid or not found
   */
  useEffect(() => {
    if (!meetingId) {
      navigate("/dashboard");
      return;
    }

    const meeting = getMeetingById(meetingId);
    if (!meeting) {
      navigate("/dashboard");
      return;
    }

    setMeetingName(meeting.meetingName);
    setDate(meeting.date);
    setParticipants(meeting.participants);

    // Convert startTime from 24h to format with options (h-m-AM/PM)
    const [startHour, startMinute] = meeting.startTime.split(':');
    const startHourNum = parseInt(startHour);
    const isPMStart = startHourNum >= 12;
    const display12HourStart = startHourNum === 0 ? 12 : startHourNum > 12 ? startHourNum - 12 : startHourNum;
    setStartTime(`${display12HourStart}-${startMinute}-${isPMStart ? 'PM' : 'AM'}`);

    // Convert endTime from 24h to format with options (h-m-AM/PM)
    const [endHour, endMinute] = meeting.endTime.split(':');
    const endHourNum = parseInt(endHour);
    const isPMEnd = endHourNum >= 12;
    const display12HourEnd = endHourNum === 0 ? 12 : endHourNum > 12 ? endHourNum - 12 : endHourNum;
    setEndTime(`${display12HourEnd}-${endMinute}-${isPMEnd ? 'PM' : 'AM'}`);
  }, [meetingId, getMeetingById, navigate]);

  const handleAddParticipant = () => {
    if (participantEmail && !participants.includes(participantEmail)) {
      setParticipants([...participants, participantEmail]);
      setParticipantEmail("");
    }
  };

  const handleRemoveParticipant = (email: string) => {
    setParticipants(participants.filter((p) => p !== email));
  };

  const convertTo24h = (h: string): string => {
    const hour = parseInt(h);
    if (hour === 12) return "00";
    return String(hour).padStart(2, '0');
  };

  const convertTo24hPM = (h: string): string => {
    const hour = parseInt(h);
    if (hour === 12) return "12";
    return String(hour + 12).padStart(2, '0');
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let h = 1; h <= 12; h++) {
      for (const m of [0, 15, 30, 45]) {
        const hourStr = String(h).padStart(2, '0');
        const minStr = String(m).padStart(2, '0');
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
        const hourStr = String(h).padStart(2, '0');
        const minStr = String(m).padStart(2, '0');
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

    // Validate date and time
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];

    // Parse times
    const [startH, startM, startPeriod] = startTime.split('-');
    const [endH, endM, endPeriod] = endTime.split('-');

    const startHour24 = startPeriod === 'PM' ? convertTo24hPM(startH) : convertTo24h(startH);
    const endHour24 = endPeriod === 'PM' ? convertTo24hPM(endH) : convertTo24h(endH);

    const startTimeStr = `${startHour24}:${String(startM).padStart(2, '0')}`;
    const endTimeStr = `${endHour24}:${String(endM).padStart(2, '0')}`;

    const dateFormatted = date;

    const startDateTime = new Date(`${dateFormatted}T${startTimeStr}`);
    const endDateTime = new Date(`${dateFormatted}T${endTimeStr}`);

    // Detect errors
    const isDatePast = dateFormatted.localeCompare(currentDate) < 0;
    const isStartTimeInvalid = startDateTime < now;
    const isEndTimeInvalid = endDateTime < now;
    const isEndBeforeStart = endTimeStr <= startTimeStr;

    // Show appropriate error based on cases
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

    if (!meetingId) return;

    updateMeeting(meetingId, {
      meetingName: meetingName,
      description: "",
      date: date,
      startTime: startTimeStr,
      endTime: endTimeStr,
      duration: "",
      participants: participants,
      settings: settings,
    });

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
        <div className="schedule-card">
          <h2 className="schedule-title">Editar Reunión</h2>

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
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Hora de inicio *</label>
            <select
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="time-select"
              style={{ width: '100%' }}
            >
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
            <select
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="time-select"
              style={{ width: '100%' }}
            >
              <option value="">Seleccionar hora</option>
              {generateTimeOptions().map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Participants */}
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
                    <button
                      type="button"
                      className="remove-button"
                      onClick={() => handleRemoveParticipant(email)}
                    >
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
              Guardar Cambios
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditMeeting;
