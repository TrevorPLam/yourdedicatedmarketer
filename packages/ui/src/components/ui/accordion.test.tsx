import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './accordion';

describe('Accordion', () => {
  it('renders accordion with items', () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Item 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('expands item when trigger is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByText('Item 1');

    // Content should be hidden initially
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();

    // Click trigger to expand
    await user.click(trigger);

    // Content should now be visible
    const content = screen.getByText('Content 1');
    expect(content).toBeVisible();
  });

  it('collapses item when trigger is clicked again', async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByText('Item 1');

    // Expand the item
    await user.click(trigger);
    const content = screen.getByText('Content 1');
    expect(content).toBeVisible();

    // Collapse the item
    await user.click(trigger);
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
  });

  it('allows only one item open when type is single', async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Item 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger1 = screen.getByText('Item 1');
    const trigger2 = screen.getByText('Item 2');

    // Expand first item
    await user.click(trigger1);
    const content1 = screen.getByText('Content 1');
    expect(content1).toBeVisible();

    // Expand second item (should close first)
    await user.click(trigger2);
    const content2 = screen.getByText('Content 2');
    expect(content2).toBeVisible();
    expect(content1).not.toBeVisible();
  });

  it('allows multiple items open when type is multiple', async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="multiple">
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Item 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger1 = screen.getByText('Item 1');
    const trigger2 = screen.getByText('Item 2');

    // Expand both items
    await user.click(trigger1);
    await user.click(trigger2);

    // Both should be visible
    const content1 = screen.getByText('Content 1');
    const content2 = screen.getByText('Content 2');
    expect(content1).toBeVisible();
    expect(content2).toBeVisible();
  });

  it('applies custom className to AccordionItem', () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1" className="custom-class">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const item = screen.getByText('Item 1').closest('.border-b');
    expect(item).toHaveClass('custom-class');
  });

  it('has proper accessibility attributes', () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByRole('button', { name: 'Item 1' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});
