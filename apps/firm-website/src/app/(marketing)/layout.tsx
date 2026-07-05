import { Header, Footer } from '@repo/ui';
import { Twitter, Linkedin, Github } from 'lucide-react';
import { getNavItems } from '@/lib/navigation';
import PageViewTracker from '@/components/analytics/page-view-tracker';

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = await getNavItems();

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
    <>
      <PageViewTracker />
      <Header navItems={navItems} />
      {children}
      <Footer
        navLinks={footerNavLinks}
        contactInfo={contactInfo}
        socialLinks={socialLinks}
      />
    </>
  );
}
