/**
 * Brand kit registry.
 *
 * Client-specific brand kits are defined here and extended by each
 * client theme.  Add a new export per client in this file; the tsup
 * build will emit them under dist/brand-kits/ to satisfy the
 * ./brand-kits package export.
 */

export interface BrandKit {
  /** Human-readable client or brand name. */
  name: string;
  /** Primary brand color expressed as a CSS value (hex, rgb, oklch, etc.). */
  primaryColor: string;
  /** Secondary brand color. */
  secondaryColor: string;
  /** Accent color used for calls-to-action. */
  accentColor: string;
  /** Primary font family declaration. */
  fontFamily: string;
}

/** Default agency brand kit – used when no client override is specified. */
export const defaultBrandKit: BrandKit = {
  name: 'Agency Default',
  primaryColor: '#3b82f6',
  secondaryColor: '#64748b',
  accentColor: '#f59e0b',
  fontFamily: 'Inter, system-ui, sans-serif',
};

/** Alpha client brand kit. */
export const alphaBrandKit: BrandKit = {
  name: 'Alpha',
  primaryColor: '#2563eb',
  secondaryColor: '#475569',
  accentColor: '#f97316',
  fontFamily: 'Inter, system-ui, sans-serif',
};

/** Beta client brand kit. */
export const betaBrandKit: BrandKit = {
  name: 'Beta',
  primaryColor: '#16a34a',
  secondaryColor: '#4b5563',
  accentColor: '#eab308',
  fontFamily: 'Inter, system-ui, sans-serif',
};

/** Gamma client brand kit. */
export const gammaBrandKit: BrandKit = {
  name: 'Gamma',
  primaryColor: '#7c3aed',
  secondaryColor: '#6b7280',
  accentColor: '#ec4899',
  fontFamily: 'Inter, system-ui, sans-serif',
};

/** Registry mapping brand-kit names to their configurations. */
export const brandKits: Record<string, BrandKit> = {
  default: defaultBrandKit,
  alpha: alphaBrandKit,
  beta: betaBrandKit,
  gamma: gammaBrandKit,
};

/**
 * Look up a brand kit by name.  Falls back to the default kit when the
 * requested kit is not found.
 */
export function getBrandKit(name: string): BrandKit {
  return brandKits[name] ?? defaultBrandKit;
}
