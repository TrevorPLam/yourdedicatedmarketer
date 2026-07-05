import * as React from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { Mail, Phone, MapPin } from 'lucide-react';

import { Container } from '../ui/container';
import { cn } from '#lib/utils';

export interface NavItem {
  href: string;
  label: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
}

export interface SocialLink {
  href: string;
  icon: React.ReactNode;
  label: string;
}

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  navLinks?: NavItem[];
  contactInfo?: ContactInfo;
  socialLinks?: SocialLink[];
  copyright?: string;
}

const Footer = React.forwardRef<HTMLElement, FooterProps>(
  ({ 
    className, 
    logo,
    navLinks = [],
    contactInfo = {},
    socialLinks = [],
    copyright = `© ${new Date().getFullYear()} Your Dedicated Marketer. All rights reserved.`,
    ...props 
  }, ref) => {
    return (
      <footer
        ref={ref}
        className={cn('border-t bg-muted/50', className)}
        {...props}
      >
        <Container>
          <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-4">
            {/* Logo and Description */}
            <div className="space-y-4">
              {logo || (
                <div className="text-xl font-bold">
                  Your Dedicated Marketer
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                Professional marketing services to help your business grow.
              </p>
            </div>

            {/* Navigation Links */}
            {navLinks.length > 0 && (
              <div>
                <h3 className="mb-4 text-sm font-semibold">Navigation</h3>
                <nav>
                  <ul className="space-y-2">
                    {navLinks.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href as Route}
                          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            )}

            {/* Contact Info */}
            {(contactInfo.email || contactInfo.phone || contactInfo.address) && (
              <div>
                <h3 className="mb-4 text-sm font-semibold">Contact</h3>
                <ul className="space-y-2">
                  {contactInfo.email && (
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <a
                        href={`mailto:${contactInfo.email}`}
                        className="transition-colors hover:text-foreground"
                      >
                        {contactInfo.email}
                      </a>
                    </li>
                  )}
                  {contactInfo.phone && (
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <a
                        href={`tel:${contactInfo.phone}`}
                        className="transition-colors hover:text-foreground"
                      >
                        {contactInfo.phone}
                      </a>
                    </li>
                  )}
                  {contactInfo.address && (
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mt-0.5" />
                      <span>{contactInfo.address}</span>
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div>
                <h3 className="mb-4 text-sm font-semibold">Follow Us</h3>
                <div className="flex gap-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.href}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Copyright */}
          <div className="border-t py-6">
            <p className="text-center text-sm text-muted-foreground">
              {copyright}
            </p>
          </div>
        </Container>
      </footer>
    );
  }
);

Footer.displayName = 'Footer';

export { Footer };
