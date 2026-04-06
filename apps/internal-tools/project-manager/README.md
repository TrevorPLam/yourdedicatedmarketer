# Project Manager - Internal Tools

A Next.js 16+ application for internal agency project management, built with
modern React patterns and TypeScript.

## Features

- **Next.js 16+** with App Router and Server Components
- **Authentication** with NextAuth.js v5 (credentials and Google OAuth)
- **Dashboard Layout** with responsive sidebar navigation
- **Real-time Data** with React Query (TanStack Query)
- **Modern UI** with agency design system components
- **TypeScript** for type safety
- **Tailwind CSS** for styling

## Getting Started

### Prerequisites

- Node.js 22.12.0+
- pnpm 10.0.0+

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Run development server
pnpm dev
```

### Environment Variables

Create a `.env.local` file with the following variables:

```bash
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3002
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Usage

### Development

```bash
# Start development server on port 3002
pnpm dev

# Type checking
pnpm type-check

# Linting
pnpm lint
```

### Building

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

### Testing

```bash
# Run unit tests
pnpm test

# Run E2E tests
pnpm test:e2e
```

## Authentication

### Demo Credentials

For testing purposes, use these demo credentials:

- **Email**: admin@agency.com
- **Password**: admin123

### Google OAuth

To enable Google OAuth:

1. Create a project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add authorized redirect URI: `http://localhost:3002/api/auth/callback/google`
5. Add credentials to environment variables

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/auth/          # NextAuth.js API routes
│   ├── dashboard/          # Protected dashboard pages
│   ├── login/             # Authentication pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── layout/            # Layout components
│   └── dashboard/         # Dashboard-specific components
└── lib/
    ├── auth.ts            # NextAuth configuration
    ├── auth-helpers.ts    # Authentication helpers
    └── utils.ts           # Utility functions
```

## Technology Stack

- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript 5.9+
- **Styling**: Tailwind CSS 4.0
- **Authentication**: NextAuth.js v5
- **State Management**: React Query (TanStack Query)
- **UI Components**: Agency Design System
- **Development**: Vite, ESLint, Prettier

## Contributing

1. Follow the existing code style and patterns
2. Use TypeScript for all new code
3. Add tests for new features
4. Update documentation as needed

## License

Internal use only - © 2026 Your Agency
