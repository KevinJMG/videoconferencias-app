import React, { useState } from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const [menuOpen, setMenuOpen] = useState(false);

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
            <a href="/mapa">Mapa del sitio</a>
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
                        <button className="container-button">
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
                <h2 className="container-title">Proximas reuniones</h2>
                <div className="meets-container">
                    <h3 className="meeting-title">Team Sync - Q4 Strategy</h3>
                    <p className="meeting-text">10:00 AM - 11:00 AM</p>
                    <div className="play-container">
                        <img src="assets/images/play.svg"></img>
                    </div>
                </div>
                 <div className="meets-container">
                    <h3 className="meeting-title">Team Sync - Q6 Strategy</h3>
                    <p className="meeting-text">16:00 PM - 18:00 PM</p>
                    <div className="play-container">
                        <img src="assets/images/play.svg"></img>
                    </div>
                </div>
            </div>
        </div>
        <div className="right-content">
            <div className="secundary-container">
                <h2 className="secundary-title">Acciones rápidas</h2>
                    <div className="container-actions">
                        <div className="action">
                            <div className="icon-container"><img src="assets/images/a-camera.svg"></img></div>
                            <h3>Iniciar reunión instantánea</h3>
                            <p>Sin programar</p>
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
