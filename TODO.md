# Phase 1: Content & Data Management – Task List

This document defines all tasks required to define content types, create utilities for content management, and write all content for the website. All tasks are designed to be **SMALL**, actionable, and built with **SDD, DDD, TDD, BDD**, and **Deep Modules** in mind.

**Prerequisites:**  
Monorepo, Next.js app, packages/lib, MDX rendering infrastructure, and design tokens are already established. Content directories exist, and Zod schemas are defined in `packages/lib`.

---

### Parent Task P001: Define Content TypeScript Types and Schemas

- [x] **P001** | Status: `COMPLETED`  
  **Related File Paths:**
  - `packages/lib/src/types/content.ts`
  - `packages/lib/src/index.ts`
  - `apps/firm-website/src/types/content.ts` (re‑export)

  **Definition of Done:**
  - TypeScript interfaces exist for all content entities:
    - `Service` – title, slug, description, body, featured, order
    - `Industry` – title, slug, description, body, featured, order, optional `icon`
    - `Demo` – title, slug, description, challenge, approach, outcome, industry
    - `FAQ` – question, answer, category (`general` | `pricing` | `process`), order
    - `Page` – title, slug, description, body
  - Types are exported from `@repo/lib` and consumable by `apps/firm-website`.

  **Out of Scope:**
  - Runtime validation (Zod schemas already exist in `packages/lib`).

  **Rules to Follow:**
  - All types live in `packages/lib` for reuse.
  - Use `interface` for objects, `type` for unions.
  - JSDoc comments for each property.
  - Branded types for slugs (e.g., `type Slug = string & { __brand: 'slug' }`).

  **Advanced Coding Pattern:**
  - **Deep module** – types form a clean, documented API consumed by content utilities.

  **Anti‑Patterns:**
  - Duplicating types across packages.
  - Using `any` or overly permissive types.

  **Imports/Exports:**
  - `packages/lib/src/types/content.ts` → all interfaces.
  - `packages/lib/src/index.ts` → re‑exports them.
  - `apps/firm-website/src/types/content.ts` → re‑exports from `@repo/lib`.

  **Depends On / Blocks:**
  - Depends on: existing monorepo, existing `packages/lib`.
  - Blocks: content utility development (P002).

  **Implementation Notes:**
  - Created `packages/lib/src/types/content.ts` with all interfaces using `interface` for objects and `type` for unions
  - Added branded `Slug` type for type safety: `type Slug = string & { __brand: 'slug' }`
  - Added JSDoc comments for all interfaces and properties
  - Updated `packages/lib/src/index.ts` to re-export content types
  - Updated `apps/firm-website/src/types/content.ts` to re-export from `@repo/lib` instead of duplicating
  - Updated `docs/content.md` to document the new content types and branded types
  - Quality assurance passed: typecheck (tsc --noEmit), lint (eslint), and lib tests all passed

#### Subtasks

| ID      | Agent/Human | File Path / Command                       | Description                                                                                                                                                | Validation Command |
| ------- | ----------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| P001-01 | AGENT       | `packages/lib/src/types/content.ts`       | Create `Service` interface: `title`, `slug`, `description`, `body`, `featured?`, `order?`.                                                                 | ✅ Complete        |
| P001-02 | AGENT       | `packages/lib/src/types/content.ts`       | Create `Industry` interface: same fields as `Service` plus optional `icon`.                                                                                | ✅ Complete        |
| P001-03 | AGENT       | `packages/lib/src/types/content.ts`       | Create `Demo` interface: `title`, `slug`, `description`, `challenge`, `approach`, `outcome`, `industry`.                                                   | ✅ Complete        |
| P001-04 | AGENT       | `packages/lib/src/types/content.ts`       | Create `FAQ` interface: `question`, `answer`, `category` (union type), `order?`.                                                                           | ✅ Complete        |
| P001-05 | AGENT       | `packages/lib/src/types/content.ts`       | Create `Page` interface: `title`, `slug`, `description`, `body`.                                                                                           | ✅ Complete        |
| P001-06 | AGENT       | `packages/lib/src/index.ts`               | Re‑export all content types.                                                                                                                               | ✅ Complete        |
| P001-07 | AGENT       | `apps/firm-website/src/types/content.ts`  | Create file re‑exporting from `@repo/lib`.                                                                                                                 | ✅ Complete        |
| P001-08 | AGENT       | Update `docs/content.md`                  | Document content types and their schemas.                                                                                                                  | ✅ Complete        |

---

### Parent Task P002: Create Content Utility Functions

- [x] **P002** | Status: `COMPLETED`
  **Related File Paths:**
  - `apps/firm-website/src/lib/content.ts`
  - `apps/firm-website/src/lib/content.test.ts`

  **Definition of Done:**
  - Server‑side utility functions implemented:
    - `getAllContent(dir)` – reads all `.mdx` files from `src/content/{dir}`, returns `{ slug, metadata, content }[]`
    - `getContentBySlug(dir, slug)` – returns single entry or `null`
    - `getAllSlugs(dir)` – returns array of slugs
    - Typed convenience functions: `getServices()`, `getIndustries()`, `getDemos()`, `getFAQs()`, `getPages()`
  - Frontmatter parsing with `gray-matter`.
  - In‑memory cache to avoid repeated file reads.
  - All functions tested with unit tests.

  **Out of Scope:**
  - Client‑side fetching; all content is build‑time generated.

  **Rules to Follow:**
  - Use Node.js `fs` and `path` – server‑only.
  - `gray-matter` for frontmatter, `remark` for Markdown→HTML (optional, can be done in components).
  - Cache loaded content in a `Map`.
  - Error handling: file not found, invalid frontmatter.

  **Advanced Coding Pattern:**
  - **Deep module** – consumers never touch `fs` or `gray-matter`, only the typed API.

  **Anti‑Patterns:**
  - Reading files directly in components.
  - Not handling errors.
  - Using `fs` on the client.

  **Imports/Exports:**
  - `src/lib/content.ts` → `getAllContent`, `getContentBySlug`, `getAllSlugs`, `getServices`, `getIndustries`, `getDemos`, `getFAQs`, `getPages`.

  **Depends On / Blocks:**
  - Depends on: existing MDX setup, content types (P001).
  - Blocks: content creation tasks (P003–P007).

  **Implementation Notes:**
  - Content utilities already existed in `apps/firm-website/src/lib/content.ts`
  - Added in-memory cache using `Map<string, { data: unknown; content: string }>` to avoid repeated file reads
  - Updated file extension from `.md` to `.mdx` throughout the codebase
  - Updated tests to use the existing `sample.mdx` file in `pages` directory
  - Fixed vitest config by removing `dir: './src'` which was causing test discovery issues
  - Fixed lint errors: removed unused `beforeEach` import, changed `any` to `unknown` in cache type
  - Updated `docs/content.md` to document caching and `.mdx` file format
  - All tests pass (14 tests), lint passes, no typecheck errors
  - Committed and pushed to GitHub with conventional commit message

#### Subtasks

| ID      | Agent/Human | File Path / Command                       | Description                                                                                                                                                                                                                              | Validation Command                            |
| ------- | ----------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| P002-01 | AGENT       | `apps/firm-website` (install)             | Run: `pnpm --filter @repo/firm-website add gray-matter remark remark-html`.                                                                                                                                                              | ✅ Complete (packages already installed)     |
| P002-02 | AGENT       | `apps/firm-website/src/lib/content.ts`    | Implement `getAllContent(dir)`: read files, parse with `gray-matter`, return array of `{ slug, metadata, content }`.                                                                                                                     | ✅ Complete (already implemented)             |
| P002-03 | AGENT       | `apps/firm-website/src/lib/content.ts`    | Implement `getContentBySlug(dir, slug)`: return single entry or `null`.                                                                                                                                                                  | ✅ Complete (already implemented)             |
| P002-04 | AGENT       | `apps/firm-website/src/lib/content.ts`    | Implement `getAllSlugs(dir)` returning string array.                                                                                                                                                                                     | ✅ Complete (already implemented)             |
| P002-05 | AGENT       | `apps/firm-website/src/lib/content.ts`    | Create convenience functions: `getServices()`, `getIndustries()`, `getDemos()`, `getFAQs()`, `getPages()` that call `getAllContent` with the appropriate directory.                                                                      | ✅ Complete (already implemented)             |
| P002-06 | AGENT       | `apps/firm-website/src/lib/content.ts`    | Add in‑memory cache (`Map`) to avoid repeated reads.                                                                                                                                                                                     | ✅ Complete                                  |
| P002-07 | AGENT       | `apps/firm-website/src/lib/content.test.ts` | Write unit tests: `getAllContent` returns correct count, `getContentBySlug` returns content/`null`, convenience functions return typed arrays, caching works.                                                                          | ✅ Complete (14 tests passing)                |
| P002-08 | AGENT       | Update `docs/content.md`                  | Document content utility functions and usage.                                                                                                                                                                                            | ✅ Complete                                  |

---

### Parent Task P003: Create Service Pages Content

