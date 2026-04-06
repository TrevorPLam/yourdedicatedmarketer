/**
 * CSP Nonce React Hook
 * 
 * React hook and components for accessing CSP nonces in React applications.
 * Provides both server-side and client-side nonce access for dynamic content.
 * 
 * Version: 2.0.0
 * Updated: April 2026
 */

'use client';

import { useEffect, useState } from 'react';

// Client-side nonce cache
let cachedNonces: { script: string | null; style: string | null } = {
  script: null,
  style: null,
};

// Get nonce from meta tags (client-side)
function getNonceFromMeta(type: 'script' | 'style'): string | null {
  if (typeof window === 'undefined') return null;
  
  // Return cached value if available
  if (cachedNonces[type]) {
    return cachedNonces[type];
  }
  
  // Try to get from meta tag
  const metaTag = document.querySelector(`meta[name="csp-${type}-nonce"]`);
  const nonce = metaTag?.getAttribute('content') || null;
  
  // Cache the result
  cachedNonces[type] = nonce;
  
  return nonce;
}

// Main hook for accessing CSP nonces
export function useNonce(type: 'script' | 'style' = 'script'): string | null {
  const [nonce, setNonce] = useState<string | null>(() => getNonceFromMeta(type));
  
  useEffect(() => {
    // Update nonce if meta tags change (unlikely but defensive)
    const checkNonce = () => {
      const newNonce = getNonceFromMeta(type);
      if (newNonce !== nonce) {
        setNonce(newNonce);
      }
    };
    
    // Check immediately and set up interval for dynamic changes
    checkNonce();
    const interval = setInterval(checkNonce, 1000);
    
    return () => clearInterval(interval);
  }, [type, nonce]);
  
  return nonce;
}

// Hook for both script and style nonces
export function useNonces(): { script: string | null; style: string | null } {
  const scriptNonce = useNonce('script');
  const styleNonce = useNonce('style');
  
  return { script: scriptNonce, style: styleNonce };
}

// Higher-order component for adding nonce to inline scripts
export function withScriptNonce<T extends object>(Component: React.ComponentType<T>) {
  return function NonceScriptComponent(props: T) {
    const scriptNonce = useNonce('script');
    
    return <Component {...props} scriptNonce={scriptNonce} />;
  };
}

// Higher-order component for adding nonce to inline styles
export function withStyleNonce<T extends object>(Component: React.ComponentType<T>) {
  return function NonceStyleComponent(props: T) {
    const styleNonce = useNonce('style');
    
    return <Component {...props} styleNonce={styleNonce} />;
  };
}

// Component for safe inline scripts with nonce
interface SafeInlineScriptProps extends React.ScriptHTMLAttributes<HTMLScriptElement> {
  children?: string;
}

export function SafeInlineScript({ children, ...props }: SafeInlineScriptProps) {
  const scriptNonce = useNonce('script');
  
  if (!scriptNonce) {
    console.warn('No script nonce available - inline script may be blocked by CSP');
    return null;
  }
  
  return (
    <script {...props} nonce={scriptNonce}>
      {children}
    </script>
  );
}

// Component for safe inline styles with nonce
interface SafeInlineStyleProps extends React.StyleHTMLAttributes<HTMLStyleElement> {
  children?: string;
}

export function SafeInlineStyle({ children, ...props }: SafeInlineStyleProps) {
  const styleNonce = useNonce('style');
  
  if (!styleNonce) {
    console.warn('No style nonce available - inline style may be blocked by CSP');
    return null;
  }
  
  return (
    <style {...props} nonce={styleNonce}>
      {children}
    </style>
  );
}

// Utility function to create nonce-aware script strings
export function createNonceScript(scriptContent: string, nonce: string): string {
  if (!nonce) {
    console.warn('No nonce provided for script content');
    return '';
  }
  
  return `<script nonce="${nonce}">${scriptContent}</script>`;
}

// Utility function to create nonce-aware style strings
export function createNonceStyle(styleContent: string, nonce: string): string {
  if (!nonce) {
    console.warn('No nonce provided for style content');
    return '';
  }
  
  return `<style nonce="${nonce}">${styleContent}</style>`;
}

// Development utility to validate CSP compliance
export function validateCSPCompliance(): boolean {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
    return true;
  }
  
  const scriptNonce = getNonceFromMeta('script');
  const styleNonce = getNonceFromMeta('style');
  
  const issues: string[] = [];
  
  if (!scriptNonce) {
    issues.push('No script nonce found in meta tags');
  }
  
  if (!styleNonce) {
    issues.push('No style nonce found in meta tags');
  }
  
  // Check for CSP header
  const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (!cspMeta) {
    issues.push('No CSP meta tag found');
  }
  
  if (issues.length > 0) {
    console.warn('CSP Compliance Issues:', issues);
    return false;
  }
  
  return true;
}

export default {
  useNonce,
  useNonces,
  withScriptNonce,
  withStyleNonce,
  SafeInlineScript,
  SafeInlineStyle,
  createNonceScript,
  createNonceStyle,
  validateCSPCompliance,
};
