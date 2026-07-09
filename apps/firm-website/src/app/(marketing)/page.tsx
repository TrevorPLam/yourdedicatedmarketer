import type { Metadata } from 'next';
import { Hero } from '@/components/features/home/hero';
import { Pillars } from '@/components/features/home/pillars';
import { DemoPreview } from '@/components/features/home/demo-preview';
import { HowItWorks } from '@/components/features/home/how-it-works';
import { FAQSnippet } from '@/components/features/home/faq-snippet';
import { FinalCTA } from '@/components/features/home/final-cta';
import { generateMetadata } from '@/lib/seo';
import { generateOrganizationSchema } from '@/lib/json-ld';
import { env } from '@/lib/env';

export const metadata: Metadata = generateMetadata({
  title: 'Your Dedicated Marketer - Professional Marketing Services for Local Businesses',
  description: 'Affordable, high-quality marketing services for local businesses. Website design, local SEO, and paid advertising without long-term contracts or hidden fees.',
  path: '/',
});

export default function HomePage() {
  const organizationSchema = generateOrganizationSchema({
    name: 'Your Dedicated Marketer',
    description: 'Professional digital marketing services for local businesses',
    url: env.NEXT_PUBLIC_SITE_URL,
    contactPoint: {
      telephone: '+1 (555) 123-4567',
      contactType: 'customer service',
      email: env.CONTACT_EMAIL,
    },
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: organizationSchema }}
      />
      <main>
        <Hero />
        <Pillars />
        <DemoPreview />
        <HowItWorks />
        <FAQSnippet />
        <FinalCTA />
      </main>
    </>
  );
}
