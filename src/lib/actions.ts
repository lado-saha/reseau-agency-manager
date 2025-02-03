'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { JsonRepository } from './repository/JsonRepository';
import { User } from './models/user';
import { signOut } from '@/auth';
import { hash } from 'bcryptjs';

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
export async function createNewUser(name: string,
  email: string,
  role: 'admin' | 'super-admin' | 'normal',
  password: string,
  sex: 'male' | 'female',
  photoFile: File): Promise<User> {
  const repo = new JsonRepository<User>('users.json');
  return await repo.createUser(
    name,
    email,
    role,
    password, // Ensure you have a password hashing function
    sex,
    photoFile, // Store the filename or URL
  );

}

// export async function createNewUser(
//   name: string, email: string, role: string, password: string
// ): Promise<string | void> {
//   try {
//     const repo = new JsonRepository<User>('users.json');
//     await repo.createUser(name, email, role, password); // Ensure createUser is awaited

//     // Log the success for monitoring purposes
//     console.log(`User created successfully: ${email} with role ${role}`);

//   } catch (error) {
//     // Improved error logging
//     console.error('Error during user creation:', error);
//     return (error instanceof Error) ? error.message : 'Unknown error occurred during user creation.';
//   }
// }
export async function signOutUser() {
  'use server'
  await signOut();
}


