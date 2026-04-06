# Your Dedicated Marketer

A modern agency platform built with Next.js, Turborepo, and Tailwind CSS.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test
```

## 📁 Project Structure

- **apps/** - Main applications
  - `agency-website/` - Main agency website
  - `client-sites/` - Client-specific sites
  - `internal-tools/` - Internal development tools
- **packages/** - Shared packages and components
  - `design-system/` - UI component library
  - `platform/` - Core platform packages
  - `shared/` - Shared utilities and types
- **docs/** - Documentation and guides
- **tools/** - Development tools and generators

## 🛠️ Tech Stack

- **Framework**: Next.js 16+ with App Router
- **Monorepo**: Turborepo v2.9+
- **Styling**: Tailwind CSS v4.0
- **Package Manager**: pnpm v10+
- **TypeScript**: v5.9+
- **Testing**: Vitest + Playwright
- **Linting**: ESLint + Prettier

## 🏗️ Architecture

This platform uses a modular monorepo architecture with:

- **Package boundaries** for clear separation of concerns
- **Shared design system** for consistent UI/UX
- **Type-safe APIs** with full TypeScript support
- **Automated testing** across all packages
- **Performance optimization** with intelligent caching

## 📖 Documentation

- [Architecture Guide](./ARCHITECTURE.md)
- [Development Guide](./docs/)
- [API Reference](./docs/api/)
- [Components](./packages/design-system/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.
