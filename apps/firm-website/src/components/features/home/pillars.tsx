import Link from 'next/link';
import type { Route } from 'next';
import { Container, Section } from '@repo/ui';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@repo/ui';
import { Globe, Building2, BarChart3 } from 'lucide-react';

export function Pillars() {
  const pillars = [
    {
      icon: <Globe className="h-8 w-8 text-primary" />,
      title: 'Website Design',
      description: 'Professional, conversion-focused websites that showcase your business and attract customers.',
      link: '/services',
    },
    {
      icon: <Building2 className="h-8 w-8 text-primary" />,
      title: 'Local SEO',
      description: 'Get found by local customers searching for your services on Google and other search engines.',
      link: '/services',
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      title: 'Paid Advertising',
      description: 'Targeted Google Ads that drive qualified leads and maximize your marketing budget.',
      link: '/services',
    },
  ];

  return (
    <Section>
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Services</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We specialize in three pillars of digital marketing that work together to grow your local business.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((pillar) => (
            <Link key={pillar.title} href={pillar.link as Route} className="group">
              <GlassCard className="h-full transition-all hover:shadow-lg hover:border-primary/50">
                <GlassCardHeader>
                  <div className="mb-4 transition-transform duration-200 ease-out group-hover:scale-110 group-hover:rotate-3 motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0">{pillar.icon}</div>
                  <GlassCardTitle className="group-hover:text-primary transition-colors">
                    {pillar.title}
                  </GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <p className="text-muted-foreground">{pillar.description}</p>
                </GlassCardContent>
              </GlassCard>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
