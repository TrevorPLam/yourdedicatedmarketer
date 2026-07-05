// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import baseConfig from '@repo/eslint-config';

export default [...baseConfig, {
  files: ['**/*.{js,jsx,ts,tsx}'],
  languageOptions: {
    globals: {
      ...baseConfig[1]?.languageOptions?.globals,
      window: 'readonly',
      document: 'readonly',
      navigator: 'readonly',
      HTMLElement: 'readonly',
      HTMLDivElement: 'readonly',
      HTMLButtonElement: 'readonly',
      HTMLInputElement: 'readonly',
      HTMLParagraphElement: 'readonly',
      HTMLHeadingElement: 'readonly',
      HTMLAnchorElement: 'readonly',
      Event: 'readonly',
      KeyboardEvent: 'readonly',
    },
  },
}, ...storybook.configs["flat/recommended"]];