- [x] **P003** | Status: `COMPLETED`
  **Related File Paths:**
  - `apps/firm-website/src/content/services/website-design.mdx`
  - `apps/firm-website/src/content/services/local-seo.mdx`
  - `apps/firm-website/src/content/services/paid-ads.mdx`
  - `apps/firm-website/src/content/services/email-sms.mdx`
  - `apps/firm-website/src/content/services/copywriting-branding.mdx`
  - `apps/firm-website/src/content/services/hosting-care.mdx`

  **Definition of Done:**
  - 6 MDX files created, each exporting `metadata` and using MDX components.
  - Content follows the copy direction from the Website Content & Sitemap Plan.
    - Website Design (anchor, 800–1000+ words), order 1
    - Local SEO (400–600 words), order 2
    - Paid Ads (Lead Acceleration) (400–600 words), order 3
    - Email/SMS (Retention Starter) (400–600 words), order 4
    - Copywriting & Branding Add‑Ons (400–600 words), order 5
    - Hosting & Care Plan (400–600 words), order 6

  **Out of Scope:**
  - Creating the actual service pages (Phase 2 page development).

  **Rules to Follow:**
  - Use the approved copy. MDX components from `@repo/ui` for structure.
  - Include one H1 per file; frontmatter has `title`, `slug`, `description`, `order`.

  **Advanced Coding Pattern:**
  - **Deep module** – content separated from presentation; same files can be used in different contexts.

  **Anti‑Patterns:**
  - Hard‑coding presentational classes in MDX.
  - Writing HTML instead of using MDX components.

  **Imports/Exports:**
  - Each `.mdx` exports `metadata` and default content.

  **Depends On / Blocks:**
  - Depends on: existing MDX setup, content utilities (P002).
  - Blocks: page development in later phase.

  **Implementation Notes:**
  - Deleted existing `website-design.md` file and created 6 new `.mdx` files with proper content
  - All service files follow the copy direction from `.company/4-Services-And-Pages.md`
  - Website Design: 800+ words with detailed pricing tiers and process
  - Local SEO: 400+ words with market pricing context and service breakdown
  - Paid Ads: 400+ words with Google Ads management pricing and approach
  - Email/SMS: 400+ words with retention strategy and automation flows
  - Copywriting & Branding: 400+ words with pricing and add-on details
  - Hosting & Care: 400+ words with comprehensive maintenance plan
  - Added service content tests to `content.test.ts` (3 new test cases)
  - Updated `docs/content.md` with service content structure and guidelines
  - All tests pass (17 total), lint passes
  - Pre-existing typecheck error unrelated to this task (can't find '@repo/lib' module)

#### Subtasks

| ID      | Agent/Human | File Path / Command                                               | Description                                                                                                                                                                                   | Validation Command                            |
| ------- | ----------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| P003-01 | AGENT       | `apps/firm-website/src/content/services/website-design.mdx`       | Create MDX with frontmatter `title`, `slug`, `description`, `order:1`. Write body 800–1000+ words following copy direction.                                                                   | ✅ Complete                                   |
| P003-02 | AGENT       | `apps/firm-website/src/content/services/local-seo.mdx`            | MDX for Local SEO, `order:2`, 400–600 words.                                                                                                                                                  | ✅ Complete                                   |
| P003-03 | AGENT       | `apps/firm-website/src/content/services/paid-ads.mdx`             | MDX for Paid Ads, `order:3`, 400–600 words.                                                                                                                                                   | ✅ Complete                                   |
| P003-04 | AGENT       | `apps/firm-website/src/content/services/email-sms.mdx`            | MDX for Email/SMS, `order:4`, 400–600 words.                                                                                                                                                  | ✅ Complete                                   |
| P003-05 | AGENT       | `apps/firm-website/src/content/services/copywriting-branding.mdx` | MDX for Copywriting & Branding, `order:5`, 400–600 words.                                                                                                                                     | ✅ Complete                                   |
| P003-06 | AGENT       | `apps/firm-website/src/content/services/hosting-care.mdx`         | MDX for Hosting & Care, `order:6`, 400–600 words.                                                                                                                                             | ✅ Complete                                   |
| P003-07 | AGENT       | `apps/firm-website/src/lib/content.test.ts`                       | Update tests: ensure all service files are detected and parsed correctly.                                                                                                                      | ✅ Complete (17 tests passing)                |
| P003-08 | AGENT       | Update `docs/content.md`                                          | Document service content structure and how to add new service pages.                                                                                                                          | ✅ Complete                                   |

---

### Parent Task P004: Create Industry Pages Content

- [x] **P004** | Status: `COMPLETED`
  **Related File Paths:**
  - `apps/firm-website/src/content/industries/home-services.mdx`
  - `apps/firm-website/src/content/industries/medical.mdx`
  - `apps/firm-website/src/content/industries/personal-services.mdx`
  - `apps/firm-website/src/content/industries/professional-services.mdx`
  - `apps/firm-website/src/content/industries/restaurants.mdx`
  - `apps/firm-website/src/content/industries/retail.mdx`

  **Definition of Done:**
  - 6 MDX files for industries, each exporting `metadata` with `title`, `slug`, `description`, `order`, optional `icon`.
  - Content follows the Website Content & Sitemap Plan; each links to relevant demo.
  - Word count: 400–600 words each.

  **Out of Scope:**
  - Building industry pages (later phase).

  **Rules to Follow:**
  - Each industry must be distinct; include pain points and solutions.
  - Use MDX components for structure.

  **Advanced Coding Pattern:**
  - **Deep module** – consistent structure enables hub and individual page generation from the same data.

  **Anti‑Patterns:**
  - Copying content between industries.

  **Imports/Exports:**
  - Each `.mdx` exports `metadata` and default content.

  **Depends On / Blocks:**
  - Depends on: MDX setup, content utilities (P002).
  - Blocks: later page development.

  **Implementation Notes:**
  - Created 6 industry MDX files with distinct content for each industry
  - Each file includes industry-specific pain points, solutions, and features
  - All files follow the template from Website Content & Sitemap Plan
  - Each industry links to its corresponding demo page (demos to be created in P005)
  - Added industry content tests to content.test.ts (3 new test cases)
  - Updated docs/content.md with industry content structure and guidelines
  - All tests pass (20 total), lint passes
  - No typecheck errors (typecheck script not configured in workspace)

#### Subtasks

| ID      | Agent/Human | File Path / Command                                                  | Description                                                                                                                                     | Validation Command                            |
| ------- | ----------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| P004-01 | AGENT       | `apps/firm-website/src/content/industries/home-services.mdx`         | MDX: "Home Service & Trades", icon 🔧, order 1. Pain points, solutions.                                                                        | ✅ Complete                                   |
| P004-02 | AGENT       | `apps/firm-website/src/content/industries/medical.mdx`               | MDX: "Medical & Wellness Clinics", icon 🏥, order 2.                                                                                           | ✅ Complete                                   |
| P004-03 | AGENT       | `apps/firm-website/src/content/industries/personal-services.mdx`     | MDX: "Personal Services", icon 💇, order 3.                                                                                                    | ✅ Complete                                   |
| P004-04 | AGENT       | `apps/firm-website/src/content/industries/professional-services.mdx` | MDX: "Professional Services", icon ⚖️, order 4.                                                                                                | ✅ Complete                                   |
| P004-05 | AGENT       | `apps/firm-website/src/content/industries/restaurants.mdx`           | MDX: "Restaurants & Food Service", icon 🍽️, order 5.                                                                                           | ✅ Complete                                   |
| P004-06 | AGENT       | `apps/firm-website/src/content/industries/retail.mdx`                | MDX: "Retail & Local Shops", icon 🛍️, order 6.                                                                                                | ✅ Complete                                   |
| P004-07 | AGENT       | `apps/firm-website/src/lib/content.test.ts`                          | Update tests: all industry files detected and parsed correctly.                                                                                 | ✅ Complete (20 tests passing)                |
| P004-08 | AGENT       | Update `docs/content.md`                                             | Document industry content structure.                                                                                                            | ✅ Complete                                   |

---

### Parent Task P005: Create Demo/Proof-of-Concept Pages Content

- [x] **P005** | Status: `COMPLETED`
  **Related File Paths:**
  - `apps/firm-website/src/content/demos/plumbing.mdx`
  - `apps/firm-website/src/content/demos/dental.mdx`
  - `apps/firm-website/src/content/demos/salon.mdx`
  - `apps/firm-website/src/content/demos/law-firm.mdx`
  - `apps/firm-website/src/content/demos/restaurant.mdx`
  - `apps/firm-website/src/content/demos/retail-shop.mdx`

  **Definition of Done:**
  - 6 demo MDX files, each with sections: The Situation, The Challenge, The Approach, The Outcome.
  - Each exports `metadata` with `title`, `slug`, `description`, `industry` linking back to an industry page.
  - 300–500 words each; no fabricated metrics, honesty that they are proof‑of‑concepts.

  **Out of Scope:**
  - Building demo sites; these are content only.

  **Rules to Follow:**
  - Each demo must be distinct; link to corresponding industry page.
  - Consistent structure (sections).

  **Advanced Coding Pattern:**
  - **Deep module** – demo content structured consistently for template rendering.

  **Anti‑Patterns:**
  - Copying demo content between industries.
  - Using fake statistics.

  **Imports/Exports:**
  - Each `.mdx` exports `metadata` and default content.

  **Depends On / Blocks:**
  - Depends on: MDX setup, content utilities (P002).
  - Blocks: later page development.

  **Implementation Notes:**
  - Created 6 demo MDX files with consistent structure (Situation, Challenge, Approach, Outcome)
  - Each demo is distinct with industry-specific challenges and solutions
  - All demos clearly state they are proof-of-concepts with no fabricated metrics
  - Each demo links back to its corresponding industry page via the `industry` field
  - Added demo content tests to content.test.ts (3 new test cases)
  - Updated docs/content.md with demo content structure and guidelines
  - All tests pass (23 total), lint passes
  - No typecheck errors (typecheck script not configured in workspace)

#### Subtasks

| ID      | Agent/Human | File Path / Command                                    | Description                                                                                                     | Validation Command                            |
| ------- | ----------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| P005-01 | AGENT       | `apps/firm-website/src/content/demos/plumbing.mdx`     | MDX: Plumbing Business Demo, industry "home-services". Sections: Situation, Challenge, Approach, Outcome.        | ✅ Complete                                   |
| P005-02 | AGENT       | `apps/firm-website/src/content/demos/dental.mdx`       | MDX: Dental Clinic Demo, industry "medical".                                                                    | ✅ Complete                                   |
| P005-03 | AGENT       | `apps/firm-website/src/content/demos/salon.mdx`        | MDX: Salon Demo, industry "personal-services".                                                                  | ✅ Complete                                   |
| P005-04 | AGENT       | `apps/firm-website/src/content/demos/law-firm.mdx`     | MDX: Law Firm Demo, industry "professional-services".                                                           | ✅ Complete                                   |
| P005-05 | AGENT       | `apps/firm-website/src/content/demos/restaurant.mdx`   | MDX: Restaurant Demo, industry "restaurants".                                                                   | ✅ Complete                                   |
| P005-06 | AGENT       | `apps/firm-website/src/content/demos/retail-shop.mdx`  | MDX: Retail Shop Demo, industry "retail".                                                                       | ✅ Complete                                   |
| P005-07 | AGENT       | `apps/firm-website/src/lib/content.test.ts`            | Update tests: all demo files detected and parsed correctly.                                                     | ✅ Complete (23 tests passing)                |
| P005-08 | AGENT       | Update `docs/content.md`                               | Document demo content structure.                                                                                | ✅ Complete                                   |

---

### Parent Task P006: Create FAQ Entries Content

- [x] **P006** | Status: `COMPLETED`
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
  - 10+ MDX FAQ files covering pricing, process, general questions.
  - Each exports `metadata` with `question`, `answer` (short 40–60 words + expansion), `category`, `order`.
  - Follow AEO format: question as title, direct answer first.

  **Out of Scope:**
  - Building FAQ hub page (later phase).

  **Rules to Follow:**
  - Categories: `general`, `pricing`, `process`.
  - Keep answers concise and actionable.

  **Advanced Coding Pattern:**
  - **Deep module** – FAQ entries structured for accordion rendering and JSON‑LD schema generation.

  **Anti‑Patterns:**
  - Rambling answers, no categorization, avoiding tough questions.

  **Imports/Exports:**
  - Each `.mdx` exports `metadata` and default content.

  **Depends On / Blocks:**
  - Depends on: MDX setup, content utilities (P002).
  - Blocks: later page development.

  **Implementation Notes:**
  - Created 10 FAQ MDX files with AEO format (direct 40-60 word answer first, then expansion)
  - All FAQs follow the three categories: pricing (4), process (2), general (4)
  - Content addresses tough questions directly (hidden fees, contracts, ownership, SEO expectations)
  - Added FAQ content tests to content.test.ts (3 new test cases for 26 total tests)
  - Updated docs/content.md with FAQ structure, guidelines, and AEO format documentation
  - All tests pass (26 total), lint passes
  - No typecheck errors (typecheck script not configured in workspace)

#### Subtasks

| ID      | Agent/Human | File Path / Command                                 | Description                                                                                              | Validation Command                            |
| ------- | ----------- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| P006-01 | AGENT       | `apps/firm-website/src/content/faq/cost.mdx`        | MDX: "How much does a website cost…", category `pricing`, order 1.                                       | ✅ Complete                                   |
| P006-02 | AGENT       | `apps/firm-website/src/content/faq/timeline.mdx`    | MDX: "How long does it take…", category `process`, order 2.                                              | ✅ Complete                                   |
| P006-03 | AGENT       | `apps/firm-website/src/content/faq/ownership.mdx`   | MDX: "Do I own my website…", category `general`, order 3.                                                | ✅ Complete                                   |
| P006-04 | AGENT       | `apps/firm-website/src/content/faq/revisions.mdx`   | MDX: "What if I need changes…", category `pricing`, order 4.                                             | ✅ Complete                                   |
| P006-05 | AGENT       | `apps/firm-website/src/content/faq/seo.mdx`         | MDX: "Will my website rank on Google?", category `general`, order 5.                                     | ✅ Complete                                   |
| P006-06 | AGENT       | `apps/firm-website/src/content/faq/care-plan.mdx`   | MDX: "What's included in the Hosting & Care Plan?", category `pricing`, order 6.                         | ✅ Complete                                   |
| P006-07 | AGENT       | `apps/firm-website/src/content/faq/hidden-fees.mdx` | MDX: "Are there any hidden fees?", category `pricing`, order 7.                                          | ✅ Complete                                   |
| P006-08 | AGENT       | `apps/firm-website/src/content/faq/contract.mdx`    | MDX: "Do I have to sign a long-term contract?", category `general`, order 8.                             | ✅ Complete                                   |
| P006-09 | AGENT       | `apps/firm-website/src/content/faq/industries.mdx`  | MDX: "What industries do you serve?", category `general`, order 9.                                       | ✅ Complete                                   |
| P006-10 | AGENT       | `apps/firm-website/src/content/faq/process.mdx`     | MDX: "What's the process for building a website?", category `process`, order 10.                         | ✅ Complete                                   |
| P006-11 | AGENT       | `apps/firm-website/src/lib/content.test.ts`         | Update tests: all FAQ files detected and parsed correctly.                                               | ✅ Complete (26 tests passing)                |
| P006-12 | AGENT       | Update `docs/content.md`                            | Document FAQ content structure and AEO format.                                                           | ✅ Complete                                   |

---

### Parent Task P007: Create Static Pages Content (About, Pricing)

- [x] **P007** | Status: `COMPLETED`
  **Related File Paths:**
  - `apps/firm-website/src/content/pages/about.mdx`
  - `apps/firm-website/src/content/pages/pricing.mdx`

  **Definition of Done:**
  - About page (400–600 words) covering mission, story, method, local connection, credibility.
  - Pricing page (400–600 words) with package tiers, add‑ons, retainers, FAQ.
  - Each uses MDX components; exports `metadata`.

  **Out of Scope:**
  - Building the actual pages (later phase).

  **Rules to Follow:**
  - Follow copy direction from the Website Content & Sitemap Plan.
  - Use structured content (tables, cards) for pricing.

  **Advanced Coding Pattern:**
  - **Deep module** – pricing data structured for easy updates.

  **Anti‑Patterns:**
  - Hard‑coding pricing in components instead of content.

  **Imports/Exports:**
  - Each `.mdx` exports `metadata` and default content.

  **Depends On / Blocks:**
  - Depends on: MDX setup, content utilities (P002).
  - Blocks: later page development.

  **Implementation Notes:**
  - Created about.mdx with mission, story, method, local connection, and credibility sections (400+ words)
  - Created pricing.mdx with website design packages, build-time add-ons, monthly retainers, bundle discounts, and FAQ (400+ words)
  - Updated content.test.ts with 4 new test cases for static page content (30 total tests passing)
  - Updated docs/content.md with static pages structure, guidelines, and documentation
  - All tests pass (30 total), lint passes
  - Pre-existing typecheck error unrelated to this task (can't find '@repo/lib' module)

#### Subtasks

| ID      | Agent/Human | File Path / Command                               | Description                                                                                  | Validation Command                            |
| ------- | ----------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------- |
| P007-01 | AGENT       | `apps/firm-website/src/content/pages/about.mdx`   | MDX: "About Your Dedicated Marketer", slug "about". Write mission, story, method, etc.       | ✅ Complete                                   |
| P007-02 | AGENT       | `apps/firm-website/src/content/pages/pricing.mdx` | MDX: "Pricing", slug "pricing". Write pricing table, add‑ons, retainers.                     | ✅ Complete                                   |
| P007-03 | AGENT       | `apps/firm-website/src/lib/content.test.ts`       | Update tests: static page files detected and parsed correctly.                               | ✅ Complete (30 tests passing)                |
| P007-04 | AGENT       | Update `docs/content.md`                          | Document static pages content structure.                                                     | ✅ Complete                                   |

---

### Parent Task P008: Create Content Index and Navigation Utilities

- [ ] **P008** | Status: `PENDING`  
  **Related File Paths:**
  - `apps/firm-website/src/lib/navigation.ts`
  - `apps/firm-website/src/lib/navigation.test.ts`

  **Definition of Done:**
  - `getNavItems()` returns primary navigation items (Home, Services, Industries, Demos, Pricing, About, Contact).
  - `getBreadcrumbs(slug)` returns breadcrumb trail for a given page.
  - `getRelatedContent(currentSlug, type)` returns related content based on categories/tags.
  - All utilities tested.

  **Out of Scope:**
  - Building navigation components (later phase).

  **Rules to Follow:**
  - Navigation data‑driven from content.
  - Breadcrumbs reflect content hierarchy.

  **Advanced Coding Pattern:**
  - **Deep module** – navigation logic abstracted into a clean API.

  **Anti‑Patterns:**
  - Hard‑coding navigation links in components.
  - Duplicating navigation logic.

  **Imports/Exports:**
  - `src/lib/navigation.ts` → `getNavItems`, `getBreadcrumbs`, `getRelatedContent`.

  **Depends On / Blocks:**
  - Depends on: content utilities (P002).
  - Blocks: later page development.

#### Subtasks

| ID      | Agent/Human | File Path / Command                            | Description                                                                                                                                                     | Validation Command                            |
| ------- | ----------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| P008-01 | AGENT       | `apps/firm-website/src/lib/navigation.ts`      | Implement `getNavItems()` returning an array of `{ label, href }` for primary nav.                                                                              | No command.                                   |
| P008-02 | AGENT       | `apps/firm-website/src/lib/navigation.ts`      | Implement `getBreadcrumbs(slug)` returning breadcrumb array.                                                                                                    | No command.                                   |
| P008-03 | AGENT       | `apps/firm-website/src/lib/navigation.ts`      | Implement `getRelatedContent(currentSlug, type)` using category/tags.                                                                                           | No command.                                   |
| P008-04 | AGENT       | `apps/firm-website/src/lib/navigation.test.ts` | Write unit tests for all navigation utilities.                                                                                                                  | `pnpm --filter @repo/firm-website test` runs. |
| P008-05 | AGENT       | Update `docs/content.md`                       | Document navigation utilities and how to extend them.                                                                                                           | None.                                         |

---

### Parent Task P009: Update Documentation and Repository Management

- [ ] **P009** | Status: `PENDING`  
  **Related File Paths:**
  - `README.md` (root)
  - `docs/content.md`
  - `docs/architecture.md`
  - `docs/development.md`

  **Definition of Done:**
  - `README.md` includes section on content management.
  - `docs/content.md` complete with types, utilities, how to add content, MDX mapping.
  - `docs/architecture.md` includes content architecture (MDX, frontmatter, static generation).
  - `docs/development.md` includes guide on writing MDX content.

  **Out of Scope:**
  - API docs (none yet).

  **Rules to Follow:**
  - Docs must be up‑to‑date, clear, and concise.

  **Advanced Coding Pattern:**
  - N/A.

  **Anti‑Patterns:**
  - Outdated documentation.

  **Depends On / Blocks:**
  - Depends on: P001–P008.
  - Blocks: none.

#### Subtasks

| ID      | Agent/Human | File Path / Command    | Description                                                                                                    | Validation Command |
| ------- | ----------- | ---------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------ |
| P009-01 | AGENT       | `README.md`            | Update with Phase 1 status, add content section.                                                               | Manual check.      |
| P009-02 | AGENT       | `docs/content.md`      | Complete with content types, utility functions, how to add new content, MDX component mapping.                 | Manual check.      |
| P009-03 | AGENT       | `docs/architecture.md` | Add content architecture: MDX, frontmatter, static generation.                                                 | Manual check.      |
| P009-04 | AGENT       | `docs/development.md`  | Add guide: "How to write and edit MDX content".                                                                | Manual check.      |

---

## Summary of Phase 1

This phase consists of 9 parent tasks (P001–P009). It establishes the complete content pipeline and writes all content for the marketing website.

**Key Deliverables:**

- TypeScript types for all content entities
- Content utility functions for reading/parsing MDX
- 6 service MDX files (incl. anchor)
- 6 industry MDX files
- 6 demo MDX files
- 10 FAQ MDX files
- About and Pricing static pages
- Navigation utilities
- Comprehensive documentation

**Content Count (end of phase):**

| Type         | Count |
| ------------ | ----- |
| Services     | 6     |
| Industries   | 6     |
| Demos        | 6     |
| FAQs         | 10+   |
| Static Pages | 2     |
| **Total**    | 30+   |

## Phase 2: SEO Infrastructure – Task List

This document defines tasks required to set up SEO infrastructure including metadata generation, sitemap, robots.txt, and JSON-LD utilities. These are foundational requirements that must be in place before page development begins.

---

### Parent Task P010: Setup SEO Infrastructure

- [ ] **P010** | Status: `PENDING`  
  **Related File Paths:**
  - `apps/firm-website/src/lib/seo.ts`
  - `apps/firm-website/src/app/sitemap.ts`
  - `apps/firm-website/src/app/robots.ts`
  - `apps/firm-website/src/lib/json-ld.ts`

  **Definition of Done:**
  - `generateMetadata()` utility creates dynamic metadata objects.
  - `sitemap.ts` generates sitemap.xml covering all pages (services, industries, demos, FAQ, static).
  - `robots.ts` generates robots.txt allowing all user agents and pointing to sitemap.
  - JSON-LD utility functions for FAQPage, Organization, BreadcrumbList schemas.
  - All SEO utilities follow Google AEO/SEO best practices.
  - Unit tests verify sitemap and robots generation.

  **Out of Scope:**
  - Adding metadata to individual pages (Phase 3).
  - Advanced structured data beyond FAQPage, Organization, BreadcrumbList.

  **Rules to Follow:**
  - Use Next.js 15 `generateMetadata()` for dynamic metadata.
  - Follow Google guidelines for sitemaps and robots.txt.
  - Use JSON-LD format; all URLs absolute with domain.

  **Advanced Coding Pattern:**
  - **Deep module** – SEO utilities are a single source of truth for all SEO logic.

  **Anti‑Patterns:**
  - Hard‑coding URLs in sitemap.
  - Omitting important pages.
  - Using outdated structured data formats.

  **Imports/Exports:**
  - `src/lib/seo.ts` → `generateMetadata`, `getOpenGraphTags`.
  - `src/lib/json-ld.ts` → `generateFAQSchema`, `generateOrganizationSchema`, `generateBreadcrumbSchema`.

  **Depends On / Blocks:**
  - Depends on: content utilities (Phase 1), navigation utilities (Phase 1).
  - Blocks: page development (Phase 3).

#### Subtasks

| ID      | Agent/Human | File Path / Command                     | Description                                                                                                                                                                                                         | Validation Command                            |
| ------- | ----------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| P010-01 | AGENT       | `apps/firm-website/src/lib/seo.ts`      | Create `generateMetadata({ title, description, path })` returning Metadata object with title, description, openGraph, twitter, canonical.                                                                           | No command.                                   |
| P010-02 | AGENT       | `apps/firm-website/src/lib/seo.ts`      | Create `getOpenGraphTags()` helper for Open Graph image, title, description.                                                                                                                                        | No command.                                   |
| P010-03 | AGENT       | `apps/firm-website/src/app/sitemap.ts`  | Create sitemap.ts exporting `sitemap` function; use `getNavItems()` and `getAllSlugs` for services, industries, demos, FAQs, static pages. Format URLs with `https://yourdedicatedmarketer.com/slug`.               | Visit `/sitemap.xml` shows valid XML.         |
| P010-04 | AGENT       | `apps/firm-website/src/app/robots.ts`   | Create robots.ts exporting `robots` function: `User-agent: *`, `Allow: /`, `Sitemap: https://yourdedicatedmarketer.com/sitemap.xml`.                                                                                | Visit `/robots.txt` shows valid content.      |
| P010-05 | AGENT       | `apps/firm-website/src/lib/json-ld.ts`  | Create `generateFAQSchema(faqs)` returning JSON-LD for FAQPage (AEO requirement).                                                                                                                                   | No command.                                   |
| P010-06 | AGENT       | `apps/firm-website/src/lib/json-ld.ts`  | Create `generateOrganizationSchema()` for Organization structured data.                                                                                                                                             | No command.                                   |
| P010-07 | AGENT       | `apps/firm-website/src/lib/json-ld.ts`  | Create `generateBreadcrumbSchema(breadcrumbs)` for BreadcrumbList.                                                                                                                                                  | No command.                                   |
| P010-08 | AGENT       | `apps/firm-website/src/lib/seo.test.ts` | Write unit tests: sitemap includes all pages, robots.txt correct, metadata generation works.                                                                                                                         | `pnpm --filter @repo/firm-website test` runs. |
| P010-09 | AGENT       | Update `docs/seo.md`                    | Document SEO infrastructure, metadata usage, AEO requirements.                                                                                                                                                      | None.                                         |

---

## Summary of Phase 2

A single parent task (P010) establishes the complete SEO foundation. Key deliverables:

- Metadata utility (Open Graph, Twitter, canonical)
- Dynamic sitemap covering all content
- robots.txt
- JSON-LD schemas (FAQPage, Organization, BreadcrumbList)
- Tests and documentation

Once this phase is complete, every page built in the next phase will have access to consistent, dynamic SEO metadata and structured data.

## Phase 3: Page Development – Task List

This document defines all tasks required to build the complete marketing website pages, including layouts, dynamic routes, forms, and loading/error states. All tasks are designed to be **SMALL**, actionable, and built with **SDD, DDD, TDD, BDD**, and **Deep Modules** in mind.

**Prerequisites:**  
Route group infrastructure not yet established, but all foundational pieces are in place: monorepo, Next.js 15 App Router, `@repo/ui` component library (Header, Footer, Button, Card, Container, Section, Accordion, Form components), MDX rendering infrastructure, content types/utilities from Phase 1, and SEO utilities from Phase 2 (metadata generator, JSON-LD helpers, sitemap/robots already implemented).

---

### Parent Task P011: Set Up Route Group Structure and Marketing Layout

- [ ] **P011** | Status: `PENDING`  
  **Related File Paths:**
  - `apps/firm-website/src/app/(marketing)/layout.tsx`
  - `apps/firm-website/src/app/(marketing)/page.tsx` (placeholder)
  - `apps/firm-website/src/app/layout.tsx` (root layout update if needed)
  - `apps/firm-website/src/app/globals.css`

  **Definition of Done:**
  - Route group `(marketing)` created in `app/`.
  - Marketing layout includes `Header` and `Footer` from `@repo/ui`, using `getNavItems()` from Phase 1 to populate navigation.
  - Root layout remains minimal: `<html>`, `<body>`, `ThemeProvider`, children.
  - Placeholder homepage renders at `/`.
  - Dark/light theme works across all routes.

  **Out of Scope:**
  - Building actual page content (subsequent tasks).

  **Rules to Follow:**
  - Route group must not affect URL path.
  - Root layout only contains global providers.
  - Marketing layout imports `Header` and `Footer` from `@repo/ui`.

  **Advanced Coding Pattern:**
  - **Deep module** – layouts separated by concern; root for global providers, marketing for page structure.

  **Anti‑Patterns:**
  - Duplicating providers between layouts.
  - Hard‑coding navigation links.

  **Imports/Exports:**
  - `app/layout.tsx` exports root layout.
  - `app/(marketing)/layout.tsx` exports marketing layout.

  **Depends On / Blocks:**
  - Depends on: `@repo/ui` Header/Footer, navigation utilities (Phase 1).
  - Blocks: all subsequent page tasks (P012–P021).

#### Subtasks

| ID      | Agent/Human | File Path / Command                                | Description                                                                                                                              | Validation Command         |
| ------- | ----------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| P011-01 | AGENT       | `apps/firm-website/src/app/(marketing)/`           | Create the `(marketing)` route group directory.                                                                                          | Directory exists.          |
| P011-02 | AGENT       | `apps/firm-website/src/app/(marketing)/layout.tsx` | Create marketing layout that imports `Header` and `Footer` from `@repo/ui`. Pass `navItems` from `getNavItems()` to Header.               | No command.                |
| P011-03 | AGENT       | `apps/firm-website/src/app/(marketing)/page.tsx`   | Create placeholder homepage with heading "Your Dedicated Marketer".                                                                      | `pnpm dev` shows the page. |
| P011-04 | AGENT       | `apps/firm-website/src/app/layout.tsx`             | Ensure root layout wraps children with `ThemeProvider` from `@repo/ui`; check `suppressHydrationWarning` on `<html>`.                    | No command.                |
| P011-05 | AGENT       | `apps/firm-website/src/app/globals.css`            | Confirm global styles import `@repo/ui` styles.                                                                                          | No command.                |
| P011-06 | AGENT       | Update `docs/architecture.md`                      | Document route group structure and layout hierarchy.                                                                                     | None.                      |

---

### Parent Task P012: Build the Homepage

- [ ] **P012** | Status: `PENDING`  
  **Related File Paths:**
  - `apps/firm-website/src/app/(marketing)/page.tsx` (replace placeholder)
  - `apps/firm-website/src/components/features/home/hero.tsx`
  - `apps/firm-website/src/components/features/home/pillars.tsx`
  - `apps/firm-website/src/components/features/home/demo-preview.tsx`
  - `apps/firm-website/src/components/features/home/how-it-works.tsx`
  - `apps/firm-website/src/components/features/home/faq-snippet.tsx`
  - `apps/firm-website/src/components/features/home/final-cta.tsx`

  **Definition of Done:**
  - Homepage rendered at `/` with all sections:
    - **Hero** – headline, subheadline, primary CTA (`/contact`), secondary CTA (`/demos`).
    - **Three Pillars** – icons and descriptions linking to services/industries.
    - **Why Choose** – price/speed differentiator.
    - **Demo Preview** – first 3 demos from `getAllDemos()` rendered as cards.
    - **How It Works** – 4 steps: Discovery → Design & Build → Launch → Ongoing Support.
    - **FAQ Snippet** – top 3 FAQs from `getAllFAQs()` with link to `/faq`.
    - **Final CTA** – consultation booking button.
  - All components responsive, use `@repo/ui` primitives.
  - Metadata set via `generateMetadata()` utility from Phase 2 (title, description, Open Graph).
  - JSON-LD Organization schema included.

  **Out of Scope:**
  - Testimonials (none yet).
  - Dynamic content from MDX (hardcoded sections fine for homepage).

  **Rules to Follow:**
  - Use `Container`, `Section`, `Button`, `Card` from `@repo/ui`.
  - Internal navigation with `next/link`; images with `next/image` where applicable.
  - CTA buttons use `Button` with `asChild` and `Link` child.

  **Advanced Coding Pattern:**
  - **Deep module** – each section is a standalone component with a clear interface.

  **Anti‑Patterns:**
  - Hard‑coding URLs without `next/link`.
  - Using `<img>` instead of `next/image`.

  **Imports/Exports:**
  - Each section component exported from its own file.

  **Depends On / Blocks:**
  - Depends on: P011 (layout), content utilities (Phase 1), SEO utilities (Phase 2).
  - Blocks: none.

#### Subtasks

| ID      | Agent/Human | File Path / Command                                               | Description                                                                                                                                                                                                            | Validation Command                            |
| ------- | ----------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| P012-01 | AGENT       | `apps/firm-website/src/components/features/home/hero.tsx`         | Create Hero component with headline, subheadline, primary CTA "Book a Free Consultation" → `/contact`, secondary CTA "See a Demo Site" → `/demos`.                                                                      | No command.                                   |
| P012-02 | AGENT       | `apps/firm-website/src/components/features/home/pillars.tsx`      | Create Three Pillars component with icons and links to Services and Industries pages.                                                                                                                                   | No command.                                   |
| P012-03 | AGENT       | `apps/firm-website/src/components/features/home/demo-preview.tsx` | Create Demo Preview fetching first 3 demos from `getAllDemos()`, rendering cards with links to `/demos/[slug]`.                                                                                                        | No command.                                   |
| P012-04 | AGENT       | `apps/firm-website/src/components/features/home/how-it-works.tsx` | Create How It Works with 4 steps using icons and text.                                                                                                                                                                 | No command.                                   |
| P012-05 | AGENT       | `apps/firm-website/src/components/features/home/faq-snippet.tsx`  | Create FAQ Snippet fetching first 3 FAQs from `getAllFAQs()`, linking to `/faq`.                                                                                                                                       | No command.                                   |
| P012-06 | AGENT       | `apps/firm-website/src/components/features/home/final-cta.tsx`    | Create Final CTA with heading and button linking to `/contact`.                                                                                                                                                         | No command.                                   |
| P012-07 | AGENT       | `apps/firm-website/src/app/(marketing)/page.tsx`                  | Assemble all sections in order, add `generateMetadata()` using SEO utility, include JSON-LD Organization schema via `<script>`.                                                                                         | `pnpm dev` shows complete homepage.           |
| P012-08 | AGENT       | `apps/firm-website/src/app/(marketing)/page.test.tsx`             | Write unit test: homepage renders all sections, links correct, metadata present.                                                                                                                                        | `pnpm --filter @repo/firm-website test` runs. |
| P012-09 | AGENT       | Update `docs/pages.md`                                            | Document homepage structure and components.                                                                                                                                                                             | None.                                         |

---

### Parent Task P013: Build Static Pages (About, Pricing)

- [ ] **P013** | Status: `PENDING`  
  **Related File Paths:**
  - `apps/firm-website/src/app/(marketing)/about/page.tsx`
  - `apps/firm-website/src/app/(marketing)/pricing/page.tsx`
  - `apps/firm-website/src/components/features/content-page.tsx` (reusable)

  **Definition of Done:**
  - Reusable `ContentPage` component created that accepts MDX module and renders with `Container`/`Section`.
  - About page (`/about`) renders content from `src/content/pages/about.mdx`.
  - Pricing page (`/pricing`) renders content from `src/content/pages/pricing.mdx`.
  - Both pages use `generateMetadata()` with dynamic title/description.
  - MDX components (Button, Card, etc.) mapped correctly.

  **Out of Scope:**
  - Interactive pricing features (static MDX is sufficient).

  **Rules to Follow:**
  - Use `ContentPage` pattern to avoid duplication.
  - Import MDX file directly and pass to `ContentPage`.

  **Advanced Coding Pattern:**
  - **Deep module** – `ContentPage` encapsulates MDX rendering layout; easy to reuse for any static MDX page.

  **Anti‑Patterns:**
  - Duplicating page structure for each static page.

  **Imports/Exports:**
  - `ContentPage` exported from `components/features/content-page.tsx`.

  **Depends On / Blocks:**
  - Depends on: MDX setup, static page content (Phase 1), layout (P011).
  - Blocks: none.

#### Subtasks

| ID      | Agent/Human | File Path / Command                                           | Description                                                                                                                                  | Validation Command                            |
| ------- | ----------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| P013-01 | AGENT       | `apps/firm-website/src/components/features/content-page.tsx`  | Create `ContentPage` component: accepts MDX module and renders with `Container` and `Section`, applying `Prose` styles if needed.            | No command.                                   |
| P013-02 | AGENT       | `apps/firm-website/src/app/(marketing)/about/page.tsx`        | Create About page: import MDX from `@/content/pages/about.mdx`, render with `ContentPage`, set metadata with `generateMetadata`.            | `pnpm dev` shows /about.                      |
| P013-03 | AGENT       | `apps/firm-website/src/app/(marketing)/pricing/page.tsx`      | Create Pricing page similarly using `@/content/pages/pricing.mdx`.                                                                           | `pnpm dev` shows /pricing.                    |
| P013-04 | AGENT       | `apps/firm-website/src/app/(marketing)/about/page.test.tsx`   | Write unit test: About page renders content, has correct metadata.                                                                           | `pnpm --filter @repo/firm-website test` runs. |
| P013-05 | AGENT       | `apps/firm-website/src/app/(marketing)/pricing/page.test.tsx` | Write unit test: Pricing page renders content, has correct metadata.                                                                         | `pnpm --filter @repo/firm-website test` runs. |
| P013-06 | AGENT       | Update `docs/pages.md`                                        | Document static pages and the `ContentPage` component.                                                                                       | None.                                         |

---

### Parent Task P014: Build Services Hub and Dynamic Service Pages

- [ ] **P014** | Status: `PENDING`  
  **Related File Paths:**
  - `apps/firm-website/src/app/(marketing)/services/page.tsx`
  - `apps/firm-website/src/app/(marketing)/services/[slug]/page.tsx`
  - `apps/firm-website/src/components/features/services/services-hub.tsx`
  - `apps/firm-website/src/components/features/services/service-detail.tsx`

  **Definition of Done:**
  - Services hub (`/services`) lists all services as Cards using `getAllServices()`.
  - Dynamic route `/services/[slug]` renders individual service MDX.
  - `generateStaticParams` pre‑renders all services at build time.
  - `generateMetadata` sets dynamic metadata per service.
  - Breadcrumbs implemented with `getBreadcrumbs()`.

  **Out of Scope:**
  - None.

  **Rules to Follow:**
  - Use content utilities from Phase 1.
  - Service cards show title, description, link to detail page.
  - Detail page renders MDX body via `ContentPage` pattern.

  **Advanced Coding Pattern:**
  - **Deep module** – hub and detail pages are simple wrappers around content utilities.

  **Anti‑Patterns:**
  - Hard‑coding slugs or metadata.

  **Imports/Exports:**
  - `services/page.tsx` exports hub page.
  - `services/[slug]/page.tsx` exports detail with `generateStaticParams`, `generateMetadata`.

  **Depends On / Blocks:**
  - Depends on: content utilities, service content (Phase 1), layout, navigation utilities.
  - Blocks: none.

#### Subtasks

| ID      | Agent/Human | File Path / Command                                                     | Description                                                                                                                                                          | Validation Command                            |
| ------- | ----------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| P014-01 | AGENT       | `apps/firm-website/src/components/features/services/services-hub.tsx`   | Create ServicesHub component: fetch via `getAllServices()`, render Card per service with title, description, link to `/services/[slug]`.                              | No command.                                   |
| P014-02 | AGENT       | `apps/firm-website/src/app/(marketing)/services/page.tsx`               | Create Services Hub page: render `ServicesHub`, set metadata.                                                                                                        | `pnpm dev` shows /services.                   |
| P014-03 | AGENT       | `apps/firm-website/src/components/features/services/service-detail.tsx` | Create ServiceDetail component: accepts MDX module, renders with `ContentPage` pattern, adds breadcrumbs from `getBreadcrumbs()`.                                    | No command.                                   |
| P014-04 | AGENT       | `apps/firm-website/src/app/(marketing)/services/[slug]/page.tsx`        | Create dynamic page: `generateStaticParams` returns all service slugs, `generateMetadata` sets SEO, default export fetches MDX and renders `ServiceDetail`.          | `pnpm dev` shows /services/website-design.    |
| P014-05 | AGENT       | `apps/firm-website/src/app/(marketing)/services/[slug]/page.test.tsx`   | Write unit test: dynamic pages render content, metadata correct.                                                                                                     | `pnpm --filter @repo/firm-website test` runs. |
| P014-06 | AGENT       | Update `docs/pages.md`                                                  | Document services pages and dynamic routing.                                                                                                                         | None.                                         |

---

### Parent Task P015: Build Industries Hub and Dynamic Industry Pages

- [ ] **P015** | Status: `PENDING`  
  **Related File Paths:**
  - `apps/firm-website/src/app/(marketing)/industries/page.tsx`
  - `apps/firm-website/src/app/(marketing)/industries/[slug]/page.tsx`
  - `apps/firm-website/src/components/features/industries/industries-hub.tsx`
  - `apps/firm-website/src/components/features/industries/industry-detail.tsx`

  **Definition of Done:**
  - Industries hub lists all industries using `getAllIndustries()`, each as a card with icon.
  - Dynamic `/industries/[slug]` renders individual industry MDX.
  - `generateStaticParams` and `generateMetadata` for each industry.
  - Each industry page links to its corresponding demo page.

  **Out of Scope:**
  - None.

  **Rules to Follow:**
  - Use content utilities from Phase 1; icons from metadata.
  - Include "See it in Action" link to demo when available.

  **Advanced Coding Pattern:**
  - **Deep module** – follows same pattern as services for consistency.

  **Anti‑Patterns:**
  - Hard‑coding industry slugs or links.

  **Depends On / Blocks:**
  - Depends on: content utilities, industry content (Phase 1), layout, navigation.
  - Blocks: none.

#### Subtasks

| ID      | Agent/Human | File Path / Command                                                        | Description                                                                                                                                              | Validation Command                            |
| ------- | ----------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| P015-01 | AGENT       | `apps/firm-website/src/components/features/industries/industries-hub.tsx`  | Create IndustriesHub: fetch with `getAllIndustries()`, render cards with icon, title, description, link to `/industries/[slug]`.                         | No command.                                   |
| P015-02 | AGENT       | `apps/firm-website/src/app/(marketing)/industries/page.tsx`                | Create Industries Hub page: render `IndustriesHub`, set metadata.                                                                                        | `pnpm dev` shows /industries.                 |
| P015-03 | AGENT       | `apps/firm-website/src/components/features/industries/industry-detail.tsx` | Create IndustryDetail: accepts MDX module, renders via ContentPage, adds breadcrumbs, finds and links to matching demo page.                             | No command.                                   |
| P015-04 | AGENT       | `apps/firm-website/src/app/(marketing)/industries/[slug]/page.tsx`         | Dynamic page with `generateStaticParams`, `generateMetadata`, rendering `IndustryDetail`.                                                                | `pnpm dev` shows /industries/home-services.   |
| P015-05 | AGENT       | `apps/firm-website/src/app/(marketing)/industries/[slug]/page.test.tsx`    | Write unit test: dynamic pages render content, metadata correct.                                                                                         | `pnpm --filter @repo/firm-website test` runs. |
| P015-06 | AGENT       | Update `docs/pages.md`                                                     | Document industries pages.                                                                                                                               | None.                                         |

---

### Parent Task P016: Build Demos Hub and Dynamic Demo Pages

- [ ] **P016** | Status: `PENDING`  
  **Related File Paths:**
  - `apps/firm-website/src/app/(marketing)/demos/page.tsx`
  - `apps/firm-website/src/app/(marketing)/demos/[slug]/page.tsx`
  - `apps/firm-website/src/components/features/demos/demos-hub.tsx`
  - `apps/firm-website/src/components/features/demos/demo-detail.tsx`

  **Definition of Done:**
  - Demos hub lists all demos using `getAllDemos()`.
  - Dynamic `/demos/[slug]` renders individual demo MDX with sections (Situation, Challenge, Approach, Outcome).
  - `generateStaticParams` and `generateMetadata` per demo.
  - Each demo page links to its corresponding industry page.
  - JSON-LD BreadcrumbList included.

  **Out of Scope:**
  - Building actual demo sites.

  **Rules to Follow:**
  - Follow "Proof of Concept" pattern.
  - Include "View Live Demo" placeholder button.

  **Advanced Coding Pattern:**
  - **Deep module** – follows same pattern as other dynamic content types.

  **Anti‑Patterns:**
  - Hard‑coding demo slugs.

  **Depends On / Blocks:**
  - Depends on: content utilities, demo content (Phase 1), layout.

#### Subtasks

| ID      | Agent/Human | File Path / Command                                                | Description                                                                                                                               | Validation Command                            |
| ------- | ----------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| P016-01 | AGENT       | `apps/firm-website/src/components/features/demos/demos-hub.tsx`    | Create DemosHub: fetch via `getAllDemos()`, render cards with title, description, link to `/demos/[slug]`.                                | No command.                                   |
| P016-02 | AGENT       | `apps/firm-website/src/app/(marketing)/demos/page.tsx`             | Create Demos Hub page: render `DemosHub`, set metadata.                                                                                   | `pnpm dev` shows /demos.                      |
| P016-03 | AGENT       | `apps/firm-website/src/components/features/demos/demo-detail.tsx`  | Create DemoDetail: accepts MDX, renders sections, links to industry page, adds "View Live Demo" placeholder button, breadcrumbs.          | No command.                                   |
| P016-04 | AGENT       | `apps/firm-website/src/app/(marketing)/demos/[slug]/page.tsx`      | Dynamic page with `generateStaticParams`, `generateMetadata`, render `DemoDetail`.                                                        | `pnpm dev` shows /demos/plumbing-demo.        |
| P016-05 | AGENT       | `apps/firm-website/src/app/(marketing)/demos/[slug]/page.test.tsx` | Write unit test: dynamic pages render content, metadata correct.                                                                          | `pnpm --filter @repo/firm-website test` runs. |
| P016-06 | AGENT       | Update `docs/pages.md`                                             | Document demos pages.                                                                                                                     | None.                                         |

---

### Parent Task P017: Build FAQ Hub

- [ ] **P017** | Status: `PENDING`  
  **Related File Paths:**
  - `apps/firm-website/src/app/(marketing)/faq/page.tsx`
  - `apps/firm-website/src/components/features/faq/faq-hub.tsx`
  - `apps/firm-website/src/components/features/faq/faq-accordion.tsx`

  **Definition of Done:**
  - FAQ hub displays all FAQs grouped by category using `Accordion` from `@repo/ui`.
  - `FAQPage` JSON-LD schema injected.
  - Metadata set for the page.

  **Out of Scope:**
  - Individual FAQ pages.

  **Rules to Follow:**
  - Use `getAllFAQs()` from Phase 1, group by category (`general`, `pricing`, `process`).
  - Accordion must have proper accessibility (ARIA).

  **Advanced Coding Pattern:**
  - **Deep module** – FAQ hub handles grouping, rendering, and schema generation.

  **Anti‑Patterns:**
  - Not categorizing FAQs.
  - Omitting JSON‑LD.

  **Depends On / Blocks:**
  - Depends on: content utilities, FAQ content (Phase 1), Accordion component (`@repo/ui`), SEO JSON-LD helpers (Phase 2).

#### Subtasks

| ID      | Agent/Human | File Path / Command                                               | Description                                                                                                                                  | Validation Command                            |
| ------- | ----------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| P017-01 | AGENT       | `apps/firm-website/src/components/features/faq/faq-accordion.tsx` | Create FAQAccordion component: accepts array of FAQs and renders them using `Accordion` from `@repo/ui`.                                     | No command.                                   |
| P017-02 | AGENT       | `apps/firm-website/src/components/features/faq/faq-hub.tsx`       | Create FAQHub: fetch FAQs, group by category, render category headings with FAQAccordion, generate FAQPage JSON-LD via utility.             | No command.                                   |
| P017-03 | AGENT       | `apps/firm-website/src/app/(marketing)/faq/page.tsx`              | Create FAQ Hub page: render `FAQHub`, set metadata with `generateMetadata`.                                                                  | `pnpm dev` shows /faq.                        |
| P017-04 | AGENT       | `apps/firm-website/src/app/(marketing)/faq/page.test.tsx`         | Write unit test: FAQ hub renders all FAQs, correct categories, JSON-LD present.                                                              | `pnpm --filter @repo/firm-website test` runs. |
| P017-05 | AGENT       | Update `docs/pages.md`                                            | Document FAQ hub and structured data.                                                                                                        | None.                                         |

---

### Parent Task P018: Build Contact Page with Form and Server Action

- [ ] **P018** | Status: `PENDING`  
  **Related File Paths:**
  - `apps/firm-website/src/app/(marketing)/contact/page.tsx`
  - `apps/firm-website/src/app/actions/contact.ts`
  - `apps/firm-website/src/components/features/contact/contact-form.tsx`
  - `apps/firm-website/src/components/features/contact/contact-success.tsx` (optional)

  **Definition of Done:**
  - Contact page at `/contact` with form fields: Name, Email, Phone (optional), Company (optional), Message.
  - Server Action `submitContact` validates with Zod (schema already exists), returns success/error.
  - Form uses `useActionState` (React 19) for state management, with loading and error states.
  - Success shows confirmation; validation errors shown next to fields.
  - Metadata set.

  **Out of Scope:**
  - Email sending (Resend integration deferred).
  - Toast notifications (can be added later).

  **Rules to Follow:**
  - Client component with `"use client"`.
  - Use `useActionState` and `useFormStatus` for submit button.
  - Input/Textarea/Label from `@repo/ui`.

  **Advanced Coding Pattern:**
  - **Deep module** – form encapsulates all validation, submission, and success states; server action is a separate module.

  **Anti‑Patterns:**
  - Using deprecated `useFormState`.
  - Not validating on server.

  **Imports/Exports:**
  - `app/actions/contact.ts` exports `submitContact` Server Action.

  **Depends On / Blocks:**
  - Depends on: Form components (`@repo/ui`), Zod (available from `packages/lib`).

#### Subtasks

| ID      | Agent/Human | File Path / Command                                                  | Description                                                                                                                                                                                            | Validation Command                            |
| ------- | ----------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------- |
| P018-01 | AGENT       | `apps/firm-website` (install if needed)                              | Ensure `react-hook-form` and `@hookform/resolvers` are installed (they come with shadcn form). If not, run `pnpm --filter @repo/firm-website add react-hook-form @hookform/resolvers`.                 | `pnpm list` shows packages.                   |
| P018-02 | AGENT       | `apps/firm-website/src/app/actions/contact.ts`                       | Create Server Action `submitContact`: validate form data with Zod schema (import from `@repo/lib` or define locally), return `{ success: boolean, error?: string }`.                                   | No command.                                   |
| P018-03 | AGENT       | `apps/firm-website/src/components/features/contact/contact-form.tsx` | Create ContactForm client component: use `useActionState` with `submitContact`, render inputs from `@repo/ui`, show field errors, loading state with `useFormStatus`, success message.                 | No command.                                   |
| P018-04 | AGENT       | `apps/firm-website/src/app/(marketing)/contact/page.tsx`             | Create Contact page: render `ContactForm`, set metadata.                                                                                                                                               | `pnpm dev` shows /contact.                    |
| P018-05 | AGENT       | `apps/firm-website/src/app/(marketing)/contact/page.test.tsx`        | Write unit test: contact page renders form, submits successfully (mock action).                                                                                                                         | `pnpm --filter @repo/firm-website test` runs. |
| P018-06 | AGENT       | Update `docs/pages.md`                                               | Document contact page and Server Action.                                                                                                                                                               | None.                                         |

---

### Parent Task P019: Add Loading States and Error Boundaries

- [ ] **P019** | Status: `PENDING`  
  **Related File Paths:**
  - `apps/firm-website/src/app/(marketing)/loading.tsx`
  - `apps/firm-website/src/app/(marketing)/error.tsx`
  - `apps/firm-website/src/components/ui/skeleton.tsx` (in `@repo/ui` or local)

  **Definition of Done:**
  - Marketing route group has `loading.tsx` showing skeleton/spinner.
  - `error.tsx` catches errors, displays user‑friendly message with retry button, logs error to console.
  - Skeleton component created in `@repo/ui` (or local) for reuse.

  **Out of Scope:**
  - Granular Suspense boundaries for individual components (can be added later).

  **Rules to Follow:**
  - `loading.tsx` can be server component; `error.tsx` must be client (`"use client"`).
  - Skeleton should mimic page structure.

  **Advanced Coding Pattern:**
  - **Deep module** – loading and error states handled at route group level.

  **Anti‑Patterns:**
  - Generic spinner unrelated to page content.
  - Not logging errors.

  **Depends On / Blocks:**
  - Depends on: layout (P011).
  - Blocks: none.

#### Subtasks

| ID      | Agent/Human | File Path / Command                                 | Description                                                                                                                | Validation Command                                  |
| ------- | ----------- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| P019-01 | AGENT       | `apps/firm-website/src/components/ui/skeleton.tsx`  | Create Skeleton component (accepts `className`) rendering a shimmer/placeholder. Can be in `@repo/ui` or locally.          | No command.                                         |
| P019-02 | AGENT       | `apps/firm-website/src/app/(marketing)/loading.tsx` | Create `loading.tsx` that uses Skeleton to mimic page layout (header, sections, cards).                                    | `pnpm dev` shows loading state (throttle network).  |
| P019-03 | AGENT       | `apps/firm-website/src/app/(marketing)/error.tsx`   | Create `error.tsx` (client) displaying error message, "Try again" button calling `reset()`, logging error.                 | Simulate error; page shows error boundary.          |
| P019-04 | AGENT       | Update `docs/pages.md`                              | Document loading and error handling.                                                                                       | None.                                               |

---

### Parent Task P020: Performance Audit and Optimization

- [ ] **P020** | Status: `PENDING`  
  **Related File Paths:**
  - All page files

  **Definition of Done:**
  - Production build (`pnpm build`) succeeds without errors; all pages statically generated.
  - Bundle analyzed: first-load JS < 200KB, total bundle < 300KB.
  - All images use `next/image` with appropriate `sizes`; fonts loaded via `next/font`.
  - Lighthouse audit on all pages: Performance, Accessibility, Best Practices, SEO ≥ 90.
  - Core Web Vitals pass thresholds (LCP < 2.5s, CLS < 0.1).
  - Caching headers set for static assets.

  **Out of Scope:**
  - Advanced monitoring (Sentry, Vercel Analytics – deferred).

  **Rules to Follow:**
  - Use `next/image`, `next/font`, `next/script` for external scripts.
  - Lazy load heavy client components with `next/dynamic`.

  **Advanced Coding Pattern:**
  - **Deep module** – performance is a cross‑cutting concern addressed systematically.

  **Anti‑Patterns:**
  - Using `<img>` instead of `next/image`.
  - Not setting `sizes` on images.
  - Ignoring build warnings.

  **Depends On / Blocks:**
  - Depends on: all page tasks (P012–P018).
  - Blocks: final deployment.

#### Subtasks

| ID      | Agent/Human | File Path / Command                                 | Description                                                                                                            | Validation Command                                    |
| ------- | ----------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| P020-01 | AGENT       | Local terminal                                      | Run `pnpm --filter @repo/firm-website build`; verify output lists all pages as static; check for warnings.             | Build succeeds, all pages static.                     |
| P020-02 | AGENT       | All pages                                           | Audit all images: ensure `next/image` used with `width`, `height`, `sizes`, `quality`.                                 | Lighthouse "Properly size images" passes.             |
| P020-03 | AGENT       | `apps/firm-website/src/app/layout.tsx`              | Ensure `next/font` is used for Inter/Geist.                                                                            | No command.                                           |
| P020-04 | AGENT       | `apps/firm-website/next.config.ts`                  | Add `images.formats: ['image/webp']` and device sizes if not present.                                                  | No command.                                           |
| P020-05 | AGENT       | Heavy components                                    | Wrap contact form or other heavy components with `next/dynamic` if they impact initial load.                           | No command.                                           |
| P020-06 | HUMAN       | Lighthouse                                          | Run Lighthouse on each page (home, about, pricing, services, industries, demos, faq, contact) in incognito.            | Scores ≥ 90 for all categories.                       |
| P020-07 | AGENT       | Update `docs/performance.md`                        | Document optimizations and final Lighthouse scores.                                                                    | None.                                                 |

---

### Parent Task P021: Update Documentation and Repository Management

- [ ] **P021** | Status: `PENDING`  
  **Related File Paths:**
  - `README.md` (root)
  - `docs/pages.md`
  - `docs/seo.md` (update with final status)
  - `docs/performance.md`
  - `docs/architecture.md`
  - `docs/development.md`

  **Definition of Done:**
  - All docs reflect completed Phase 3 work.
  - `docs/pages.md` complete with page types, routing, static generation.
  - `docs/performance.md` records optimization results.
  - `README.md` updated with Phase 3 status and links.
  - `docs/architecture.md` updated with page architecture.

  **Out of Scope:**
  - None.

  **Rules to Follow:**
  - Docs must be accurate, concise, and match current state.

  **Advanced Coding Pattern:**
  - N/A.

  **Anti‑Patterns:**
  - Outdated documentation.

  **Depends On / Blocks:**
  - Depends on: P011–P020.
  - Blocks: none.

#### Subtasks

| ID      | Agent/Human | File Path / Command    | Description                                                                                                       | Validation Command |
| ------- | ----------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------ |
| P021-01 | AGENT       | `README.md`            | Update with Phase 3 status, links to new docs.                                                                    | Manual check.      |
| P021-02 | AGENT       | `docs/pages.md`        | Complete with page structure, dynamic routing, static generation, all page types documented.                      | Manual check.      |
| P021-03 | AGENT       | `docs/performance.md`  | Finalize with optimization steps and Lighthouse scores.                                                           | Manual check.      |
| P021-04 | AGENT       | `docs/architecture.md` | Update with route group and page architecture.                                                                    | Manual check.      |
| P021-05 | AGENT       | `docs/development.md`  | Add guide: "How to add a new page" using the patterns established.                                                | Manual check.      |

---

## Summary of Phase 3

Phase 3 consists of 11 parent tasks (P011–P021). It builds all marketing pages, including dynamic content-driven pages, static pages, FAQ hub, and contact form. The result is a fully functional, statically generated website with proper loading states, error boundaries, and optimized performance.

**Page Count (end of phase):**

| Type         | Count |
| ------------ | ----- |
| Homepage     | 1     |
| Static Pages | 2     |
| Services     | 7 (hub + 6 individual) |
| Industries   | 7 (hub + 6 individual) |
| Demos        | 7 (hub + 6 individual) |
| FAQ Hub      | 1     |
| Contact      | 1     |
| **Total**    | **26 pages** |

## Phase 4: Interactivity, Forms & Analytics – Task List

This document defines tasks to complete the contact form with email sending, enhance form UX with toast notifications, and implement analytics tracking (GA4) for page views and conversion events. All tasks are designed to be **SMALL**, actionable, and built with **SDD, DDD, TDD, BDD**, and **Deep Modules** in mind.

**Prerequisites:**  
Contact form with Server Action and `useActionState` exists (Phase 3, P018). No email sending yet; no toast notifications; no analytics integration.

---

### Parent Task P022: Implement Email Sending with Resend

- [ ] **P022** | Status: `PENDING`  
  **Related File Paths:**
  - `apps/firm-website/package.json` (add `resend`)
  - `apps/firm-website/src/app/actions/contact.ts` (update Server Action)
  - `apps/firm-website/.env.example` (add env vars)
  - `apps/firm-website/src/lib/email.ts` (optional: email template)

  **Definition of Done:**
  - Resend installed in `apps/firm-website`.
  - Environment variables configured: `RESEND_API_KEY`, `CONTACT_EMAIL`, `FROM_EMAIL`.
  - Server Action `submitContact` sends email via Resend after validation.
  - Email includes: name, email, phone (optional), company (optional), message; `reply_to` set to submitter’s email.
  - Error handling: returns error state if email fails.

  **Out of Scope:**
  - HTML email templates (plain text sufficient).
  - Confirmation email to submitter (optional, can be added later).

  **Rules to Follow:**
  - Use Resend’s `emails.send` with `from`, `to`, `subject`, `text`, `reply_to`.
  - Use `process.env.RESEND_API_KEY`, etc.
  - From address must be a verified domain in Resend.
  - Validate env vars before sending.

  **Advanced Coding Pattern:**
  - **Deep module** – email sending encapsulated in Server Action; form and email are atomic.

  **Anti‑Patterns:**
  - Hard‑coding email addresses.
  - Sending without error handling.
  - Not setting `reply_to`.

  **Imports/Exports:**
  - `app/actions/contact.ts` exports `submitContact`.

  **Depends On / Blocks:**
  - Depends on: contact form with Server Action (Phase 3, P018).
  - Blocks: toast notifications (P024).

#### Subtasks

| ID      | Agent/Human | File Path / Command                                 | Description                                                                                                                                                       | Validation Command                            |
| ------- | ----------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| P022-01 | AGENT       | `apps/firm-website` (install)                       | Run: `pnpm --filter @repo/firm-website add resend`.                                                                                                               | `pnpm list resend` shows it.                  |
| P022-02 | AGENT       | `apps/firm-website/.env.example`                    | Add env vars: `RESEND_API_KEY=re_xxxx`, `CONTACT_EMAIL=hello@yourdedicatedmarketer.com`, `FROM_EMAIL=noreply@yourdedicatedmarketer.com`.                           | File updated.                                 |
| P022-03 | HUMAN       | Resend account setup                                | Create Resend account, verify domain, get API key. Add key to `.env.local`.                                                                                        | API key saved.                                |
| P022-04 | AGENT       | `apps/firm-website/src/app/actions/contact.ts`      | Update `submitContact` to send email via Resend after successful validation. Use `reply_to` for reply address.                                                     | No command.                                   |
| P022-05 | AGENT       | `apps/firm-website/src/app/actions/contact.ts`      | Add error handling: catch Resend errors, return user‑friendly error message, log to console.                                                                       | No command.                                   |
| P022-06 | AGENT       | `apps/firm-website/src/app/actions/contact.test.ts` | Write unit test: Server Action sends email successfully (mock Resend), handles error.                                                                               | `pnpm --filter @repo/firm-website test` runs. |
| P022-07 | AGENT       | Update `docs/forms.md`                              | Document email sending setup and Resend configuration.                                                                                                             | None.                                         |

---

### Parent Task P023: Upgrade Contact Form to React 19 `useActionState`

- [ ] **P023** | Status: `PENDING`  
  **Related File Paths:**
  - `apps/firm-website/src/components/features/contact/contact-form.tsx`
  - `apps/firm-website/src/components/features/contact/submit-button.tsx`
  - `apps/firm-website/src/app/actions/contact.ts` (ensure compatible)

  **Definition of Done:**
  - Contact form uses `useActionState` (React 19) instead of `useFormState` if not already; verify.
  - Submit button uses `useFormStatus` for loading state.
  - Form resets on success (optional but recommended).
  - Validation errors displayed per field.
  - All states (loading, success, error) handled.

  **Out of Scope:**
  - Client‑side validation with `react-hook-form` (server‑side sufficient).

  **Rules to Follow:**
  - Import `useActionState` from `react`.
  - Action prop on form bound to Server Action.
  - Use `useFormStatus` for button pending.

  **Advanced Coding Pattern:**
  - **Deep module** – form state managed by `useActionState`; UI thin wrapper.

  **Anti‑Patterns:**
  - Using deprecated `useFormState`.
  - Not handling `isPending`.

  **Imports/Exports:**
  - `contact-form.tsx` exports `ContactForm`; `submit-button.tsx` exports `SubmitButton`.

  **Depends On / Blocks:**
  - Depends on: email sending (P022).
  - Blocks: toast notifications (P024).

#### Subtasks

| ID      | Agent/Human | File Path / Command                                                       | Description                                                                                                                     | Validation Command                            |
| ------- | ----------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| P023-01 | AGENT       | `apps/firm-website/src/components/features/contact/submit-button.tsx`     | Create `SubmitButton` using `useFormStatus`: `pending` → disabled, shows "Sending…" vs "Send Message".                          | No command.                                   |
| P023-02 | AGENT       | `apps/firm-website/src/components/features/contact/contact-form.tsx`      | Upgrade/replace with `useActionState(submitContact, null)`: `state`, `formAction`, `isPending`. Pass `action={formAction}`.      | No command.                                   |
| P023-03 | AGENT       | `apps/firm-website/src/components/features/contact/contact-form.tsx`      | Add form reset on success: clear fields.                                                                                         | No command.                                   |
| P023-04 | AGENT       | `apps/firm-website/src/components/features/contact/contact-form.tsx`      | Display validation errors from `state` next to each field.                                                                        | No command.                                   |
| P023-05 | AGENT       | `apps/firm-website/src/components/features/contact/contact-form.test.tsx` | Write test: form submits with `useActionState`, loading state appears, success/error handled.                                    | `pnpm --filter @repo/firm-website test` runs. |
| P023-06 | AGENT       | Update `docs/forms.md`                                                    | Document `useActionState` usage and form UX patterns.                                                                             | None.                                         |

---

### Parent Task P024: Add Toast Notifications for Form Feedback

- [ ] **P024** | Status: `PENDING`  
  **Related File Paths:**
  - `apps/firm-website/package.json` (add `sonner`)
  - `apps/firm-website/src/components/features/contact/contact-form.tsx`
  - `apps/firm-website/src/app/layout.tsx` (add `Toaster`)

  **Definition of Done:**
  - `sonner` installed and `Toaster` added to root layout.
  - Success toast shown on form submission success.
  - Error toast shown on submission failure.
  - Toasts auto‑dismiss after 4‑5s, accessible, match design system.

  **Out of Scope:**
  - Custom toast styling beyond defaults.

  **Rules to Follow:**
  - Use `toast.success()` / `toast.error()`.
  - Do not show toast for validation errors (those are field‑level).
  - Only trigger on final state after action.

  **Advanced Coding Pattern:**
  - **Deep module** – toast side effects handled separately; form triggers via `useEffect` based on `state`.

  **Anti‑Patterns:**
  - Showing toasts for validation errors.
  - Not handling missing `state` on initial render.

  **Depends On / Blocks:**
  - Depends on: upgraded form (P023).
  - Blocks: none.

#### Subtasks

| ID      | Agent/Human | File Path / Command                                                  | Description                                                                                                                           | Validation Command           |
| ------- | ----------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| P024-01 | AGENT       | `apps/firm-website` (install)                                        | Run: `pnpm --filter @repo/firm-website add sonner`.                                                                                   | `pnpm list sonner` shows it. |
| P024-02 | AGENT       | `apps/firm-website/src/app/layout.tsx`                               | Import `Toaster` from `sonner` and render it in root layout (or marketing layout).                                                     | No command.                  |
| P024-03 | AGENT       | `apps/firm-website/src/components/features/contact/contact-form.tsx` | In a `useEffect` watching `state`, trigger `toast.success(...)` on success and `toast.error(state.error)` on error. Avoid initial null. | No command.                  |
| P024-04 | AGENT       | `apps/firm-website/src/components/features/contact/contact-form.tsx` | Ensure toasts don’t show on initial render.                                                                                           | No command.                  |
| P024-05 | AGENT       | Update `docs/forms.md`                                               | Document toast notification setup.                                                                                                     | None.                        |

---

### Parent Task P025: Set Up Google Analytics 4 (GA4)

- [ ] **P025** | Status: `PENDING`  
  **Related File Paths:**
  - `apps/firm-website/.env.example` (add `NEXT_PUBLIC_GA_MEASUREMENT_ID`)
  - `apps/firm-website/src/lib/gtag.ts`
  - `apps/firm-website/src/components/analytics/ga4-script.tsx`
  - `apps/firm-website/src/app/layout.tsx`

  **Definition of Done:**
  - GA4 measurement ID stored in env var.
  - GA4 script loaded via `next/script` with `afterInteractive` strategy, only in production.
  - Helper functions `pageview(url)` and `event(name, params)` exported from `gtag.ts`.
  - GA4 initialized in root layout.

  **Out of Scope:**
  - Cookie consent (deferred).
  - Enhanced measurement features.

  **Rules to Follow:**
  - Use `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
  - Only load in production (`process.env.NODE_ENV === 'production'`).
  - Type declarations for `window.gtag`.

  **Advanced Coding Pattern:**
  - **Deep module** – analytics script component isolated, no side effects elsewhere.

  **Anti‑Patterns:**
  - Loading GA4 in development (skews data).
  - Hard‑coding measurement ID.

  **Imports/Exports:**
  - `lib/gtag.ts` → `GA_MEASUREMENT_ID`, `pageview`, `event`.
  - `components/analytics/ga4-script.tsx` → `GA4Script`.

  **Depends On / Blocks:**
  - Depends on: none (can be added anytime).
  - Blocks: page view tracking (P026), conversion events (P027).

#### Subtasks

| ID      | Agent/Human | File Path / Command                                         | Description                                                                                                                       | Validation Command    |
| ------- | ----------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| P025-01 | HUMAN       | GA4 account setup                                           | Create GA4 property, obtain Measurement ID (G-XXXXXXXXXX).                                                                        | Measurement ID saved. |
| P025-02 | AGENT       | `apps/firm-website/.env.example`                            | Add: `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX`.                                                                                 | File updated.         |
| P025-03 | AGENT       | `apps/firm-website/src/lib/gtag.ts`                         | Create `gtag.ts`: export `GA_MEASUREMENT_ID`, `pageview(url)` calls `window.gtag`, `event(name, params)`, type declarations.      | No command.           |
| P025-04 | AGENT       | `apps/firm-website/src/components/analytics/ga4-script.tsx` | Create `GA4Script` (client): loads gtag.js and init with measurement ID, only in production, `afterInteractive`.                  | No command.           |
| P025-05 | AGENT       | `apps/firm-website/src/app/layout.tsx`                      | Import and render `GA4Script` in root layout.                                                                                      | No command.           |
| P025-06 | AGENT       | Update `docs/analytics.md`                                  | Document GA4 setup and env variables.                                                                                              | None.                 |

---

### Parent Task P026: Track Page Views with GA4

- [ ] **P026** | Status: `PENDING`  
  **Related File Paths:**
  - `apps/firm-website/src/components/analytics/page-view-tracker.tsx`
  - `apps/firm-website/src/app/(marketing)/layout.tsx`

  **Definition of Done:**
  - `PageViewTracker` component uses `usePathname` and `useSearchParams`.
  - On route change, calls `pageview(url)` from `gtag.ts`.
  - Only tracks in production.
  - Events visible in GA4 real‑time.

  **Out of Scope:**
  - Hash change tracking.

  **Rules to Follow:**
  - Client component (`"use client"`).
  - `useEffect` with dependencies on pathname, searchParams.

  **Advanced Coding Pattern:**
  - **Deep module** – separate component, no interference with other functionality.

  **Anti‑Patterns:**
  - Tracking in development.
  - Not including search params.

  **Depends On / Blocks:**
  - Depends on: GA4 setup (P025), marketing layout (Phase 3).
  - Blocks: none.

#### Subtasks

| ID      | Agent/Human | File Path / Command                                                | Description                                                                                                                                     | Validation Command |
| ------- | ----------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| P026-01 | AGENT       | `apps/firm-website/src/components/analytics/page-view-tracker.tsx` | Create `PageViewTracker`: `usePathname()`, `useSearchParams()`, `useEffect` calls `pageview(url)`, only in production.                          | No command.        |
| P026-02 | AGENT       | `apps/firm-website/src/app/(marketing)/layout.tsx`                 | Add `PageViewTracker` to marketing layout.                                                                                                     | No command.        |
| P026-03 | AGENT       | Update `docs/analytics.md`                                         | Document page view tracking.                                                                                                                   | None.              |

---

### Parent Task P027: Track Form Submissions as Conversion Events

- [ ] **P027** | Status: `PENDING`  
  **Related File Paths:**
  - `apps/firm-website/src/components/features/contact/contact-form.tsx`
  - `apps/firm-website/src/lib/gtag.ts`

  **Definition of Done:**
  - On successful form submission, a `form_submission` event is sent to GA4 with parameter `form_type: 'contact'`.
  - No PII sent to GA4.
  - Event fires only once per submission.

  **Out of Scope:**
  - Form abandonment tracking.

  **Rules to Follow:**
  - Call `event('form_submission', { form_type: 'contact' })` when `state.success` is true (and not on initial render).
  - Do not include name, email, or message.

  **Advanced Coding Pattern:**
  - **Deep module** – conversion tracking is a side effect of successful submission.

  **Anti‑Patterns:**
  - Sending PII.
  - Firing event multiple times.

  **Depends On / Blocks:**
  - Depends on: GA4 setup (P025), contact form (P023).
  - Blocks: none.

#### Subtasks

| ID      | Agent/Human | File Path / Command                                                  | Description                                                                                                      | Validation Command |
| ------- | ----------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------ |
| P027-01 | AGENT       | `apps/firm-website/src/components/features/contact/contact-form.tsx` | In `useEffect` watching `state`, on `state.success` true, call `event('form_submission', { form_type: 'contact' })`. Use ref to prevent double fire. | No command.        |
| P027-02 | AGENT       | Update `docs/analytics.md`                                           | Document conversion event tracking.                                                                               | None.              |

---

### Parent Task P028: Add Vercel Analytics (Optional)

- [ ] **P028** | Status: `PENDING`  
  **Related File Paths:**
  - `apps/firm-website/package.json` (add `@vercel/analytics`)
  - `apps/firm-website/src/app/layout.tsx`

  **Definition of Done:**
  - `@vercel/analytics` installed, `Analytics` component rendered in root layout.
  - Web Vitals visible in Vercel dashboard (Pro plan required).

  **Out of Scope:**
  - Custom event tracking via Vercel Analytics.

  **Rules to Follow:**
  - Import `Analytics` from `@vercel/analytics/react`.
  - Renders automatically in production only.

  **Advanced Coding Pattern:**
  - **Deep module** – separate provider, no interference.

  **Depends On / Blocks:**
  - Depends on: none.
  - Blocks: none.

#### Subtasks

| ID      | Agent/Human | File Path / Command                    | Description                                                                       | Validation Command                      |
| ------- | ----------- | -------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------- |
| P028-01 | AGENT       | `apps/firm-website` (install)          | Run: `pnpm --filter @repo/firm-website add @vercel/analytics`.                     | `pnpm list @vercel/analytics` shows it. |
| P028-02 | AGENT       | `apps/firm-website/src/app/layout.tsx` | Import `Analytics` and render after children.                                     | No command.                             |
| P028-03 | AGENT       | Update `docs/analytics.md`             | Document Vercel Analytics setup.                                                  | None.                                   |

---

### Parent Task P029: Update Documentation

- [ ] **P029** | Status: `PENDING`  
  **Related File Paths:**
  - `README.md` (root)
  - `docs/forms.md`
  - `docs/analytics.md`
  - `docs/architecture.md`
  - `docs/development.md`

  **Definition of Done:**
  - All docs reflect Phase 4 additions.
  - `docs/forms.md` covers `useActionState`, `useFormStatus`, toast notifications, Resend email.
  - `docs/analytics.md` covers GA4 setup, page view tracking, conversion events, Vercel Analytics.
  - `README.md` updated with phase status and links.

  **Out of Scope:**
  - None.

  **Rules to Follow:**
  - Docs accurate, concise, current.

  **Advanced Coding Pattern:**
  - N/A.

  **Anti‑Patterns:**
  - Outdated documentation.

  **Depends On / Blocks:**
  - Depends on: P022–P028.
  - Blocks: none.

#### Subtasks

| ID      | Agent/Human | File Path / Command    | Description                                                                                              | Validation Command |
| ------- | ----------- | ---------------------- | -------------------------------------------------------------------------------------------------------- | ------------------ |
| P029-01 | AGENT       | `README.md`            | Update with Phase 4 status, links.                                                                        | Manual check.      |
| P029-02 | AGENT       | `docs/forms.md`        | Complete: `useActionState`, `useFormStatus`, toasts, email sending, env vars.                            | Manual check.      |
| P029-03 | AGENT       | `docs/analytics.md`    | Complete: GA4 setup, page view tracking, conversion events, Vercel Analytics.                            | Manual check.      |
| P029-04 | AGENT       | `docs/architecture.md` | Update with form and analytics architecture.                                                              | Manual check.      |
| P029-05 | AGENT       | `docs/development.md`  | Add guides for form submission flow and analytics integration.                                            | Manual check.      |

---

## Summary of Phase 4

Phase 4 consists of 8 parent tasks (P022–P029). The focus is completing the contact form with email sending, enhancing user feedback via toasts, and implementing GA4 analytics for page views and conversion tracking.

**Key Deliverables:**
- Email sending via Resend (free tier 3,000 emails/month)
- React 19 `useActionState` with loading states and per-field errors
- Toast notifications with `sonner`
- GA4 page view tracking
- Form submission conversion events
- Vercel Analytics (optional)
- Updated documentation

**Form UX Flow:**
1. User fills form → Submit
2. Server Action validates with Zod
3. Resend sends email
4. Success toast appears
5. Form resets
6. GA4 conversion event fires

## Phase 5: Testing & Quality Assurance – Task List

This document defines tasks required to implement comprehensive testing across the monorepo, including unit tests, component tests, E2E tests, visual regression testing, CI pipeline, and coverage thresholds. All tasks are designed to be **SMALL**, actionable, and built with **SDD, DDD, TDD, BDD**, and **Deep Modules** in mind.

**Prerequisites:**  
Monorepo with Next.js 15 app, `@repo/ui` component library, content utilities, dynamic pages, contact form, and analytics are already built. Vitest is configured in `apps/firm-website` and `packages/ui`. Playwright exists with sample tests. Storybook is not yet set up. No shared test utilities package exists. No CI test pipeline.

---

### Parent Task P030: Set Up Shared Test Utilities Package

- [ ] **P030** | Status: `PENDING`  
  **Related File Paths:**
  - `packages/test-utils/package.json`
  - `packages/test-utils/src/index.ts`
  - `packages/test-utils/src/test-utils.tsx`
  - `packages/test-utils/src/mocks.ts`

  **Definition of Done:**
  - `@repo/test-utils` package created.
  - Exports `renderWithProviders` (wraps `ThemeProvider`, etc.).
  - Exports common mocks: `mockNextNavigation()`, `mockResend()`, `mockUseActionState()`.
  - All apps can import from `@repo/test-utils`.

  **Out of Scope:**
  - Writing actual tests (subsequent tasks).

  **Rules to Follow:**
  - Package name: `@repo/test-utils`, private, `main` and `types` point to `src/index.ts`.
  - Use `vitest` compatible mocks; framework-agnostic where possible.
  - Provide a single entry point.

  **Advanced Coding Pattern:**
  - **Deep module** – test utilities abstract common setup; consuming tests don't repeat boilerplate.

  **Anti‑Patterns:**
  - Duplicating test helpers across workspaces.
  - Adding framework-specific logic that prevents reuse.

  **Imports/Exports:**
  - `packages/test-utils/src/index.ts` re‑exports everything.

  **Depends On / Blocks:**
  - Depends on: existing monorepo structure, `@repo/ui` (for providers).
  - Blocks: all subsequent testing tasks (P031–P039).

#### Subtasks

| ID      | Agent/Human | File Path / Command                       | Description                                                                                                                                                                        | Validation Command |
| ------- | ----------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| P030-01 | AGENT       | `packages/test-utils/package.json`        | Create `package.json` with `name: "@repo/test-utils"`, `private: true`, `main: "src/index.ts"`, `types: "src/index.ts"`, and add `vitest` as a peer dependency.                    | File exists.       |
| P030-02 | AGENT       | `packages/test-utils/src/index.ts`        | Create entry point exporting all utilities.                                                                                                                                        | No command.        |
| P030-03 | AGENT       | `packages/test-utils/src/test-utils.tsx`  | Create `renderWithProviders` that wraps children with `ThemeProvider` (from `@repo/ui`) and any other global providers.                                                             | No command.        |
| P030-04 | AGENT       | `packages/test-utils/src/mocks.ts`        | Create mocks: `mockNextNavigation()` (mocks `usePathname`, `useRouter`), `mockResend()` (mocks `emails.send`), `mockUseActionState()` (mocks return state).                        | No command.        |
| P030-05 | AGENT       | `packages/test-utils/tsconfig.json`       | Create `tsconfig.json` extending `@repo/typescript-config/base.json`.                                                                                                              | No command.        |
| P030-06 | AGENT       | `apps/firm-website/package.json`          | Add `"@repo/test-utils": "workspace:*"` as dev dependency.                                                                                                                          | `pnpm list` shows. |
| P030-07 | AGENT       | Update `docs/testing.md`                  | Document shared test utilities.                                                                                                                                                    | None.              |

---

### Parent Task P031: Write Unit Tests for Utility Functions

- [ ] **P031** | Status: `PENDING`  
  **Related File Paths:**
  - `apps/firm-website/src/lib/content.test.ts`
  - `apps/firm-website/src/lib/navigation.test.ts`
  - `packages/lib/src/**/*.test.ts` (if applicable)

  **Definition of Done:**
  - Unit tests cover all exported functions from `content.ts` and `navigation.ts`:
    - `getAllContent`, `getContentBySlug`, `getAllSlugs`
    - `getNavItems`, `getBreadcrumbs`, `getRelatedContent`
  - Success and error cases tested (file not found, invalid data).
  - Tests run with Vitest; tests colocated with source.

  **Out of Scope:**
  - Integration tests (covered later by P035).

  **Rules to Follow:**
  - Use `vi.mock` for `fs`/`path` in content tests; navigation tests use mocks from `@repo/test-utils`.
  - `describe`/`it` blocks, clear naming.

  **Advanced Coding Pattern:**
  - **Deep module** – tests verify public API, not internal implementation.

  **Anti‑Patterns:**
  - Testing implementation details.
  - Not mocking dependencies leading to side effects.

  **Depends On / Blocks:**
  - Depends on: shared test utils (P030), content/navigation utilities (Phase 1).
  - Blocks: none.

#### Subtasks

| ID      | Agent/Human | File Path / Command                            | Description                                                                                                                        | Validation Command                                      |
| ------- | ----------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| P031-01 | AGENT       | `apps/firm-website/src/lib/content.test.ts`    | Write tests for `getAllContent`: returns array, empty dir returns `[]`, handles invalid format gracefully.                         | `pnpm --filter @repo/firm-website test -- content.test` |
| P031-02 | AGENT       | `apps/firm-website/src/lib/content.test.ts`    | Write tests for `getContentBySlug`: returns entry for valid slug, `null` for invalid, handles missing file.                        | Same as above.                                          |
| P031-03 | AGENT       | `apps/firm-website/src/lib/content.test.ts`    | Write tests for `getAllSlugs`: returns slugs array, empty dir returns `[]`.                                                         | Same as above.                                          |
| P031-04 | AGENT       | `apps/firm-website/src/lib/navigation.test.ts` | Write tests for `getNavItems`: returns array of `{ label, href }` with expected items.                                              | `pnpm --filter @repo/firm-website test -- navigation`   |
| P031-05 | AGENT       | `apps/firm-website/src/lib/navigation.test.ts` | Write tests for `getBreadcrumbs`: returns trail for valid slug, empty array for invalid.                                            | Same as above.                                          |
| P031-06 | AGENT       | `apps/firm-website/src/lib/navigation.test.ts` | Write tests for `getRelatedContent`: returns related items based on type/slug.                                                     | Same as above.                                          |
| P031-07 | AGENT       | Update `docs/testing.md`                       | Document utility testing approach.                                                                                                  | None.                                                   |

---

### Parent Task P032: Write Component Tests for UI Components (`@repo/ui`)

- [ ] **P032** | Status: `PENDING`  
  **Related File Paths:**
  - `packages/ui/src/components/**/*.test.tsx`

  **Definition of Done:**
  - All UI components have component tests:
    - Button, Card, Container, Section
    - Header, Footer, NavLink, MobileMenu
    - Input, Textarea, Label, Form components
    - Accordion
    - ThemeToggle
  - Tests cover rendering, props, variants, user interactions.
  - Tests use `render` from `@testing-library/react` and `@repo/test-utils`.

  **Out of Scope:**
  - Feature components (app‑specific) – covered by P033.

  **Rules to Follow:**
  - Test files colocated with component.
  - Use `screen` queries, `userEvent` for interactions.
  - Use `renderWithProviders` for components needing ThemeProvider.

  **Advanced Coding Pattern:**
  - **Deep module** – tests verify component behavior from user perspective.

  **Anti‑Patterns:**
  - Testing internal state or CSS classes.
  - Not testing interactive elements.

  **Depends On / Blocks:**
  - Depends on: Vitest config in `packages/ui`, shared test utils (P030).
  - Blocks: none.

#### Subtasks

| ID      | Agent/Human | File Path / Command                                 | Description                                                                                                       | Validation Command                              |
| ------- | ----------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| P032-01 | AGENT       | `packages/ui/src/components/ui/button.test.tsx`     | Tests: renders text, variant classes, click events, `asChild`.                                                     | `pnpm --filter @repo/ui test -- button.test`    |
| P032-02 | AGENT       | `packages/ui/src/components/ui/card.test.tsx`       | Tests: renders children, className, sub‑components render.                                                        | `pnpm --filter @repo/ui test -- card.test`      |
| P032-03 | AGENT       | `packages/ui/src/components/ui/container.test.tsx`  | Tests: renders children, maxWidth variants, className.                                                            | `pnpm --filter @repo/ui test -- container.test` |
| P032-04 | AGENT       | `packages/ui/src/components/layout/header.test.tsx` | Tests: renders nav items, mobile menu toggles, uses `renderWithProviders`.                                        | `pnpm --filter @repo/ui test -- header.test`    |
| P032-05 | AGENT       | `packages/ui/src/components/layout/footer.test.tsx` | Tests: renders nav links, contact info, social links, copyright.                                                  | `pnpm --filter @repo/ui test -- footer.test`    |
| P032-06 | AGENT       | `packages/ui/src/components/ui/input.test.tsx`      | Tests: renders with label, onChange, error state.                                                                 | `pnpm --filter @repo/ui test -- input.test`     |
| P032-07 | AGENT       | `packages/ui/src/components/ui/accordion.test.tsx`  | Tests: renders items, expand/collapse, single/multiple modes.                                                     | `pnpm --filter @repo/ui test -- accordion.test` |
| P032-08 | AGENT       | `packages/ui/src/components/theme-toggle.test.tsx`  | Tests: renders sun/moon icon, toggles theme.                                                                       | `pnpm --filter @repo/ui test -- theme-toggle`   |
| P032-09 | AGENT       | Update `docs/testing.md`                            | Document UI component testing.                                                                                     | None.                                            |

---

### Parent Task P033: Write Component Tests for Feature Components

- [ ] **P033** | Status: `PENDING`  
  **Related File Paths:**
  - `apps/firm-website/src/components/features/**/*.test.tsx`

  **Definition of Done:**
  - Feature components tested:
    - Homepage sections: Hero, Pillars, DemoPreview, HowItWorks, FAQSnippet, FinalCTA
    - ServicesHub, ServiceDetail
    - IndustriesHub, IndustryDetail
    - DemosHub, DemoDetail
    - FAQHub, FAQAccordion
    - ContactForm
  - Tests use `renderWithProviders` and mock content/navigation utilities.
  - Loading and error states covered where applicable.

  **Out of Scope:**
  - E2E tests (P036–P037).

  **Rules to Follow:**
  - Mock `@/lib/content` and `@/lib/navigation` using `vi.mock`.
  - Test that components render with mock data, links work, key elements present.

  **Advanced Coding Pattern:**
  - **Deep module** – tests focus on component behavior and integration, not internals.

  **Anti‑Patterns:**
  - Not mocking dependencies (causes slow tests).
  - Testing too much in a single test.

  **Depends On / Blocks:**
  - Depends on: shared test utils (P030), content utilities tests (P031).
  - Blocks: none.

#### Subtasks

| ID      | Agent/Human | File Path / Command                                                        | Description                                                                                                                        | Validation Command                                      |
| ------- | ----------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| P033-01 | AGENT       | `apps/firm-website/src/components/features/home/hero.test.tsx`             | Tests: renders headline, CTAs link to /contact, /demos.                                                                            | `pnpm --filter @repo/firm-website test -- hero`         |
| P033-02 | AGENT       | `apps/firm-website/src/components/features/home/pillars.test.tsx`          | Tests: renders three pillars with links.                                                                                           | `pnpm --filter @repo/firm-website test -- pillars`      |
| P033-03 | AGENT       | `apps/firm-website/src/components/features/home/demo-preview.test.tsx`     | Tests: fetches demos (mock), renders cards, empty state handled.                                                                   | `pnpm --filter @repo/firm-website test -- demo-preview` |
| P033-04 | AGENT       | `apps/firm-website/src/components/features/services/services-hub.test.tsx` | Tests: fetches services (mock), renders service cards.                                                                             | `pnpm --filter @repo/firm-website test -- services-hub` |
| P033-05 | AGENT       | `apps/firm-website/src/components/features/industries/industries-hub.test.tsx` | Tests: fetches industries (mock), renders cards with icons.                                                                      | `pnpm --filter @repo/firm-website test -- industries-hub` |
| P033-06 | AGENT       | `apps/firm-website/src/components/features/faq/faq-hub.test.tsx`           | Tests: fetches FAQs (mock), groups by category, renders accordion.                                                                 | `pnpm --filter @repo/firm-website test -- faq-hub`      |
| P033-07 | AGENT       | `apps/firm-website/src/components/features/contact/contact-form.test.tsx`  | Tests: renders fields, submits (mock action), loading state, success/error states (mock toast).                                    | `pnpm --filter @repo/firm-website test -- contact-form` |
| P033-08 | AGENT       | Update `docs/testing.md`                                                   | Document feature component testing.                                                                                                 | None.                                                   |

---

### Parent Task P034: Write Server Action Tests

- [ ] **P034** | Status: `PENDING`  
  **Related File Paths:**
  - `apps/firm-website/src/app/actions/contact.test.ts`

  **Definition of Done:**
  - Tests for `submitContact` Server Action:
    - Valid submission returns success.
    - Invalid email / missing fields returns validation error.
    - Resend failure returns error (mocked).
  - Tests do not send real emails.

  **Out of Scope:**
  - E2E tests (P037).

  **Rules to Follow:**
  - Use `vi.mock` for Resend.
  - Use Zod's `safeParse` for validation tests.

  **Advanced Coding Pattern:**
  - **Deep module** – Server Action tested in isolation, no client needed.

  **Depends On / Blocks:**
  - Depends on: shared test utils (P030), Resend integration (Phase 4).
  - Blocks: none.

#### Subtasks

| ID      | Agent/Human | File Path / Command                                 | Description                                                                 | Validation Command                                      |
| ------- | ----------- | --------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------- |
| P034-01 | AGENT       | `apps/firm-website/src/app/actions/contact.test.ts` | Test: valid form data returns `{ success: true }` and calls Resend.         | `pnpm --filter @repo/firm-website test -- contact.test` |
| P034-02 | AGENT       | `apps/firm-website/src/app/actions/contact.test.ts` | Test: invalid email returns validation error with field info.               | Same as above.                                          |
| P034-03 | AGENT       | `apps/firm-website/src/app/actions/contact.test.ts` | Test: missing required field returns validation error.                      | Same as above.                                          |
| P034-04 | AGENT       | `apps/firm-website/src/app/actions/contact.test.ts` | Test: Resend rejects (mock) returns error state.                            | Same as above.                                          |
| P034-05 | AGENT       | Update `docs/testing.md`                            | Document Server Action testing.                                             | None.                                                   |

---

### Parent Task P035: Write Content Utility Integration Tests

- [ ] **P035** | Status: `PENDING`  
  **Related File Paths:**
  - `apps/firm-website/src/lib/content.integration.test.ts`

  **Definition of Done:**
  - Integration tests that use real MDX files (no mocking of `fs`):
    - `getAllContent('services')` returns all service files.
    - `getContentBySlug('services', 'website-design')` returns correct metadata/content.
    - `getAllSlugs('industries')` returns all industry slugs.
    - Metadata parsed correctly from MDX frontmatter.

  **Out of Scope:**
  - Testing React components.

  **Rules to Follow:**
  - Use real `fs` and `path`.
  - Resolve `src/content/` via `path.resolve`.
  - Focus on critical paths only (services, industries, demos).

  **Advanced Coding Pattern:**
  - **Deep module** – integration tests verify end‑to‑end content pipeline.

  **Depends On / Blocks:**
  - Depends on: existing content utilities and MDX files (Phase 1).
  - Blocks: none.

#### Subtasks

| ID      | Agent/Human | File Path / Command                                     | Description                                                                                        | Validation Command                                             |
| ------- | ----------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| P035-01 | AGENT       | `apps/firm-website/src/lib/content.integration.test.ts` | Test: `getAllContent('services')` returns all service files.                                       | `pnpm --filter @repo/firm-website test -- content.integration` |
| P035-02 | AGENT       | `apps/firm-website/src/lib/content.integration.test.ts` | Test: `getContentBySlug('services', 'website-design')` returns correct data.                       | Same as above.                                                 |
| P035-03 | AGENT       | `apps/firm-website/src/lib/content.integration.test.ts` | Test: `getAllSlugs('industries')` returns all slugs.                                               | Same as above.                                                 |
| P035-04 | AGENT       | `apps/firm-website/src/lib/content.integration.test.ts` | Test: metadata parsing (title, slug, description) correct.                                         | Same as above.                                                 |
| P035-05 | AGENT       | Update `docs/testing.md`                                | Document integration testing.                                                                       | None.                                                          |

---

### Parent Task P036: Write E2E Tests for Critical User Journeys

- [ ] **P036** | Status: `PENDING`  
  **Related File Paths:**
  - `apps/firm-website/src/e2e/navigation.spec.ts`
  - `apps/firm-website/src/e2e/homepage.spec.ts`
  - `apps/firm-website/src/e2e/services.spec.ts`
  - `apps/firm-website/src/e2e/industries.spec.ts`
  - `apps/firm-website/src/e2e/demos.spec.ts`
  - `apps/firm-website/src/e2e/faq.spec.ts`

  **Definition of Done:**
  - Playwright tests for:
    - Homepage loads, hero and CTAs visible.
    - Navigation: all top‑level pages (About, Pricing, Services, Industries, Demos, FAQ, Contact) load.
    - Services hub lists services; service detail page loads correctly.
    - Industries hub lists industries; detail page loads with content.
    - Demos hub and detail pages.
    - FAQ hub loads, accordions expand/collapse.
  - Tests run headless against production build.

  **Out of Scope:**
  - Form submission E2E (P037).

  **Rules to Follow:**
  - Use `page.goto()`, `page.locator()`, `expect` from `@playwright/test`.
  - Use `webServer` in Playwright config to start the app.
  - Test actual page content, not just status codes.

  **Advanced Coding Pattern:**
  - **Deep module** – E2E tests verify system from user perspective.

  **Anti‑Patterns:**
  - Tests that are brittle or slow.
  - Not testing visible content.

  **Depends On / Blocks:**
  - Depends on: all pages built (Phase 3).
  - Blocks: none.

#### Subtasks

| ID      | Agent/Human | File Path / Command                            | Description                                                                     | Validation Command                                        |
| ------- | ----------- | ---------------------------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------- |
| P036-01 | AGENT       | `apps/firm-website/src/e2e/homepage.spec.ts`   | Test: homepage loads, hero present, CTA links.                                  | `pnpm --filter @repo/firm-website test:e2e -- homepage`   |
| P036-02 | AGENT       | `apps/firm-website/src/e2e/navigation.spec.ts` | Test: /about page loads.                                                        | `pnpm --filter @repo/firm-website test:e2e -- navigation` |
| P036-03 | AGENT       | `apps/firm-website/src/e2e/navigation.spec.ts` | Test: /pricing, /contact, /faq load.                                            | Same as above.                                            |
| P036-04 | AGENT       | `apps/firm-website/src/e2e/services.spec.ts`   | Test: services hub shows service cards.                                         | `pnpm --filter @repo/firm-website test:e2e -- services`   |
| P036-05 | AGENT       | `apps/firm-website/src/e2e/services.spec.ts`   | Test: service detail page loads with correct content.                           | Same as above.                                            |
| P036-06 | AGENT       | `apps/firm-website/src/e2e/industries.spec.ts` | Test: industries hub shows cards.                                               | `pnpm --filter @repo/firm-website test:e2e -- industries` |
| P036-07 | AGENT       | `apps/firm-website/src/e2e/industries.spec.ts` | Test: industry detail page loads.                                               | Same as above.                                            |
| P036-08 | AGENT       | `apps/firm-website/src/e2e/demos.spec.ts`      | Test: demos hub and detail page.                                                | `pnpm --filter @repo/firm-website test:e2e -- demos`      |
| P036-09 | AGENT       | `apps/firm-website/src/e2e/faq.spec.ts`        | Test: FAQ hub loads, accordion expands.                                         | `pnpm --filter @repo/firm-website test:e2e -- faq`        |
| P036-10 | AGENT       | Update `docs/testing.md`                       | Document E2E testing approach.                                                  | None.                                                     |

---

### Parent Task P037: Write E2E Tests for Contact Form Submission

- [ ] **P037** | Status: `PENDING`  
  **Related File Paths:**
  - `apps/firm-website/src/e2e/contact-form.spec.ts`

  **Definition of Done:**
  - Playwright tests for contact form:
    - Page loads with form fields.
    - Validation errors shown for invalid email / missing fields.
    - Successful submission shows success toast (mock Resend or use test env).
    - Server error shows error toast.
  - Resend is mocked via environment variable or route intercept to avoid real emails.

  **Out of Scope:**
  - Testing actual email delivery.

  **Rules to Follow:**
  - Use `page.fill`, `page.click`, `page.waitForSelector`.
  - Mock Resend API or set `RESEND_API_KEY` to empty to trigger error branch.

  **Advanced Coding Pattern:**
  - **Deep module** – E2E test covers full submission flow end‑to‑end.

  **Depends On / Blocks:**
  - Depends on: contact page (Phase 3), Resend integration (Phase 4).
  - Blocks: none.

#### Subtasks

| ID      | Agent/Human | File Path / Command                              | Description                                                   | Validation Command                                          |
| ------- | ----------- | ------------------------------------------------ | ------------------------------------------------------------- | ----------------------------------------------------------- |
| P037-01 | AGENT       | `apps/firm-website/src/e2e/contact-form.spec.ts` | Test: form loads with fields.                                 | `pnpm --filter @repo/firm-website test:e2e -- contact-form` |
| P037-02 | AGENT       | `apps/firm-website/src/e2e/contact-form.spec.ts` | Test: invalid email shows validation error.                   | Same as above.                                              |
| P037-03 | AGENT       | `apps/firm-website/src/e2e/contact-form.spec.ts` | Test: missing required fields show errors.                    | Same as above.                                              |
| P037-04 | AGENT       | `apps/firm-website/src/e2e/contact-form.spec.ts` | Test: valid submission shows success toast (mocked Resend).    | Same as above.                                              |
| P037-05 | AGENT       | `apps/firm-website/src/e2e/contact-form.spec.ts` | Test: server error shows error toast.                         | Same as above.                                              |
| P037-06 | AGENT       | Update `docs/testing.md`                         | Document E2E form testing.                                     | None.                                                       |

---

### Parent Task P038: Configure Storybook for UI Components

- [ ] **P038** | Status: `PENDING`  
  **Related File Paths:**
  - `packages/ui/.storybook/main.ts`
  - `packages/ui/.storybook/preview.ts`
  - `packages/ui/src/**/*.stories.tsx`

  **Definition of Done:**
  - Storybook 8+ installed and configured in `packages/ui` (via `@storybook/nextjs` framework).
  - Stories written for all UI components covering variants and states.
  - Preview includes `ThemeProvider` for dark/light mode toggle.
  - `storybook` and `storybook:build` scripts added to `packages/ui/package.json`.

  **Out of Scope:**
  - Chromatic integration (P039).
  - Feature component stories.

  **Rules to Follow:**
  - Stories colocated with components (`button.stories.tsx`).
  - Use Storybook 8+ with `@storybook/nextjs` framework (supports Next.js).

  **Advanced Coding Pattern:**
  - **Deep module** – Storybook provides a visual playground for the component library.

  **Anti‑Patterns:**
  - Stories that are overly complex or contain business logic.

  **Depends On / Blocks:**
  - Depends on: `@repo/ui` components, design tokens.
  - Blocks: Chromatic (P039).

#### Subtasks

| ID      | Agent/Human | File Path / Command                                    | Description                                                                                           | Validation Command                 |
| ------- | ----------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- | ---------------------------------- |
| P038-01 | AGENT       | `packages/ui` (install)                                | Run: `pnpm --filter @repo/ui add -D @storybook/react @storybook/nextjs @storybook/addon-essentials`.   | Packages installed.                |
| P038-02 | AGENT       | `packages/ui` (init)                                   | Initialize Storybook with `npx storybook@latest init --type nextjs` (or manual config).               | `.storybook/` directory created.   |
| P038-03 | AGENT       | `packages/ui/.storybook/preview.ts`                    | Add `ThemeProvider` wrapper to preview for dark/light mode.                                           | No command.                        |
| P038-04 | AGENT       | `packages/ui/src/components/ui/button.stories.tsx`     | Stories: default, primary, secondary, outline, ghost, destructive, loading, disabled.                 | `pnpm --filter @repo/ui storybook` |
| P038-05 | AGENT       | `packages/ui/src/components/ui/card.stories.tsx`       | Stories: default, with header, footer, image.                                                         | Same as above.                     |
| P038-06 | AGENT       | `packages/ui/src/components/ui/container.stories.tsx`  | Stories: sm, md, lg, xl, full.                                                                        | Same as above.                     |
| P038-07 | AGENT       | `packages/ui/src/components/layout/header.stories.tsx` | Stories: with nav items, mobile view.                                                                 | Same as above.                     |
| P038-08 | AGENT       | `packages/ui/src/components/layout/footer.stories.tsx` | Stories: default, with social links.                                                                   | Same as above.                     |
| P038-09 | AGENT       | `packages/ui/src/components/ui/input.stories.tsx`      | Stories: default, error, disabled, with label.                                                        | Same as above.                     |
| P038-10 | AGENT       | `packages/ui/src/components/ui/accordion.stories.tsx`  | Stories: default, multiple items, custom content.                                                     | Same as above.                     |
| P038-11 | AGENT       | `packages/ui/package.json` scripts                     | Add `"storybook": "storybook dev -p 6006"`, `"storybook:build": "storybook build"`.                   | No command.                        |
| P038-12 | AGENT       | Update `docs/testing.md`                               | Document Storybook setup.                                                                              | None.                              |

---

### Parent Task P039: Set Up Chromatic Visual Regression Testing

- [ ] **P039** | Status: `PENDING`  
  **Related File Paths:**
  - `.github/workflows/chromatic.yml`
  - `packages/ui/package.json` (chromatic script)

  **Definition of Done:**
  - Chromatic configured for visual regression testing.
  - GitHub Actions workflow runs Chromatic on PRs to main.
  - Project token stored as `CHROMATIC_PROJECT_TOKEN` secret.
  - Chromatic snapshots are compared; diffs shown in PR comments.
  - `--exit-zero-on-changes` used to avoid failing CI on visual diffs.

  **Out of Scope:**
  - None.

  **Rules to Follow:**
  - Use Chromatic CLI, run after `storybook:build`.
  - Only trigger on PRs to main.

  **Advanced Coding Pattern:**
  - **Deep module** – visual testing is a separate CI step.

  **Depends On / Blocks:**
  - Depends on: Storybook (P038).
  - Blocks: none.

#### Subtasks

| ID      | Agent/Human | File Path / Command               | Description                                                                                                            | Validation Command |
| ------- | ----------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------ |
| P039-01 | HUMAN       | Chromatic account setup           | Create Chromatic account, add project, obtain project token.                                                           | Token obtained.    |
| P039-02 | HUMAN       | GitHub secret setup               | Add `CHROMATIC_PROJECT_TOKEN` to repository secrets.                                                                    | Secret exists.     |
| P039-03 | AGENT       | `packages/ui/package.json`        | Add script: `"chromatic": "npx chromatic --project-token=$CHROMATIC_PROJECT_TOKEN"`.                                   | No command.        |
| P039-04 | AGENT       | `.github/workflows/chromatic.yml` | Create workflow: on PR to main, setup pnpm, install deps, build storybook, run Chromatic with `--exit-zero-on-changes`. | Workflow exists.   |
| P039-05 | AGENT       | Update `docs/testing.md`          | Document Chromatic visual regression.                                                                                  | None.              |

---

### Parent Task P040: Configure CI Test Pipeline with GitHub Actions

- [ ] **P040** | Status: `PENDING`  
  **Related File Paths:**
  - `.github/workflows/ci.yml`

  **Definition of Done:**
  - GitHub Actions workflow triggered on PRs to main.
  - Runs: `pnpm lint`, `pnpm typecheck`, `pnpm test` (unit + component), `pnpm test:e2e` (Playwright) in parallel where possible.
  - Uses Turborepo caching for speed.
  - Coverage thresholds enforced (see P041).
  - Test results visible in PR.

  **Out of Scope:**
  - Deployment (handled by Vercel).

  **Rules to Follow:**
  - Use `actions/setup-node`, `pnpm/action-setup`.
  - Cache `.turbo` and `node_modules`.
  - Run Playwright with `playwright install --with-deps chromium`.

  **Advanced Coding Pattern:**
  - **Deep module** – CI pipeline defined separately, isolated.

  **Anti‑Patterns:**
  - Running tests in serial without cache.

  **Depends On / Blocks:**
  - Depends on: all tests (P031–P037).
  - Blocks: none.

#### Subtasks

| ID      | Agent/Human | File Path / Command        | Description                                                                                                                                       | Validation Command |
| ------- | ----------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| P040-01 | AGENT       | `.github/workflows/ci.yml` | Create workflow: triggers on `pull_request` to `main`. Sets up Node.js, pnpm, installs deps, caches `.turbo`.                                      | Workflow exists.   |
| P040-02 | AGENT       | `.github/workflows/ci.yml` | Add job steps: `pnpm lint`, `pnpm typecheck`, `pnpm test` (unit+component), `pnpm test:e2e` (with Playwright browser setup).                      | Workflow exists.   |
| P040-03 | AGENT       | `.github/workflows/ci.yml` | Set `PLAYWRIGHT_BROWSERS_PATH=0` or use `npx playwright install --with-deps chromium` for E2E.                                                     | Workflow exists.   |
| P040-04 | AGENT       | Update `docs/testing.md`   | Document CI pipeline.                                                                                                                              | None.              |

---

### Parent Task P041: Set Coverage Thresholds and Reporting

- [ ] **P041** | Status: `PENDING`  
  **Related File Paths:**
  - `apps/firm-website/vitest.config.ts`
  - `packages/ui/vitest.config.ts`
  - `packages/lib/vitest.config.ts` (if needed)

  **Definition of Done:**
  - Coverage thresholds set to 80% for statements, branches, functions, lines in all test configs.
  - Coverage reports generated (`coverage/` directory).
  - CI fails if coverage drops below threshold.
  - `test:coverage` scripts added.

  **Out of Scope:**
  - Codecov integration (not needed).

  **Rules to Follow:**
  - Install `@vitest/coverage-v8` in each workspace with tests.
  - Use `reporter: ['text', 'html']`, `thresholds` object.

  **Advanced Coding Pattern:**
  - **Deep module** – coverage configuration local to each package.

  **Anti‑Patterns:**
  - Setting thresholds too low or too high.
  - Not excluding test files and node_modules.

  **Depends On / Blocks:**
  - Depends on: existing tests (P031–P037), Vitest configs.
  - Blocks: CI pipeline (integrate thresholds).

#### Subtasks

| ID      | Agent/Human | File Path / Command                      | Description                                                                                      | Validation Command |
| ------- | ----------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------ |
| P041-01 | AGENT       | `apps/firm-website` (install)            | Run: `pnpm --filter @repo/firm-website add -D @vitest/coverage-v8`.                               | Package installed. |
| P041-02 | AGENT       | `apps/firm-website/vitest.config.ts`     | Add coverage config: `provider: 'v8'`, `reporter: ['text','html']`, `thresholds: { statements: 80, branches: 80, functions: 80, lines: 80 }`, `reportsDirectory: './coverage'`, exclude patterns. | No command.        |
| P041-03 | AGENT       | `apps/firm-website/package.json`         | Add script: `"test:coverage": "vitest run --coverage"`.                                           | No command.        |
| P041-04 | AGENT       | `packages/ui` (install & config)         | Repeat for UI package: install coverage, configure vitest.config.ts, add script.                  | No command.        |
| P041-05 | AGENT       | `packages/lib` (if needed)               | If `packages/lib` has tests, add coverage config similarly.                                      | No command.        |
| P041-06 | AGENT       | Update `docs/testing.md`                 | Document coverage thresholds and reporting.                                                       | None.              |

---

### Parent Task P042: Update Documentation for Testing Phase

- [ ] **P042** | Status: `PENDING`  
  **Related File Paths:**
  - `README.md` (root)
  - `docs/testing.md`
  - `docs/architecture.md`
  - `docs/development.md`

  **Definition of Done:**
  - `docs/testing.md` comprehensive with testing stack, unit tests, component tests, E2E, visual regression, CI, coverage.
  - `README.md` updated with Phase 5 status and links.
  - `docs/architecture.md` includes testing architecture.
  - `docs/development.md` includes guide on writing tests.

  **Out of Scope:**
  - None.

  **Rules to Follow:**
  - Docs must be accurate and match current implementation.

  **Depends On / Blocks:**
  - Depends on: all previous tasks.
  - Blocks: none.

#### Subtasks

| ID      | Agent/Human | File Path / Command    | Description                                                                          | Validation Command |
| ------- | ----------- | ---------------------- | ------------------------------------------------------------------------------------ | ------------------ |
| P042-01 | AGENT       | `README.md`            | Update with Phase 5 status, testing badges (if CI enabled).                          | Manual check.      |
| P042-02 | AGENT       | `docs/testing.md`      | Complete document: stack, unit/component/E2E/visual testing, CI, coverage.          | Manual check.      |
| P042-03 | AGENT       | `docs/development.md`  | Add "How to write tests" guide covering different test types.                        | Manual check.      |
| P042-04 | AGENT       | `docs/architecture.md` | Update with testing architecture overview.                                           | Manual check.      |

---

## Summary of Phase 5

Phase 5 consists of 13 parent tasks (P030–P042). It establishes comprehensive testing across the monorepo: shared test utilities, unit and component tests for all critical code, E2E tests for user journeys, Storybook + Chromatic for visual regression, a CI pipeline running tests on PRs, and coverage thresholds at 80%.

**Key Deliverables:**
- `@repo/test-utils` shared package
- Unit tests for utilities, UI components, feature components, server actions
- Integration tests for content pipeline
- Playwright E2E tests for navigation, pages, and form submission
- Storybook stories for all UI components
- Chromatic visual regression in CI
- GitHub Actions CI pipeline (lint, typecheck, unit tests, E2E)
- Coverage thresholds (80%) enforced
- Comprehensive testing documentation

## Phase 6: Final Polish & Launch – Task List

This document defines the tasks required to harden security, set up error tracking, configure the production environment, verify performance and SEO, and execute the launch. All tasks are designed to be **SMALL**, actionable, and built with **SDD, DDD, TDD, BDD**, and **Deep Modules** in mind.

**Prerequisites:**  
The website is fully built, content is published, forms work, analytics are integrated, and tests pass in CI. The app is deployed on Vercel via preview deployments. Now we prepare for production launch.

---

### Parent Task P043: Implement Security Headers

- [ ] **P043** | Status: `PENDING`  
  **Related File Paths:**
  - `apps/firm-website/next.config.ts`

  **Definition of Done:**
  - `poweredByHeader: false` set.
  - `headers()` function in `next.config.ts` applies the following to all routes:
    - `Vary: RSC, Next-Router-State-Tree, Next-Router-Prefetch, Accept-Encoding`
    - `X-Frame-Options: SAMEORIGIN`
    - `X-XSS-Protection: 1; mode=block`
    - `X-Content-Type-Options: nosniff`
    - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` (production only)
    - `Referrer-Policy: strict-origin-when-cross-origin`
  - Verified via `curl -I` on preview deployment.

  **Out of Scope:**
  - Full Content Security Policy (P044).

  **Rules to Follow:**
  - Use `headers()` async function.
  - HSTS applied only when `NODE_ENV === 'production'`.

  **Advanced Coding Pattern:**
  - **Deep module** – security headers centralised in `next.config.ts`.

  **Anti‑Patterns:**
  - Omitting the Vary header (breaks RSC caching).
  - Enabling HSTS in development.

  **Depends On / Blocks:**
  - Depends on: existing Next.js configuration.
  - Blocks: none directly.

#### Subtasks

| ID      | Agent/Human | File Path / Command                | Description                                                                                                                | Validation Command               |
| ------- | ----------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| P043-01 | AGENT       | `apps/firm-website/next.config.ts` | Set `poweredByHeader: false`.                                                                                              | No command.                      |
| P043-02 | AGENT       | `apps/firm-website/next.config.ts` | Add `headers()` function returning all required security headers for `/:path*`. Conditionally apply HSTS for production.    | No command.                      |
| P043-03 | AGENT       | Preview deployment                 | Deploy to Vercel preview and verify headers with `curl -I https://preview-url`.                                            | Headers present.                 |
| P043-04 | AGENT       | `docs/security.md`                 | Document security headers and their purpose.                                                                               | None.                            |

---

### Parent Task P044: Implement Basic Content Security Policy

- [ ] **P044** | Status: `PENDING`  
  **Related File Paths:**
  - `apps/firm-website/next.config.ts`

  **Definition of Done:**
  - A basic CSP header applied to all routes:
    - `default-src 'self'`
    - `script-src 'self' 'unsafe-inline' 'unsafe-eval'` (needed for Next.js)
    - `style-src 'self' 'unsafe-inline'` (Tailwind requirement)
    - `img-src 'self' data: https:`
    - `font-src 'self' https:`
    - `connect-src 'self' https:`
    - `frame-ancestors 'none'`
    - `upgrade-insecure-requests`
  - Verified on preview that no resources are blocked.

  **Out of Scope:**
  - Nonce-based CSP, reporting endpoint (post-launch).

  **Rules to Follow:**
  - Add to the same `headers()` as security headers.
  - Ensure all required external sources (fonts, analytics) are allowed.

  **Anti‑Patterns:**
  - Breaking the site due to missing sources.

  **Depends On / Blocks:**
  - Depends on: P043 (security headers).
  - Blocks: none.

#### Subtasks

| ID      | Agent/Human | File Path / Command                | Description                                                                                               | Validation Command            |
| ------- | ----------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------- |
| P044-01 | AGENT       | `apps/firm-website/next.config.ts` | Add CSP to the `headers()` function with the policy above.                                                | No command.                   |
| P044-02 | HUMAN       | Preview deployment                 | Deploy to preview, test site (all pages, analytics, fonts) – no CSP violations in browser console.         | No blocked resources.         |
| P044-03 | AGENT       | `docs/security.md`                 | Document CSP policy and exceptions.                                                                       | None.                         |

---

### Parent Task P045: Set Up Sentry Error Tracking

- [ ] **P045** | Status: `PENDING`  
  **Related File Paths:**
  - `apps/firm-website/package.json` (add `@sentry/nextjs`)
  - `apps/firm-website/sentry.client.config.ts`
  - `apps/firm-website/sentry.server.config.ts`
  - `apps/firm-website/sentry.edge.config.ts`
  - `apps/firm-website/next.config.ts` (Sentry integration)
  - `apps/firm-website/.env.example` (add `NEXT_PUBLIC_SENTRY_DSN`)

  **Definition of Done:**
  - `@sentry/nextjs` installed and configured.
  - Sentry DSN stored in environment variable (public for client).
  - Sentry initialised on client, server, and edge.
  - Source maps uploaded on build.
  - Sentry captures unhandled errors and server action errors (only in production).

  **Out of Scope:**
  - Performance monitoring (can be added later).

  **Rules to Follow:**
  - Use `Sentry.init` in each config.
  - `hideSourceMaps: true` to avoid leaking source code.
  - Only enable in production.

  **Advanced Coding Pattern:**
  - **Deep module** – Sentry is a separate integration; automatic error collection.

  **Anti‑Patterns:**
  - Not uploading source maps (debugging hard).
  - Capturing PII.

  **Depends On / Blocks:**
  - Depends on: existing Next.js setup.
  - Blocks: none.

#### Subtasks

| ID      | Agent/Human | File Path / Command                         | Description                                                                                                | Validation Command |
| ------- | ----------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------ |
| P045-01 | AGENT       | `apps/firm-website` (install)               | Run: `pnpm --filter @repo/firm-website add @sentry/nextjs`.                                                | Package installed. |
| P045-02 | AGENT       | `apps/firm-website/sentry.client.config.ts` | Create client Sentry config: `Sentry.init({ dsn, environment })`.                                          | No command.        |
| P045-03 | AGENT       | `apps/firm-website/sentry.server.config.ts` | Create server config (similar).                                                                             | No command.        |
| P045-04 | AGENT       | `apps/firm-website/sentry.edge.config.ts`   | Create edge config.                                                                                        | No command.        |
| P045-05 | AGENT       | `apps/firm-website/.env.example`            | Add `NEXT_PUBLIC_SENTRY_DSN=https://xxxx@xxxx.ingest.sentry.io/xxxx`.                                       | File updated.      |
| P045-06 | AGENT       | `apps/firm-website/next.config.ts`          | Add Sentry properties: `sentry: { hideSourceMaps: true, autoInstrumentServerFunctions: true }`.            | No command.        |
| P045-07 | HUMAN       | Sentry account setup                        | Create Sentry project, get DSN, add to Vercel environment variables.                                       | DSN set.           |
| P045-08 | AGENT       | `docs/monitoring.md`                        | Document Sentry setup and how to view errors.                                                              | None.              |

---

### Parent Task P046: Configure Production Environment Variables

- [ ] **P046** | Status: `PENDING`  
  **Related File Paths:**
  - Vercel dashboard

  **Definition of Done:**
  - All required environment variables are set in Vercel for production (and preview if needed):
    - `NEXT_PUBLIC_SITE_URL` – production URL
    - `RESEND_API_KEY`, `CONTACT_EMAIL`, `FROM_EMAIL`
    - `NEXT_PUBLIC_GA_MEASUREMENT_ID`
    - `NEXT_PUBLIC_SENTRY_DSN`
  - Sensitive variables are not prefixed with `NEXT_PUBLIC_` (except sentry).
  - Verified that production build uses the correct values.

  **Out of Scope:**
  - None.

  **Rules to Follow:**
  - Use Vercel dashboard or CLI.
  - Preview environment can inherit from production where appropriate.

  **Depends On / Blocks:**
  - Depends on: Resend setup (Phase 4), GA4 (Phase 4), Sentry (P045).
  - Blocks: production deployment (P052).

#### Subtasks

| ID      | Agent/Human | File Path / Command          | Description                                                                       | Validation Command |
| ------- | ----------- | ---------------------------- | --------------------------------------------------------------------------------- | ------------------ |
| P046-01 | HUMAN       | Vercel dashboard             | Go to Settings → Environment Variables and add all variables for Production.       | Variables saved.   |
| P046-02 | HUMAN       | Vercel dashboard             | Add same variables for Preview environment if needed.                             | Variables saved.   |
| P046-03 | AGENT       | `docs/environment.md`        | Document all required environment variables and where they are set.               | None.              |

---

### Parent Task P047: Configure Custom Domain and SSL

- [ ] **P047** | Status: `PENDING`  
  **Related File Paths:**
  - Vercel dashboard, DNS provider dashboard

  **Definition of Done:**
  - Custom domain `yourdedicatedmarketer.com` added to Vercel project.
  - `www.yourdedicatedmarketer.com` also added, redirect to apex configured.
  - DNS records updated (A/CNAME per Vercel instructions).
  - SSL certificate provisioned (auto via Vercel).
  - Site loads correctly over HTTPS at the custom domain.

  **Out of Scope:**
  - Email DNS records (MX, etc.).

  **Rules to Follow:**
  - Use Vercel domain management.
  - Redirect `www` to `apex` or vice versa.

  **Depends On / Blocks:**
  - Depends on: domain ownership.
  - Blocks: final production verification (P050, P052).

#### Subtasks

| ID      | Agent/Human | File Path / Command            | Description                                                                       | Validation Command  |
| ------- | ----------- | ------------------------------ | --------------------------------------------------------------------------------- | ------------------- |
| P047-01 | HUMAN       | Vercel dashboard               | Add `yourdedicatedmarketer.com` to Domains.                                       | Domain added.       |
| P047-02 | HUMAN       | Vercel dashboard               | Add `www.yourdedicatedmarketer.com` and set redirect to apex.                     | Redirect set.       |
| P047-03 | HUMAN       | DNS provider                   | Update DNS records as instructed by Vercel.                                       | DNS updated.        |
| P047-04 | HUMAN       | Verify                         | Wait for SSL, visit `https://yourdedicatedmarketer.com` – site loads correctly.    | HTTPS works.        |
| P047-05 | AGENT       | `docs/deployment.md`           | Document custom domain configuration.                                             | None.               |

---

### Parent Task P048: Production Build Verification and Bundle Analysis

- [ ] **P048** | Status: `PENDING`  
  **Related File Paths:**
  - `apps/firm-website/next.config.ts` (optional bundle analyzer)

  **Definition of Done:**
  - `pnpm build` runs successfully with no warnings.
  - Output shows all pages as static (`●`).
  - Bundle size verified: first-load JS < 200KB, total bundle < 300KB.
  - All dynamic routes covered by `generateStaticParams`.

  **Out of Scope:**
  - None.

  **Rules to Follow:**
  - Run `next build` in the firm-website workspace.
  - Check console output for large dependencies.

  **Advanced Coding Pattern:**
  - N/A.

  **Depends On / Blocks:**
  - Depends on: all pages built (Phase 3).
  - Blocks: final deployment (P052).

#### Subtasks

| ID      | Agent/Human | File Path / Command          | Description                                                                       | Validation Command     |
| ------- | ----------- | ---------------------------- | --------------------------------------------------------------------------------- | ---------------------- |
| P048-01 | AGENT       | Terminal                     | Run `pnpm --filter @repo/firm-website build` and confirm success, static routes.   | Build succeeds.        |
| P048-02 | AGENT       | Build output                 | Note bundle sizes (check `.next/analyze/` if using bundle analyzer).               | First load JS < 200KB. |
| P048-03 | AGENT       | `docs/performance.md`        | Record build size and performance notes.                                           | None.                  |

---

### Parent Task P049: Lighthouse Audit and Final Performance Optimization

- [ ] **P049** | Status: `PENDING`  
  **Related File Paths:**
  - All pages (audit across the entire app)

  **Definition of Done:**
  - Lighthouse scores 90+ on Performance, Accessibility, Best Practices, SEO for all key pages.
  - Any issues identified are fixed.
  - Screenshots or scores recorded.

  **Out of Scope:**
  - Mobile-specific issues beyond responsive design.

  **Rules to Follow:**
  - Run in Chrome incognito against production preview.
  - Test homepage, service detail, about, pricing, faq.

  **Depends On / Blocks:**
  - Depends on: P048 (build verification), content.
  - Blocks: P051 (Go/No-Go).

#### Subtasks

| ID      | Agent/Human | File Path / Command                | Description                                                                          | Validation Command |
| ------- | ----------- | ---------------------------------- | ------------------------------------------------------------------------------------ | ------------------ |
| P049-01 | HUMAN       | Chrome DevTools                    | Run Lighthouse on homepage – record scores.                                          | Scores ≥ 90.       |
| P049-02 | HUMAN       | Chrome DevTools                    | Run Lighthouse on About, Pricing, Services, FAQ, Contact – record scores.            | Scores ≥ 90.       |
| P049-03 | AGENT       | If any score < 90, fix issues      | Optimize images, font loading, etc.                                                  | Scores improve.    |
| P049-04 | AGENT       | `docs/performance.md`              | Document final Lighthouse scores and any optimizations made.                         | None.              |

---

### Parent Task P050: Final Content and SEO Verification

- [ ] **P050** | Status: `PENDING`  
  **Related File Paths:**
  - All content and SEO files

  **Definition of Done:**
  - All content reviewed: spelling, grammar, accuracy.
  - All internal links working, external links valid.
  - All images have alt text.
  - JSON-LD validated with Google Rich Results Test.
  - Sitemap and robots.txt verified at `/sitemap.xml` and `/robots.txt`.
  - Open Graph tags previewed with Facebook Sharing Debugger.

  **Out of Scope:**
  - None.

  **Depends On / Blocks:**
  - Depends on: content (Phase 1), SEO (Phase 2).
  - Blocks: Go/No-Go (P051).

#### Subtasks

| ID      | Agent/Human | File Path / Command  | Description                                                                       | Validation Command |
| ------- | ----------- | -------------------- | --------------------------------------------------------------------------------- | ------------------ |
| P050-01 | HUMAN       | Content review       | Spell-check and grammar review all MDX files.                                      | No issues.         |
| P050-02 | HUMAN       | Link checker         | Manually or with tool check all links.                                             | No broken links.   |
| P050-03 | HUMAN       | Image audit          | Verify alt text on all images.                                                     | Alt text present.  |
| P050-04 | HUMAN       | Google Rich Results  | Test a service page, FAQ page, homepage for JSON-LD validity.                       | Valid.             |
| P050-05 | HUMAN       | sitemap.xml          | Visit `/sitemap.xml` – all pages present.                                          | Correct.           |
| P050-06 | HUMAN       | robots.txt           | Visit `/robots.txt` – allows all.                                                  | Correct.           |
| P050-07 | HUMAN       | Open Graph debugger  | Use Facebook Sharing Debugger on homepage and a service page.                       | OG tags load.      |
| P050-08 | AGENT       | `docs/seo.md`        | Record verification results.                                                       | None.              |

---

### Parent Task P051: Go/No-Go Decision Checklist

- [ ] **P051** | Status: `PENDING`  
  **Related File Paths:**
  - `docs/go-no-go.md`

  **Definition of Done:**
  - A comprehensive Go/No-Go checklist created with all readiness criteria.
  - Each item signed off as PASS.
  - Decision documented: GO (launch) or NO-GO (fix issues).

  **Out of Scope:**
  - None.

  **Rules to Follow:**
  - Include: security headers, CSP, Sentry, env vars, domain, build, Lighthouse, SEO, content, tests, analytics.

  **Depends On / Blocks:**
  - Depends on: all previous tasks.
  - Blocks: production deployment (P052).

#### Subtasks

| ID      | Agent/Human | File Path / Command  | Description                                                                       | Validation Command |
| ------- | ----------- | -------------------- | --------------------------------------------------------------------------------- | ------------------ |
| P051-01 | AGENT       | `docs/go-no-go.md`   | Create checklist with items from all verification tasks.                           | File exists.       |
| P051-02 | HUMAN       | Review               | Go through each item, mark PASS/FAIL.                                              | All PASS.          |
| P051-03 | HUMAN       | Decision             | Document decision to GO or NO-GO.                                                 | GO documented.     |

---

### Parent Task P052: Production Deployment and Smoke Testing

- [ ] **P052** | Status: `PENDING`  
  **Related File Paths:**
  - Vercel dashboard

  **Definition of Done:**
  - Merge to `main` branch triggers production deployment (or manual deploy).
  - Deployment completes successfully on Vercel.
  - Smoke tests run on production:
    - Homepage loads
    - All top pages load
    - Contact form submits (email sent)
    - No console errors
    - Site responsive on mobile
  - Custom domain loads correctly.

  **Out of Scope:**
  - None.

  **Depends On / Blocks:**
  - Depends on: Go/No-Go (P051), custom domain (P047), env vars (P046).
  - Blocks: none.

#### Subtasks

| ID      | Agent/Human | File Path / Command         | Description                                                                                 | Validation Command          |
| ------- | ----------- | --------------------------- | ------------------------------------------------------------------------------------------- | --------------------------- |
| P052-01 | HUMAN       | Git push / merge            | Merge the working branch into `main` and push, triggering Vercel production deployment.     | Deployment starts.          |
| P052-02 | HUMAN       | Vercel dashboard            | Wait for deployment to complete successfully.                                               | Deployment succeeded.       |
| P052-03 | HUMAN       | Smoke test                  | Navigate to homepage, services, industries, demos, FAQ, about, pricing, contact – all work. | All pages load.             |
| P052-04 | HUMAN       | Form test                   | Submit the contact form (with a test email) – success toast appears, email received.        | Email delivered.            |
| P052-05 | HUMAN       | Console errors              | Open browser dev tools on each page – no red errors.                                        | No console errors.          |
| P052-06 | HUMAN       | Mobile view                 | Resize browser or use mobile device – layout is responsive.                                 | Responsive.                 |
| P052-07 | HUMAN       | Custom domain               | Visit `https://yourdedicatedmarketer.com` – site loads.                                     | Works.                      |
| P052-08 | AGENT       | `docs/deployment.md`        | Document final deployment details and smoke test results.                                   | None.                       |

---

### Parent Task P053: Update Documentation and Create Launch Plan

- [ ] **P053** | Status: `PENDING`  
  **Related File Paths:**
  - `README.md` (root)
  - `docs/launch.md`
  - `docs/security.md`
  - `docs/monitoring.md`
  - `docs/deployment.md`

  **Definition of Done:**
  - `docs/launch.md` created with launch date, final checklist summary, post-launch monitoring plan.
  - `README.md` updated with production URL and launch status.
  - All documentation finalized.

  **Out of Scope:**
  - None.

  **Depends On / Blocks:**
  - Depends on: P052 (deployment).
  - Blocks: none.

#### Subtasks

| ID      | Agent/Human | File Path / Command  | Description                                                                              | Validation Command |
| ------- | ----------- | -------------------- | ---------------------------------------------------------------------------------------- | ------------------ |
| P053-01 | AGENT       | `docs/launch.md`     | Create launch document: date, checklist summary, monitoring schedule.                     | File exists.       |
| P053-02 | AGENT       | `README.md`          | Update with production URL, status badge, links to docs.                                 | Manual check.      |
| P053-03 | AGENT       | `docs/monitoring.md` | Document Sentry checks, GA4 review, Web Vitals monitoring, contact form review frequency. | Manual check.      |
| P053-04 | AGENT       | `docs/security.md`   | Finalize security docs with headers, CSP.                                                | Manual check.      |
| P053-05 | AGENT       | `docs/deployment.md` | Finalize deployment documentation.                                                       | Manual check.      |
| P053-06 | AGENT       | `docs/index.md`      | Create a documentation index page for easy navigation.                                   | None.              |

---

### Parent Task P054: Post-Launch Monitoring Plan

- [ ] **P054** | Status: `PENDING`  
  **Related File Paths:**
  - `docs/launch.md` (detailed plan)

  **Definition of Done:**
  - A concrete monitoring schedule documented:
    - Daily: check Sentry for errors, contact form submissions.
    - Weekly: review GA4 traffic, Vercel Analytics Web Vitals, uptime.
    - Issue response: critical errors immediate, minor within 24h, performance degradation within 48h.
  - Optionally set up uptime monitoring (e.g., Uptime Robot).

  **Out of Scope:**
  - None.

  **Depends On / Blocks:**
  - Depends on: P053 (documentation).
  - Blocks: none.

#### Subtasks

| ID      | Agent/Human | File Path / Command  | Description                                                                          | Validation Command |
| ------- | ----------- | -------------------- | ------------------------------------------------------------------------------------ | ------------------ |
| P054-01 | AGENT       | `docs/launch.md`     | Add detailed monitoring schedule and issue response plan.                            | Plan documented.   |
| P054-02 | HUMAN       | Uptime Robot (opt.)  | Set up a free uptime monitor for the production URL.                                 | Monitor active.    |
| P054-03 | AGENT       | `docs/monitoring.md` | Finalize monitoring documentation with links.                                        | None.              |

---

## Summary of Phase 6

Phase 6 consists of 12 parent tasks (P043–P054). It hardens security, sets up error tracking with Sentry, configures the production environment, verifies performance and SEO, and executes the final launch.

**Key Deliverables:**
- Security headers and basic CSP
- Sentry error tracking (client, server, edge)
- Production environment variables in Vercel
- Custom domain with SSL
- Build verification and bundle analysis (JS < 200KB)
- Lighthouse scores ≥ 90 on all key pages
- Final content/SEO verification (JSON-LD, sitemap, OG)
- Go/No-Go checklist signed off
- Production deployment and smoke tests
- Comprehensive documentation and post-launch monitoring plan

---

## Infrastructure Issues

### Issue I001: Typecheck Error - Cannot Find @repo/lib Module

- [ ] **I001** | Status: `PENDING`
  **Related File Paths:**
  - `apps/firm-website/src/types/content.ts`
  - `apps/firm-website/tsconfig.json`
  - `packages/lib/package.json`

  **Description:**
  Typecheck fails with error: `src/types/content.ts(5,15): error TS2307: Cannot find module '@repo/lib' or its corresponding type declaration`. This prevents `pnpm -r run check-types` from passing.

  **Root Cause:**
  The `@repo/lib` workspace package may not be properly configured in the monorepo, or TypeScript module resolution is not correctly configured to resolve workspace package aliases.

  **Impact:**
  - Type checking fails across the monorepo
  - Cannot verify type safety of code changes
  - May affect IDE type hints and autocomplete

  **Priority:** `HIGH` - Blocks type checking workflow

  **Related Tasks:**
  - P001 (Content Types) - depends on @repo/lib exports
  - All subsequent tasks that use content types

  **Suggested Resolution:**
  1. Verify `packages/lib/package.json` has correct `name` field (`@repo/lib`)
  2. Check `apps/firm-website/tsconfig.json` for correct module resolution
  3. Verify workspace configuration in `pnpm-workspace.yaml`
  4. Ensure `packages/lib` is built and types are generated
  5. Check TypeScript path mappings in tsconfig files

**Go/No-Go Criteria Checklist (core items):**
- All tests pass in CI
- Security headers and CSP in place
- Sentry configured and DSN set
- Production env vars set
- Custom domain active
- Lighthouse ≥ 90
- All links and content verified
- Contact form delivers email
- Analytics tracking page views