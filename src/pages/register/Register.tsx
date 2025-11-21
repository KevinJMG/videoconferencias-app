import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore"; 
import "../login/Login.css";
import PasswordField from '../../components/PasswordField';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuthStore();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    lastName: "",
    organization: "",
    age: "",
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validación de contraseña
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|`~]).{8,}$/;
    if (!passwordRegex.test(form.password)) {
      setError("La contraseña debe tener mínimo 8 caracteres, una mayúscula y un carácter especial.");
      return;
    }

    // Confirmar contraseña
    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    // Validar edad
    if (!form.age || isNaN(Number(form.age)) || Number(form.age) < 1) {
      setError("Ingresa una edad válida");
      return;
    }

    try {
      const resp = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          displayName: form.name,
          lastName: form.lastName,
          organization: form.organization,
          age: form.age ? Number(form.age) : undefined,
        }),
      });

      if (!resp.ok) {
        const data = await resp.json();
        setError(data?.message || "Error en el registro");
        return;
      }

      const data = await resp.json();
      console.log("Usuario registrado:", data);

      // Guardar idToken si el backend lo devuelve
      if (data.data?.idToken) {
        localStorage.setItem("idToken", data.data.idToken);
      }

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Error en la conexión con el backend");
    }
  };

  const handleRegisterWithGoogle = async () => {
    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      console.error("Error al registrarte con Google:", err);
      setError("No se pudo registrar con Google");
    }
  };

  return (
    <div className="login-split-container">
      <div className="login-left">
        <h1 className="logo-text">JoinGo</h1>
        <div className="login-content">
          <h2 className="Login-title">Crear Cuenta</h2>

          <form onSubmit={handleSubmit} className="login-form">
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Apellido"
              value={form.lastName}
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
              type="number"
              name="age"
              placeholder="Edad"
              value={form.age}
              onChange={handleChange}
              required
            />

            <PasswordField
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              required
            />

            <PasswordField
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
              <button onClick={handleRegisterWithGoogle} type="button" className="login-google-btn">
                <img
                  src="/assets/images/google.png"
                  alt="Google"
                  width={24}
                  height={24}
                />
                <span>Google</span>
              </button>
            </div>

            {error && <p className="login-error">{error}</p>}
          </form>

          <p className="login-register-text">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </div>
      </div>

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
