import { ServicesHub } from '@/components/features/services/services-hub';
import { generateMetadata } from '@/lib/seo';

export const metadata = generateMetadata({
  title: 'Services',
  description: 'Explore our comprehensive digital marketing services including website design, local SEO, paid advertising, and more. Tailored solutions for local businesses.',
  path: '/services',
});

/**
 * Services Hub page that displays all available services.
 * Renders the ServicesHub component with all service cards.
 */
export default function ServicesPage() {
  return (
    <>
      <ServicesHub />
    </>
  );
}
