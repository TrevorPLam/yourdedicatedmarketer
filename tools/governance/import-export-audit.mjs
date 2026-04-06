#!/usr/bin/env node

/**
 * Import/Export Audit Tool
 * 
 * Comprehensive audit of import/export patterns across the monorepo
 * Based on 2026 best practices for ES modules and TypeScript
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ImportExportAuditor {
  constructor(rootPath) {
    this.rootPath = rootPath;
    this.issues = [];
    this.stats = {
      totalFiles: 0,
      filesWithImports: 0,
      typeImports: 0,
      valueImports: 0,
      mixedImports: 0,
      circularDependencies: 0,
      barrelFiles: 0,
      violations: 0
    };
  }

  async audit() {
    console.log('🔍 Starting Import/Export Audit...\n');

    const files = await this.getSourceFiles();
    this.stats.totalFiles = files.length;

    console.log(`📁 Analyzing ${files.length} files...\n`);

    // Phase 1: Individual file analysis
    for (const file of files) {
      await this.analyzeFile(file);
    }

    // Phase 2: Cross-file analysis
    await this.analyzeDependencies(files);
    
    // Phase 3: Barrel file analysis
    await this.analyzeBarrelFiles(files);

    this.generateReport();
  }

  async getSourceFiles() {
    const includePatterns = [
      'apps/**/*.{ts,tsx,js,jsx}',
      'packages/**/*.{ts,tsx,js,jsx}',
      'tools/**/*.{ts,tsx,js,jsx}',
    ];

    const ignorePatterns = [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
      '**/.turbo/**',
      '**/coverage/**',
      '**/.astro/**',
    ];

    const files = [];
    for (const pattern of includePatterns) {
      const matches = await glob(pattern, { 
        cwd: this.rootPath,
        absolute: true,
        ignore: ignorePatterns,
      });
      files.push(...matches);
    }

    return [...new Set(files)];
  }

  async analyzeFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const relativePath = path.relative(this.rootPath, filePath);

      // Skip if no imports/exports
      if (!content.includes('import') && !content.includes('export')) {
        return;
      }

      this.stats.filesWithImports++;

      const lines = content.split('\n');
      const imports = [];
      const exports = [];
      let hasTypeImports = false;
      let hasValueImports = false;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Analyze imports
        if (line.startsWith('import')) {
          imports.push({ line: i + 1, content: line });
          
          if (line.includes('import type')) {
            hasTypeImports = true;
            this.stats.typeImports++;
          } else {
            hasValueImports = true;
            this.stats.valueImports++;
          }
        }

        // Analyze exports
        if (line.startsWith('export')) {
          exports.push({ line: i + 1, content: line });
        }

        // Check for mixed import patterns
        if (line.includes('import {') && line.includes('type ')) {
          this.stats.mixedImports++;
          this.addIssue('MIXED_IMPORT_PATTERN', relativePath, i + 1, line);
        }

        // Check for deprecated patterns
        if (line.includes('require(')) {
          this.addIssue('DEPRECATED_REQUIRE', relativePath, i + 1, line);
        }

        // Check for missing file extensions in relative imports
        if (line.includes("from './") || line.includes('from "../')) {
          if (!line.match(/from\s+['"](\.\.\/|\.\/)[^'"]*\.(js|ts|tsx|jsx)['"]/) ) {
            this.addIssue('MISSING_EXTENSION', relativePath, i + 1, line);
          }
        }

        // Check for import attributes usage (only on actual import lines)
        if (line.startsWith('import') && line.includes('.json') && !line.includes('with {')) {
          this.addIssue('MISSING_IMPORT_ATTRIBUTES', relativePath, i + 1, line);
        }
      }

      // Check for barrel file patterns
      if (this.isBarrelFile(content, relativePath)) {
        this.stats.barrelFiles++;
        this.analyzeBarrelFile(relativePath, content);
      }

      // Check for inconsistent export styles
      this.analyzeExportStyle(relativePath, exports);

    } catch (error) {
      this.addIssue('FILE_READ_ERROR', filePath, 0, error.message);
    }
  }

  isBarrelFile(content, relativePath) {
    // Check if file is named index.js/ts/tsx and primarily re-exports
    const isIndexFile = path.basename(relativePath).startsWith('index.');
    const hasReExports = content.includes('export ') && content.includes(' from ');
    const exportCount = (content.match(/export\s+.*\s+from/g) || []).length;
    
    return isIndexFile && hasReExports && exportCount > 2;
  }

  analyzeBarrelFile(relativePath, content) {
    const lines = content.split('\n');
    const heavyDependencies = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('export ') && trimmed.includes(' from ')) {
        const match = trimmed.match(/from\s+['"]([^'"]+)['"]/);
        if (match) {
          const dep = match[1];
          // Check for potentially heavy dependencies
          if (dep.includes('node_modules') || dep.includes('dist')) {
            heavyDependencies.push(dep);
          }
        }
      }
    }

    if (heavyDependencies.length > 0) {
      this.addIssue('BARREL_FILE_HEAVY_DEPS', relativePath, 1, 
        `Barrel file exports heavy dependencies: ${heavyDependencies.join(', ')}`);
    }
  }

  analyzeExportStyle(relativePath, exports) {
    // Skip Next.js/Astro framework files and Storybook stories that conventionally mix export styles
    const isFrameworkFile = /[/\\](page|layout|route|loading|error|not-found|template)\.(tsx?|jsx?)$/.test(relativePath)
      || /\.stories\.(tsx?|jsx?)$/.test(relativePath);
    if (isFrameworkFile) return;

    const hasDefault = exports.some(e => e.content.includes('export default'));
    const hasNamed = exports.some(e => e.content.includes('export {') || e.content.match(/export\s+(const|function|class)/));
    
    if (hasDefault && hasNamed) {
      this.addIssue('INCONSISTENT_EXPORT_STYLE', relativePath, 1, 
        'File mixes default and named exports inconsistently');
    }
  }

  async analyzeDependencies(files) {
    console.log('🔗 Analyzing cross-file dependencies...');
    
    const dependencyMap = new Map();
    
    // Build dependency graph
    for (const file of files) {
      const deps = await this.extractDependencies(file);
      dependencyMap.set(file, deps);
    }

    // Check for circular dependencies
    for (const [file, deps] of dependencyMap) {
      for (const dep of deps) {
        if (this.hasCircularDependency(file, dep, dependencyMap, new Set())) {
          this.stats.circularDependencies++;
          this.addIssue('CIRCULAR_DEPENDENCY', 
            path.relative(this.rootPath, file), 
            0, 
            `Circular dependency with ${path.relative(this.rootPath, dep)}`
          );
        }
      }
    }
  }

  async extractDependencies(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const deps = [];
      const importRegex = /import.*from\s+['"]([^'"]+)['"]/g;
      let match;

      while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1];
        
        // Only process relative imports for circular dependency detection
        if (importPath.startsWith('./') || importPath.startsWith('../')) {
          const resolvedPath = path.resolve(path.dirname(filePath), importPath);
          
          // Try different extensions
          const extensions = ['.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.js'];
          for (const ext of extensions) {
            const fullPath = resolvedPath + ext;
            if (fs.existsSync(fullPath)) {
              deps.push(fullPath);
              break;
            }
          }
        }
      }
      
      return deps;
    } catch (error) {
      return [];
    }
  }

  hasCircularDependency(file, dependency, dependencyMap, visited) {
    if (visited.has(file)) return false;
    if (file === dependency) return true;
    
    visited.add(file);
    const deps = dependencyMap.get(file) || [];
    
    for (const dep of deps) {
      if (this.hasCircularDependency(dep, dependency, dependencyMap, new Set(visited))) {
        return true;
      }
    }
    
    return false;
  }

  async analyzeBarrelFiles(files) {
    console.log('📦 Analyzing barrel files...');
    
    const indexFiles = files.filter(f => 
      path.basename(f).startsWith('index.')
    );

    for (const indexFile of indexFiles) {
      try {
        const content = fs.readFileSync(indexFile, 'utf-8');
        const reExports = this.extractReExports(content);
        
        if (reExports.length > 5) {
          this.addIssue('LARGE_BARREL_FILE', 
            path.relative(this.rootPath, indexFile), 
            1, 
            `Barrel file has ${reExports.length} re-exports, consider splitting`
          );
        }
      } catch (error) {
        // Skip files that can't be read
      }
    }
  }

  extractReExports(content) {
    const reExports = [];
    const regex = /export\s+.*\s+from\s+['"]([^'"]+)['"]/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
      reExports.push(match[1]);
    }

    return reExports;
  }

  addIssue(type, file, line, details) {
    this.issues.push({
      type,
      file,
      line,
      details,
      severity: this.getSeverity(type)
    });
    this.stats.violations++;
  }

  getSeverity(type) {
    const severityMap = {
      'CIRCULAR_DEPENDENCY': 'error',
      'DEPRECATED_REQUIRE': 'error',
      'MISSING_EXTENSION': 'warning',
      'MISSING_IMPORT_ATTRIBUTES': 'warning',
      'MIXED_IMPORT_PATTERN': 'warning',
      'BARREL_FILE_HEAVY_DEPS': 'warning',
      'LARGE_BARREL_FILE': 'info',
      'INCONSISTENT_EXPORT_STYLE': 'info',
      'FILE_READ_ERROR': 'error'
    };
    
    return severityMap[type] || 'info';
  }

  generateReport() {
    console.log('\n📊 Import/Export Audit Report\n');
    console.log('=====================================\n');

    // Statistics
    console.log('📈 Statistics:');
    console.log(`  Total files analyzed: ${this.stats.totalFiles}`);
    console.log(`  Files with imports/exports: ${this.stats.filesWithImports}`);
    console.log(`  Type imports: ${this.stats.typeImports}`);
    console.log(`  Value imports: ${this.stats.valueImports}`);
    console.log(`  Mixed import patterns: ${this.stats.mixedImports}`);
    console.log(`  Barrel files: ${this.stats.barrelFiles}`);
    console.log(`  Circular dependencies: ${this.stats.circularDependencies}`);
    console.log(`  Total violations: ${this.stats.violations}\n`);

    // Issues by severity
    const issuesBySeverity = this.groupIssuesBySeverity();
    
    Object.entries(issuesBySeverity).forEach(([severity, issues]) => {
      if (issues.length > 0) {
        console.log(`${this.getSeverityIcon(severity)} ${severity.toUpperCase()} (${issues.length}):`);
        issues.forEach(issue => {
          console.log(`  ${issue.file}:${issue.line} - ${issue.type}`);
          console.log(`    ${issue.details}`);
        });
        console.log('');
      }
    });

    // Recommendations
    this.generateRecommendations();

    // Exit code based on errors
    const errors = issuesBySeverity.error || [];
    process.exit(errors.length > 0 ? 1 : 0);
  }

  groupIssuesBySeverity() {
    return this.issues.reduce((groups, issue) => {
      if (!groups[issue.severity]) {
        groups[issue.severity] = [];
      }
      groups[issue.severity].push(issue);
      return groups;
    }, {});
  }

  getSeverityIcon(severity) {
    const icons = {
      'error': '❌',
      'warning': '⚠️',
      'info': 'ℹ️'
    };
    return icons[severity] || 'ℹ️';
  }

  generateRecommendations() {
    console.log('💡 Recommendations:\n');

    if (this.stats.circularDependencies > 0) {
      console.log('🔴 Circular Dependencies:');
      console.log('  - Extract shared contracts into separate modules');
      console.log('  - Move side effects to explicit boot functions');
      console.log('  - Consider dependency injection patterns\n');
    }

    if (this.stats.mixedImports > 0) {
      console.log('🟡 Mixed Import Patterns:');
      console.log('  - Use separate type imports: `import type { ... }`');
      console.log('  - Enable TypeScript\'s verbatimModuleSyntax');
      console.log('  - Configure ESLint consistent-type-imports rule\n');
    }

    if (this.stats.barrelFiles > 0) {
      console.log('🟠 Barrel Files:');
      console.log('  - Keep barrel files shallow (< 5 re-exports)');
      console.log('  - Separate client-safe and server-only exports');
      console.log('  - Measure bundle impact after adding exports\n');
    }

    console.log('✅ Best Practices for 2026:');
    console.log('  - Use `import type` for type-only imports');
    console.log('  - Add import attributes for JSON: `with { type: "json" }`');
    console.log('  - Include file extensions in relative imports');
    console.log('  - Maintain consistent export styles per file');
    console.log('  - Prefer named exports for libraries');
    console.log('  - Use default exports for single-main-concept modules\n');
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const rootPath = args[0] || path.resolve(__dirname, '../..');
  
  const auditor = new ImportExportAuditor(rootPath);
  await auditor.audit();
}

main().catch(console.error);
