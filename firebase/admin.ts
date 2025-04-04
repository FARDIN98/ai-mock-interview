
/**
 * Firebase Admin SDK initialization module
 * This file sets up the Firebase Admin SDK for server-side operations
 * including authentication and Firestore database access
 */

//const { initializeApp } = require('firebase-admin/app');

/**
 * Import necessary Firebase Admin SDK modules
 * - cert: For creating a credential from service account info
 * - getApps: To check if Firebase has already been initialized
 * - initializeApp: To initialize the Firebase Admin SDK
 * - getAuth: To access Firebase Authentication services
 * - getFirestore: To access Firestore database services
 */
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore"; // Fixed import

/**
 * Initialize Firebase Admin SDK with proper credentials
 * This function ensures Firebase is only initialized once and handles environment variable validation
 * @returns {Object} Object containing Firebase auth and Firestore db instances
 */
const initFirebaseAdmin = () => {
    // Check if Firebase has already been initialized
    const apps = getApps();

    // Check if private key exists in environment variables
    if (!process.env.FIREBASE_PRIVATE_KEY) {
        throw new Error("FIREBASE_PRIVATE_KEY environment variable is not set");
    }

    // Only initialize Firebase if it hasn't been initialized yet
    if(!apps.length){
        initializeApp({
            credential: cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                // Replace escaped newlines with actual newlines in the private key
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
            })
        })
    }

    // Return auth and db instances for use throughout the application
    return {
        auth: getAuth(),
        db: getFirestore()
    }
}

/**
 * Export initialized Firebase auth and Firestore db instances
 * These are used throughout the application for authentication and database operations
 */
export const { auth, db } = initFirebaseAdmin();