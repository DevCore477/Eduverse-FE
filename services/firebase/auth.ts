// src/services/firebaseAuth.ts
import { firebaseAuth } from "@/config/firebase";
import {
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";

export const firebaseRegister = async (
    email: string,
    password: string
) => {
    const res = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
    );

    return res.user.getIdToken(true);
};

export const firebaseLogin = async (
    email: string,
    password: string
) => {
    const res = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
    );

    return res.user.getIdToken(true);
};


export const firebaseLogout = async () => {
    await signOut(
        firebaseAuth
    );

    return
};


export const firebaseResetPassword = async (email: string) => {
    return sendPasswordResetEmail(firebaseAuth, email);
};
