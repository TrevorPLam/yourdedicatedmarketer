# Deployment Guide

This document describes the deployment process for the firm website using Vercel and GitHub Actions CI.

## Vercel Deployment

### Project Setup

The Vercel project is configured to deploy the `apps/firm-website` application from the monorepo.

### Configuration

- **Root Directory**: Repository root (monorepo structure)
- **Framework Preset**: Next.js (auto-detected)
- **Package Manager**: pnpm (auto-detected)
- **Build Command**: `pnpm turbo build --filter=@repo/firm-website`
- **Output Directory**: `apps/firm-website/.next`

### vercel.json

The `vercel.json` file at the repository root specifies:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "installCommand": "pnpm install",
  "buildCommand": "pnpm turbo build --filter=@repo/firm-website",
  "outputDirectory": "apps/firm-website/.next"
}
```

This ensures that:
- Dependencies are installed using pnpm at the monorepo root
- Only the firm-website app is built using Turborepo's filter
- The output directory is correctly specified for Next.js

### Environment Variables

Set the following environment variables in Vercel:

- `NEXT_PUBLIC_SITE_URL`: The production URL (e.g., `https://yourdedicatedmarketer.vercel.app`)

Set these for both Production and Preview environments.

### Deployment Workflow

1. **Production Deployments**: Automatically triggered when pushing to the `main` branch
2. **Preview Deployments**: Automatically triggered for every pull request

### Turborepo Remote Caching

Vercel automatically enables remote caching for Turborepo projects. This means:
- First build: Full compilation (~30-60s)
- Subsequent builds with no changes: Cached (~2-5s)
- Partial changes: Only rebuilds affected packages

No additional configuration is required for remote caching.

### turbo-ignore (Optional)

To skip unnecessary builds when the app hasn't changed, configure the "Ignored Build Step" in Vercel:

1. Go to Project Settings > Git > Ignored Build Step
2. Select "Custom" and enter: `npx turbo-ignore`

This checks if the package or its dependencies changed since the last deployment.

## GitHub Actions CI

### Workflow

The CI workflow (`.github/workflows/ci.yml`) runs on:
- Pull requests to `main`
- Pushes to `main`

### Steps

1. **Checkout**: Clone the repository
2. **Setup pnpm**: Install pnpm 9.15.0
3. **Setup Node.js**: Install Node.js 22 with pnpm caching
4. **Install dependencies**: Install with frozen lockfile for reproducibility
5. **Run lint**: Run `pnpm turbo lint`
6. **Run type check**: Run `pnpm turbo check-types`
7. **Run tests**: Run `pnpm turbo test`

### Caching

The workflow uses GitHub Actions caching for pnpm dependencies to speed up builds.

## Manual Deployment

To manually trigger a deployment:

1. Push to the `main` branch
2. Or use the Vercel dashboard to trigger a manual deployment

## Custom Domain Configuration

### Adding a Custom Domain

To add a custom domain to your Vercel project:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Domains**
3. Click **Add Domain** and enter your domain (e.g., `yourdedicatedmarketer.com`)
4. Vercel will automatically suggest adding the `www` subdomain as well

### DNS Configuration

After adding your domain, Vercel will display the required DNS records. The configuration depends on whether you're setting up an apex domain or a subdomain:

#### Apex Domain (e.g., `yourdedicatedmarketer.com`)

- **Record Type**: A
- **Name**: `@` (or blank)
- **Value**: Vercel's IP address (e.g., `76.76.21.21`)
- **TTL**: Default or 3600

#### Subdomain (e.g., `www.yourdedicatedmarketer.com`)

- **Record Type**: CNAME
- **Name**: `www`
- **Value`: Vercel's CNAME target (e.g., `cname.vercel-dns-0.com`)
- **TTL**: Default or 3600

**Note**: The exact values may vary for your project. Always check the DNS configuration shown in the Vercel dashboard after adding your domain.

### Domain Redirects

Vercel recommends using the `www` subdomain as your primary domain with a redirect from the apex domain. This provides:

- Better CDN control for improved reliability and speed
- CNAME records (for www) instead of A records, allowing Vercel to steer traffic during DDoS attacks
- Cached redirects in visitor browsers for faster subsequent visits

To set up the redirect:

1. In **Settings** → **Domains**, select the domain you want to redirect from
2. Click **Edit**
3. Use the **Redirect to** dropdown to select the target domain
4. Save the configuration

Example: Redirect `yourdedicatedmarketer.com` → `www.yourdedicatedmarketer.com`

### SSL Certificate

Vercel automatically provisions SSL certificates for all custom domains. After configuring DNS:

1. Wait for DNS propagation (typically 5-10 minutes)
2. Vercel will automatically issue an SSL certificate via Let's Encrypt
3. The certificate status is visible in the Domains section
4. Once issued, your site will be accessible over HTTPS

### Verification

After configuration, verify your domain is working:

1. Visit your domain in a browser (e.g., `https://www.yourdedicatedmarketer.com`)
2. Check that the site loads correctly
3. Verify the SSL certificate is valid (look for the lock icon)
4. Test the redirect from apex to www (or vice versa)
5. Check browser console for any mixed content warnings

### CLI Commands

For advanced users, Vercel CLI can be used to manage domains:

```bash
# List existing domains
vercel domains ls

# Add a domain to your project
vercel domains add yourdedicatedmarketer.com

# Add www subdomain
vercel domains add www.yourdedicatedmarketer.com

# Inspect domain to see required DNS records
vercel domains inspect yourdedicatedmarketer.com

# Add DNS records (if using Vercel as DNS provider)
vercel dns add yourdedicatedmarketer.com '@' A 76.76.21.21
vercel dns add yourdedicatedmarketer.com www CNAME cname.vercel-dns-0.com

# List DNS records
vercel dns ls

# List SSL certificates
vercel certs ls
```

### Best Practices

- **Use www as primary**: Redirect apex to www for better CDN performance
- **Avoid duplicate content**: Always set up redirects if using both apex and www
- **Check DNS propagation**: Use tools like `dig` or `nslookup` to verify DNS changes
- **Monitor SSL status**: Ensure certificates are automatically renewed
- **Update environment variables**: Set `NEXT_PUBLIC_SITE_URL` to your custom domain in Vercel

## Troubleshooting

### Build Failures

- Check that `pnpm-lock.yaml` is committed and up-to-date
- Verify Node.js version is 22 or higher
- Ensure all dependencies are installed correctly

### Environment Variables

- Ensure `NEXT_PUBLIC_SITE_URL` is set for both Production and Preview
- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser

### Monorepo Issues

- If builds fail due to missing dependencies, ensure `vercel.json` install command runs from root
- Verify Turborepo filter matches the package name: `@repo/firm-website`

### Domain Issues

- **DNS not propagating**: Wait up to 24 hours for DNS changes to propagate globally
- **SSL certificate pending**: DNS must be correctly configured before Vercel can issue certificates
- **Redirect not working**: Ensure both domains are added to the project before setting up redirects
- **Mixed content warnings**: Update all internal links to use HTTPS
