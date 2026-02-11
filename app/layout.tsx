import type { Metadata } from 'next';
import {
  Geist_Mono,
  Inter,
  Roboto,
  Open_Sans,
  Lato,
  Playfair_Display,
  Merriweather
} from 'next/font/google';
import {
  AuthKitProvider,
  Impersonation
} from '@workos-inc/authkit-nextjs/components';
import { ConvexClientProvider } from '@/providers/ConvexProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto'
});
const openSans = Open_Sans({ subsets: ['latin'], variable: '--font-opensans' });
const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-lato'
});
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair'
});
const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-merriweather'
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Resume Builder',
  description: 'Build beautiful resumes with ease'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontVariables = [
    inter.variable,
    roboto.variable,
    openSans.variable,
    lato.variable,
    playfair.variable,
    merriweather.variable,
    geistMono.variable
  ].join(' ');

  return (
    <html
      lang="en"
      className={`${inter.className} ${fontVariables}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <AuthKitProvider>
          <Impersonation />
          <ConvexClientProvider>
            <QueryProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
              >
                {children}
              </ThemeProvider>
            </QueryProvider>
          </ConvexClientProvider>
        </AuthKitProvider>
      </body>
    </html>
  );
}
