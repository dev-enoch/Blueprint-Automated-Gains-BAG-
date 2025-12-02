import * as admin from 'firebase-admin';
import { getFirebaseConfig } from './config';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!admin.apps.length) {
  if (serviceAccount) {
    // Running on the server, use service account
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(serviceAccount)),
    });
  } else {
    // Running in a local or other environment, use default credentials
     admin.initializeApp({
        projectId: getFirebaseConfig().projectId,
     });
  }
}

export const adminAuth = admin.auth();
export const db = admin.firestore();
