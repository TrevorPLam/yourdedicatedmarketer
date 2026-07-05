import Link from 'next/link';
import type { Route } from 'next';
import { Container, Section } from '@repo/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { getAllDemos } from '@/lib/content';

/**
 * Props for the DemosHub component.
 */
export interface DemosHubProps {
  /** Optional custom title for the hub section */
  title?: string;
  /** Optional custom description for the hub section */
  description?: string;
}

/**
 * DemosHub component that displays all demos as cards.
 * Fetches demos from content utilities and renders them with title, description, and links to detail pages.
 * Follows the deep module pattern by encapsulating demo listing logic.
 *
 * @param props - DemosHubProps including optional title and description
 * @returns Rendered demos hub with cards for each demo
 */
export async function DemosHub({ title, description }: DemosHubProps) {
  const demos = await getAllDemos();
  
  // Sort demos by title alphabetically
  const sortedDemos = demos.sort((a, b) => {
    const titleA = (a.data as { title: string }).title;
    const titleB = (b.data as { title: string }).title;
    return titleA.localeCompare(titleB);
  });

  return (
    <Section>
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {title || 'Proof of Concept Demos'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {description || 'Explore our portfolio of demo websites showcasing our approach across different industries.'}
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedDemos.map((demo) => {
            const demoData = demo.data as {
              title: string;
              slug: string;
              description: string;
              industry: string;
            };
            return (
              <Link
                key={demoData.slug}
                href={`/demos/${demoData.slug}` as Route}
                className="group"
              >
                <Card data-testid="demo-card" className="h-full transition-all hover:shadow-lg hover:border-primary/50">
                  <CardHeader>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {demoData.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-3">{demoData.description}</p>
                    <p className="text-sm text-primary/70">
                      Industry: {demoData.industry.replace('-', ' ')}
                    </p>
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
