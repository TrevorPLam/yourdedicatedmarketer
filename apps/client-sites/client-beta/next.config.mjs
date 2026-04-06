/** @type {import('next').NextConfig} */

// Build the remote image patterns from environment variables.
// NEXT_PUBLIC_IMAGE_HOST accepts a comma-separated list of production hostnames (e.g. "cdn.client-beta.com,images.client-beta.com").
// In development, localhost is added automatically so local image proxies continue to work.
const productionImageHosts = process.env.NEXT_PUBLIC_IMAGE_HOST
  ? process.env.NEXT_PUBLIC_IMAGE_HOST.split(',').map((h) => h.trim()).filter(Boolean)
  : [];

/** @type {import('next').RemotePattern[]} */
const remotePatterns = productionImageHosts.map((hostname) => ({
  protocol: 'https',
  hostname,
}));

if (process.env.NODE_ENV === 'development') {
  remotePatterns.push({ protocol: 'http', hostname: 'localhost' });
}

const nextConfig = {
  // Next.js 16 Cache Components
  cacheComponents: true,
  
  // React Compiler for automatic memoization
  reactCompiler: true,
  
  reactStrictMode: true,

  // Images optimization
  images: {
    remotePatterns,
    formats: ['image/webp', 'image/avif'],
  },

  // Enhanced security headers (complementing proxy.ts)
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
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), ambient-light-sensor=(), autoplay=(self), encrypted-media=(self), fullscreen=(self), picture-in-picture=(self)',
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
        source: '/((?!api|_next/static|_next/image|images).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, s-maxage=300, stale-while-revalidate=600',
          },
        ],
      },
    ];
  },

  // Turbopack configuration (Next.js 16)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // Turbopack File System Caching (Next.js 16)
  experimental: {
    turbopackFileSystemCacheForDev: true,
    turbopackFileSystemCacheForBuild: true,
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
  
  // Performance optimizations
  transpilePackages: ['@agency/ui-components', '@agency/design-system', '@agency/analytics'],
  poweredByHeader: false,
};

export default nextConfig;
