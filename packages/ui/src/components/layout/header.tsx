'use client';

import * as React from 'react';
import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import { Container } from '../ui/container';
import { Button } from '../ui/button';
import { ThemeToggle } from '../../theme-toggle';
import { NavLink } from '../navigation/nav-link';
import { MobileMenu } from './mobile-menu';

export interface NavItem {
  href: string;
  label: string;
}

export interface HeaderProps {
  navItems?: NavItem[];
  logo?: React.ReactNode;
}

const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ navItems = [], logo }, ref) => {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const pathname = usePathname();

    return (
      <header
        ref={ref}
        className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <Container>
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              {logo || (
                <Link href="/" className="text-xl font-bold">
                  Logo
                </Link>
              )}
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex md:items-center md:gap-6">
              <ul className="flex items-center gap-6">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>
                      <NavLink
                        href={item.href}
                        isActive={pathname === item.href}
                        className="text-sm font-medium transition-colors hover:text-primary"
                      >
                        {item.label}
                      </NavLink>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Right side: Theme Toggle and Mobile Menu Button */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </Container>

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          navItems={navItems}
          currentPath={pathname}
        />
      </header>
    );
  }
);

Header.displayName = 'Header';

export { Header };
