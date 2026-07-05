## Phase 1: Project Foundation – Task List

This document defines all tasks required to set up the project foundation, including monorepo structure, Next.js 15 application, testing infrastructure, content pipeline, and deployment configuration. All tasks are designed to be **SMALL**, actionable, and built with **SDD, DDD, TDD, BDD**, and **Deep Modules** in mind.

---

### Parent Task P001: Initialize GitHub Repository and Monorepo Structure

- [x] **P001** | Status: `COMPLETE`  
      **Related File Paths:**
  - `.gitignore`
  - `pnpm-workspace.yaml`
  - `package.json` (root)
  - `turbo.json`
  - `README.md` (initial)

  **Definition of Done:**
  - A GitHub repository named `yourdedicatedmarketer` exists.
  - The local workspace is initialized with `pnpm`.
  - Turborepo is set up with `pnpm` workspaces.
  - Folder structure for `apps/firm-website` and `packages/*` is created.
  - Root `package.json` defines workspaces and scripts.
  - `turbo.json` configures a basic pipeline for `dev`, `build`, `lint`, `test`.
  - Initial `README.md` provides a high‑level overview.

  **Out of Scope:**
  - Installation of any framework‑specific dependencies (Next.js, React, etc.) – handled by P002.
  - Configuration of tooling beyond the monorepo skeleton – handled by P003 onwards.

  **Rules to Follow:**
  - Use `pnpm` exclusively.
  - All packages use `"type": "module"`.
  - The root `package.json` uses `"private": true`.
  - Workspace names follow `@repo/*` naming convention (e.g., `@repo/web`, `@repo/ui`).
  - `turbo.json` tasks must support caching.

  **Advanced Coding Pattern:**
  - **Monorepo with task orchestration** – use Turborepo’s pipeline to define task dependencies and caching.

  **Anti‑Patterns:**
  - Mixing `npm` or `yarn` with `pnpm`.
  - Hard‑coding workspace paths without using `workspace:*`.

  **Imports/Exports:**
  - Root `package.json` exposes no exports.
  - `pnpm-workspace.yaml` defines `packages/*` and `apps/*`.

  **Depends On / Blocks:**
  - Depends on: nothing.
  - Blocks: all subsequent tasks.

#### Subtasks

| ID      | Agent/Human | File Path / Command                             | Description                                                                                                                                                                                                                                         | Validation Command                                      |
| ------- | ----------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| P001-01 | HUMAN       | `gh repo create yourdedicatedmarketer --public` | Create a public GitHub repository named `yourdedicatedmarketer`. If CLI not available, create via GitHub web interface.                                                                                                                             | `git remote -v` shows the new remote.                   |
| P001-02 | AGENT       | Root folder                                     | Create the root folder `yourdedicatedmarketer/`, initialize `pnpm init` (accept defaults), and set `"private": true` in `package.json`.                                                                                                             | `pnpm --version` executes successfully.                 |
| P001-03 | AGENT       | `pnpm-workspace.yaml`                           | Create `pnpm-workspace.yaml` with: `packages: - 'apps/*' - 'packages/*'`.                                                                                                                                                                           | `pnpm m ls` lists no packages yet.                      |
| P001-04 | AGENT       | `apps/firm-website/` and `packages/` folders    | Create the directory structure: `apps/firm-website/` (for marketing site), `packages/ui/`, `packages/lib/`, `packages/eslint-config/`, `packages/typescript-config/`, `packages/tailwind-config/`.                                                  | Check that directories exist.                           |
| P001-05 | AGENT       | `turbo.json`                                    | Create `turbo.json` with tasks defining `dev`, `build`, `lint`, `test`, `check-types`. Use the Turborepo 2.x syntax with `"tasks"` key and `"outputs"` for cache configuration per task. Use the standard Turborepo configuration for Next.js apps. | `pnpm dlx turbo --version` shows version.               |
| P001-06 | AGENT       | `package.json` (root)                           | Add scripts: `"dev": "turbo dev", "build": "turbo build", "lint": "turbo lint", "test": "turbo test", "check-types": "turbo check-types"`. Also add `"packageManager": "pnpm@9.15.0"`.                                                              | `pnpm run dev` runs turbo but will fail due to no apps. |
| P001-07 | AGENT       | `.gitignore`                                    | Create a comprehensive `.gitignore` for Node.js, Next.js, Turbo, and pnpm (include `node_modules`, `.turbo`, `dist`, `.next`, `.env.local`, etc.).                                                                                                  | `git status` shows only intended files.                 |
| P001-08 | AGENT       | `README.md`                                     | Write initial README describing the monorepo structure, projects, and how to get started.                                                                                                                                                           | None (manual check).                                    |
| P001-09 | AGENT       | `pnpm install`                                  | Run `pnpm install` to generate lockfile and verify workspace setup.                                                                                                                                                                                 | `pnpm list --depth=0` shows no dependencies yet.        |
| P001-10 | AGENT       | Update repo management docs                     | Create `docs/repo-setup.md` documenting the monorepo structure and decision to use Turborepo + pnpm workspaces.                                                                                                                                     | None.                                                   |
| P001-11 | AGENT       | Commit `pnpm-lock.yaml`                         | Commit the generated `pnpm-lock.yaml` to Git. Document in `docs/repo-setup.md` that CI should use `--frozen-lockfile` to ensure reproducible builds.                                                                                                | `git log` shows the commit.                             |

---

### Parent Task P002: Setup Next.js 15 App in `apps/firm-website` with TypeScript and Tailwind CSS

- [x] **P002** | Status: `COMPLETE`  
      **Related File Paths:**
  - `apps/firm-website/package.json`
  - `apps/firm-website/next.config.ts`
  - `apps/firm-website/tsconfig.json`
  - `apps/firm-website/postcss.config.mjs`
  - `apps/firm-website/src/app/layout.tsx`
  - `apps/firm-website/src/app/page.tsx`
  - `apps/firm-website/src/app/globals.css`

  **Definition of Done:**
  - A Next.js 15 app with TypeScript is installed and configured in `apps/firm-website`.
  - Tailwind CSS v4 is integrated and working (default styles show).
  - The development server starts with `pnpm dev` from the root.
  - A basic homepage is visible at `http://localhost:3000` with Tailwind styling.

  **Out of Scope:**
  - Writing production content – will be added in later phases.
  - Setting up any routing beyond the root page – just a placeholder.

  **Rules to Follow:**
  - Use Next.js 15.x (latest stable).
  - React 19 is required.
  - Use the App Router (`src/app/`).
  - All components are Server Components by default.
  - TypeScript must be strict (`strict: true`).
  - Tailwind CSS v4 uses the new `@tailwindcss/postcss` package.

  **Advanced Coding Pattern:**
  - **Deep module** – the Next.js app is a self‑contained workspace with its own dependencies, using `transpilePackages` for internal packages (to be added later).
  - Use `next/font` for optimized fonts.

  **Anti‑Patterns:**
  - Using `use client` on every component unnecessarily.
  - Hard‑coded paths (use path aliases).

  **Imports/Exports:**
  - `apps/firm-website/package.json` defines `"name": "@repo/firm-website"`.
  - `apps/firm-website/next.config.ts` exports a `NextConfig` object.

  **Depends On / Blocks:**
  - Depends on: P001 (monorepo structure).
  - Blocks: None directly (but needed for page development).

#### Subtasks

| ID      | Agent/Human | File Path / Command                     | Description                                                                                                                                                                                                                                                             | Validation Command                                               |
| ------- | ----------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| P002-01 | AGENT       | `apps/firm-website/package.json`        | Add `package.json` with `name: "@repo/firm-website"`, `version: "0.1.0"`, `private: true`, and scripts: `"dev": "next dev", "build": "next build", "start": "next start", "lint": "next lint", "test": "vitest"`.                                                       | `pnpm --filter @repo/firm-website run --help` shows commands.    |
| P002-02 | AGENT       | Root terminal                           | Run: `pnpm add -D @types/node@22 typescript@6` in root to ensure TypeScript is available (or add to apps/firm-website devDeps).                                                                                                                                         | `pnpm list typescript` shows version.                            |
| P002-03 | AGENT       | `apps/firm-website` (install)           | Install Next.js 15, React 19, React DOM 19, and Tailwind CSS v4 and its PostCSS plugin: <br> `pnpm --filter @repo/firm-website add next@15 react@19 react-dom@19`<br> `pnpm --filter @repo/firm-website add -D tailwindcss@4 @tailwindcss/postcss postcss autoprefixer` | `pnpm --filter @repo/firm-website list` shows packages.          |
| P002-04 | AGENT       | `apps/firm-website/next.config.ts`      | Create `next.config.ts` with: <br> - `experimental: { typedRoutes: true }`<br> - `transpilePackages: []` (placeholder)<br> - `images: { domains: [] }`<br> - `reactStrictMode: true`<br> - `output: 'standalone'` (optional).                                           | `pnpm --filter @repo/firm-website exec next --version` shows 15. |
| P002-05 | AGENT       | `apps/firm-website/tsconfig.json`       | Create `tsconfig.json` with: <br> - `compilerOptions: { target: "ES2022", module: "ESNext", jsx: "react-jsx", strict: true, baseUrl: ".", paths: { "@/*": ["./src/*"] } }`<br> - include `src/**/*.ts`, `src/**/*.tsx`, etc.                                            | `pnpm --filter @repo/firm-website exec tsc --noEmit` passes.     |
| P002-06 | AGENT       | `apps/firm-website/postcss.config.mjs`  | Create `postcss.config.mjs` with `export default { plugins: { '@tailwindcss/postcss': {}, autoprefixer: {} } }`.                                                                                                                                                        | `pnpm --filter @repo/firm-website exec postcss --version` works. |
| P002-07 | AGENT       | (DELETED)                               | Tailwind v4 uses CSS-first approach with `@theme` directive – no JS config file needed. All tokens live in `packages/ui/src/styles.css`.                                                                                                                                | N/A (subtask removed).                                           |
| P002-08 | AGENT       | `apps/firm-website/src/app/globals.css` | Create `globals.css` with `@import "tailwindcss";` (or the new Tailwind v4 import).                                                                                                                                                                                     | Check file exists.                                               |
| P002-09 | AGENT       | `apps/firm-website/src/app/layout.tsx`  | Create root layout with `<html lang="en">`, `<body>` containing `{children}`, and import `globals.css`. Use `next/font` for Inter or Geist (optional).                                                                                                                  | No command.                                                      |
| P002-10 | AGENT       | `apps/firm-website/src/app/page.tsx`    | Create a simple homepage with a heading like "Your Dedicated Marketer" and some Tailwind classes to verify styling.                                                                                                                                                     | Run `pnpm dev` and open browser.                                 |
| P002-11 | AGENT       | `apps/firm-website/.env.example`        | Create `.env.example` with `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.                                                                                                                                                                                                | Check file exists.                                               |
| P002-12 | AGENT       | Update docs                             | Update `README.md` with instructions to run `pnpm dev` and access the site. Add a section on the monorepo structure.                                                                                                                                                    | None.                                                            |

**Implementation Notes:**

- All subtasks completed successfully
- Next.js 15.5.20 installed with React 19.2.7
- Tailwind CSS v4.3.2 integrated with @tailwindcss/postcss
- TypeScript 6.0.3 configured with strict mode
- Development server runs successfully at http://localhost:3000
- Build passes with type checking
- Note: Removed `baseUrl` from tsconfig.json due to TypeScript 6 deprecation warning; path aliases still work without it
- Note: Changed `experimental.typedRoutes` to `typedRoutes` per Next.js 15.5 guidance
- Note: Removed `output: 'standalone'` from next.config.ts due to Windows symlink permission issues during build
- Created `src/global.d.ts` for CSS module type declarations

---

### Parent Task P003: Configure ESLint, Prettier, and TypeScript for Monorepo

- [x] **P003** | Status: `COMPLETE`
      **Related File Paths:**
  - `packages/eslint-config/`
  - `packages/typescript-config/`
  - `apps/firm-website/eslint.config.js`
  - `apps/firm-website/tsconfig.json` (extending base)
  - Root `.prettierrc`

  **Definition of Done:**
  - Shared ESLint configuration package (`@repo/eslint-config`) is created.
  - Shared TypeScript configuration package (`@repo/typescript-config`) is created.
  - `apps/firm-website` extends these shared configs.
  - Prettier is installed and configured in root.
  - Running `pnpm lint` from root runs linting on all workspaces and succeeds with no errors.

  **Out of Scope:**
  - Adding linting rules for specific frameworks beyond what’s needed for Next.js/React – will be refined later.

  **Rules to Follow:**
  - ESLint uses flat config (`eslint.config.js`).
  - Use `@next/eslint-plugin-next` and `eslint-plugin-react`.
  - TypeScript configs use `"extends"` to inherit from shared base.

  **Advanced Coding Pattern:**
  - **Deep module** – the config packages are simple and rely on a single entry point, but they are versioned and can be updated independently.

  **Anti‑Patterns:**
  - Duplicating configuration across apps.
  - Overly permissive rules.

  **Imports/Exports:**
  - `packages/eslint-config/package.json` exports `"./react.js"` etc.
  - `packages/typescript-config/package.json` exports `"./base.json"` etc.

  **Depends On / Blocks:**
  - Depends on: P001, P002.
  - Blocks: none (but beneficial for later development).

#### Subtasks

| ID      | Agent/Human | File Path / Command                       | Description                                                                                                                                                                                                                                                         | Validation Command                                           |
| ------- | ----------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| P003-01 | AGENT       | `packages/typescript-config/package.json` | Create `package.json` with `name: "@repo/typescript-config"`, `version: "0.0.0"`, `private: true`.                                                                                                                                                                  | `pnpm list` shows it.                                        |
| P003-02 | AGENT       | `packages/typescript-config/base.json`    | Create a base `tsconfig.json` with common compiler options: `target: "ES2022"`, `module: "ESNext"`, `jsx: "react-jsx"`, `strict: true`, `moduleResolution: "bundler"`, `allowJs: true`, `skipLibCheck: true`, etc.                                                  | No command.                                                  |
| P003-03 | AGENT       | `packages/typescript-config/nextjs.json`  | Create a config specific to Next.js that extends base, adds `types: ["next"]`, `resolveJsonModule: true`.                                                                                                                                                           | No command.                                                  |
| P003-04 | AGENT       | `apps/firm-website/tsconfig.json`         | Update to extend `@repo/typescript-config/nextjs.json`. Remove duplicate options. Ensure `"extends": "@repo/typescript-config/nextjs.json"` and keep `"compilerOptions": { "baseUrl": ".", "paths": { "@/*": ["./src/*"] } }`.                                      | `pnpm --filter @repo/firm-website exec tsc --noEmit` passes. |
| P003-05 | AGENT       | `packages/eslint-config/package.json`     | Create `package.json` with `name: "@repo/eslint-config"`, `version: "0.0.0"`, `main: "index.js"`, `exports: { ".": "./index.js", "./react": "./react.js" }`.                                                                                                        | No command.                                                  |
| P003-06 | AGENT       | `packages/eslint-config/index.js`         | Create a base ESLint flat config (export array) with common rules for Node and TypeScript (e.g., `@typescript-eslint/recommended`, `prettier` recommended).                                                                                                         | No command.                                                  |
| P003-07 | AGENT       | `packages/eslint-config/react.js`         | Create a React‑specific ESLint config that extends base and adds the ESLint 9 flat-config equivalents: `reactPlugin.configs.flat.recommended`, `reactHooksPlugin.configs.flat.recommended`, `jsxA11yPlugin.configs.flat.recommended`, and `next` plugin if desired. | No command.                                                  |
| P003-08 | AGENT       | `apps/firm-website/eslint.config.js`      | Create ESLint config that imports `@repo/eslint-config/react` and extends it.                                                                                                                                                                                       | `pnpm --filter @repo/firm-website exec eslint .` succeeds.   |
| P003-09 | AGENT       | Root `.prettierrc`                        | Create `.prettierrc` with common rules (single quotes, semi, tabWidth: 2, etc.) and ensure `prettier` is installed in root devDeps.                                                                                                                                 | `pnpm prettier --check .` passes.                            |
| P003-10 | AGENT       | Root `package.json` scripts               | Add `"format": "prettier --write ."`.                                                                                                                                                                                                                               | Run `pnpm format` and verify changes.                        |
| P003-11 | AGENT       | Update docs                               | Document the shared configs in `docs/configuration.md`.                                                                                                                                                                                                             | None.                                                        |
| P003-12 | AGENT       | `packages/lib/package.json`               | Create `package.json` with `name: "@repo/lib"`, `version: "0.0.0"`, `type: "module"`, `main: "src/index.ts"`, `types: "src/index.ts"`, and `exports: { ".": "./src/index.ts" }`.                                                                                    | `pnpm list` shows it.                                        |
| P003-13 | AGENT       | `packages/lib/tsconfig.json`              | Create `tsconfig.json` that extends `@repo/typescript-config/base.json`.                                                                                                                                                                                            | No command.                                                  |
| P003-14 | AGENT       | `packages/lib/src/index.ts`               | Create a basic entry point with a placeholder export (e.g., `export const hello = 'world'`).                                                                                                                                                                        | No command.                                                  |

**Implementation Notes:**
- All subtasks completed successfully
- Created shared TypeScript config package (@repo/typescript-config) with base.json and nextjs.json
- Created shared ESLint config package (@repo/eslint-config) with base and React-specific configurations
- ESLint uses flat config (eslint.config.js) as required
- apps/firm-website extends both shared configs
- Prettier configured at root with common rules
- Running `pnpm lint` from root succeeds with no errors across all workspaces
- Running `pnpm format` formats all files correctly
- Note: Removed lint script from typescript-config package since it only contains JSON files
- Note: Simplified ESLint react config to avoid plugin config structure issues with ESLint 9
- Note: Added ignores pattern to ESLint config to exclude build artifacts (.next, node_modules, etc.)
- Note: Added React import to layout.tsx to satisfy no-undef rule for React.ReactNode type
- Note: Updated lint script in firm-website to only lint src directory to avoid build artifacts

---

### Parent Task P004: Setup Testing Infrastructure (Vitest + Playwright)

- [x] **P004** | Status: `COMPLETE`
      **Related File Paths:**
  - `vitest.config.ts` (in `apps/firm-website`)
  - `apps/firm-website/src/test/` (or `__tests__/`)
  - `playwright.config.ts` (in root or `apps/firm-website`)
  - `apps/firm-website/package.json` (add test scripts)
  - Root `package.json` (test script uses turbo)

  **Implementation Notes:**
  - Vitest configured with jsdom environment, globals enabled, and e2e directory excluded
  - Added vitest/globals to tsconfig.json for TypeScript support
  - Created sample unit test for add utility function (3 tests passing)
  - Playwright configured with Chromium, webServer for dev server auto-start
  - Created E2E tests for homepage heading and button (2 tests passing)
  - Added test:e2e task to turbo.json
  - Fixed pre-existing issue: added tsconfig.json to eslint-config package
  - All QA checks passing: typecheck, lint, unit tests, E2E tests

  **Definition of Done:**
  - Vitest is installed and configured in `apps/firm-website`.
  - A sample unit test for a utility function runs and passes.
  - Playwright is installed and configured for E2E testing.
  - A sample E2E test (e.g., homepage loads) runs and passes.
  - The root `pnpm test` runs both unit and E2E tests (or separate commands).
  - Test coverage reporting is set up (optional).

  **Out of Scope:**
  - Writing extensive tests for all components – that will be part of later phases.

  **Rules to Follow:**
  - Vitest uses `jsdom` for DOM environment.
  - Use `@testing-library/react` for component testing.
  - Playwright uses the default configuration with Chromium.
  - Use `test:unit` and `test:e2e` scripts for separation.

  **Advanced Coding Pattern:**
  - **Deep module** – the test configuration is encapsulated; tests are written against public APIs.

  **Anti‑Patterns:**
  - Mixing unit and e2e tests in the same command.
  - Not using `vitest`'s watch mode for development.

  **Imports/Exports:**
  - `apps/firm-website/package.json` will have scripts: `"test": "vitest run"`, `"test:watch": "vitest"`, `"test:e2e": "playwright test"`.

  **Depends On / Blocks:**
  - Depends on: P002.
  - Blocks: none (but testing is integrated into development).

#### Subtasks

| ID      | Agent/Human | File Path / Command                          | Description                                                                                                                                                                                                                                                          | Validation Command                                            |
| ------- | ----------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| P004-01 | AGENT       | `apps/firm-website` (install)                | Run: `pnpm --filter @repo/firm-website add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @types/jsdom`                                                                                           | `pnpm list vitest` shows version.                             |
| P004-02 | AGENT       | `apps/firm-website/vitest.config.ts`         | Create `vitest.config.ts` with: <br> - `test: { environment: "jsdom", globals: true, setupFiles: ["./src/test/setup.ts"] }`<br> - `plugins: [react()]` (using `@vitejs/plugin-react`).                                                                               | No command.                                                   |
| P004-03 | AGENT       | `apps/firm-website/src/test/setup.ts`        | Create setup file that imports `@testing-library/jest-dom`.                                                                                                                                                                                                          | No command.                                                   |
| P004-04 | AGENT       | `apps/firm-website/src/test/utils.test.ts`   | Write a sample test for a dummy utility (e.g., `add` function). Use Vitest and `describe`/`it`.                                                                                                                                                                      | `pnpm --filter @repo/firm-website test` runs and passes.      |
| P004-05 | AGENT       | `apps/firm-website/package.json` scripts     | Add: `"test": "vitest run", "test:watch": "vitest", "test:e2e": "playwright test"`.                                                                                                                                                                                  | `pnpm --filter @repo/firm-website test` runs and passes.      |
| P004-06 | AGENT       | Root (install Playwright)                    | Run: `pnpm add -D @playwright/test` in root or in `apps/firm-website` – we'll install in `apps/firm-website` to keep it scoped. <br> `pnpm --filter @repo/firm-website add -D @playwright/test` and then `pnpm --filter @repo/firm-website exec playwright install`. | `pnpm --filter @repo/firm-website exec playwright --version`. |
| P004-07 | AGENT       | `apps/firm-website/playwright.config.ts`     | Create basic Playwright config with `testDir: './src/e2e'`, use `chromium` only for now.                                                                                                                                                                             | No command.                                                   |
| P004-08 | AGENT       | `apps/firm-website/src/e2e/homepage.spec.ts` | Write a simple test that navigates to the homepage and checks for the main heading.                                                                                                                                                                                  | `pnpm --filter @repo/firm-website test:e2e` runs and passes.  |
| P004-09 | AGENT       | Root `turbo.json`                            | Add `test:e2e` task or integrate with `test` if desired. We'll keep `test` for unit, `test:e2e` separately.                                                                                                                                                          | No command.                                                   |
| P004-10 | AGENT       | Update `docs/testing.md`                     | Document testing strategy: Vitest for unit, Playwright for E2E. Include commands.                                                                                                                                                                                    | None.                                                         |

---

### Parent Task P005: Configure Environment Variables and `.env.example`

- [x] **P005** | Status: `COMPLETE`  
      **Related File Paths:**
  - `apps/firm-website/.env.example`
  - `apps/firm-website/.env.local` (gitignored)
  - `apps/firm-website/src/lib/env.ts` (optional)
  - `apps/firm-website/next.config.ts` (if we need public env vars)

  **Definition of Done:**
  - `.env.example` contains all necessary environment variables with placeholder values.
  - `next.config.ts` is configured to expose public env vars (e.g., `NEXT_PUBLIC_SITE_URL`).
  - A utility function to validate environment variables is created (optional but recommended).
  - Documentation on how to set up environment variables is added.

  **Out of Scope:**
  - Adding third‑party API keys – will be done in later phases.

  **Rules to Follow:**
  - Prefix public variables with `NEXT_PUBLIC_`.
  - Do not commit `.env.local` or `.env.production`.
  - Use Zod to validate environment variables at startup (advanced pattern).

  **Advanced Coding Pattern:**
  - **Deep module** – an `env` module that parses and validates all environment variables and exports a typed object.

  **Anti‑Patterns:**
  - Using `process.env` directly without validation.
  - Hard‑coding default values without fallback.

  **Imports/Exports:**
  - `src/lib/env.ts` exports an object `env` with typed variables.

  **Depends On / Blocks:**
  - Depends on: P002.
  - Blocks: none (but useful for future tasks).

#### Subtasks

| ID      | Agent/Human | File Path / Command                | Description                                                                                                                                                                                               | Validation Command                               |
| ------- | ----------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| P005-01 | AGENT       | `apps/firm-website/.env.example`   | Create with: `NEXT_PUBLIC_SITE_URL=http://localhost:3000` and any other placeholders (e.g., `NEXT_PUBLIC_ANALYTICS_ID=`, `FORM_API_KEY=`).                                                                | Check file exists.                               |
| P005-02 | AGENT       | `apps/firm-website/.gitignore`     | Ensure `.env*.local` and `.env.production` are ignored. Also ignore `.env.development` if not used.                                                                                                       | `git check-ignore .env.local` returns a pattern. |
| P005-03 | AGENT       | `apps/firm-website/next.config.ts` | Add `env: { NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL }` or use `publicRuntimeConfig` if needed. Alternatively, you can just rely on `process.env` in the app. We'll leave it as is for now. | No command.                                      |
| P005-04 | AGENT       | `apps/firm-website/src/lib/env.ts` | Create a Zod schema for environment variables: `z.object({ NEXT_PUBLIC_SITE_URL: z.string().url() })`. Parse `process.env` and export `const env = parsed`. Add a warning if missing.                     | No command.                                      |
| P005-05 | AGENT       | Update `docs/environment.md`       | Document how to set up local environment and required variables.                                                                                                                                          | None.                                            |

**Implementation Notes:**

- All subtasks completed successfully
- Installed Zod for environment variable validation
- Created `src/lib/env.ts` with Zod schema validation for NEXT_PUBLIC_SITE_URL
- Added default value for NEXT_PUBLIC_SITE_URL to prevent startup failures
- Updated `.env.example` with additional placeholder variables (NEXT_PUBLIC_ANALYTICS_ID, FORM_API_KEY)
- Configured `next.config.ts` to expose NEXT_PUBLIC_SITE_URL
- Updated root `.gitignore` to include .env.development and .env.production
- Created comprehensive documentation in `docs/environment.md`
- Fixed pre-existing lint issue in `src/test/utils.test.ts` by adding eslint-disable for vitest globals
- All QA checks passing: typecheck, lint, unit tests

---

### Parent Task P006: Setup Content Structure and Content Parsing Utilities

- [x] **P006** | Status: `COMPLETE`  
      **Related File Paths:**
  - `apps/firm-website/src/content/` (folder)
  - `apps/firm-website/src/lib/content.ts` (parsing utilities)
  - `apps/firm-website/package.json` (add `gray-matter` and `remark` if needed)
  - `apps/firm-website/src/types/content.ts` (TypeScript types)

  **Definition of Done:**
  - Content directories are created: `services/`, `industries/`, `demos/`, `faq/`, `pages/`.
  - A sample Markdown file (e.g., `services/website-design.md`) is created with frontmatter and body.
  - A content parsing utility (`getContent`) reads and parses these files, returning typed data.
  - A sample usage in a page (or test) demonstrates retrieval of content.

  **Out of Scope:**
  - Rendering content on pages – will be done in Phase 4.

  **Rules to Follow:**
  - Use `gray-matter` for frontmatter parsing.
  - Define TypeScript interfaces for each content type.
  - Content files must be `.md` (Markdown).
  - The `getContent` function should be server‑side only (Node.js).

  **Advanced Coding Pattern:**
  - **Deep module** – the content layer abstracts the file system and parsing, providing a clean `getContent` function that returns typed objects.

  **Anti‑Patterns:**
  - Reading content directly in components without a central utility.
  - Ignoring error handling when reading files.

  **Imports/Exports:**
  - `src/lib/content.ts` exports functions like `getService(slug)`, `getAllServices()`, etc.
  - `src/types/content.ts` exports `Service`, `Industry`, etc.

  **Depends On / Blocks:**
  - Depends on: P002.
  - Blocks: Phase 4 (page development).

#### Subtasks

| ID      | Agent/Human | File Path / Command                                        | Description                                                                                                                                                                                                          | Validation Command                                       |
| ------- | ----------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| P006-01 | AGENT       | `apps/firm-website/src/content/` folders                   | Create folders: `services/`, `industries/`, `demos/`, `faq/`, `pages/`.                                                                                                                                              | Check directories exist.                                 |
| P006-02 | AGENT       | `apps/firm-website` (install)                              | Install `gray-matter` and `remark` (optional) for parsing Markdown: <br> `pnpm --filter @repo/firm-website add gray-matter remark remark-html`.                                                                      | `pnpm list gray-matter`.                                 |
| P006-03 | AGENT       | `apps/firm-website/src/types/content.ts`                   | Define interfaces: `Service` (title, slug, description, body, etc.), `Industry`, `Demo`, `FAQ`, `Page`.                                                                                                              | No command.                                              |
| P006-04 | AGENT       | `apps/firm-website/src/lib/content.ts`                     | Create functions: `getAllSlugs(dir)`, `getContentBySlug(dir, slug)`, `getAllContent(dir)`. Use `fs` and `path` (Node.js). Parse frontmatter with `gray-matter`. Use `remark` to convert Markdown to HTML (optional). | No command.                                              |
| P006-05 | AGENT       | `apps/firm-website/src/content/services/website-design.md` | Create a sample file with frontmatter: `title: "Website Design"`, `slug: "website-design"`, `description: "..."` and body text.                                                                                      | No command.                                              |
| P006-06 | AGENT       | `apps/firm-website/src/lib/content.test.ts`                | Write a test that calls `getAllContent('services')` and verifies the returned array has the sample service.                                                                                                          | `pnpm --filter @repo/firm-website test` runs and passes. |
| P006-07 | AGENT       | Update `docs/content.md`                                   | Document the content structure, how to add new content files, and the API.                                                                                                                                           | None.                                                    |

**Implementation Notes:**
- Created content directories: services/, industries/, demos/, faq/, pages/
- Installed gray-matter, remark, and remark-html packages
- Defined TypeScript interfaces for Service, Industry, Demo, FAQ, and Page content types
- Implemented content parsing utilities with error handling and HTML conversion
- Created sample service file (website-design.md) with frontmatter
- Wrote comprehensive tests for all content utility functions (7 tests, all passing)
- Documented content structure and API in docs/content.md
- All QA checks passed: typecheck, lint, and tests

---

### Parent Task P006-ZOD: Create Zod Content Schemas in `packages/lib`

- [x] **P006-ZOD** | Status: `COMPLETED`
      **Related File Paths:**
  - `packages/lib/src/schemas/content.ts`
  - `packages/lib/src/index.ts`

  **Definition of Done:**
  - Zod schemas are created for all content types mirroring P006's TypeScript interfaces.
  - Schemas include: `ServiceSchema`, `IndustrySchema`, `DemoSchema`, `FAQSchema`, `PageSchema`.
  - Each schema validates the frontmatter fields (title, slug, description, etc.).
  - Schemas are exported from `packages/lib` for use in content parsing.
  - Unit tests verify schema validation works correctly.

  **Out of Scope:**
  - Using schemas for runtime validation in content parsing – will be done in P006 updates.

  **Rules to Follow:**
  - Use Zod for schema validation.
  - Schemas should match TypeScript interfaces from P006-03.
  - Use `.strict()` for schemas to catch extra fields.
  - Export schemas as named exports.

  **Advanced Coding Pattern:**
  - **Deep module** – schemas are a single source of truth for content validation.

  **Anti‑Patterns:**
  - Duplicating schema logic without Zod.
  - Not keeping schemas in sync with TypeScript interfaces.

  **Imports/Exports:**
  - `packages/lib/src/schemas/content.ts` exports all content schemas.
  - `packages/lib/src/index.ts` re-exports schemas.

  **Depends On / Blocks:**
  - Depends on: P003-12 (packages/lib init), P006 (TypeScript interfaces).
  - Blocks: P006 content parsing updates (optional).

  **Implementation Notes:**
  - Installed zod@^4.4.3 in packages/lib
  - Created all 5 schemas with strict validation matching TypeScript interfaces
  - Added vitest for testing with 20 unit tests covering valid/invalid data and extra field rejection
  - Updated docs/content.md with Zod schema documentation and usage examples
  - All tests pass, lint passes, typecheck passes

