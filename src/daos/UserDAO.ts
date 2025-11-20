// UserDAO.ts
import { doc, setDoc, getDoc, updateDoc, deleteDoc, serverTimestamp, collection } from "firebase/firestore";
import type { CollectionReference } from "firebase/firestore";
import { db } from "../lib/firebase.config";

export interface User {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
    createdAt?: any;
    updatedAt?: any;
}

export type UserCreate = Omit<User, "createdAt" | "updatedAt">;
export type UserUpdate = Partial<Omit<User, "uid" | "createdAt">>;

export default class UserDAO {
    private static collectionRef: CollectionReference = collection(db, "users");

    // 👉 Crear o actualizar usuario
    static async createUser(user: UserCreate) {
        const ref = doc(this.collectionRef, user.uid);

        await setDoc(ref, {
            ...user,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        }, { merge: true });

        console.log("🔥 User creado/actualizado en Firestore:", user.uid);
    }

    static async getUserById(uid: string) {
        const snap = await getDoc(doc(this.collectionRef, uid));
        return snap.exists() ? snap.data() : null;
    }

    static async updateUser(uid: string, data: UserUpdate) {
        await updateDoc(doc(this.collectionRef, uid), {
            ...data,
            updatedAt: serverTimestamp(),
        });
    }

    static async deleteUser(uid: string) {
        await deleteDoc(doc(this.collectionRef, uid));
    }
}
