import { notFound } from 'next/navigation';
import { ContentPage } from '@/components/features/content-page';
import { getFAQ, getAllSlugs } from '@/lib/content';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

// Set dynamicParams to false to return 404 for unknown slugs
export const dynamicParams = false;

/**
 * Generate static params for all FAQ slugs at build time.
 * This enables static site generation for all FAQ detail pages.
 */
export async function generateStaticParams() {
  const slugs = await getAllSlugs('faq');
  return slugs.map((slug) => ({ slug }));
}

/**
 * Generate dynamic metadata for each FAQ detail page.
 * Uses the FAQ's title and description from frontmatter.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const faq = await getFAQ(slug);

  if (!faq) {
    return generateSEOMetadata({
      title: 'FAQ Not Found',
      description: 'The requested FAQ could not be found.',
      path: `/faq/${slug}`,
    });
  }

  const faqData = faq.data as {
    title: string;
    description: string;
  };

  return generateSEOMetadata({
    title: faqData.title,
    description: faqData.description,
    path: `/faq/${slug}`,
  });
}

/**
 * Dynamic FAQ detail page that renders individual FAQ MDX content.
 * Fetches FAQ content by slug and renders with ContentPage component.
 * Returns 404 if FAQ is not found.
 */
export default async function FAQDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const faq = await getFAQ(slug);

  if (!faq) {
    notFound();
  }

  const faqData = faq.data as {
    title: string;
  };

  return (
    <ContentPage
      content={faq.content}
      title={faqData.title}
    />
  );
}
