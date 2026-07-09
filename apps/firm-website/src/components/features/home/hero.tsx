import Link from 'next/link';
import type { Route } from 'next';
import { Button } from '@repo/ui';
import { Container } from '@repo/ui';

export function Hero() {
  return (
    <section className="bg-gradient-to-b from-primary/10 to-background py-20 md:py-32">
      <Container>
        <div className="flex flex-col items-center text-center space-y-8">
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-foreground tracking-tight">
            Professional Marketing Services
            <br />
            <span className="text-primary">For Local Businesses</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl">
            We help local businesses grow with affordable, high-quality marketing services. 
            No long-term contracts, no hidden fees—just results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button asChild size="lg">
              <Link href={("/contact" as Route)}>Book a Free Consultation</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={("/demos" as Route)}>See a Demo Site</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
