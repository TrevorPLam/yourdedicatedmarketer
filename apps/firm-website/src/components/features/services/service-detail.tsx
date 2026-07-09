import { ContentPage } from '@/components/features/content-page';
import { getBreadcrumbs } from '@/lib/navigation';
import Link from 'next/link';

/**
 * Props for the ServiceDetail component.
 */
export interface ServiceDetailProps {
  /** The HTML content to render (from content utilities) */
  content: string;
  /** The title of the service */
  title: string;
  /** The slug of the service for breadcrumb generation */
  slug: string;
}

/**
 * ServiceDetail component that renders individual service MDX content.
 * Uses ContentPage pattern for consistent layout and adds breadcrumbs.
 * Follows the deep module pattern by encapsulating service detail rendering.
 *
 * @param props - ServiceDetailProps including content, title, and slug
 * @returns Rendered service detail with breadcrumbs and content
 */
export async function ServiceDetail({ content, title, slug }: ServiceDetailProps) {
  const breadcrumbs = await getBreadcrumbs(slug);

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
    </>
  );
}
