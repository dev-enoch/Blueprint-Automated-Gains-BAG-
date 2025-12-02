import * as admin from 'firebase-admin';
import { getFirebaseConfig } from './config';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!admin.apps.length) {
  if (serviceAccount) {
    // Running on the server, use service account
    try {
      admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(serviceAccount)),
      });
    } catch (e: any) {
      console.error('Firebase admin initialization error', e);
    }
  } else {
    // Do not initialize if service account is not available
    console.warn("FIREBASE_SERVICE_ACCOUNT_KEY is not set. Firebase Admin SDK will not be initialized. This is expected for client-side rendering.");
  }
}

// Ensure admin is initialized before exporting auth and db
const adminAuth = admin.apps.length ? admin.auth() : null;
const db = admin.apps.length ? admin.firestore() : null;

export { adminAuth, db };
