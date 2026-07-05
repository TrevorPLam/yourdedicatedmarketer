import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card';

describe('Card', () => {
  it('renders card with default styles', () => {
    render(<Card>Card content</Card>);
    const card = screen.getByText('Card content');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('rounded-lg', 'border', 'bg-card', 'shadow-sm');
  });

  it('applies custom className', () => {
    render(<Card className="custom-class">Card content</Card>);
    const card = screen.getByText('Card content');
    expect(card).toHaveClass('custom-class');
  });

  it('renders CardHeader with children', () => {
    render(
      <Card>
        <CardHeader>Header content</CardHeader>
      </Card>
    );
    expect(screen.getByText('Header content')).toBeInTheDocument();
  });

  it('renders CardTitle with heading role', () => {
    render(
      <Card>
        <CardTitle>Card Title</CardTitle>
      </Card>
    );
    const title = screen.getByRole('heading', { level: 3, name: 'Card Title' });
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('text-2xl', 'font-semibold');
  });

  it('renders CardDescription with muted text', () => {
    render(
      <Card>
        <CardDescription>Card description</CardDescription>
      </Card>
    );
    const description = screen.getByText('Card description');
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass('text-sm', 'text-muted-foreground');
  });

  it('renders CardContent with children', () => {
    render(
      <Card>
        <CardContent>Content text</CardContent>
      </Card>
    );
    expect(screen.getByText('Content text')).toBeInTheDocument();
  });

  it('renders CardFooter with children', () => {
    render(
      <Card>
        <CardFooter>Footer content</CardFooter>
      </Card>
    );
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('renders complete card with all subcomponents', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('forwards ref to Card', () => {
    const ref = { current: null };
    render(<Card ref={ref}>Card content</Card>);
    expect(ref.current).not.toBeNull();
  });
});
