import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/useAuthStore';
import { getAuth, signInWithPopup, GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";
import "./Login.css";

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { loginWithGoogle, initAuthObserver } = useAuthStore();
    const { setUser } = useAuthStore() as any;

    const [email, setEmail] = useState("");
       const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    useEffect(() => {
        const unsub = initAuthObserver();
        return () => unsub();
    }, [initAuthObserver]);

    // ==============================
    // LOGIN GOOGLE
    // ==============================
    const handleLoginGoogle = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await loginWithGoogle();
             const provider = new GoogleAuthProvider();

            // FORZAR SIEMPRE SELECCIÓN DE CUENTA
                provider.setCustomParameters({
                    prompt: "select_account"
            });

            const fbUser = getAuth().currentUser;
            const idToken = fbUser ? await fbUser.getIdToken() : null;

            if (idToken) {
                localStorage.setItem("idToken", idToken);
                console.log("🔥 Token guardado:", idToken);
            }

            navigate("/dashboard");
        } catch (err) {
            console.error("Error Google:", err);
            setError("No se pudo iniciar sesión con Google");
        }
    };

    // ==============================
    // LOGIN GITHUB
    // ==============================
    const handleLoginGithub = async () => {
        try {
            const auth = getAuth();
            const provider = new GithubAuthProvider();
                provider.setCustomParameters({
                allow_signup: "false"
            });

            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();

            localStorage.setItem("idToken", idToken);

            console.log("🐱 GitHub login OK:", result.user);
            navigate("/dashboard");

        } catch (err) {
            console.error("GitHub error:", err);
            setError("Error al iniciar sesión con GitHub");
        }
    };

    // ==============================
    
    // ==============================
    // LOGIN EMAIL / PASSWORD
    // ==============================
    const handleLoginEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const resp = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!resp.ok) {
                const data = await resp.json();
                setError(data?.message || "Error en login");
                return;
            }

            const data = await resp.json();
            localStorage.setItem("idToken", data.data.idToken);

            // Intentar obtener el usuario
            try {
                const meResp = await fetch(`${API_URL}/api/users/me`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${data.data.idToken}`,
                    },
                });

                if (meResp.ok) {
                    const meData = await meResp.json();
                    if (meData?.data) setUser(meData.data);
                }
            } catch (e) {
                console.warn("Error get /users/me:", e);
            }

            navigate("/dashboard");

        } catch (err) {
            console.error(err);
            setError("Error al conectar al backend");
        }
    };

    return (
        <div className="login-split-container">
            <div className="login-left">
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

                        <div className="login-buttons-container">
                            <button type="submit" className="btn-email-login">
                                Iniciar Sesión
                            </button>

                            {/* GOOGLE */}
                            <button onClick={handleLoginGoogle} type="button" className="login-google-btn">
                                <img src="/assets/images/google.png" alt="Google" width={24} height={24} />
                                <span>Google</span>
                            </button>

                            {/* GITHUB */}
                            <button onClick={handleLoginGithub} type="button" className="login-google-btn">
                                <img src="/assets/images/github.png" alt="GitHub" width={24} height={24} />
                                <span>GitHub</span>
                            </button>

                        </div>
                    </form>

                    {error && <p className="login-error">{error}</p>}

                    <p className="login-register-text">
                        ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
                    </p>
                </div>
            </div>

            <div className="login-right">
                <div className="right-content">
                    <h2 className="right-title">Conecta con tu equipo desde cualquier lugar</h2>
                    <p className="p-right">
                        Videoconferencias de alta calidad, sin complicaciones. Reuniones seguras con hasta 10
                        participantes, grabación en la nube y mucho más.
                    </p>
                    <div className="characteristics">
                        <h3>Video HD</h3>
                        <p className="p-right">Calidad 1080p</p>
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
