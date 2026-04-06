import { nextAuthHandler } from '@/proxy';

// Export the enhanced NextAuth handler
export { nextAuthHandler as GET, nextAuthHandler as POST };

// Edge runtime configuration for better performance
export const runtime = 'edge';
