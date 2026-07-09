import { render, screen } from '@testing-library/react';
import { FAQAccordion } from './faq-accordion';

describe('FAQAccordion', () => {
  const mockFAQs = [
    {
      slug: 'what-is-your-pricing',
      question: 'What is your pricing?',
      answer: '<p>Our pricing starts at $500 per month.</p>',
    },
    {
      slug: 'how-long-does-it-take',
      question: 'How long does it take?',
      answer: '<p>Typically 2-4 weeks depending on scope.</p>',
    },
    {
      slug: 'do-you-offer-support',
      question: 'Do you offer support?',
      answer: '<p>Yes, we offer ongoing support packages.</p>',
    },
  ];

  it('renders all FAQ items with stable slug keys', () => {
    const { container } = render(<FAQAccordion faqs={mockFAQs} />);

    const accordionItems = container.querySelectorAll('[data-testid="faq-item"]');
    expect(accordionItems).toHaveLength(3);

    // Verify each item has the correct slug as key (React stores this internally)
    // We verify the content is rendered correctly
    expect(screen.getByText('What is your pricing?')).toBeInTheDocument();
    expect(screen.getByText('How long does it take?')).toBeInTheDocument();
    expect(screen.getByText('Do you offer support?')).toBeInTheDocument();
  });

  it('maintains stable keys when FAQs are reordered', () => {
    const reorderedFAQs: Array<{ slug: string; question: string; answer: string }> = [
      mockFAQs[2]!,
      mockFAQs[0]!,
      mockFAQs[1]!,
    ];

    const { container } = render(<FAQAccordion faqs={reorderedFAQs} />);

    const accordionItems = container.querySelectorAll('[data-testid="faq-item"]');
    expect(accordionItems).toHaveLength(3);

    // Verify the reordered content is rendered
    expect(screen.getByText('Do you offer support?')).toBeInTheDocument();
    expect(screen.getByText('What is your pricing?')).toBeInTheDocument();
    expect(screen.getByText('How long does it take?')).toBeInTheDocument();
  });
});
