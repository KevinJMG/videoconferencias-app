import React from "react";
import "./AboutUs.css";
import { useNavigate } from "react-router-dom";

/**
 * AboutUs Component
 *
 * Displays comprehensive information about JoinGo, including:
 * - Company mission and vision
 * - Key statistics and metrics
 * - Core values and principles
 * - Company history and background
 * - Call-to-action for user registration
 *
 * @component
 * @returns {JSX.Element} The About Us page with full company information
 *
 * @example
 * ```tsx
 * <AboutUs />
 * ```
 *
 * @remarks
 * - Responsive design with mobile and desktop layouts
 * - Navigation back to dashboard via back button
 * - Includes social links and footer information
 */
const AboutUs: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="about-container">
      {/* Header */}
      <header className="about-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Volver
        </button>
        <h1 className="logo-text">JoinGo</h1>
      </header>

      {/* Main Content */}
      <main className="about-content">
        {/* Title */}
        <section className="about-intro">
          <h1 className="about-title">Sobre Nosotros</h1>
          <p className="about-subtitle">
            Nuestra misión es conectar al mundo a través de videoconferencias simples, seguras y de alta calidad.
            Creemos que la comunicación efectiva no debe tener fronteras.
          </p>
        </section>

        {/* Mission and Vision */}
        <section className="mission-vision-grid">
          <div className="mission-card">
            <div className="card-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 className="card-title">Nuestra Misión</h3>
            <p className="card-description">
              Desarrollar la plataforma de videoconferencia más accesible, intuitiva y poderosa del mercado.
              Nuestra plataforma permite que equipos, familias y organizaciones se conecten sin importar dónde estén.
              Creemos en la comunicación.
            </p>
          </div>

          <div className="vision-card">
            <div className="card-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </div>
            <h3 className="card-title">Nuestra Visión</h3>
            <p className="card-description">
              Ser la plataforma de videoconferencia líder en el mundo, reconocida por su confiabilidad y calidad.
              Visualizar y potenciar las herramientas que transforman la comunicación en valor agregado y
              oportunidades de crecimiento en todos los sectores.
            </p>
          </div>
        </section>

        {/* JoinGo by the Numbers */}
        <section className="stats-section">
          <h2 className="section-title">JoinGo en Números</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#155DFC" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="stat-number">1.0M+</h3>
              <p className="stat-label">Usuarios Activos</p>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#155DFC" strokeWidth="2">
                  <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                  <polyline points="2 17 12 22 22 17"></polyline>
                  <polyline points="2 12 12 17 22 12"></polyline>
                </svg>
              </div>
              <h3 className="stat-number">150+</h3>
              <p className="stat-label">Países</p>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#155DFC" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3 className="stat-number">99.9%</h3>
              <p className="stat-label">Disponibilidad</p>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#155DFC" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              </div>
              <h3 className="stat-number">50M+</h3>
              <p className="stat-label">Reuniones Mensuales</p>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="values-section">
          <h2 className="section-title">Nuestros Valores</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#155DFC" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <div className="value-content">
                <h4 className="value-title">Pasión por la Conexión</h4>
                <p className="value-description">
                  Creemos en el valor de conectar equipos de diferentes
                  partes del mundo sin importar la distancia o ubicación.
                </p>
              </div>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#155DFC" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <div className="value-content">
                <h4 className="value-title">Seguridad y Privacidad</h4>
                <p className="value-description">
                  Tu información está protegida con encriptación de extremo a extremo
                  y cumplimos con los más altos estándares de seguridad global.
                </p>
              </div>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#155DFC" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div className="value-content">
                <h4 className="value-title">Innovación Constante</h4>
                <p className="value-description">
                  Nos mantenemos a la vanguardia creando soluciones adaptadas a
                  las últimas tecnologías y cambios.
                </p>
              </div>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#155DFC" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </div>
              <div className="value-content">
                <h4 className="value-title">Accesibilidad Universal</h4>
                <p className="value-description">
                  Nuestra plataforma está diseñada para todos, sin importar
                  dispositivo, ubicación o experiencia técnica.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our History */}
        <section className="history-section">
          <h2 className="section-title">Nuestra Historia</h2>
          <div className="history-content">
            <p>
              JoinGo nació en 2025 con una visión clara: hacer que la comunicación por video
              sea tan simple como presionar un botón. En un mundo cada vez más
              conectado pero físicamente distante, vimos la necesidad de una
              plataforma que combinara tecnología de punta con facilidad de uso sin
              sacrificar la privacidad.
            </p>
            <p>
              Comenzamos como un pequeño equipo de ingenieros de sistemas y
              comunicación, y hoy servimos a millones de usuarios en todo el mundo.
              Nuestro crecimiento se basa en escuchar a nuestros usuarios, mejorar continuamente
              e incorporar nuevas características que realmente hacen una
              diferencia en su vida diaria.
            </p>
            <p>
              Nuestra dedicación a la excelencia, seguridad e innovación nos ha
              llevado a ser reconocidos como uno de los principales proveedores
              de videoconferencias en el mundo, y nos comprometemos a ofrecer
              conexiones de clase mundial a todos.
            </p>
          </div>
        </section>

        {/* Ready to connect? */}
        <section className="cta-section">
          <h2 className="cta-title">¿Listo para conectarte?</h2>
          <p className="cta-text">
            Únete a millones de usuarios que ya confían en JoinGo para sus
            videoconferencias
          </p>
          <button className="cta-button" onClick={() => navigate("/register")}>
            Comenzar Ahora
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="about-footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/dashboard"); }}>Inicio</a>
            <span className="separator">•</span>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/sitemap"); }}>Mapa del Sitio</a>
            <span className="separator">•</span>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/support"); }}>Soporte</a>
          </div>
          <p className="footer-copyright">
            Copyright ©2025 JoinGo Communications, Inc. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
