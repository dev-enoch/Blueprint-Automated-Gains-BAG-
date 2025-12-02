'use server';

import * as z from 'zod';
import { adminAuth, db } from '@/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { cookies } from 'next/headers';
import { AUTH_TOKEN_COOKIE } from '@/lib/constants';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function handleRegister(credentials: z.infer<typeof formSchema>) {
  try {
    const parsedCredentials = formSchema.safeParse(credentials);

    if (!parsedCredentials.success) {
      return { error: 'Invalid data provided.' };
    }

    const { email, password } = parsedCredentials.data;
    
    const userRecord = await adminAuth.createUser({
        email,
        password,
        emailVerified: false, // Start with email as not verified
    });
    
    // Set custom claim for role
    await adminAuth.setCustomUserClaims(userRecord.uid, { role: 'user' });

    // Create a user profile document in Firestore
    const userDocRef = db.collection('users').doc(userRecord.uid);
    await userDocRef.set({
        email,
        role: 'user',
        createdAt: FieldValue.serverTimestamp(),
    });
    
    // Optionally, send a verification email
    // Note: In a real app, you would configure SMTP settings for this to work reliably.
    // For now, we will rely on manual verification or directly logging in.
    // await adminAuth.generateEmailVerificationLink(email);
    // This is a simplified registration. The user can now log in.

    return { success: true, userId: userRecord.uid };

  } catch (error: any) {
    let errorMessage = 'An unknown error occurred.';
    if (error.code) {
        switch (error.code) {
            case 'auth/email-already-exists':
                errorMessage = 'An account with this email address already exists.';
                break;
            case 'auth/invalid-password':
                errorMessage = 'Password must be at least 6 characters long.';
                break;
            default:
                errorMessage = 'Failed to create an account. Please try again.';
                break;
        }
    }
    console.error('Registration Error:', error);
    return { error: errorMessage };
  }
}