#### Subtasks

| ID          | Agent/Human | File Path / Command                        | Description                                                                                                                                  | Validation Command                              | Status |
| ----------- | ----------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | ------ |
| P006-ZOD-01 | AGENT       | `packages/lib` (install)                   | Run: `pnpm --filter @repo/lib add zod`.                                                                                                      | `pnpm list zod` shows it.                       | ✅     |
| P006-ZOD-02 | AGENT       | `packages/lib/src/schemas/content.ts`      | Create `ServiceSchema` with fields: `title: z.string()`, `slug: z.string()`, `description: z.string()`, `body: z.string()`. Use `.strict()`. | No command.                                     | ✅     |
| P006-ZOD-03 | AGENT       | `packages/lib/src/schemas/content.ts`      | Create `IndustrySchema`, `DemoSchema`, `FAQSchema`, `PageSchema` following the same pattern.                                                 | No command.                                     | ✅     |
| P006-ZOD-04 | AGENT       | `packages/lib/src/index.ts`                | Re-export all schemas: `export * from './schemas/content'`.                                                                                  | No command.                                     | ✅     |
| P006-ZOD-05 | AGENT       | `packages/lib/src/schemas/content.test.ts` | Write unit tests: valid data passes, invalid data fails, extra fields rejected.                                                              | `pnpm --filter @repo/lib test` runs and passes. | ✅     |
| P006-ZOD-06 | AGENT       | Update `docs/content.md`                   | Document the Zod schemas and how to use them for validation.                                                                                 | None.                                           | ✅     |

---

### Parent Task P007: Configure Vercel Deployment and Preview Deployments

- [x] **P007** | Status: `COMPLETE`
      **Related File Paths:**
  - Vercel project configuration (handled via dashboard)
  - `vercel.json` (optional)
  - `apps/firm-website/package.json` (build script)
  - Root `turbo.json` (build pipeline)

  **Definition of Done:**
  - Vercel project is created and linked to the GitHub repository.
  - Automatic deployments are set up for `main` (production) and all PRs (preview).
  - The first deployment succeeds, and the site is live at a Vercel URL.
  - Environment variables (`NEXT_PUBLIC_SITE_URL`) are set in Vercel for production and preview.
  - The `turbo` build pipeline works in the Vercel environment (using `turbo build`).

  **Out of Scope:**
  - Setting up custom domain – will be done later.
  - Advanced monitoring or analytics – deferred.

  **Rules to Follow:**
  - Use the Vercel CLI or web UI.
  - The build command for Vercel should be `pnpm turbo build` (or `pnpm --filter @repo/web build`).
  - Output directory: `apps/web/.next` (Vercel auto‑detects if using `next`).
  - Ensure `pnpm` is used as the package manager in Vercel.

  **Advanced Coding Pattern:**
  - **Deep module** – deployment is a separate concern; configuration is minimal.

  **Anti‑Patterns:**
  - Hard‑coding URLs or environment variables in code.
  - Relying on local `.env` in production.

  **Depends On / Blocks:**
  - Depends on: P002 (the app must be buildable).
  - Blocks: none (can be done later, but better early).

#### Subtasks

| ID      | Agent/Human | File Path / Command                             | Description                                                                                                                                                                                  | Validation Command                     |
| ------- | ----------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| P007-01 | HUMAN       | Vercel dashboard                                | Go to Vercel, import the GitHub repository `yourdedicatedmarketer`. Select the root directory and keep the default settings (Framework: Next.js). Vercel will auto‑detect `pnpm`.            | Project created.                       |
| P007-02 | HUMAN       | Vercel settings                                 | Set environment variable `NEXT_PUBLIC_SITE_URL` for production (e.g., your domain once set). For preview, it will auto‑generate.                                                             | Done.                                  |
| P007-03 | AGENT       | `turbo.json` (ensure build task)                | Confirm `build` task runs `pnpm run build` (which should run `next build` in `apps/firm-website`). Already defined in P001.                                                                  | No command.                            |
| P007-04 | AGENT       | `apps/firm-website/package.json` (build script) | Ensure `"build": "next build"` exists.                                                                                                                                                       | No command.                            |
| P007-05 | AGENT       | `vercel.json` (optional)                        | Create a `vercel.json` in root to specify `installCommand: "pnpm install"` and `buildCommand: "pnpm turbo build"` if needed. Vercel usually auto‑detects pnpm.                               | No command.                            |
| P007-06 | HUMAN       | Trigger first deployment                        | Push the current branch to `main` or trigger a manual deployment from Vercel.                                                                                                                | Visit the Vercel URL, site loads.      |
| P007-07 | HUMAN       | PR preview test                                 | Open a test PR, Vercel should deploy a preview.                                                                                                                                              | Preview URL works.                     |
| P007-08 | AGENT       | Update `docs/deployment.md`                     | Document deployment process and environment variables.                                                                                                                                       | None.                                  |
| P007-09 | AGENT       | `.github/workflows/ci.yml`                      | Create GitHub Actions workflow that runs `turbo run lint check-types test` with affected-package filtering. The workflow should run on PR to main and use Turborepo's cache for faster runs. | Workflow exists and runs successfully. |

---

### Parent Task P008: Create Initial README.md and Repository Management Documents

- [x] **P008** | Status: `COMPLETE`
      **Related File Paths:**
  - `README.md` (root)
  - `CONTRIBUTING.md` (optional)
  - `docs/` folder with architecture, decisions, etc.

  **Definition of Done:**
  - `README.md` is comprehensive: covers monorepo overview, tech stack, getting started, folder structure, and deployment.
  - `docs/architecture.md` explains the monorepo design and decisions.
  - `docs/development.md` provides a guide for developers (how to add a new app, add content, etc.).
  - Repository has a clear contribution guide (optional).

  **Implementation Notes:**
  - Enhanced README.md with comprehensive sections: overview, deployment, structure, getting started, technology stack, and documentation links
  - Created docs/architecture.md with detailed system architecture, design principles, key decisions, and future considerations
  - Created docs/development.md with developer onboarding guide, workflow instructions, and troubleshooting
  - CONTRIBUTING.md skipped as optional (not open-source yet)
  - All documentation follows DDD, TDD, BDD, and deep modules principles
  - Quality assurance passed: lint successful, tests passing (30 tests total)

  **Out of Scope:**
  - Writing detailed API docs – those will come later.

  **Rules to Follow:**
  - Keep documentation up‑to‑date with decisions made.
  - Use Markdown and keep it readable.

  **Advanced Coding Pattern:**
  - Not applicable.

  **Anti‑Patterns:**
  - Outdated documentation.

  **Depends On / Blocks:**
  - Depends on: P001–P007 (to reflect current state).
  - Blocks: none.

#### Subtasks

| ID      | Agent/Human | File Path / Command                | Description                                                                                                                                                                                   | Validation Command |
| ------- | ----------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| P008-01 | AGENT       | `README.md`                        | Write a complete README with: <br> - Project name and description<br> - Tech stack<br> - Getting started (clone, install, run dev)<br> - Folder structure<br> - Deployment link<br> - License | Manual check.      |
| P008-02 | AGENT       | `docs/architecture.md`             | Document the monorepo approach, use of Turborepo, pnpm workspaces, and the decision to separate packages.                                                                                     | Manual check.      |
| P008-03 | AGENT       | `docs/development.md`              | Provide a guide for developers: how to add a new app, how to work with packages, how to test, lint, etc.                                                                                      | Manual check.      |
| P008-04 | AGENT       | `CONTRIBUTING.md` (optional)       | If open‑source, add contribution guidelines. For now, maybe skip.                                                                                                                             | Manual check.      |
| P008-05 | AGENT       | Update root `package.json` scripts | Add a `"docs"` script (e.g., `"docs": "serve docs"`) if we want a documentation server – not necessary.                                                                                       | No command.        |

---

## Summary of Phase 1

Phase 1 consists of 8 parent tasks and numerous subtasks. The goal is to have a fully functional monorepo with a working Next.js app, testing setup, content pipeline, and deployment on Vercel. Once all tasks are complete, the foundation is solid for Phase 2: Design System & Core Components.

All tasks are designed to be executed sequentially, but some can be parallelized (e.g., P006 content setup can run concurrently with P007 deployment, but they both depend on P002).

The task list is intended to be used with Windsurf and GitHub, and it follows the principles of SDD, DDD, TDD, BDD, and deep modules. Each parent task is small, and subtasks are actionable.

---

## Phase 2: Design System & Core Components – Task List

This document defines all tasks required to establish the design system foundation and build core components that will be shared across all applications in the monorepo. All tasks are designed to be **SMALL**, actionable, and built with **SDD, DDD, TDD, BDD**, and **Deep Modules** in mind.

---

### Phase 2 Overview

**Objective:** Establish a reusable, accessible, and themable component library in `packages/ui` that serves as the foundation for all applications in the monorepo.

**Key Decisions (from research and user input):**

