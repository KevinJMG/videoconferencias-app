import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/useAuthStore';
import "./Login.css";
const Login: React.FC = () => {
    const navigate = useNavigate();
    const { loginWithGoogle, initAuthObserver } = useAuthStore();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        const unsub = initAuthObserver();
        return () => unsub();
    }, [initAuthObserver]);

    const handleLoginGoogle = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await loginWithGoogle();
            navigate("/profile");
        } catch (err) {
            console.error("Error al iniciar sesión con Google:", err);
        }
    };

    const handleLoginEmail = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Login con email:", email, password);
    };

    const handleRegister = () => {
        navigate("/register"); 
    };

    return (
        <div className="login-split-container">
           
            {/* IZQUIERDA - LOGIN */}
            <div className="login-left">

                 {/* LOGO */}
               <h1 className="logo-text">JoinGo</h1>


                <div className="login-content">

                    <h2 className="Login-title">Iniciar Sesión</h2>

                    <form onSubmit={handleLoginEmail} className="login-form">
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </form>
                   <div className="login-buttons-container">
                        <button type="submit" className="btn-email-login">
                            Iniciar Sesión
                        </button>

                        <button onClick={handleLoginGoogle} className="login-google-btn">
                            <img src="/assets/images/google.png"  alt="Google" width={24} height={24} />
                            <span>Google</span>
                        </button>
                    </div>

                    <p className="login-register-text">
                        ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
                    </p>

                </div>
            </div>

            {/*ZONA DERECHA INFO DE LA PAGINA*/}
            <div className="login-right"> 
                <div className="right-content">
                    <h2 className="right-title">Conecta con tu equipo desde cualquier lugar</h2>
                    <p className="p-right">Videoconferencias de alta calidad, sin complicaciones. Reuniones seguras con hasta 10 participantes, grabación en la nube y mucho más.</p>
                    <div className="characteristics">
                        <h3>Video HD</h3>
                        <p className="p-right">Calidad de video 1080p</p>
                    </div>
                    <div className="characteristics">
                        <h3>Seguridad de extremo a extremo</h3>
                        <p className="p-right">Encriptación avanzada para proteger tus conversaciones</p>
                    </div>
                    <div className="characteristics">
                        <h3>Hasta 10 participantes</h3>
                        <p className="p-right">Reuniones pequeñas sin comprometer la calidad</p>
                    </div>
                </div>
            </div>
            

        </div>
    );
};

export default Login;
