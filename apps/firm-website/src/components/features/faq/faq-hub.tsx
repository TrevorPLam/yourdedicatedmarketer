import { Container, Section } from '@repo/ui';
import { getAllFAQs } from '@/lib/content';
import { generateFAQSchema } from '@/lib/json-ld';
import { FAQAccordion } from './faq-accordion';

/**
 * Props for the FAQHub component.
 */
export interface FAQHubProps {
  /** Optional custom title for the hub section */
  title?: string;
  /** Optional custom description for the hub section */
  description?: string;
}

/**
 * FAQ metadata interface for type safety.
 */
interface FAQMetadata {
  question: string;
  answer: string;
  category: string;
  order?: number;
}

/**
 * FAQHub component that displays all FAQs grouped by category.
 * Fetches FAQs from content utilities, groups them by category, and renders
 * category headings with FAQAccordion. Generates FAQPage JSON-LD schema.
 * Follows the deep module pattern by encapsulating FAQ listing, grouping,
 * and schema generation logic.
 *
 * @param props - FAQHubProps including optional title and description
 * @returns Rendered FAQ hub with categorized accordions and JSON-LD schema
 */
export async function FAQHub({ title, description }: FAQHubProps) {
  const faqs = await getAllFAQs();
  
  // Group FAQs by category
  const groupedFAQs = faqs.reduce(
    (acc, faq) => {
      const metadata = faq.data as FAQMetadata;
      const category = metadata.category || 'general';
      
      if (!acc[category]) {
        acc[category] = [];
      }
      
      acc[category].push({
        question: metadata.question,
        answer: faq.content,
      });
      
      return acc;
    },
    {} as Record<string, Array<{ question: string; answer: string }>>
  );

  // Sort FAQs within each category by order if available
  Object.keys(groupedFAQs).forEach((category) => {
    const categoryFAQs = groupedFAQs[category];
    if (categoryFAQs) {
      categoryFAQs.sort((a, b) => {
        const faqA = faqs.find((f) => (f.data as FAQMetadata).question === a.question);
        const faqB = faqs.find((f) => (f.data as FAQMetadata).question === b.question);
        const orderA = (faqA?.data as FAQMetadata).order ?? 0;
        const orderB = (faqB?.data as FAQMetadata).order ?? 0;
        return orderA - orderB;
      });
    }
  });

  // Flatten all FAQs for JSON-LD schema
  const allFAQs = Object.values(groupedFAQs).flat();
  const jsonLd = generateFAQSchema(allFAQs);

  // Category display names mapping
  const categoryNames: Record<string, string> = {
    general: 'General Questions',
    pricing: 'Pricing & Packages',
    process: 'Process & Timeline',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <Section>
        <Container>
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {title || 'Frequently Asked Questions'}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {description || 'Find answers to common questions about our services, pricing, and process.'}
            </p>
          </div>
          {Object.entries(groupedFAQs).map(([category, categoryFAQs]) => (
            <div key={category} className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">
                {categoryNames[category] ?? category}
              </h2>
              <FAQAccordion faqs={categoryFAQs} />
            </div>
          ))}
        </Container>
      </Section>
    </>
  );
}
