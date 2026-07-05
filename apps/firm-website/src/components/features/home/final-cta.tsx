import Link from 'next/link';
import type { Route } from 'next';
import { Container, Section } from '@repo/ui';
import { Button } from '@repo/ui';

export function FinalCTA() {
  return (
    <Section className="bg-primary text-primary-foreground">
      <Container>
        <div className="text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Grow Your Business?</h2>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Book a free consultation to discuss your marketing needs and get a custom strategy for your business.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-4">
            <Link href={("/contact" as Route)}>Book a Free Consultation</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
