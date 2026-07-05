import Link from 'next/link';
import type { Route } from 'next';
import { Container, Section } from '@repo/ui';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@repo/ui';
import { Button } from '@repo/ui';
import { getAllDemos } from '@/lib/content';

interface DemoMetadata {
  title: string;
  slug: string;
  description: string;
  industry: string;
}

export async function DemoPreview() {
  const demos = await getAllDemos();
  const featuredDemos = demos.slice(0, 3) as Array<{
    data: DemoMetadata;
    content: string;
  }>;

  return (
    <Section className="bg-muted/50">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">See Our Work</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our proof-of-concept websites to see the quality and attention to detail we bring to every project.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {featuredDemos.map((demo) => (
            <Card key={demo.data.slug} className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>{demo.data.title}</CardTitle>
                <CardDescription>{demo.data.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {demo.content.replace(/<[^>]*>/g, '').slice(0, 150)}...
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center">
          <Button asChild variant="outline" size="lg">
            <Link href={("/demos" as Route)}>View All Demos</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
