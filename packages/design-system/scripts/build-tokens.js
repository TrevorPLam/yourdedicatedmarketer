#!/usr/bin/env node

/**
 * Build script for design tokens
 * Generates CSS variables and type definitions
 */

const fs = require('fs');
const path = require('path');

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function generateTokenCSS() {
  // Since we're using CSS-first configuration in Tailwind v4.0,
  // the tokens are already defined in CSS via @theme
  // This script can be used for additional processing if needed

  let css = `/* Auto-generated design tokens */
/* Note: Primary tokens are defined in src/styles/globals.css via @theme */

/* Additional utility tokens can be generated here */

`;

  return css;
}

function generateTokenTypes() {
  let types = `// Auto-generated type definitions for design tokens

// Color types
export type ColorName = 'primary' | 'neutral' | 'success' | 'warning' | 'error' | 'info';
export type ColorShade = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '950';

// Typography types
export type FontFamily = 'display' | 'body' | 'mono';
export type FontSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
export type FontWeight = 'thin' | 'extralight' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';

// Spacing types
export type SpacingScale = '0' | 'px' | '0.5' | '1' | '1.5' | '2' | '2.5' | '3' | '3.5' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '14' | '16' | '20' | '24' | '28' | '32' | '36' | '40' | '44' | '48' | '52' | '56' | '60' | '64' | '72' | '80' | '96';

// Theme types
export type Theme = 'light' | 'dark' | 'system';

// Semantic color types
export type SemanticColor = 'background' | 'foreground' | 'muted' | 'muted-foreground' | 'popover' | 'popover-foreground' | 'card' | 'card-foreground' | 'border' | 'input' | 'input-border' | 'primary' | 'primary-foreground' | 'primary-hover' | 'primary-active' | 'secondary' | 'secondary-foreground' | 'secondary-hover' | 'secondary-active' | 'accent' | 'accent-foreground' | 'accent-hover' | 'accent-active' | 'destructive' | 'destructive-foreground' | 'destructive-hover' | 'destructive-active' | 'ring' | 'ring-offset' | 'ring-offset-border';

`;

  return types;
}

function main() {
  console.log('🎨 Building design tokens...');

  try {
    // Ensure output directory exists
    const outputPath = path.join(__dirname, '../dist');
    ensureDirectoryExists(outputPath);

    // Generate CSS tokens
    const cssTokens = generateTokenCSS();
    fs.writeFileSync(path.join(outputPath, 'tokens.css'), cssTokens);
    console.log('✅ Generated CSS tokens');

    // Generate TypeScript definitions
    const tsTokens = generateTokenTypes();
    fs.writeFileSync(path.join(outputPath, 'tokens.d.ts'), tsTokens);
    console.log('✅ Generated TypeScript definitions');

    // Generate a simple manifest
    const manifest = {
      version: '1.0.0',
      builtAt: new Date().toISOString(),
      features: {
        tailwindCSSv4: true,
        oklchColorSpace: true,
        fluidTypography: true,
        containerQueries: true,
        cssFirstConfig: true,
        themeSwitching: true,
      },
    };
    fs.writeFileSync(path.join(outputPath, 'manifest.json'), JSON.stringify(manifest, null, 2));
    console.log('✅ Generated manifest');

    console.log('🎉 Design tokens built successfully!');
  } catch (error) {
    console.error('❌ Error building design tokens:', error);
    process.exit(1);
  }
}

// Run in watch mode if --watch flag is provided
if (process.argv.includes('--watch')) {
  console.log('👀 Watching for token changes...');

  try {
    const chokidar = require('chokidar');
    const watcher = chokidar.watch(path.join(__dirname, '../src/**/*.{ts,css}'));

    watcher.on('change', () => {
      console.log('📝 Tokens changed, rebuilding...');
      main();
    });

    // Initial build
    main();
  } catch (error) {
    console.log('⚠️  Watch mode requires chokidar. Running once...');
    main();
  }
} else {
  main();
}
