import { Container, Section } from '@repo/ui';

/**
 * Props for the ContentPage component.
 */
export interface ContentPageProps {
  /** The HTML content to render (from content utilities) */
  content: string;
  /** Optional title for the page */
  title?: string;
}

/**
 * ContentPage component for rendering HTML content with consistent layout.
 * This follows the deep module pattern by encapsulating content rendering layout
 * and providing a simple interface for rendering any static page content.
 *
 * @param props - ContentPageProps including the HTML content and optional title
 * @returns Rendered HTML content wrapped in Container and Section
 */
export function ContentPage({ content, title }: ContentPageProps) {
  return (
    <Container>
      <Section>
        {title && <h1 className="text-4xl font-bold mb-8">{title}</h1>}
        <div 
          className="max-w-none space-y-6"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </Section>
    </Container>
  );
}
