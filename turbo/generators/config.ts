import type { PlopTypes } from '@turbo/gen';
import {
  validateClientConfig,
  validateClientName,
  validateClientSlug,
  validateDomain,
  formatValidationErrors,
  formatValidationWarnings,
} from './utils/validation';

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  // Client Site Generator
  plop.setGenerator('client-site', {
    description: 'Create a new client site with framework-specific templates',
    prompts: [
      {
        type: 'input',
        name: 'clientName',
        message: 'Client name (e.g., alpha-client):',
        validate: (input: string) => {
          const validation = validateClientName(input);
          if (!validation.valid) {
            return validation.errors?.[0]?.message || 'Invalid client name';
          }
          return true;
        },
      },
      {
        type: 'list',
        name: 'framework',
        message: 'Choose framework:',
        choices: [
          { name: 'Astro - Marketing sites, landing pages, documentation', value: 'astro' },
          { name: 'Next.js - Interactive applications, dashboards, e-commerce', value: 'nextjs' },
          { name: 'Hybrid - Astro marketing + Next.js dashboard', value: 'hybrid' },
        ],
      },
      {
        type: 'list',
        name: 'database',
        message: 'Choose database provider:',
        choices: [
          { name: 'Supabase - Full-stack platform with real-time features', value: 'supabase' },
          { name: 'Neon - Serverless PostgreSQL', value: 'neon' },
          { name: 'PostgreSQL - Native PostgreSQL', value: 'postgres' },
        ],
      },
      {
        type: 'list',
        name: 'theme',
        message: 'Choose theme/brand kit:',
        choices: [
          { name: 'Default - Agency default theme', value: 'default' },
          { name: 'Alpha - Blue color scheme', value: 'alpha' },
          { name: 'Beta - Green color scheme', value: 'beta' },
          { name: 'Gamma - Purple color scheme', value: 'gamma' },
          { name: 'Custom - Will be configured manually', value: 'custom' },
        ],
      },
      {
        type: 'checkbox',
        name: 'features',
        message: 'Select features to include:',
        choices: [
          { name: 'Blog system', value: 'blog', checked: true },
          { name: 'Contact forms', value: 'contact', checked: true },
          { name: 'Portfolio/gallery', value: 'portfolio', checked: true },
          { name: 'Analytics integration', value: 'analytics', checked: true },
          { name: 'SEO optimization', value: 'seo', checked: true },
          { name: 'CMS integration', value: 'cms', checked: false },
          { name: 'E-commerce', value: 'ecommerce', checked: false },
          { name: 'User authentication', value: 'auth', checked: false },
        ],
      },
      {
        type: 'confirm',
        name: 'addDomain',
        message: 'Add custom domain configuration?',
        default: false,
      },
      {
        type: 'input',
        name: 'domain',
        message: 'Custom domain (e.g., client-site.com):',
        when: (answers) => answers.addDomain,
        validate: (input: string) => {
          const validation = validateDomain(input);
          if (!validation.valid) {
            return validation.errors?.[0]?.message || 'Invalid domain format';
          }
          return true;
        },
      },
    ],
    actions: (answers) => {
      const actions: PlopTypes.ActionEvent[] = [];

      if (!answers) return actions;

      const { clientName, framework, database, theme, features, domain } = answers;

      // Create client site directory
      actions.push({
        type: 'add',
        path: `apps/client-sites/${clientName}/package.json`,
        templateFile: 'templates/client-package.hbs',
      });

      // Add framework-specific configuration
      if (framework === 'astro') {
        actions.push({
          type: 'add',
          path: `apps/client-sites/${clientName}/astro.config.mjs`,
          templateFile: 'templates/astro-config.hbs',
        });
      } else if (framework === 'nextjs') {
        actions.push({
          type: 'add',
          path: `apps/client-sites/${clientName}/next.config.js`,
          templateFile: 'templates/nextjs-config.hbs',
        });
      } else if (framework === 'hybrid') {
        actions.push({
          type: 'add',
          path: `apps/client-sites/${clientName}/astro.config.mjs`,
          templateFile: 'templates/astro-config.hbs',
        });
        actions.push({
          type: 'add',
          path: `apps/client-sites/${clientName}/apps/dashboard/next.config.js`,
          templateFile: 'templates/nextjs-config.hbs',
        });
      }

      // Add client configuration file
      actions.push({
        type: 'add',
        path: `apps/client-sites/${clientName}/client.config.js`,
        templateFile: 'templates/client-config.hbs',
      });

      // Add environment template
      actions.push({
        type: 'add',
        path: `apps/client-sites/${clientName}/.env.example`,
        templateFile: 'templates/env-example.hbs',
      });

      // Add README
      actions.push({
        type: 'add',
        path: `apps/client-sites/${clientName}/README.md`,
        templateFile: 'templates/client-readme.hbs',
      });

      // Add framework-specific source structure
      if (framework === 'astro' || framework === 'hybrid') {
        actions.push({
          type: 'add',
          path: `apps/client-sites/${clientName}/src/pages/index.astro`,
          templateFile: 'templates/astro-index.hbs',
        });
        actions.push({
          type: 'add',
          path: `apps/client-sites/${clientName}/src/layouts/Base.astro`,
          templateFile: 'templates/astro-layout.hbs',
        });
      }

      if (framework === 'nextjs' || framework === 'hybrid') {
        const dashboardPath =
          framework === 'hybrid'
            ? `apps/client-sites/${clientName}/apps/dashboard`
            : `apps/client-sites/${clientName}`;
        actions.push({
          type: 'add',
          path: `${dashboardPath}/src/app/page.tsx`,
          templateFile: 'templates/nextjs-page.hbs',
        });
        actions.push({
          type: 'add',
          path: `${dashboardPath}/src/app/layout.tsx`,
          templateFile: 'templates/nextjs-layout.hbs',
        });
      }

      // Add feature-specific files
      if (features.includes('blog')) {
        actions.push({
          type: 'add',
          path: `apps/client-sites/${clientName}/src/content/blog/config.ts`,
          templateFile: 'templates/blog-config.hbs',
        });
      }

      if (features.includes('contact')) {
        actions.push({
          type: 'add',
          path: `apps/client-sites/${clientName}/src/components/ContactForm.astro`,
          templateFile: 'templates/contact-form.hbs',
        });
      }

      // Update workspace to include new client
      actions.push({
        type: 'modify',
        path: 'pnpm-workspace.yaml',
        transform: (content) => {
          // Add client site to workspace packages
          return content.replace(
            /packages:\s*\n\s*- 'apps\/\*'/,
            `packages:\n  - 'apps/*'\n  - 'apps/client-sites/*'`
          );
        },
      });

      // Validate complete configuration
      actions.push({
        type: 'function',
        fn: async (answers) => {
          const config = {
            client: {
              name: clientName,
              slug: answers.clientName.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
              framework,
              database,
              theme,
            },
            features: features.reduce((acc: any, feature: string) => {
              acc[feature] = true;
              return acc;
            }, {}),
            site: {
              title: clientName,
              description: `Professional website for ${clientName}`,
              url: domain ? `https://${domain}` : 'https://localhost:3000',
              author: 'Marketing Agency',
            },
            theme: {
              primaryColor: '#3b82f6',
              secondaryColor: '#64748b',
              accentColor: '#f59e0b',
              fontFamily: 'Inter, system-ui, sans-serif',
            },
            database: {
              provider: database,
            },
            seo: {
              enableSitemap: features.includes('seo'),
              enableRobotsTxt: features.includes('seo'),
              metaTitleTemplate: `%s | ${clientName}`,
              metaDescription: `Professional website for ${clientName}`,
            },
            analytics: {
              enabled: features.includes('analytics'),
            },
            contact: {
              enabled: features.includes('contact'),
            },
            ecommerce: {
              enabled: features.includes('ecommerce'),
            },
            auth: {
              enabled: features.includes('auth'),
            },
            performance: {
              enableImageOptimization: true,
              enableFontOptimization: true,
            },
            development: {
              enableHotReload: true,
            },
          };

          const validation = validateClientConfig(config);

          if (!validation.valid) {
            console.error('\n❌ Configuration validation failed:');
            console.error(formatValidationErrors(validation.errors || []));
            throw new Error('Configuration validation failed');
          }

          if (validation.warnings && validation.warnings.length > 0) {
            console.log('\n⚠️  Configuration warnings:');
            console.log(formatValidationWarnings(validation.warnings));
          }

          console.log('\n✅ Configuration validation passed!');
          return 'Configuration validated successfully';
        },
      });

      return actions;
    },
  });

  // Component Generator (enhanced)
  plop.setGenerator('component', {
    description: 'Create a new UI component with tests and stories',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component name (e.g., Button):',
        validate: (input: string) => {
          if (!input) return 'Component name is required';
          if (!/^[A-Z][a-zA-Z0-9]*$/.test(input)) {
            return 'Component name must start with uppercase letter and contain only letters and numbers';
          }
          return true;
        },
      },
      {
        type: 'list',
        name: 'type',
        message: 'Component type:',
        choices: [
          { name: 'Atom - Basic UI element (Button, Input, etc.)', value: 'atom' },
          { name: 'Molecule - Component combination (Card, Form, etc.)', value: 'molecule' },
          { name: 'Organism - Complex UI section (Header, Footer, etc.)', value: 'organism' },
        ],
      },
      {
        type: 'checkbox',
        name: 'files',
        message: 'Files to create:',
        choices: [
          { name: 'Component file (.tsx)', value: 'component', checked: true },
          { name: 'Test file (.test.tsx)', value: 'test', checked: true },
          { name: 'Storybook story (.stories.tsx)', value: 'story', checked: true },
          { name: 'Styles file (.module.css)', value: 'styles', checked: false },
        ],
      },
    ],
    actions: (answers) => {
      const actions: PlopTypes.ActionEvent[] = [];

      if (!answers) return actions;

      const { name, type, files } = answers;
      const componentDir = `packages/ui-components/src/${type}s/${name}`;

      // Component file
      if (files.includes('component')) {
        actions.push({
          type: 'add',
          path: `${componentDir}/${name}.tsx`,
          templateFile: 'templates/component.hbs',
        });
        actions.push({
          type: 'add',
          path: `${componentDir}/index.ts`,
          template: `export { ${name} } from './${name}'\n`,
        });
      }

      // Test file
      if (files.includes('test')) {
        actions.push({
          type: 'add',
          path: `${componentDir}/${name}.test.tsx`,
          templateFile: 'templates/component-test.hbs',
        });
      }

      // Storybook story
      if (files.includes('story')) {
        actions.push({
          type: 'add',
          path: `${componentDir}/${name}.stories.tsx`,
          templateFile: 'templates/component-story.hbs',
        });
      }

      // Styles file
      if (files.includes('styles')) {
        actions.push({
          type: 'add',
          path: `${componentDir}/${name}.module.css`,
          templateFile: 'templates/component-styles.hbs',
        });
      }

      // Update barrel export
      actions.push({
        type: 'append',
        path: `packages/ui-components/src/${type}s/index.ts`,
        template: `export * from './${name}'\n`,
        separator: '',
      });

      return actions;
    },
  });
}
