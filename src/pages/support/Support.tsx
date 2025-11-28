import React, { useState } from "react";
import "./Support.css";
import { useNavigate } from "react-router-dom";

/**
 * Support Component
 *
 * Comprehensive support center providing:
 * - Multiple contact options (Email, Phone, Live Chat)
 * - Frequently Asked Questions (FAQ) section
 * - Contact form for detailed inquiries
 * - Additional resources (Documentation, Videos, Community)
 * - Quick troubleshooting guide
 * - Help and suggestions section
 *
 * @component
 * @returns {JSX.Element} The support center page with help resources
 *
 * @example
 * ```tsx
 * <Support />
 * ```
 *
 * @remarks
 * - Contact methods: Email (24hr response), Phone (9AM-6PM weekdays), Live Chat (24/7)
 * - FAQ covers common topics like meeting creation, recordings, security, mobile access
 * - Contact form allows users to report issues and ask questions
 * - Includes links to additional resources and community
 * - Responsive design for all devices
 *
 * @state formData - Manages form input fields for contact inquiries
 */
const Support: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  /**
   * Handles form input changes and updates state
   * @param e - Change event from input, textarea, or select element
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /**
   * Handles form submission
   * Shows confirmation message and resets form fields
   * @param e - Form submit event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Tu mensaje ha sido enviado. Nos pondremos en contacto pronto.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="support-container">
      {/* Header */}
      <header className="support-header">
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
      <main className="support-content">
        {/* Title */}
        <section className="support-intro">
          <h1 className="support-title">Centro de Soporte</h1>
          <p className="support-subtitle">
            ¿Necesitas ayuda? Estamos aquí para ti. Encuentra respuestas rápidas o contáctanos directamente.
          </p>
        </section>

        {/* Quick Contact Options */}
        <section className="contact-options">
          <div className="contact-card">
            <div className="contact-icon email">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <h3 className="contact-title">Correo</h3>
            <p className="contact-description">support@joingo.com</p>
            <p className="contact-time">Respuesta en 24 horas</p>
          </div>

          <div className="contact-card">
            <div className="contact-icon phone">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            <h3 className="contact-title">Teléfono</h3>
            <p className="contact-description">+1 (800) 123-4567</p>
            <p className="contact-time">Lun - Vie: 9AM - 6PM</p>
          </div>

          <div className="contact-card">
            <div className="contact-icon chat">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3 className="contact-title">Chat en Vivo</h3>
            <p className="contact-description">Disponible ahora</p>
            <p className="contact-time">Respuesta inmediata</p>
          </div>
        </section>

        {/* Frequently Asked Questions */}
        <section className="faq-section">
          <h2 className="section-title">Preguntas Frecuentes</h2>
          <div className="faq-grid">
            <div className="faq-card">
              <div className="faq-icon">?</div>
              <h4 className="faq-question">¿Cómo creo una reunión?</h4>
              <p className="faq-answer">
                Haz clic en "Nueva reunión" en el panel, completa los detalles y comparte el enlace con los participantes.
              </p>
            </div>

            <div className="faq-card">
              <div className="faq-icon">?</div>
              <h4 className="faq-question">¿Cuántos participantes puedo tener?</h4>
              <p className="faq-answer">
                Puedes tener hasta 10 participantes en tus reuniones.
              </p>
            </div>

            <div className="faq-card">
              <div className="faq-icon">?</div>
              <h4 className="faq-question">¿Puedo grabar mis reuniones?</h4>
              <p className="faq-answer">
                Sí, puedes grabar tus reuniones con un solo clic. Las grabaciones se guardan en la nube y están disponibles durante 30 días.
              </p>
            </div>

            <div className="faq-card">
              <div className="faq-icon">?</div>
              <h4 className="faq-question">¿Mi información es segura?</h4>
              <p className="faq-answer">
                Absolutamente. Utilizamos cifrado de extremo a extremo y cumplimos con los más altos estándares de seguridad.
              </p>
            </div>

            <div className="faq-card">
              <div className="faq-icon">?</div>
              <h4 className="faq-question">¿Funciona en dispositivos móviles?</h4>
              <p className="faq-answer">
                Sí, JoinGo funciona perfectamente en navegadores móviles y tenemos aplicaciones nativas para iOS y Android.
              </p>
            </div>

            <div className="faq-card">
              <div className="faq-icon">?</div>
              <h4 className="faq-question">¿Cómo cancelo mi suscripción?</h4>
              <p className="faq-answer">
                Puedes cancelar tu suscripción en cualquier momento desde la configuración de tu cuenta, sin penalizaciones.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="contact-form-section">
          <h2 className="section-title">¿No encuentras lo que buscas?</h2>
          <p className="form-subtitle">Envíanos un mensaje y te responderemos lo antes posible</p>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Nombre completo</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Tu nombre"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Correo</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="tu@correo.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Asunto</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecciona un asunto</option>
                <option value="tecnico">Problema técnico</option>
                <option value="facturacion">Facturación y pagos</option>
                <option value="cuenta">Gestión de cuenta</option>
                <option value="funcionalidad">Consulta de función</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Mensaje</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Describe tu consulta o problema..."
                rows={6}
                required
              ></textarea>
            </div>

            <button type="submit" className="submit-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
              Enviar mensaje
            </button>
          </form>
        </section>

        {/* Additional Resources */}
        <section className="resources-section">
          <h2 className="section-title">Recursos Adicionales</h2>
          <div className="resources-grid">
            <div className="resource-card" onClick={() => navigate("/sitemap")}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#155DFC" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <h4>Documentación</h4>
              <p>Guías y tutoriales completos</p>
            </div>

            <div className="resource-card">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#155DFC" strokeWidth="2">
                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
              </svg>
              <h4>Tutoriales de Video</h4>
              <p>Aprende con videos paso a paso</p>
            </div>

            <div className="resource-card">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#155DFC" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <h4>Comunidad</h4>
              <p>Únete al foro de usuarios</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="support-footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/dashboard"); }}>Inicio</a>
            <span className="separator">•</span>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/about"); }}>Sobre nosotros</a>
            <span className="separator">•</span>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/sitemap"); }}>Mapa del Sitio</a>
          </div>
          <p className="footer-copyright">
            Copyright ©2025 JoinGo Communications, Inc. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Support;
