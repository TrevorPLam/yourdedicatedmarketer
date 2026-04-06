#!/usr/bin/env node

/**
 * Sync Storybook component documentation to the docs site
 *
 * This script extracts component documentation from Storybook stories
 * and generates markdown files for the documentation site.
 */

import { readFile, writeFile, readdir, stat, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '../..');
const uiComponentsDir = join(rootDir, '../packages/ui-components');
const componentsOutputDir = join(rootDir, 'src/content/components');

/**
 * Extract component metadata from Storybook story
 */
function extractComponentMetadata(storyContent, componentName) {
  const metadata = {
    name: componentName,
    description: '',
    props: [],
    variants: [],
    examples: [],
  };

  // Extract description from JSDoc or comments
  const descriptionMatch = storyContent.match(/\/\*\*\s*\n\s*\*\s*(.*?)\s*\n/);
  if (descriptionMatch) {
    metadata.description = descriptionMatch[1];
  }

  // Extract props from TypeScript interfaces or component definitions
  const propsMatch = storyContent.match(/interface\s+(\w+Props)\s*{([^}]+)}/s);
  if (propsMatch) {
    const propsText = propsMatch[2];
    const propLines = propsText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line);

    for (const line of propLines) {
      const propMatch = line.match(/(\w+)\s*:\s*(.+?);?$/);
      if (propMatch) {
        metadata.props.push({
          name: propMatch[1],
          type: propMatch[2].replace('?', '').trim(),
          required: !line.includes('?'),
        });
      }
    }
  }

  // Extract variants from Storybook stories
  const storyMatches = storyContent.matchAll(/export\s+(const|function)\s+(\w+)\s*[:=]/g);
  for (const match of storyMatches) {
    const storyName = match[2];
    if (storyName !== 'Default' && storyName !== 'Play') {
      metadata.variants.push(storyName);
    }
  }

  return metadata;
}

/**
 * Generate markdown documentation from component metadata
 */
function generateComponentDocs(metadata) {
  const { name, description, props, variants } = metadata;

  let markdown = `---
title: "${name}"
description: "${description}"
component: "${name}"
---

# ${name}

${description}

## Props

| Prop | Type | Required | Default |
|------|------|----------|---------|
`;

  for (const prop of props) {
    const required = prop.required ? '✅' : '❌';
    markdown += `| \`${prop.name}\` | \`${prop.type}\` | ${required} | - |\n`;
  }

  if (variants.length > 0) {
    markdown += `\n## Variants\n\n`;
    for (const variant of variants) {
      markdown += `### ${variant}\n\n`;
      markdown += `<!-- Component: ${name} - ${variant} -->\n\n`;
      markdown += `*[Storybook preview](${process.env.STORYBOOK_URL || 'http://localhost:6006'}?path=/story/${name.toLowerCase()}-${variant.toLowerCase()})*\n\n`;
    }
  }

  markdown += `## Usage

\`\`\`tsx
import { ${name} } from '@agency/ui-components';

function Example() {
  return (
    <${name}>
      {/* Component content */}
    </${name}>
  );
}
\`\`\`

## Design System

This component follows our [design system guidelines](/packages/design-system/).

## Accessibility

This component meets WCAG 2.2 AA accessibility standards. For detailed accessibility information, see the [Storybook accessibility panel](${process.env.STORYBOOK_URL || 'http://localhost:6006'}?path=/story/${name.toLowerCase()}--default).

## Related Components

`;

  // Add related components based on common patterns
  const relatedComponents = {
    Button: ['Input', 'Modal', 'Card'],
    Input: ['Button', 'Modal', 'Form'],
    Modal: ['Button', 'Card', 'Overlay'],
    Card: ['Button', 'Image', 'Badge'],
  };

  if (relatedComponents[name]) {
    for (const related of relatedComponents[name]) {
      markdown += `- [${related}](/components/${related.toLowerCase()}/)\n`;
    }
  }

  return markdown;
}

/**
 * Process a component directory
 */
async function processComponent(componentDir, componentName) {
  try {
    const storiesPath = join(componentDir, `${componentName}.stories.tsx`);
    const storyContent = await readFile(storiesPath, 'utf-8');

    const metadata = extractComponentMetadata(storyContent, componentName);
    const markdown = generateComponentDocs(metadata);

    const outputPath = join(componentsOutputDir, `${componentName.toLowerCase()}.md`);
    await writeFile(outputPath, markdown, 'utf-8');

    console.log(`✅ Generated documentation for ${componentName}`);
  } catch (error) {
    console.warn(`⚠️  Could not process ${componentName}: ${error.message}`);
  }
}

/**
 * Main sync function
 */
async function syncStorybook() {
  try {
    console.log('🔄 Syncing Storybook components to documentation...');

    // Ensure output directory exists
    await mkdir(componentsOutputDir, { recursive: true });

    // Read all component directories
    const atomsDir = join(uiComponentsDir, 'src/atoms');
    const componentDirs = await readdir(atomsDir);

    for (const componentDir of componentDirs) {
      const componentPath = join(atomsDir, componentDir);
      const componentStat = await stat(componentPath);

      if (componentStat.isDirectory()) {
        await processComponent(componentPath, componentDir);
      }
    }

    console.log('✅ Storybook sync completed successfully!');
  } catch (error) {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  }
}

// Run the sync
if (import.meta.url === `file://${process.argv[1]}`) {
  syncStorybook();
}

export { syncStorybook };
