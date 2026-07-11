import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Hero } from '@/components/features/home/hero';
import { Pillars } from '@/components/features/home/pillars';
import { FinalCTA } from '@/components/features/home/final-cta';
import { generateMetadata } from '@/lib/seo';
import { generateOrganizationSchema } from '@/lib/json-ld';
import { env } from '@/lib/env';

const DemoPreview = dynamic(
  () => import('@/components/features/home/demo-preview').then((mod) => ({ default: mod.DemoPreview })),
  {
    loading: () => <section className="bg-muted/50 py-20"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-96 animate-pulse rounded-lg bg-muted" /></section>,
  }
);

const HowItWorks = dynamic(
  () => import('@/components/features/home/how-it-works').then((mod) => ({ default: mod.HowItWorks })),
  {
    loading: () => <section className="py-20"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-64 animate-pulse rounded-lg bg-muted" /></section>,
  }
);

const FAQSnippet = dynamic(
  () => import('@/components/features/home/faq-snippet').then((mod) => ({ default: mod.FAQSnippet })),
  {
    loading: () => <section className="bg-muted/50 py-20"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-80 animate-pulse rounded-lg bg-muted" /></section>,
  }
);

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
