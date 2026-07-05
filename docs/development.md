# Development Guide

This guide provides developers with the information needed to work effectively with the Your Dedicated Marketer monorepo.

## Prerequisites

- **Node.js**: v18 or higher
- **pnpm**: v9.15.0
- **Git**: For version control
- **VS Code**: Recommended IDE (with extensions listed below)

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/yourdedicatedmarketer.git
cd yourdedicatedmarketer
```

### 2. Install Dependencies

```bash
pnpm install
```

This installs all dependencies for the monorepo using the lockfile for reproducible builds.

### 3. Configure Environment Variables

```bash
cp apps/firm-website/.env.example apps/firm-website/.env.local
```

Edit `apps/firm-website/.env.local` with your configuration. See [Environment Variables](environment.md) for details.

### 4. Start Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

## Development Workflow

### Running Commands

#### From the Root

Most commands can be run from the repository root using Turborepo:

```bash
# Development
pnpm dev

# Build
pnpm build

# Lint
pnpm lint

# Test
pnpm test

# Type check
pnpm check-types
```

#### For Specific Packages

Use the `--filter` flag to run commands for specific packages:

```bash
# Run dev for firm-website only
pnpm --filter @repo/firm-website dev

# Run tests for lib package
pnpm --filter @repo/lib test

# Build ui package
pnpm --filter @repo/ui build
```

### Adding a New Application

To add a new application to the monorepo:

1. **Create the app directory**:
   ```bash
   mkdir apps/new-app
   cd apps/new-app
   ```

2. **Initialize the package**:
   ```bash
   pnpm init
   ```

3. **Configure package.json**:
   ```json
   {
     "name": "@repo/new-app",
     "version": "0.0.0",
     "private": true,
     "type": "module",
     "scripts": {
       "dev": "next dev",
       "build": "next build",
       "lint": "next lint",
       "test": "vitest",
       "check-types": "tsc --noEmit"
     }
   }
   ```

4. **Add dependencies**:
   ```bash
   pnpm add next react react-dom
   pnpm add -D typescript @types/react @types/node
   ```

5. **Add to turbo.json**:
   Add the new app to the pipeline configuration in `turbo.json`.

6. **Update workspace**:
   The app will be automatically detected by pnpm workspaces.

### Adding a New Package

To add a new shared package:

1. **Create the package directory**:
   ```bash
   mkdir packages/new-package
   cd packages/new-package
   ```

2. **Initialize the package**:
   ```bash
   pnpm init
   ```

3. **Configure package.json**:
   ```json
   {
     "name": "@repo/new-package",
     "version": "0.0.0",
     "private": true,
     "type": "module",
     "main": "./src/index.ts",
     "types": "./src/index.ts",
     "exports": {
       ".": "./src/index.ts"
     },
     "scripts": {
       "build": "tsc",
       "lint": "eslint .",
       "test": "vitest",
       "check-types": "tsc --noEmit"
     }
   }
   ```

4. **Create source files**:
   ```bash
   mkdir src
   touch src/index.ts
   ```

5. **Add dependencies**:
   ```bash
   pnpm add -D typescript
   ```

6. **Add to turbo.json**:
   Add the new package to the pipeline configuration.

### Adding a New Component to @repo/ui

To add a new component to the UI package:

1. **Navigate to the UI package**:
   ```bash
   cd packages/ui
   ```

2. **Create the component file**:
   ```bash
   touch src/components/ui/your-component.tsx
   ```

3. **Implement the component**:
   ```tsx
   import * as React from "react"
   import { cn } from "@/lib/utils"

   interface YourComponentProps extends React.HTMLAttributes<HTMLDivElement> {
   // Add your custom props here
   }

   const YourComponent = React.forwardRef<HTMLDivElement, YourComponentProps>(
     ({ className, ...props }, ref) => {
       return (
         <div
           ref={ref}
           className={cn("your-base-classes", className)}
           {...props}
         >
           {/* Component content */}
         </div>
       )
     }
   )
   YourComponent.displayName = "YourComponent"

   export { YourComponent }
   ```

4. **Export from the UI package**:
   Add the export to `src/index.ts`:
   ```typescript
   export { YourComponent } from './components/ui/your-component'
   ```

5. **Write a Storybook story**:
   Create `src/components/ui/your-component.stories.tsx`:
   ```tsx
   import type { Meta, StoryObj } from '@storybook/react'
   import { YourComponent } from './your-component'

   const meta: Meta<typeof YourComponent> = {
     title: 'UI/YourComponent',
     component: YourComponent,
     tags: ['autodocs'],
   }

   export default meta
   type Story = StoryObj<typeof YourComponent>

   export const Default: Story = {
     args: {
       // Default props
     },
   }
   ```

6. **Write unit tests**:
   Create `src/components/ui/your-component.test.tsx`:
   ```tsx
   import { describe, it, expect } from 'vitest'
   import { render, screen } from '@testing-library/react'
   import { YourComponent } from './your-component'

   describe('YourComponent', () => {
     it('renders correctly', () => {
       render(<YourComponent>Test</YourComponent>)
       expect(screen.getByText('Test')).toBeInTheDocument()
     })
   })
   ```

7. **Update documentation**:
   Add component documentation to `docs/components.md` with usage examples, props, and best practices.

8. **Run tests and Storybook**:
   ```bash
   # Run unit tests
   pnpm --filter @repo/ui test

   # Start Storybook to view your component
   pnpm --filter @repo/ui storybook
   ```

#### Component Guidelines

- **Use Server Components by default** - Only use `"use client"` when you need interactivity
- **Use forwardRef** - Components should forward refs for composition
- **Use cn utility** - Use the `cn` utility for conditional class merging
- **Follow shadcn/ui patterns** - Use class-variance-authority for variants when needed
- **Add TypeScript types** - Properly type all props with interfaces
- **Write tests** - All components should have unit tests
- **Create stories** - All components should have Storybook stories
- **Document usage** - Update docs/components.md with usage examples

### Adding Dependencies

#### Adding to a Specific Package

```bash
# Add to firm-website
pnpm --filter @repo/firm-website add package-name

