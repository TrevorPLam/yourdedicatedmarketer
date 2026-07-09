# TODO — Your Dedicated Marketer Monorepo

Repository: `c:\Users\Trevor\Documents\firm`
Package manager: pnpm 9.15.0
Primary app: `apps/firm-website` (`@repo/firm-website`)

This document follows Specification-Driven Development (SDD), Domain-Driven Design (DDD), Test-Driven Development (TDD), Behavior-Driven Development (BDD), and the Deep Modules pattern. Each parent task is small, self-contained, and exposes a clear interface: definition of done, out of scope, rules, patterns, anti-patterns, and dependencies.

---

## Conventions

- **Task ID format:** `DOMAIN-NNN` for parent tasks, `DOMAIN-NNN-SS` for subtasks.
- **Status indicators:** `[PENDING]`, `[IN_PROGRESS]`, `[BLOCKED]`, `[DONE]`.
- **Actor labels:** `[AGENT]` = executable by the coding agent, `[HUMAN]` = requires human decision or input.
- **No emojis.** Use plain text markers only.
- **Validation commands** are targeted; prefer single test files or filtered checks over full suite runs.
- **Repository management documents** that still exist (`TODO.md`, `.devin/workflows/`, `.company/`) are updated as part of each task when the change affects onboarding, architecture, or deployment. The `docs/` directory and old `README.md` have been permanently deleted and must not be restored.

---

## Domains

- `FIX` — Critical fixes blocking CI or production.
- `ENV` — Environment variable validation and configuration.
- `CT` — Content domain (schemas, types, MDX frontmatter, rendering).
- `UI` — Component-level quality and behavior.
- `INF` — Infrastructure, CI/CD, and tooling.
- `DOC` — Documentation and repository management.

---

## Critical Path (must be completed in order)

1. `INF-006` upgrades pnpm to a supported, patched version (10.34.4+).
2. `INF-007` confirms Next.js is patched for CVE-2025-66478.
3. `FIX-001` unblocks `check-types`.
4. `INF-001` prevents future git noise.
5. `FIX-002` removes public test routes.
6. `CT-001` fixes the live FAQ rendering bug.
7. `DOC-001` commits the documentation deletion decision.

---

## INF-006 — Upgrade pnpm to 10.34.4+

- [x] `INF-006` — `[DONE]`

**Implementation notes**
- Updated `packageManager` to `pnpm@10.34.4` in package.json
- Updated `devEngines.packageManager.version` to `10.34.4` in package.json
- Updated CI workflow to use pnpm 10.34.4 in .github/workflows/ci.yml
- Regenerated lockfile with `pnpm install` (lockfileVersion updated to 9.0)
- All workspace scripts pass: check-types, test
- Security patches applied: GHSA-qrv3-253h-g69c, GHSA-fr4h-3cph-29xv

**Related file paths**

- `package.json`
- `pnpm-lock.yaml`
- `.github/workflows/ci.yml`

**Definition of done**

- `packageManager` is updated to `pnpm@10.34.4` (or latest supported 10.x patch).
- `devEngines.pnpm` is updated to match the new `packageManager` version.
- Lockfile is regenerated with `pnpm install` and all workspace scripts still pass.
- CI workflow uses the same pnpm version.

**Out of scope**

- Migrating to pnpm 11.x.
- Changing package manager.

**Validation commands**

```powershell
pnpm --version
pnpm install
pnpm turbo check-types
pnpm turbo test
```

---

## INF-007 — Verify Next.js patched for CVE-2025-66478

- [x] `INF-007` — `[DONE]`

**Implementation notes**
- Current Next.js version: 15.5.20 (from pnpm-lock.yaml)
- Minimum patched version for 15.5.x: 15.5.7
- Status: Already patched (15.5.20 > 15.5.7)
- No upgrade required

**Related file paths**

- `apps/firm-website/package.json`
- `pnpm-lock.yaml`

**Definition of done**

- `pnpm list next` reports a patched version (`15.5.7+` or the latest `15.5.x` / `16.x` patch).
- If not patched, upgrade to the latest patched version in the current release line and regenerate the lockfile.
- Build and type checks pass after any upgrade.

**Out of scope**

- Major Next.js feature migrations.
- React version changes outside the chosen Next.js patch.

**Validation commands**

```powershell
pnpm list next
pnpm turbo build --filter=@repo/firm-website
pnpm turbo check-types --filter=@repo/firm-website
```

---

## TS-001 — Update TypeScript configuration for TS 6.0

- [x] `TS-001` — `[DONE]`

**Implementation notes**
- Added explicit `"types": []` to `packages/typescript-config/base.json`
- `strict`, `module`, and `target` were already explicitly set in base.json
- No `baseUrl` existed in any config (already compliant with TS 6.0 deprecation)
- Note: `pnpm turbo check-types` fails due to pre-existing FIX-001 issue (contact.test.ts), not TS-001 changes

**Related file paths**

- `packages/typescript-config/base.json`
- `packages/typescript-config/nextjs.json`
- `apps/firm-website/tsconfig.json`
- `packages/lib/tsconfig.json`
- `packages/ui/tsconfig.json`

**Definition of done**

- `strict`, `module`, `target`, and `types` are explicitly set to desired values in the shared base config.
- `baseUrl` is removed from all configs (prepend the prefix into `paths` entries where needed).
- `pnpm turbo check-types` passes across all packages.

**Out of scope**

- Adopting TypeScript 7.0 features.
- Rewriting source code for new compiler defaults.

**Validation commands**

```powershell
pnpm turbo check-types
```

---

## SEN-001 — Migrate Sentry client config to `instrumentation-client.ts`

- [x] `SEN-001` — `[DONE]`

**Implementation notes**
- Created `apps/firm-website/instrumentation-client.ts` with client-side Sentry configuration
- Added `export const onRouterTransitionStart = Sentry.captureRouterTransitionStart` to instrument router navigations
- Deleted `apps/firm-website/sentry.client.config.ts` (deprecated file)
- Added `SENTRY_AUTH_TOKEN` and `NEXT_PUBLIC_SENTRY_DSN` to `turbo.json` `globalPassThroughEnv`
- Added `SENTRY_AUTH_TOKEN` and `NEXT_PUBLIC_SENTRY_DSN` to `turbo.json` build task `passThroughEnv`
- Updated `next.config.ts` to use `webpack.autoInstrumentServerFunctions` instead of deprecated `autoInstrumentServerFunctions`
- Added `authToken: process.env.SENTRY_AUTH_TOKEN` and `silent: !process.env.CI` to `sentryOptions` in `next.config.ts`
- Server Sentry config remains in `instrumentation.ts` under `register()`
- Build succeeds without Turborepo pass-through warnings (silent mode suppresses auth token warnings in non-CI)
- Type checking passes

**Related file paths**

- `apps/firm-website/sentry.client.config.ts` (deleted)
- `apps/firm-website/instrumentation-client.ts` (created)
- `apps/firm-website/instrumentation.ts`
- `turbo.json`
- `apps/firm-website/next.config.ts`

**Definition of done**

