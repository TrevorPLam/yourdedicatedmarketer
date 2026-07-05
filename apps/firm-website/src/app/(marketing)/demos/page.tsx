import { DemosHub } from '@/components/features/demos/demos-hub';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

/**
 * Generate metadata for the demos hub page.
 */
export async function generateMetadata() {
  return generateSEOMetadata({
    title: 'Proof of Concept Demos',
    description: 'Explore our portfolio of demo websites showcasing our digital marketing approach across different industries. See how we solve real business challenges.',
    path: '/demos',
  });
}

/**
 * Demos hub page that displays all demos as cards.
 * Renders the DemosHub component with demo listings.
 */
export default async function DemosPage() {
  return (
    <DemosHub />
  );
}