# Add dev dependency to lib
pnpm --filter @repo/lib add -D typescript
```

#### Adding to Multiple Packages

```bash
# Add to all packages
pnpm add -w package-name

# Add to specific packages
pnpm add --filter @repo/firm-website --filter @repo/ui package-name
```

#### Using Workspace Packages

To use a workspace package in another package:

```bash
# Add ui package as dependency to firm-website
pnpm --filter @repo/firm-website add @repo/ui
```

## Working with Content

### Adding a New Page

This guide explains how to add a new page following the patterns established in Phase 3.

#### Types of Pages

There are three main page types in the application:

1. **Static Pages** - Simple pages with content from MDX files (e.g., About, Pricing)
2. **Hub Pages** - List pages that display multiple content items (e.g., Services Hub, Industries Hub)
3. **Dynamic Detail Pages** - Individual content pages with dynamic routing (e.g., `/services/[slug]`)

#### Adding a New Static Page

1. **Create the MDX content file** in `apps/firm-website/src/content/pages/`:
   ```bash
   touch apps/firm-website/src/content/pages/your-page.mdx
   ```

2. **Add frontmatter** to the MDX file:
   ```mdx
   ---
   title: "Your Page Title"
   slug: "your-page"
   description: "Short description for SEO"
   ---

   # Your Page Title

   Your content here...
   ```

3. **Create the page component** in `apps/firm-website/src/app/(marketing)/your-page/page.tsx`:
   ```typescript
   import { getPage } from '@/lib/content'
   import { ContentPage } from '@/components/features/content-page'
   import { generateMetadata } from '@/lib/seo'
   import { notFound } from 'next/navigation'

   export const metadata = generateMetadata({
     title: 'Your Page Title',
     description: 'Short description for SEO',
   })

   export default async function YourPage() {
     const page = await getPage('your-page')

     if (!page) {
       notFound()
     }

     return (
       <ContentPage
         content={page.body}
         title={page.title}
       />
     )
   }
   ```

4. **Add navigation link** (optional) in `apps/firm-website/src/lib/navigation.ts`:
   ```typescript
   export function getNavItems(): NavItem[] {
     return [
       // ... existing items
       { label: 'Your Page', href: '/your-page' as Route },
     ]
   }
   ```

5. **Write a test** in `apps/firm-website/src/app/(marketing)/your-page/page.test.tsx`:
   ```typescript
   import { describe, it, expect } from 'vitest'
   import { render, screen } from '@testing-library/react'
   import YourPage from './page'

   describe('YourPage', () => {
     it('renders page content', async () => {
       const page = await YourPage()
       render(page)
       expect(screen.getByText('Your Page Title')).toBeInTheDocument()
     })
   })
   ```

#### Adding a New Hub Page

1. **Create the hub component** in `apps/firm-website/src/components/features/your-type/your-type-hub.tsx`:
   ```typescript
   import { getAllYourType } from '@/lib/content'
   import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui'
   import Link from 'next/link'
   import type { Route } from '@/lib/routes'

   interface YourTypeHubProps {
     title?: string
     description?: string
   }

   export async function YourTypeHub({ title, description }: YourTypeHubProps) {
     const items = await getAllYourType()

     return (
       <div className="space-y-8">
         {title && <h1 className="text-4xl font-bold">{title}</h1>}
         {description && <p className="text-xl text-muted-foreground">{description}</p>}

         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
           {items.map((item) => (
             <Link key={item.slug} href={`/your-type/${item.slug}` as Route}>
               <Card className="h-full hover:shadow-lg transition-shadow">
                 <CardHeader>
                   <CardTitle>{item.title}</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <p className="text-muted-foreground">{item.description}</p>
                 </CardContent>
               </Card>
             </Link>
           ))}
         </div>
       </div>
     )
   }
   ```

2. **Create the page component** in `apps/firm-website/src/app/(marketing)/your-type/page.tsx`:
   ```typescript
   import { YourTypeHub } from '@/components/features/your-type/your-type-hub'
   import { generateMetadata } from '@/lib/seo'

   export const metadata = generateMetadata({
     title: 'Your Type',
     description: 'Description for your type hub',
   })

   export default function YourTypePage() {
     return (
       <YourTypeHub
         title="Your Type"
         description="Description for your type hub"
       />
     )
   }
   ```

3. **Add navigation link** in `apps/firm-website/src/lib/navigation.ts`

4. **Write tests** for both the hub component and page

#### Adding a New Dynamic Detail Page

1. **Create the detail component** in `apps/firm-website/src/components/features/your-type/your-type-detail.tsx`:
   ```typescript
   import { ContentPage } from '@/components/features/content-page'
   import { getBreadcrumbs } from '@/lib/navigation'

   interface YourTypeDetailProps {
     content: string
     title: string
     slug: string
   }

   export function YourTypeDetail({ content, title, slug }: YourTypeDetailProps) {
     const breadcrumbs = getBreadcrumbs(slug)

     return (
       <div className="space-y-8">
         {breadcrumbs && (
           <nav aria-label="Breadcrumb">
             <ol className="flex items-center space-x-2 text-sm">
               {breadcrumbs.map((crumb, index) => (
                 <li key={crumb.href}>
                   {index > 0 && <span className="mx-2">/</span>}
                   <a href={crumb.href} className="hover:underline">
                     {crumb.label}
                   </a>
                 </li>
               ))}
             </ol>
           </nav>
         )}

         <ContentPage content={content} title={title} />
       </div>
     )
   }
   ```

2. **Create the dynamic page** in `apps/firm-website/src/app/(marketing)/your-type/[slug]/page.tsx`:
   ```typescript
   import { getYourTypeBySlug, getAllSlugs } from '@/lib/content'
   import { YourTypeDetail } from '@/components/features/your-type/your-type-detail'
   import { generateMetadata } from '@/lib/seo'
   import { notFound } from 'next/navigation'

   export async function generateStaticParams() {
     const slugs = await getAllSlugs('your-type')
     return slugs.map((slug) => ({ slug }))
   }

   export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
     const { slug } = await params
     const item = await getYourTypeBySlug(slug)

     if (!item) {
       return {}
     }

     return generateMetadata({
       title: item.title,
       description: item.description,
    })
   }

   export default async function YourTypePage({ params }: { params: Promise<{ slug: string }> }) {
     const { slug } = await params
     const item = await getYourTypeBySlug(slug)

     if (!item) {
       notFound()
     }

     return (
       <YourTypeDetail
         content={item.body}
         title={item.title}
         slug={slug}
       />
     )
   }
   ```

3. **Write tests** for the dynamic page

#### Best Practices

- **Use Server Components by default** - Only use `"use client"` when you need interactivity
- **Follow the deep module pattern** - Each component should have a single, clear responsibility
- **Use type-safe navigation** - Import `Route` type and cast your hrefs
- **Add metadata** - Use `generateMetadata()` for consistent SEO
- **Handle 404s** - Use `notFound()` when content doesn't exist
- **Write tests** - All pages should have unit tests
- **Use ContentPage** - For consistent content layout across static pages
- **Add breadcrumbs** - For dynamic detail pages to improve navigation
- **Follow existing patterns** - Look at similar pages (services, industries, demos) for reference

#### Common Patterns

- **Static page**: Use `ContentPage` component with `getPage()` utility
- **Hub page**: Create a hub component that fetches all items and renders cards
- **Dynamic page**: Use `generateStaticParams()` and `generateMetadata()` with async params
- **Breadcrumbs**: Use `getBreadcrumbs()` utility for hierarchical navigation
- **Metadata**: Use `generateMetadata()` from `@/lib/seo` for consistent SEO

### Adding New Content

Content is stored in `apps/firm-website/src/content/`. To add new content:

1. **Create a new markdown file** in the appropriate directory:
   - `services/` - Service offerings
   - `industries/` - Industry-specific content
   - `demos/` - Portfolio items
   - `faq/` - Frequently asked questions
   - `pages/` - Static page content

2. **Add frontmatter** with required fields:
   ```markdown
   ---
   title: "Your Title"
   slug: "your-slug"
   description: "Short description"
   ---

   Your content here...
   ```

3. **The content is automatically available** through the content API.

See [Content Pipeline](content.md) for detailed information.

### Accessing Content in Components

```typescript
import { getAllServices, getService } from '@/lib/content';