- **shadcn/ui** as the component foundation (copied into `packages/ui`, fully owned and customizable)
- **Automatic dark mode** with manual light/dark toggle (using `next-themes`)
- **MDX** for content rendering (supports embedded components in markdown)
- **Build directly in `packages/ui`** from the start (clean monorepo approach)
- **Visual regression testing** set up now (Chromatic or Playwright visual comparisons)
- **Color palette:** Deep black (#0a0a0a or #000000), electric blue (#0066FF or #3b82f6), with light/neutral support
- **Eclectic feel** – modern, bold, slightly unexpected but still professional

---

### Parent Task P009: Initialize shadcn/ui in `packages/ui`

- [x] **P009** | Status: `COMPLETE`
      **Related File Paths:**
  - `packages/ui/package.json`
  - `packages/ui/src/index.ts`
  - `packages/ui/src/styles.css`
  - `packages/ui/components.json`
  - `apps/firm-website/` (will consume from `@repo/ui`)

  **Definition of Done:**
  - `packages/ui` is initialized with shadcn/ui.
  - All components from the "New York" style are installed with a Neutral base color.
  - `packages/ui/src/index.ts` exports all components.
  - `packages/ui/src/styles.css` defines CSS variables for theming.
  - `apps/firm-website` can import and use a shadcn/ui component (e.g., `Button`).

  **Out of Scope:**
  - Customizing components beyond shadcn/ui defaults – will be done in P010.
  - Adding dark mode support – will be done in P011.
  - Building custom components – will be done in P012–P018.

  **Rules to Follow:**
  - Use shadcn/ui "New York" style.
  - Base color: "Neutral" (safe default that works with any accent color).
  - All components must be copied into `packages/ui/src/components/`.
  - Use `"exports"` field in `package.json` to expose components.
  - Include `"types"` field for TypeScript support.

  **Advanced Coding Pattern:**
  - **Deep module** – the UI package is a standalone library with a clean public API (`@repo/ui`). Internals are private and can be refactored without affecting consumers.

  **Anti‑Patterns:**
  - Modifying shadcn/ui component source files directly without documenting changes.
  - Exposing internal dependencies (e.g., `@radix-ui/react-*`) through the public API.

  **Imports/Exports:**
  - `packages/ui/package.json` exports `"."` → `./src/index.ts`.
  - `packages/ui/src/index.ts` re‑exports all components from `./components/`.

  **Depends On / Blocks:**
  - Depends on: P001 (monorepo structure), P003-12 (packages/lib init).
  - Blocks: P010 (design tokens), P012–P018 (component development).

#### Subtasks

| ID      | Agent/Human | File Path / Command                  | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Validation Command                                      |
| ------- | ----------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| P009-01 | AGENT       | `packages/ui/package.json`           | Create `package.json` with `name: "@repo/ui"`, `version: "0.0.0"`, `type: "module"`, `main: "src/index.ts"`, `types: "src/index.ts"`, and `exports: { ".": "./src/index.ts" }`.                                                                                                                                                                                                                                                                                                                                                                | `pnpm list` shows it.                                   |
| P009-02 | AGENT       | `packages/ui/components.json`        | Run `pnpm dlx shadcn@canary init` in `packages/ui/` and select the monorepo option when prompted. This will create a `components.json` configured for monorepo use. Ensure the style is "New York", base color is "Neutral", CSS variables are "Yes", and CSS file location is `src/styles.css`. Create a matching `components.json` in `apps/firm-website` with the same `style`, `iconLibrary`, and `baseColor` values. Use explicit aliases pointing to `@repo/ui/components` rather than relying on `tsconfig.json` path resolution alone. | Files exist in both locations.                          |
| P009-03 | AGENT       | `packages/ui/src/styles.css`         | Ensure the generated `styles.css` includes CSS variables from shadcn/ui and uses the `@theme` directive only (no JS config needed for Tailwind v4). We'll enhance with custom tokens in P010.                                                                                                                                                                                                                                                                                                                                                  | File exists with shadcn variables and @theme directive. |
| P009-04 | AGENT       | (DELETED)                            | Tailwind v4 uses CSS-first approach with `@theme` directive in `packages/ui/src/styles.css` – no JS config file needed. The `packages/tailwind-config` package is not needed; all tokens live in `packages/ui/src/styles.css`.                                                                                                                                                                                                                                                                                                                 | N/A (subtask removed).                                  |
| P009-05 | AGENT       | Install shadcn/ui components         | Run `npx shadcn@latest add button` (this will create `src/components/ui/button.tsx`). Also add `card`, `input`, `label`, `accordion` – at minimum.                                                                                                                                                                                                                                                                                                                                                                                             | `src/components/ui/` has components.                    |
| P009-06 | AGENT       | `packages/ui/src/index.ts`           | Create entry point that re‑exports all components: `export { Button } from './components/ui/button'` (and so on).                                                                                                                                                                                                                                                                                                                                                                                                                              | No command.                                             |
| P009-07 | AGENT       | `apps/firm-website/package.json`     | Add `@repo/ui` as a dependency: `"@repo/ui": "workspace:*"`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | `pnpm list` shows it.                                   |
| P009-08 | AGENT       | `apps/firm-website/next.config.ts`   | Add `@repo/ui` to `transpilePackages` array: `transpilePackages: ['@repo/ui']`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                | No command.                                             |
| P009-09 | AGENT       | `apps/firm-website/src/app/page.tsx` | Import `Button` from `@repo/ui` and render it on the homepage to verify integration.                                                                                                                                                                                                                                                                                                                                                                                                                                                           | `pnpm dev` shows the button.                            |
| P009-10 | AGENT       | Update `docs/ui-library.md`          | Document the UI package setup and how to use shadcn/ui components.                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | None.                                                   |

---

### Parent Task P010: Design Tokens – Colors, Typography, Spacing

- [ ] **P010** | Status: `PENDING`
      **Related File Paths:**
  - `packages/ui/src/styles.css` (CSS variables with @theme)
  - `apps/firm-website/src/app/globals.css`

  **Definition of Done:**
  - Brand color palette is defined in CSS variables:
    - **Primary:** Electric Blue (`#0066FF` or oklch equivalent)
    - **Background:** Deep Black (`#0a0a0a` for dark, `#fafafa` for light)
    - **Accent:** A complementary color (e.g., vibrant cyan or purple for eclectic feel)
  - Typography scale is defined (using `Inter` and optionally a serif for accents).
  - Spacing scale (4px increments) is defined.
  - All tokens are defined in CSS using the `@theme` directive (Tailwind v4 CSS-first approach).
  - Dark mode variables are structured (even if not fully implemented yet).

  **Out of Scope:**
  - Building components with these tokens – will be done in P012–P018.
  - Full dark mode implementation – will be done in P011.

  **Rules to Follow:**
  - Use `oklch` color format (Tailwind v4 default).
  - All colors must have accessible contrast ratios (WCAG 2.1 AA).
  - Use `@theme` directive in CSS (Tailwind v4).
  - Keep CSS variables in `:root` and `[data-theme="dark"]` or `.dark`.

  **Advanced Coding Pattern:**
  - **Deep module** – design tokens are a single source of truth; components reference tokens, not hard-coded values.

  **Anti‑Patterns:**
  - Hard‑coding hex values in components.
  - Using `!important` to override colors.

  **Imports/Exports:**
  - `packages/ui/src/styles.css` exports via `@import "tailwindcss"` and `@theme`.

  **Depends On / Blocks:**
  - Depends on: P009 (shadcn/ui setup).
  - Blocks: P011 (dark mode), P012–P018 (component development).

#### Subtasks

| ID      | Agent/Human | File Path / Command                     | Description                                                                                                                                                                                                                                                                                | Validation Command     |
| ------- | ----------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------- |
| P010-01 | AGENT       | Research color palette                  | Based on user preference (black + electric blue + eclectic feel), propose a palette: <br> - Dark: `#0a0a0a` (black) <br> - Primary: `#0066FF` (electric blue) <br> - Accent: `#6C3CE1` (purple) or `#00C2FF` (cyan) <br> - Background light: `#fafafa` <br> - Text: dark/light variations. | Document palette.      |
| P010-02 | AGENT       | `packages/ui/src/styles.css`            | Add `@theme` block with custom colors: <br> `css @theme { --color-primary: oklch(0.55 0.22 264); --color-primary-dark: oklch(0.45 0.20 264); --color-accent: oklch(0.55 0.25 290); --color-background: #0a0a0a; --color-foreground: #fafafa; } `                                           | No command.            |
| P010-03 | AGENT       | `packages/ui/src/styles.css`            | Define typography scale: `--font-sans: "Inter", sans-serif;` and `--font-serif: "Georgia", serif;` for accents. Add text sizes: `--text-xs` to `--text-4xl`.                                                                                                                               | No command.            |
| P010-04 | AGENT       | `packages/ui/src/styles.css`            | Define spacing scale: `--spacing-1: 0.25rem;` through `--spacing-96: 24rem;` (standard 4px increments).                                                                                                                                                                                    | No command.            |
| P010-05 | AGENT       | (DELETED)                               | The `packages/tailwind-config` package is not needed for Tailwind v4 CSS-first approach. All tokens live in `packages/ui/src/styles.css` using the `@theme` directive.                                                                                                                     | N/A (subtask removed). |
| P010-06 | AGENT       | `apps/firm-website/src/app/globals.css` | Import `@repo/ui/styles.css` directly via `@import "@repo/ui/styles.css"` to apply the theme tokens.                                                                                                                                                                                       | No command.            |
| P010-07 | AGENT       | Update `docs/design-tokens.md`          | Document the color palette, typography, and spacing scale with rationales.                                                                                                                                                                                                                 | None.                  |

---

### Parent Task P011: Dark Mode with Theme Switching

- [ ] **P011** | Status: `PENDING`
      **Related File Paths:**
  - `packages/ui/src/styles.css` (dark mode CSS variables)
  - `packages/ui/src/theme-provider.tsx`
  - `apps/firm-website/src/app/layout.tsx`
  - `apps/firm-website/src/components/theme-toggle.tsx` (or in `packages/ui`)

  **Definition of Done:**
  - `next-themes` is installed and configured.
  - A `ThemeProvider` component exists in `packages/ui` or `apps/firm-website`.
  - Dark mode CSS variables are defined (overriding light defaults).
  - A theme toggle button switches between light, dark, and system preference.
  - The site respects system preference by default (automatic).
  - The toggle persists user preference via localStorage.

  **Out of Scope:**
  - Styling all components for dark mode – will be done as components are built.

  **Rules to Follow:**
  - Use `next-themes` for theme management.
  - Use `data-theme` or `class` attribute for theme detection.
  - All CSS variables must have dark mode overrides.
  - Avoid flash of unstyled content (FOUC) – use `suppressHydrationWarning` if needed.

  **Advanced Coding Pattern:**
  - **Deep module** – `ThemeProvider` encapsulates all theme logic; consumers just wrap their app.

  **Anti‑Patterns:**
  - Using `localStorage` directly without `next-themes`.
  - Hard‑coding color values that break in dark mode.

  **Imports/Exports:**
  - `packages/ui/src/theme-provider.tsx` exports `ThemeProvider`.
  - `packages/ui/src/theme-toggle.tsx` exports `ThemeToggle`.

  **Depends On / Blocks:**
  - Depends on: P009 (shadcn/ui setup), P010 (design tokens).
  - Blocks: None.

#### Subtasks

| ID      | Agent/Human | File Path / Command                           | Description                                                                                                                                                                                      | Validation Command                            |
| ------- | ----------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------- |
| P011-01 | AGENT       | `packages/ui` (install)                       | Run: `pnpm --filter @repo/ui add next-themes`. Install `next-themes` as a dependency of `packages/ui` since the ThemeProvider component lives there.                                             | `pnpm list next-themes` shows it in @repo/ui. |
| P011-02 | AGENT       | `packages/ui/src/theme-provider.tsx`          | Create `ThemeProvider` component using `next-themes` (now installed in packages/ui). Wrap with `ThemeProvider` that accepts `attribute="class"`, `defaultTheme="system"`, `enableSystem={true}`. | No command.                                   |
| P011-03 | AGENT       | `apps/firm-website/src/app/layout.tsx`        | Wrap the entire app with `ThemeProvider` from `@repo/ui`.                                                                                                                                        | No command.                                   |
| P011-04 | AGENT       | `packages/ui/src/styles.css`                  | Add dark mode variables: `.dark { --color-background: #0a0a0a; --color-foreground: #fafafa; }` and override all other tokens.                                                                    | No command.                                   |
| P011-05 | AGENT       | `packages/ui/src/theme-toggle.tsx`            | Create a button that toggles between `light`, `dark`, and `system` using `useTheme` from `next-themes`. Use `Button` component and icons (lucide-react).                                         | No command.                                   |
| P011-06 | AGENT       | `apps/firm-website` (install)                 | Run: `pnpm --filter @repo/firm-website add lucide-react`.                                                                                                                                        | `pnpm list lucide-react` shows it.            |
| P011-07 | AGENT       | `apps/firm-website/src/components/header.tsx` | Add `ThemeToggle` to the header.                                                                                                                                                                 | `pnpm dev` shows toggle.                      |
| P011-08 | AGENT       | Update `docs/theme.md`                        | Document dark mode implementation and how to add theme support to components.                                                                                                                    | None.                                         |

---

### Parent Task P012: Build Core UI Components – Button, Card, Container

- [ ] **P012** | Status: `PENDING`
      **Related File Paths:**
  - `packages/ui/src/components/ui/button.tsx` (already from shadcn)
  - `packages/ui/src/components/ui/card.tsx` (from shadcn)
  - `packages/ui/src/components/ui/container.tsx` (custom)
  - `packages/ui/src/components/ui/section.tsx` (custom)
  - `packages/ui/src/index.ts` (exports)

  **Definition of Done:**
  - **Button** – shadcn/ui button with our brand colors; variants: `default`, `primary`, `secondary`, `outline`, `ghost`, `destructive`.
  - **Card** – shadcn/ui card with proper theming.
  - **Container** – custom component that centers content with max-width and responsive padding.
  - **Section** – custom component that adds consistent vertical spacing.
  - All components are exported from `@repo/ui`.
  - All components have basic unit tests (render, props).

  **Out of Scope:**
  - Advanced button states (loading, disabled) – will be handled by shadcn.

  **Rules to Follow:**
  - Extend shadcn/ui components with our theme.
  - Use `cn` utility from `class-variance-authority` for class merging.
  - Components must be Server Components by default (unless they need interactivity).

  **Advanced Coding Pattern:**
  - **Deep module** – each component is a single file with a simple interface; variants are managed internally.

  **Anti‑Patterns:**
  - Passing raw Tailwind classes from parent components (use variants instead).
  - Overriding shadcn/ui components with `!important`.

  **Imports/Exports:**
  - `packages/ui/src/index.ts` exports `Button`, `Card`, `Container`, `Section`.

  **Depends On / Blocks:**
  - Depends on: P009 (shadcn/ui setup), P010 (design tokens).
  - Blocks: P015–P021 (page development).

#### Subtasks

| ID      | Agent/Human | File Path / Command                             | Description                                                                                                                                                                       | Validation Command                   |
| ------- | ----------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| P012-01 | AGENT       | `packages/ui` (install components)              | Run `npx shadcn@latest add button card` (if not already done).                                                                                                                    | Files exist in `src/components/ui/`. |
| P012-02 | AGENT       | `packages/ui/src/components/ui/button.tsx`      | Customize button variant mapping to use brand colors (e.g., `primary` uses `--color-primary`).                                                                                    | No command.                          |
| P012-03 | AGENT       | `packages/ui/src/components/ui/container.tsx`   | Create `Container` component: `interface ContainerProps { children: ReactNode; maxWidth?: 'sm'                                                                                    | 'md'                                 | 'lg' | 'xl' | 'full'; className?: string; }`. Default: `maxWidth="xl"` with padding. | No command. |
| P012-04 | AGENT       | `packages/ui/src/components/ui/section.tsx`     | Create `Section` component: adds `py-12 md:py-20` (or similar vertical spacing). Accepts `className` override.                                                                    | No command.                          |
| P012-05 | AGENT       | `packages/ui/src/index.ts`                      | Add exports: `export * from './components/ui/button'; export * from './components/ui/card'; export * from './components/ui/container'; export * from './components/ui/section';`. | No command.                          |
| P012-06 | AGENT       | `packages/ui/src/components/ui/button.test.tsx` | Write unit test: renders button, applies variant classes, handles click.                                                                                                          | `pnpm --filter @repo/ui test` runs.  |
| P012-07 | AGENT       | `apps/firm-website/src/app/page.tsx`            | Test all components on the homepage (temporary).                                                                                                                                  | `pnpm dev` shows components.         |
| P012-08 | AGENT       | Update `docs/components.md`                     | Document Button, Card, Container, Section usage.                                                                                                                                  | None.                                |

---

### Parent Task P013: Build Header and Navigation Components

- [ ] **P013** | Status: `PENDING`
      **Related File Paths:**
  - `packages/ui/src/components/layout/header.tsx`
  - `packages/ui/src/components/layout/mobile-menu.tsx`
  - `packages/ui/src/components/navigation/nav-link.tsx`
  - `packages/ui/src/index.ts` (exports)

  **Definition of Done:**
  - **Header** component: fixed/sticky, contains logo, nav links, and theme toggle.
  - **NavLink** component: active state styling, client‑side navigation (Next.js `Link`).
  - **MobileMenu** component: hamburger menu, slide‑out overlay with navigation links.
  - Components are responsive (desktop: horizontal nav; mobile: hamburger).
  - Components are exported from `@repo/ui`.

  **Out of Scope:**
  - Actually building the firm's specific navigation links – will be done in Phase 4.

  **Rules to Follow:**
  - Use Next.js `Link` for navigation.
  - Header must be sticky and support dark/light mode.
  - Mobile menu should be accessible (focus management, ARIA).
  - Use `useState` and `useEffect` for mobile menu, so these are Client Components.

  **Advanced Coding Pattern:**
  - **Deep module** – `Header` composes `NavLink` and `MobileMenu` internally; consumers just use `<Header />`.

  **Anti‑Patterns:**
  - Hard‑coding navigation links in the component – accept as `items` prop.
  - Using non‑semantic HTML elements (use `<nav>`, `<ul>`, `<li>`).

  **Imports/Exports:**
  - `packages/ui/src/components/layout/header.tsx` exports `Header`.
  - `packages/ui/src/components/layout/mobile-menu.tsx` exports `MobileMenu`.
  - `packages/ui/src/components/navigation/nav-link.tsx` exports `NavLink`.

  **Depends On / Blocks:**
  - Depends on: P012 (Button, Container).
  - Blocks: P015–P021 (page development).

#### Subtasks

| ID      | Agent/Human | File Path / Command                                  | Description                                                                                                                                                                      | Validation Command                  |
| ------- | ----------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| P013-01 | AGENT       | `packages/ui/src/components/navigation/nav-link.tsx` | Create `NavLink` component that wraps Next.js `Link` and adds `aria-current="page"` when active. Accepts `href`, `children`, `className`.                                        | No command.                         |
| P013-02 | AGENT       | `packages/ui/src/components/layout/header.tsx`       | Create `Header` component with: <br> - `Container` for layout <br> - Logo (placeholder) <br> - Desktop nav (ul > li > NavLink) <br> - ThemeToggle <br> - Mobile hamburger button | No command.                         |
| P013-03 | AGENT       | `packages/ui/src/components/layout/mobile-menu.tsx`  | Create `MobileMenu` component: <br> - Slide‑out panel from right <br> - Overlay background <br> - Navigation links <br> - Close button <br> - Uses `useState` for open/close     | No command.                         |
| P013-04 | AGENT       | `packages/ui/src/index.ts`                           | Add exports for `Header`, `MobileMenu`, `NavLink`.                                                                                                                               | No command.                         |
| P013-05 | AGENT       | `packages/ui/src/components/layout/header.test.tsx`  | Write unit test: renders header, toggles mobile menu.                                                                                                                            | `pnpm --filter @repo/ui test` runs. |
| P013-06 | AGENT       | `apps/firm-website/src/app/layout.tsx`               | Add `Header` to the layout (above `{children}`). Pass a `navItems` prop with initial links.                                                                                      | `pnpm dev` shows header.            |
| P013-07 | AGENT       | Update `docs/components.md`                          | Document Header, NavLink, MobileMenu usage.                                                                                                                                      | None.                               |

---

### Parent Task P014: Build Footer Component

- [ ] **P014** | Status: `PENDING`
      **Related File Paths:**
  - `packages/ui/src/components/layout/footer.tsx`
  - `packages/ui/src/index.ts` (exports)

  **Definition of Done:**
  - **Footer** component with:
    - Business name/logo
    - Navigation links (About, Services, Pricing, Contact)
    - Contact info (email, phone, address)
    - Social media links (icons)
    - Copyright notice
  - Component is exported from `@repo/ui`.
  - Footer has proper dark/light mode theming.

  **Out of Scope:**
  - Actual social media links – will be added in Phase 4.
  - Dynamic content (copyright year, etc.) – will be handled in Phase 4.

  **Rules to Follow:**
  - Use `Container` and `Section` for layout.
  - Semantic HTML (`<footer>`, `<nav>`).
  - Responsive (stack on mobile, grid on desktop).

  **Advanced Coding Pattern:**
  - **Deep module** – `Footer` is a single component with a clean interface (accepts `socialLinks`, `navLinks`, `contactInfo`).

  **Anti‑Patterns:**
  - Hard‑coding content that changes frequently.

  **Imports/Exports:**
  - `packages/ui/src/components/layout/footer.tsx` exports `Footer`.

  **Depends On / Blocks:**
  - Depends on: P012 (Container, Section).
  - Blocks: P015–P021 (page development).

#### Subtasks

| ID      | Agent/Human | File Path / Command                                 | Description                                                                                                                                                                                       | Validation Command                  |
| ------- | ----------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| P014-01 | AGENT       | `packages/ui/src/components/layout/footer.tsx`      | Create `Footer` with: <br> - `Container` with grid layout <br> - Logo area <br> - Nav links (map from props) <br> - Contact info <br> - Social icons (using lucide-react) <br> - Copyright notice | No command.                         |
| P014-02 | AGENT       | `apps/firm-website` (install)                       | Run: `pnpm --filter @repo/firm-website add lucide-react` (if not already).                                                                                                                        | `pnpm list lucide-react` shows it.  |
| P014-03 | AGENT       | `packages/ui/src/index.ts`                          | Add export for `Footer`.                                                                                                                                                                          | No command.                         |
| P014-04 | AGENT       | `apps/firm-website/src/app/layout.tsx`              | Add `Footer` to the layout (below `{children}`). Pass props for nav links, contact info (placeholder).                                                                                            | `pnpm dev` shows footer.            |
| P014-05 | AGENT       | `packages/ui/src/components/layout/footer.test.tsx` | Write unit test: renders footer, shows links and copyright.                                                                                                                                       | `pnpm --filter @repo/ui test` runs. |
| P014-06 | AGENT       | Update `docs/components.md`                         | Document Footer usage.                                                                                                                                                                            | None.                               |

---

### Parent Task P015: Build Form Components

- [ ] **P015** | Status: `PENDING`
      **Related File Paths:**
  - `packages/ui/src/components/ui/input.tsx` (from shadcn)
  - `packages/ui/src/components/ui/textarea.tsx` (from shadcn)
  - `packages/ui/src/components/ui/label.tsx` (from shadcn)
  - `packages/ui/src/components/ui/form.tsx` (from shadcn)
  - `packages/ui/src/index.ts` (exports)

  **Definition of Done:**
  - `Input`, `Textarea`, `Label`, and `Form` components are installed from shadcn/ui.
  - They are themed with brand colors.
  - They are exported from `@repo/ui`.
  - Basic validation tests (component rendering).

  **Out of Scope:**
  - Form submission logic – will be handled in Phase 5.

  **Rules to Follow:**
  - Use shadcn/ui form components (which use `react-hook-form`).
  - Keep form components pure – no business logic.

  **Advanced Coding Pattern:**
  - **Deep module** – form components are simple wrappers around shadcn/ui; form validation is handled separately.

  **Anti‑Patterns:**
  - Adding business logic inside form components.

  **Imports/Exports:**
  - `packages/ui/src/index.ts` exports `Input`, `Textarea`, `Label`, `Form`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage`, `FormField`.

  **Depends On / Blocks:**
  - Depends on: P009 (shadcn/ui setup).
  - Blocks: Contact page (Phase 4).

#### Subtasks

| ID      | Agent/Human | File Path / Command                           | Description                                                  | Validation Command                   |
| ------- | ----------- | --------------------------------------------- | ------------------------------------------------------------ | ------------------------------------ |
| P015-01 | AGENT       | `packages/ui` (install components)            | Run `npx shadcn@latest add input textarea label form`.       | Files exist in `src/components/ui/`. |
| P015-02 | AGENT       | `packages/ui/src/components/ui/input.tsx`     | Customize styling to match brand (border color, focus ring). | No command.                          |
| P015-03 | AGENT       | `packages/ui/src/components/ui/textarea.tsx`  | Customize styling.                                           | No command.                          |
| P015-04 | AGENT       | `packages/ui/src/components/ui/label.tsx`     | Customize styling.                                           | No command.                          |
| P015-05 | AGENT       | `packages/ui/src/index.ts`                    | Add exports for all form components.                         | No command.                          |
| P015-06 | AGENT       | `packages/ui/src/components/ui/form.test.tsx` | Write unit test: form components render with labels.         | `pnpm --filter @repo/ui test` runs.  |
| P015-07 | AGENT       | Update `docs/components.md`                   | Document form components usage.                              | None.                                |

---

### Parent Task P016: Build Accordion/FAQ Component

- [ ] **P016** | Status: `PENDING`
      **Related File Paths:**
  - `packages/ui/src/components/ui/accordion.tsx` (from shadcn)
  - `packages/ui/src/index.ts` (exports)

  **Definition of Done:**
  - `Accordion` component is installed from shadcn/ui.
  - It is themed with brand colors.
  - It supports single and multiple open items.
  - It is exported from `@repo/ui`.

  **Out of Scope:**
  - Populating with FAQ content – will be done in Phase 4.

  **Rules to Follow:**
  - Use shadcn/ui accordion (which uses Radix UI).
  - Ensure accessibility (ARIA attributes).

  **Advanced Coding Pattern:**
  - **Deep module** – accordion is a standalone component with a simple data‑driven interface.

  **Anti‑Patterns:**
  - Overriding Radix UI behavior incorrectly.

  **Imports/Exports:**
  - `packages/ui/src/index.ts` exports `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`.

  **Depends On / Blocks:**
  - Depends on: P009 (shadcn/ui setup).
  - Blocks: FAQ page (Phase 4).

#### Subtasks

| ID      | Agent/Human | File Path / Command                                | Description                                             | Validation Command                   |
| ------- | ----------- | -------------------------------------------------- | ------------------------------------------------------- | ------------------------------------ |
| P016-01 | AGENT       | `packages/ui` (install components)                 | Run `npx shadcn@latest add accordion`.                  | Files exist in `src/components/ui/`. |
| P016-02 | AGENT       | `packages/ui/src/components/ui/accordion.tsx`      | Customize styling.                                      | No command.                          |
| P016-03 | AGENT       | `packages/ui/src/index.ts`                         | Add exports for accordion components.                   | No command.                          |
| P016-04 | AGENT       | `packages/ui/src/components/ui/accordion.test.tsx` | Write unit test: accordion renders, expands, collapses. | `pnpm --filter @repo/ui test` runs.  |
| P016-05 | AGENT       | Update `docs/components.md`                        | Document accordion usage.                               | None.                                |

---

### Parent Task P017: Build MDX Content Rendering Infrastructure

- [ ] **P017** | Status: `PENDING`
      **Related File Paths:**
  - `apps/firm-website/next.config.mjs` (MDX configuration)
  - `apps/firm-website/mdx-components.tsx` (MDX components mapping)
  - `packages/ui/src/components/mdx/` (MDX‑specific components)
  - `apps/firm-website/src/content/` (existing content structure)

  **Definition of Done:**
  - `@next/mdx` is installed and configured in `apps/firm-website`.
  - MDX files (`.mdx`) can be placed in `src/content/` and rendered in pages.
  - Custom MDX components (from `@repo/ui`) are mapped.
  - A sample MDX page renders successfully.

  **Out of Scope:**
  - Writing all content files – will be done in Phase 4.
  - MDX frontmatter parsing – will be handled by `gray-matter` integration.

  **Rules to Follow:**
  - Use `next.config.mjs` with `withMDX`.
  - Create `mdx-components.tsx` at root of `apps/firm-website`.
  - MDX components should be pure and reusable.

  **Advanced Coding Pattern:**
  - **Deep module** – MDX rendering is a separate concern; pages just import `.mdx` files.

  **Anti‑Patterns:**
  - Placing MDX files outside `src/` where they're not processed.
  - Not mapping UI components for MDX.

  **Imports/Exports:**
  - `apps/firm-website/mdx-components.tsx` exports `useMDXComponents`.

  **Depends On / Blocks:**
  - Depends on: P012 (UI components).
  - Blocks: Phase 4 (content‑driven pages).

#### Subtasks

| ID      | Agent/Human | File Path / Command                              | Description                                                                                                                                      | Validation Command             |
| ------- | ----------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------ |
| P017-01 | AGENT       | `apps/firm-website` (install)                    | Run: `pnpm --filter @repo/firm-website add @next/mdx @mdx-js/loader @mdx-js/react @types/mdx`.                                                   | `pnpm list` shows packages.    |
| P017-02 | AGENT       | `apps/firm-website/next.config.mjs`              | Configure MDX: <br> - Import `createMDX` <br> - Set `pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx']` <br> - Wrap export with `withMDX`. | No command.                    |
| P017-03 | AGENT       | `apps/firm-website/mdx-components.tsx`           | Create `mdx-components.tsx` in root of app (not `src/`). Map `Button`, `Card`, `Container`, `Section`, `Accordion` components from `@repo/ui`.   | No command.                    |
| P017-04 | AGENT       | `apps/firm-website/src/content/pages/sample.mdx` | Create a sample MDX file with frontmatter (`title`, `slug`) and body content using mapped components.                                            | No command.                    |
| P017-05 | AGENT       | `apps/firm-website/src/app/test-mdx/page.tsx`    | Create a test page that imports and renders `sample.mdx`.                                                                                        | `pnpm dev` shows rendered MDX. |
| P017-06 | AGENT       | Update `docs/content.md`                         | Document MDX setup and how to create content files.                                                                                              | None.                          |

---

### Parent Task P018: Setup Visual Regression Testing (Chromatic)

- [ ] **P018** | Status: `PENDING`
      **Related File Paths:**
  - `packages/ui/.storybook/` (Storybook setup)
  - `packages/ui/src/components/**/*.stories.tsx`
  - `packages/ui/package.json` (scripts)
  - `.github/workflows/chromatic.yml` (GitHub Actions)

  **Definition of Done:**
  - Storybook is installed and configured in `packages/ui`.
  - Stories are written for all core components (Button, Card, Container, Header, Footer, Form components, Accordion).
  - Chromatic is set up with a project token.
  - GitHub Actions workflow runs Chromatic on every PR.
  - Visual regression tests pass.

  **Out of Scope:**
  - Stories for every single component variant – focus on key components.
  - Integrating Chromatic with Vercel previews – can be done later.

  **Rules to Follow:**
  - Use Storybook 8+ with Next.js integration.
  - Use Chromatic for visual testing (free tier for open‑source).
  - Keep stories simple and focused.

  **Advanced Coding Pattern:**
  - **Deep module** – Storybook is a separate tool that tests the UI package; it doesn't affect production code.

  **Anti‑Patterns:**
  - Writing stories that are too complex or include business logic.

  **Imports/Exports:**
  - `packages/ui/.storybook/` contains configuration.

  **Depends On / Blocks:**
  - Depends on: P012–P016 (components).
  - Blocks: None.

#### Subtasks

| ID      | Agent/Human | File Path / Command                                    | Description                                                                                                                                                        | Validation Command                       |
| ------- | ----------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------- |
| P018-01 | AGENT       | `packages/ui` (install)                                | Run: `pnpm --filter @repo/ui add -D @storybook/react @storybook/addon-essentials storybook`.                                                                       | `pnpm list storybook` shows it.          |
| P018-02 | AGENT       | `packages/ui` (init)                                   | Run: `npx storybook@latest init` in `packages/ui` – this will create `.storybook/` and sample stories.                                                             | `.storybook/` exists.                    |
| P018-03 | AGENT       | `packages/ui/.storybook/main.ts`                       | Configure Storybook to use Next.js: `framework: { name: "@storybook/nextjs", options: { builder: { useSWC: true } } }`.                                            | No command.                              |
| P018-04 | AGENT       | `packages/ui/src/components/ui/button.stories.tsx`     | Write Storybook story for Button with all variants (default, primary, secondary, outline, ghost, destructive).                                                     | `pnpm --filter @repo/ui storybook` runs. |
| P018-05 | AGENT       | `packages/ui/src/components/ui/card.stories.tsx`       | Write Storybook story for Card.                                                                                                                                    | `pnpm --filter @repo/ui storybook` runs. |
| P018-06 | AGENT       | `packages/ui/src/components/layout/header.stories.tsx` | Write Storybook story for Header.                                                                                                                                  | `pnpm --filter @repo/ui storybook` runs. |
| P018-07 | AGENT       | `packages/ui/src/components/layout/footer.stories.tsx` | Write Storybook story for Footer.                                                                                                                                  | `pnpm --filter @repo/ui storybook` runs. |
| P018-08 | AGENT       | `packages/ui/package.json` scripts                     | Add: `"storybook": "storybook dev -p 6006", "storybook:build": "storybook build"`.                                                                                 | No command.                              |
| P018-09 | HUMAN       | Chromatic setup                                        | Create Chromatic account, get project token. Add to GitHub secrets as `CHROMATIC_PROJECT_TOKEN`.                                                                   | Token saved.                             |
| P018-10 | AGENT       | `.github/workflows/chromatic.yml`                      | Create GitHub Actions workflow: runs on PR, uses `pnpm`, runs `pnpm storybook:build`, then `npx chromatic --project-token=${{ secrets.CHROMATIC_PROJECT_TOKEN }}`. | Workflow exists.                         |
| P018-11 | AGENT       | Update `docs/testing.md`                               | Document Storybook and Chromatic setup.                                                                                                                            | None.                                    |

---

### Parent Task P018-VITEST: Setup Vitest for `packages/ui`

- [ ] **P018-VITEST** | Status: `PENDING`
      **Related File Paths:**
  - `packages/ui/vitest.config.ts`
  - `packages/ui/package.json` (add test scripts)

  **Definition of Done:**
  - Vitest is installed and configured in `packages/ui`.
  - Vitest config is scoped to the `packages/ui` workspace.
  - A sample unit test for a UI component runs and passes.
  - Test script is added to `packages/ui/package.json`.

  **Out of Scope:**
  - Writing extensive tests for all UI components – will be done in Phase 6.

  **Rules to Follow:**
  - Vitest uses `jsdom` for DOM environment.
  - Use `@testing-library/react` for component testing.
  - Keep the config scoped to `packages/ui` only.

  **Advanced Coding Pattern:**
  - **Deep module** – the test configuration is encapsulated in the UI package.

  **Anti‑Patterns:**
  - Not scoping the config to the workspace.
  - Mixing UI package tests with app tests.

  **Imports/Exports:**
  - `packages/ui/package.json` will have scripts: `"test": "vitest run"`, `"test:watch": "vitest"`.

  **Depends On / Blocks:**
  - Depends on: P009 (shadcn/ui setup).
  - Blocks: Phase 6 (comprehensive UI testing).

#### Subtasks

| ID             | Agent/Human | File Path / Command                             | Description                                                                                                                                                                            | Validation Command                             |
| -------------- | ----------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| P018-VITEST-01 | AGENT       | `packages/ui` (install)                         | Run: `pnpm --filter @repo/ui add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @types/jsdom`                       | `pnpm list vitest` shows version.              |
| P018-VITEST-02 | AGENT       | `packages/ui/vitest.config.ts`                  | Create `vitest.config.ts` with: <br> - `test: { environment: "jsdom", globals: true, setupFiles: ["./src/test/setup.ts"] }`<br> - `plugins: [react()]` (using `@vitejs/plugin-react`). | No command.                                    |
| P018-VITEST-03 | AGENT       | `packages/ui/src/test/setup.ts`                 | Create setup file that imports `@testing-library/jest-dom`.                                                                                                                            | No command.                                    |
| P018-VITEST-04 | AGENT       | `packages/ui/src/components/ui/button.test.tsx` | Write a sample test for the Button component. Use Vitest and `describe`/`it`.                                                                                                          | `pnpm --filter @repo/ui test` runs and passes. |
| P018-VITEST-05 | AGENT       | `packages/ui/package.json` scripts              | Add: `"test": "vitest run", "test:watch": "vitest"`.                                                                                                                                   | `pnpm --filter @repo/ui test` runs and passes. |
| P018-VITEST-06 | AGENT       | Update `docs/testing.md`                        | Document the UI package testing setup.                                                                                                                                                 | None.                                          |

---

### Parent Task P019: Update Documentation and Repository Management

- [ ] **P019** | Status: `PENDING`
      **Related File Paths:**
  - `README.md` (root)
  - `docs/architecture.md`
  - `docs/components.md`
  - `docs/testing.md`
  - `docs/content.md`
  - `docs/deployment.md`

  **Definition of Done:**
  - All docs are updated to reflect Phase 2 additions.
  - `README.md` includes section on UI package.
  - `docs/components.md` is complete with all components.
  - `docs/testing.md` covers unit, integration, e2e, and visual regression testing.
  - `docs/development.md` includes guide on adding new components.

  **Out of Scope:**
  - Writing API docs – will come later.

  **Rules to Follow:**
  - Keep docs up‑to‑date.
  - Use clear, concise language.

  **Advanced Coding Pattern:**
  - N/A.

  **Anti‑Patterns:**
  - Outdated documentation.

  **Depends On / Blocks:**
  - Depends on: P009–P018.
  - Blocks: None.

#### Subtasks

| ID      | Agent/Human | File Path / Command   | Description                                                                                                                                        | Validation Command |
| ------- | ----------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| P019-01 | AGENT       | `README.md`           | Update with Phase 2 status, add section on UI package.                                                                                             | Manual check.      |
| P019-02 | AGENT       | `docs/components.md`  | Update with all components built (Button, Card, Container, Section, Header, NavLink, MobileMenu, Footer, Input, Textarea, Label, Form, Accordion). | Manual check.      |
| P019-03 | AGENT       | `docs/testing.md`     | Add section on Storybook and Chromatic.                                                                                                            | Manual check.      |
| P019-04 | AGENT       | `docs/development.md` | Add guide: "How to add a new component to `@repo/ui`".                                                                                             | Manual check.      |
| P019-05 | AGENT       | `docs/content.md`     | Update with MDX setup and usage.                                                                                                                   | Manual check.      |

---

## Summary of Phase 2

Phase 2 consists of 11 parent tasks (P009–P019) and numerous subtasks. The goal is to establish a complete design system and component library that serves as the foundation for all pages and future applications.

**Key Deliverables:**

- `packages/ui` with shadcn/ui components, themed with brand colors
- Dark mode with theme switching
- Core components: Button, Card, Container, Section, Header, NavLink, MobileMenu, Footer, Form components, Accordion
- MDX content rendering infrastructure
- Visual regression testing with Storybook + Chromatic

Once all Phase 2 tasks are complete, the foundation is solid for **Phase 3: Content & Data Management** and **Phase 4: Page Development**.

---

## Phase 3: Content & Data Management – Task List

This document defines all tasks required to define content types, create utilities for content management, and write all content for the Your Dedicated Marketer website. All tasks are designed to be **SMALL**, actionable, and built with **SDD, DDD, TDD, BDD**, and **Deep Modules** in mind.

---

### Phase 3 Overview

**Objective:** Establish a complete content pipeline and write all content for the marketing website, including services, industries, demos, FAQs, and static pages.

**Key Decisions (from research and analysis):**

- **`@next/mdx` + manual frontmatter parsing** – first-party, no extra build step
- **Export `metadata` from each MDX file** – idiomatic Next.js approach
- **Nested content structure** – `src/content/services/`, `industries/`, `demos/`, `faq/`, `pages/`
- **Static generation at build time** – best performance, CDN caching
- **Content search deferred** – not needed for 35 pages

---

### Parent Task P020: Define Content TypeScript Types and Schemas

- [ ] **P020** | Status: `PENDING`
      **Related File Paths:**
  - `packages/lib/src/types/content.ts`
  - `packages/lib/src/index.ts`
  - `apps/firm-website/src/types/content.ts` (or re-export from `@repo/lib`)

  **Definition of Done:**
  - TypeScript interfaces are defined for all content entities:
    - `Service` – title, slug, description, body, featured, order
    - `Industry` – title, slug, description, body, featured, order
    - `Demo` – title, slug, description, challenge, approach, outcome, industry
    - `FAQ` – question, answer, category, order
    - `Page` – title, slug, body, description
  - Each interface has appropriate optional fields and validation constraints.
  - Types are exported from `@repo/lib` and consumed by `apps/firm-website`.

  **Out of Scope:**
  - Runtime validation – will be handled by Zod in P021.

  **Rules to Follow:**
  - All types must be in `packages/lib` for reusability across apps.
  - Use `type` for simple unions, `interface` for objects.
  - Add JSDoc comments for each property.
  - Use branded types for slugs (e.g., `type Slug = string & { __brand: 'slug' }`).

  **Advanced Coding Pattern:**
  - **Deep module** – types are a clean, well-documented API that content utilities depend on.

  **Anti‑Patterns:**
  - Duplicating types across multiple packages.
  - Using `any` or overly permissive types.

  **Imports/Exports:**
  - `packages/lib/src/types/content.ts` exports `Service`, `Industry`, `Demo`, `FAQ`, `Page`.
  - `packages/lib/src/index.ts` re‑exports them.

  **Depends On / Blocks:**
  - Depends on: P001 (monorepo structure), P003-12 (packages/lib init).
  - Blocks: P021 (content utilities).

#### Subtasks

| ID      | Agent/Human | File Path / Command                      | Description                                                                                                                                               | Validation Command |
| ------- | ----------- | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| P020-01 | AGENT       | `packages/lib/src/types/content.ts`      | Create file and define `Service` interface: `{ title: string; slug: string; description: string; body: string; featured?: boolean; order?: number; }`.    | No command.        |
| P020-02 | AGENT       | `packages/lib/src/types/content.ts`      | Define `Industry` interface: similar to `Service` but with optional `emoji` or `icon` field.                                                              | No command.        |
| P020-03 | AGENT       | `packages/lib/src/types/content.ts`      | Define `Demo` interface: `{ title: string; slug: string; description: string; challenge: string; approach: string; outcome: string; industry: string; }`. | No command.        |
| P020-04 | AGENT       | `packages/lib/src/types/content.ts`      | Define `FAQ` interface: `{ question: string; answer: string; category: 'general'                                                                          | 'pricing'          | 'process'; order?: number; }`. | No command. |
| P020-05 | AGENT       | `packages/lib/src/types/content.ts`      | Define `Page` interface: `{ title: string; slug: string; description: string; body: string; }`.                                                           | No command.        |
| P020-06 | AGENT       | `packages/lib/src/index.ts`              | Re-export all content types.                                                                                                                              | No command.        |
| P020-07 | AGENT       | `apps/firm-website/src/types/content.ts` | Create file that re‑exports from `@repo/lib` (or import directly from `@repo/lib` in components).                                                         | No command.        |
| P020-08 | AGENT       | Update `docs/content.md`                 | Document the content types and their schemas.                                                                                                             | None.              |

---

### Parent Task P021: Create Content Utility Functions

- [ ] **P021** | Status: `PENDING`
      **Related File Paths:**
  - `apps/firm-website/src/lib/content.ts`
  - `apps/firm-website/src/lib/content.test.ts`
  - `apps/firm-website/src/app/(marketing)/content-utils.ts` (optional)

  **Definition of Done:**
  - Utility functions for content management are implemented:
    - `getAllContent(dir: string): ContentEntry[]` – returns all content files from a directory
    - `getContentBySlug(dir: string, slug: string): ContentEntry | null` – returns specific content by slug
    - `getAllSlugs(dir: string): string[]` – returns all slugs in a directory
    - `getServices(): Service[]`, `getIndustries(): Industry[]`, etc. – typed convenience functions
  - Functions handle errors gracefully (file not found, invalid frontmatter).
  - Functions are server‑side only (Node.js `fs` module).
  - Unit tests cover all utility functions.

  **Out of Scope:**
  - Client‑side content fetching – all content is generated at build time.

  **Rules to Follow:**
  - Use `fs` and `path` from Node.js – these are server‑side only.
  - Use `gray-matter` for frontmatter parsing.
  - Use `remark` for Markdown→HTML conversion (optional, can be done in components).
  - Cache content in memory to avoid repeated file reads.
  - All functions must be tested.

  **Advanced Coding Pattern:**
  - **Deep module** – content utilities abstract the file system, providing a clean API. Consumers don't know about `fs`, `path`, or `gray-matter`.

  **Anti‑Patterns:**
  - Reading files directly in components.
  - Not handling errors.
  - Using `fs` on the client side.

  **Imports/Exports:**
  - `apps/firm-website/src/lib/content.ts` exports `getAllContent`, `getContentBySlug`, `getAllSlugs`, `getServices`, `getIndustries`, `getDemos`, `getFAQs`, `getPages`.

  **Depends On / Blocks:**
  - Depends on: P020 (content types), P017 (MDX setup).
  - Blocks: P022–P026 (content creation).

#### Subtasks

| ID      | Agent/Human | File Path / Command                         | Description                                                                                                                                                                                                                            | Validation Command                            |
| ------- | ----------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| P021-01 | AGENT       | `apps/firm-website` (install)               | Run: `pnpm --filter @repo/firm-website add gray-matter remark remark-html`.                                                                                                                                                            | `pnpm list` shows packages.                   |
| P021-02 | AGENT       | `apps/firm-website/src/lib/content.ts`      | Create `getAllContent(dir: string)` that: <br> 1. Reads all `.mdx` files from `src/content/{dir}` <br> 2. Parses frontmatter and body using `gray-matter` <br> 3. Returns array of `{ slug, metadata, content }`.                      | No command.                                   |
| P021-03 | AGENT       | `apps/firm-website/src/lib/content.ts`      | Create `getContentBySlug(dir: string, slug: string)` that returns a single content entry or `null`.                                                                                                                                    | No command.                                   |
| P021-04 | AGENT       | `apps/firm-website/src/lib/content.ts`      | Create `getAllSlugs(dir: string)` that returns an array of slugs.                                                                                                                                                                      | No command.                                   |
| P021-05 | AGENT       | `apps/firm-website/src/lib/content.ts`      | Create convenience functions: `getServices()`, `getIndustries()`, `getDemos()`, `getFAQs()`, `getPages()` that call `getAllContent` with the appropriate directory.                                                                    | No command.                                   |
| P021-06 | AGENT       | `apps/firm-website/src/lib/content.ts`      | Add in‑memory cache for performance: store loaded content in a `Map` and check cache before reading files.                                                                                                                             | No command.                                   |
| P021-07 | AGENT       | `apps/firm-website/src/lib/content.test.ts` | Write unit tests: <br> - `getAllContent` returns correct number of files <br> - `getContentBySlug` returns correct content <br> - `getContentBySlug` returns `null` for missing slug <br> - Convenience functions return typed arrays. | `pnpm --filter @repo/firm-website test` runs. |
| P021-08 | AGENT       | Update `docs/content.md`                    | Document content utility functions and their usage.                                                                                                                                                                                    | None.                                         |

---

### Parent Task P022: Create Service Pages Content

- [ ] **P022** | Status: `PENDING`
      **Related File Paths:**
  - `apps/firm-website/src/content/services/website-design.mdx`
  - `apps/firm-website/src/content/services/local-seo.mdx`
  - `apps/firm-website/src/content/services/paid-ads.mdx`
  - `apps/firm-website/src/content/services/email-sms.mdx`
  - `apps/firm-website/src/content/services/copywriting-branding.mdx`
  - `apps/firm-website/src/content/services/hosting-care.mdx`

  **Definition of Done:**
  - MDX files are created for all 6 services:
    1. Website Design (anchor page, 800–1000+ words)
    2. Local SEO (400–600 words)
    3. Paid Ads (Lead Acceleration) (400–600 words)
    4. Email/SMS (Retention Starter) (400–600 words)
    5. Copywriting & Branding Add‑Ons (400–600 words)
    6. Hosting & Care Plan (400–600 words)
  - Each file exports `metadata` with `title`, `slug`, `description`, `order`.
  - Each file uses MDX components (Button, Card, Container, Section, Accordion) from `@repo/ui`.
  - Content follows the copy direction from the Website Content & Sitemap Plan.

  **Out of Scope:**
  - Creating the actual service pages that render these files – will be done in Phase 4.

  **Rules to Follow:**
  - Use the copy from the Website Content & Sitemap Plan (Section 4 of business plan).
  - Use MDX components for structured content (cards, buttons, etc.).
  - Keep MDX clean and readable.
  - Include one H1 per file (optional – can be rendered from metadata).

  **Advanced Coding Pattern:**
  - **Deep module** – content is separate from presentation. The same MDX files can be used in different contexts (page, preview, feed).

  **Anti‑Patterns:**
  - Hard‑coding presentational classes in MDX.
  - Writing HTML directly instead of using MDX components.

  **Imports/Exports:**
  - Each `.mdx` file exports `metadata` and default content.

  **Depends On / Blocks:**
  - Depends on: P017 (MDX setup), P021 (content utilities).
  - Blocks: Phase 4 (page development).

#### Subtasks

| ID      | Agent/Human | File Path / Command                                               | Description                                                                                                                                                                                                                                                                                         | Validation Command                            |
| ------- | ----------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| P022-01 | AGENT       | `apps/firm-website/src/content/services/website-design.mdx`       | Create MDX file with frontmatter: `title: "Website Design & Development"`, `slug: "website-design"`, `description: "Professional, custom websites for DFW service businesses."`, `order: 1`. Write body content (800–1000+ words) following the copy direction from Section 4 of the business plan. | No command.                                   |
| P022-02 | AGENT       | `apps/firm-website/src/content/services/local-seo.mdx`            | Create MDX file for Local SEO: `title: "Local SEO & Visibility"`, `slug: "local-seo"`, `description: "Get found by local customers."`, `order: 2`. Write body content.                                                                                                                              | No command.                                   |
| P022-03 | AGENT       | `apps/firm-website/src/content/services/paid-ads.mdx`             | Create MDX file for Paid Ads: `title: "Lead Acceleration (Paid Ads)"`, `slug: "paid-ads"`, `description: "Drive immediate leads with targeted advertising."`, `order: 3`. Write body content.                                                                                                       | No command.                                   |
| P022-04 | AGENT       | `apps/firm-website/src/content/services/email-sms.mdx`            | Create MDX file for Email/SMS: `title: "Retention Starter (Email & SMS)"`, `slug: "email-sms"`, `description: "Keep customers coming back."`, `order: 4`. Write body content.                                                                                                                       | No command.                                   |
| P022-05 | AGENT       | `apps/firm-website/src/content/services/copywriting-branding.mdx` | Create MDX file for Copywriting & Branding: `title: "Copywriting & Branding Add-Ons"`, `slug: "copywriting-branding"`, `description: "Professional copy and brand assets."`, `order: 5`. Write body content.                                                                                        | No command.                                   |
| P022-06 | AGENT       | `apps/firm-website/src/content/services/hosting-care.mdx`         | Create MDX file for Hosting & Care: `title: "Hosting & Care Plan"`, `slug: "hosting-care"`, `description: "Secure, managed hosting with ongoing support."`, `order: 6`. Write body content.                                                                                                         | No command.                                   |
| P022-07 | AGENT       | `apps/firm-website/src/lib/content.test.ts`                       | Update tests to ensure all service files are detected and parsed correctly.                                                                                                                                                                                                                         | `pnpm --filter @repo/firm-website test` runs. |
| P022-08 | AGENT       | Update `docs/content.md`                                          | Document the service content structure and how to add new service pages.                                                                                                                                                                                                                            | None.                                         |

---

### Parent Task P023: Create Industry Pages Content

- [ ] **P023** | Status: `PENDING`
      **Related File Paths:**
  - `apps/firm-website/src/content/industries/home-services.mdx`
  - `apps/firm-website/src/content/industries/medical.mdx`
  - `apps/firm-website/src/content/industries/personal-services.mdx`
  - `apps/firm-website/src/content/industries/professional-services.mdx`
  - `apps/firm-website/src/content/industries/restaurants.mdx`
  - `apps/firm-website/src/content/industries/retail.mdx`

  **Definition of Done:**
  - MDX files are created for all 6 industries:
    1. Home Service & Trades (400–600 words)
    2. Medical & Wellness Clinics (400–600 words)
    3. Personal Services (400–600 words)
    4. Professional Services (400–600 words)
    5. Restaurants & Food Service (400–600 words)
    6. Retail & Local Shops (400–600 words)
  - Each file exports `metadata` with `title`, `slug`, `description`, `order`, `icon` (optional).
  - Each file uses MDX components from `@repo/ui`.
  - Content follows the copy direction from the Website Content & Sitemap Plan (Industry hub and sample industry page).

  **Out of Scope:**
  - Creating the actual industry pages – will be done in Phase 4.

  **Rules to Follow:**
  - Use the copy from the Website Content & Sitemap Plan.
  - Each industry page should link to a relevant demo page (cross‑linking).
  - Include industry‑specific pain points and solutions.

  **Advanced Coding Pattern:**
  - **Deep module** – industry content is structured consistently, making it easy to generate industry hub pages and individual pages from the same data.

  **Anti‑Patterns:**
  - Copying content between industry pages – each should be distinct.

  **Imports/Exports:**
  - Each `.mdx` file exports `metadata` and default content.

  **Depends On / Blocks:**
  - Depends on: P017 (MDX setup), P021 (content utilities).
  - Blocks: Phase 4 (page development).

#### Subtasks

| ID      | Agent/Human | File Path / Command                                                  | Description                                                                                                                                                                                                                                                                   | Validation Command                            |
| ------- | ----------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| P023-01 | AGENT       | `apps/firm-website/src/content/industries/home-services.mdx`         | Create MDX with frontmatter: `title: "Home Service & Trades"`, `slug: "home-services"`, `description: "Websites for plumbers, electricians, and home service pros."`, `icon: "🔧"`, `order: 1`. Write body content (400–600 words) with pain points, solutions, and features. | No command.                                   |
| P023-02 | AGENT       | `apps/firm-website/src/content/industries/medical.mdx`               | Create MDX for Medical & Wellness Clinics: `title: "Medical & Wellness Clinics"`, `slug: "medical"`, `description: "Websites for medical practices and wellness centers."`, `icon: "🏥"`, `order: 2`.                                                                         | No command.                                   |
| P023-03 | AGENT       | `apps/firm-website/src/content/industries/personal-services.mdx`     | Create MDX for Personal Services (salons, spas, etc.): `title: "Personal Services"`, `slug: "personal-services"`, `description: "Websites for salons, spas, and personal care."`, `icon: "💇"`, `order: 3`.                                                                   | No command.                                   |
| P023-04 | AGENT       | `apps/firm-website/src/content/industries/professional-services.mdx` | Create MDX for Professional Services (lawyers, accountants, etc.): `title: "Professional Services"`, `slug: "professional-services"`, `description: "Websites for professional service firms."`, `icon: "⚖️"`, `order: 4`.                                                    | No command.                                   |
| P023-05 | AGENT       | `apps/firm-website/src/content/industries/restaurants.mdx`           | Create MDX for Restaurants & Food Service: `title: "Restaurants & Food Service"`, `slug: "restaurants"`, `description: "Websites for restaurants and food businesses."`, `icon: "🍽️"`, `order: 5`.                                                                            | No command.                                   |
| P023-06 | AGENT       | `apps/firm-website/src/content/industries/retail.mdx`                | Create MDX for Retail & Local Shops: `title: "Retail & Local Shops"`, `slug: "retail"`, `description: "Websites for retail stores and local shops."`, `icon: "🛍️"`, `order: 6`.                                                                                               | No command.                                   |
| P023-07 | AGENT       | `apps/firm-website/src/lib/content.test.ts`                          | Update tests to ensure all industry files are detected and parsed correctly.                                                                                                                                                                                                  | `pnpm --filter @repo/firm-website test` runs. |
| P023-08 | AGENT       | Update `docs/content.md`                                             | Document the industry content structure.                                                                                                                                                                                                                                      | None.                                         |

---

### Parent Task P024: Create Demo/Proof-of-Concept Pages Content

- [ ] **P024** | Status: `PENDING`
      **Related File Paths:**
  - `apps/firm-website/src/content/demos/plumbing.mdx`
  - `apps/firm-website/src/content/demos/dental.mdx`
  - `apps/firm-website/src/content/demos/salon.mdx`
  - `apps/firm-website/src/content/demos/law-firm.mdx`
  - `apps/firm-website/src/content/demos/restaurant.mdx`
  - `apps/firm-website/src/content/demos/retail-shop.mdx`

  **Definition of Done:**
  - MDX files are created for all 6 demo/proof‑of‑concept pages:
    1. Plumbing Business (300–500 words)
    2. Dental Clinic (300–500 words)
    3. Salon (300–500 words)
    4. Law Firm (300–500 words)
    5. Restaurant (300–500 words)
    6. Retail Shop (300–500 words)
  - Each file exports `metadata` with `title`, `slug`, `description`, `industry` (linking back to an industry page).
  - Each file includes sections: "The Situation", "The Challenge", "The Approach", "The Outcome".
  - Each file links to the corresponding industry page.

  **Out of Scope:**
  - Creating the actual demo pages – will be done in Phase 4.
  - Building the actual demo sites – those are separate projects.

  **Rules to Follow:**
  - Each demo page must be distinct – not just copied with different business names.
  - Demo pages should show how the firm solves specific industry problems.
  - Link from demo pages to industry pages and vice versa.

  **Advanced Coding Pattern:**
  - **Deep module** – demo content is structured with consistent sections, making it easy to render in a template pattern.

  **Anti‑Patterns:**
  - Using fabricated metrics or fake results – be honest that these are proof‑of‑concepts.
  - Copying demo content between industries.

  **Imports/Exports:**
  - Each `.mdx` file exports `metadata` and default content.

  **Depends On / Blocks:**
  - Depends on: P017 (MDX setup), P021 (content utilities).
  - Blocks: Phase 4 (page development).

#### Subtasks

| ID      | Agent/Human | File Path / Command                                   | Description                                                                                                                                                                                                                                             | Validation Command                            |
| ------- | ----------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| P024-01 | AGENT       | `apps/firm-website/src/content/demos/plumbing.mdx`    | Create MDX with frontmatter: `title: "Plumbing Business Demo"`, `slug: "plumbing-demo"`, `description: "A modern website for a DFW plumbing company."`, `industry: "home-services"`. Write body with sections: Situation, Challenge, Approach, Outcome. | No command.                                   |
| P024-02 | AGENT       | `apps/firm-website/src/content/demos/dental.mdx`      | Create MDX for Dental Clinic: `title: "Dental Clinic Demo"`, `slug: "dental-demo"`, `description: "A modern website for a DFW dental clinic."`, `industry: "medical"`.                                                                                  | No command.                                   |
| P024-03 | AGENT       | `apps/firm-website/src/content/demos/salon.mdx`       | Create MDX for Salon: `title: "Salon & Spa Demo"`, `slug: "salon-demo"`, `description: "A modern website for a DFW salon."`, `industry: "personal-services"`.                                                                                           | No command.                                   |
| P024-04 | AGENT       | `apps/firm-website/src/content/demos/law-firm.mdx`    | Create MDX for Law Firm: `title: "Law Firm Demo"`, `slug: "law-firm-demo"`, `description: "A modern website for a DFW law firm."`, `industry: "professional-services"`.                                                                                 | No command.                                   |
| P024-05 | AGENT       | `apps/firm-website/src/content/demos/restaurant.mdx`  | Create MDX for Restaurant: `title: "Restaurant Demo"`, `slug: "restaurant-demo"`, `description: "A modern website for a DFW restaurant."`, `industry: "restaurants"`.                                                                                   | No command.                                   |
| P024-06 | AGENT       | `apps/firm-website/src/content/demos/retail-shop.mdx` | Create MDX for Retail Shop: `title: "Retail Shop Demo"`, `slug: "retail-demo"`, `description: "A modern website for a DFW retail shop."`, `industry: "retail"`.                                                                                         | No command.                                   |
| P024-07 | AGENT       | `apps/firm-website/src/lib/content.test.ts`           | Update tests to ensure all demo files are detected and parsed correctly.                                                                                                                                                                                | `pnpm --filter @repo/firm-website test` runs. |
| P024-08 | AGENT       | Update `docs/content.md`                              | Document the demo content structure.                                                                                                                                                                                                                    | None.                                         |

---

### Parent Task P025: Create FAQ Entries Content

- [ ] **P025** | Status: `PENDING`
      **Related File Paths:**
  - `apps/firm-website/src/content/faq/cost.mdx`
  - `apps/firm-website/src/content/faq/timeline.mdx`
  - `apps/firm-website/src/content/faq/ownership.mdx`
  - `apps/firm-website/src/content/faq/revisions.mdx`
  - `apps/firm-website/src/content/faq/seo.mdx`
  - `apps/firm-website/src/content/faq/care-plan.mdx`
  - `apps/firm-website/src/content/faq/hidden-fees.mdx`
  - `apps/firm-website/src/content/faq/contract.mdx`
  - `apps/firm-website/src/content/faq/industries.mdx`
  - `apps/firm-website/src/content/faq/process.mdx`

  **Definition of Done:**
  - MDX files are created for 10+ FAQ entries covering:
    1. "How much does a website cost for a small business in DFW?" (cost)
    2. "How long does it take to build a website?" (timeline)
    3. "Do I own my website once it's built?" (ownership)
    4. "What if I need changes after launch?" (revisions)
    5. "Will my website rank on Google?" (seo)
    6. "What's included in the Hosting & Care Plan?" (care-plan)
    7. "Are there any hidden fees?" (hidden-fees)
    8. "Do I have to sign a long-term contract?" (contract)
    9. "What industries do you serve?" (industries)
    10. "What's the process for building a website?" (process)
  - Each file exports `metadata` with `question`, `answer` (short), `category`, `order`.
  - The answer is a direct, concise response (40–60 words) followed by expansion.

  **Out of Scope:**
  - Creating the FAQ hub page that renders all entries – will be done in Phase 4.

  **Rules to Follow:**
  - Use the AEO format: question as title, direct answer in first 40–60 words.
  - Categorize: `general`, `pricing`, `process`.
  - Keep answers concise and actionable.

  **Advanced Coding Pattern:**
  - **Deep module** – FAQ entries are structured for easy rendering in accordions, with schema markup for FAQPage JSON-LD.

  **Anti‑Patterns:**
  - Writing lengthy, rambling answers.
  - Not categorizing entries.
  - Avoiding tough questions.

  **Imports/Exports:**
  - Each `.mdx` file exports `metadata` and default content.

  **Depends On / Blocks:**
  - Depends on: P017 (MDX setup), P021 (content utilities).
  - Blocks: Phase 4 (page development).

#### Subtasks

| ID      | Agent/Human | File Path / Command                                 | Description                                                                                                                                                                             | Validation Command                            |
| ------- | ----------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| P025-01 | AGENT       | `apps/firm-website/src/content/faq/cost.mdx`        | Create MDX with frontmatter: `question: "How much does a website cost for a small business in DFW?"`, `category: "pricing"`, `order: 1`. Write direct answer (40–60 words) + expansion. | No command.                                   |
| P025-02 | AGENT       | `apps/firm-website/src/content/faq/timeline.mdx`    | Create MDX: `question: "How long does it take to build a website?"`, `category: "process"`, `order: 2`. Write answer.                                                                   | No command.                                   |
| P025-03 | AGENT       | `apps/firm-website/src/content/faq/ownership.mdx`   | Create MDX: `question: "Do I own my website once it's built?"`, `category: "general"`, `order: 3`. Write answer.                                                                        | No command.                                   |
| P025-04 | AGENT       | `apps/firm-website/src/content/faq/revisions.mdx`   | Create MDX: `question: "What if I need changes after launch?"`, `category: "pricing"`, `order: 4`. Write answer.                                                                        | No command.                                   |
| P025-05 | AGENT       | `apps/firm-website/src/content/faq/seo.mdx`         | Create MDX: `question: "Will my website rank on Google?"`, `category: "general"`, `order: 5`. Write answer.                                                                             | No command.                                   |
| P025-06 | AGENT       | `apps/firm-website/src/content/faq/care-plan.mdx`   | Create MDX: `question: "What's included in the Hosting & Care Plan?"`, `category: "pricing"`, `order: 6`. Write answer.                                                                 | No command.                                   |
| P025-07 | AGENT       | `apps/firm-website/src/content/faq/hidden-fees.mdx` | Create MDX: `question: "Are there any hidden fees?"`, `category: "pricing"`, `order: 7`. Write answer.                                                                                  | No command.                                   |
| P025-08 | AGENT       | `apps/firm-website/src/content/faq/contract.mdx`    | Create MDX: `question: "Do I have to sign a long-term contract?"`, `category: "general"`, `order: 8`. Write answer.                                                                     | No command.                                   |
| P025-09 | AGENT       | `apps/firm-website/src/content/faq/industries.mdx`  | Create MDX: `question: "What industries do you serve?"`, `category: "general"`, `order: 9`. Write answer.                                                                               | No command.                                   |
| P025-10 | AGENT       | `apps/firm-website/src/content/faq/process.mdx`     | Create MDX: `question: "What's the process for building a website?"`, `category: "process"`, `order: 10`. Write answer.                                                                 | No command.                                   |
| P025-11 | AGENT       | `apps/firm-website/src/lib/content.test.ts`         | Update tests to ensure all FAQ files are detected and parsed correctly.                                                                                                                 | `pnpm --filter @repo/firm-website test` runs. |
| P025-12 | AGENT       | Update `docs/content.md`                            | Document the FAQ content structure and AEO format.                                                                                                                                      | None.                                         |

---

### Parent Task P026: Create Static Pages Content (About, Pricing)

- [ ] **P026** | Status: `PENDING`
      **Related File Paths:**
  - `apps/firm-website/src/content/pages/about.mdx`
  - `apps/firm-website/src/content/pages/pricing.mdx`

  **Definition of Done:**
  - MDX files are created for:
    - **About** (400–600 words) – mission, story, method, why Euless/DFW, credibility
    - **Pricing** (400–600 words) – pricing table, add‑ons, retainers, FAQ block
  - Each file exports `metadata` with `title`, `slug`, `description`.
  - Files use MDX components for structured content (tables, cards, etc.).

  **Out of Scope:**
  - Creating the actual About and Pricing pages – will be done in Phase 4.

  **Rules to Follow:**
  - About page: include mission, story, method, local connection, credibility signals.
  - Pricing page: include package tiers, add‑ons, retainers, bundling discounts, FAQ.
  - Use the copy direction from the Website Content & Sitemap Plan.

  **Advanced Coding Pattern:**
  - **Deep module** – pricing data is structured for easy rendering and future updates.

  **Anti‑Patterns:**
  - Hard‑coding pricing data in components instead of content.
  - Not updating pricing when business offerings change.

  **Imports/Exports:**
  - Each `.mdx` file exports `metadata` and default content.

  **Depends On / Blocks:**
  - Depends on: P017 (MDX setup), P021 (content utilities).
  - Blocks: Phase 4 (page development).

#### Subtasks

| ID      | Agent/Human | File Path / Command                               | Description                                                                                                                                                                                                                                                               | Validation Command                            |
| ------- | ----------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| P026-01 | AGENT       | `apps/firm-website/src/content/pages/about.mdx`   | Create MDX with frontmatter: `title: "About Your Dedicated Marketer"`, `slug: "about"`, `description: "Learn about the marketer behind Your Dedicated Marketer."`. Write body content (400–600 words) covering mission, story, method, local connection, credibility.     | No command.                                   |
| P026-02 | AGENT       | `apps/firm-website/src/content/pages/pricing.mdx` | Create MDX with frontmatter: `title: "Pricing"`, `slug: "pricing"`, `description: "Simple, transparent pricing for DFW small businesses."`. Write body content (400–600 words) with pricing table, add‑ons, retainers, bundling discounts. Use MDX components for tables. | No command.                                   |
| P026-03 | AGENT       | `apps/firm-website/src/lib/content.test.ts`       | Update tests to ensure all static page files are detected and parsed correctly.                                                                                                                                                                                           | `pnpm --filter @repo/firm-website test` runs. |
| P026-04 | AGENT       | Update `docs/content.md`                          | Document the static pages content structure.                                                                                                                                                                                                                              | None.                                         |

---

### Parent Task P027: Create Content Index and Navigation Utilities

- [ ] **P027** | Status: `PENDING`
      **Related File Paths:**
  - `apps/firm-website/src/lib/navigation.ts`
  - `apps/firm-website/src/lib/navigation.test.ts`

  **Definition of Done:**
  - Navigation utilities are created:
    - `getNavItems(): NavItem[]` – returns all navigation items with their slugs
    - `getBreadcrumbs(slug: string): Breadcrumb[]` – returns breadcrumb trail for a given page
    - `getRelatedContent(currentSlug: string, type: string): ContentEntry[]` – returns related content
  - Utilities use content from P021.
  - Unit tests cover all navigation utilities.

  **Out of Scope:**
  - Building navigation components – will be done in Phase 4.

  **Rules to Follow:**
  - Navigation should be data‑driven from content.
  - Breadcrumbs should reflect the content hierarchy.
  - Related content should use tags or categories.

  **Advanced Coding Pattern:**
  - **Deep module** – navigation utilities abstract the content graph, providing a simple API for components.

  **Anti‑Patterns:**
  - Hard‑coding navigation links in components.
  - Duplicating navigation logic.

  **Imports/Exports:**
  - `apps/firm-website/src/lib/navigation.ts` exports `getNavItems`, `getBreadcrumbs`, `getRelatedContent`.

  **Depends On / Blocks:**
  - Depends on: P021 (content utilities).
  - Blocks: Phase 4 (page development).

#### Subtasks

| ID      | Agent/Human | File Path / Command                            | Description                                                                                                                                                                | Validation Command                            |
| ------- | ----------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| P027-01 | AGENT       | `apps/firm-website/src/lib/navigation.ts`      | Create `getNavItems()` that returns an array of `{ label: string; href: string }` for the primary navigation (Home, Services, Industries, Demos, Pricing, About, Contact). | No command.                                   |
| P027-02 | AGENT       | `apps/firm-website/src/lib/navigation.ts`      | Create `getBreadcrumbs(slug: string)` that returns an array of `{ label: string; href: string }` for the current page.                                                     | No command.                                   |
| P027-03 | AGENT       | `apps/firm-website/src/lib/navigation.ts`      | Create `getRelatedContent(currentSlug: string, type: string)` that returns related content based on category or tags.                                                      | No command.                                   |
| P027-04 | AGENT       | `apps/firm-website/src/lib/navigation.test.ts` | Write unit tests for all navigation utilities.                                                                                                                             | `pnpm --filter @repo/firm-website test` runs. |
| P027-05 | AGENT       | Update `docs/content.md`                       | Document navigation utilities and how to extend them.                                                                                                                      | None.                                         |

---

### Parent Task P028: Update Documentation and Repository Management

- [ ] **P028** | Status: `PENDING`
      **Related File Paths:**
  - `README.md` (root)
  - `docs/content.md`
  - `docs/architecture.md`
  - `docs/development.md`

  **Definition of Done:**
  - All docs are updated to reflect Phase 3 additions.
  - `README.md` includes section on content management.
  - `docs/content.md` is complete with content types, utilities, and how to add new content.
  - `docs/architecture.md` includes content architecture.
  - `docs/development.md` includes guide on writing MDX content.

  **Out of Scope:**
  - Writing API docs – will come later.

  **Rules to Follow:**
  - Keep docs up‑to‑date.
  - Use clear, concise language.

  **Advanced Coding Pattern:**
  - N/A.

  **Anti‑Patterns:**
  - Outdated documentation.

  **Depends On / Blocks:**
  - Depends on: P020–P027.
  - Blocks: None.

#### Subtasks

| ID      | Agent/Human | File Path / Command    | Description                                                                                                                                 | Validation Command |
| ------- | ----------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| P028-01 | AGENT       | `README.md`            | Update with Phase 3 status, add section on content.                                                                                         | Manual check.      |
| P028-02 | AGENT       | `docs/content.md`      | Complete with: <br> - Content types and schemas <br> - Content utility functions <br> - How to add new content <br> - MDX component mapping | Manual check.      |
| P028-03 | AGENT       | `docs/architecture.md` | Add section on content architecture: MDX, frontmatter, static generation.                                                                   | Manual check.      |
| P028-04 | AGENT       | `docs/development.md`  | Add guide: "How to write and edit MDX content".                                                                                             | Manual check.      |

---

## Summary of Phase 3

Phase 3 consists of 9 parent tasks (P020–P028) and numerous subtasks. The goal is to create a complete content pipeline and write all content for the marketing website.

**Key Deliverables:**

- TypeScript types for all content entities (Service, Industry, Demo, FAQ, Page)
- Content utility functions for reading and parsing MDX files
- 6 service pages content (including the anchor Website Design page)
- 6 industry pages content
- 6 demo/proof‑of‑concept pages content
- 10+ FAQ entries
- About and Pricing static pages
- Navigation and content index utilities
- Comprehensive documentation

**Content Count (by the end of Phase 3):**

| Type         | Count                 |
| ------------ | --------------------- |
| Services     | 6                     |
| Industries   | 6                     |
| Demos        | 6                     |
| FAQs         | 10+                   |
| Static Pages | 2                     |
| **Total**    | **30+ content files** |

---

## Phase 3.5: SEO Infrastructure – Task List

This document defines tasks required to set up SEO infrastructure including metadata generation, sitemap, robots.txt, and JSON-LD utilities. These are foundational requirements from the Website Content Sitemap Plan (file:3) that must be in place before Phase 4 page development.

---

### Parent Task P029-SEO: Setup SEO Infrastructure

- [ ] **P029-SEO** | Status: `PENDING`
      **Related File Paths:**
  - `apps/firm-website/src/lib/seo.ts`
  - `apps/firm-website/src/app/sitemap.ts`
  - `apps/firm-website/src/app/robots.ts`
  - `apps/firm-website/src/lib/json-ld.ts`

  **Definition of Done:**
  - `generateMetadata()` utility function is created for dynamic metadata generation.
  - `sitemap.ts` generates a sitemap.xml for all pages (services, industries, demos, FAQ, static pages).
  - `robots.ts` generates a robots.txt file.
  - JSON-LD utility functions are created for FAQPage, Organization, and BreadcrumbList schemas.
  - All SEO utilities follow Google's AEO/SEO best practices from file:3.
  - Unit tests verify sitemap and robots.txt generation.

  **Out of Scope:**
  - Adding metadata to individual pages – will be done in Phase 4.
  - Advanced SEO features like structured data for products – not needed for this site.

  **Rules to Follow:**
  - Use Next.js 15's `generateMetadata()` for dynamic metadata.
  - Follow Google's SEO guidelines for sitemaps and robots.txt.
  - Use JSON-LD format for structured data.
  - Ensure all URLs are absolute and include the domain.

  **Advanced Coding Pattern:**
  - **Deep module** – SEO utilities are a single source of truth for all SEO-related logic.

  **Anti‑Patterns:**
  - Hard-coding URLs in sitemap generation.
  - Not including all important pages in sitemap.
  - Using outdated structured data formats.

  **Imports/Exports:**
  - `src/lib/seo.ts` exports `generateMetadata`, `getOpenGraphTags`.
  - `src/lib/json-ld.ts` exports `generateFAQSchema`, `generateOrganizationSchema`.

  **Depends On / Blocks:**
  - Depends on: P006 (content structure), P027 (navigation utilities).
  - Blocks: Phase 4 page development (pages need SEO metadata).

#### Subtasks

| ID          | Agent/Human | File Path / Command                     | Description                                                                                                                                                                                                          | Validation Command                            |
| ----------- | ----------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| P029-SEO-01 | AGENT       | `apps/firm-website/src/lib/seo.ts`      | Create `generateMetadata()` utility that accepts title, description, path, and returns a Metadata object with title, description, openGraph, twitter, and canonical URL.                                             | No command.                                   |
| P029-SEO-02 | AGENT       | `apps/firm-website/src/lib/seo.ts`      | Create `getOpenGraphTags()` helper for Open Graph image, title, description.                                                                                                                                         | No command.                                   |
| P029-SEO-03 | AGENT       | `apps/firm-website/src/app/sitemap.ts`  | Create sitemap.ts that exports `sitemap` function. Use `getNavItems()` from P027 to get all pages. Include all services, industries, demos, FAQ, and static pages. Format: `https://yourdedicatedmarketer.com/slug`. | Visit `/sitemap.xml` shows valid XML.         |
| P029-SEO-04 | AGENT       | `apps/firm-website/src/app/robots.ts`   | Create robots.ts that exports `robots` function. Allow all user agents, point to sitemap.xml.                                                                                                                        | Visit `/robots.txt` shows valid content.      |
| P029-SEO-05 | AGENT       | `apps/firm-website/src/lib/json-ld.ts`  | Create `generateFAQSchema(faqs)` that returns JSON-LD for FAQPage (required for AEO per file:3).                                                                                                                     | No command.                                   |
| P029-SEO-06 | AGENT       | `apps/firm-website/src/lib/json-ld.ts`  | Create `generateOrganizationSchema()` for Organization structured data.                                                                                                                                              | No command.                                   |
| P029-SEO-07 | AGENT       | `apps/firm-website/src/lib/json-ld.ts`  | Create `generateBreadcrumbSchema(breadcrumbs)` for BreadcrumbList structured data.                                                                                                                                   | No command.                                   |
| P029-SEO-08 | AGENT       | `apps/firm-website/src/lib/seo.test.ts` | Write unit tests: sitemap includes all pages, robots.txt is valid, metadata generation works.                                                                                                                        | `pnpm --filter @repo/firm-website test` runs. |
| P029-SEO-09 | AGENT       | Update `docs/seo.md`                    | Document SEO infrastructure, how to add metadata to pages, and AEO requirements from file:3.                                                                                                                         | None.                                         |

---

## Phase 4: Page Development – Task List

This document defines all tasks required to build the complete marketing website pages, including layouts, dynamic routes, SEO, forms, and performance optimization. All tasks are designed to be **SMALL**, actionable, and built with **SDD, DDD, TDD, BDD**, and **Deep Modules** in mind.

---

### Phase 4 Overview

**Objective:** Build all pages that render the content created in Phase 3, including dynamic routes for services, industries, demos, and FAQs, plus static pages (Home, About, Pricing, Contact).

**Key Decisions (from research and analysis):**

- **Route groups** for marketing pages (`(marketing)`)
- **Dynamic routes** with `generateStaticParams` for content-driven pages
- **Server Actions** for contact form handling
- **Suspense boundaries** + skeleton components for loading states
- **Route group error boundaries** for error handling
- **Metadata** with `generateMetadata` for dynamic pages
- **Sitemap** and **robots.txt** using Next.js file conventions
- **Static generation** for all content pages

---

### Parent Task P029: Set Up Route Group Structure and Marketing Layout

- [ ] **P029** | Status: `PENDING`
      **Related File Paths:**
  - `apps/firm-website/src/app/(marketing)/layout.tsx`
  - `apps/firm-website/src/app/(marketing)/page.tsx` (placeholder)
  - `apps/firm-website/src/app/layout.tsx` (root layout)
  - `apps/firm-website/src/app/globals.css`

  **Definition of Done:**
  - Route group `(marketing)` is created in `app/`.
  - Marketing layout includes `Header` and `Footer` components from `@repo/ui`.
  - Root layout remains minimal (html, body, ThemeProvider, children).
  - A placeholder homepage renders successfully at `/`.
  - Dark/light theme works across all routes in the marketing group.

  **Out of Scope:**
  - Building actual page content – will be done in P030–P036.

  **Rules to Follow:**
  - `(marketing)` route group should not affect the URL path.
  - Root layout should only contain global providers (`ThemeProvider`, etc.).
  - Marketing layout should not duplicate root layout concerns.

  **Advanced Coding Pattern:**
  - **Deep module** – layouts are separated by concern. Root layout is for global providers; marketing layout is for page structure.

  **Anti‑Patterns:**
  - Adding global providers in marketing layout instead of root layout.
  - Hard‑coding navigation links – use `getNavItems()` from P027.

  **Imports/Exports:**
  - `apps/firm-website/src/app/layout.tsx` exports root layout.
  - `apps/firm-website/src/app/(marketing)/layout.tsx` exports marketing layout.

  **Depends On / Blocks:**
  - Depends on: P013 (Header), P014 (Footer), P027 (navigation utilities).
  - Blocks: P030–P036 (page development).

#### Subtasks

| ID      | Agent/Human | File Path / Command                                | Description                                                                                                                                                          | Validation Command         |
| ------- | ----------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| P029-01 | AGENT       | `apps/firm-website/src/app/(marketing)/`           | Create the `(marketing)` route group directory.                                                                                                                      | Directory exists.          |
| P029-02 | AGENT       | `apps/firm-website/src/app/(marketing)/layout.tsx` | Create marketing layout that imports `Header` and `Footer` from `@repo/ui`. Pass `navItems` from `getNavItems()` to Header. Wrap children between Header and Footer. | No command.                |
| P029-03 | AGENT       | `apps/firm-website/src/app/(marketing)/page.tsx`   | Create placeholder homepage with a heading "Your Dedicated Marketer".                                                                                                | `pnpm dev` shows the page. |
| P029-04 | AGENT       | `apps/firm-website/src/app/layout.tsx`             | Ensure root layout wraps the entire app with `ThemeProvider` from `@repo/ui`.                                                                                        | No command.                |
| P029-05 | AGENT       | `apps/firm-website/src/app/globals.css`            | Ensure global styles import `@repo/ui` styles.                                                                                                                       | No command.                |
| P029-06 | AGENT       | Update `docs/architecture.md`                      | Document the route group structure and layout hierarchy.                                                                                                             | None.                      |

---

### Parent Task P030: Build the Homepage

- [ ] **P030** | Status: `PENDING`
      **Related File Paths:**
  - `apps/firm-website/src/app/(marketing)/page.tsx`
  - `apps/firm-website/src/components/features/home/hero.tsx`
  - `apps/firm-website/src/components/features/home/pillars.tsx`
  - `apps/firm-website/src/components/features/home/demo-preview.tsx`
  - `apps/firm-website/src/components/features/home/how-it-works.tsx`
  - `apps/firm-website/src/components/features/home/faq-snippet.tsx`
  - `apps/firm-website/src/components/features/home/final-cta.tsx`

  **Definition of Done:**
  - Homepage is fully built with all sections from the Website Content & Sitemap Plan:
    1. **Hero** – headline, subheadline, primary CTA, secondary CTA
    2. **Three Pillars** – Get Found, Get Trusted, Get a Solution Built for You
    3. **Why Choose** – price/speed differentiator
    4. **Demo Preview** – 3-4 demo card previews
    5. **How It Works** – 4-step visual process
    6. **FAQ Snippet** – 2-3 top questions
    7. **Final CTA** – consultation booking
  - All components are responsive and follow the design system.
  - All CTAs link to the correct pages (Contact, Services, Demos).
  - Images use `next/image` with appropriate sizing.
  - SEO metadata is added using `generateMetadata()` from P029-SEO with title, description, Open Graph tags.
  - JSON-LD Organization schema is included per AEO requirements from file:3.

  **Out of Scope:**
  - Adding testimonials – none exist yet.
  - Dynamic content from MDX – homepage is hardcoded.

  **Rules to Follow:**
  - Use `Container`, `Section`, `Button`, `Card` from `@repo/ui`.
  - Use `next/link` for internal navigation.
  - Use `next/image` for demo preview images.
  - All CTA buttons should be `Button` with `asChild` and `Link` child.

  **Advanced Coding Pattern:**
  - **Deep module** – each section is a standalone component with a clear interface.

  **Anti‑Patterns:**
  - Hard‑coding URLs without using `next/link`.
  - Using `<img>` instead of `next/image`.

  **Imports/Exports:**
  - Each section component is exported from its own file.

  **Depends On / Blocks:**
  - Depends on: P029 (layout), P029-SEO (SEO infrastructure), P012 (Button, Card, Container, Section).
  - Blocks: None.

#### Subtasks

| ID      | Agent/Human | File Path / Command                                               | Description                                                                                                                                                                                                                                    | Validation Command                            |
| ------- | ----------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| P030-01 | AGENT       | `apps/firm-website/src/components/features/home/hero.tsx`         | Create Hero component with: <br> - Headline: "Your Business Deserves a Website That Works as Hard as You Do" <br> - Subheadline <br> - Primary CTA: "Book a Free Consultation" → `/contact` <br> - Secondary CTA: "See a Demo Site" → `/demos` | No command.                                   |
| P030-02 | AGENT       | `apps/firm-website/src/components/features/home/pillars.tsx`      | Create Three Pillars component with icons and descriptions linking to Services, Industries, and the Website Design service page.                                                                                                               | No command.                                   |
| P030-03 | AGENT       | `apps/firm-website/src/components/features/home/demo-preview.tsx` | Create Demo Preview component that fetches first 3 demos from `getAllDemos()` and renders cards linking to `/demos/[slug]`. Use `next/image` for placeholder images.                                                                           | No command.                                   |
| P030-04 | AGENT       | `apps/firm-website/src/components/features/home/how-it-works.tsx` | Create How It Works component with 4 steps: Discovery Call → Design & Build → Launch → Ongoing Support. Use icons and descriptive text.                                                                                                        | No command.                                   |
| P030-05 | AGENT       | `apps/firm-website/src/components/features/home/faq-snippet.tsx`  | Create FAQ Snippet component that fetches first 3 FAQs from `getAllFAQs()` and renders them as a list with links to `/faq`.                                                                                                                    | No command.                                   |
| P030-06 | AGENT       | `apps/firm-website/src/components/features/home/final-cta.tsx`    | Create Final CTA component with heading, subtext, and "Book a Free Consultation" button linking to `/contact`.                                                                                                                                 | No command.                                   |
| P030-07 | AGENT       | `apps/firm-website/src/app/(marketing)/page.tsx`                  | Assemble all sections in the homepage. Import and render each section in order.                                                                                                                                                                | `pnpm dev` shows complete homepage.           |
| P030-08 | AGENT       | `apps/firm-website/src/app/(marketing)/page.test.tsx`             | Write unit test for homepage: renders all sections, links work.                                                                                                                                                                                | `pnpm --filter @repo/firm-website test` runs. |
| P030-09 | AGENT       | Update `docs/pages.md`                                            | Document the homepage structure and components.                                                                                                                                                                                                | None.                                         |

---

### Parent Task P031: Build Static Pages (About, Pricing)

- [ ] **P031** | Status: `PENDING`
      **Related File Paths:**
  - `apps/firm-website/src/app/(marketing)/about/page.tsx`
  - `apps/firm-website/src/app/(marketing)/pricing/page.tsx`

  **Definition of Done:**
  - **About page** (`/about`) renders the content from `src/content/pages/about.mdx`.
  - **Pricing page** (`/pricing`) renders the content from `src/content/pages/pricing.mdx`.
  - Both pages use the marketing layout.
  - SEO metadata is added using `generateMetadata()` from P029-SEO with title, description, Open Graph tags.
  - MDX components (Button, Card, Container, Section, Accordion) are mapped correctly.

  **Out of Scope:**
  - Adding interactive pricing tables – the MDX content handles this.

  **Rules to Follow:**
  - Use the `ContentPage` component pattern to avoid duplication.
  - Import MDX files directly and render them.
  - Use `generateMetadata` for static pages.

  **Advanced Coding Pattern:**
  - **Deep module** – a reusable `ContentPage` component that accepts an MDX file and renders it with the appropriate layout.

  **Anti‑Patterns:**
  - Duplicating page structure for each static page.

  **Imports/Exports:**
  - Each page exports `metadata` and a default component.

  **Depends On / Blocks:**
  - Depends on: P017 (MDX setup), P026 (static page content), P029-SEO (SEO infrastructure).
  - Blocks: None.

#### Subtasks

| ID      | Agent/Human | File Path / Command                                           | Description                                                                                                                                                 | Validation Command                            |
| ------- | ----------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| P031-01 | AGENT       | `apps/firm-website/src/components/features/content-page.tsx`  | Create a reusable `ContentPage` component that accepts `content` (MDX module) and renders it with `Container` and `Section`.                                | No command.                                   |
| P031-02 | AGENT       | `apps/firm-website/src/app/(marketing)/about/page.tsx`        | Create About page: import MDX file from `@/content/pages/about.mdx`, render with `ContentPage`. Set metadata: `title: "About"`, `description: "..."`.       | `pnpm dev` shows /about.                      |
| P031-03 | AGENT       | `apps/firm-website/src/app/(marketing)/pricing/page.tsx`      | Create Pricing page: import MDX file from `@/content/pages/pricing.mdx`, render with `ContentPage`. Set metadata: `title: "Pricing"`, `description: "..."`. | `pnpm dev` shows /pricing.                    |
| P031-04 | AGENT       | `apps/firm-website/src/app/(marketing)/about/page.test.tsx`   | Write unit test: About page renders content, has correct metadata.                                                                                          | `pnpm --filter @repo/firm-website test` runs. |
| P031-05 | AGENT       | `apps/firm-website/src/app/(marketing)/pricing/page.test.tsx` | Write unit test: Pricing page renders content, has correct metadata.                                                                                        | `pnpm --filter @repo/firm-website test` runs. |
| P031-06 | AGENT       | Update `docs/pages.md`                                        | Document static pages and the `ContentPage` component.                                                                                                      | None.                                         |

---

### Parent Task P032: Build Services Hub and Dynamic Service Pages

- [ ] **P032** | Status: `PENDING`
      **Related File Paths:**
  - `apps/firm-website/src/app/(marketing)/services/page.tsx`
  - `apps/firm-website/src/app/(marketing)/services/[slug]/page.tsx`
  - `apps/firm-website/src/components/features/services/services-hub.tsx`
  - `apps/firm-website/src/components/features/services/service-detail.tsx`

  **Definition of Done:**
  - **Services hub** (`/services`) lists all services with cards linking to individual pages.
  - **Dynamic service pages** (`/services/[slug]`) render individual service content.
  - `generateStaticParams` pre‑renders all service pages at build time.
  - `generateMetadata` sets dynamic metadata for each service page.
  - The anchor service page (Website Design) is included and is the most detailed.

  **Out of Scope:**
  - None.

  **Rules to Follow:**
  - Use `getAllServices()` and `getServiceBySlug()` from P021.
  - Service cards should show `title` and `description` from metadata.
  - The service detail page should render the MDX body content.
  - Breadcrumbs should be implemented using `getBreadcrumbs()` from P027.

  **Advanced Coding Pattern:**
  - **Deep module** – service hub and detail pages are simple wrappers around content utilities.

  **Anti‑Patterns:**
  - Hard‑coding service slugs or metadata.

  **Imports/Exports:**
  - `services/page.tsx` exports the hub page.
  - `services/[slug]/page.tsx` exports the detail page with `generateStaticParams` and `generateMetadata`.

  **Depends On / Blocks:**
  - Depends on: P021 (content utilities), P022 (service content), P027 (navigation).
  - Blocks: None.

#### Subtasks

| ID      | Agent/Human | File Path / Command                                                     | Description                                                                                                                                                                                                                        | Validation Command                            |
| ------- | ----------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| P032-01 | AGENT       | `apps/firm-website/src/components/features/services/services-hub.tsx`   | Create ServicesHub component that: <br> 1. Fetches all services using `getAllServices()` <br> 2. Renders each as a Card with title, description, and link to `/services/[slug]` <br> 3. Uses `Container` and `Section` for layout. | No command.                                   |
| P032-02 | AGENT       | `apps/firm-website/src/app/(marketing)/services/page.tsx`               | Create Services Hub page: import `ServicesHub` component. Set metadata: `title: "Services"`, `description: "..."`.                                                                                                                 | `pnpm dev` shows /services.                   |
| P032-03 | AGENT       | `apps/firm-website/src/components/features/services/service-detail.tsx` | Create ServiceDetail component that: <br> 1. Accepts `content` prop (MDX module) <br> 2. Renders the MDX content using `ContentPage` pattern <br> 3. Adds breadcrumbs using `getBreadcrumbs()`                                     | No command.                                   |
| P032-04 | AGENT       | `apps/firm-website/src/app/(marketing)/services/[slug]/page.tsx`        | Create dynamic service page with: <br> - `generateStaticParams` – returns all service slugs <br> - `generateMetadata` – sets title, description, Open Graph <br> - Default export – fetches content and renders `ServiceDetail`    | `pnpm dev` shows /services/website-design.    |
| P032-05 | AGENT       | `apps/firm-website/src/app/(marketing)/services/[slug]/page.test.tsx`   | Write unit test: dynamic service pages render content, have correct metadata.                                                                                                                                                      | `pnpm --filter @repo/firm-website test` runs. |
| P032-06 | AGENT       | Update `docs/pages.md`                                                  | Document services pages and dynamic routing.                                                                                                                                                                                       | None.                                         |

---

### Parent Task P033: Build Industries Hub and Dynamic Industry Pages

- [ ] **P033** | Status: `PENDING`
      **Related File Paths:**
  - `apps/firm-website/src/app/(marketing)/industries/page.tsx`
  - `apps/firm-website/src/app/(marketing)/industries/[slug]/page.tsx`
  - `apps/firm-website/src/components/features/industries/industries-hub.tsx`
  - `apps/firm-website/src/components/features/industries/industry-detail.tsx`

  **Definition of Done:**
  - **Industries hub** (`/industries`) lists all industries with cards linking to individual pages.
  - **Dynamic industry pages** (`/industries/[slug]`) render individual industry content.
  - `generateStaticParams` pre‑renders all industry pages at build time.
  - `generateMetadata` sets dynamic metadata for each industry page.
  - Each industry page links to its corresponding demo page.

  **Out of Scope:**
  - None.

  **Rules to Follow:**
  - Use `getAllIndustries()` and `getIndustryBySlug()` from P021.
  - Use icons from industry metadata.
  - Each industry page should have a "See it in Action" link to the matching demo.

  **Advanced Coding Pattern:**
  - **Deep module** – follows the same pattern as services for consistency.

  **Anti‑Patterns:**
  - Hard‑coding industry slugs or metadata.

  **Imports/Exports:**
  - `industries/page.tsx` exports the hub page.
  - `industries/[slug]/page.tsx` exports the detail page.

  **Depends On / Blocks:**
  - Depends on: P021 (content utilities), P023 (industry content), P027 (navigation).
  - Blocks: None.

#### Subtasks

| ID      | Agent/Human | File Path / Command                                                        | Description                                                                                                                                                                                                                        | Validation Command                            |
| ------- | ----------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| P033-01 | AGENT       | `apps/firm-website/src/components/features/industries/industries-hub.tsx`  | Create IndustriesHub component that: <br> 1. Fetches all industries using `getAllIndustries()` <br> 2. Renders each as a Card with icon, title, description, and link to `/industries/[slug]`                                      | No command.                                   |
| P033-02 | AGENT       | `apps/firm-website/src/app/(marketing)/industries/page.tsx`                | Create Industries Hub page: import `IndustriesHub` component. Set metadata: `title: "Industries We Serve"`, `description: "..."`.                                                                                                  | `pnpm dev` shows /industries.                 |
| P033-03 | AGENT       | `apps/firm-website/src/components/features/industries/industry-detail.tsx` | Create IndustryDetail component that: <br> 1. Accepts `content` prop (MDX module) <br> 2. Renders the MDX content <br> 3. Finds and links to matching demo page <br> 4. Adds breadcrumbs                                           | No command.                                   |
| P033-04 | AGENT       | `apps/firm-website/src/app/(marketing)/industries/[slug]/page.tsx`         | Create dynamic industry page with: <br> - `generateStaticParams` – returns all industry slugs <br> - `generateMetadata` – sets title, description, Open Graph <br> - Default export – fetches content and renders `IndustryDetail` | `pnpm dev` shows /industries/home-services.   |
| P033-05 | AGENT       | `apps/firm-website/src/app/(marketing)/industries/[slug]/page.test.tsx`    | Write unit test: dynamic industry pages render content, have correct metadata.                                                                                                                                                     | `pnpm --filter @repo/firm-website test` runs. |
| P033-06 | AGENT       | Update `docs/pages.md`                                                     | Document industries pages and dynamic routing.                                                                                                                                                                                     | None.                                         |

---

### Parent Task P034: Build Demos Hub and Dynamic Demo Pages

- [ ] **P034** | Status: `PENDING`
      **Related File Paths:**
  - `apps/firm-website/src/app/(marketing)/demos/page.tsx`
  - `apps/firm-website/src/app/(marketing)/demos/[slug]/page.tsx`
  - `apps/firm-website/src/components/features/demos/demos-hub.tsx`
  - `apps/firm-website/src/components/features/demos/demo-detail.tsx`

  **Definition of Done:**
  - **Demos hub** (`/demos`) lists all demo/proof‑of‑concept pages with cards linking to individual pages.
  - **Dynamic demo pages** (`/demos/[slug]`) render individual demo content.
  - `generateStaticParams` pre‑renders all demo pages at build time.
  - SEO metadata is added using `generateMetadata()` from P029-SEO with title, description, Open Graph tags for each demo page.
  - JSON-LD BreadcrumbList schema is included per AEO requirements from file:3.
  - Each demo page links to its corresponding industry page.

  **Out of Scope:**
  - Building the actual demo sites – these are separate projects.

  **Rules to Follow:**
  - Use `getAllDemos()` and `getDemoBySlug()` from P021.
  - Demo pages should use the "Proof of Concept" pattern from the sitemap plan.
  - Each demo page should have "View Live Demo" link (placeholder for now).

  **Advanced Coding Pattern:**
  - **Deep module** – follows the same pattern as services and industries for consistency.

  **Anti‑Patterns:**
  - Hard‑coding demo slugs or metadata.

  **Imports/Exports:**
  - `demos/page.tsx` exports the hub page.
  - `demos/[slug]/page.tsx` exports the detail page.

  **Depends On / Blocks:**
  - Depends on: P021 (content utilities), P024 (demo content), P027 (navigation), P029-SEO (SEO infrastructure).
  - Blocks: None.

#### Subtasks

| ID      | Agent/Human | File Path / Command                                                | Description                                                                                                                                                                                                                                                               | Validation Command                            |
| ------- | ----------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| P034-01 | AGENT       | `apps/firm-website/src/components/features/demos/demos-hub.tsx`    | Create DemosHub component that: <br> 1. Fetches all demos using `getAllDemos()` <br> 2. Renders each as a Card with title, description, and link to `/demos/[slug]`                                                                                                       | No command.                                   |
| P034-02 | AGENT       | `apps/firm-website/src/app/(marketing)/demos/page.tsx`             | Create Demos Hub page: import `DemosHub` component. Set metadata: `title: "Demo Sites"`, `description: "Proof-of-concept websites for DFW businesses."`.                                                                                                                  | `pnpm dev` shows /demos.                      |
| P034-03 | AGENT       | `apps/firm-website/src/components/features/demos/demo-detail.tsx`  | Create DemoDetail component that: <br> 1. Accepts `content` prop (MDX module) <br> 2. Renders the MDX content with sections: Situation, Challenge, Approach, Outcome <br> 3. Finds and links to matching industry page <br> 4. Adds "View Live Demo" button (placeholder) | No command.                                   |
| P034-04 | AGENT       | `apps/firm-website/src/app/(marketing)/demos/[slug]/page.tsx`      | Create dynamic demo page with: <br> - `generateStaticParams` – returns all demo slugs <br> - `generateMetadata` – sets title, description, Open Graph <br> - Default export – fetches content and renders `DemoDetail`                                                    | `pnpm dev` shows /demos/plumbing-demo.        |
| P034-05 | AGENT       | `apps/firm-website/src/app/(marketing)/demos/[slug]/page.test.tsx` | Write unit test: dynamic demo pages render content, have correct metadata.                                                                                                                                                                                                | `pnpm --filter @repo/firm-website test` runs. |
| P034-06 | AGENT       | Update `docs/pages.md`                                             | Document demos pages and dynamic routing.                                                                                                                                                                                                                                 | None.                                         |

---

### Parent Task P035: Build FAQ Hub

- [ ] **P035** | Status: `PENDING`
      **Related File Paths:**
  - `apps/firm-website/src/app/(marketing)/faq/page.tsx`
  - `apps/firm-website/src/components/features/faq/faq-hub.tsx`
  - `apps/firm-website/src/components/features/faq/faq-accordion.tsx`

  **Definition of Done:**
  - **FAQ hub** (`/faq`) displays all FAQ entries grouped by category.
  - FAQ entries are rendered using the `Accordion` component from `@repo/ui`.
  - FAQ schema (`FAQPage` JSON-LD) is generated for SEO.
  - Metadata is set for the FAQ hub page.

  **Out of Scope:**
  - Individual FAQ pages – the hub page is sufficient.

  **Rules to Follow:**
  - Use `getAllFAQs()` from P021.
  - Group FAQs by category (`general`, `pricing`, `process`).
  - Use `Accordion` component from `@repo/ui` with proper accessibility.
  - Implement `FAQPage` JSON‑LD structured data.

  **Advanced Coding Pattern:**
  - **Deep module** – FAQ hub is a single component that handles grouping, rendering, and schema generation.

  **Anti‑Patterns:**
  - Not categorizing FAQs.
  - Missing JSON‑LD structured data.

  **Imports/Exports:**
  - `faq/page.tsx` exports the FAQ hub page.

  **Depends On / Blocks:**
  - Depends on: P021 (content utilities), P016 (Accordion), P025 (FAQ content).
  - Blocks: None.

#### Subtasks

| ID      | Agent/Human | File Path / Command                                               | Description                                                                                                                                                                                             | Validation Command                            |
| ------- | ----------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| P035-01 | AGENT       | `apps/firm-website/src/components/features/faq/faq-accordion.tsx` | Create `FAQAccordion` component that accepts an array of FAQs and renders them using `Accordion` from `@repo/ui`.                                                                                       | No command.                                   |
| P035-02 | AGENT       | `apps/firm-website/src/components/features/faq/faq-hub.tsx`       | Create FAQHub component that: <br> 1. Fetches all FAQs using `getAllFAQs()` <br> 2. Groups by category <br> 3. Renders category headings with `FAQAccordion` <br> 4. Generates `FAQPage` JSON‑LD schema | No command.                                   |
| P035-03 | AGENT       | `apps/firm-website/src/app/(marketing)/faq/page.tsx`              | Create FAQ Hub page: import `FAQHub` component. Set metadata: `title: "FAQ"`, `description: "..."`.                                                                                                     | `pnpm dev` shows /faq.                        |
| P035-04 | AGENT       | `apps/firm-website/src/app/(marketing)/faq/page.test.tsx`         | Write unit test: FAQ hub renders all FAQs, shows correct categories.                                                                                                                                    | `pnpm --filter @repo/firm-website test` runs. |
| P035-05 | AGENT       | Update `docs/pages.md`                                            | Document FAQ hub and structured data generation.                                                                                                                                                        | None.                                         |

---

### Parent Task P036: Build Contact Page with Form and Server Action

- [ ] **P036** | Status: `PENDING`
      **Related File Paths:**
  - `apps/firm-website/src/app/(marketing)/contact/page.tsx`
  - `apps/firm-website/src/app/actions/contact.ts`
  - `apps/firm-website/src/components/features/contact/contact-form.tsx`
  - `apps/firm-website/src/components/features/contact/contact-success.tsx`

  **Definition of Done:**
  - **Contact page** (`/contact`) displays a contact form.
  - Form fields: Name, Email, Phone (optional), Company (optional), Message.
  - Form validation with Zod.
  - Server Action handles submission and sends email.
  - Success state with confirmation message.
  - Error handling with user‑friendly messages.
  - Metadata is set for the contact page.

  **Out of Scope:**
  - Advanced email features (CC, BCC, attachments).
  - CRM integration.

  **Rules to Follow:**
  - Use Server Action with `useFormState` (client side) for validation.
  - Use `react-hook-form` (optional) or simple state.
  - Validate with Zod on the server and client.
  - Send email using Resend, Nodemailer, or a simple service.
  - Use `useTransition` or `useFormStatus` for loading states.

  **Advanced Coding Pattern:**
  - **Deep module** – the contact form encapsulates all validation, submission, and success states.

  **Anti‑Patterns:**
  - Using `fetch` directly in the client component without Server Action.
  - Not validating on the server.

  **Imports/Exports:**
  - `app/actions/contact.ts` exports `submitContact` Server Action.
  - `contact/page.tsx` exports the contact page.

  **Depends On / Blocks:**
  - Depends on: P015 (Form components).
  - Blocks: None.

#### Subtasks

| ID      | Agent/Human | File Path / Command                                                  | Description                                                                                                                                                                                                                                                           | Validation Command                            |
| ------- | ----------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| P036-01 | AGENT       | `apps/firm-website` (install)                                        | Run: `pnpm --filter @repo/firm-website add zod react-hook-form @hookform/resolvers`.                                                                                                                                                                                  | `pnpm list` shows packages.                   |
| P036-02 | AGENT       | `apps/firm-website/src/app/actions/contact.ts`                       | Create Server Action `submitContact`: <br> 1. Define Zod schema for form fields <br> 2. Parse and validate form data <br> 3. Return success/error response <br> 4. (Placeholder for email sending)                                                                    | No command.                                   |
| P036-03 | AGENT       | `apps/firm-website/src/components/features/contact/contact-form.tsx` | Create ContactForm component: <br> 1. Client component with `"use client"` <br> 2. Use `useFormState` with `submitContact` <br> 3. Render Input, Textarea, Label from `@repo/ui` <br> 4. Show validation errors <br> 5. Show loading state <br> 6. Show success state | No command.                                   |
| P036-04 | AGENT       | `apps/firm-website/src/app/(marketing)/contact/page.tsx`             | Create Contact page: import `ContactForm`. Set metadata: `title: "Contact"`, `description: "..."`.                                                                                                                                                                    | `pnpm dev` shows /contact.                    |
| P036-05 | AGENT       | `apps/firm-website/src/app/(marketing)/contact/page.test.tsx`        | Write unit test: contact page renders form, submits successfully.                                                                                                                                                                                                     | `pnpm --filter @repo/firm-website test` runs. |
| P036-06 | AGENT       | Update `docs/pages.md`                                               | Document contact page and Server Action.                                                                                                                                                                                                                              | None.                                         |

---

### Parent Task P037: Implement Metadata and SEO (Open Graph, JSON-LD)

- [ ] **P037** | Status: `PENDING`
      **Related File Paths:**
  - `apps/firm-website/src/app/layout.tsx` (root metadata)
  - `apps/firm-website/src/app/(marketing)/layout.tsx` (marketing metadata)
  - `apps/firm-website/src/app/(marketing)/**/page.tsx` (page metadata)
  - `apps/firm-website/src/lib/seo.ts` (helper utilities)

  **Definition of Done:**
  - Root layout has `metadata` with:
    - `title.template` and `default`
    - `description`
    - `metadataBase` (production URL)
    - `openGraph` (site-wide defaults)
    - `twitter` (site-wide defaults)
    - `icons` (favicon)
  - All pages have `generateMetadata` with dynamic Open Graph and Twitter cards.
  - JSON‑LD structured data is implemented for:
    - **LocalBusiness** (homepage)
    - **FAQPage** (FAQ hub)
    - **Service** (service pages)
    - **BreadcrumbList** (all pages)
  - Images for Open Graph are generated or placed in `public/`.
  - Metadata validation using `next-sitemap` or manual check.

  **Out of Scope:**
  - Automated OG image generation – will be done in Phase 5.
  - Advanced analytics integration – will be done later.

  **Rules to Follow:**
  - Use `metadataBase` to make Open Graph URLs absolute.
  - Each page should define its own `title` and `description`.
  - JSON‑LD should use the `script` tag with `type="application/ld+json"`.
  - Use `generateMetadata` for dynamic pages with content‑driven metadata.

  **Advanced Coding Pattern:**
  - **Deep module** – SEO utilities abstract JSON-LD generation and common metadata patterns.

  **Anti‑Patterns:**
  - Missing `metadataBase`.
  - Using relative URLs for Open Graph images.

  **Imports/Exports:**
  - `lib/seo.ts` exports `generateBreadcrumbSchema`, `generateServiceSchema`, `generateLocalBusinessSchema`, etc.

  **Depends On / Blocks:**
  - Depends on: P029 (layout), P031–P036 (pages).
  - Blocks: None (but important for SEO).

#### Subtasks

| ID      | Agent/Human | File Path / Command                                              | Description                                                                                                                                                                                                                                                                                           | Validation Command |
| ------- | ----------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| P037-01 | AGENT       | `apps/firm-website/src/app/layout.tsx`                           | Add root metadata: <br> - `title: { template: '%s — Your Dedicated Marketer', default: 'Your Dedicated Marketer — DFW Web Design' }` <br> - `description: "..."` <br> - `metadataBase: process.env.NEXT_PUBLIC_SITE_URL` <br> - `openGraph: { type: 'website', siteName: 'Your Dedicated Marketer' }` | No command.        |
| P037-02 | AGENT       | `apps/firm-website/src/lib/seo.ts`                               | Create `seo.ts` with helper functions: <br> - `generateLocalBusinessSchema()` <br> - `generateFAQPageSchema()` <br> - `generateServiceSchema()` <br> - `generateBreadcrumbSchema()`                                                                                                                   | No command.        |
| P037-03 | AGENT       | `apps/firm-website/src/app/(marketing)/page.tsx`                 | Add `LocalBusiness` JSON‑LD schema to the homepage.                                                                                                                                                                                                                                                   | No command.        |
| P037-04 | AGENT       | `apps/firm-website/src/app/(marketing)/faq/page.tsx`             | Add `FAQPage` JSON‑LD schema to the FAQ hub.                                                                                                                                                                                                                                                          | No command.        |
| P037-05 | AGENT       | `apps/firm-website/src/app/(marketing)/services/[slug]/page.tsx` | Add `Service` JSON‑LD schema to each service page.                                                                                                                                                                                                                                                    | No command.        |
| P037-06 | AGENT       | `apps/firm-website/src/app/(marketing)/**/page.tsx`              | Add `BreadcrumbList` JSON‑LD schema to all pages (using `getBreadcrumbs()`).                                                                                                                                                                                                                          | No command.        |
| P037-07 | AGENT       | `apps/firm-website/public/og-image.png`                          | Create a simple Open Graph image (1200×630) and place in `public/`.                                                                                                                                                                                                                                   | File exists.       |
| P037-08 | AGENT       | Update `docs/seo.md`                                             | Document the SEO strategy and metadata implementation.                                                                                                                                                                                                                                                | None.              |

---

### Parent Task P038: Generate Sitemap and robots.txt

- [ ] **P038** | Status: `PENDING`
      **Related File Paths:**
  - `apps/firm-website/src/app/sitemap.ts`
  - `apps/firm-website/src/app/robots.ts`

  **Definition of Done:**
  - **sitemap.xml** is generated at `/sitemap.xml` with all pages:
    - Static pages: `/`, `/about`, `/pricing`, `/contact`, `/services`, `/industries`, `/demos`, `/faq`
    - Dynamic pages: all services, industries, demos
  - **robots.txt** is generated at `/robots.txt` with:
    - `User-Agent: *`
    - `Allow: /`
    - `Sitemap: https://yourdedicatedmarketer.com/sitemap.xml`
  - `lastModified` is set to the current date.

  **Out of Scope:**
  - Advanced sitemap features (priorities, changefreq) – can be added later.

  **Rules to Follow:**
  - Use Next.js file conventions: `sitemap.ts` and `robots.ts`.
  - Sitemap should include all content slugs from `getAllSlugs()`.
  - Dynamic pages should be included from content utilities.

  **Advanced Coding Pattern:**
  - **Deep module** – sitemap generation is a single function that aggregates all routes.

  **Anti‑Patterns:**
  - Hard‑coding sitemap URLs.
  - Missing dynamic content pages.

  **Imports/Exports:**
  - `app/sitemap.ts` exports a `sitemap` function returning `MetadataRoute.Sitemap`.
  - `app/robots.ts` exports a `robots` function returning `MetadataRoute.Robots`.

  **Depends On / Blocks:**
  - Depends on: P021 (content utilities), P031–P036 (pages).
  - Blocks: None (but important for SEO).

#### Subtasks

| ID      | Agent/Human | File Path / Command                         | Description                                                                                                                                                                                                         | Validation Command                            |
| ------- | ----------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| P038-01 | AGENT       | `apps/firm-website/src/app/sitemap.ts`      | Create `sitemap.ts` that: <br> 1. Gets all slugs for services, industries, demos <br> 2. Builds URL array for static pages <br> 3. Builds URL array for dynamic pages <br> 4. Returns `MetadataRoute.Sitemap` array | `/sitemap.xml` is generated.                  |
| P038-02 | AGENT       | `apps/firm-website/src/app/robots.ts`       | Create `robots.ts` that: <br> 1. Defines `User-Agent: *` <br> 2. Defines `Allow: /` <br> 3. Defines `Sitemap` URL                                                                                                   | `/robots.txt` is generated.                   |
| P038-03 | AGENT       | `apps/firm-website/src/app/sitemap.test.ts` | Write unit test: sitemap includes all static and dynamic pages.                                                                                                                                                     | `pnpm --filter @repo/firm-website test` runs. |
| P038-04 | AGENT       | Update `docs/seo.md`                        | Document sitemap and robots.txt generation.                                                                                                                                                                         | None.                                         |

---

### Parent Task P039: Add Loading States and Error Boundaries

- [ ] **P039** | Status: `PENDING`
      **Related File Paths:**
  - `apps/firm-website/src/app/(marketing)/loading.tsx`
  - `apps/firm-website/src/app/(marketing)/error.tsx`
  - `apps/firm-website/src/components/ui/skeleton.tsx` (in `@repo/ui` or local)

  **Definition of Done:**
  - **Loading state** (`loading.tsx`) in the marketing route group shows a skeleton or spinner.
  - **Error boundary** (`error.tsx`) in the marketing route group catches errors and displays a user‑friendly message with retry option.
  - Skeleton components match the layout of the page they're loading.
  - Error boundary logs errors to console (and optionally to Sentry).

  **Out of Scope:**
  - Granular Suspense boundaries for individual components – can be added later.

  **Rules to Follow:**
  - `loading.tsx` is a Server Component by default (can be client if using state).
  - `error.tsx` must be a Client Component (`"use client"`).
  - Skeleton should match the page structure (header, content, footer).

  **Advanced Coding Pattern:**
  - **Deep module** – loading and error states are separate concerns, handled at the route group level.

  **Anti‑Patterns:**
  - Generic loading spinners that don't match the page content.
  - Not logging errors.

  **Imports/Exports:**
  - `app/(marketing)/loading.tsx` exports the loading component.
  - `app/(marketing)/error.tsx` exports the error component.

  **Depends On / Blocks:**
  - Depends on: P029 (marketing layout).
  - Blocks: None.

#### Subtasks

| ID      | Agent/Human | File Path / Command                                 | Description                                                                                                                                                           | Validation Command                                   |
| ------- | ----------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| P039-01 | AGENT       | `apps/firm-website/src/components/ui/skeleton.tsx`  | Create Skeleton component in `@repo/ui` or locally: accepts `className` and renders a shimmer/placeholder.                                                            | No command.                                          |
| P039-02 | AGENT       | `apps/firm-website/src/app/(marketing)/loading.tsx` | Create `loading.tsx` that displays a skeleton of the page content (using `Container`, `Section`, and placeholder cards).                                              | `pnpm dev` shows loading state (simulate slow page). |
| P039-03 | AGENT       | `apps/firm-website/src/app/(marketing)/error.tsx`   | Create `error.tsx` (Client Component) that: <br> 1. Displays an error message <br> 2. Has a "Try again" button that calls `reset()` <br> 3. Logs the error to console | `pnpm dev` simulates an error, shows error page.     |
| P039-04 | AGENT       | Update `docs/pages.md`                              | Document loading and error handling.                                                                                                                                  | None.                                                |

---

### Parent Task P040: Performance Audit and Optimization

- [ ] **P040** | Status: `PENDING`
      **Related File Paths:**
  - All page files (audit across the entire app)

  **Definition of Done:**
  - **Lighthouse** scores are 90+ on all metrics (Performance, Accessibility, Best Practices, SEO).
  - **Images** are optimized using `next/image`.
  - **Fonts** are optimized using `next/font`.
  - **Bundle size** is analyzed and optimized.
  - **Core Web Vitals** are measured and pass thresholds (LCP < 2.5s, FID < 100ms, CLS < 0.1).
  - **Caching** headers are set correctly for static assets.

  **Out of Scope:**
  - Advanced performance monitoring (Sentry, Vercel Analytics) – will be set up later.

  **Rules to Follow:**
  - Use `next/image` for all images.
  - Use `next/font` for fonts.
  - Use `next/script` for external scripts.
  - Use `next/dynamic` for lazy loading components.

  **Advanced Coding Pattern:**
  - **Deep module** – performance optimization is a cross‑cutting concern addressed systematically.

  **Anti‑Patterns:**
  - Using `<img>` instead of `next/image`.
  - Not optimizing font loading.

  **Imports/Exports:**
  - None.

  **Depends On / Blocks:**
  - Depends on: P029–P039 (all pages).
  - Blocks: None.

#### Subtasks

| ID      | Agent/Human | File Path / Command                                 | Description                                                                                                           | Validation Command                             |
| ------- | ----------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| P040-01 | AGENT       | All pages                                           | Audit all pages: ensure all images use `next/image` with `width`, `height`, `sizes`, and `quality`.                   | Lighthouse audit shows "Properly size images". |
| P040-02 | AGENT       | `apps/firm-website/src/app/layout.tsx`              | Ensure `next/font` is used for Inter (or Geist).                                                                      | No command.                                    |
| P040-03 | AGENT       | `apps/firm-website/next.config.ts`                  | Add `images: { formats: ['image/webp'], deviceSizes: [640, 750, 828, 1080, 1200, 1920], }` for optimal image formats. | No command.                                    |
| P040-04 | AGENT       | `apps/firm-website/src/app/(marketing)/**/page.tsx` | Use `next/dynamic` for any heavy client components (e.g., the contact form, if it imports large libraries).           | No command.                                    |
| P040-05 | AGENT       | `apps/firm-website/next.config.ts`                  | Add `compression: true` (default) and `swcMinify: true` (default).                                                    | No command.                                    |
| P040-06 | HUMAN       | Run Lighthouse                                      | Open each page in Chrome DevTools, run Lighthouse, and verify scores.                                                 | Lighthouse scores 90+.                         |
| P040-07 | AGENT       | Update `docs/performance.md`                        | Document performance optimizations and Lighthouse scores.                                                             | None.                                          |

---

### Parent Task P041: Update Documentation and Repository Management

- [ ] **P041** | Status: `PENDING`
      **Related File Paths:**
  - `README.md` (root)
  - `docs/pages.md`
  - `docs/seo.md`
  - `docs/performance.md`
  - `docs/architecture.md`

  **Definition of Done:**
  - All docs are updated to reflect Phase 4 additions.
  - `docs/pages.md` is complete with all page types and routing.
  - `docs/seo.md` covers metadata, Open Graph, JSON‑LD, sitemap, robots.txt.
  - `docs/performance.md` covers optimizations and Lighthouse scores.
  - `README.md` includes Phase 4 status and links to documentation.

  **Out of Scope:**
  - Writing user guides.

  **Rules to Follow:**
  - Keep docs up‑to‑date.
  - Use clear, concise language.

  **Advanced Coding Pattern:**
  - N/A.

  **Anti‑Patterns:**
  - Outdated documentation.

  **Depends On / Blocks:**
  - Depends on: P029–P040.
  - Blocks: None.

#### Subtasks

| ID      | Agent/Human | File Path / Command    | Description                                                                                                                                                                                         | Validation Command |
| ------- | ----------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| P041-01 | AGENT       | `README.md`            | Update with Phase 4 status, add links to docs.                                                                                                                                                      | Manual check.      |
| P041-02 | AGENT       | `docs/pages.md`        | Complete with: <br> - Page structure <br> - Dynamic routing <br> - Static generation (generateStaticParams) <br> - Each page type (Home, About, Pricing, Services, Industries, Demos, FAQ, Contact) | Manual check.      |
| P041-03 | AGENT       | `docs/seo.md`          | Complete with: <br> - Metadata configuration <br> - Open Graph <br> - JSON‑LD structured data <br> - Sitemap <br> - robots.txt                                                                      | Manual check.      |
| P041-04 | AGENT       | `docs/performance.md`  | Complete with: <br> - Image optimization <br> - Font optimization <br> - Bundle optimization <br> - Lighthouse scores                                                                               | Manual check.      |
| P041-05 | AGENT       | `docs/architecture.md` | Update with route group structure and page architecture.                                                                                                                                            | Manual check.      |

---

## Summary of Phase 4

Phase 4 consists of 13 parent tasks (P029–P041) and numerous subtasks. The goal is to build all pages that render the content created in Phase 3, with proper SEO, performance optimization, and user experience.

**Key Deliverables:**

- Route group structure with marketing layout
- Complete homepage with all sections
- Static pages (About, Pricing) using MDX
- Dynamic services pages (hub + individual)
- Dynamic industries pages (hub + individual)
- Dynamic demos pages (hub + individual)
- FAQ hub with accordion and JSON‑LD
- Contact page with form and Server Action
- Complete SEO (metadata, Open Graph, JSON‑LD)
- Sitemap and robots.txt
- Loading states and error boundaries
- Performance optimization (Lighthouse 90+)

**Page Count (by the end of Phase 4):**

| Type         | Count                             |
| ------------ | --------------------------------- |
| Static pages | 4 (Home, About, Pricing, Contact) |
| Services     | 6 (hub + 5 individual)            |
| Industries   | 7 (hub + 6 individual)            |
| Demos        | 7 (hub + 6 individual)            |
| FAQ          | 1                                 |
| **Total**    | **25 pages**                      |

---

## Phase 5: Interactivity, Forms & Analytics – Task List

This document defines all tasks required to complete the contact form with email sending, add toast notifications, implement analytics tracking, and enhance form UX. All tasks are designed to be **SMALL**, actionable, and built with **SDD, DDD, TDD, BDD**, and **Deep Modules** in mind.

---

### Phase 5 Overview

**Objective:** Complete the contact form with email sending (Resend), enhance form UX with toast notifications and loading states, and implement analytics tracking (GA4) for page views and conversion events.

**Key Decisions (from research and analysis):**

- **Resend** for email sending (free tier: 3,000 emails/month)
- **`useActionState`** (React 19) for form state management (replaces deprecated `useFormState`)
- **`sonner`** for toast notifications (lightweight, shadcn/ui compatible)
- **Google Analytics 4 (GA4)** for analytics (free, industry standard)
- **Page views + form submissions** as core tracked events
- **Cookie consent** deferred (not required for launch)
- **Native form + `useActionState`** for progressive enhancement

---

### Parent Task P042: Implement Email Sending with Resend

- [ ] **P042** | Status: `PENDING`
      **Related File Paths:**
  - `apps/firm-website/package.json` (add `resend`)
  - `apps/firm-website/src/app/actions/contact.ts` (update Server Action)
  - `apps/firm-website/.env.example` (add environment variables)
  - `apps/firm-website/src/lib/email.ts` (optional: email template)

  **Definition of Done:**
  - Resend is installed in `apps/firm-website`.
  - Resend API key is configured in environment variables.
  - Server Action `submitContact` sends an email via Resend.
  - Email includes: name, email, phone, company, message, and reply-to header.
  - Email is sent to the configured contact email address.
  - A confirmation email (optional) is sent to the submitter.
  - Error handling: if email sending fails, the form returns an error state.

  **Out of Scope:**
  - HTML email templates – plain text is sufficient for launch.
  - Advanced email features (attachments, CC, BCC).

  **Rules to Follow:**
  - Use Resend's `emails.send` with `from`, `to`, `subject`, `text`, `reply_to`.
  - Use `process.env.RESEND_API_KEY` for the API key.
  - Use `process.env.CONTACT_EMAIL` for the recipient email.
  - The `from` email should be a verified domain in Resend (e.g., `noreply@yourdedicatedmarketer.com`).
  - Validate that environment variables exist before sending.

  **Advanced Coding Pattern:**
  - **Deep module** – email sending is encapsulated in the Server Action; form submission and email sending are atomic.

  **Anti‑Patterns:**
  - Hard‑coding email addresses.
  - Sending emails without error handling.
  - Not using `reply_to` (makes it hard to respond).

  **Imports/Exports:**
  - `app/actions/contact.ts` exports `submitContact` Server Action.

  **Depends On / Blocks:**
  - Depends on: P036 (contact form).
  - Blocks: None.

#### Subtasks

| ID      | Agent/Human | File Path / Command                                 | Description                                                                                                                                                       | Validation Command                            |
| ------- | ----------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| P042-01 | AGENT       | `apps/firm-website` (install)                       | Run: `pnpm --filter @repo/firm-website add resend`.                                                                                                               | `pnpm list resend` shows it.                  |
| P042-02 | AGENT       | `apps/firm-website/.env.example`                    | Add environment variables: <br> `RESEND_API_KEY=re_xxxx` <br> `CONTACT_EMAIL=hello@yourdedicatedmarketer.com` <br> `FROM_EMAIL=noreply@yourdedicatedmarketer.com` | File updated.                                 |
| P042-03 | HUMAN       | Resend account setup                                | Create a Resend account, verify the domain `yourdedicatedmarketer.com`, and get the API key. Add the API key to `.env.local`.                                     | API key saved.                                |
| P042-04 | AGENT       | `apps/firm-website/src/app/actions/contact.ts`      | Update `submitContact` Server Action to send email via Resend after validation. Use `reply_to` to set the email address from the form.                            | No command.                                   |
| P042-05 | AGENT       | `apps/firm-website/src/app/actions/contact.ts`      | Add error handling: catch any errors from Resend and return a user‑friendly error message. Log the error to console (or Sentry, if configured).                   | No command.                                   |
| P042-06 | AGENT       | `apps/firm-website/src/app/actions/contact.test.ts` | Write unit test: Server Action sends email successfully, handles errors.                                                                                          | `pnpm --filter @repo/firm-website test` runs. |
| P042-07 | AGENT       | Update `docs/forms.md`                              | Document email sending setup and Resend configuration.                                                                                                            | None.                                         |

---

### Parent Task P043: Upgrade Contact Form to React 19 `useActionState`

- [ ] **P043** | Status: `PENDING`
      **Related File Paths:**
  - `apps/firm-website/src/components/features/contact/contact-form.tsx`
  - `apps/firm-website/src/components/features/contact/submit-button.tsx`
  - `apps/firm-website/src/app/actions/contact.ts` (ensure compatibility)

  **Definition of Done:**
  - Contact form uses `useActionState` (React 19) instead of `useFormState` (deprecated).
  - `isPending` is used for loading state.
  - Submit button shows loading state using `useFormStatus`.
  - Form submits correctly with progressive enhancement (works without JavaScript).
  - Success and error states are displayed appropriately.

  **Out of Scope:**
  - Client‑side validation with `react-hook-form` – server‑side validation is sufficient for launch.

  **Rules to Follow:**
  - `useActionState` is imported from `'react'` (not `'react-dom'`).
  - The `action` prop on the form should be the bound Server Action.
  - Use `useFormStatus` for the submit button's pending state.
  - The form should reset on success (optional, but recommended).

  **Advanced Coding Pattern:**
  - **Deep module** – form state, loading, and error handling are managed by `useActionState`; the UI layer is a thin wrapper.

  **Anti‑Patterns:**
  - Using `useFormState` (deprecated).
  - Not handling `isPending` for loading states.
  - Not resetting the form on success.

  **Imports/Exports:**
  - `contact-form.tsx` exports `ContactForm` component.
  - `submit-button.tsx` exports `SubmitButton` component.

  **Depends On / Blocks:**
  - Depends on: P042 (email sending).
  - Blocks: P044 (toast notifications).

#### Subtasks

| ID      | Agent/Human | File Path / Command                                                       | Description                                                                                                                                                                                                                 | Validation Command                            |
| ------- | ----------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| P043-01 | AGENT       | `apps/firm-website/src/components/features/contact/submit-button.tsx`     | Create `SubmitButton` component (Client Component) that: <br> 1. Uses `useFormStatus` to get `pending` <br> 2. Renders a button with `disabled={pending}` <br> 3. Shows "Sending..." when pending, "Send Message" otherwise | No command.                                   |
| P043-02 | AGENT       | `apps/firm-website/src/components/features/contact/contact-form.tsx`      | Upgrade to use `useActionState`: <br> 1. `const [state, formAction, isPending] = useActionState(submitContact, null)` <br> 2. Pass `action={formAction}` to the form <br> 3. Replace the old `useFormState` code            | No command.                                   |
| P043-03 | AGENT       | `apps/firm-website/src/components/features/contact/contact-form.tsx`      | Add form reset logic: after successful submission, clear the form fields. Use `form.reset()` or a ref.                                                                                                                      | No command.                                   |
| P043-04 | AGENT       | `apps/firm-website/src/components/features/contact/contact-form.tsx`      | Display validation errors from `state` next to each field.                                                                                                                                                                  | No command.                                   |
| P043-05 | AGENT       | `apps/firm-website/src/components/features/contact/contact-form.test.tsx` | Write unit test: form submits with `useActionState`, shows loading state, handles success/error.                                                                                                                            | `pnpm --filter @repo/firm-website test` runs. |
| P043-06 | AGENT       | Update `docs/forms.md`                                                    | Document `useActionState` usage and form UX patterns.                                                                                                                                                                       | None.                                         |

---

### Parent Task P044: Add Toast Notifications for Form Feedback

- [ ] **P044** | Status: `PENDING`
      **Related File Paths:**
  - `apps/firm-website/package.json` (add `sonner`)
  - `apps/firm-website/src/components/features/contact/contact-form.tsx`
  - `apps/firm-website/src/app/layout.tsx` (add `Toaster`)

  **Definition of Done:**
  - `sonner` is installed and configured.
  - `Toaster` component is added to the root layout (or marketing layout).
  - Success toast is shown when the form is submitted successfully.
  - Error toast is shown when the form submission fails.
  - Toasts are accessible and match the design system.

  **Out of Scope:**
  - Custom toast styling – `sonner` defaults are clean and work with shadcn/ui.

  **Rules to Follow:**
  - Use `toast.success()` and `toast.error()` for different states.
  - Toasts should auto‑dismiss after 4‑5 seconds.
  - Toasts should be placed at the top‑right or bottom‑right.

  **Advanced Coding Pattern:**
  - **Deep module** – toast notifications are a side effect handled by `sonner`; the form triggers them via `useEffect` or directly after the action.

  **Anti‑Patterns:**
  - Showing toasts for validation errors (errors should be next to the field, not in a toast).
  - Not handling error messages from the Server Action.

  **Imports/Exports:**
  - `app/layout.tsx` imports and renders `Toaster` from `sonner`.

  **Depends On / Blocks:**
  - Depends on: P043 (`useActionState`).
  - Blocks: None.

#### Subtasks

| ID      | Agent/Human | File Path / Command                                                  | Description                                                                                                                                                                                       | Validation Command           |
| ------- | ----------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| P044-01 | AGENT       | `apps/firm-website` (install)                                        | Run: `pnpm --filter @repo/firm-website add sonner`.                                                                                                                                               | `pnpm list sonner` shows it. |
| P044-02 | AGENT       | `apps/firm-website/src/app/layout.tsx`                               | Import `Toaster` from `sonner` and render it inside the root layout (or in the marketing layout).                                                                                                 | No command.                  |
| P044-03 | AGENT       | `apps/firm-website/src/components/features/contact/contact-form.tsx` | In the `useEffect` that watches `state`, add: <br> - `if (state?.success) toast.success('Message sent! We\'ll be in touch shortly.')` <br> - `if (state?.error) toast.error(state.error.message)` | No command.                  |
| P044-04 | AGENT       | `apps/firm-website/src/components/features/contact/contact-form.tsx` | Ensure toasts don't show on initial render (check for `state` being `null`).                                                                                                                      | No command.                  |
| P044-05 | AGENT       | Update `docs/forms.md`                                               | Document toast notification setup and usage.                                                                                                                                                      | None.                        |

---

### Parent Task P045: Set Up Google Analytics 4 (GA4)

- [ ] **P045** | Status: `PENDING`
      **Related File Paths:**
  - `apps/firm-website/.env.example` (add GA4 variable)
  - `apps/firm-website/src/lib/gtag.ts`
  - `apps/firm-website/src/components/analytics/ga4-script.tsx`
  - `apps/firm-website/src/app/layout.tsx`

  **Definition of Done:**
  - GA4 measurement ID is configured in environment variables.
  - GA4 script is loaded via `next/script` with `afterInteractive` strategy.
  - GA4 is initialized with the measurement ID.
  - The script is only loaded in production (not in development).

  **Out of Scope:**
  - Cookie consent – deferred for now.
  - Advanced GA4 features (user properties, enhanced measurement).

  **Rules to Follow:**
  - Use `next/script` with `strategy="afterInteractive"`.
  - Use `NEXT_PUBLIC_GA_MEASUREMENT_ID` for the measurement ID.
  - Only load GA4 in production (`process.env.NODE_ENV === 'production'`).
  - The `gtag` function should be available globally.

  **Advanced Coding Pattern:**
  - **Deep module** – analytics is a separate concern; the GA4 script component is a single, focused piece of code.

  **Anti‑Patterns:**
  - Loading GA4 in development (skews analytics data).
  - Hard‑coding the measurement ID.
  - Not providing a fallback when the measurement ID is missing.

  **Imports/Exports:**
  - `lib/gtag.ts` exports `GA_MEASUREMENT_ID`, `pageview`, `event`.
  - `components/analytics/ga4-script.tsx` exports `GA4Script`.

  **Depends On / Blocks:**
  - Depends on: None (can be added anytime).
  - Blocks: P046 (page views), P047 (conversion events).

#### Subtasks

| ID      | Agent/Human | File Path / Command                                         | Description                                                                                                                                                                                                                       | Validation Command    |
| ------- | ----------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| P045-01 | HUMAN       | GA4 account setup                                           | Create a GA4 property (or use an existing one). Get the Measurement ID (G-XXXXXXXXXX).                                                                                                                                            | Measurement ID saved. |
| P045-02 | AGENT       | `apps/firm-website/.env.example`                            | Add: `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX`.                                                                                                                                                                                | File updated.         |
| P045-03 | AGENT       | `apps/firm-website/src/lib/gtag.ts`                         | Create `gtag.ts` with: <br> 1. Export `GA_MEASUREMENT_ID` constant <br> 2. Export `pageview(url)` function <br> 3. Export `event(name, params)` function <br> 4. Type declarations for `window.gtag`                              | No command.           |
| P045-04 | AGENT       | `apps/firm-website/src/components/analytics/ga4-script.tsx` | Create GA4Script component (Client Component) that: <br> 1. Checks for `NEXT_PUBLIC_GA_MEASUREMENT_ID` <br> 2. Renders two Script tags (gtag.js + init) <br> 3. Only loads in production <br> 4. Uses `afterInteractive` strategy | No command.           |
| P045-05 | AGENT       | `apps/firm-website/src/app/layout.tsx`                      | Import and render `GA4Script` in the root layout.                                                                                                                                                                                 | No command.           |
| P045-06 | AGENT       | Update `docs/analytics.md`                                  | Document GA4 setup and environment variables.                                                                                                                                                                                     | None.                 |

---

### Parent Task P046: Track Page Views with GA4

- [ ] **P046** | Status: `PENDING`
      **Related File Paths:**
  - `apps/firm-website/src/components/analytics/page-view-tracker.tsx`
  - `apps/firm-website/src/app/layout.tsx` (or marketing layout)

  **Definition of Done:**
  - Page view tracking is implemented using `usePathname` and `useSearchParams`.
  - Each route change triggers a `pageview` event.
  - The tracker only runs in production.
  - Page views are visible in GA4 reports.

  **Out of Scope:**
  - Tracking hash changes or fragment identifiers.

  **Rules to Follow:**
  - Use `usePathname` and `useSearchParams` from `next/navigation`.
  - Use `useEffect` with dependencies on `pathname` and `searchParams`.
  - Call `pageview(url)` on route changes.

  **Advanced Coding Pattern:**
  - **Deep module** – page view tracking is a separate component that doesn't interfere with the rest of the app.

  **Anti‑Patterns:**
  - Tracking page views in development.
  - Not including search params in the URL.

  **Imports/Exports:**
  - `components/analytics/page-view-tracker.tsx` exports `PageViewTracker`.

  **Depends On / Blocks:**
  - Depends on: P045 (GA4 setup).
  - Blocks: None.

#### Subtasks

| ID      | Agent/Human | File Path / Command                                                | Description                                                                                                                                                                                                         | Validation Command |
| ------- | ----------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| P046-01 | AGENT       | `apps/firm-website/src/components/analytics/page-view-tracker.tsx` | Create `PageViewTracker` component (Client Component) that: <br> 1. Uses `usePathname` and `useSearchParams` <br> 2. Calls `pageview` from `@/lib/gtag` on mount and on URL changes <br> 3. Only runs in production | No command.        |
| P046-02 | AGENT       | `apps/firm-website/src/app/(marketing)/layout.tsx`                 | Add `PageViewTracker` to the marketing layout.                                                                                                                                                                      | No command.        |
| P046-03 | AGENT       | Update `docs/analytics.md`                                         | Document page view tracking.                                                                                                                                                                                        | None.              |

---

### Parent Task P047: Track Form Submissions as Conversion Events

- [ ] **P047** | Status: `PENDING`
      **Related File Paths:**
  - `apps/firm-website/src/components/features/contact/contact-form.tsx`
  - `apps/firm-website/src/lib/gtag.ts` (ensure `event` is exported)

  **Definition of Done:**
  - Form submissions are tracked as GA4 events.
  - Event name: `form_submission` or `contact_form_submission`.
  - Event parameters include: `form_type`, `source` (optional).
  - No PII (personally identifiable information) is sent to GA4.
  - Events are visible in GA4 reports (Real‑time and Events).

  **Out of Scope:**
  - Tracking form abandonment (partially filled forms).
  - Tracking specific fields (for privacy reasons).

  **Rules to Follow:**
  - Only track successful submissions (not errors).
  - Do not send name, email, or message content to GA4.
  - Use `window.gtag` (or the helper function from P045).

  **Advanced Coding Pattern:**
  - **Deep module** – conversion tracking is a side effect of successful form submission.

  **Anti‑Patterns:**
  - Sending PII to GA4 (violates privacy guidelines).
  - Tracking form submissions in development.

  **Imports/Exports:**
  - `contact-form.tsx` imports `event` from `@/lib/gtag`.

  **Depends On / Blocks:**
  - Depends on: P045 (GA4 setup), P043 (contact form).
  - Blocks: None.

#### Subtasks

| ID      | Agent/Human | File Path / Command                                                  | Description                                                                                                                           | Validation Command |
| ------- | ----------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| P047-01 | AGENT       | `apps/firm-website/src/components/features/contact/contact-form.tsx` | In the `useEffect` watching `state`, add a call to `event('form_submission', { form_type: 'contact' })` when `state.success` is true. | No command.        |
| P047-02 | AGENT       | `apps/firm-website/src/components/features/contact/contact-form.tsx` | Ensure the event is only called once per submission (use a ref or check `state` transition).                                          | No command.        |
| P047-03 | AGENT       | Update `docs/analytics.md`                                           | Document conversion event tracking.                                                                                                   | None.              |

---

### Parent Task P048: Add Vercel Analytics (Optional)

- [ ] **P048** | Status: `PENDING`
      **Related File Paths:**
  - `apps/firm-website/package.json` (add `@vercel/analytics`)
  - `apps/firm-website/src/app/layout.tsx`

  **Definition of Done:**
  - `@vercel/analytics` is installed.
  - `Analytics` component from `@vercel/analytics` is added to the root layout.
  - Web Vitals are visible in the Vercel dashboard.
  - **Note:** This is optional and can be deferred. Vercel Analytics is free on the Pro plan.

  **Out of Scope:**
  - Custom event tracking with Vercel Analytics.

  **Rules to Follow:**
  - Import `Analytics` from `@vercel/analytics/react`.
  - Render the component in the root layout.
  - It automatically detects the environment and only loads in production.

  **Advanced Coding Pattern:**
  - **Deep module** – Vercel Analytics is a separate provider that doesn't interfere with the rest of the app.

  **Anti‑Patterns:**
  - None.

  **Imports/Exports:**
  - `app/layout.tsx` imports and renders `Analytics`.

  **Depends On / Blocks:**
  - Depends on: None.
  - Blocks: None.

#### Subtasks

| ID      | Agent/Human | File Path / Command                    | Description                                                                                            | Validation Command                      |
| ------- | ----------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------- |
| P048-01 | AGENT       | `apps/firm-website` (install)          | Run: `pnpm --filter @repo/firm-website add @vercel/analytics`.                                         | `pnpm list @vercel/analytics` shows it. |
| P048-02 | AGENT       | `apps/firm-website/src/app/layout.tsx` | Import `Analytics` from `@vercel/analytics/react` and render it in the root layout (after `children`). | No command.                             |
| P048-03 | AGENT       | Update `docs/analytics.md`             | Document Vercel Analytics setup.                                                                       | None.                                   |

---

### Parent Task P049: Update Documentation

- [ ] **P049** | Status: `PENDING`
      **Related File Paths:**
  - `README.md` (root)
  - `docs/forms.md`
  - `docs/analytics.md`
  - `docs/architecture.md`
  - `docs/development.md`

  **Definition of Done:**
  - All docs are updated to reflect Phase 5 additions.
  - `docs/forms.md` covers:
    - `useActionState` pattern
    - `useFormStatus` for submit buttons
    - Toast notifications with `sonner`
    - Email sending with Resend
  - `docs/analytics.md` covers:
    - GA4 setup
    - Page view tracking
    - Conversion event tracking
    - Vercel Analytics (if added)
  - `README.md` includes Phase 5 status and links to docs.

  **Out of Scope:**
  - None.

  **Rules to Follow:**
  - Keep docs up‑to‑date.
  - Use clear, concise language.

  **Advanced Coding Pattern:**
  - N/A.

  **Anti‑Patterns:**
  - Outdated documentation.

  **Depends On / Blocks:**
  - Depends on: P042–P048.
  - Blocks: None.

#### Subtasks

| ID      | Agent/Human | File Path / Command    | Description                                                                                                                                                                                                    | Validation Command |
| ------- | ----------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| P049-01 | AGENT       | `README.md`            | Update with Phase 5 status, add links to docs.                                                                                                                                                                 | Manual check.      |
| P049-02 | AGENT       | `docs/forms.md`        | Write complete documentation: <br> - `useActionState` pattern <br> - `useFormStatus` for submit buttons <br> - Toast notifications with `sonner` <br> - Email sending with Resend <br> - Environment variables | Manual check.      |
| P049-03 | AGENT       | `docs/analytics.md`    | Write complete documentation: <br> - GA4 setup <br> - Page view tracking <br> - Conversion event tracking <br> - Vercel Analytics (if added)                                                                   | Manual check.      |
| P049-04 | AGENT       | `docs/architecture.md` | Update with Phase 5 additions (form architecture, analytics architecture).                                                                                                                                     | Manual check.      |

---

## Summary of Phase 5

Phase 5 consists of 8 parent tasks (P042–P049) and numerous subtasks. The goal is to complete the contact form with email sending, add toast notifications for user feedback, implement analytics tracking with GA4, and ensure all documentation is up‑to‑date.

**Key Deliverables:**

- Email sending with Resend (free tier: 3,000 emails/month)
- React 19 `useActionState` form with loading states
- Toast notifications with `sonner`
- Google Analytics 4 (GA4) with page view tracking
- Form submission conversion events
- Vercel Analytics (optional)
- Complete documentation

**Form UX Flow:**

1. User fills out the form
2. Client‑side validation (optional, but recommended for UX)
3. Server Action validates with Zod
4. Email is sent via Resend
5. Success toast is shown
6. Form is reset
7. GA4 conversion event is triggered

**Analytics Flow:**

1. GA4 script loads on page load
2. Page view tracked on initial load and route changes
3. Form submissions tracked as conversion events

---

## Phase 6: Testing & Quality Assurance – Task List

This document defines all tasks required to implement comprehensive testing across the monorepo, including unit tests, component tests, E2E tests, and visual regression testing. All tasks are designed to be **SMALL**, actionable, and built with **SDD, DDD, TDD, BDD**, and **Deep Modules** in mind.

---

### Phase 6 Overview

**Objective:** Achieve comprehensive test coverage across all code in the monorepo, including utilities, components, pages, and critical user journeys.

**Key Decisions (from research and analysis):**

- **Vitest** for unit and component tests (jsdom environment)
- **Playwright** for E2E tests (critical user journeys)
- **Storybook + Chromatic** for visual regression testing
- **Colocated tests** – test files live next to the code they test
- **Shared test utilities** in `packages/test-utils`
- **80% coverage threshold** enforced in CI
- **PR-based CI trigger** – tests run on PRs to main only
- **No MSW** – no external API calls to mock

---

### Parent Task P050: Set Up Shared Test Utilities Package

- [ ] **P050** | Status: `PENDING`
      **Related File Paths:**
  - `packages/test-utils/package.json`
  - `packages/test-utils/src/index.ts`
  - `packages/test-utils/src/test-utils.tsx`
  - `packages/test-utils/src/mocks.ts`

  **Definition of Done:**
  - `packages/test-utils` is created as a shared test utilities package.
  - It exports `renderWithProviders` (wrapper for ThemeProvider, etc.).
  - It exports common mocks (e.g., `mockNextNavigation`, `mockResend`).
  - It exports test helpers (e.g., `waitForLoading`, `fillForm`, etc.).
  - All apps (`firm-website`, `ui`) import from `@repo/test-utils` in their tests.

  **Out of Scope:**
  - Writing actual tests – that will be done in P051–P058.

  **Rules to Follow:**
  - Use `@repo/test-utils` as the package name.
  - All utilities should be framework-agnostic (work with Vitest and React Testing Library).
  - Export a single entry point (`src/index.ts`).

  **Advanced Coding Pattern:**
  - **Deep module** – test utilities abstract common test setup patterns.

  **Anti‑Patterns:**
  - Duplicating test utilities across apps.
  - Adding framework-specific imports in shared utilities.

  **Imports/Exports:**
  - `packages/test-utils/src/index.ts` exports all utilities.

  **Depends On / Blocks:**
  - Depends on: P001 (monorepo structure).
  - Blocks: P051–P058 (testing tasks).

#### Subtasks

| ID      | Agent/Human | File Path / Command                      | Description                                                                                                                                                                                     | Validation Command    |
| ------- | ----------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| P050-01 | AGENT       | `packages/test-utils/package.json`       | Create `package.json` with `name: "@repo/test-utils"`, `version: "0.0.0"`, `private: true`, `main: "src/index.ts"`, `types: "src/index.ts"`.                                                    | File exists.          |
| P050-02 | AGENT       | `packages/test-utils/src/index.ts`       | Create entry point exporting all utilities.                                                                                                                                                     | No command.           |
| P050-03 | AGENT       | `packages/test-utils/src/test-utils.tsx` | Create `renderWithProviders` wrapper: renders components with `ThemeProvider` and other required providers.                                                                                     | No command.           |
| P050-04 | AGENT       | `packages/test-utils/src/mocks.ts`       | Create common mocks: <br> - `mockNextNavigation()` – mocks `usePathname`, `useRouter` <br> - `mockResend()` – mocks Resend email sending <br> - `mockUseActionState()` – mocks `useActionState` | No command.           |
| P050-05 | AGENT       | `packages/test-utils/tsconfig.json`      | Create TypeScript configuration extending `@repo/typescript-config/base.json`.                                                                                                                  | No command.           |
| P050-06 | AGENT       | `apps/firm-website/package.json`         | Add `@repo/test-utils` as a dev dependency: `"@repo/test-utils": "workspace:*"`.                                                                                                                | `pnpm list` shows it. |
| P050-07 | AGENT       | Update `docs/testing.md`                 | Document the shared test utilities package.                                                                                                                                                     | None.                 |

---

### Parent Task P051: Write Unit Tests for Utility Functions

- [ ] **P051** | Status: `PENDING`
      **Related File Paths:**
  - `apps/firm-website/src/lib/content.test.ts`
  - `apps/firm-website/src/lib/navigation.test.ts`
  - `packages/lib/src/**/*.test.ts`

  **Definition of Done:**
  - All utility functions have unit tests:
    - `getAllContent`, `getContentBySlug`, `getAllSlugs` (content.ts)
    - `getNavItems`, `getBreadcrumbs`, `getRelatedContent` (navigation.ts)
    - Any other utilities in `packages/lib`
  - Tests cover success and error cases (file not found, invalid data).
  - Tests run and pass with Vitest.
  - Coverage is tracked for these files.

  **Out of Scope:**
  - Testing React components – will be done in P052–P053.

  **Rules to Follow:**
  - Use `describe`/`it` blocks.
  - Use `vi.mock` for mocking `fs` and `path` modules.
  - Test edge cases (empty arrays, missing files, etc.).
  - Test files should be colocated with the code they test (`lib/content.test.ts` next to `lib/content.ts`).

  **Advanced Coding Pattern:**
  - **Deep module** – tests verify the public API, not internal implementation.

  **Anti‑Patterns:**
  - Testing implementation details.
  - Not mocking dependencies.

  **Imports/Exports:**
  - Each test file imports functions from the file it tests.

  **Depends On / Blocks:**
  - Depends on: P050 (test utilities).
  - Blocks: None.

#### Subtasks

| ID      | Agent/Human | File Path / Command                            | Description                                                                                                                                                                    | Validation Command                                      |
| ------- | ----------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------- |
| P051-01 | AGENT       | `apps/firm-website/src/lib/content.test.ts`    | Write unit tests for `getAllContent`: <br> - Returns array of content entries <br> - Returns empty array when directory is empty <br> - Handles invalid file format gracefully | `pnpm --filter @repo/firm-website test -- content.test` |
| P051-02 | AGENT       | `apps/firm-website/src/lib/content.test.ts`    | Write unit tests for `getContentBySlug`: <br> - Returns correct content for valid slug <br> - Returns `null` for invalid slug <br> - Handles missing file                      | Same as above.                                          |
| P051-03 | AGENT       | `apps/firm-website/src/lib/content.test.ts`    | Write unit tests for `getAllSlugs`: <br> - Returns array of slugs <br> - Returns empty array for empty directory                                                               | Same as above.                                          |
| P051-04 | AGENT       | `apps/firm-website/src/lib/navigation.test.ts` | Write unit tests for `getNavItems`: <br> - Returns array of nav items with correct structure <br> - Each item has `label` and `href`                                           | `pnpm --filter @repo/firm-website test -- navigation`   |
| P051-05 | AGENT       | `apps/firm-website/src/lib/navigation.test.ts` | Write unit tests for `getBreadcrumbs`: <br> - Returns breadcrumb array for valid path <br> - Returns empty array for invalid path                                              | Same as above.                                          |
| P051-06 | AGENT       | Update `docs/testing.md`                       | Document utility testing approach and coverage.                                                                                                                                | None.                                                   |

---

### Parent Task P052: Write Component Tests for UI Components (`@repo/ui`)

- [ ] **P052** | Status: `PENDING`
      **Related File Paths:**
  - `packages/ui/src/components/**/*.test.tsx`

  **Definition of Done:**
  - All UI components in `@repo/ui` have component tests:
    - Button, Card, Container, Section
    - Header, Footer, NavLink, MobileMenu
    - Input, Textarea, Label, Form components
    - Accordion
    - ThemeToggle
  - Tests cover rendering, props, variants, and user interactions (where applicable).
  - Tests run and pass with Vitest + React Testing Library.
  - Coverage is tracked for these components.

  **Out of Scope:**
  - Testing feature components (in `apps/firm-website`) – will be done in P053.

  **Rules to Follow:**
  - Use `render` from `@testing-library/react`.
  - Use `screen` for queries.
  - Use `userEvent` or `fireEvent` for interactions.
  - Use `renderWithProviders` from `@repo/test-utils` for components that need providers.
  - Test files should be colocated (`button.test.tsx` next to `button.tsx`).

  **Advanced Coding Pattern:**
  - **Deep module** – tests verify component behavior from the user's perspective.

  **Anti‑Patterns:**
  - Testing implementation details (CSS classes, internal state).
  - Not testing user interactions.

  **Imports/Exports:**
  - Each test file imports the component and testing utilities.

  **Depends On / Blocks:**
  - Depends on: P018-VITEST (Vitest setup for packages/ui), P050 (test utilities).
  - Blocks: None.

#### Subtasks

| ID      | Agent/Human | File Path / Command                                 | Description                                                                                                                                                                         | Validation Command                              |
| ------- | ----------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| P052-01 | AGENT       | `packages/ui/src/components/ui/button.test.tsx`     | Write tests for Button: <br> - Renders with correct text <br> - Applies variant classes (primary, secondary, outline) <br> - Handles click events <br> - Supports `asChild` pattern | `pnpm --filter @repo/ui test -- button.test`    |
| P052-02 | AGENT       | `packages/ui/src/components/ui/card.test.tsx`       | Write tests for Card: <br> - Renders with children <br> - Applies className prop <br> - CardHeader, CardContent, CardFooter render correctly                                        | `pnpm --filter @repo/ui test -- card.test`      |
| P052-03 | AGENT       | `packages/ui/src/components/ui/container.test.tsx`  | Write tests for Container: <br> - Renders with children <br> - Applies maxWidth variants <br> - Applies className prop                                                              | `pnpm --filter @repo/ui test -- container.test` |
| P052-04 | AGENT       | `packages/ui/src/components/layout/header.test.tsx` | Write tests for Header: <br> - Renders with nav items <br> - Shows/hides mobile menu on button click <br> - Uses `renderWithProviders`                                              | `pnpm --filter @repo/ui test -- header.test`    |
| P052-05 | AGENT       | `packages/ui/src/components/layout/footer.test.tsx` | Write tests for Footer: <br> - Renders with nav items, contact info, social links <br> - Shows copyright notice                                                                     | `pnpm --filter @repo/ui test -- footer.test`    |
| P052-06 | AGENT       | `packages/ui/src/components/ui/input.test.tsx`      | Write tests for Input: <br> - Renders with label <br> - Handles onChange <br> - Shows error state                                                                                   | `pnpm --filter @repo/ui test -- input.test`     |
| P052-07 | AGENT       | `packages/ui/src/components/ui/accordion.test.tsx`  | Write tests for Accordion: <br> - Renders items <br> - Expands/collapses on click <br> - Supports single and multiple mode                                                          | `pnpm --filter @repo/ui test -- accordion.test` |
| P052-08 | AGENT       | Update `docs/testing.md`                            | Document UI component testing approach.                                                                                                                                             | None.                                           |

---

### Parent Task P053: Write Component Tests for Feature Components

- [ ] **P053** | Status: `PENDING`
      **Related File Paths:**
  - `apps/firm-website/src/components/features/**/*.test.tsx`

  **Definition of Done:**
  - All feature components have component tests:
    - Homepage sections (Hero, Pillars, DemoPreview, HowItWorks, FAQSnippet, FinalCTA)
    - ServicesHub, ServiceDetail
    - IndustriesHub, IndustryDetail
    - DemosHub, DemoDetail
    - FAQHub, FAQAccordion
    - ContactForm
  - Tests cover rendering and integration with content utilities.
  - Tests use `renderWithProviders` from `@repo/test-utils`.
  - Tests run and pass with Vitest + React Testing Library.

  **Out of Scope:**
  - E2E testing – will be done in P056–P058.

  **Rules to Follow:**
  - Use `renderWithProviders` for components that use `useActionState` or `next/navigation`.
  - Mock content utilities (`vi.mock('@/lib/content')`).
  - Test loading and error states (where applicable).

  **Advanced Coding Pattern:**
  - **Deep module** – tests focus on component behavior and integration, not implementation details.

  **Anti‑Patterns:**
  - Not mocking dependencies.
  - Testing too much in a single test.

  **Imports/Exports:**
  - Each test file imports the component and testing utilities.

  **Depends On / Blocks:**
  - Depends on: P050 (test utilities), P051 (utility tests).
  - Blocks: None.

#### Subtasks

| ID      | Agent/Human | File Path / Command                                                        | Description                                                                                                                                           | Validation Command                                      |
| ------- | ----------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| P053-01 | AGENT       | `apps/firm-website/src/components/features/home/hero.test.tsx`             | Write tests for Hero: <br> - Renders headline and subheadline <br> - CTA buttons link to correct pages                                                | `pnpm --filter @repo/firm-website test -- hero`         |
| P053-02 | AGENT       | `apps/firm-website/src/components/features/home/pillars.test.tsx`          | Write tests for Pillars: <br> - Renders all three pillars <br> - Links to correct pages                                                               | `pnpm --filter @repo/firm-website test -- pillars`      |
| P053-03 | AGENT       | `apps/firm-website/src/components/features/home/demo-preview.test.tsx`     | Write tests for DemoPreview: <br> - Fetches demos from content utilities <br> - Renders demo cards <br> - Handles empty state                         | `pnpm --filter @repo/firm-website test -- demo-preview` |
| P053-04 | AGENT       | `apps/firm-website/src/components/features/services/services-hub.test.tsx` | Write tests for ServicesHub: <br> - Fetches services from content utilities <br> - Renders service cards <br> - Handles empty state                   | `pnpm --filter @repo/firm-website test -- services-hub` |
| P053-05 | AGENT       | `apps/firm-website/src/components/features/contact/contact-form.test.tsx`  | Write tests for ContactForm: <br> - Renders all fields <br> - Submits with Server Action <br> - Shows loading state <br> - Shows success/error toasts | `pnpm --filter @repo/firm-website test -- contact-form` |
| P053-06 | AGENT       | Update `docs/testing.md`                                                   | Document feature component testing approach.                                                                                                          | None.                                                   |

---

### Parent Task P054: Write Server Action Tests

- [ ] **P054** | Status: `PENDING`
      **Related File Paths:**
  - `apps/firm-website/src/app/actions/contact.test.ts`

  **Definition of Done:**
  - Server Action tests cover:
    - `submitContact` – validation success
    - `submitContact` – validation failure (invalid email, missing fields)
    - `submitContact` – email send success
    - `submitContact` – email send failure
  - Tests run with Vitest (Server Actions are just async functions).
  - Tests do not make real API calls (Resend is mocked).

  **Out of Scope:**
  - E2E tests for form submission – will be done in P057.

  **Rules to Follow:**
  - Use `vi.mock` for Resend.
  - Use Zod's `safeParse` for validation tests.
  - Test both success and error paths.

  **Advanced Coding Pattern:**
  - **Deep module** – tests verify the Server Action's behavior without needing the client.

  **Anti‑Patterns:**
  - Making real API calls in tests.
  - Not testing validation errors.

  **Imports/Exports:**
  - `contact.test.ts` imports `submitContact` from `@/app/actions/contact`.

  **Depends On / Blocks:**
  - Depends on: P050 (test utilities), P042 (email sending).
  - Blocks: None.

#### Subtasks

| ID      | Agent/Human | File Path / Command                                 | Description                                                  | Validation Command                                      |
| ------- | ----------- | --------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------- |
| P054-01 | AGENT       | `apps/firm-website/src/app/actions/contact.test.ts` | Write test: valid form submission sends email successfully.  | `pnpm --filter @repo/firm-website test -- contact.test` |
| P054-02 | AGENT       | `apps/firm-website/src/app/actions/contact.test.ts` | Write test: invalid email returns validation error.          | Same as above.                                          |
| P054-03 | AGENT       | `apps/firm-website/src/app/actions/contact.test.ts` | Write test: missing required field returns validation error. | Same as above.                                          |
| P054-04 | AGENT       | `apps/firm-website/src/app/actions/contact.test.ts` | Write test: Resend failure returns error state.              | Same as above.                                          |
| P054-05 | AGENT       | Update `docs/testing.md`                            | Document Server Action testing approach.                     | None.                                                   |

---

### Parent Task P055: Write Content Utility Integration Tests

- [ ] **P055** | Status: `PENDING`
      **Related File Paths:**
  - `apps/firm-website/src/lib/content.integration.test.ts`

  **Definition of Done:**
  - Integration tests verify that content utilities work with real files:
    - `getAllContent` reads all services, industries, demos, FAQs, pages
    - `getContentBySlug` reads specific files
    - `getAllSlugs` returns all slugs
    - Metadata is correctly parsed from MDX files
  - Tests use real content files (not mocks).
  - Tests run with Vitest.

  **Out of Scope:**
  - Testing React components.

  **Rules to Follow:**
  - Use real `fs` and `path` (no mocking).
  - Use `__dirname` to resolve paths to `src/content/`.
  - Verify both success and error cases.

  **Advanced Coding Pattern:**
  - **Deep module** – integration tests verify the content pipeline end‑to‑end.

  **Anti‑Patterns:**
  - Using mocked content in integration tests (defeats the purpose).

  **Imports/Exports:**
  - `content.integration.test.ts` imports functions from `@/lib/content`.

  **Depends On / Blocks:**
  - Depends on: P021 (content utilities).
  - Blocks: None.

#### Subtasks

| ID      | Agent/Human | File Path / Command                                     | Description                                                                                        | Validation Command                                             |
| ------- | ----------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| P055-01 | AGENT       | `apps/firm-website/src/lib/content.integration.test.ts` | Write test: `getAllContent('services')` returns all service MDX files.                             | `pnpm --filter @repo/firm-website test -- content.integration` |
| P055-02 | AGENT       | `apps/firm-website/src/lib/content.integration.test.ts` | Write test: `getContentBySlug('services', 'website-design')` returns correct metadata and content. | Same as above.                                                 |
| P055-03 | AGENT       | `apps/firm-website/src/lib/content.integration.test.ts` | Write test: `getAllSlugs('industries')` returns all industry slugs.                                | Same as above.                                                 |
| P055-04 | AGENT       | `apps/firm-website/src/lib/content.integration.test.ts` | Write test: metadata from MDX files is correctly parsed.                                           | Same as above.                                                 |
| P055-05 | AGENT       | Update `docs/testing.md`                                | Document integration testing approach.                                                             | None.                                                          |

---

### Parent Task P056: Write E2E Tests for Critical User Journeys

- [ ] **P056** | Status: `PENDING`
      **Related File Paths:**
  - `apps/firm-website/src/e2e/navigation.spec.ts`
  - `apps/firm-website/src/e2e/homepage.spec.ts`
  - `apps/firm-website/src/e2e/services.spec.ts`
  - `apps/firm-website/src/e2e/industries.spec.ts`

  **Definition of Done:**
  - E2E tests cover critical user journeys:
    - Homepage loads correctly
    - Navigation to all pages works (About, Pricing, Services, Industries, Demos, FAQ, Contact)
    - Services hub lists all services
    - Service detail pages load correctly
    - Industries hub lists all industries
    - Industry detail pages load correctly
    - Demos hub lists all demos
    - Demo detail pages load correctly
    - FAQ hub loads with accordions working
  - Tests run with Playwright against the production build.
  - Tests run in headless mode.
  - Tests pass in CI.

  **Out of Scope:**
  - Form submission tests – will be done in P057.

  **Rules to Follow:**
  - Use Playwright's `page.goto()` and `page.locator()`.
  - Use `expect` from `@playwright/test`.
  - Test actual page content (not just navigation).
  - Use the `webServer` feature to start the dev server.

  **Advanced Coding Pattern:**
  - **Deep module** – E2E tests verify the system from the user's perspective.

  **Anti‑Patterns:**
  - Not testing actual page content.
  - Tests that are too slow or flaky.

  **Imports/Exports:**
  - Each test file imports from `@playwright/test`.

  **Depends On / Blocks:**
  - Depends on: P029–P036 (page development).
  - Blocks: None.

#### Subtasks

| ID      | Agent/Human | File Path / Command                            | Description                                                  | Validation Command                                        |
| ------- | ----------- | ---------------------------------------------- | ------------------------------------------------------------ | --------------------------------------------------------- |
| P056-01 | AGENT       | `apps/firm-website/src/e2e/homepage.spec.ts`   | Write test: homepage loads, shows hero, CTA buttons work.    | `pnpm --filter @repo/firm-website test:e2e -- homepage`   |
| P056-02 | AGENT       | `apps/firm-website/src/e2e/navigation.spec.ts` | Write test: navigation to About page works.                  | `pnpm --filter @repo/firm-website test:e2e -- navigation` |
| P056-03 | AGENT       | `apps/firm-website/src/e2e/navigation.spec.ts` | Write test: navigation to Pricing page works.                | Same as above.                                            |
| P056-04 | AGENT       | `apps/firm-website/src/e2e/services.spec.ts`   | Write test: Services hub shows all services.                 | `pnpm --filter @repo/firm-website test:e2e -- services`   |
| P056-05 | AGENT       | `apps/firm-website/src/e2e/services.spec.ts`   | Write test: service detail page loads with correct content.  | Same as above.                                            |
| P056-06 | AGENT       | `apps/firm-website/src/e2e/industries.spec.ts` | Write test: Industries hub shows all industries.             | `pnpm --filter @repo/firm-website test:e2e -- industries` |
| P056-07 | AGENT       | `apps/firm-website/src/e2e/industries.spec.ts` | Write test: industry detail page loads with correct content. | Same as above.                                            |
| P056-08 | AGENT       | `apps/firm-website/src/e2e/demos.spec.ts`      | Write test: Demos hub shows all demos.                       | `pnpm --filter @repo/firm-website test:e2e -- demos`      |
| P056-09 | AGENT       | `apps/firm-website/src/e2e/demos.spec.ts`      | Write test: demo detail page loads with correct content.     | Same as above.                                            |
| P056-10 | AGENT       | `apps/firm-website/src/e2e/faq.spec.ts`        | Write test: FAQ hub loads with all FAQs, accordions work.    | `pnpm --filter @repo/firm-website test:e2e -- faq`        |
| P056-11 | AGENT       | Update `docs/testing.md`                       | Document E2E testing approach.                               | None.                                                     |

---

### Parent Task P057: Write E2E Tests for Contact Form Submission

- [ ] **P057** | Status: `PENDING`
      **Related File Paths:**
  - `apps/firm-website/src/e2e/contact-form.spec.ts`

  **Definition of Done:**
  - E2E tests cover contact form:
    - Form loads correctly
    - Validation errors appear for invalid input
    - Form submits successfully and shows success toast
    - Form handles server errors gracefully
  - Tests run with Playwright.
  - Tests use the real Server Action (no mocks).
  - Resend is mocked in E2E tests to avoid sending real emails.

  **Out of Scope:**
  - Testing email delivery – that's Resend's responsibility.

  **Rules to Follow:**
  - Use Playwright's `page.fill()`, `page.click()`, `page.waitFor()`.
  - Mock Resend in the test environment (via env var or Playwright route intercept).
  - Use the `webServer` feature to start the dev server.

  **Advanced Coding Pattern:**
  - **Deep module** – E2E tests verify the form submission flow end‑to‑end.

  **Anti‑Patterns:**
  - Sending real emails during tests.
  - Tests that are flaky due to slow API responses.

  **Imports/Exports:**
  - `contact-form.spec.ts` imports from `@playwright/test`.

  **Depends On / Blocks:**
  - Depends on: P036 (contact page), P042 (email sending).
  - Blocks: None.

#### Subtasks

| ID      | Agent/Human | File Path / Command                              | Description                                                | Validation Command                                          |
| ------- | ----------- | ------------------------------------------------ | ---------------------------------------------------------- | ----------------------------------------------------------- |
| P057-01 | AGENT       | `apps/firm-website/src/e2e/contact-form.spec.ts` | Write test: contact page loads with form fields.           | `pnpm --filter @repo/firm-website test:e2e -- contact-form` |
| P057-02 | AGENT       | `apps/firm-website/src/e2e/contact-form.spec.ts` | Write test: validation errors for invalid email.           | Same as above.                                              |
| P057-03 | AGENT       | `apps/firm-website/src/e2e/contact-form.spec.ts` | Write test: validation errors for missing required fields. | Same as above.                                              |
| P057-04 | AGENT       | `apps/firm-website/src/e2e/contact-form.spec.ts` | Write test: valid submission shows success toast.          | Same as above.                                              |
| P057-05 | AGENT       | `apps/firm-website/src/e2e/contact-form.spec.ts` | Write test: server error shows error toast.                | Same as above.                                              |
| P057-06 | AGENT       | Update `docs/testing.md`                         | Document E2E form testing approach.                        | None.                                                       |

---

### Parent Task P058: Configure Storybook for Visual Regression Testing

- [ ] **P058** | Status: `PENDING`
      **Related File Paths:**
  - `packages/ui/.storybook/main.ts`
  - `packages/ui/.storybook/preview.ts`
  - `packages/ui/src/**/*.stories.tsx`

  **Definition of Done:**
  - Storybook is configured and running in `packages/ui`.
  - Stories exist for all UI components:
    - Button, Card, Container, Section
    - Header, Footer, NavLink, MobileMenu
    - Input, Textarea, Label, Form components
    - Accordion
    - ThemeToggle
  - Stories cover all variants and states.
  - Storybook preview includes `ThemeProvider` for dark/light mode.
  - `package.json` has `storybook` and `storybook:build` scripts.
  - Stories are visible in the Storybook UI.

  **Out of Scope:**
  - Chromatic setup – will be done in P059.
  - Storybook for feature components – UI components only.

  **Rules to Follow:**
  - Use Storybook 8+ with Next.js integration.
  - Use `@storybook/nextjs` framework.
  - Place stories next to components (`button.stories.tsx` next to `button.tsx`).
  - Use `render` functions to showcase variants.

  **Advanced Coding Pattern:**
  - **Deep module** – Storybook provides a visual representation of the component library.

  **Anti‑Patterns:**
  - Stories that are too complex or include business logic.
  - Not covering all variants.

  **Imports/Exports:**
  - Each story file exports `default` (metadata) and named stories.

  **Depends On / Blocks:**
  - Depends on: P012–P016 (UI components).
  - Blocks: P059 (Chromatic).

#### Subtasks

| ID      | Agent/Human | File Path / Command                                    | Description                                                                                            | Validation Command                 |
| ------- | ----------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | ---------------------------------- |
| P058-01 | AGENT       | `packages/ui/.storybook/main.ts`                       | Configure Storybook to use Next.js framework.                                                          | No command.                        |
| P058-02 | AGENT       | `packages/ui/.storybook/preview.ts`                    | Configure preview with `ThemeProvider` for dark/light mode.                                            | No command.                        |
| P058-03 | AGENT       | `packages/ui/src/components/ui/button.stories.tsx`     | Write stories for Button: default, primary, secondary, outline, ghost, destructive, loading, disabled. | `pnpm --filter @repo/ui storybook` |
| P058-04 | AGENT       | `packages/ui/src/components/ui/card.stories.tsx`       | Write stories for Card: default, with header, with footer, with image.                                 | Same as above.                     |
| P058-05 | AGENT       | `packages/ui/src/components/ui/container.stories.tsx`  | Write stories for Container: small, medium, large, full width.                                         | Same as above.                     |
| P058-06 | AGENT       | `packages/ui/src/components/layout/header.stories.tsx` | Write stories for Header: with nav items, mobile view.                                                 | Same as above.                     |
| P058-07 | AGENT       | `packages/ui/src/components/layout/footer.stories.tsx` | Write stories for Footer: default, with social links.                                                  | Same as above.                     |
| P058-08 | AGENT       | `packages/ui/src/components/ui/input.stories.tsx`      | Write stories for Input: default, error, disabled, with label.                                         | Same as above.                     |
| P058-09 | AGENT       | `packages/ui/src/components/ui/accordion.stories.tsx`  | Write stories for Accordion: default, with multiple items, with custom content.                        | Same as above.                     |
| P058-10 | AGENT       | Update `docs/testing.md`                               | Document Storybook setup.                                                                              | None.                              |

---

### Parent Task P059: Set Up Chromatic Visual Regression Testing

- [ ] **P059** | Status: `PENDING`
      **Related File Paths:**
  - `.github/workflows/chromatic.yml`
  - `packages/ui/package.json` (chromatic script)

  **Definition of Done:**
  - Chromatic is configured for visual regression testing.
  - GitHub Actions workflow runs Chromatic on every PR to main.
  - Chromatic captures snapshots of all Storybook stories.
  - PRs show Chromatic diffs as comments.
  - The project token is stored as a GitHub secret.

  **Out of Scope:**
  - None.

  **Rules to Follow:**
  - Use `npx chromatic` to run Chromatic.
  - Only run on PRs to main (not on every push).
  - Use `--exit-zero-on-changes` to avoid failing CI on visual diffs.
  - Use `--auto-accept-changes` for the first run.

  **Advanced Coding Pattern:**
  - **Deep module** – visual regression testing is a separate CI step.

  **Anti‑Patterns:**
  - Not setting up GitHub secrets.
  - Running Chromatic on every push (costly).

  **Imports/Exports:**
  - `.github/workflows/chromatic.yml` defines the workflow.

  **Depends On / Blocks:**
  - Depends on: P058 (Storybook).
  - Blocks: None.

#### Subtasks

| ID      | Agent/Human | File Path / Command               | Description                                                                                                                                                            | Validation Command |
| ------- | ----------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| P059-01 | HUMAN       | Chromatic account setup           | Create Chromatic account, add project, get project token.                                                                                                              | Token saved.       |
| P059-02 | HUMAN       | GitHub secret setup               | Add `CHROMATIC_PROJECT_TOKEN` to GitHub repository secrets.                                                                                                            | Secret exists.     |
| P059-03 | AGENT       | `packages/ui/package.json`        | Add script: `"chromatic": "npx chromatic --project-token=$CHROMATIC_PROJECT_TOKEN"`.                                                                                   | No command.        |
| P059-04 | AGENT       | `.github/workflows/chromatic.yml` | Create GitHub Actions workflow: <br> 1. Runs on PR to main <br> 2. Sets up Node.js, pnpm <br> 3. Installs dependencies <br> 4. Builds Storybook <br> 5. Runs Chromatic | Workflow exists.   |
| P059-05 | AGENT       | `.github/workflows/chromatic.yml` | Configure Chromatic: `--exit-zero-on-changes` to avoid failing CI on visual diffs (approval required).                                                                 | Workflow exists.   |
| P059-06 | AGENT       | Update `docs/testing.md`          | Document Chromatic visual regression testing.                                                                                                                          | None.              |

---

### Parent Task P060: Configure CI Test Pipeline with GitHub Actions

- [ ] **P060** | Status: `PENDING`
      **Related File Paths:**
  - `.github/workflows/ci.yml`
  - `.github/workflows/test.yml`

  **Definition of Done:**
  - GitHub Actions workflow runs tests on every PR to main.
  - Tests run in parallel (or using Turborepo's caching).
  - Coverage report is generated.
  - Test results are visible in the PR.
  - The workflow fails if tests fail.

  **Out of Scope:**
  - Deploying on test success – deployment is handled by Vercel.

  **Rules to Follow:**
  - Use `pnpm` for all commands.
  - Use Turborepo's cache for faster runs.
  - Run `pnpm test` (unit + component tests) and `pnpm test:e2e` (E2E) in parallel.
  - Run `pnpm lint` and `pnpm typecheck` as part of CI.
  - Set coverage threshold to 80%.

  **Advanced Coding Pattern:**
  - **Deep module** – CI pipeline is a separate concern from development.

  **Anti‑Patterns:**
  - Running tests in serial (slows down CI).
  - Not caching dependencies.

  **Imports/Exports:**
  - `.github/workflows/ci.yml` defines the workflow.

  **Depends On / Blocks:**
  - Depends on: P051–P058 (tests).
  - Blocks: None.

#### Subtasks

| ID      | Agent/Human | File Path / Command        | Description                                                                                                                                                                                                                                                                          | Validation Command |
| ------- | ----------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------ |
| P060-01 | AGENT       | `.github/workflows/ci.yml` | Create GitHub Actions workflow: <br> 1. Runs on PR to main <br> 2. Sets up Node.js, pnpm <br> 3. Installs dependencies <br> 4. Runs `pnpm lint` <br> 5. Runs `pnpm typecheck` <br> 6. Runs `pnpm test` (Vitest unit + component tests) <br> 7. Runs `pnpm test:e2e` (Playwright E2E) | Workflow exists.   |
| P060-02 | AGENT       | `.github/workflows/ci.yml` | Add Turborepo caching: use `actions/cache` to cache `.turbo` and `node_modules`.                                                                                                                                                                                                     | Workflow exists.   |
| P060-03 | AGENT       | `.github/workflows/ci.yml` | Add Playwright setup: `actions/playwright` to install browsers.                                                                                                                                                                                                                      | Workflow exists.   |
| P060-04 | AGENT       | `.github/workflows/ci.yml` | Set coverage threshold (if using coverage reporting).                                                                                                                                                                                                                                | Workflow exists.   |
| P060-05 | AGENT       | Update `docs/testing.md`   | Document CI pipeline setup.                                                                                                                                                                                                                                                          | None.              |

---

### Parent Task P061: Set Coverage Thresholds and Reporting

- [ ] **P061** | Status: `PENDING`
      **Related File Paths:**
  - `apps/firm-website/vitest.config.ts`
  - `packages/ui/vitest.config.ts`
  - `packages/lib/vitest.config.ts`

  **Definition of Done:**
  - Coverage thresholds are set to 80% across all packages.
  - Coverage reports are generated in `coverage/` directory.
  - CI fails if coverage drops below threshold.
  - Coverage is displayed in test output.

  **Out of Scope:**
  - Codecov integration (not needed for solo project).

  **Rules to Follow:**
  - Set `thresholds: { statements: 80, branches: 80, functions: 80, lines: 80 }`.
  - Use `vitest --coverage` to generate coverage reports.
  - Use `@vitest/coverage-v8` for coverage reporting.

  **Advanced Coding Pattern:**
  - **Deep module** – coverage thresholds enforce quality standards.

  **Anti‑Patterns:**
  - Not setting thresholds (no quality gate).
  - Setting thresholds too high (unachievable) or too low (pointless).

  **Imports/Exports:**
  - `vitest.config.ts` sets coverage configuration.

  **Depends On / Blocks:**
  - Depends on: P051–P058 (tests).
  - Blocks: None.

#### Subtasks

| ID      | Agent/Human | File Path / Command                  | Description                                                                                                                                                                              | Validation Command                        |
| ------- | ----------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| P061-01 | AGENT       | `apps/firm-website` (install)        | Run: `pnpm --filter @repo/firm-website add -D @vitest/coverage-v8`.                                                                                                                      | `pnpm list @vitest/coverage-v8` shows it. |
| P061-02 | AGENT       | `apps/firm-website/vitest.config.ts` | Add coverage configuration: <br> - `reporters: ['text', 'html']` <br> - `thresholds: { statements: 80, branches: 80, functions: 80, lines: 80 }` <br> - `reportsDirectory: './coverage'` | No command.                               |
| P061-03 | AGENT       | `apps/firm-website/package.json`     | Add script: `"test:coverage": "vitest run --coverage"`.                                                                                                                                  | No command.                               |
| P061-04 | AGENT       | `apps/firm-website/package.json`     | Add `test:coverage` to `test` script or run separately.                                                                                                                                  | No command.                               |
| P061-05 | AGENT       | `apps/firm-website/vitest.config.ts` | Set `exclude` to ignore test files, coverage, node_modules.                                                                                                                              | No command.                               |
| P061-06 | AGENT       | Update `docs/testing.md`             | Document coverage thresholds and reporting.                                                                                                                                              | None.                                     |

---

### Parent Task P062: Update Documentation

- [ ] **P062** | Status: `PENDING`
      **Related File Paths:**
  - `README.md` (root)
  - `docs/testing.md`
  - `docs/architecture.md`
  - `docs/development.md`

  **Definition of Done:**
  - All docs are updated to reflect Phase 6 additions.
  - `docs/testing.md` covers:
    - Testing stack (Vitest, Playwright, Storybook, Chromatic)
    - Unit testing approach (utilities, components, Server Actions)
    - E2E testing approach (critical journeys, form submissions)
    - Visual regression testing (Storybook + Chromatic)
    - CI pipeline
    - Coverage thresholds
  - `README.md` includes Phase 6 status and links to docs.
  - `docs/development.md` includes guide on writing tests.

  **Out of Scope:**
  - None.

  **Rules to Follow:**
  - Keep docs up‑to‑date.
  - Use clear, concise language.

  **Advanced Coding Pattern:**
  - N/A.

  **Anti‑Patterns:**
  - Outdated documentation.

  **Depends On / Blocks:**
  - Depends on: P050–P061.
  - Blocks: None.

#### Subtasks

| ID      | Agent/Human | File Path / Command    | Description                                                                                                                                                                                                                                                                                                                                      | Validation Command |
| ------- | ----------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------ |
| P062-01 | AGENT       | `README.md`            | Update with Phase 6 status, add links to docs.                                                                                                                                                                                                                                                                                                   | Manual check.      |
| P062-02 | AGENT       | `docs/testing.md`      | Write complete testing documentation: <br> - Testing stack overview <br> - Unit testing (Vitest) <br> - Component testing (React Testing Library) <br> - Server Action testing <br> - Integration testing <br> - E2E testing (Playwright) <br> - Visual regression testing (Storybook + Chromatic) <br> - CI pipeline <br> - Coverage thresholds | Manual check.      |
| P062-03 | AGENT       | `docs/development.md`  | Add guide: "How to write tests" covering the different test types.                                                                                                                                                                                                                                                                               | Manual check.      |
| P062-04 | AGENT       | `docs/architecture.md` | Update with testing architecture.                                                                                                                                                                                                                                                                                                                | Manual check.      |

---

## Summary of Phase 6

Phase 6 consists of 13 parent tasks (P050–P062) and numerous subtasks. The goal is to achieve comprehensive test coverage across the monorepo, with automated testing in CI.

**Key Deliverables:**

- Shared test utilities package (`@repo/test-utils`)
- Unit tests for all utility functions
- Component tests for all UI components (`@repo/ui`)
- Component tests for all feature components
- Server Action tests
- Content utility integration tests
- E2E tests for critical user journeys
- E2E tests for contact form submission
- Storybook stories for all components
- Chromatic visual regression testing in CI
- CI test pipeline with GitHub Actions
- Coverage thresholds set to 80%

**Test Coverage Summary:**

| Test Type           | Tool         | Target                 |
| ------------------- | ------------ | ---------------------- |
| Utilities           | Vitest       | 80%                    |
| UI Components       | Vitest + RTL | 80%                    |
| Feature Components  | Vitest + RTL | 80%                    |
| Server Actions      | Vitest       | 80%                    |
| Content Integration | Vitest       | 100% (critical)        |
| E2E                 | Playwright   | Critical journeys only |
| Visual Regression   | Chromatic    | All components         |

---

## Phase 7: Final Polish & Launch – Task List

This document defines all tasks required to prepare the website for production launch, including security hardening, monitoring setup, production verification, and the launch itself. All tasks are designed to be **SMALL**, actionable, and built with **SDD, DDD, TDD, BDD**, and **Deep Modules** in mind.

---

### Phase 7 Overview

**Objective:** Prepare the website for production launch with security hardening, monitoring, performance verification, and deployment.

**Key Decisions (from research and analysis):**

- **Basic security headers** (Vary, HSTS, X-Frame-Options, etc.) – full CSP deferred to post-launch
- **Sentry** for error tracking (free tier: 5,000 errors/month)
- **Vercel Analytics** for Web Vitals monitoring
- **Environment variables** set in Vercel dashboard
- **Custom domain** configured via Vercel
- **Go/No-Go checklist** for final validation
- **Smoke testing** after deployment

---

### Parent Task P063: Implement Security Headers

- [ ] **P063** | Status: `PENDING`
      **Related File Paths:**
  - `apps/firm-website/next.config.ts`
  - `apps/firm-website/src/middleware.ts` (optional, for custom headers)

  **Definition of Done:**
  - Security headers are implemented in `next.config.ts`:
    - **Vary: RSC, Next-Router-State, Next-Router-Prefetch, Accept-Encoding** – critical for RSC CDN caching
    - **X-Frame-Options: SAMEORIGIN** – prevents clickjacking
    - **X-XSS-Protection: 1; mode=block** – enables browser XSS filtering
    - **X-Content-Type-Options: nosniff** – prevents MIME type sniffing
    - **Strict-Transport-Security: max-age=31536000; includeSubDomains; preload** – forces HTTPS
    - **Referrer-Policy: strict-origin-when-cross-origin** – controls referrer info
  - `poweredByHeader: false` is set in `next.config.ts`.
  - Headers are verified using curl or browser dev tools.

  **Out of Scope:**
  - Content Security Policy (CSP) – will be done in P064 (basic).

  **Rules to Follow:**
  - Use the `headers()` function in `next.config.ts`.
  - Apply headers to all routes (`source: "/:path*"`).
  - HSTS should only be enabled in production (check environment).

  **Advanced Coding Pattern:**
  - **Deep module** – security headers are a single source of truth in `next.config.ts`.

  **Anti‑Patterns:**
  - Not including the Vary header (causes RSC/CDN caching issues).
  - Setting HSTS in development (causes issues with localhost).

  **Imports/Exports:**
  - `next.config.ts` exports the Next.js config with headers.

  **Depends On / Blocks:**
  - Depends on: P002 (Next.js setup).
  - Blocks: None.

#### Subtasks

| ID      | Agent/Human | File Path / Command                | Description                                                                                                            | Validation Command   |
| ------- | ----------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------------------- |
| P063-01 | AGENT       | `apps/firm-website/next.config.ts` | Add `poweredByHeader: false` to remove `X-Powered-By` header.                                                          | No command.          |
| P063-02 | AGENT       | `apps/firm-website/next.config.ts` | Add `headers()` function with security headers for all routes (`source: "/:path*"`). Include all headers listed above. | No command.          |
| P063-03 | AGENT       | `apps/firm-website/next.config.ts` | Ensure HSTS is only applied in production environment (`process.env.NODE_ENV === 'production'`).                       | No command.          |
| P063-04 | AGENT       | Update `docs/security.md`          | Document the security headers and their purpose.                                                                       | None.                |
| P063-05 | HUMAN       | Verify headers                     | Deploy to preview environment and verify headers are present using browser dev tools or `curl -I`.                     | All headers present. |

---

### Parent Task P064: Implement Content Security Policy (Basic)

- [ ] **P064** | Status: `PENDING`
      **Related File Paths:**
  - `apps/firm-website/next.config.ts`

  **Definition of Done:**
  - A basic Content Security Policy is implemented:
    - `default-src 'self'`
    - `script-src 'self' 'unsafe-inline' 'unsafe-eval'` (required for Next.js/React in development; can be tightened later)
    - `style-src 'self' 'unsafe-inline'` (required for Tailwind CSS)
    - `img-src 'self' data: https:` (allows images from Vercel and external sources)
    - `font-src 'self' https:` (allows Google Fonts)
    - `connect-src 'self' https:`
    - `frame-ancestors 'none'` (prevents clickjacking)
    - `upgrade-insecure-requests`
  - CSP is applied as a header in `next.config.ts`.
  - CSP is verified using browser dev tools.

  **Out of Scope:**
  - Nonce-based CSP (requires `proxy.ts` and more complex setup) – will be deferred to post-launch.
  - Reporting endpoint for CSP violations – will be deferred.

  **Rules to Follow:**
  - Use `content-security-policy` header.
  - Use `'unsafe-inline'` and `'unsafe-eval'` sparingly (required for Next.js HMR and Tailwind).
  - Use `report-uri` for reporting (optional – defer).

  **Advanced Coding Pattern:**
  - **Deep module** – CSP is a single header in `next.config.ts`.

  **Anti‑Patterns:**
  - Using CSP with `'unsafe-inline'` in production without a plan to tighten it.
  - Not testing CSP thoroughly (breaks site functionality).

  **Imports/Exports:**
  - `next.config.ts` exports the Next.js config with CSP header.

  **Depends On / Blocks:**
  - Depends on: P063 (security headers).
  - Blocks: None.

#### Subtasks

| ID      | Agent/Human | File Path / Command                | Description                                                                                               | Validation Command             |
| ------- | ----------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------ |
| P064-01 | AGENT       | `apps/firm-website/next.config.ts` | Add CSP header to the `headers()` function with the policy defined above.                                 | No command.                    |
| P064-02 | AGENT       | `apps/firm-website/next.config.ts` | Ensure CSP allows all required sources: Google Fonts, Vercel assets, GA4 (if using), and the site itself. | No command.                    |
| P064-03 | AGENT       | Update `docs/security.md`          | Document the CSP policy and any sources that were allowed.                                                | None.                          |
| P064-04 | HUMAN       | Verify CSP                         | Deploy to preview environment and verify CSP is not breaking the site (all resources load).               | Site works, no CSP violations. |

---

### Parent Task P065: Set Up Sentry Error Tracking

- [ ] **P065** | Status: `PENDING`
      **Related File Paths:**
  - `apps/firm-website/package.json` (add `@sentry/nextjs`)
  - `apps/firm-website/sentry.client.config.ts`
  - `apps/firm-website/sentry.server.config.ts`
  - `apps/firm-website/sentry.edge.config.ts`
  - `apps/firm-website/next.config.ts` (Sentry integration)
  - `apps/firm-website/.env.example` (add Sentry DSN)

  **Definition of Done:**
  - Sentry is installed and configured in `apps/firm-website`.
  - Sentry DSN is configured in environment variables.
  - Sentry captures errors from:
    - Client-side React errors
    - Server-side errors
    - Server Actions
  - Source maps are uploaded on build.
  - Sentry is only enabled in production.

  **Out of Scope:**
  - Performance monitoring (Sentry Performance) – can be added later.
  - Custom error contexts and breadcrumbs – default is sufficient for launch.

  **Rules to Follow:**
  - Use `@sentry/nextjs` (official Next.js SDK).
  - Use `NEXT_PUBLIC_SENTRY_DSN` for the DSN.
  - Enable source maps in production builds.
  - Use `Sentry.init` in each config file.

  **Advanced Coding Pattern:**
  - **Deep module** – Sentry is a separate integration; errors are captured automatically.

  **Anti‑Patterns:**
  - Not uploading source maps (makes debugging hard).
  - Capturing too much data (privacy concerns).

  **Imports/Exports:**
  - `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts` initialize Sentry.

  **Depends On / Blocks:**
  - Depends on: P002 (Next.js setup).
  - Blocks: None.

#### Subtasks

| ID      | Agent/Human | File Path / Command                         | Description                                                                                                                 | Validation Command                   |
| ------- | ----------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| P065-01 | AGENT       | `apps/firm-website` (install)               | Run: `pnpm --filter @repo/firm-website add @sentry/nextjs`.                                                                 | `pnpm list @sentry/nextjs` shows it. |
| P065-02 | AGENT       | `apps/firm-website/sentry.client.config.ts` | Create Sentry client config: `Sentry.init({ dsn: process.env.NEXT_PUBLIC_SENTRY_DSN, environment: process.env.NODE_ENV })`. | No command.                          |
| P065-03 | AGENT       | `apps/firm-website/sentry.server.config.ts` | Create Sentry server config (same as client).                                                                               | No command.                          |
| P065-04 | AGENT       | `apps/firm-website/sentry.edge.config.ts`   | Create Sentry edge config (same as client).                                                                                 | No command.                          |
| P065-05 | AGENT       | `apps/firm-website/.env.example`            | Add: `NEXT_PUBLIC_SENTRY_DSN=https://xxxx@xxxx.ingest.sentry.io/xxxx`.                                                      | File updated.                        |
| P065-06 | AGENT       | `apps/firm-website/next.config.ts`          | Add Sentry configuration: `sentry: { hideSourceMaps: true, autoInstrumentServerFunctions: true }`.                          | No command.                          |
| P065-07 | AGENT       | Update `docs/monitoring.md`                 | Document Sentry setup and how to view errors.                                                                               | None.                                |

---

### Parent Task P066: Set Up Vercel Analytics (Web Vitals)

- [ ] **P066** | Status: `PENDING`
      **Related File Paths:**
  - `apps/firm-website/package.json` (add `@vercel/analytics`)
  - `apps/firm-website/src/app/layout.tsx` (add `Analytics` component)

  **Definition of Done:**
  - `@vercel/analytics` is installed.
  - `Analytics` component from `@vercel/analytics/react` is added to the root layout.
  - Web Vitals (LCP, FID, CLS, INP) are being collected and displayed in the Vercel dashboard.
  - Analytics only run in production.

  **Out of Scope:**
  - Custom event tracking – GA4 covers that (P047).

  **Rules to Follow:**
  - Import `Analytics` from `@vercel/analytics/react`.
  - Render the component in the root layout (after `children`).
  - Vercel Analytics is free on the Pro plan.

  **Advanced Coding Pattern:**
  - **Deep module** – Vercel Analytics is a separate provider that doesn't interfere with the rest of the app.

  **Anti‑Patterns:**
  - None.

  **Imports/Exports:**
  - `app/layout.tsx` imports and renders `Analytics`.

  **Depends On / Blocks:**
  - Depends on: P029 (root layout).
  - Blocks: None.

#### Subtasks

| ID      | Agent/Human | File Path / Command                    | Description                                                                                            | Validation Command                      |
| ------- | ----------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------- |
| P066-01 | AGENT       | `apps/firm-website` (install)          | Run: `pnpm --filter @repo/firm-website add @vercel/analytics`.                                         | `pnpm list @vercel/analytics` shows it. |
| P066-02 | AGENT       | `apps/firm-website/src/app/layout.tsx` | Import `Analytics` from `@vercel/analytics/react` and render it in the root layout (after `children`). | No command.                             |
| P066-03 | AGENT       | Update `docs/monitoring.md`            | Document Vercel Analytics setup.                                                                       | None.                                   |
| P066-04 | HUMAN       | Verify Web Vitals                      | Deploy to production and verify Web Vitals appear in the Vercel dashboard.                             | Web Vitals visible.                     |

---

### Parent Task P067: Configure Production Environment Variables

- [ ] **P067** | Status: `PENDING`
      **Related File Paths:**
  - Vercel Dashboard

  **Definition of Done:**
  - All required environment variables are set in Vercel production environment:
    - `NEXT_PUBLIC_SITE_URL` – production URL
    - `RESEND_API_KEY` – Resend API key
    - `CONTACT_EMAIL` – recipient email for contact form
    - `FROM_EMAIL` – sender email for contact form
    - `NEXT_PUBLIC_GA_MEASUREMENT_ID` – GA4 measurement ID
    - `NEXT_PUBLIC_SENTRY_DSN` – Sentry DSN
  - Preview environment variables are also set (or inherit from production).
  - All variables are verified.

  **Out of Scope:**
  - None.

  **Rules to Follow:**
  - Use Vercel Dashboard or Vercel CLI.
  - Sensitive variables should not be exposed in the client (not prefixed with `NEXT_PUBLIC`).

  **Advanced Coding Pattern:**
  - N/A.

  **Anti‑Patterns:**
  - Missing environment variables in production.
  - Using `.env.local` values in production.

  **Imports/Exports:**
  - N/A.

  **Depends On / Blocks:**
  - Depends on: P042 (Resend), P045 (GA4), P065 (Sentry).
  - Blocks: P073 (deployment).

#### Subtasks

| ID      | Agent/Human | File Path / Command          | Description                                                                                                                    | Validation Command              |
| ------- | ----------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------- |
| P067-01 | HUMAN       | Vercel Dashboard             | Go to Vercel project settings → Environment Variables. Add each variable listed above for Production and Preview environments. | All variables set.              |
| P067-02 | HUMAN       | Verify variables             | Deploy to preview and production, verify the app uses the correct variables.                                                   | App works in both environments. |
| P067-03 | AGENT       | Update `docs/environment.md` | Document all required environment variables and where they are set.                                                            | None.                           |

---

### Parent Task P068: Configure Custom Domain and SSL

- [ ] **P068** | Status: `PENDING`
      **Related File Paths:**
  - Vercel Dashboard
  - DNS provider dashboard

  **Definition of Done:**
  - Custom domain is configured in Vercel.
  - DNS records are updated (A/CNAME records).
  - SSL certificate is provisioned (auto‑managed by Vercel).
  - Both `yourdedicatedmarketer.com` and `www.yourdedicatedmarketer.com` are configured.
  - Redirect from `www` to `apex` (or vice versa) is set up.
  - Site loads correctly at the custom domain.

  **Out of Scope:**
  - Advanced DNS configurations (MX records, etc.).

  **Rules to Follow:**
  - Use Vercel's domain management.
  - Vercel auto‑renews Let's Encrypt certificates.
  - Set up redirects in Vercel if needed.

  **Advanced Coding Pattern:**
  - N/A.

  **Anti‑Patterns:**
  - Not setting up the `www` subdomain.
  - Not setting up SSL (Vercel does this automatically).

  **Imports/Exports:**
  - N/A.

  **Depends On / Blocks:**
  - Depends on: P007 (Vercel setup).
  - Blocks: P073 (deployment).

#### Subtasks

| ID      | Agent/Human | File Path / Command         | Description                                                                              | Validation Command     |
| ------- | ----------- | --------------------------- | ---------------------------------------------------------------------------------------- | ---------------------- |
| P068-01 | HUMAN       | Vercel Dashboard            | Go to Vercel project settings → Domains. Add `yourdedicatedmarketer.com`.                | Domain added.          |
| P068-02 | HUMAN       | Vercel Dashboard            | Add `www.yourdedicatedmarketer.com`.                                                     | Domain added.          |
| P068-03 | HUMAN       | DNS provider                | Update DNS records as instructed by Vercel (A record for apex, CNAME for www).           | DNS records updated.   |
| P068-04 | HUMAN       | Verify SSL                  | Wait for Vercel to provision SSL certificates (auto).                                    | Site loads with HTTPS. |
| P068-05 | HUMAN       | Set up redirect             | In Vercel, configure redirect from `www` to `apex` or vice versa (e.g., `www` → `apex`). | Redirect works.        |
| P068-06 | HUMAN       | Verify site                 | Visit `https://yourdedicatedmarketer.com` and verify the site loads correctly.           | Site loads.            |
| P068-07 | AGENT       | Update `docs/deployment.md` | Document the custom domain configuration.                                                | None.                  |

---

### Parent Task P069: Production Build Verification and Bundle Analysis

- [ ] **P069** | Status: `PENDING`
      **Related File Paths:**
  - `apps/firm-website/next.config.ts` (with `bundle-analyzer` optional)

  **Definition of Done:**
  - Production build (`pnpm build`) runs successfully without errors.
  - All pages are statically generated (verify with `next build` output).
  - Bundle size is analyzed and optimized:
    - First load JS under 200KB (critical)
    - Total bundle size under 300KB
  - No warnings about large dependencies.
  - `generateStaticParams` covers all dynamic routes.

  **Out of Scope:**
  - Advanced bundle optimization (code splitting is already handled by Next.js).

  **Rules to Follow:**
  - Use `next build` to generate the production build.
  - Use `next build --debug` or `ANALYZE=true` for bundle analysis (optional).
  - Check the build output for any warnings or errors.

  **Advanced Coding Pattern:**
  - **Deep module** – build verification is a one-time check before deployment.

  **Anti‑Patterns:**
  - Not checking bundle size before deployment.
  - Ignoring build warnings.

  **Imports/Exports:**
  - N/A.

  **Depends On / Blocks:**
  - Depends on: P029–P041 (all pages).
  - Blocks: P073 (deployment).

#### Subtasks

| ID      | Agent/Human | File Path / Command          | Description                                                                                                                                              | Validation Command     |
| ------- | ----------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| P069-01 | AGENT       | Local terminal               | Run `pnpm --filter @repo/firm-website build` and verify it completes without errors.                                                                     | Build succeeds.        |
| P069-02 | AGENT       | Build output                 | Check the `next build` output: verify all pages are listed as static (`○` or `●`) and there are no dynamic routes missing `generateStaticParams`.        | All pages are static.  |
| P069-03 | AGENT       | Bundle analysis              | Optionally install `@next/bundle-analyzer` and run `ANALYZE=true pnpm build` to visualize bundle size. If not, check the build output for size warnings. | First load JS < 200KB. |
| P069-04 | AGENT       | Update `docs/performance.md` | Document the bundle size and build verification results.                                                                                                 | None.                  |

---

### Parent Task P070: Lighthouse Audit and Final Performance Optimization

- [ ] **P070** | Status: `PENDING`
      **Related File Paths:**
  - All pages (audit across the entire app)

  **Definition of Done:**
  - Lighthouse scores are 90+ on all metrics for all pages (Performance, Accessibility, Best Practices, SEO).
  - Core Web Vitals pass thresholds (LCP < 2.5s, FID < 100ms, CLS < 0.1, INP < 200ms).
  - Any performance issues identified are fixed.
  - Screenshots of Lighthouse results are saved for documentation.

  **Out of Scope:**
  - None.

  **Rules to Follow:**
  - Run Lighthouse in Chrome DevTools on production or preview deployment.
  - Use an incognito window to avoid browser extension interference.
  - Run on both desktop and mobile (if applicable).

  **Advanced Coding Pattern:**
  - N/A.

  **Anti‑Patterns:**
  - Running Lighthouse on localhost (results differ from production).
  - Ignoring accessibility issues.

  **Imports/Exports:**
  - N/A.

  **Depends On / Blocks:**
  - Depends on: P069 (build verification).
  - Blocks: P073 (deployment).

#### Subtasks

| ID      | Agent/Human | File Path / Command          | Description                                                                                 | Validation Command |
| ------- | ----------- | ---------------------------- | ------------------------------------------------------------------------------------------- | ------------------ |
| P070-01 | HUMAN       | Lighthouse (Homepage)        | Run Lighthouse on the homepage. Record scores.                                              | Scores 90+.        |
| P070-02 | HUMAN       | Lighthouse (All pages)       | Run Lighthouse on About, Pricing, Services, Industries, Demos, FAQ, Contact. Record scores. | Scores 90+.        |
| P070-03 | AGENT       | Fix issues                   | If any scores are below 90, fix the issues (image optimization, font loading, etc.).        | Scores improve.    |
| P070-04 | AGENT       | Update `docs/performance.md` | Record Lighthouse scores and any optimizations made.                                        | None.              |

---

### Parent Task P071: Final Content and SEO Verification

- [ ] **P071** | Status: `PENDING`
      **Related File Paths:**
  - All content files (`src/content/**/*.mdx`)

  **Definition of Done:**
  - All content is reviewed and finalized:
    - Spelling and grammar checked
    - Links all work (internal and external)
    - Images have alt text
    - Metadata is complete (title, description, Open Graph)
  - JSON‑LD structured data is verified with Google's Rich Results Test.
  - Sitemap is verified with `sitemap.xml` tool.
  - robots.txt is verified.
  - Open Graph preview is verified (Facebook Sharing Debugger).

  **Out of Scope:**
  - None.

  **Rules to Follow:**
  - Use Google's Rich Results Test for JSON‑LD.
  - Use Facebook Sharing Debugger for Open Graph.
  - Use a sitemap validator for sitemap.xml.

  **Advanced Coding Pattern:**
  - N/A.

  **Anti‑Patterns:**
  - Not checking Open Graph images (they might not load).
  - Typos in metadata.

  **Imports/Exports:**
  - N/A.

  **Depends On / Blocks:**
  - Depends on: P022–P026 (content).
  - Blocks: P073 (deployment).

#### Subtasks

| ID      | Agent/Human | File Path / Command  | Description                                                             | Validation Command  |
| ------- | ----------- | -------------------- | ----------------------------------------------------------------------- | ------------------- |
| P071-01 | HUMAN       | Content review       | Review all content for spelling, grammar, and accuracy. Fix any issues. | No errors.          |
| P071-02 | HUMAN       | Link checking        | Check all internal and external links work.                             | No broken links.    |
| P071-03 | HUMAN       | Image alt text       | Ensure all images have descriptive alt text.                            | Alt text present.   |
| P071-04 | HUMAN       | Rich Results Test    | Use Google's Rich Results Test on a few pages to verify JSON‑LD.        | JSON‑LD valid.      |
| P071-05 | HUMAN       | sitemap.xml          | Visit `/sitemap.xml` and verify it contains all pages.                  | Sitemap complete.   |
| P071-06 | HUMAN       | robots.txt           | Visit `/robots.txt` and verify it allows all pages.                     | robots.txt correct. |
| P071-07 | HUMAN       | Open Graph preview   | Use Facebook Sharing Debugger to preview Open Graph tags.               | OG tags visible.    |
| P071-08 | AGENT       | Update `docs/seo.md` | Record the SEO verification results.                                    | None.               |

---

### Parent Task P072: Go/No-Go Decision Checklist

- [ ] **P072** | Status: `PENDING`
      **Related File Paths:**
  - `docs/go-no-go.md` (new file)

  **Definition of Done:**
  - A comprehensive Go/No-Go checklist is created.
  - All items on the checklist are verified and signed off.
  - A decision is made: GO (proceed with launch).

  **Out of Scope:**
  - None.

  **Rules to Follow:**
  - The checklist should be comprehensive and verifiable.
  - Each item should have a clear pass/fail criteria.

  **Advanced Coding Pattern:**
  - N/A.

  **Anti‑Patterns:**
  - Skipping items on the checklist.
  - Not verifying items properly.

  **Imports/Exports:**
  - `docs/go-no-go.md` is created.

  **Depends On / Blocks:**
  - Depends on: P063–P071.
  - Blocks: P073 (deployment).

#### Subtasks

| ID      | Agent/Human | File Path / Command | Description                                                                             | Validation Command   |
| ------- | ----------- | ------------------- | --------------------------------------------------------------------------------------- | -------------------- |
| P072-01 | AGENT       | `docs/go-no-go.md`  | Create the Go/No-Go checklist with all items from the definition of done.               | File exists.         |
| P072-02 | HUMAN       | Verify checklist    | Go through each item and verify it's completed. Mark each as PASS or FAIL.              | All items PASS.      |
| P072-03 | HUMAN       | Make decision       | Based on the checklist, decide to GO (proceed with launch) or NO-GO (fix issues first). | Decision documented. |

---

### Parent Task P073: Production Deployment and Smoke Testing

- [ ] **P073** | Status: `PENDING`
      **Related File Paths:**
  - Vercel Dashboard

  **Definition of Done:**
  - Production deployment is triggered (merge to main or manual deploy).
  - Deployment completes successfully.
  - Smoke tests are run on the production site:
    - Homepage loads
    - Navigation works
    - Contact form submits successfully
    - All dynamic routes load
    - Analytics events are sent
    - No console errors
  - Site is verified on the custom domain.

  **Out of Scope:**
  - None.

  **Rules to Follow:**
  - Use Vercel's production deployment.
  - Run smoke tests manually (or use Playwright).
  - Verify in both desktop and mobile viewports.

  **Advanced Coding Pattern:**
  - N/A.

  **Anti‑Patterns:**
  - Not running smoke tests after deployment.
  - Not verifying the custom domain.

  **Imports/Exports:**
  - N/A.

  **Depends On / Blocks:**
  - Depends on: P067 (env vars), P068 (custom domain), P072 (Go/No-Go).
  - Blocks: None.

#### Subtasks

| ID      | Agent/Human | File Path / Command         | Description                                                                                          | Validation Command          |
| ------- | ----------- | --------------------------- | ---------------------------------------------------------------------------------------------------- | --------------------------- |
| P073-01 | HUMAN       | Trigger deployment          | Merge the main branch (or trigger a manual deployment) on Vercel.                                    | Deployment starts.          |
| P073-02 | HUMAN       | Verify deployment           | Wait for the deployment to complete. Check Vercel dashboard for success.                             | Deployment succeeds.        |
| P073-03 | HUMAN       | Smoke test                  | Run through the site manually: homepage, navigation, services, industries, demos, FAQ, contact form. | All pages load, form works. |
| P073-04 | HUMAN       | Console errors              | Open browser dev tools and check for console errors on each page.                                    | No console errors.          |
| P073-05 | HUMAN       | Mobile view                 | Verify the site is responsive on mobile viewports.                                                   | Site is responsive.         |
| P073-06 | HUMAN       | Custom domain               | Verify the site loads at `https://yourdedicatedmarketer.com`.                                        | Site loads.                 |
| P073-07 | AGENT       | Update `docs/deployment.md` | Document the final production deployment and smoke test results.                                     | None.                       |

---

### Parent Task P074: Update Documentation and Create Launch README

- [ ] **P074** | Status: `PENDING`
      **Related File Paths:**
  - `README.md` (root)
  - `docs/launch.md` (new file)
  - `docs/security.md`
  - `docs/monitoring.md`
  - `docs/deployment.md`

  **Definition of Done:**
  - All docs are updated to reflect Phase 7 additions.
  - `docs/launch.md` is created with:
    - Launch date
    - Final checklist
    - Post-launch monitoring plan
  - `README.md` is updated with final production URL and status.
  - All documentation is reviewed and finalized.

  **Out of Scope:**
  - None.

  **Rules to Follow:**
  - Keep docs up‑to‑date.
  - Use clear, concise language.

  **Advanced Coding Pattern:**
  - N/A.

  **Anti‑Patterns:**
  - Outdated documentation.

  **Depends On / Blocks:**
  - Depends on: P063–P073.
  - Blocks: None.

#### Subtasks

| ID      | Agent/Human | File Path / Command  | Description                                                                                                               | Validation Command |
| ------- | ----------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| P074-01 | AGENT       | `docs/launch.md`     | Create the launch document with: <br> - Launch date <br> - Final checklist (from P072) <br> - Post-launch monitoring plan | File exists.       |
| P074-02 | AGENT       | `README.md`          | Update with final production URL, launch status, and links to all docs.                                                   | Manual check.      |
| P074-03 | AGENT       | `docs/security.md`   | Finalize security documentation.                                                                                          | Manual check.      |
| P074-04 | AGENT       | `docs/monitoring.md` | Finalize monitoring documentation.                                                                                        | Manual check.      |
| P074-05 | AGENT       | `docs/deployment.md` | Finalize deployment documentation.                                                                                        | Manual check.      |
| P074-06 | AGENT       | `docs/index.md`      | Create a documentation index page for easy navigation.                                                                    | Manual check.      |

---

### Parent Task P075: Post-Launch Monitoring Plan

- [ ] **P075** | Status: `PENDING`
      **Related File Paths:**
  - `docs/launch.md` (monitoring section)

  **Definition of Done:**
  - A post-launch monitoring plan is documented:
    - Monitoring Sentry for errors (daily)
    - Monitoring GA4 for traffic (weekly)
    - Monitoring Vercel Analytics for Core Web Vitals (weekly)
    - Monitoring contact form submissions (daily)
    - Monitoring uptime (using a service like Uptime Robot or Vercel Status)
  - Alerts are configured (if possible).

  **Out of Scope:**
  - None.

  **Rules to Follow:**
  - Monitoring should be documented and actionable.
  - Set specific times for monitoring (e.g., "Check Sentry every morning").

  **Advanced Coding Pattern:**
  - N/A.

  **Anti‑Patterns:**
  - Not monitoring after launch.
  - Not having a plan for handling issues.

  **Imports/Exports:**
  - N/A.

  **Depends On / Blocks:**
  - Depends on: P074 (documentation).
  - Blocks: None.

#### Subtasks

| ID      | Agent/Human | File Path / Command         | Description                                                                                                                                                                                                                                                                       | Validation Command |
| ------- | ----------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| P075-01 | AGENT       | `docs/launch.md`            | Add a detailed post-launch monitoring plan: <br> - Sentry: check daily for errors <br> - GA4: check weekly for traffic <br> - Vercel Analytics: check weekly for Core Web Vitals <br> - Contact form: check daily for submissions <br> - Uptime: set up monitoring (Uptime Robot) | Plan documented.   |
| P075-02 | AGENT       | `docs/launch.md`            | Document issue response plan: <br> - Critical error → immediate fix <br> - Minor error → fix within 24 hours <br> - Performance degradation → investigate within 48 hours                                                                                                         | Plan documented.   |
| P075-03 | AGENT       | Update `docs/monitoring.md` | Finalize monitoring documentation.                                                                                                                                                                                                                                                | Manual check.      |

---

## Summary of Phase 7

Phase 7 consists of 13 parent tasks (P063–P075) and numerous subtasks. The goal is to prepare the website for production launch with security hardening, monitoring, performance verification, and a comprehensive launch process.

**Key Deliverables:**

- Security headers (Vary, HSTS, X-Frame-Options, etc.)
- Basic Content Security Policy
- Sentry error tracking
- Vercel Analytics (Web Vitals)
- Production environment variables configured
- Custom domain configured
- Production build verification and bundle analysis
- Lighthouse audit (90+ scores)
- Final content and SEO verification
- Go/No-Go decision checklist
- Production deployment and smoke testing
- Complete documentation
- Post-launch monitoring plan

**Go/No-Go Criteria:**

| Criteria                                      | Status |
| --------------------------------------------- | ------ |
| All tests pass in CI                          | ✓      |
| Lighthouse scores ≥ 90                        | ✓      |
| Security headers implemented                  | ✓      |
| CSP implemented (basic)                       | ✓      |
| `metadataBase` set in root layout             | ✓      |
| All dynamic routes use `generateStaticParams` | ✓      |
| Contact form sends emails successfully        | ✓      |
| Analytics (GA4) tracking page views           | ✓      |
| Error tracking (Sentry) configured            | ✓      |
| Production environment variables set          | ✓      |
| Custom domain configured                      | ✓      |

---

**🎯 Launch Readiness:** Once all Phase 7 tasks are complete, the website will be fully ready for production launch. The final step is to execute the launch plan and begin monitoring.

---

_End of Document_
