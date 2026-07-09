import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import React from 'react';
import { ThemeProvider } from '@repo/ui';
import { Toaster } from 'sonner';
import { GA4Script } from '@/components/analytics/ga4-script';
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({ subsets: ['latin'] });
const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display'
});

export const metadata: Metadata = {
  title: 'Your Dedicated Marketer',
  description: 'Professional marketing services',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${spaceGrotesk.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
        <GA4Script />
        <Analytics />
      </body>
    </html>
  );
}
