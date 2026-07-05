import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typedRoutes: true,
  transpilePackages: [],
  images: {
    domains: [],
  },
  reactStrictMode: true,
};

export default nextConfig;
