'use cache';

import { cacheTag, cacheLife } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth-helpers';

// Configure cache lifecycle and tags for proper invalidation
export const cache = cacheLife('minutes', 5);
export const tags = cacheTag('homepage', 'auth-check');

export default async function HomePage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  redirect('/dashboard');
}
