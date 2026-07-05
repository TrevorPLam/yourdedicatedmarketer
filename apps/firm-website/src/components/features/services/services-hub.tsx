import Link from 'next/link';
import type { Route } from 'next';
import { Container, Section } from '@repo/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { getAllServices } from '@/lib/content';

/**
 * Props for the ServicesHub component.
 */
export interface ServicesHubProps {
  /** Optional custom title for the hub section */
  title?: string;
  /** Optional custom description for the hub section */
  description?: string;
}

/**
 * ServicesHub component that displays all services as cards.
 * Fetches services from content utilities and renders them with links to detail pages.
 * Follows the deep module pattern by encapsulating service listing logic.
 *
 * @param props - ServicesHubProps including optional title and description
 * @returns Rendered services hub with cards for each service
 */
export async function ServicesHub({ title, description }: ServicesHubProps) {
  const services = await getAllServices();
  
  // Sort services by order field if available
  const sortedServices = services.sort((a, b) => {
    const orderA = (a.data as { order?: number }).order || 0;
    const orderB = (b.data as { order?: number }).order || 0;
    return orderA - orderB;
  });

  return (
    <Section>
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {title || 'Our Services'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {description || 'Comprehensive digital marketing services to help your business grow online.'}
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedServices.map((service) => {
            const serviceData = service.data as {
              title: string;
              slug: string;
              description: string;
            };
            return (
              <Link
                key={serviceData.slug}
                href={`/services/${serviceData.slug}` as Route}
                className="group"
              >
                <Card data-testid="service-card" className="h-full transition-all hover:shadow-lg hover:border-primary/50">
                  <CardHeader>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {serviceData.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{serviceData.description}</p>
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
