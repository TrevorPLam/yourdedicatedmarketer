import { ContentPage } from '@/components/features/content-page';
import { getBreadcrumbs } from '@/lib/navigation';
import { getAllDemos } from '@/lib/content';
import Link from 'next/link';
import type { Route } from 'next';
import { Button } from '@repo/ui';

/**
 * Props for the IndustryDetail component.
 */
export interface IndustryDetailProps {
  /** The HTML content to render (from content utilities) */
  content: string;
  /** The title of the industry */
  title: string;
  /** The slug of the industry for breadcrumb generation and demo linking */
  slug: string;
}

/**
 * IndustryDetail component that renders individual industry MDX content.
 * Uses ContentPage pattern for consistent layout, adds breadcrumbs, and finds
 * and links to matching demo page when available.
 * Follows the deep module pattern by encapsulating industry detail rendering.
 *
 * @param props - IndustryDetailProps including content, title, and slug
 * @returns Rendered industry detail with breadcrumbs, content, and demo link
 */
export async function IndustryDetail({ content, title, slug }: IndustryDetailProps) {
  const breadcrumbs = await getBreadcrumbs(slug);
  
  // Find matching demo for this industry
  const demos = await getAllDemos();
  const matchingDemo = demos.find((demo) => {
    const demoData = demo.data as { industry: string; slug: string };
    return demoData.industry === slug;
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

      {/* See it in Action link */}
      {matchingDemo && (
        <div className="container mx-auto px-4 py-8">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold mb-3">See It in Action</h3>
            <p className="text-muted-foreground mb-4">
              Check out our demo site to see how we've helped businesses in this industry.
            </p>
            <Link href={`/demos/${(matchingDemo.data as { slug: string }).slug}` as Route}>
              <Button>View Demo</Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
