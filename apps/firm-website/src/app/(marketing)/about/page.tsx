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
  title: 'About Your Dedicated Marketer - DFW Web Design & Marketing',
  description: 'Learn about Your Dedicated Marketer, a DFW-based web design and marketing firm helping local service businesses get online fast and affordably with AI-assisted workflows.',
  path: '/about',
});

export default async function AboutPage() {
  const pageContent = await getPage('about');

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