- `sentry.client.config.ts` content is moved to `instrumentation-client.ts` per `@sentry/nextjs` Next.js 15 guidance.
- Server Sentry config remains in `instrumentation.ts` under `register()`.
- `SENTRY_AUTH_TOKEN` and `NEXT_PUBLIC_SENTRY_DSN` are declared in `turbo.json` `globalPassThroughEnv` (or per-task `passThroughEnv`).
- Build no longer emits Turborepo pass-through or missing auth-token warnings.

**Out of scope**

- Configuring actual Sentry secrets in CI/Vercel.
- Adding Sentry to additional apps.

**Validation commands**

```powershell
pnpm turbo build --filter=@repo/firm-website
```

---

## FIX-001 — Fix `contact.test.ts` type-check failure

- [x] `FIX-001` — `[DONE]`

**Implementation notes**
- Replaced `import { submitContact, initialContactState } from './contact'` with `import { submitContact, type ContactFormState } from './contact'`
- Defined `initialContactState` locally in the test file using the imported `ContactFormState` type
- This resolves the type-check failure since `'use server'` files cannot export non-function values
- All 10 tests pass, type check passes

**Related file paths**

- `apps/firm-website/src/app/actions/contact.ts`
- `apps/firm-website/src/app/actions/contact.test.ts`
- `apps/firm-website/src/components/features/contact/contact-form.tsx`

**Definition of done**

- `pnpm turbo check-types --filter=@repo/firm-website` passes.
- `pnpm turbo test --filter=@repo/firm-website -- src/app/actions/contact.test.ts` passes.
- `initialContactState` is no longer exported from `contact.ts` (`'use server'` files cannot export non-function values).
- The test file constructs its own initial state from the exported `ContactFormState` interface.

**Out of scope**

- Changing the contact form UI behavior.
- Adding or removing contact form fields.
- Refactoring the Resend mock strategy.

**Rules to follow**

- Preserve the existing `'use server'` directive in `contact.ts`.
- Keep `ContactFormState` exported from `contact.ts` so `contact-form.tsx` and tests can import it.
- Do not re-introduce a non-function export from `contact.ts`.

**Advanced coding pattern**

- Use the existing `ContactFormState` interface as a type contract and construct a literal object in the test to satisfy it. This keeps the server action surface minimal while preserving type safety and testability.

**Anti-patterns**

- Exporting values from a `'use server'` file.
- Duplicating the state shape definition in the test file instead of importing the type.
- Running the full test suite when a single test file is sufficient.

**Imports/exports**

- `contact.ts`: keep `export interface ContactFormState`, keep `export async function submitContact`.
- `contact.test.ts`: import `{ submitContact, type ContactFormState } from './contact'`; define `const initialContactState: ContactFormState = { ... }` locally.

**Depends on / blocks**

- Depends on: none.
- Blocks: any task that requires a green `check-types` result.

**Subtasks**

- `[AGENT]` `FIX-001-01` — `apps/firm-website/src/app/actions/contact.test.ts` — Replace `import { submitContact, initialContactState } from './contact'` with `import { submitContact, type ContactFormState } from './contact'` and define `initialContactState` locally using the imported type.
- `[AGENT]` `FIX-001-02` — `apps/firm-website/src/app/actions/contact.test.ts` — Verify all test cases still reference the local `initialContactState` and no other imports are broken.
- `[AGENT]` `FIX-001-03` — workspace root — Run `pnpm turbo check-types --filter=@repo/firm-website` and `pnpm turbo test --filter=@repo/firm-website -- src/app/actions/contact.test.ts`; fix any remaining issues.
- `[AGENT]` `FIX-001-04` — `.devin/workflows/execute-todo.md` — Update any referenced workflow notes that mention the old `initialContactState` export.

**Validation commands**

```powershell
pnpm turbo check-types --filter=@repo/firm-website
pnpm turbo test --filter=@repo/firm-website -- src/app/actions/contact.test.ts
```

---

## INF-001 — Ignore TypeScript build info files

- [x] `INF-001` — `[DONE]`

**Implementation notes**
- Added `*.tsbuildinfo` to `.gitignore` in the Build outputs section
- Removed `apps/firm-website/tsconfig.tsbuildinfo` from git tracking with `git rm --cached`
- File remains on disk but is no longer tracked by git

**Related file paths**

- `.gitignore`
- `apps/firm-website/tsconfig.tsbuildinfo`

**Definition of done**

- `*.tsbuildinfo` is present in `.gitignore`.
- `apps/firm-website/tsconfig.tsbuildinfo` is untracked by git (removed from index, file may remain on disk).
- `git status --short` no longer shows `M apps/firm-website/tsconfig.tsbuildinfo`.

**Out of scope**

- Deleting the `tsconfig.tsbuildinfo` file from disk; only remove it from git tracking.
- Changing `tsconfig.json` settings.

**Rules to follow**

- Use a glob pattern so future `.tsbuildinfo` files are also ignored.
- Do not commit the file again after untracking.

**Advanced coding pattern**

- Treat generated artifacts as ephemeral. Ignoring them at the workspace root keeps all apps and packages covered by the same rule.

**Anti-patterns**

- Tracking generated build metadata in version control.
- Adding one ignore rule per file instead of a glob.

**Imports/exports**

- No code imports/exports affected.

**Depends on / blocks**

- Depends on: none.
- Blocks: none.

**Subtasks**

- `[AGENT]` `INF-001-01` — `.gitignore` — Append `*.tsbuildinfo` to the file in an appropriate section (near build outputs).
- `[AGENT]` `INF-001-02` — workspace root — Run `git rm --cached apps/firm-website/tsconfig.tsbuildinfo`.
- `[AGENT]` `INF-001-03` — workspace root — Run `git status --short` to confirm the file is no longer tracked as modified.

**Validation commands**

```powershell
git status --short
```

---

## FIX-002 — Remove dead code and public test routes

- [x] `FIX-002` — `[DONE]`

**Implementation notes**
- Task was already complete: `header.tsx`, `test-mdx/`, and `sample.mdx` did not exist in the codebase
- Sitemap.ts at `apps/firm-website/src/app/sitemap.ts` contains no hardcoded test routes
- Build and typecheck pass successfully
- No code changes were required

**Related file paths**

- `apps/firm-website/src/components/header.tsx` (already deleted)
- `apps/firm-website/src/app/test-mdx/page.tsx` (already deleted)
- `apps/firm-website/src/content/pages/sample.mdx` (already deleted)
- `apps/firm-website/src/app/sitemap.ts` (verified clean)

**Definition of done**

- `header.tsx`, `test-mdx/page.tsx`, and `sample.mdx` are deleted.
- The sitemap no longer emits `/sample-mdx` or `/test-mdx` URLs.
- `pnpm turbo build --filter=@repo/firm-website` succeeds.
- `pnpm turbo check-types --filter=@repo/firm-website` still passes.

**Out of scope**

- Refactoring the marketing layout header (it uses `@repo/ui` `Header`).
- Adding a new sample page.

**Rules to follow**

- Delete files; do not leave empty placeholder files.
- Verify no imports reference the deleted files.
- Update `sitemap.ts` if it iterates over pages content.

**Advanced coding pattern**

- Treat the public URL surface as part of the deployment contract. Removing test artifacts is a domain boundary cleanup.

**Anti-patterns**

- Leaving test routes behind with a robots disallow rule instead of removing them.
- Hardcoding route exclusions in multiple places.

**Imports/exports**

