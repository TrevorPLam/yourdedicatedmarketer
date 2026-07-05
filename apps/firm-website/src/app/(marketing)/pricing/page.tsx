import type { Metadata } from 'next';
import { ContentPage } from '@/components/features/content-page';
import { generateMetadata } from '@/lib/seo';
import { getPage } from '@/lib/content';

interface PageMetadata {
  title: string;
  slug: string;
  description: string;
}

export const metadata: Metadata = generateMetadata({
  title: 'Pricing - Transparent Website Design & Marketing Services',
  description: 'Transparent pricing for website design, marketing services, and ongoing support. No hidden fees, clear packages, and flexible options for DFW service businesses.',
  path: '/pricing',
});

export default async function PricingPage() {
  const pageContent = await getPage('pricing');

  if (!pageContent) {
    return <div>Page not found</div>;
  }

  const data = pageContent.data as PageMetadata;

  return (
    <ContentPage 
      content={pageContent.content} 
      title={data.title}
    />
  );
}
