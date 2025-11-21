import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore"; 
import "../login/Login.css";


const Register: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuthStore();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    organization: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos enviados:", form);
  };

  const handleRegisterWithGoogle = async () => {
    try {
      await loginWithGoogle();
      navigate("/profile");
    } catch (err) {
      console.error("Error al registrarte con Google:", err);
    }
  };

  return (
    <div className="login-split-container">
      
      {/* IZQUIERDA */}
      <div className="login-left">
        <h1 className="logo-text">JoinGo</h1>

        <div className="login-content">
          <h2 className="Login-title">Crear Cuenta</h2>

          <form onSubmit={handleSubmit} className="login-form">

            <input
              type="text"
              name="name"
              placeholder="Tu nombre"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="organization"
              placeholder="Organización"
              value={form.organization}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            <div className="login-buttons-container">
              <button type="submit" className="btn-email-login">
                Registrarme
              </button>
              {/* BOTÓN GOOGLE */}
              <button onClick={handleRegisterWithGoogle} className="login-google-btn">
              <img
                src="/assets/images/google.png"
                alt="Google"
                width={24}
                height={24}
              />
              <span>Google</span>
            </button>
          </div>
          </form>

        

          <p className="login-register-text">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>

        </div>
      </div>

      {/* DERECHA (MISMO DISEÑO QUE LOGIN) */}
      <div className="login-right">
        <div className="right-content">
          <h2 className="right-title">Únete a tu equipo en segundos</h2>
          <p className="p-right">
            Videoconferencias rápidas, intuitivas y seguras para tu organización.
          </p>
          <div className="characteristics">
            <h3>Video HD</h3>
            <p className="p-right">Calidad 1080p sin cortes</p>
          </div>
          <div className="characteristics">
            <h3>Protección avanzada</h3>
            <p className="p-right">Encriptación extremo a extremo</p>
          </div>
          <div className="characteristics">
            <h3>Hasta 10 personas</h3>
            <p className="p-right">Reuniones privadas de alta calidad</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