- No new imports/exports.
- Any imports of `header.tsx` must be removed (verify with search).

**Depends on / blocks**

- Depends on: `FIX-001` (green type check before further deletion).
- Blocks: `CT-002` (page schema alignment may touch the same files).

**Subtasks**

- `[AGENT]` `FIX-002-01` — workspace root — Search for all imports of `src/components/header.tsx` and remove them.
- `[AGENT]` `FIX-002-02` — `apps/firm-website/src/components/header.tsx` — Delete the file.
- `[AGENT]` `FIX-002-03` — `apps/firm-website/src/app/test-mdx/` — Delete the directory and its contents.
- `[AGENT]` `FIX-002-04` — `apps/firm-website/src/content/pages/sample.mdx` — Delete the file.
- `[AGENT]` `FIX-002-05` — `apps/firm-website/src/lib/sitemap.ts` — Confirm `/sample-mdx` and `/test-mdx` are no longer emitted; if hardcoded, remove the entries.
- `[AGENT]` `FIX-002-06` — workspace root — Run `pnpm turbo build --filter=@repo/firm-website` and `pnpm turbo check-types --filter=@repo/firm-website`.

**Validation commands**

```powershell
pnpm turbo build --filter=@repo/firm-website
pnpm turbo check-types --filter=@repo/firm-website
```

---

## CT-001 — Fix FAQ schema, type, frontmatter, and component divergence

- [ ] `CT-001` — `[PENDING]`

**Related file paths**

- `packages/lib/src/schemas/content.ts`
- `packages/lib/src/types/content.ts`
- `packages/lib/src/index.ts`
- `apps/firm-website/src/content/faq/*.mdx`
- `apps/firm-website/src/lib/content.ts`
- `apps/firm-website/src/components/features/faq/faq-hub.tsx`
- `apps/firm-website/src/components/features/faq/faq-snippet.tsx`
- `apps/firm-website/src/components/features/faq/faq-accordion.tsx`
- `apps/firm-website/src/lib/json-ld.ts`
- `apps/firm-website/src/lib/sitemap.ts`
- `packages/lib/src/__tests__/content-schemas.test.ts` (create or update)

**Definition of done**

- FAQ MDX frontmatter (`title`, `slug`, `description`, `category`, `order`) validates against `FAQSchema`.
- The `FAQ` TypeScript type is derived from `FAQSchema` using `z.infer` and exposes `title`, `slug`, `description`, `category`, `order`, and `content` (body).
- `FAQHub` and `FAQSnippet` render `title` and `content` correctly; no `undefined` questions or answers.
- `sitemap.ts` stops emitting individual FAQ detail URLs (`/faq/${slug}`) unless `CT-004` is undertaken.
- A test in `packages/lib` validates the schema against at least one real FAQ MDX frontmatter object.
- `pnpm turbo check-types` and `pnpm turbo test` pass for `@repo/lib` and `@repo/firm-website`.

**Out of scope**

- Adding individual FAQ detail pages (covered by `CT-004` if chosen).
- Renaming frontmatter fields in all FAQ MDX files.
- Changing the visual design of the FAQ accordion.

**Rules to follow**

- Source of truth is the actual MDX frontmatter, not the old interface or old schema.
- Derive TS types from Zod schemas.
- Keep `category` as a required union of known categories (`general`, `pricing`, `process`) for type safety.
- Preserve the rendered body as the answer source.

**Advanced coding pattern**

- Use `z.infer<typeof FAQSchema>` to create a single source of truth. The schema becomes the domain model; the TypeScript type is a projection, eliminating three-way divergence.

**Anti-patterns**

- Casting frontmatter with `as T` and bypassing validation.
- Maintaining parallel hand-written interfaces that drift from the schema.
- Using `any` or `unknown` to silence type errors.

**Imports/exports**

- `packages/lib/src/schemas/content.ts`: export `FAQSchema` with the aligned shape.
- `packages/lib/src/types/content.ts`: export `FAQ = z.infer<typeof FAQSchema>`; remove hand-written `FAQ` interface.
- `packages/lib/src/index.ts`: re-export schema and type.
- `faq-hub.tsx` / `faq-snippet.tsx`: import `FAQ` type and use `title`, `slug`, `description`, `category`, `order`, `content`.

**Depends on / blocks**

- Depends on: `FIX-001`.
- Blocks: `CT-002`, `CT-004`.

**Subtasks**

- `[AGENT]` `CT-001-01` — `packages/lib/src/schemas/content.ts` — Rewrite `FAQSchema` to match MDX frontmatter: `title`, `slug`, `description`, `category` (required string or enum), `order` (optional number).
- `[AGENT]` `CT-001-02` — `packages/lib/src/types/content.ts` — Replace hand-written `FAQ` interface with `export type FAQ = z.infer<typeof FAQSchema>`.
- `[AGENT]` `CT-001-03` — `apps/firm-website/src/lib/content.ts` — Add runtime validation using `FAQSchema.safeParse` in `getFAQ` / `getAllFAQs` or a shared helper; fail loudly on invalid frontmatter.
- `[AGENT]` `CT-001-04` — `apps/firm-website/src/components/features/faq/faq-hub.tsx` — Replace `metadata.question` / `metadata.answer` usage with `title` / `content`; update grouping and sorting logic to use `title` and `order`.
- `[AGENT]` `CT-001-05` — `apps/firm-website/src/components/features/faq/faq-snippet.tsx` — Replace `question` / `answer` usage with `title` / `content`.
- `[AGENT]` `CT-001-06` — `apps/firm-website/src/lib/json-ld.ts` — Update `generateFAQSchema` to accept the new FAQ shape.
- `[AGENT]` `CT-001-07` — `apps/firm-website/src/lib/sitemap.ts` — Remove individual FAQ detail URLs from the sitemap; they will be restored by `CT-004`.
- `[AGENT]` `CT-001-08` — `packages/lib/src/__tests__/content-schemas.test.ts` — Add tests that assert `FAQSchema` parses a valid FAQ frontmatter object and rejects invalid ones.
- `[AGENT]` `CT-001-09` — workspace root — Run `pnpm turbo check-types`, `pnpm turbo test --filter=@repo/lib`, and `pnpm turbo test --filter=@repo/firm-website`.

**Validation commands**

```powershell
pnpm turbo check-types
pnpm turbo test --filter=@repo/lib
pnpm turbo test --filter=@repo/firm-website
```

---

## CT-002 — Align Service, Industry, Demo, and Page schemas with MDX frontmatter

- [ ] `CT-002` — `[PENDING]`

**Related file paths**

- `packages/lib/src/schemas/content.ts`
- `packages/lib/src/types/content.ts`
- `apps/firm-website/src/content/{services,industries,demos,pages}/*.mdx`
- `apps/firm-website/src/lib/content.ts`
- `apps/firm-website/src/lib/navigation.ts`
- `apps/firm-website/src/lib/sitemap.ts`
- `packages/lib/src/__tests__/content-schemas.test.ts`
- `apps/firm-website/src/types/content.ts`

**Definition of done**

