// src/auth.ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { JsonRepository } from '@/lib/repository/JsonRepository';
import { User } from '@/lib/models/user';
// import { ZodError } from 'zod';

const userRepo = new JsonRepository<User>('users.json');

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
      const isOnAgencyPortal = nextUrl.pathname.startsWith('/station');
      if (isOnAgencyPortal) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/station/vehicles', nextUrl));
      }
      return true;
    },
    async session({ session, user, token }) {
      if (token?.role) {
        session.user.role = token.role; // ✅ Add custom field
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // ✅ Store in JWT
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: '/auth/login',
    // newUser: '/auth/signup'
  }
});
