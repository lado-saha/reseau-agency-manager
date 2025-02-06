// src/auth.ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { UserRepository } from '@/lib/repo/json-repository';


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async (credentials) => {
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
      if (token?.role) {
        session.user.role = token.role;
        session.user.photo = token.photo;
        session.user.id = token.id;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.photo = user.photo;
        token.id = user.id
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/signup',
  }
});
