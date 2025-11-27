import React, { useState } from 'react';
import useAuthStore from '../../stores/useAuthStore';
import { auth } from '../../lib/firebase.config';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuthStore() as any;

  const [editMode, setEditMode] = useState(false);

  // Editable fields
  const [firstName, setFirstName] = useState(user?.displayName?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(user?.displayName?.split(' ').slice(1).join(' ') || '');
  const [age, setAge] = useState(user?.age || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phoneNumber, setPhone] = useState(user?.phoneNumber || '');
  const [role, setRole] = useState(user?.role || '');

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

    // Role: include only if non-empty and cleaned
    if (role && role.trim() !== '') {
      payload.role = role.trim();
    }

    try {
      // Get fresh Firebase ID token (fallback to localStorage)
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

      const res = await fetch('http://localhost:3000/api/users/me', {
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

  // ----------------------------------------
  // LOCAL CHANGE PASSWORD
  // ----------------------------------------
  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      return alert('Las contraseñas no coinciden');
    }

    if (!newPassword || newPassword.length < 6) {
      return alert('La contraseña debe tener al menos 6 caracteres');
    }

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
        console.warn('No token available for change-password request');
        return alert('No se encontró token. Por favor inicia sesión de nuevo.');
      }

      const res = await fetch('http://localhost:3000/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: newPassword }),
      });

      const data = await res.json().catch(() => ({}));
      console.log('change-password response:', res.status, data);

      if (!res.ok) {
        console.error('Change password failed', res.status, data);
        return alert(`❌ Could not change password: ${data?.error?.message || res.status}`);
      }

      alert('✅ Password changed successfully');

      // Reset fields after success
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setShowChangePass(false);
    } catch (err) {
      console.error('Error changing password', err);
      alert('❌ Connection error while changing password');
    }
  };

  // If user is not loaded yet
  if (!user) return <div>Cargando perfil...</div>;

  return (
    <div className="schedule-container">
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
                    <button className="btn-cancel" onClick={() => setShowChangePass(s => !s)}>
                      {showChangePass ? 'Cancelar cambio contraseña' : 'Cambiar contraseña'}
                    </button>

                    {showChangePass && (
                      <div className="form-row" style={{ flexDirection: 'column', gap: 8, marginTop: 8 }}>
                        <input type="password" placeholder="Contraseña actual" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                        <input type="password" placeholder="Nueva contraseña" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                        <input type="password" placeholder="Confirmar nueva contraseña" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} />
                        <button className="btn-submit" onClick={handleChangePassword}>Actualizar contraseña</button>
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
              <button className="btn-submit" onClick={() => { logout(); navigate('/'); }}>Cerrar sesión</button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
