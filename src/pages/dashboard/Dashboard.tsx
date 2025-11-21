import React, { useState } from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";
import useMeetingStore from "../../stores/useMeetingStore";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { getUpcomingMeetings, removeMeeting } = useMeetingStore();

  const [menuOpen, setMenuOpen] = useState(false);

  const upcomingMeetings = getUpcomingMeetings();

  const handleDeleteMeeting = (id: string, meetingName: string) => {
    if (window.confirm(`¿Estás seguro de eliminar la reunión "${meetingName}"?`)) {
      removeMeeting(id);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">

      {/* NAVBAR / HEADER */}
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
              src="/assets/images/profile-icon.png"
              alt="Perfil"
              className="profile-icon"
              onClick={() => setMenuOpen(!menuOpen)}
            />

            {menuOpen && (
              <div className="profile-dropdown">
                <button onClick={() => navigate("/profile")}>Perfil</button>
                <button onClick={() => navigate("/settings")}>Configuración</button>
                <button onClick={handleLogout}>Cerrar sesión</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* CONTENIDO DEL DASHBOARD */}
      <main className="dashboard-content">
        <div className="left-content">
            <div className="principal-containers">
                <div>
                    <h2 className="container-title">Reuniones premium  <br />para equipos premium</h2>
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
                        <div
                          className="play-container"
                          onClick={() => navigate(`/conference/${meeting.id}`)}
                          style={{ cursor: "pointer" }}
                        >
                          <img src="assets/images/play.svg" alt="Unirse"></img>
                        </div>
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
        </div>
        <div className="right-content">
            <div className="secundary-container">
                <h2 className="secundary-title">Acciones rápidas</h2>
                    <div className="container-actions" onClick={() => navigate("/schedule-meeting")} style={{ cursor: "pointer" }}>
                        <div className="action">
                            <div className="icon-container"><img src="assets/images/a-camera.svg"></img></div>
                            <h3>Programar videoconferencia</h3>
                            <p>Configurar reunión</p>
                        </div>

                    </div>
                    <div className="container-actions">
                        <div className="action">
                            <div className="icon-container"><img src="assets/images/meeting.svg"></img></div>
                            <h3>Unirse a reunión</h3>
                            <p>Con código o enlace</p>
                        </div>
                    </div>
            </div>
             <div className="secundary-container">
                    <h2 className="secundary-title">Reuniones recientes</h2>

                    <div className="container-actions">
                        <div className="icon-container"></div>

                        <div className="text-container">
                            <h3>Diseño UI/UX Review</h3>
                            <p>Ayer, 3:00 PM</p>
                        </div>
                    </div>

                    <div className="container-actions">
                        <div className="icon-container"></div>

                        <div className="text-container">
                            <h3>Sprint Planning</h3>
                            <p>13 Nov, 10:00 AM</p>
                        </div>
                    </div>
                </div>
        </div>       
            
      </main>
    </div>
  );
};

export default Dashboard;