- All content schemas (`ServiceSchema`, `IndustrySchema`, `DemoSchema`, `PageSchema`) match their respective MDX frontmatter fields.
- `body` is no longer required as frontmatter because it comes from MDX content.
- TypeScript types are derived from schemas via `z.infer`.
- `navigation.ts` and `sitemap.ts` use the shared `@repo/lib` types instead of local `as` casts.
- `apps/firm-website/src/types/content.ts` either re-exports the derived types or is removed.
- Schema tests cover valid and invalid frontmatter for each entity.

**Out of scope**

- Adding new fields to frontmatter that are not already present.
- Restructuring the `content/` directory layout.
- Extracting the content engine to a separate package.

**Rules to follow**

- Frontmatter shape is the source of truth.
- Schemas use `z.strictObject()` so extra fields are rejected.
- Types come from schemas.
- Remove `as` casts when shared types are available.

**Advanced coding pattern**

- Create a small `validateContent<T>(schema: ZodSchema<T>, data: unknown)` helper in `content.ts`. This centralizes parsing, logging, and error handling for all content consumers.

**Anti-patterns**

- Keeping `body` in schemas when it is actually rendered MDX content.
- Using multiple local interfaces for the same concept.
- Ignoring Zod parse errors and falling back to `as` casts.

**Imports/exports**

- `packages/lib/src/schemas/content.ts`: aligned `ServiceSchema`, `IndustrySchema`, `DemoSchema`, `PageSchema`.
- `packages/lib/src/types/content.ts`: `export type Service = z.infer<typeof ServiceSchema>`, etc.
- `apps/firm-website/src/lib/content.ts`: import schemas from `@repo/lib` and validate frontmatter.
- `apps/firm-website/src/lib/navigation.ts`: import shared types.
- `apps/firm-website/src/lib/sitemap.ts`: import shared types.

**Depends on / blocks**

- Depends on: `FIX-001`, `CT-001`.
- Blocks: `UI-002`, `UI-003` (detail components rely on correct types).

**Subtasks**

- `[AGENT]` `CT-002-01` — `packages/lib/src/schemas/content.ts` — Align `ServiceSchema` and `IndustrySchema` with actual frontmatter (remove `body`, keep `title`, `slug`, `description`, `featured`, `order`; add `icon` for Industry if present).
- `[AGENT]` `CT-002-02` — `packages/lib/src/schemas/content.ts` — Align `DemoSchema` with actual frontmatter; add `industry` if present; remove `challenge`/`approach`/`outcome` if they live in body.
- `[AGENT]` `CT-002-03` — `packages/lib/src/schemas/content.ts` — Align `PageSchema` with actual frontmatter (`title`, `slug`, `description` optional, no `body` in frontmatter).
- `[AGENT]` `CT-002-04` — `packages/lib/src/types/content.ts` — Replace hand-written interfaces with `z.infer` exports.
- `[AGENT]` `CT-002-05` — `apps/firm-website/src/lib/content.ts` — Add `validateContent` helper and use it for all `getAll*` and `getBySlug` functions.
- `[AGENT]` `CT-002-06` — `apps/firm-website/src/lib/navigation.ts` — Replace local interfaces with imports from `@repo/lib`.
- `[AGENT]` `CT-002-07` — `apps/firm-website/src/lib/sitemap.ts` — Replace `as { slug: string }` casts with shared types.
- `[AGENT]` `CT-002-08` — `apps/firm-website/src/types/content.ts` — Evaluate whether to remove or convert to re-exports; update all consumers.
- `[AGENT]` `CT-002-09` — `packages/lib/src/__tests__/content-schemas.test.ts` — Add per-entity schema tests.
- `[AGENT]` `CT-002-10` — workspace root — Run `pnpm turbo check-types`, `pnpm turbo test --filter=@repo/lib`, `pnpm turbo test --filter=@repo/firm-website`.

**Validation commands**

```powershell
pnpm turbo check-types
pnpm turbo test --filter=@repo/lib
pnpm turbo test --filter=@repo/firm-website
pnpm turbo build --filter=@repo/firm-website
```

---

## CT-003 — Validate all MDX content at runtime

- [ ] `CT-003` — `[PENDING]`

**Related file paths**

- `apps/firm-website/src/lib/content.ts`
- `packages/lib/src/schemas/content.ts`
- `packages/lib/src/index.ts`
- `apps/firm-website/src/lib/__tests__/content.test.ts` (create or update)

**Definition of done**

- Every content read (`getContentBySlug`, `getAllContent`) validates frontmatter against the appropriate Zod schema.
- Invalid content throws or logs a clear error and is excluded from production data.
- Existing tests still pass.
- A new unit test demonstrates validation rejecting malformed frontmatter.

**Out of scope**

- Adding a separate `packages/content` package.
- Changing the MDX parsing pipeline beyond frontmatter validation.

**Rules to follow**

- Fail fast on invalid content during static generation.
- Keep the cache behavior intact.
- Preserve TypeScript return signatures.

**Advanced coding pattern**

- Generic validation helper:
  ```ts
  function parseFrontmatter<T>(schema: z.ZodSchema<T>, data: unknown, slug: string): T
  ```
  This hides parsing complexity and provides consistent error messages.

**Anti-patterns**

- Returning `null` silently when validation fails.
- Mixing parsing logic with filesystem I/O.

**Imports/exports**

- `apps/firm-website/src/lib/content.ts`: import schemas from `@repo/lib`; export typed helper functions.

**Depends on / blocks**

- Depends on: `CT-001`, `CT-002`.
- Blocks: none.

**Subtasks**

- `[AGENT]` `CT-003-01` — `apps/firm-website/src/lib/content.ts` — Implement `parseFrontmatter` helper using `z.infer` schemas.
- `[AGENT]` `CT-003-02` — `apps/firm-website/src/lib/content.ts` — Apply validation in `getContentBySlug` and `getAllContent`.
- `[AGENT]` `CT-003-03` — `apps/firm-website/src/lib/__tests__/content.test.ts` — Add tests for valid and invalid content parsing.
- `[AGENT]` `CT-003-04` — workspace root — Run targeted tests and build.

**Validation commands**

```powershell
pnpm turbo test --filter=@repo/firm-website -- src/lib/__tests__/content.test.ts
pnpm turbo build --filter=@repo/firm-website
```

---

## CT-004 — Add individual FAQ detail pages

- [ ] `CT-004` — `[PENDING]`

**Related file paths**

- `apps/firm-website/src/app/(marketing)/faq/[slug]/page.tsx` (create)
- `apps/firm-website/src/lib/sitemap.ts`
- `apps/firm-website/e2e/faq.spec.ts` (create or update)

**Definition of done**

- Each FAQ is reachable at `/faq/{slug}`.
- `sitemap.ts` emits these URLs again if previously removed.
- A basic detail page renders the FAQ title, description, and full answer content.
- E2E or component test verifies at least one detail route.

**Out of scope**

- Adding FAQ editing or CMS functionality.
- Changing the FAQ hub design.

**Rules to follow**

- Use `generateStaticParams` with `dynamicParams = false`.
- Reuse the existing `getFAQ` helper.
- Use shared types from `@repo/lib`.

**Advanced coding pattern**

- Extract a reusable `ContentDetailPage` layout for future entity types.

**Anti-patterns**

- Hardcoding the route list in `sitemap.ts` independently of the page route.

**Imports/exports**

- New page imports `getFAQ`, `FAQ` type, and `@repo/ui` layout primitives.

