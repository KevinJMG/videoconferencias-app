import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore"; 
import "../login/Login.css";

/**
 * Register Component
 * Handles user registration using email/password or Google authentication.
 * Includes form validation and automatic login after successful registration.
 */
const Register: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuthStore();
  const { setUser } = useAuthStore() as any;
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";


  // Local state for form fields
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

  /**
   * Update local form state when input changes
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * Handles form submission:
   * - Validates password, confirm password and age
   * - Sends registration request
   * - If backend returns token → store it
   * - If not → login manually to get token
   * - Fetches user info (/api/users/me) and stores it in Zustand
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Password validation: minimum 8 chars, 1 uppercase, 1 special character
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|`~]).{8,}$/;
    if (!passwordRegex.test(form.password)) {
      setError("La contraseña debe tener mínimo 8 caracteres, una mayúscula y un carácter especial.");
      return;
    }

    // Confirm password validation
    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    // Age validation
    if (!form.age || isNaN(Number(form.age)) || Number(form.age) < 1) {
      setError("Ingresa una edad válida");
      return;
    }

    try {
      // Registration request
        const resp = await fetch(`${API_URL}/api/auth/register`,  {
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

      /**
       * Some backends return idToken on registration.
       * If not provided → login after register to obtain token.
       */
      let idToken = data?.data?.idToken;

      if (!idToken) {
        try {
          const loginResp = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: form.email, password: form.password }),
          });

          if (loginResp.ok) {
            const loginData = await loginResp.json();
            idToken = loginData?.data?.idToken;
            if (idToken) localStorage.setItem('idToken', idToken);
          } else {
            console.warn('No se pudo iniciar sesión tras registro');
          }
        } catch (err) {
          console.warn('Error logging in after register', err);
        }
      } else {
        localStorage.setItem('idToken', idToken);
      }

      /**
       * Once the token exists, request user data and store it in Zustand
       */
      if (idToken) {
        try {
          const meResp = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${idToken}`,
            },
          });

          if (meResp.ok) {
            const meData = await meResp.json();
            if (meData?.data) setUser(meData.data);
          } else {
            console.warn('No se pudo obtener user desde /api/users/me tras registro');
          }
        } catch (err) {
          console.warn('Error fetching /api/users/me after register', err);
        }
      }

      // Redirect user to dashboard after successful registration
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError("Error en la conexión con el backend");
    }
  };

  /**
   * Register/Login using Google Provider
   */
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
      {/* Left side: registration form */}
      <div className="login-left">
        <h1 className="logo-text">JoinGo</h1>
        <div className="login-content">
          <h2 className="Login-title">Crear Cuenta</h2>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="login-form">

            {/* Name */}
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              value={form.name}
              onChange={handleChange}
              required
            />

            {/* Last Name */}
            <input
              type="text"
              name="lastName"
              placeholder="Apellido"
              value={form.lastName}
              onChange={handleChange}
              required
            />

            {/* Organization field */}
            <input
              type="text"
              name="organization"
              placeholder="Organización"
              value={form.organization}
              onChange={handleChange}
              required
            />

            {/* Email field */}
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleChange}
              required
            />

            {/* Age */}
            <input
              type="number"
              name="age"
              placeholder="Edad"
              value={form.age}
              onChange={handleChange}
              required
            />

            {/* Password */}
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              required
            />

            {/* Confirm password */}
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />

            {/* Submit & Google buttons */}
            <div className="login-buttons-container">
              <button type="submit" className="btn-email-login">
                Registrarme
              </button>

              <button
                onClick={handleRegisterWithGoogle}
                type="button"
                className="login-google-btn"
              >
                <img src="/assets/images/google.png" alt="Google" width={24} height={24} />
                <span>Google</span>
              </button>
            </div>

            {/* Error message */}
            {error && <p className="login-error">{error}</p>}
          </form>

          {/* Link to login */}
          <p className="login-register-text">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </div>
      </div>

      {/* Right side: static information */}
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
