import { notFound } from 'next/navigation';
import { ServiceDetail } from '@/components/features/services/service-detail';
import { getService, getAllSlugs } from '@/lib/content';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

// Set dynamicParams to false to return 404 for unknown slugs
export const dynamicParams = false;

/**
 * Generate static params for all service slugs at build time.
 * This enables static site generation for all service pages.
 */
export async function generateStaticParams() {
  const slugs = await getAllSlugs('services');
  return slugs.map((slug) => ({ slug }));
}

/**
 * Generate dynamic metadata for each service page.
 * Uses the service's title and description from frontmatter.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    return generateSEOMetadata({
      title: 'Service Not Found',
      description: 'The requested service could not be found.',
      path: `/services/${slug}`,
    });
  }

  const serviceData = service.data as {
    title: string;
    description: string;
  };

  return generateSEOMetadata({
    title: serviceData.title,
    description: serviceData.description,
    path: `/services/${slug}`,
  });
}

/**
 * Dynamic service page that renders individual service MDX content.
 * Fetches service content by slug and renders with ServiceDetail component.
 * Returns 404 if service is not found.
 */
export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    notFound();
  }

  const serviceData = service.data as {
    title: string;
  };

  return (
    <ServiceDetail
      content={service.content}
      title={serviceData.title}
      slug={slug}
    />
  );
}
