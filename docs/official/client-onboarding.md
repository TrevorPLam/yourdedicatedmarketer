# Client Onboarding

## Overview

Standardized process for onboarding new client projects into the monorepo. Ensures consistency across all client sites and applications.

---

## Onboarding Checklist

### Pre-Project Setup

- [ ] Client requirements documented
- [ ] Framework selection (Astro/Next.js)
- [ ] Database provider chosen
- [ ] Domain name registered
- [ ] Design mockups approved

### Project Creation

```bash
# Generate client project
turbo gen client

# Follow prompts
# ? Client name: client-alpha
# ? Template: astro-marketing
# ? Database: supabase
```

### Configuration Steps

1. **Environment Setup**
   ```bash
   cd apps/client-sites/client-alpha
   cp .env.example .env.local
   # Fill in actual values
   ```

2. **Database Setup**
   ```bash
   # Create Supabase project or Neon branch
   pnpm run db:create
   pnpm run db:migrate
   pnpm run db:seed
   ```

3. **Deployment Configuration**
   - Vercel: Import from GitHub
   - Cloudflare Pages: Connect repository
   - Set environment variables

### Post-Creation

- [ ] DNS configured
- [ ] SSL certificate active
- [ ] Analytics tracking enabled
- [ ] Sentry monitoring configured
- [ ] Client access granted

---

## Time Estimates

| Task | Duration |
|------|----------|
| Project generation | 5 min |
| Database setup | 15 min |
| Content migration | 1-4 hours |
| Styling customization | 2-4 hours |
| Testing | 1 hour |
| Deployment | 30 min |
| **Total** | **4-8 hours** |

---

_Updated April 2026_
