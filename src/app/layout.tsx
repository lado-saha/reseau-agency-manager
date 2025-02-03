import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from 'src/components/theme-provider';
// app/layout.tsx
import { Montserrat } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], // Customize weights as needed
  variable: '--font-montserrat' // Optional: add a CSS variable
});

export const metadata = {
  title: 'Next.js App Router + NextAuth + Tailwind CSS',
  description:
    'A user admin dashboard configured with Next.js, Postgres, NextAuth, Tailwind CSS, TypeScript, and Prettier.'
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const locale = 'en';

  // Providing all messages to the client
  // side is the easiest way to get started
  // const messages = await getMessages();
  return (
    <html
      lang={locale}
      className={montserrat.variable}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen w-full flex-col">
        <SessionProvider session={await auth()}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            {/* </NextIntlClientProvider> */}
          </ThemeProvider>
        </SessionProvider>
      </body>
      <Analytics />
    </html>
  );
}
