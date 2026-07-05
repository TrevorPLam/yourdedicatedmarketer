import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import React from 'react';
import { ThemeProvider, Header, Footer } from '@repo/ui';
import { Twitter, Linkedin, Github } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Your Dedicated Marketer',
  description: 'Professional marketing services',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
  ];

  const footerNavLinks = [
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/contact', label: 'Contact' },
  ];

  const contactInfo = {
    email: 'contact@yourdedicatedmarketer.com',
    phone: '+1 (555) 123-4567',
    address: '123 Marketing St, Business City, BC 12345',
  };

  const socialLinks = [
    { href: 'https://twitter.com', icon: <Twitter className="h-5 w-5" />, label: 'Twitter' },
    { href: 'https://linkedin.com', icon: <Linkedin className="h-5 w-5" />, label: 'LinkedIn' },
    { href: 'https://github.com', icon: <Github className="h-5 w-5" />, label: 'GitHub' },
  ];

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header navItems={navItems} />
          {children}
          <Footer
            navLinks={footerNavLinks}
            contactInfo={contactInfo}
            socialLinks={socialLinks}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
