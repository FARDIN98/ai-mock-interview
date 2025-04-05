/**
 * Authentication Server Actions
 * 
 * This file contains server-side functions for user authentication
 * using Firebase Authentication and Firestore for user data storage.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import {db, auth} from "@/firebase/admin";
import {cookies} from "next/headers";

// Session cookie duration (1 week)
const ONE_WEEK = 60 * 60 * 24 * 7;

/**
 * Creates a new user account in Firestore
 * @param params - Object containing user details (uid, name, email)
 * @returns Object with success status and message
 */
export async function signUp(params: SignUpParams) {
    const { uid, name, email } = params;

    try {
        const userRecord = await db.collection('users').doc(uid).get();

        if(userRecord.exists) {
            return {
                success: false,
                message: 'User already exists. Please sign in instead.'
            }
        }

        await db.collection('users').doc(uid).set({
            name, email
        })

        return {
            success: true,
            message: 'Account created successfully. Please sign in.'
        }
    } catch (e: any) {
        console.error('Error creating a user', e);

        if(e.code === 'auth/email-already-exists') {
            return {
                success: false,
                message: 'This email is already in use.'
            }
        }

        return {
            success: false,
            message: 'Failed to create an account'
        }
    }
}

/**
 * Authenticates a user and creates a session cookie
 * @param params - Object containing email and idToken from Firebase Auth
 * @returns Object with success status and user data if successful
 */
export async function signIn(params: SignInParams) {
    const { email, idToken } = params;

    try {
        const userRecord = await auth.getUserByEmail(email);

        if(!userRecord) {
            return {
                success: false,
                message: 'User does not exist. Create an account instead.'
            }
        }

        await setSessionCookie(idToken);
    } catch (e) {
        console.log(e);

        return {
            success: false,
            message: 'Failed to log into an account.'
        }
    }
}

/**
 * Creates a session cookie for authenticated users
 * @param idToken - Firebase authentication token
 * Sets an HTTP-only cookie with the session information
 */
export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK * 1000,
    })

    cookieStore.set('session', sessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax'
    })
}

/**
 * Retrieves the currently authenticated user from the session cookie
 * @returns User object if authenticated, null otherwise
 */
export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get('session')?.value;

    if(!sessionCookie) return null;

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

        const userRecord = await db
            .collection('users')
            .doc(decodedClaims.uid)
            .get()
            .catch(() => null);

        if(!userRecord?.exists) return null;

        return {
            ...userRecord.data(),
            id: userRecord.id,
        } as User;
    } catch (e) {
        console.log(e)

        return null;
    }
}

/**
 * Checks if a user is currently authenticated
 * @returns Boolean indicating authentication status
 */
export async function isAuthenticated() {
    const user = await getCurrentUser();

    return !!user;
}

/**
 * Logs out the current user by clearing the session cookie
 * @returns Object with success status and message
 */
export async function signOut() {
    const cookieStore = await cookies();
    
    // Delete the session cookie by setting maxAge to 0
    cookieStore.set('session', '', {
        maxAge: 0,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax'
    });

    return {
        success: true,
        message: 'Logged out successfully'
    };
}