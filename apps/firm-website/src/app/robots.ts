/**
 * Robots.txt generation for the firm website.
 * Controls crawler access and points to sitemap.
 */

import type { MetadataRoute } from 'next';

const SITE_URL = 'https://yourdedicatedmarketer.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/dashboard/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
