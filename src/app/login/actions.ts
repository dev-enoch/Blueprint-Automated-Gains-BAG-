'use server';

import { cookies } from 'next/headers';
import { getUserByEmail } from '@/lib/data';
import { AUTH_TOKEN_COOKIE } from '@/lib/constants';

export async function handleLogin(token: string) {
  // In a real app, you would validate the custom token with Firebase Admin SDK
  // and get the user ID. For this mock, we'll find the user by email (used as the token).
  const user = await getUserByEmail(token);

  if (!user || !user.active) {
    return { error: 'Invalid token or inactive user.' };
  }

  // The "token" we set in the cookie is just the user ID for this mock.
  cookies().set(AUTH_TOKEN_COOKIE, user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  return { success: true };
}
