import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'adapters/index': 'src/adapters/index.ts',
    'monitoring/index': 'src/monitoring/index.ts',
    'utils/index': 'src/utils/index.ts'
  },
  format: ['esm'],
  dts: true,
  clean: true,
  external: [
    '@agency/types',
    'node-fetch'
  ],
  splitting: false,
  sourcemap: true,
  minify: false,
  target: 'es2022',
  banner: {
    js: `
/**
 * @agency/deployment - Platform Deployment Package
 * 
 * Comprehensive deployment automation platform supporting Vercel, Netlify, 
 * Cloudflare Pages with zero-downtime deployments and monitoring.
 * 
 * @version 1.0.0
 * @license MIT
 */
    `
  }
});
