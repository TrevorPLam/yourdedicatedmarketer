import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@repo/ui';

/**
 * Props for the FAQAccordion component.
 */
export interface FAQAccordionProps {
  /** Array of FAQ items with question and answer */
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

/**
 * FAQAccordion component that renders FAQs using the Accordion component from @repo/ui.
 * Provides proper accessibility through Radix UI's ARIA implementation.
 * Follows the deep module pattern by encapsulating FAQ rendering logic.
 *
 * @param props - FAQAccordionProps including array of FAQs
 * @returns Rendered accordion with FAQ items
 */
export function FAQAccordion({ faqs }: FAQAccordionProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq, index) => (
        <AccordionItem key={index} value={`item-${index}`} data-testid="faq-item">
          <AccordionTrigger className="text-left">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent>
            <div className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: faq.answer }} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
