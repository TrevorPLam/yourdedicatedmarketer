import { IndustriesHub } from '@/components/features/industries/industries-hub';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

/**
 * Generate metadata for the industries hub page.
 */
export async function generateMetadata() {
  return generateSEOMetadata({
    title: 'Industries We Serve',
    description: 'Specialized digital marketing solutions tailored to your industry\'s unique needs. From home services to professional firms, we understand your market.',
    path: '/industries',
  });
}

/**
 * Industries hub page that displays all industries as cards.
 * Renders the IndustriesHub component with industry listings.
 */
export default async function IndustriesPage() {
  return (
    <IndustriesHub />
  );
}
