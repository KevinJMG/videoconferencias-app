import React, { useEffect, useState } from 'react';
import useAuthStore from '../../stores/useAuthStore';
import UserDAO from '../../daos/UserDAO';
import './ProfileEdit.css';
import PasswordField from '../../components/PasswordField';
import { auth as firebaseAuthClient } from '../../lib/firebase.config';

const EditProfile: React.FC = () => {
  const { user, logout } = useAuthStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');

  const [meetings, setMeetings] = useState<number | null>(null);
  const [hoursConnected, setHoursConnected] = useState<number | null>(null);
  const [memberSince, setMemberSince] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    setEmail(user.email ?? '');
    const parts = (user.displayName || '').split(' ');
    setFirstName(parts[0] || '');
    setLastName(parts.slice(1).join(' ') || '');

    // intentar obtener datos adicionales desde Firestore
    (async () => {
      // Primero intentar obtener perfil desde el backend (/api/users/me)
      const base = (import.meta as any).env.VITE_API_URL || 'http://localhost:3000';
      try {
        let idToken = localStorage.getItem('idToken');
        if (!idToken && firebaseAuthClient?.currentUser) {
          try {
            idToken = await firebaseAuthClient.currentUser.getIdToken();
            if (idToken) localStorage.setItem('idToken', idToken);
          } catch (err) {
            console.warn('No se pudo obtener idToken desde Firebase client', err);
          }
        }

        if (idToken) {
          const resp = await fetch(`${base}/api/users/me`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${idToken}`,
            },
          });
          if (resp.ok) {
            const json = await resp.json().catch(() => null);
            if (json?.data) {
              const data = json.data;
              if (data.displayName) {
                const p = (data.displayName as string).split(' ');
                setFirstName(p[0] || '');
                setLastName(p.slice(1).join(' ') || '');
              }
              setEmail(data.email ?? (user.email ?? ''));
              setPhone(data.phone ?? '');
              setCompany(data.company ?? '');
              setPosition(data.position ?? '');
              setMeetings(data.meetingsCount ?? 0);
              setHoursConnected(data.hoursConnected ?? 0);
              if (data.createdAt && data.createdAt.toDate) {
                setMemberSince(new Date(data.createdAt.toDate()).toLocaleDateString());
              } else if (data.createdAt) {
                setMemberSince(new Date(data.createdAt).toLocaleDateString());
              }
              // If backend returned a full profile, skip Firestore fallback
              return;
            }
          }
        }
      } catch (err) {
        console.warn('No se pudo cargar perfil desde backend', err);
      }

      // Fallback: intentar obtener datos adicionales desde Firestore
      try {
        const data: any = await UserDAO.getUserById(user.uid);
        if (data) {
          // Preferir datos almacenados en Firestore si existen
          if (data.displayName) {
            const p = (data.displayName as string).split(' ');
            setFirstName(p[0] || '');
            setLastName(p.slice(1).join(' ') || '');
          }
          setMeetings(data.meetingsCount ?? 0);
          setHoursConnected(data.hoursConnected ?? 0);
          if (data.createdAt && data.createdAt.toDate) {
            setMemberSince(new Date(data.createdAt.toDate()).toLocaleDateString());
          } else if (data.createdAt) {
            setMemberSince(new Date(data.createdAt).toLocaleDateString());
          }

          setEmail(data.email ?? (user.email ?? ''));
          setPhone(data.phone ?? '');
          setCompany(data.company ?? '');
          setPosition(data.position ?? '');
        }
      } catch (e) {
        console.error('Error cargando datos de usuario', e);
      }
    })();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    const displayName = `${firstName} ${lastName}`.trim();

    try {
      // Actualizar Firestore
      await UserDAO.updateUser(user.uid, {
        displayName,
        email,
        phone,
        company,
        position,
      });

      // Enviar al backend en formato JSON (si existe URL configurada)
      const base = (import.meta as any).env.VITE_API_URL || 'http://localhost:3000';
      try {
        let idToken = localStorage.getItem('idToken');
        if (!idToken && firebaseAuthClient?.currentUser) {
          try {
            idToken = await firebaseAuthClient.currentUser.getIdToken();
            if (idToken) localStorage.setItem('idToken', idToken);
          } catch (err) {
            console.warn('No se pudo obtener idToken desde Firebase client', err);
          }
        }

        await fetch(`${base}/api/users/me`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
          },
          body: JSON.stringify({ displayName, email, phone, company, position }),
        });
      } catch (e) {
        console.warn('No se pudo enviar datos al backend', e);
      }

      alert('Cambios guardados correctamente.');
    } catch (e) {
      console.error(e);
      alert('Ocurrió un error al guardar.');
    }
  };

  const [showChangePass, setShowChangePass] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleChangePassword = async () => {
    if (!user) return;
    if (!newPassword || newPassword !== confirmNewPassword) {
      alert('Las nuevas contraseñas no coinciden');
      return;
    }

    const base = (import.meta as any).env.VITE_API_URL || 'http://localhost:3000';
    try {
      let idToken = localStorage.getItem('idToken');
      if (!idToken && firebaseAuthClient?.currentUser) {
        try {
          idToken = await firebaseAuthClient.currentUser.getIdToken();
          if (idToken) localStorage.setItem('idToken', idToken);
        } catch (err) {
          console.warn('No se pudo obtener idToken desde Firebase client', err);
        }
      }

      const resp = await fetch(`${base}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!resp.ok) {
        const data = await resp.json();
        alert(data?.message || 'Error cambiando la contraseña');
        return;
      }

      alert('Contraseña actualizada correctamente');
      setShowChangePass(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (e) {
      console.error(e);
      alert('Error en la conexión al backend');
    }
  };

  const handleDelete = async () => {
    if (!user) return;

    const ok = window.confirm('Vas a eliminar tu cuenta. ¿Estás seguro? Esta acción no se puede deshacer.');
    if (!ok) return;

    // feedback inmediatamente
    alert('Eliminando cuenta...');

    const base = (import.meta as any).env.VITE_API_URL || 'http://localhost:3000';

    try {
      let idToken = localStorage.getItem('idToken');
      if (!idToken && firebaseAuthClient?.currentUser) {
        try {
          idToken = await firebaseAuthClient.currentUser.getIdToken();
          if (idToken) localStorage.setItem('idToken', idToken);
        } catch (err) {
          console.warn('No se pudo obtener idToken desde Firebase client', err);
        }
      }

      // intentar eliminar en backend primero
      try {
        await fetch(`${base}/api/users/me`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
          },
        });
      } catch (be) {
        console.warn('No se pudo eliminar en backend, se continúa con Firestore', be);
      }

      // eliminar en Firestore
      await UserDAO.deleteUser(user.uid);

      // cerrar sesión localmente
      await logout();
      alert('Cuenta eliminada.');
    } catch (e) {
      console.error(e);
      alert('Ocurrió un error al eliminar la cuenta.');
    }
  };

  return (
    <div className="edit-profile-page container-page">
      <div className="edit-grid">
        <div className="left-column">
          <div className="card profile-card">
            <div className="avatar">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="avatar" />
              ) : (
                <div className="avatar-placeholder">{(user?.displayName || 'U').charAt(0)}</div>
              )}
            </div>
            <div className="profile-info">
              <h3>{user?.displayName}</h3>
              <p>{user?.email}</p>
            </div>
          </div>

          <div className="card stats-card">
            <h4>Estadísticas</h4>
            <ul>
              <li>1. Reuniones realizadas: <strong>{meetings ?? '—'}</strong></li>
              <li>2. Horas conectado: <strong>{hoursConnected ?? '—'}</strong></li>
              <li>3. Miembro desde: <strong>{memberSince ?? '—'}</strong></li>
            </ul>
          </div>
        </div>

        <div className="right-column">
          <div className="card info-card">
            <h4>Información Personal</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Nombre</label>
                <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Apellido</label>
                <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full">
                <label>Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Teléfono</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Empresa</label>
                <input value={company} onChange={(e) => setCompany(e.target.value)} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full">
                <label>Cargo</label>
                <input value={position} onChange={(e) => setPosition(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="card privacy-card">
            <h4>Privacidad y Seguridad</h4>
            <div className="privacy-item">
              <label>Perfil público</label>
              <input type="checkbox" />
            </div>
            <div className="privacy-item">
              <label>Mostrar email</label>
              <input type="checkbox" />
            </div>
            <div className="privacy-item">
              <label>Permitir invitaciones</label>
              <input type="checkbox" />
            </div>
            <div style={{ marginTop: 12 }}>
              <button type="button" className="btn save" onClick={() => setShowChangePass((s) => !s)}>
                {showChangePass ? 'Cancelar cambio de contraseña' : 'Cambiar contraseña'}
              </button>

              {showChangePass && (
                <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <PasswordField
                    placeholder="Contraseña actual"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword((e.target as HTMLInputElement).value)}
                  />
                  <PasswordField
                    placeholder="Nueva contraseña"
                    value={newPassword}
                    onChange={(e) => setNewPassword((e.target as HTMLInputElement).value)}
                  />
                  <PasswordField
                    placeholder="Confirmar nueva contraseña"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword((e.target as HTMLInputElement).value)}
                  />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button type="button" className="btn save" onClick={handleChangePassword}>Actualizar contraseña</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="actions">
            <button className="btn save" onClick={handleSave}>Guardar cambios</button>
            <button className="btn delete" onClick={handleDelete}>Eliminar cuenta</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
