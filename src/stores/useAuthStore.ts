import { create } from 'zustand';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase.config';
import UserDAO from "../daos/UserDAO";

export interface User {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
}

type AuthStore = {
    user: User | null;
    setUser: (user: User | null) => void;
    initAuthObserver: () => () => void;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
};

const useAuthStore = create<AuthStore>((set) => ({

    user: null,

    setUser: (user) => set({ user }),

    initAuthObserver: () => {
    // Subscribe to both auth state and id token changes so we always persist
    // a fresh idToken and keep Zustand user in sync.
    const unsubAuth = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {

            // Persist a fresh idToken for backend requests (legacy fallback)
            try {
                const token = await fbUser.getIdToken(true);
                if (token) {
                    try {
                        localStorage.setItem('idToken', token);
                        try { window.dispatchEvent(new CustomEvent('idTokenUpdated')); } catch (e) { /** ignore */ }
                    } catch (e) {
                        // ignore storage errors
                    }
                }
            } catch (e) {
                console.warn('useAuthStore: failed to refresh idToken on auth state change', e);
            }

            // 1️⃣ Crear/actualizar usuario en Firestore
            await UserDAO.createUser({
                uid: fbUser.uid,
                displayName: fbUser.displayName,
                email: fbUser.email,
                photoURL: fbUser.photoURL,
            });

            // 2️⃣ Obtener datos COMPLETOS desde Firestore
            const userFromDb = await UserDAO.getUserById(fbUser.uid);

            // 3️⃣ Guardar en Zustand
            set({ user: userFromDb as any });

        } else {
            set({ user: null });
            try { localStorage.removeItem('idToken'); } catch (e) { /** ignore */ }
            try { window.dispatchEvent(new CustomEvent('idTokenUpdated')); } catch (e) { /** ignore */ }
        }
    });

    // Keep idToken up-to-date when Firebase refreshes it (token rotation)
    const unsubToken = (auth as any).onIdTokenChanged
        ? (auth as any).onIdTokenChanged(async (fbUser: any) => {
            if (fbUser) {
                try {
                    const token = await fbUser.getIdToken(true);
                    if (token) {
                        try { localStorage.setItem('idToken', token); } catch (e) { /** ignore */ }
                        try { window.dispatchEvent(new CustomEvent('idTokenUpdated')); } catch (e) { /** ignore */ }
                    }
                } catch (e) {
                    console.warn('useAuthStore: onIdTokenChanged failed to refresh token', e);
                }
            }
        })
        : () => {};

    return () => {
        try { unsubAuth(); } catch (e) { /* ignore */ }
        try { unsubToken(); } catch (e) { /* ignore */ }
    };
},


    loginWithGoogle: async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (e) {
            console.error(e);
        }
    },

    logout: async () => {
        try {
            await signOut(auth);
        } catch (e) {
            console.error(e);
        }
    },

}));

export default useAuthStore;