// Get all services
const services = await getAllServices();

// Get a specific service
const service = await getService('website-design');
```

## Writing and Editing MDX Content

MDX (Markdown + JSX) allows you to write content using Markdown syntax while also using React components directly in your content files. This section provides a comprehensive guide to writing and editing MDX content.

### MDX File Structure

An MDX file consists of two parts:

1. **Frontmatter** (YAML metadata at the top, enclosed in `---`)
2. **Content body** (Markdown and JSX)

Example:
```mdx
---
title: "Website Design"
slug: "website-design"
description: "Professional website design services for small businesses"
featured: true
order: 1
---

# Website Design & Development

We create beautiful, functional websites that help your business grow.

## Our Process

1. Discovery
2. Design
3. Development
4. Launch

<Button variant="default">Get Started</Button>
```

### Frontmatter Fields

Frontmatter fields vary by content type. Always include required fields:

**Services**:
- `title` (required) - Display title
- `slug` (required) - URL-friendly identifier (kebab-case)
- `description` (required) - Short description for SEO
- `featured` (optional) - Boolean for prominent display
- `order` (optional) - Number for sorting

**Industries**:
- `title` (required) - Display title
- `slug` (required) - URL-friendly identifier
- `description` (required) - Short description
- `icon` (optional) - Emoji or icon identifier
- `order` (optional) - Number for sorting

**Demos**:
- `title` (required) - Display title
- `slug` (required) - URL-friendly identifier
- `description` (required) - Short description
- `industry` (required) - Industry slug reference

**FAQs**:
- `title` (required) - The question
- `slug` (required) - URL-friendly identifier
- `description` (required) - Short description
- `category` (required) - 'general' | 'pricing' | 'process'
- `order` (optional) - Number for sorting

**Pages**:
- `title` (required) - Display title
- `slug` (required) - URL-friendly identifier
- `description` (required) - Short description

### Markdown Syntax

Use standard Markdown syntax for formatting:

```mdx
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*

