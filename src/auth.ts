// src/auth.ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { UserRepository } from '@/lib/repo/json-repository';
import { User } from './lib/models/user';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async (credentials): Promise<User | null> => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }
        const userRepo = new UserRepository();
        const user = await userRepo.verifyUser(
          credentials.email as string,
          credentials.password as string
        );
        if (!user) {
          throw new Error('Invalid credentials');
        }

        return user
      }
    })
  ],

  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAgencyPortal = nextUrl.pathname.startsWith('/agency');
      if (isOnAgencyPortal) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      return true;
    },
    async session({ session, user, token }) {
      if (token.id) {
        session.user.photo = token.picture as string;
        session.user.id = token.id as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        const customUser = user as User
        token.picture = customUser.photo as string;
        token.id = customUser.id
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/new-user?mode=signup',
  },
});
