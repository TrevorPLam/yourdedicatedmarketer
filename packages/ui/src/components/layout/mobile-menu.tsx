'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { NavLink } from '../navigation/nav-link';

export interface NavItem {
  href: string;
  label: string;
}

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems?: NavItem[];
  currentPath?: string;
}

const MobileMenu = React.forwardRef<HTMLDivElement, MobileMenuProps>(
  ({ isOpen, onClose, navItems = [], currentPath = '' }, ref) => {
    React.useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }

      return () => {
        document.body.style.overflow = '';
      };
    }, [isOpen]);

    React.useEffect(() => {
      const handleEscape = (e: Event) => {
        if ((e as KeyboardEvent).key === 'Escape' && isOpen) {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
      <>
        {/* Overlay */}
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Menu Panel */}
        <div
          ref={ref}
          className={cn(
            'fixed right-0 top-0 z-50 h-full w-3/4 max-w-sm transform bg-background p-6 shadow-lg transition-transform duration-300 ease-in-out',
            'translate-x-0'
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-semibold">Menu</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav>
            <ul className="flex flex-col gap-4">
              {navItems.map((item) => (
                <li key={item.href}>
                  <NavLink
                    href={item.href}
                    isActive={currentPath === item.href}
                    className="text-lg font-medium transition-colors hover:text-primary"
                    onClick={onClose}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </>
    );
  }
);

MobileMenu.displayName = 'MobileMenu';

export { MobileMenu };