- Unordered list item
- Another item

1. Ordered list item
2. Another item

[Link text](https://example.com)

![Alt text](/path/to/image.jpg)

> Blockquote

`Inline code`

```
Code block
```

---

Horizontal rule
```

### Using React Components

You can use React components from `@repo/ui` directly in MDX files:

```mdx
<Button variant="default">Click Me</Button>

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content here</p>
  </CardContent>
</Card>

<Container maxWidth="lg">
  <Section>
    <h2>Section Content</h2>
  </Section>
</Container>

<Accordion>
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>
      Yes. It adheres to the WAI-ARIA design pattern.
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

### Available Components

The following components are available in MDX files:

- `Button` - Interactive buttons with variants (default, outline, ghost, etc.)
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` - Card components
- `Container` - Responsive containers with maxWidth options
- `Section` - Sectioned content areas with padding
- `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` - Collapsible content

### Best Practices for MDX Content

#### 1. Use Semantic Headings

Start with H1 for the main title, then use H2, H3 for subsections:

```mdx
# Main Title (H1)

## Section (H2)

### Subsection (H3)
```

#### 2. Keep Paragraphs Concise

Break long paragraphs into shorter ones for readability:

```mdx
Good: Short, focused paragraphs are easier to read.

Avoid: Very long paragraphs that cover multiple topics can be difficult to read and may cause readers to lose interest or miss important information.
```

#### 3. Use Lists for Scannability

Use bullet points or numbered lists to break down complex information:

```mdx
Our services include:
- Website design
- SEO optimization
- Content marketing
```

#### 4. Add Links Strategically

Link to related content to improve navigation and SEO:

```mdx
Learn more about our [website design services](/services/website-design).
```

#### 5. Use Components for Interactive Elements

Use React components for buttons, cards, and other interactive elements:

```mdx
<Button variant="default" asChild>
  <Link href="/contact">Contact Us</Link>
</Button>
```

#### 6. Follow AEO Format for FAQs

For FAQ content, start with a direct 40-60 word answer:

```mdx
---
title: "How much does a website cost?"
slug: cost
category: pricing
---

A professional website for small businesses in DFW typically costs $3,000-$8,000 depending on complexity, with our Website Design package starting at $3,997 for a complete 5-page site including design, development, and launch.

## What's Included

Our pricing includes...
```

#### 7. Use Consistent Formatting

Maintain consistent formatting across similar content types:
- Use the same heading hierarchy
- Follow the same structure for similar pages
- Keep frontmatter fields in the same order

#### 8. Write for Your Audience

- Use clear, simple language
- Avoid jargon unless necessary
- Focus on benefits, not just features
- Include calls-to-action

#### 9. Optimize for SEO

- Include relevant keywords naturally
- Use descriptive titles and descriptions
- Add internal links to related content
- Keep content length appropriate (400-1000 words depending on type)

#### 10. Test Your Content

After creating or editing MDX content:
1. Run the dev server: `pnpm dev`
2. Navigate to the page to verify rendering
3. Check that components render correctly
4. Verify links work properly
5. Test on mobile devices

### Common MDX Patterns

#### Service Page Pattern

```mdx
---
title: "Service Name"
slug: "service-name"
description: "Short description"
featured: true
order: 1
---

# Service Name

Brief overview of the service.

## What's Included

- Feature 1
- Feature 2
- Feature 3

## Pricing

Pricing information here.

## Process

1. Step 1
2. Step 2
3. Step 3

<Button variant="default">Get Started</Button>
```

#### Industry Page Pattern

```mdx
---
title: "Industry Name"
slug: "industry-name"
description: "Short description"
icon: 🔧
order: 1
---

# Industry Name

Industry-specific pain points and challenges.

## Why This Industry Needs Specialized Web Design

Explanation of industry-specific needs.

## What's Included

- Industry-specific feature 1
- Industry-specific feature 2

## See It In Action

<Link href="/demos/related-demo">View Demo</Link>
```

#### Demo Page Pattern

```mdx
---
title: "Demo Name"
slug: "demo-name"
description: "Short description"
industry: "industry-slug"
---

# Demo Name

## The Situation

Context and background.

## The Challenge

Problems and constraints.

## The Approach

Solutions and design decisions.

## The Outcome

Results and impact.

<Button variant="outline">View Live Demo</Button>
```

### Troubleshooting MDX Issues

#### Frontmatter Not Parsing

Ensure frontmatter is properly formatted:
- Must start and end with `---` on separate lines
- No spaces before the dashes
- Use spaces after colons in key-value pairs

```mdx
---
title: "Correct"
slug: "correct-slug"
---

# Content
```

#### Components Not Rendering

- Ensure components are imported in `mdx-components.tsx`
- Check component names are capitalized (React convention)
- Verify component props are correct

#### Links Not Working

- Use relative paths for internal links: `/services/website-design`
- Use full URLs for external links: `https://example.com`
- Ensure slugs in frontmatter match the actual file names

#### Content Not Appearing

- Ensure file uses `.mdx` extension
- Check file is in the correct directory
- Verify frontmatter has required fields
- Restart dev server after adding new files

### Resources

- [MDX Documentation](https://mdxjs.com/)
- [Markdown Guide](https://www.markdownguide.org/)
- [Content Pipeline Documentation](content.md) - Content structure and API
- [Architecture Documentation](architecture.md) - Content architecture details

## Testing

### Writing Unit Tests

Unit tests are located in `apps/firm-website/src/test/`:

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '@/lib/utils';

describe('myFunction', () => {
  it('should return the expected result', () => {
    expect(myFunction('input')).toBe('output');
  });
});
```

### Writing E2E Tests

E2E tests are located in `apps/firm-website/src/e2e/`:

```typescript
import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Your Dedicated Marketer/);
});
```

### Running Tests

```bash
# Run all unit tests
pnpm test

