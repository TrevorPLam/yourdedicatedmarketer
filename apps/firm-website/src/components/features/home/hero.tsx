import Link from 'next/link';
import type { Route } from 'next';
import { Button } from '@repo/ui';
import { Container } from '@repo/ui';
import { BentoGrid, BentoCard } from '@repo/ui';
import { useScrollTrigger } from '@repo/ui';

export function Hero() {
  const { isInView: headlineInView, ref: headlineRef } = useScrollTrigger<HTMLDivElement>({ threshold: 0.1, triggerOnce: true });
  const { isInView: subheadlineInView, ref: subheadlineRef } = useScrollTrigger<HTMLDivElement>({ threshold: 0.1, triggerOnce: true, rootMargin: '-50px' });
  const { isInView: ctaInView, ref: ctaRef } = useScrollTrigger<HTMLDivElement>({ threshold: 0.1, triggerOnce: true, rootMargin: '-100px' });
  const { isInView: featureInView, ref: featureRef } = useScrollTrigger<HTMLDivElement>({ threshold: 0.1, triggerOnce: true, rootMargin: '-150px' });

  return (
    <section className="bg-gradient-to-b from-primary/10 to-background py-20 md:py-32">
      <Container>
        <BentoGrid columns={1} gap="1.5rem" className="md:grid-cols-2 lg:grid-cols-4">
          {/* Main headline card - spans full width on mobile, 2 columns on tablet, 3 on desktop */}
          <BentoCard 
            colSpan={1} 
            rowSpan={1} 
            className="md:col-span-2 lg:col-span-3 lg:row-span-2 variant-glass hoverEffect-lift"
            variant="glass"
            hoverEffect="lift"
          >
            <div 
              ref={headlineRef}
              className={`h-full flex flex-col justify-center space-y-6 ${headlineInView ? 'fade-in-up-on-entry' : ''}`}
            >
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
                Professional Marketing Services
                <br />
                <span className="text-primary">For Local Businesses</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                We help local businesses grow with affordable, high-quality marketing services. 
                No long-term contracts, no hidden fees—just results.
              </p>
            </div>
          </BentoCard>

          {/* Feature highlight card */}
          <BentoCard 
            colSpan={1} 
            rowSpan={1} 
            className="lg:row-span-1 variant-gradient hoverEffect-glow"
            variant="gradient"
            hoverEffect="glow"
          >
            <div 
              ref={featureRef}
              className={`h-full flex flex-col justify-center text-center ${featureInView ? 'scale-in-on-entry' : ''}`}
            >
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Local Businesses Served</div>
            </div>
          </BentoCard>

          {/* CTA card */}
          <BentoCard 
            colSpan={1} 
            rowSpan={1} 
            className="lg:row-span-1 variant-glass hoverEffect-lift"
            variant="glass"
            hoverEffect="lift"
          >
            <div 
              ref={ctaRef}
              className={`h-full flex flex-col justify-center space-y-3 ${ctaInView ? 'slide-in-right-on-entry' : ''}`}
            >
              <div className="flex flex-col gap-3">
                <Button asChild size="lg" className="w-full">
                  <Link href={("/contact" as Route)}>Book a Free Consultation</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href={("/demos" as Route)}>See a Demo Site</Link>
                </Button>
              </div>
            </div>
          </BentoCard>

          {/* Secondary feature card */}
          <BentoCard 
            colSpan={1} 
            rowSpan={1} 
            className="md:col-span-2 lg:col-span-1 variant-outline hoverEffect-scale"
            variant="outline"
            hoverEffect="scale"
          >
            <div 
              ref={subheadlineRef}
              className={`h-full flex flex-col justify-center text-center ${subheadlineInView ? 'fade-in-up-on-entry' : ''}`}
            >
              <div className="text-3xl font-bold text-accent mb-2">98%</div>
              <div className="text-sm text-muted-foreground">Client Satisfaction Rate</div>
            </div>
          </BentoCard>
        </BentoGrid>
      </Container>
    </section>
  );
}
