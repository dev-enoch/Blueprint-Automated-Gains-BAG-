'use server';

import { cookies } from 'next/headers';
import { AUTH_TOKEN_COOKIE } from './constants';
import { adminAuth } from '@/firebase/admin';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/admin';
import type { User } from './types';
import { redirect } from 'next/navigation';

export async function getAuth() {
  const token = cookies().get(AUTH_TOKEN_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userDoc = await getDoc(doc(db, 'users', decodedToken.uid));
    
    if (!userDoc.exists()) {
      return null;
    }
    
    const userProfile = userDoc.data();

    const user: User = {
      id: decodedToken.uid,
      email: decodedToken.email || null,
      role: userProfile.role || 'user'
    };

    return user;
  } catch (error) {
    console.error("Auth error:", error);
    // Clear the cookie if token is invalid
    cookies().delete(AUTH_TOKEN_COOKIE);
    return null;
  }
}

export async function signOut() {
  cookies().delete(AUTH_TOKEN_COOKIE);
  redirect('/login');
}
