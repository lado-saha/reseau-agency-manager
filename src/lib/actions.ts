'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { signOut } from '@/auth';
import { User } from './models/user';
import { UserRepository } from './repo/json-repository';

export async function authenticateUser(
  redirect: boolean,
  email: string, password: string,
): Promise<string | void> {
  try {
    await signIn('credentials', {
      redirect: redirect, // Avoid automatic redirection
      email: email,
      password: password
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          // console.log("sd" + error.cause)
          return error.cause?.err?.message;
      }
    }
    throw error;
  }
}

export async function createUserAction(user: User): Promise<User> {
  return await (new UserRepository().createUser(user))
}

export async function signOutUser() {
  'use server'
  await signOut();
}


