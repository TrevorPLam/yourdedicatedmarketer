/**
 * Navigation utilities for the firm website.
 * Provides data-driven navigation, breadcrumbs, and related content functionality.
 */

import { getAllServices, getAllIndustries, getAllDemos, getAllFAQs } from './content';

// Content type interfaces matching the frontmatter structure
interface Service {
  title: string;
  slug: string;
  description: string;
  featured?: boolean;
  order?: number;
}

interface Industry {
  title: string;
  slug: string;
  description: string;
  featured?: boolean;
  order?: number;
  icon?: string;
}

interface Demo {
  title: string;
  slug: string;
  description: string;
  challenge: string;
  approach: string;
  outcome: string;
  industry: string;
}

interface FAQ {
  title: string;
  slug: string;
  description: string;
  question: string;
  answer: string;
  category: 'general' | 'pricing' | 'process';
  order?: number;
}

/**
 * Navigation item interface.
 */
export interface NavItem {
  /** Display label for the navigation item */
  label: string;
  /** URL path for the navigation item */
  href: string;
}

/**
 * Breadcrumb item interface.
 */
export interface BreadcrumbItem {
  /** Display label for the breadcrumb */
  label: string;
  /** URL path for the breadcrumb (null for current page) */
  href: string | null;
}

/**
 * Related content item interface.
 */
export interface RelatedContentItem {
  /** Title of the related content */
  title: string;
  /** URL slug for the related content */
  slug: string;
  /** Content type (service, industry, demo, faq) */
  type: string;
}

/**
 * Returns primary navigation items for the website.
 * Data-driven and can be extended as the site grows.
 *
 * @returns Array of navigation items with label and href
 */
export async function getNavItems(): Promise<NavItem[]> {
  return [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Industries', href: '/industries' },
    { label: 'Demos', href: '/demos' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];
}

/**
 * Returns breadcrumb trail for a given page slug.
 * Reflects the content hierarchy of the website.
 *
 * @param slug - The slug of the current page
 * @returns Array of breadcrumb items with label and href
 */
export async function getBreadcrumbs(slug: string): Promise<BreadcrumbItem[]> {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
  ];

  // Service pages
  const services = await getAllServices();
  const service = services.find((s) => (s.data as Service).slug === slug);
  if (service) {
    breadcrumbs.push({ label: 'Services', href: '/services' });
    breadcrumbs.push({ label: (service.data as Service).title, href: null });
    return breadcrumbs;
  }

  // Industry pages
  const industries = await getAllIndustries();
  const industry = industries.find((i) => (i.data as Industry).slug === slug);
  if (industry) {
    breadcrumbs.push({ label: 'Industries', href: '/industries' });
    breadcrumbs.push({ label: (industry.data as Industry).title, href: null });
    return breadcrumbs;
  }

  // Demo pages
  const demos = await getAllDemos();
  const demo = demos.find((d) => (d.data as Demo).slug === slug);
  if (demo) {
    breadcrumbs.push({ label: 'Demos', href: '/demos' });
    breadcrumbs.push({ label: (demo.data as Demo).title, href: null });
    return breadcrumbs;
  }

  // Static pages
  const staticPages: Record<string, string> = {
    'about': 'About',
    'pricing': 'Pricing',
    'contact': 'Contact',
  };

  if (staticPages[slug]) {
    breadcrumbs.push({ label: staticPages[slug], href: null });
    return breadcrumbs;
  }

  // Default: just home
  return breadcrumbs;
}

/**
 * Returns related content based on the current slug and content type.
 * Uses category/tag relationships to find relevant content.
 *
 * @param currentSlug - The slug of the current content
 * @param type - The content type ('service', 'industry', 'demo', 'faq')
 * @returns Array of related content items
 */
export async function getRelatedContent(
  currentSlug: string,
  type: 'service' | 'industry' | 'demo' | 'faq'
): Promise<RelatedContentItem[]> {
  const related: RelatedContentItem[] = [];

  // For demos, find other demos in the same industry
  if (type === 'demo') {
    const demos = await getAllDemos();
    const currentDemo = demos.find((d) => (d.data as Demo).slug === currentSlug);
    
    if (currentDemo) {
      const sameIndustryDemos = demos
        .filter((d) => (d.data as Demo).industry === (currentDemo.data as Demo).industry && (d.data as Demo).slug !== currentSlug)
        .slice(0, 3); // Limit to 3 related items
      
      sameIndustryDemos.forEach((demo) => {
        related.push({
          title: (demo.data as Demo).title,
          slug: (demo.data as Demo).slug,
          type: 'demo',
        });
      });
    }
  }

  // For industries, find related industries (similar order or featured)
  if (type === 'industry') {
    const industries = await getAllIndustries();
    const currentIndustry = industries.find((i) => (i.data as Industry).slug === currentSlug);
    
    if (currentIndustry) {
      const relatedIndustries = industries
        .filter((i) => (i.data as Industry).slug !== currentSlug)
        .sort((a, b) => ((a.data as Industry).order || 0) - ((b.data as Industry).order || 0))
        .slice(0, 3);
      
      relatedIndustries.forEach((industry) => {
        related.push({
          title: (industry.data as Industry).title,
          slug: (industry.data as Industry).slug,
          type: 'industry',
        });
      });
    }
  }

  // For services, find related services (similar order or featured)
  if (type === 'service') {
    const services = await getAllServices();
    const currentService = services.find((s) => (s.data as Service).slug === currentSlug);
    
    if (currentService) {
      const relatedServices = services
        .filter((s) => (s.data as Service).slug !== currentSlug)
        .sort((a, b) => ((a.data as Service).order || 0) - ((b.data as Service).order || 0))
        .slice(0, 3);
      
      relatedServices.forEach((service) => {
        related.push({
          title: (service.data as Service).title,
          slug: (service.data as Service).slug,
          type: 'service',
        });
      });
    }
  }

  // For FAQs, find FAQs in the same category
  if (type === 'faq') {
    const faqs = await getAllFAQs();
    const currentFAQ = faqs.find((f) => (f.data as FAQ).slug === currentSlug);
    
    if (currentFAQ) {
      const sameCategoryFAQs = faqs
        .filter((f) => (f.data as FAQ).category === (currentFAQ.data as FAQ).category && (f.data as FAQ).slug !== currentSlug)
        .sort((a, b) => ((a.data as FAQ).order || 0) - ((b.data as FAQ).order || 0))
        .slice(0, 3);
      
      sameCategoryFAQs.forEach((faq) => {
        related.push({
          title: (faq.data as FAQ).question,
          slug: (faq.data as FAQ).slug,
          type: 'faq',
        });
      });
    }
  }

  return related;
}
