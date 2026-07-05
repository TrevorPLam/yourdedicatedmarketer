import { FAQHub } from '@/components/features/faq/faq-hub';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

/**
 * Generate metadata for the FAQ hub page.
 */
export async function generateMetadata() {
  return generateSEOMetadata({
    title: 'Frequently Asked Questions',
    description: 'Find answers to common questions about our digital marketing services, pricing packages, and website build process. Get the information you need to make informed decisions.',
    path: '/faq',
  });
}

/**
 * FAQ hub page that displays all FAQs grouped by category.
 * Renders the FAQHub component with categorized accordions and JSON-LD schema.
 */
export default async function FAQPage() {
  return (
    <FAQHub />
  );
}
