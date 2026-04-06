/**
 * SEO Package React Exports
 * React components and hooks for SEO optimization
 */

export { SEOHead } from './components/SEOHead';
export type { SEOHeadProps } from './components/SEOHead';

// React hooks for SEO
export { useSEO, useStructuredData, useOpenGraph } from './hooks/react-hooks';
export type {
  UseSEOOptions,
  UseStructuredDataOptions,
  UseOpenGraphOptions,
} from './hooks/react-hooks';

// React context providers
export { SEOProvider } from './context/seo-provider';
export { useSEOContext } from './context/seo-provider';
export type { SEOProviderProps, SEOContextValue } from './context/seo-provider';
