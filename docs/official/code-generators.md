# Code Generators

## Overview

Code generators automate the creation of boilerplate code for consistent project structure. This guide covers Turbo Gen implementation for creating clients, components, and packages.

---

## Turbo Gen Configuration

```typescript
// turbo/generators/config.ts
import type { PlopTypes } from '@turbo/gen';

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  // Client generator
  plop.setGenerator('client', {
    description: 'Create a new client project',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Client name (kebab-case):',
        validate: (input) => /^[a-z0-9-]+$/.test(input),
      },
      {
        type: 'list',
        name: 'template',
        message: 'Choose template:',
        choices: ['astro-marketing', 'nextjs-dashboard', 'hybrid'],
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'apps/client-sites/{{name}}/package.json',
        templateFile: 'templates/client/package.json.hbs',
      },
    ],
  });
}
```

---

## Usage

```bash
# Generate client project
turbo gen client

# Generate component
turbo gen component

# Generate package
turbo gen package
```

---

## Template Structure

```
turbo/generators/templates/
├── client/
│   ├── package.json.hbs
│   ├── README.md.hbs
│   └── env.local.hbs
├── component/
│   ├── Component.tsx.hbs
│   ├── Component.test.tsx.hbs
│   └── index.ts.hbs
└── package/
    ├── package.json.hbs
    └── tsconfig.json.hbs
```

---

_Updated April 2026_
