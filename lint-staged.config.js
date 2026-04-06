export default {
  '*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    'prettier --write'
  ],
  '*.astro': [
    'eslint --fix',
    'prettier --write'
  ],
  '*.{json,jsonc}': [
    'prettier --write'
  ],
  '*.{md,mdx}': [
    'prettier --write'
  ],
  '*.{css,scss,less}': [
    'prettier --write'
  ],
  '*.{yaml,yml}': [
    'prettier --write'
  ],
  '*.{html}': [
    'prettier --write'
  ],
  'package.json': [
    'prettier --write',
    'npmPkgJsonLint'
  ]
};
