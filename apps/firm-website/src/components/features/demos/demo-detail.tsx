import { ContentPage } from '@/components/features/content-page';
import { getBreadcrumbs } from '@/lib/navigation';
import { getAllIndustries } from '@/lib/content';
import Link from 'next/link';
import type { Route } from 'next';
import { Button } from '@repo/ui';

/**
 * Props for the DemoDetail component.
 */
export interface DemoDetailProps {
  /** The HTML content to render (from content utilities) */
  content: string;
  /** The title of the demo */
  title: string;
  /** The slug of the demo for breadcrumb generation and industry linking */
  slug: string;
  /** The industry slug for linking to the industry page */
  industry: string;
}

/**
 * DemoDetail component that renders individual demo MDX content.
 * Uses ContentPage pattern for consistent layout, adds breadcrumbs, links to industry page,
 * and includes "View Live Demo" placeholder button.
 * Follows the deep module pattern by encapsulating demo detail rendering.
 *
 * @param props - DemoDetailProps including content, title, slug, and industry
 * @returns Rendered demo detail with breadcrumbs, content, industry link, and demo button
 */
export async function DemoDetail({ content, title, slug, industry }: DemoDetailProps) {
  const breadcrumbs = await getBreadcrumbs(slug);
  
  // Find matching industry for this demo
  const industries = await getAllIndustries();
  const matchingIndustry = industries.find((ind) => {
    const industryData = ind.data as { slug: string };
    return industryData.slug === industry;
  });

  return (
    <>
      {/* Breadcrumbs */}
      <nav className="border-b" aria-label="Breadcrumb">
        <div className="container mx-auto px-4 py-4">
          <ol className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && <span className="mx-2 text-muted-foreground">/</span>}
                {crumb.href ? (
                  <Link
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    href={crumb.href as any}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-foreground font-medium">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </nav>

      {/* Content */}
      <ContentPage content={content} title={title} />

      {/* Industry link */}
      {matchingIndustry && (
        <div className="container mx-auto px-4 py-8">
          <div className="bg-muted/50 border border-border rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold mb-3">Learn More About This Industry</h3>
            <p className="text-muted-foreground mb-4">
              Discover how we tailor our digital marketing strategies for this specific industry.
            </p>
            <Link href={`/industries/${industry}` as Route}>
              <Button variant="outline">View Industry Page</Button>
            </Link>
          </div>
        </div>
      )}

      {/* View Live Demo placeholder */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold mb-3">View Live Demo</h3>
          <p className="text-muted-foreground mb-4">
            This is a proof-of-concept demo showcasing our approach. Live demo sites coming soon.
          </p>
          <Button disabled>Coming Soon</Button>
        </div>
      </div>
    </>
  );
}