# Run unit tests in watch mode
pnpm --filter @repo/firm-website test:watch

# Run E2E tests
pnpm test:e2e

# Run tests with coverage
pnpm test:coverage
```

## Linting and Formatting

### Linting

```bash
# Lint all packages
pnpm lint

# Lint specific package
pnpm --filter @repo/firm-website lint

# Auto-fix linting issues
pnpm --filter @repo/firm-website lint --fix
```

### Formatting

The project uses Prettier for code formatting:

```bash
# Format all files
pnpm format

# Format specific package
pnpm --filter @repo/firm-website format
```

## Type Checking

```bash
# Type check all packages
pnpm check-types

# Type check specific package
pnpm --filter @repo/firm-website check-types
```

## Git Workflow

### Branch Strategy

- `main`: Production branch
- `develop`: Development branch (optional)
- Feature branches: `feature/feature-name`
- Bugfix branches: `bugfix/bug-description`

### Commit Convention

Follow conventional commit format:

```
type(scope): subject

body

footer
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build process or tooling changes

Example:
```
feat(ui): add button component

Add a new button component with multiple variants and sizes.

Closes #123
```

### Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Run tests and linting: `pnpm lint && pnpm test && pnpm check-types`
4. Commit with conventional commit format
5. Push to GitHub
6. Create a pull request
7. Wait for CI to pass
8. Request review
9. Merge after approval

