'use server';

import { cookies } from 'next/headers';
import { authenticateUser } from '@/lib/data';
import { AUTH_TOKEN_COOKIE } from '@/lib/constants';
import * as z from 'zod';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});


export async function handleLogin(credentials: z.infer<typeof formSchema>) {
  const parsedCredentials = formSchema.safeParse(credentials);

  if (!parsedCredentials.success) {
    return { error: 'Invalid credentials provided.' };
  }

  const { email, password } = parsedCredentials.data;
  
  const user = await authenticateUser(email, password);

  if (!user || !user.active) {
    return { error: 'Invalid credentials or inactive user.' };
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
