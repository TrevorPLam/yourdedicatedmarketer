import Link from 'next/link';
import type { Route } from 'next';
import { Container, Section } from '@repo/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { getAllIndustries } from '@/lib/content';

/**
 * Props for the IndustriesHub component.
 */
export interface IndustriesHubProps {
  /** Optional custom title for the hub section */
  title?: string;
  /** Optional custom description for the hub section */
  description?: string;
}

/**
 * IndustriesHub component that displays all industries as cards.
 * Fetches industries from content utilities and renders them with icons, title, description, and links to detail pages.
 * Follows the deep module pattern by encapsulating industry listing logic.
 *
 * @param props - IndustriesHubProps including optional title and description
 * @returns Rendered industries hub with cards for each industry
 */
export async function IndustriesHub({ title, description }: IndustriesHubProps) {
  const industries = await getAllIndustries();
  
  // Sort industries by order field if available
  const sortedIndustries = industries.sort((a, b) => {
    const orderA = (a.data as { order?: number }).order || 0;
    const orderB = (b.data as { order?: number }).order || 0;
    return orderA - orderB;
  });

  return (
    <Section>
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {title || 'Industries We Serve'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {description || 'Specialized digital marketing solutions tailored to your industry\'s unique needs.'}
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedIndustries.map((industry) => {
            const industryData = industry.data as {
              title: string;
              slug: string;
              description: string;
              icon?: string;
            };
            return (
              <Link
                key={industryData.slug}
                href={`/industries/${industryData.slug}` as Route}
                className="group"
              >
                <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      {industryData.icon && (
                        <span className="text-3xl" role="img" aria-label={`${industryData.title} icon`}>
                          {industryData.icon}
                        </span>
                      )}
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {industryData.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{industryData.description}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
