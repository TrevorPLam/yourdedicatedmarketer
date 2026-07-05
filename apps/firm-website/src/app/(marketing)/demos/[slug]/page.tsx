import { notFound } from 'next/navigation';
import { DemoDetail } from '@/components/features/demos/demo-detail';
import { getDemo, getAllSlugs } from '@/lib/content';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

// Set dynamicParams to false to return 404 for unknown slugs
export const dynamicParams = false;

/**
 * Generate static params for all demo slugs at build time.
 * This enables static site generation for all demo pages.
 */
export async function generateStaticParams() {
  const slugs = await getAllSlugs('demos');
  return slugs.map((slug) => ({ slug }));
}

/**
 * Generate dynamic metadata for each demo page.
 * Uses the demo's title and description from frontmatter.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const demo = await getDemo(slug);

  if (!demo) {
    return generateSEOMetadata({
      title: 'Demo Not Found',
      description: 'The requested demo could not be found.',
      path: `/demos/${slug}`,
    });
  }

  const demoData = demo.data as {
    title: string;
    description: string;
  };

  return generateSEOMetadata({
    title: demoData.title,
    description: demoData.description,
    path: `/demos/${slug}`,
  });
}

/**
 * Dynamic demo page that renders individual demo MDX content.
 * Fetches demo content by slug and renders with DemoDetail component.
 * Returns 404 if demo is not found.
 */
export default async function DemoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const demo = await getDemo(slug);

  if (!demo) {
    notFound();
  }

  const demoData = demo.data as {
    title: string;
    industry: string;
  };

  return (
    <DemoDetail
      content={demo.content}
      title={demoData.title}
      slug={slug}
      industry={demoData.industry}
    />
  );
}