**Depends on / blocks**

- Depends on: `CT-001`.
- Blocks: `INF-002` if individual FAQ URLs are included in E2E navigation tests.

**Subtasks**

- `[AGENT]` `CT-004-01` — `apps/firm-website/src/app/(marketing)/faq/[slug]/page.tsx` — Create detail page with `generateStaticParams` and `dynamicParams = false`.
- `[AGENT]` `CT-004-02` — `apps/firm-website/src/lib/sitemap.ts` — Restore individual FAQ URLs.
- `[AGENT]` `CT-004-03` — `apps/firm-website/e2e/faq.spec.ts` — Add E2E coverage for the detail route.
- `[AGENT]` `CT-004-04` — workspace root — Run build and E2E tests.

**Validation commands**

```powershell
pnpm turbo build --filter=@repo/firm-website
pnpm turbo test:e2e --filter=@repo/firm-website -- faq
```

---

## ENV-001 — Wire up environment validation module

- [ ] `ENV-001` — `[PENDING]`

**What this is:** `apps/firm-website/src/lib/env.ts` is a small module that uses Zod to validate `process.env` at startup. It currently only checks `NEXT_PUBLIC_SITE_URL`, and it is never imported by any other file, so all the hardcoded URLs in `seo.ts`, `json-ld.ts`, `sitemap.ts`, `robots.ts`, and `page.tsx` bypass it entirely. The choice is between (a) keeping the module, expanding it to validate all required runtime variables, and importing it everywhere, or (b) deleting it and relying on `process.env` runtime checks. Recommendation: keep and wire it, because it catches missing env vars early and centralizes the site URL.

**Related file paths**

- `apps/firm-website/src/lib/env.ts`
- `apps/firm-website/src/lib/seo.ts`
- `apps/firm-website/src/lib/json-ld.ts`
- `apps/firm-website/src/lib/sitemap.ts`
- `apps/firm-website/src/app/robots.ts`
- `apps/firm-website/src/app/page.tsx`
- `apps/firm-website/.env.example`
- `apps/firm-website/src/app/actions/contact.ts`
- `apps/firm-website/src/lib/gtag.ts`
- `apps/firm-website/sentry.client.config.ts`

**Definition of done**

- `src/lib/env.ts` is imported and used as the source of truth for `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `CONTACT_EMAIL`, `FROM_EMAIL`, `NEXT_PUBLIC_SENTRY_DSN`, and `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
- Unused variables `FORM_API_KEY` and `NEXT_PUBLIC_ANALYTICS_ID` are removed from `.env.example`.
- All hardcoded `https://yourdedicatedmarketer.com` references are replaced with `env.NEXT_PUBLIC_SITE_URL` or `process.env.NEXT_PUBLIC_SITE_URL`.
- `pnpm turbo check-types` and `pnpm turbo test --filter=@repo/firm-website` pass.

**Out of scope**

- Moving environment validation to a shared `packages/env` package (long-term).
- Adding runtime secrets rotation.

**Rules to follow**

- Server-only env vars must stay server-only; public vars must keep `NEXT_PUBLIC_` prefix.
- Do not break client bundles by importing `server-only` code into client components.
- Keep `env.ts` using `server-only` if it remains.

**Advanced coding pattern**

- Centralize the site URL and runtime secrets configuration in `env.ts`. Every metadata, JSON-LD, sitemap, robots, contact action, analytics, and Sentry consumer reads from one validated source, eliminating the 26 occurrences of hardcoded URLs.

**Anti-patterns**

- Keeping a validation module that no one imports.
- Accessing `process.env` directly in many files with inconsistent fallbacks.
- Deleting the module without replacing it with a documented validation strategy.

**Imports/exports**

- `apps/firm-website/src/lib/env.ts`: export `env` object if kept.
- `seo.ts`, `json-ld.ts`, `sitemap.ts`, `robots.ts`, `page.tsx`: import `env` or use `process.env.NEXT_PUBLIC_SITE_URL`.
- `contact.ts`: validate `RESEND_API_KEY`, `CONTACT_EMAIL`, `FROM_EMAIL` via the env module or keep runtime checks.

**Depends on / blocks**

- Depends on: `FIX-001`.
- Blocks: `FIX-003` (placeholders often use the site URL).

**Subtasks**

