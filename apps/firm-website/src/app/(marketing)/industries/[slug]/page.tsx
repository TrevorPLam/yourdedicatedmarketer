import { notFound } from 'next/navigation';
import { IndustryDetail } from '@/components/features/industries/industry-detail';
import { getIndustry, getAllSlugs } from '@/lib/content';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

// Set dynamicParams to false to return 404 for unknown slugs
export const dynamicParams = false;

/**
 * Generate static params for all industry slugs at build time.
 * This enables static site generation for all industry pages.
 */
export async function generateStaticParams() {
  const slugs = await getAllSlugs('industries');
  return slugs.map((slug) => ({ slug }));
}

/**
 * Generate dynamic metadata for each industry page.
 * Uses the industry's title and description from frontmatter.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const industry = await getIndustry(slug);

  if (!industry) {
    return generateSEOMetadata({
      title: 'Industry Not Found',
      description: 'The requested industry could not be found.',
      path: `/industries/${slug}`,
    });
  }

  const industryData = industry.data as {
    title: string;
    description: string;
  };

  return generateSEOMetadata({
    title: industryData.title,
    description: industryData.description,
    path: `/industries/${slug}`,
  });
}

/**
 * Dynamic industry page that renders individual industry MDX content.
 * Fetches industry content by slug and renders with IndustryDetail component.
 * Returns 404 if industry is not found.
 */
export default async function IndustryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const industry = await getIndustry(slug);

  if (!industry) {
    notFound();
  }

  const industryData = industry.data as {
    title: string;
  };

  return (
    <IndustryDetail
      content={industry.content}
      title={industryData.title}
      slug={slug}
    />
  );
}