## Troubleshooting

### Common Issues

#### Dependency Issues

If you encounter dependency issues:

```bash
# Clear node_modules and reinstall
rm -rf node_modules apps/*/node_modules packages/*/node_modules
rm pnpm-lock.yaml
pnpm install
```

#### Turborepo Cache Issues

If Turborepo cache causes issues:

```bash
# Clear Turborepo cache
rm -rf .turbo
```

#### Port Already in Use

If port 3000 is already in use:

```bash
# Kill process on port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

#### TypeScript Errors

If TypeScript errors persist:

```bash
# Clear TypeScript cache
rm -rf apps/*/node_modules/.cache packages/*/node_modules/.cache
```

## Recommended VS Code Extensions

- **ESLint**: `dbaeumer.vscode-eslint`
- **Prettier**: `esbenp.prettier-vscode`
- **TypeScript**: `ms-vscode.vscode-typescript-next`
- **Tailwind CSS IntelliSense**: `bradlc.vscode-tailwindcss`
- **Vitest**: `vitest.explorer`
- **Playwright**: `ms-playwright.playwright`

## Additional Resources

- [Repository Setup](repo-setup.md) - Monorepo structure and tooling
- [Architecture](architecture.md) - System architecture and design decisions
- [Environment Variables](environment.md) - Environment configuration
- [Testing Strategy](testing.md) - Testing infrastructure
- [Deployment Guide](deployment.md) - Deployment process
- [Content Pipeline](content.md) - Content structure and API
