'use client';

import { ThemeToggle } from '@repo/ui';

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <h1 className="text-xl font-bold">Your Dedicated Marketer</h1>
        <ThemeToggle />
      </div>
    </header>
  );
}
