import React, { useState } from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";
import useMeetingStore from "../../stores/useMeetingStore";

/**
 * Dashboard Component
 *
 * Main dashboard page that displays:
 * - User profile section with logout functionality
 * - Navigation menu
 * - Hero section with quick action buttons
 * - List of upcoming meetings with action buttons (play, edit, delete)
 * - Quick action panels for scheduling and joining meetings
 * - Recent meetings section
 */
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const { getUpcomingMeetings, removeMeeting } = useMeetingStore();

  // Modal state for logout confirmation
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Profile dropdown menu state
  const [menuOpen, setMenuOpen] = useState(false);

  // Retrieve list of upcoming meetings from store
  const upcomingMeetings = getUpcomingMeetings();

  /**
   * Handles meeting deletion with user confirmation
   * Displays a confirmation dialog before removing the meeting
   */
  const handleDeleteMeeting = (id: string, meetingName: string): void => {
    if (window.confirm(`¿Estás seguro de eliminar la reunión "${meetingName}"?`)) {
      removeMeeting(id);
    }
  };

  /**
   * Handles user logout and navigation to login page
   */
  const handleLogout = (): void => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>¿Cerrar sesión?</h3>
            <p>Tu sesión se cerrará y deberás volver a iniciar sesión.</p>

            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setShowLogoutModal(false)}>
                Cancelar
              </button>
              <button className="modal-logout" onClick={handleLogout}>
                Sí, cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-container">
        {/* NAVIGATION HEADER */}
        <header className="dashboard-header">
        <div className="header-left">
          <h1 className="logo-text">JoinGo</h1>

          <nav className="nav-links">
            <a href="/dashboard">Inicio</a>
            <a href="/calendar">Calendario</a>
            <a href="/history">Historial</a>
            <a href="/sitemap">Mapa del sitio</a>
          </nav>
        </div>

        <div className="header-right">
          <div className="profile-section">
            <img
              src={user?.photoURL || "/assets/images/profile-icon.png"}
              alt={user?.displayName || "Perfil"}
              className="profile-icon"
              onClick={() => setMenuOpen(!menuOpen)}
            />

            {menuOpen && (
              <div className="profile-dropdown">
                <button onClick={() => navigate("/profile")}>Perfil</button>
                <button onClick={() => setShowLogoutModal(true)}>Cerrar sesión</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN DASHBOARD CONTENT */}
      <main className="dashboard-content">
        {/* TOP ROW: Hero section and Recent meetings side by side */}
        <div className="top-row">
          {/* HERO SECTION: Welcome card with quick action buttons */}
          <div className="principal-containers">
            <div>
              <h2 className="container-title">Espacio para programar <br />reuniones o unirse a ellas</h2>
              <p className="container-text">Conecta con tu equipo sin límites. Video HD, compartir pantalla y más.</p>
              <div className="buttons-wrapper">
                <button className="container-button" onClick={() => navigate("/schedule-meeting")}>
                  Nueva reunión
                </button>

                <button className="container-button">
                  Unirse con código
                </button>
              </div>
            </div>
            <div className="img-container">
              <img src="assets/images/camara.svg" alt="camara" />
            </div>
          </div>

          {/* RECENT MEETINGS PANEL: Display recent meeting history */}
          <div className="principal-containers meetings-block">
            <h2 className="container-title">Reuniones recientes</h2>

            <div className="container-actions">
              <div className="icon-container">
                <svg width="32" height="32" viewBox="0 0 466 466" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Phone handset */}
                  <path d="M117.2 349.4C130.5 362.7 194.9 427.1 314.9 307.1C435 187.1 370.5 122.6 357.2 109.3C335 87.1 295.1 95.2 280 110.3L260 130.3C250 140.3 245 155.4 250 165.4C260 185.4 280 210.4 310 240.4C340 270.4 365 290.4 385 300.4C395 305.4 410 300.4 420 290.4L440 270.4C455.1 255.3 463.2 215.4 441 193.2C427.7 179.9 363.2 115.4 243.2 235.4C123.2 355.4 57.7 289.9 44.4 276.6" fill="#0099FF"/>

                  {/* Video camera box with play button */}
                  <rect x="246" y="130" width="175" height="140" rx="20" fill="#0055FF"/>
                  <polygon points="315,165 315,215 375,190" fill="white"/>
                  <circle cx="410" cy="175" r="30" fill="#0099FF" opacity="0.3"/>
                </svg>
              </div>

              <div className="text-container">
                <h3>Diseño UI/UX Review</h3>
                <p>Ayer, 3:00 PM</p>
              </div>
            </div>

            <div className="container-actions">
              <div className="icon-container">
                <svg width="32" height="32" viewBox="0 0 466 466" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M117.2 349.4C130.5 362.7 194.9 427.1 314.9 307.1C435 187.1 370.5 122.6 357.2 109.3C335 87.1 295.1 95.2 280 110.3L260 130.3C250 140.3 245 155.4 250 165.4C260 185.4 280 210.4 310 240.4C340 270.4 365 290.4 385 300.4C395 305.4 410 300.4 420 290.4L440 270.4C455.1 255.3 463.2 215.4 441 193.2C427.7 179.9 363.2 115.4 243.2 235.4C123.2 355.4 57.7 289.9 44.4 276.6" fill="#0099FF"/>
                  <rect x="246" y="130" width="175" height="140" rx="20" fill="#0055FF"/>
                  <polygon points="315,165 315,215 375,190" fill="white"/>
                  <circle cx="410" cy="175" r="30" fill="#0099FF" opacity="0.3"/>
                </svg>
              </div>

              <div className="text-container">
                <h3>Sprint Planning</h3>
                <p>13 Nov, 10:00 AM</p>
              </div>
            </div>

            <div className="container-actions">
              <div className="icon-container">
                <svg width="32" height="32" viewBox="0 0 466 466" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M117.2 349.4C130.5 362.7 194.9 427.1 314.9 307.1C435 187.1 370.5 122.6 357.2 109.3C335 87.1 295.1 95.2 280 110.3L260 130.3C250 140.3 245 155.4 250 165.4C260 185.4 280 210.4 310 240.4C340 270.4 365 290.4 385 300.4C395 305.4 410 300.4 420 290.4L440 270.4C455.1 255.3 463.2 215.4 441 193.2C427.7 179.9 363.2 115.4 243.2 235.4C123.2 355.4 57.7 289.9 44.4 276.6" fill="#0099FF"/>
                  <rect x="246" y="130" width="175" height="140" rx="20" fill="#0055FF"/>
                  <polygon points="315,165 315,215 375,190" fill="white"/>
                  <circle cx="410" cy="175" r="30" fill="#0099FF" opacity="0.3"/>
                </svg>
              </div>

              <div className="text-container">
                <h3>Team Standup</h3>
                <p>12 Nov, 9:00 AM</p>
              </div>
            </div>

            <div className="container-actions">
              <div className="icon-container">
                <svg width="32" height="32" viewBox="0 0 466 466" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M117.2 349.4C130.5 362.7 194.9 427.1 314.9 307.1C435 187.1 370.5 122.6 357.2 109.3C335 87.1 295.1 95.2 280 110.3L260 130.3C250 140.3 245 155.4 250 165.4C260 185.4 280 210.4 310 240.4C340 270.4 365 290.4 385 300.4C395 305.4 410 300.4 420 290.4L440 270.4C455.1 255.3 463.2 215.4 441 193.2C427.7 179.9 363.2 115.4 243.2 235.4C123.2 355.4 57.7 289.9 44.4 276.6" fill="#0099FF"/>
                  <rect x="246" y="130" width="175" height="140" rx="20" fill="#0055FF"/>
                  <polygon points="315,165 315,215 375,190" fill="white"/>
                  <circle cx="410" cy="175" r="30" fill="#0099FF" opacity="0.3"/>
                </svg>
              </div>

              <div className="text-container">
                <h3>Project Review</h3>
                <p>10 Nov, 2:30 PM</p>
              </div>
            </div>

            <div className="container-actions">
              <div className="icon-container">
                <svg width="32" height="32" viewBox="0 0 466 466" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M117.2 349.4C130.5 362.7 194.9 427.1 314.9 307.1C435 187.1 370.5 122.6 357.2 109.3C335 87.1 295.1 95.2 280 110.3L260 130.3C250 140.3 245 155.4 250 165.4C260 185.4 280 210.4 310 240.4C340 270.4 365 290.4 385 300.4C395 305.4 410 300.4 420 290.4L440 270.4C455.1 255.3 463.2 215.4 441 193.2C427.7 179.9 363.2 115.4 243.2 235.4C123.2 355.4 57.7 289.9 44.4 276.6" fill="#0099FF"/>
                  <rect x="246" y="130" width="175" height="140" rx="20" fill="#0055FF"/>
                  <polygon points="315,165 315,215 375,190" fill="white"/>
                  <circle cx="410" cy="175" r="30" fill="#0099FF" opacity="0.3"/>
                </svg>
              </div>

              <div className="text-container">
                <h3>Client Meeting</h3>
                <p>9 Nov, 11:00 AM</p>
              </div>
            </div>

            <div className="container-actions">
              <div className="icon-container">
                <svg width="32" height="32" viewBox="0 0 466 466" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M117.2 349.4C130.5 362.7 194.9 427.1 314.9 307.1C435 187.1 370.5 122.6 357.2 109.3C335 87.1 295.1 95.2 280 110.3L260 130.3C250 140.3 245 155.4 250 165.4C260 185.4 280 210.4 310 240.4C340 270.4 365 290.4 385 300.4C395 305.4 410 300.4 420 290.4L440 270.4C455.1 255.3 463.2 215.4 441 193.2C427.7 179.9 363.2 115.4 243.2 235.4C123.2 355.4 57.7 289.9 44.4 276.6" fill="#0099FF"/>
                  <rect x="246" y="130" width="175" height="140" rx="20" fill="#0055FF"/>
                  <polygon points="315,165 315,215 375,190" fill="white"/>
                  <circle cx="410" cy="175" r="30" fill="#0099FF" opacity="0.3"/>
                </svg>
              </div>

              <div className="text-container">
                <h3>Weekly Sync</h3>
                <p>8 Nov, 2:00 PM</p>
              </div>
            </div>

            <div className="container-actions">
              <div className="icon-container">
                <svg width="32" height="32" viewBox="0 0 466 466" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M117.2 349.4C130.5 362.7 194.9 427.1 314.9 307.1C435 187.1 370.5 122.6 357.2 109.3C335 87.1 295.1 95.2 280 110.3L260 130.3C250 140.3 245 155.4 250 165.4C260 185.4 280 210.4 310 240.4C340 270.4 365 290.4 385 300.4C395 305.4 410 300.4 420 290.4L440 270.4C455.1 255.3 463.2 215.4 441 193.2C427.7 179.9 363.2 115.4 243.2 235.4C123.2 355.4 57.7 289.9 44.4 276.6" fill="#0099FF"/>
                  <rect x="246" y="130" width="175" height="140" rx="20" fill="#0055FF"/>
                  <polygon points="315,165 315,215 375,190" fill="white"/>
                  <circle cx="410" cy="175" r="30" fill="#0099FF" opacity="0.3"/>
                </svg>
              </div>

              <div className="text-container">
                <h3>Budget Planning</h3>
                <p>6 Nov, 4:30 PM</p>
              </div>
            </div>

            <div className="container-actions">
              <div className="icon-container">
                <svg width="32" height="32" viewBox="0 0 466 466" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M117.2 349.4C130.5 362.7 194.9 427.1 314.9 307.1C435 187.1 370.5 122.6 357.2 109.3C335 87.1 295.1 95.2 280 110.3L260 130.3C250 140.3 245 155.4 250 165.4C260 185.4 280 210.4 310 240.4C340 270.4 365 290.4 385 300.4C395 305.4 410 300.4 420 290.4L440 270.4C455.1 255.3 463.2 215.4 441 193.2C427.7 179.9 363.2 115.4 243.2 235.4C123.2 355.4 57.7 289.9 44.4 276.6" fill="#0099FF"/>
                  <rect x="246" y="130" width="175" height="140" rx="20" fill="#0055FF"/>
                  <polygon points="315,165 315,215 375,190" fill="white"/>
                  <circle cx="410" cy="175" r="30" fill="#0099FF" opacity="0.3"/>
                </svg>
              </div>

              <div className="text-container">
                <h3>Training Session</h3>
                <p>4 Nov, 1:00 PM</p>
              </div>
            </div>

            <div className="container-actions">
              <div className="icon-container">
                <svg width="32" height="32" viewBox="0 0 466 466" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M117.2 349.4C130.5 362.7 194.9 427.1 314.9 307.1C435 187.1 370.5 122.6 357.2 109.3C335 87.1 295.1 95.2 280 110.3L260 130.3C250 140.3 245 155.4 250 165.4C260 185.4 280 210.4 310 240.4C340 270.4 365 290.4 385 300.4C395 305.4 410 300.4 420 290.4L440 270.4C455.1 255.3 463.2 215.4 441 193.2C427.7 179.9 363.2 115.4 243.2 235.4C123.2 355.4 57.7 289.9 44.4 276.6" fill="#0099FF"/>
                  <rect x="246" y="130" width="175" height="140" rx="20" fill="#0055FF"/>
                  <polygon points="315,165 315,215 375,190" fill="white"/>
                  <circle cx="410" cy="175" r="30" fill="#0099FF" opacity="0.3"/>
                </svg>
              </div>

              <div className="text-container">
                <h3>Performance Review</h3>
                <p>1 Nov, 3:30 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: Upcoming meetings */}
        <div className="principal-containers meetings-block">
          <h2 className="container-title">Próximas reuniones</h2>
          {upcomingMeetings.length === 0 ? (
            <div className="no-meetings">
              <p>No hay reuniones programadas</p>
            </div>
          ) : (
            upcomingMeetings.slice(0, 10).map((meeting) => (
              <div key={meeting.id} className="meets-container">
                <div className="meeting-info">
                  <h3 className="meeting-title">{meeting.meetingName}</h3>
                  <p className="meeting-text">
                    {meeting.startTime} - {meeting.endTime || "Sin hora de cierre"}
                  </p>
                </div>
                <div className="meeting-actions">
                  {/* Join meeting button */}
                  <div
                    className="play-container"
                    onClick={() => navigate(`/conference/${meeting.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <img src="assets/images/play.svg" alt="Unirse"></img>
                  </div>

                  {/* Edit meeting button */}
                  <button
                    className="edit-meeting-btn"
                    onClick={() => navigate(`/edit-meeting/${meeting.id}`)}
                    title="Editar reunión"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>

                  {/* Delete meeting button */}
                  <button
                    className="delete-meeting-btn"
                    onClick={() => handleDeleteMeeting(meeting.id, meeting.meetingName)}
                    title="Eliminar reunión"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
   </>
  );
};

export default Dashboard;