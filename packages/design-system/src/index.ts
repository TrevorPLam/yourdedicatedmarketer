// Design system main exports
export * from './tokens';
export { createThemeContext, cssThemeUtils } from './themes';

// Design system version
export const DESIGN_SYSTEM_VERSION = '1.0.0';

// Utility function to get design system info
export const getDesignSystemInfo = () => ({
  version: DESIGN_SYSTEM_VERSION,
  features: {
    tailwindCSSv4: true,
    oklchColorSpace: true,
    fluidTypography: true,
    containerQueries: true,
    cssFirstConfig: true,
    automaticContentDetection: true,
  },
  browsers: {
    chrome: '111+',
    firefox: '113+',
    safari: '16.4+',
    edge: '111+',
  },
});
