import React, { useState } from 'react';
import useAuthStore from '../../stores/useAuthStore';
import { auth } from '../../lib/firebase.config';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

//Cambio temporal para que git reconozaca el cambio del archivo

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuthStore() as any;
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Prefer VITE_API_URL or VITE_API_BASE; fall back to relative path
  const _rawApi = (import.meta.env.VITE_API_URL as string) || (import.meta.env.VITE_API_BASE as string) || '';
  const API_BASE = _rawApi.replace(/\/$/, '');

  const [editMode, setEditMode] = useState(false);

  // Editable fields
  const [firstName, setFirstName] = useState(user?.displayName?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(user?.displayName?.split(' ').slice(1).join(' ') || '');
  const [age, setAge] = useState(user?.age || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phoneNumber, setPhone] = useState(user?.phoneNumber || '');
  

  // Privacy settings
  const [publicProfile, setPublicProfile] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const [allowInvites, setAllowInvites] = useState(true);

  // User statistics (static example values)
  const [meetings] = useState(5);
  const [hoursConnected] = useState(12);

  /**
   * Normalize and format "createdAt" from several possible backend formats:
   * - Firestore Timestamp object (seconds or _seconds)
   * - Timestamp with toDate() method
   * - Numeric epoch (ms or seconds)
   * - ISO date string
   */
  const formatCreatedAt = (val: any) => {
    if (!val) return 'Desconocida';
    try {
      // Firestore Timestamp version 1: { seconds: number } or { _seconds: number }
      if (typeof val === 'object' && (val.seconds || val._seconds)) {
        const seconds = val.seconds ?? val._seconds;
        return new Date(seconds * 1000).toLocaleDateString();
      }

      // Firestore Timestamp with toDate() method
      if (val && typeof val.toDate === 'function') {
        return val.toDate().toLocaleDateString();
      }

      // Numeric epoch (milliseconds or seconds)
      if (typeof val === 'number') {
        const maybeMs = val < 1e12 ? val * 1000 : val;
        return new Date(maybeMs).toLocaleDateString();
      }

      // ISO string
      if (typeof val === 'string') {
        const d = new Date(val);
        if (!Number.isNaN(d.getTime())) return d.toLocaleDateString();
      }
    } catch (e) {
      console.warn('Error parsing createdAt', e, val);
    }
    return 'Desconocida';
  };

  const createdAtDate = formatCreatedAt(user?.createdAt);

  // Local password change UI state
  const [showChangePass, setShowChangePass] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [changePassStatus, setChangePassStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [changePassMessage, setChangePassMessage] = useState<string | null>(null);

  // ----------------------------------------
  // 🔥 SAVE CHANGES TO BACKEND
  // ----------------------------------------
  const handleSave = async () => {
    const displayName = `${firstName} ${lastName}`.trim();

    // Build payload to send to backend
    const payload: any = {
      uid: user.uid,
      displayName,
      email,
      phoneNumber,
      publicProfile,
      showEmail,
      allowInvites
    };

    // Age: include only if valid number
    if (age !== '' && age !== null && age !== undefined) {
      const ageNum = Number(age);
      if (!Number.isNaN(ageNum)) payload.age = ageNum;
    }

    try {
      // Get fresh Firebase ID token (fallback to localStorage)
      const rawApi = (import.meta.env.VITE_API_URL as string) || (import.meta.env.VITE_API_BASE as string) || '';
      const API_BASE = rawApi.replace(/\/$/, '');

      const storedToken = localStorage.getItem("idToken");
      let token: string | null | undefined = storedToken;

      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          token = await currentUser.getIdToken();
        }
      } catch (tokenErr) {
        console.warn('Could not get fresh ID token from Firebase auth:', tokenErr);
      }

      if (!token) {
        console.warn('No token available for request');
        return alert('No se encontró token. Por favor inicia sesión de nuevo.');
      }

      console.log('Sending PUT with token (first 20 chars):', token?.slice?.(0, 20));

      const res = await fetch(`${API_BASE}/api/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));
      console.log('Backend response:', data);

      if (!res.ok) {
        console.error('Backend returned non-OK status', res.status, data);
        return alert(`❌ Error saving changes: ${data?.error?.message || res.status}`);
      }

      // Update store user with new data
      setUser({ ...user, ...payload });

      alert('✅ Changes saved successfully');
      setEditMode(false);

    } catch (error) {
      console.error(error);
      alert('❌ Connection error');
    }
  };

  // ----------------------------------------
  // DELETE ACCOUNT
  // ----------------------------------------
  const handleDelete = async () => {
    if (!window.confirm('¿Seguro que deseas eliminar tu cuenta?')) return;
    logout();
    navigate('/');
  };

  //------------------------------------------------
  //ClOSED SESION 
  //------------------------------------------------
  const confirmLogout = () => {
    logout();
    navigate('/login');
  };


  // ----------------------------------------
  // LOCAL CHANGE PASSWORD
  // ----------------------------------------
  const handleChangePassword = async () => {
    // Clear previous messages
    setChangePassMessage(null);

    // Client-side validation
    if (!currentPassword) {
      setChangePassStatus('error');
      setChangePassMessage('Por favor ingresa tu contraseña actual para confirmar el cambio.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setChangePassStatus('error');
      setChangePassMessage('Las contraseñas nuevas no coinciden.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setChangePassStatus('error');
      setChangePassMessage('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setChangePassStatus('saving');

    try {
      // Try to retrieve token again
      const storedToken = localStorage.getItem('idToken');
      let token: string | null | undefined = storedToken;

      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          token = await currentUser.getIdToken();
        }
      } catch (tokenErr) {
        console.warn('Could not get fresh ID token from Firebase auth:', tokenErr);
      }

      if (!token) {
        setChangePassStatus('error');
        setChangePassMessage('No se encontró token. Por favor inicia sesión de nuevo.');
        return;
      }

      const res = await fetch(`${API_BASE}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json().catch(() => ({}));
      console.log('change-password response:', res.status, data);

      if (!res.ok) {
        console.error('Change password failed', res.status, data);
        setChangePassStatus('error');
        setChangePassMessage(data?.error?.message || `Error ${res.status}`);
        return;
      }

      setChangePassStatus('success');
      setChangePassMessage('✅ Contraseña actualizada correctamente.');

      // Reset fields after success
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setShowChangePass(false);
    } catch (err) {
      console.error('Error changing password', err);
      setChangePassStatus('error');
      setChangePassMessage('Error de conexión al cambiar la contraseña.');
    }
  };

  // Simple password strength estimator (0-3)
  const evaluatePasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 6) score++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
    if (/\d/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) score++;
    setPasswordStrength(score);
  };

  // If user is not loaded yet
  if (!user) return <div>Cargando perfil...</div>;

  return (
    <>
      {/*----------------MODAL--------------*/}

      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>¿Cerrar sesión?</h3>
            <p>Tu sesión se cerrará y deberás volver a iniciar sesión.</p>

            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setShowLogoutModal(false)}>
                Cancelar
              </button>
              <button className="modal-logout" onClick={confirmLogout}>
                Sí, cerrar
              </button>
            </div>
          </div>
        </div>
      )}


      <div className="schedule-container">
        <header className="schedule-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Volver
          </button>
          <h1 className="logo-text">Mi perfil</h1>
        </header>

        <div className="schedule-content">
          <div className="schedule-grid">

            {/* LEFT SIDE - PREVIEW */}
            <div className="preview-section">
              <div className="preview-card">
                <div className="preview-icon">
                  {/* Show user avatar or fallback initial */}
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="avatar-img" />
                  ) : (
                    <div className="avatar-placeholder">{user.displayName?.charAt(0)}</div>
                  )}
                </div>

                <h3 className="preview-title">{user.displayName}</h3>

                {/* Basic user info */}
                <div className="preview-info">
                  <p className="preview-label">Email</p>
                  <p className="preview-value">{user.email}</p>
                </div>

                <div className="preview-info">
                  <p className="preview-label">Reuniones</p>
                  <p className="preview-value">{meetings}</p>
                </div>

                <div className="preview-info">
                  <p className="preview-label">Horas conectado</p>
                  <p className="preview-value">{hoursConnected}</p>
                </div>

                <div className="preview-info">
                  <p className="preview-label">Miembro desde</p>
                  <p className="preview-value">{createdAtDate}</p>
                </div>

              </div>
            </div>

            {/* RIGHT SIDE - FORM */}
            <div className="form-section">

              {/* PERSONAL INFORMATION */}
              <div className="form-card">

                {/* View mode vs Edit mode */}
                {!editMode ? (
                  <>
                    {/* Display user data */}
                    <div className="form-group"><label>Nombre:</label><p>{firstName}</p></div>
                    <div className="form-group"><label>Apellido:</label><p>{lastName}</p></div>
                    <div className="form-group"><label>Edad:</label><p>{age}</p></div>
                    <div className="form-group"><label>Email:</label><p>{email}</p></div>
                    <div className="form-group"><label>Teléfono:</label><p>{phoneNumber}</p></div>

                    <div className="action-buttons">
                      <button className="btn-submit" onClick={() => setEditMode(true)}>Editar perfil</button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Edit mode inputs */}
                    <div className="form-row">
                      <div className="form-group">
                        <label>Nombre:</label>
                        <input value={firstName} onChange={e => setFirstName(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Apellido:</label>
                        <input value={lastName} onChange={e => setLastName(e.target.value)} />
                      </div>
                    </div>

                    <div className="form-group"><label>Edad:</label><input value={age} onChange={e => setAge(e.target.value)} /></div>
                    <div className="form-group"><label>Email:</label><input value={email} onChange={e => setEmail(e.target.value)} /></div>
                    <div className="form-group"><label>Teléfono:</label><input value={phoneNumber} onChange={e => setPhone(e.target.value)} /></div>

                    {/* CHANGE PASSWORD SECTION */}
                    <div className="form-group">
                      <button className="btn-cancel" onClick={() => { setShowChangePass(s => !s); setChangePassMessage(null); setChangePassStatus('idle'); }}>
                        {showChangePass ? 'Cancelar cambio contraseña' : 'Cambiar contraseña'}
                      </button>

                      {showChangePass && (
                        <div className="form-row" style={{ flexDirection: 'column', gap: 12, marginTop: 12 }}>
                          {/* Row: current password */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 160 }}><label style={{ fontSize: 14 }}>Contraseña actual</label></div>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                              <input
                                type={showCurrentPwd ? 'text' : 'password'}
                                placeholder="Contraseña actual"
                                value={currentPassword}
                                onChange={e => setCurrentPassword(e.target.value)}
                                style={{ flex: 1 }}
                              />
                              <button type="button" onClick={() => setShowCurrentPwd(s => !s)} className="eye-btn" aria-label={showCurrentPwd ? 'Ocultar contraseña actual' : 'Mostrar contraseña actual'}>
                                {showCurrentPwd ? (
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3.11-11-7 1.08-2.42 2.94-4.44 5.09-5.64"/><path d="M1 1l22 22"/></svg>
                                ) : (
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1.05 12C2.77 7.11 7 4 12 4c2.5 0 4.78.95 6.57 2.5"/><path d="M12 20c5 0 9.27-3.11 11-7-1.08-2.42-2.94-4.44-5.09-5.64"/></svg>
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Row: new password */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 160 }}><label style={{ fontSize: 14 }}>Nueva contraseña</label></div>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                              <input
                                type={showNewPwd ? 'text' : 'password'}
                                placeholder="Nueva contraseña"
                                value={newPassword}
                                onChange={e => { setNewPassword(e.target.value); evaluatePasswordStrength(e.target.value); }}
                                style={{ flex: 1 }}
                              />
                              <button type="button" onClick={() => setShowNewPwd(s => !s)} className="eye-btn" aria-label={showNewPwd ? 'Ocultar nueva contraseña' : 'Mostrar nueva contraseña'}>
                                {showNewPwd ? (
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3.11-11-7 1.08-2.42 2.94-4.44 5.09-5.64"/><path d="M1 1l22 22"/></svg>
                                ) : (
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1.05 12C2.77 7.11 7 4 12 4c2.5 0 4.78.95 6.57 2.5"/><path d="M12 20c5 0 9.27-3.11 11-7-1.08-2.42-2.94-4.44-5.09-5.64"/></svg>
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Row: confirm password */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 160 }}><label style={{ fontSize: 14 }}>Confirmar contraseña</label></div>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                              <input
                                type={showConfirmPwd ? 'text' : 'password'}
                                placeholder="Confirmar nueva contraseña"
                                value={confirmNewPassword}
                                onChange={e => setConfirmNewPassword(e.target.value)}
                                style={{ flex: 1 }}
                              />
                              <button type="button" onClick={() => setShowConfirmPwd(s => !s)} className="eye-btn" aria-label={showConfirmPwd ? 'Ocultar confirmar contraseña' : 'Mostrar confirmar contraseña'}>
                                {showConfirmPwd ? (
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3.11-11-7 1.08-2.42 2.94-4.44 5.09-5.64"/><path d="M1 1l22 22"/></svg>
                                ) : (
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1.05 12C2.77 7.11 7 4 12 4c2.5 0 4.78.95 6.57 2.5"/><path d="M12 20c5 0 9.27-3.11 11-7-1.08-2.42-2.94-4.44-5.09-5.64"/></svg>
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Strength modal below */}
                          <div style={{ marginTop: 8 }} className="pwd-strength-modal">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <strong>Fortaleza de la contraseña:</strong>
                                <div style={{ marginTop: 6 }}><small>{['Muy débil','Débil','Media','Fuerte'][passwordStrength]}</small></div>
                              </div>
                              <div style={{ width: 200 }}>
                                <div style={{ height: 8, background: '#eee', borderRadius: 6 }}>
                                  <div style={{ width: `${(passwordStrength/3)*100}%`, height: '100%', background: passwordStrength >= 3 ? '#16a34a' : passwordStrength === 2 ? '#f59e0b' : '#ef4444', borderRadius: 6 }} />
                                </div>
                              </div>
                            </div>
                            <div style={{ marginTop: 8 }}>
                              <small>Consejos: usa al menos 8 caracteres, mezcla mayúsculas, números y símbolos.</small>
                            </div>
                          </div>

                          {changePassMessage && (
                            <div style={{ marginTop: 8 }} className={changePassStatus === 'success' ? 'message-success' : 'message-error'}>
                              {changePassMessage}
                            </div>
                          )}

                          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                            <button className="btn-submit" onClick={handleChangePassword} disabled={changePassStatus === 'saving'}>
                              {changePassStatus === 'saving' ? 'Actualizando...' : 'Actualizar contraseña'}
                            </button>
                            <button className="btn-cancel" onClick={() => { setShowChangePass(false); setCurrentPassword(''); setNewPassword(''); setConfirmNewPassword(''); setChangePassMessage(null); setChangePassStatus('idle'); }}>
                              Cancelar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* SAVE / CANCEL */}
                    <div className="action-buttons">
                      <button className="btn-submit" onClick={handleSave}>Guardar cambios</button>
                      <button className="btn-cancel" onClick={() => setEditMode(false)}>Cancelar</button>
                    </div>
                  </>
                )}

              </div>



              {/* PRIVACY SETTINGS */}
              <div className="form-card" style={{ marginTop: 20 }}>
                <h3>Privacidad y Seguridad</h3>

                <div className="settings-list">

                  {/* Public profile toggle */}
                  <div className="setting-item">
                    <div className="setting-info">
                      <p className="setting-title">Perfil público</p>
                      <p className="setting-description">Permitir que otros vean tu perfil</p>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" checked={publicProfile} onChange={e => setPublicProfile(e.target.checked)} />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  {/* Show email toggle */}
                  <div className="setting-item">
                    <div className="setting-info">
                      <p className="setting-title">Mostrar email</p>
                      <p className="setting-description">Tu email será visible para otros</p>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" checked={showEmail} onChange={e => setShowEmail(e.target.checked)} />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  {/* Invites toggle */}
                  <div className="setting-item">
                    <div className="setting-info">
                      <p className="setting-title">Permitir invitaciones</p>
                      <p className="setting-description">Otros usuarios podrán invitarte</p>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" checked={allowInvites} onChange={e => setAllowInvites(e.target.checked)} />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              {/* DELETE / LOGOUT */}
              <div className="action-buttons">
                <button className="btn-delete" onClick={handleDelete}>Eliminar cuenta</button>
                <button className="btn-submit" onClick={() => setShowLogoutModal(true)}>Cerrar sesión</button>
              </div>

            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
