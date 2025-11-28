import React from "react";
import "./SiteMap.css";
import { useNavigate } from "react-router-dom";

/**
 * SiteMap Component
 *
 * Provides comprehensive navigation structure for the application with:
 * - Organized sections for all major features and pages
 * - Quick access to account and support resources
 * - Contact information (email, phone, live chat)
 * - Social media links
 * - Legal and company information
 * - Help and suggestion section
 *
 * @component
 * @returns {JSX.Element} The site map with organized navigation
 *
 * @example
 * ```tsx
 * <SiteMap />
 * ```
 *
 * @remarks
 * - Categorizes site content into logical sections:
 *   - Principal (Home, Features, Plans, Downloads)
 *   - Meetings (New, Join, Schedule, Recordings)
 *   - Account (Login, Register, Profile, Settings)
 *   - Support (Help Center, FAQ, Tutorials, Contact)
 *   - Company (About, Blog, Careers, Press)
 *   - Legal (Terms, Privacy, Cookies, Security)
 * - Includes contact options: Email, Phone, Live Chat
 * - Social media integration
 * - Responsive design for all devices
 */
const SiteMap: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="sitemap-container">
      {/* Header */}
      <header className="sitemap-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </button>
        <h1 className="logo-text">JoinGo</h1>
      </header>

      {/* Main Content */}
      <main className="sitemap-content">
        <h1 className="sitemap-title">Mapa del Sitio</h1>
        <p className="sitemap-subtitle">Encuentra fácilmente lo que buscas en JoinGo</p>

        <div className="sitemap-grid">
          {/* Main */}
          <div className="sitemap-card">
            <div className="card-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <h3>Principal</h3>
            </div>
            <ul className="card-links">
              <li onClick={() => navigate("/dashboard")}>Inicio</li>
              <li onClick={() => navigate("/dashboard")}>Características</li>
              <li onClick={() => navigate("/schedule-meeting")}>Planes y precios</li>
              <li onClick={() => navigate("/dashboard")}>Descargas</li>
            </ul>
          </div>

          {/* Meetings */}
          <div className="sitemap-card">
            <div className="card-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
                <polyline points="17 2 12 7 7 2"></polyline>
              </svg>
              <h3>Reuniones</h3>
            </div>
            <ul className="card-links">
              <li onClick={() => navigate("/schedule-meeting")}>Nueva reunión</li>
              <li onClick={() => navigate("/dashboard")}>Unirse a reunión</li>
              <li onClick={() => navigate("/schedule-meeting")}>Programar reunión</li>
              <li onClick={() => navigate("/dashboard")}>Grabaciones</li>
            </ul>
          </div>

          {/* Account */}
          <div className="sitemap-card">
            <div className="card-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <h3>Cuenta</h3>
            </div>
            <ul className="card-links">
              <li onClick={() => navigate("/login")}>Iniciar sesión</li>
              <li onClick={() => navigate("/register")}>Registrarse</li>
              <li onClick={() => navigate("/profile")}>Mi perfil</li>
              <li onClick={() => navigate("/dashboard")}>Configuración</li>
              <li onClick={() => navigate("/dashboard")}>Recuperar contraseña</li>
            </ul>
          </div>

          {/* Support and Resources */}
          <div className="sitemap-card">
            <div className="card-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <h3>Soporte y Recursos</h3>
            </div>
            <ul className="card-links">
              <li onClick={() => navigate("/support")}>Centro de ayuda</li>
              <li onClick={() => navigate("/support")}>Preguntas frecuentes</li>
              <li>Tutoriales</li>
              <li onClick={() => navigate("/support")}>Contactar soporte</li>
              <li>Estado del servicio</li>
              <li>Comunidad</li>
            </ul>
          </div>

          {/* Company */}
          <div className="sitemap-card">
            <div className="card-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              <h3>Empresa</h3>
            </div>
            <ul className="card-links">
              <li onClick={() => navigate("/about")}>Sobre nosotros</li>
              <li>Blog</li>
              <li>Carreras</li>
              <li>Prensa</li>
              <li>Asociados</li>
            </ul>
          </div>

          {/* Legal */}
          <div className="sitemap-card">
            <div className="card-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <h3>Legal</h3>
            </div>
            <ul className="card-links">
              <li>Términos de servicio</li>
              <li>Política de privacidad</li>
              <li>Política de cookies</li>
              <li>Seguridad</li>
              <li>Accesibilidad</li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="contact-info">
          <h2 className="contact-title">Información de Contacto</h2>
          <div className="contact-cards">
            <div className="contact-card">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#155DFC" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                <path d="M22 7l-10 7L2 7"></path>
              </svg>
              <h4>Correo</h4>
              <p>support@joingo.com</p>
            </div>
            <div className="contact-card">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#155DFC" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <h4>Teléfono</h4>
              <p>+1 (555) 123-4567</p>
            </div>
            <div className="contact-card">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#155DFC" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <h4>Chat en vivo</h4>
              <p>Disponible 24/7</p>
            </div>
          </div>
        </div>

        {/* Social Networks */}
        <div className="social-section">
          <h2 className="social-title">Síguenos en Redes Sociales</h2>
          <div className="social-icons">
            <button className="social-icon facebook">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
            <button className="social-icon twitter">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </button>
            <button className="social-icon linkedin">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </button>
            <button className="social-icon instagram">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
              </svg>
            </button>
            <button className="social-icon youtube">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Help Section */}
        <div className="help-section">
          <p className="help-text">¿No encuentras lo que buscas?</p>
          <button className="help-button">Sugerir o ayudar</button>
        </div>
      </main>

      {/* Footer */}
      <footer className="sitemap-footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/dashboard"); }}>Inicio</a>
            <span className="separator">•</span>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/about"); }}>Sobre nosotros</a>
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

export default SiteMap;
