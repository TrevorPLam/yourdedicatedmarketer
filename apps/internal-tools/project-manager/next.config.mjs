/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 16 Cache Components
  cacheComponents: true,
  
  // React Compiler for automatic memoization
  reactCompiler: true,
  
  experimental: {
    // Turbopack File System Caching (Next.js 16)
    turbopackFileSystemCacheForDev: true,
    turbopackFileSystemCacheForBuild: true,
    
    optimizePackageImports: ['@agency/ui-components', 'lucide-react'],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  transpilePackages: ['@agency/ui-components', '@agency/design-system', '@agency/types'],
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Security headers integration with proxy.ts
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Download-Options',
            value: 'noopen',
          },
          {
            key: 'X-Permitted-Cross-Domain-Policies',
            value: 'none',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-origin',
          },
        ],
      },
      {
        // Cache headers for static assets
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache headers for images
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache headers for API responses (shorter TTL)
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        // Cache headers for pages (client-side caching)
        source: '/(?!api|_next/static|_next/image|images).*/',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, s-maxage=300, stale-while-revalidate=600',
          },
        ],
      },
    ];
  },
  
  // Build performance monitoring
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  
  // Performance metrics collection
  webpack: (config, { dev, isServer }) => {
    if (!dev) {
      config.stats = 'normal';
    }
    
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      };
    }
    return config;
  },
  
  // Enable React Compiler for Next.js 16
  reactStrictMode: true,
  swcMinify: true,
  
  // Performance optimizations
  poweredByHeader: false,
  
  transpilePackages: ['@agency/ui-components', '@agency/design-system', '@agency/types'],
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
