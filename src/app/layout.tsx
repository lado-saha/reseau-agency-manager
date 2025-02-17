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
  title: 'Travelo',
  description:
    'Trip paradise'
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
      className={`${montserrat.variable} antialiased`}
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
          </ThemeProvider>
        </SessionProvider>
      </body>
      <Analytics />
    </html>
  );
}
