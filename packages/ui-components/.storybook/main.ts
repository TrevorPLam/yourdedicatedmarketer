import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-links',
    '@storybook/test',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  typescript: {
    // Use react-docgen for faster performance (50% faster startup)
    reactDocgen: 'react-docgen',
    // Fallback to react-docgen-typescript if needed
    check: false,
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  viteFinal: async (config) => {
    // Ensure design system styles are available
    if (!config.css) config.css = {};
    if (!config.css.postcss) config.css.postcss = {};

    return config;
  },
  env: (config) => ({
    ...config,
    STORYBOOK_THEME: 'light',
  }),
};

export default config;
