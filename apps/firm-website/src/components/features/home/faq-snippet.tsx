import Link from 'next/link';
import type { Route } from 'next';
import { Container, Section } from '@repo/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { Button } from '@repo/ui';
import { getAllFAQs } from '@/lib/content';

interface FAQMetadata {
  question: string;
  answer: string;
  category: string;
  order?: number;
}

export async function FAQSnippet() {
  const faqs = await getAllFAQs();
  const featuredFAQs = faqs.slice(0, 3) as Array<{
    data: FAQMetadata;
    content: string;
  }>;

  return (
    <Section className="bg-muted/50">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Quick answers to common questions about our services.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {featuredFAQs.map((faq) => (
            <Card key={faq.data.question}>
              <CardHeader>
                <CardTitle className="text-lg">{faq.data.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {faq.data.answer}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center">
          <Button asChild variant="outline" size="lg">
            <Link href={("/faq" as Route)}>View All FAQs</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
