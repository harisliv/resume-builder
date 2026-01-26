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
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import {
  AuthKitProvider,
  Impersonation
} from '@workos-inc/authkit-nextjs/components';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { ResumeFormProvider } from '@/components/providers/ResumeFormProvider';
import { AppSidebar } from '@/components/ui/app-sidebar';
import { ConvexClientProvider } from '@/components/providers/ConvexProvider';

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
    <html lang="en" className={`${inter.className} ${fontVariables}`} suppressHydrationWarning>
      <body className="antialiased font-sans">
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
                <SidebarProvider>
                  <ResumeFormProvider>
                    <AppSidebar />
                    <SidebarInset>
                      <div className="w-full max-w-[2000px] mx-auto h-screen overflow-hidden">
                        {children}
                      </div>
                    </SidebarInset>
                  </ResumeFormProvider>
                </SidebarProvider>
              </ThemeProvider>
            </QueryProvider>
          </ConvexClientProvider>
        </AuthKitProvider>
      </body>
    </html>
  );
}
