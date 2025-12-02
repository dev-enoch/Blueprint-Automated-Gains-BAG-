'use server';

import { cookies } from 'next/headers';
import { AUTH_TOKEN_COOKIE } from '@/lib/constants';
import * as z from 'zod';
import { signInWithEmailAndPassword, getIdToken } from 'firebase/auth';
import { auth } from '@/firebase/client';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function handleLogin(credentials: z.infer<typeof formSchema>) {
  try {
    const parsedCredentials = formSchema.safeParse(credentials);

    if (!parsedCredentials.success) {
      return { error: 'Invalid credentials provided.' };
    }

    const { email, password } = parsedCredentials.data;
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();

    cookies().set(AUTH_TOKEN_COOKIE, idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return { success: true };
  } catch (error: any) {
    let errorMessage = 'An unknown error occurred.';
    if (error.code) {
        switch (error.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
                errorMessage = 'Invalid email or password.';
                break;
            default:
                errorMessage = 'Failed to sign in. Please try again.';
                break;
        }
    }
    console.error('Login Error:', error);
    return { error: errorMessage };
  }
}