- `[AGENT]` `ENV-001-01` — `apps/firm-website/.env.example` — Remove `FORM_API_KEY` and `NEXT_PUBLIC_ANALYTICS_ID`.
- `[AGENT]` `ENV-001-02` — `apps/firm-website/src/lib/env.ts` — Expand schema to validate `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `CONTACT_EMAIL`, `FROM_EMAIL`, `NEXT_PUBLIC_SENTRY_DSN`, and `NEXT_PUBLIC_GA_MEASUREMENT_ID` with sensible defaults/optional flags where appropriate.
- `[AGENT]` `ENV-001-03` — `apps/firm-website/src/lib/seo.ts` — Replace hardcoded `SITE_URL` with `env.NEXT_PUBLIC_SITE_URL`.
- `[AGENT]` `ENV-001-04` — `apps/firm-website/src/lib/json-ld.ts` — Replace hardcoded `SITE_URL` with `env.NEXT_PUBLIC_SITE_URL`.
- `[AGENT]` `ENV-001-05` — `apps/firm-website/src/lib/sitemap.ts` — Replace hardcoded URL with `env.NEXT_PUBLIC_SITE_URL`.
- `[AGENT]` `ENV-001-06` — `apps/firm-website/src/app/robots.ts` — Replace hardcoded URL with `env.NEXT_PUBLIC_SITE_URL`.
- `[AGENT]` `ENV-001-07` — `apps/firm-website/src/app/page.tsx` — Replace hardcoded URL and placeholder contact values in JSON-LD.
- `[AGENT]` `ENV-001-08` — `apps/firm-website/src/app/actions/contact.ts` — Use validated env values for Resend/contact flow.
- `[AGENT]` `ENV-001-09` — `apps/firm-website/src/lib/gtag.ts` and `sentry.client.config.ts` — Reference validated env values where client-side access is safe.
- `[AGENT]` `ENV-001-10` — workspace root — Run `pnpm turbo check-types` and `pnpm turbo test --filter=@repo/firm-website`.

**Validation commands**

```powershell
pnpm turbo check-types --filter=@repo/firm-website
pnpm turbo test --filter=@repo/firm-website
```

---

## FIX-003 — Replace placeholder business contact details

- [ ] `FIX-003` — `[PENDING]`

**Related file paths**

- `apps/firm-website/src/app/(marketing)/layout.tsx`
- `apps/firm-website/src/app/(marketing)/contact/page.tsx`
- `apps/firm-website/src/app/page.tsx`
- `packages/ui/src/components/layout/footer.tsx`
- `packages/ui/src/components/layout/header.tsx`
- `apps/firm-website/.env.example`
- `apps/firm-website/src/lib/env.ts` (if kept)

**Definition of done**

- All fake phone numbers (`+1 (555) 123-4567`), fake addresses, and generic social links are replaced with real business values or clearly sourced from environment variables.
- Business hours on the contact page are accurate.
- Email address is consistent across footer, header, contact page, home JSON-LD, and layout.
- A regression test asserts that the contact page does not render the placeholder phone number.
- `pnpm turbo test --filter=@repo/firm-website` and `pnpm turbo check-types --filter=@repo/firm-website` pass.

**Out of scope**

- Adding a CMS for contact details.
- Changing the visual layout of the contact page.

**Rules to follow**

- Source values from env vars where possible; hardcode only values that are truly static.
- Keep the change localized to contact/NAP data.
- Do not use placeholder values in production-facing JSON-LD.

**Advanced coding pattern**

- Treat contact details as a bounded context. Define a single `siteConfig` or env-derived object consumed by layout, footer, header, and contact page.

**Anti-patterns**

- Scattering the same phone number across five files with manual copy/paste.
- Using fake data in schema.org structured data.

**Imports/exports**

- `apps/firm-website/src/lib/env.ts` or new `apps/firm-website/src/lib/site-config.ts`: export validated contact details.
- Layout, footer, header, contact page, home page: import the shared config.

**Depends on / blocks**

- Depends on: `ENV-001`.
- Blocks: none.

**Subtasks**

- `[HUMAN]` `FIX-003-01` — Decision/input required: Provide real phone, address, email, business hours, and social URLs when this task is executed. Alternatively, confirm that env vars should drive these values.
- `[AGENT]` `FIX-003-02` — `apps/firm-website/src/lib/site-config.ts` (create if needed) — Centralize contact details from env or human-provided values.
- `[AGENT]` `FIX-003-03` — `apps/firm-website/src/app/(marketing)/layout.tsx` — Replace placeholder contact props with shared config.
- `[AGENT]` `FIX-003-04` — `apps/firm-website/src/app/(marketing)/contact/page.tsx` — Replace fake phone, address, and hours.
- `[AGENT]` `FIX-003-05` — `apps/firm-website/src/app/page.tsx` — Replace fake contact values in Organization JSON-LD.
- `[AGENT]` `FIX-003-06` — `packages/ui/src/components/layout/footer.tsx` — Replace hardcoded copyright/values or accept via props.
- `[AGENT]` `FIX-003-07` — `packages/ui/src/components/layout/header.tsx` — Replace default "Logo" text or accept via props if business name is static.
- `[AGENT]` `FIX-003-08` — workspace root — Run `pnpm turbo test --filter=@repo/firm-website` and `pnpm turbo check-types --filter=@repo/firm-website`.

**Validation commands**

```powershell
pnpm turbo check-types --filter=@repo/firm-website
pnpm turbo test --filter=@repo/firm-website
```

---

## DOC-001 — Commit deleted documentation and remove references

- [ ] `DOC-001` — `[PENDING]`

**Decision:** The `docs/` directory (19 files), `README.md`, and old `TODO.md` have been permanently deleted and will not be restored. This task records that decision in git and scrubs any surviving references to the deleted files.

**Related file paths**

- `README.md` (deleted)
- `TODO.md` (this file)
- `docs/` (deleted)
- `.gitignore`
- Any file that still imports or links to `docs/...` or `README.md`

**Definition of done**

- Deletions of `README.md`, `docs/`, and old `TODO.md` are staged/committed with a clear commit message.
- `TODO.md` (this file) is committed.
- No source file or script references the deleted `docs/` paths or old `README.md`.
- `git status --short` shows a clean documentation state (no uncommitted deletions).

**Out of scope**

- Restoring any deleted documentation.
- Removing the `.company/` business planning documents.
- Writing a new README at this time.

**Rules to follow**

- Do not leave deleted files in an uncommitted state.
- Do not restore any docs.
- Update `.gitignore` only if it references deleted docs paths.

**Advanced coding pattern**

- Treat repository state as code. Uncommitted deletions are a form of technical debt; committing them makes the intended state explicit.

**Anti-patterns**

- Bulk-deleting docs and leaving them uncommitted.
- Restoring docs after explicitly deciding not to.

**Imports/exports**

- None.

**Depends on / blocks**

- Depends on: none.
- Blocks: none.

**Subtasks**

- `[AGENT]` `DOC-001-01` — workspace root — Search the repository for any remaining references to `docs/...` paths or `README.md` links.
- `[AGENT]` `DOC-001-02` — workspace root — Stage the deletions: `git rm README.md docs/...` (all 19 docs files).
- `[AGENT]` `DOC-001-03` — workspace root — Update `.gitignore` if it contains entries that only protected deleted docs.
- `[AGENT]` `DOC-001-04` — workspace root — Run `git status --short` to confirm clean state.

**Validation commands**

```powershell
grep -R "docs/" --include="*.md" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.json" .
git status --short
```

---

## INF-002 — Add Sentry environment passthrough

- [ ] `INF-002` — `[PENDING]`

**Related file paths**

- `turbo.json`
- `apps/firm-website/next.config.ts`
- `apps/firm-website/sentry.client.config.ts`
- `apps/firm-website/instrumentation.ts`

**Definition of done**

- `SENTRY_AUTH_TOKEN` and `NEXT_PUBLIC_SENTRY_DSN` are declared in `turbo.json` under `globalPassThroughEnv` or appropriate `passThroughEnv` blocks.
- Build no longer emits "No auth token provided" and Turborepo pass-through warnings.
- Optional: create `instrumentation-client.ts` per `@sentry/nextjs` Next.js 15 guidance.

**Out of scope**

- Setting actual secret values in CI/Vercel.
- Adding Sentry to additional apps.

**Rules to follow**

- Only passthrough env vars that are safe to expose to the build pipeline.
- Keep `NEXT_PUBLIC_SENTRY_DSN` public; keep `SENTRY_AUTH_TOKEN` server-side only.

**Advanced coding pattern**

- Use `globalPassThroughEnv` for vars used across tasks, and `env` blocks per-task for build-specific vars.

**Anti-patterns**

- Adding secrets to `globalEnv` when only `globalPassThroughEnv` is needed.
- Ignoring repeated build warnings.

**Imports/exports**

- `turbo.json`: add `globalPassThroughEnv` array.

**Depends on / blocks**

- Depends on: `FIX-001`.
- Blocks: none.

**Subtasks**

- `[AGENT]` `INF-002-01` — `turbo.json` — Add `globalPassThroughEnv: ["SENTRY_AUTH_TOKEN", "NEXT_PUBLIC_SENTRY_DSN"]`.
- `[AGENT]` `INF-002-02` — `apps/firm-website/instrumentation-client.ts` (optional) — Migrate client Sentry config if recommended.
- `[AGENT]` `INF-002-03` — workspace root — Run `pnpm turbo build --filter=@repo/firm-website` and verify Sentry warnings are gone (auth token may still be absent in local dev, but pass-through warning should disappear).
- `[AGENT]` `INF-002-04` — `.github/workflows/ci.yml` and `.devin/workflows/execute-todo.md` — Document required repository secrets.

**Validation commands**

```powershell
pnpm turbo build --filter=@repo/firm-website
```

---

## INF-003 — Align Playwright CI browser installation

- [ ] `INF-003` — `[PENDING]`

**Recommendation:** The current `playwright.config.ts` defines three projects (Chromium, Firefox, WebKit), but CI only installs Chromium. The safest fix is to install all three browsers in CI (`npx playwright install --with-deps chromium firefox webkit`) so CI matches the configured test matrix. Reducing CI to Chromium-only is also acceptable if speed/cost is a concern, but that changes the test contract and should be an explicit decision.

**Related file paths**

- `.github/workflows/ci.yml`
- `apps/firm-website/playwright.config.ts`

**Definition of done**

- CI installs the same browsers that `playwright.config.ts` targets, OR `playwright.config.ts` is reduced to Chromium-only in CI.
- E2E workflow can run without browser-not-found errors.
- No unused browsers are installed (keeps CI fast).

**Out of scope**

- Adding new E2E tests.
- Changing the local dev browser matrix.

**Rules to follow**

- Prefer installing only the browsers actually exercised by the chosen projects.
- Document the decision.

**Advanced coding pattern**

- Use an environment variable to override projects in CI, keeping local config rich and CI config minimal.

**Anti-patterns**

- Installing Firefox and WebKit in CI but never running them.
- Silently skipping projects in CI without config changes.

**Imports/exports**

- None.

**Depends on / blocks**

- Depends on: `FIX-001`.
- Blocks: none.

**Subtasks**

- `[HUMAN]` `INF-003-01` — Decision required: Run E2E on all three browsers in CI, or only Chromium?
- `[AGENT]` `INF-003-02` — `.github/workflows/ci.yml` — Update `npx playwright install --with-deps` to include the chosen browsers (e.g., `chromium firefox webkit` or keep `chromium`).
- `[AGENT]` `INF-003-03` — `apps/firm-website/playwright.config.ts` — If Chromium-only in CI, add project filtering logic via env var.
- `[AGENT]` `INF-003-04` — workspace root — Run E2E locally to validate config changes.

**Validation commands**

```powershell
pnpm turbo test:e2e --filter=@repo/firm-website
```

---

## UI-001 — Fix breadcrumb navigation links

- [ ] `UI-001` — `[PENDING]`

**Related file paths**

- `apps/firm-website/src/components/features/demos/demo-detail.tsx`
- `apps/firm-website/src/components/features/services/service-detail.tsx`
- `apps/firm-website/src/components/features/industries/industry-detail.tsx`
- `apps/firm-website/e2e/navigation.spec.ts` (create or update)

**Definition of done**

- All breadcrumb links use Next.js `Link` component instead of plain `<a>` tags.
- Navigation between detail pages and list pages does not trigger full page reloads.
- Existing tests pass.

**Out of scope**

- Redesigning breadcrumb styling.
- Adding breadcrumbs to pages that do not have them.

**Rules to follow**

- Import `Link` from `next/link`.
- Preserve existing styling classes and accessibility attributes.

**Advanced coding pattern**

- Extract a small `Breadcrumb` component if the same markup repeats across detail views.

**Anti-patterns**

- Using `<a href="...">` for internal navigation.
- Duplicating breadcrumb markup without a shared component.

**Imports/exports**

- Components import `Link` from `next/link`.

**Depends on / blocks**

- Depends on: `CT-002` (detail components use aligned content types).
- Blocks: none.

**Subtasks**

- `[AGENT]` `UI-001-01` — `apps/firm-website/src/components/features/services/service-detail.tsx` — Replace breadcrumb `<a>` with `Link`.
- `[AGENT]` `UI-001-02` — `apps/firm-website/src/components/features/industries/industry-detail.tsx` — Replace breadcrumb `<a>` with `Link`.
- `[AGENT]` `UI-001-03` — `apps/firm-website/src/components/features/demos/demo-detail.tsx` — Replace breadcrumb `<a>` with `Link`.
- `[AGENT]` `UI-001-04` — `apps/firm-website/e2e/navigation.spec.ts` — Add test that breadcrumb navigation does not cause a full reload.
- `[AGENT]` `UI-001-05` — workspace root — Run `pnpm turbo lint --filter=@repo/firm-website` and `pnpm turbo test --filter=@repo/firm-website`.

**Validation commands**

```powershell
pnpm turbo lint --filter=@repo/firm-website
pnpm turbo test --filter=@repo/firm-website
```

---

## UI-002 — Fix FAQ accordion React keys

- [ ] `UI-002` — `[PENDING]`

**Related file paths**

- `apps/firm-website/src/components/features/faq/faq-accordion.tsx`
- `apps/firm-website/src/components/features/faq/faq-accordion.test.ts` (create or update)

**Definition of done**

- `FAQAccordion` uses a stable key (e.g., `faq.slug` or `faq.title`) instead of array index.
- A unit test renders FAQs in two different orders and verifies keys are stable.
- No React key warnings appear in test output.

**Out of scope**

- Changing the accordion open/close behavior.
- Adding drag-and-drop reordering.

**Rules to follow**

- Key must be unique and stable across renders.
- Do not use `key={index}`.

**Advanced coding pattern**

- Pass the full FAQ object (with `slug`) into `FAQAccordion` so the component owns its own stable identity.

**Anti-patterns**

- Using array index as React key.
- Generating keys from rendered HTML content.

**Imports/exports**

- `FAQAccordion` prop type updated to include `slug` if not already present.

**Depends on / blocks**

- Depends on: `CT-001`.
- Blocks: none.

**Subtasks**

- `[AGENT]` `UI-002-01` — `apps/firm-website/src/components/features/faq/faq-accordion.tsx` — Update `key` to use stable identifier.
- `[AGENT]` `UI-002-02` — `apps/firm-website/src/components/features/faq/faq-accordion.test.ts` — Create or update test to assert stable keys and reorder behavior.
- `[AGENT]` `UI-002-03` — workspace root — Run `pnpm turbo test --filter=@repo/firm-website -- src/components/features/faq/faq-accordion.test.ts`.

**Validation commands**

```powershell
pnpm turbo test --filter=@repo/firm-website -- src/components/features/faq/faq-accordion.test.ts
```

---

## UI-003 — Guard error boundary console logging

- [ ] `UI-003` — `[PENDING]`

**Related file paths**

- `apps/firm-website/src/app/(marketing)/error.tsx`
- `apps/firm-website/src/app/(marketing)/error.test.ts` (create)

**Definition of done**

- `console.error` calls in `error.tsx` only run in development.
- The user-facing error details remain hidden in production (the `<details>` UI is already dev-only).
- A test asserts no `console.error` is called in production-like environment.

**Out of scope**

- Removing the error boundary.
- Adding Sentry error capture here (Sentry `onRequestError` already exists).

**Rules to follow**

- Use `process.env.NODE_ENV === 'development'` guard.
- Keep the reset button and user-facing message unchanged.

**Advanced coding pattern**

- Encapsulate environment-aware logging in a tiny `logError(error)` helper so the boundary component stays declarative.

**Anti-patterns**

- Logging full stack traces in production.
- Using `console.log` for errors.

**Imports/exports**

- None new.

**Depends on / blocks**

- Depends on: none.
- Blocks: none.

**Subtasks**

- `[AGENT]` `UI-003-01` — `apps/firm-website/src/app/(marketing)/error.tsx` — Wrap `console.error(error.stack)` and `console.error(error.message)` in dev-only guards.
- `[AGENT]` `UI-003-02` — `apps/firm-website/src/app/(marketing)/error.tsx` — Extract `logError` helper if it improves readability.
- `[AGENT]` `UI-003-03` — `apps/firm-website/src/app/(marketing)/error.test.ts` — Create test asserting `console.error` is not called when `NODE_ENV` is `production`.
- `[AGENT]` `UI-003-04` — workspace root — Run `pnpm turbo test --filter=@repo/firm-website -- src/app/(marketing)/error.test.ts`.

**Validation commands**

```powershell
pnpm turbo test --filter=@repo/firm-website -- src/app/(marketing)/error.test.ts
```

---

## INF-004 — Remove unused dependencies and empty package

- [ ] `INF-004` — `[PENDING]`

**What this is:** `packages/tailwind-config/` is an empty directory in the workspace. It has no `package.json` and no files, so pnpm silently ignores it. The intent was probably to share Tailwind theme tokens across future apps, but it currently does nothing and creates confusion. Recommendation: delete the empty directory now. If a shared Tailwind config is needed later, it can be created properly with a `package.json` and exported config. The `@hookform/resolvers` package in `packages/ui` is also unused (only `react-hook-form` is used).

**Related file paths**

- `packages/ui/package.json`
- `packages/tailwind-config/` (empty directory)
- `pnpm-workspace.yaml`
- `pnpm-lock.yaml`

**Definition of done**

- `@hookform/resolvers` is removed from `packages/ui`.
- Empty `packages/tailwind-config` directory is removed.
- Lockfile updated and workspace still installs cleanly.
- `pnpm turbo check-types` and `pnpm turbo test` pass.

**Out of scope**

- Removing `react-hook-form` (it is actively used).
- Removing the umbrella `radix-ui` package unless `form.tsx` is migrated to individual Radix packages.

**Rules to follow**

- Verify no imports exist before removing a dependency.
- Run install after lockfile changes.

**Advanced coding pattern**

- Keep package manifests honest. An unused dependency is technical debt and a supply-chain risk.

**Anti-patterns**

- Removing a dependency without checking imports.
- Leaving an empty directory in the workspace.

**Imports/exports**

- None new.

**Depends on / blocks**

- Depends on: `FIX-001`.
- Blocks: none.

**Subtasks**

- `[AGENT]` `INF-004-01` — `packages/ui/package.json` — Verify `@hookform/resolvers` has no imports, then remove it.
- `[AGENT]` `INF-004-02` — `packages/tailwind-config/` — Delete the empty directory.
- `[AGENT]` `INF-004-03` — workspace root — Run `pnpm install` to update lockfile.
- `[AGENT]` `INF-004-04` — workspace root — Run `pnpm turbo check-types` and `pnpm turbo test`.

**Validation commands**

```powershell
pnpm install
pnpm turbo check-types
pnpm turbo test
```

---

## INF-005 — Document Content Security Policy limitation

- [ ] `INF-005` — `[PENDING]`

**Decision:** Keep the current CSP configuration unchanged. The `'unsafe-inline'` and `'unsafe-eval'` directives in `script-src` are required by the current Next.js setup (including Sentry scripts and the MDX/JSON-LD pipeline). Implementing strict nonces/hashes at this time risks breaking GA4, Sentry, or inline JSON-LD. The pragmatic best path is to document the limitation and the future hardening plan rather than change runtime behavior.

**Related file paths**

- `apps/firm-website/next.config.ts`
- `.devin/workflows/execute-todo.md`
- `.company/security-notes.md` (create if not present)

**Definition of done**

- A documented security note exists explaining why `'unsafe-inline'` and `'unsafe-eval'` are currently required in `script-src`.
- The note lists the exact inline scripts/dependencies that necessitate the exception (e.g., Sentry, GA4, JSON-LD, MDX output).
- The note includes a future work item for adopting nonces/hashes when feasible.
- Build succeeds and site functionality remains intact.

**Out of scope**

- Adding a full security audit.
- Changing other security headers that are already correct.
- Implementing CSP nonces or hashes in this task.

**Rules to follow**

- Preserve GA4, Vercel Analytics, and Sentry functionality.
- Do not break MDX rendering or JSON-LD injection.
- Do not weaken the CSP further.

**Advanced coding pattern**

- Document the current security posture clearly. Future hardening should generate CSP nonces via a middleware, inject them into headers, and share the nonce with `next/script` and inline scripts.

**Anti-patterns**

- Tightening CSP until user-facing features break.
- Documenting CSP as "TODO" without explaining the current rationale.
- Leaving the exception undocumented.

**Imports/exports**

- No code changes required.

**Depends on / blocks**

- Depends on: `FIX-001`.
- Blocks: none.

**Subtasks**

- `[AGENT]` `INF-005-01` — `apps/firm-website/next.config.ts` — Add a code comment above the CSP block explaining why `'unsafe-inline'` and `'unsafe-eval'` are required.
- `[AGENT]` `INF-005-02` — `.devin/workflows/execute-todo.md` or `.company/security-notes.md` (create) — Add a security note documenting the CSP exception and future hardening plan.
- `[AGENT]` `INF-005-03` — workspace root — Run `pnpm turbo build --filter=@repo/firm-website` to confirm no regressions.

**Validation commands**

```powershell
pnpm turbo build --filter=@repo/firm-website
```

---

## Task Priority Summary

| ID | Priority | Status |
|---|---|---|
| `INF-006` | Critical | `[PENDING]` |
| `INF-007` | Critical | `[PENDING]` |
| `FIX-001` | Critical | `[PENDING]` |
| `INF-001` | Critical | `[PENDING]` |
| `FIX-002` | Critical | `[PENDING]` |
| `CT-001` | Critical | `[PENDING]` |
| `DOC-001` | Critical | `[PENDING]` |
| `ENV-001` | High | `[PENDING]` |
| `FIX-003` | High | `[PENDING]` |
| `INF-002` | High | `[PENDING]` |
| `INF-003` | High | `[PENDING]` |
| `CT-002` | High | `[PENDING]` |
| `TS-001` | High | `[PENDING]` |
| `SEN-001` | High | `[PENDING]` |
| `CT-003` | Medium | `[PENDING]` |
| `CT-004` | Medium | `[PENDING]` |
| `UI-001` | Medium | `[PENDING]` |
| `UI-002` | Medium | `[PENDING]` |
| `UI-003` | Medium | `[PENDING]` |
| `INF-004` | Medium | `[PENDING]` |
| `INF-005` | Medium | `[PENDING]` |

---

## Legend

| Field | Meaning |
|---|---|
| `[AGENT]` | Subtask can be executed autonomously by the coding agent. |
| `[HUMAN]` | Subtask requires a human decision, value, or approval. |
| `Depends on` | Tasks that must be completed before this one. |
| `Blocks` | Tasks that cannot start until this one is done. |
| `Definition of done` | Objective criteria that must be true to mark the task complete. |
| `Out of scope` | Boundaries that prevent scope creep. |
| `Anti-patterns` | Approaches to avoid. |

---

## How to use this document

1. Start at the top of the Critical Path and work downward.
2. Before any `[HUMAN]` subtask, pause and ask the user for input. Current HUMAN subtasks: `FIX-003-01` (real business contact details) and `INF-003-01` (Playwright CI browser matrix).
3. After completing a parent task, update its status marker to `[DONE]` and run the listed validation commands.
4. Commit after each parent task when it reaches a green state.
5. Do not skip validation commands; they are chosen to be fast and specific.
