import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typedRoutes: true,
  transpilePackages: ['@repo/ui'],
  images: {
    domains: [],
  },
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
};

export default nextConfig;
