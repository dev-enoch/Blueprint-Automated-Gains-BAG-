'use server';

import { cookies } from 'next/headers';
import { getUserByEmail, getUserById } from './data';
import { redirect } from 'next/navigation';

export const AUTH_TOKEN_COOKIE = '__initial_auth_token';

export async function getAuth() {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value;

  if (!token) {
    return null;
  }

  // In a real app, you'd validate the token against Firebase Auth
  // For this mock, the token is the user ID.
  const user = await getUserById(token);

  if (!user || !user.active) {
    // If user not found or inactive, clear the cookie and treat as logged out
    cookieStore.delete(AUTH_TOKEN_COOKIE);
    return null;
  }
  
  return user;
}

export async function signOut() {
  const cookieStore = cookies();
  cookieStore.delete(AUTH_TOKEN_COOKIE);
  redirect('/login');
}
