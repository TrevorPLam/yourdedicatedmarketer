import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './accordion';

const meta: Meta<typeof Accordion> = {
  title: 'UI/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['single', 'multiple'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  args: {
    type: 'single',
    collapsible: true,
    children: (
      <>
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Is it styled?</AccordionTrigger>
          <AccordionContent>
            Yes. It comes with default styles that match the other components.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Is it animated?</AccordionTrigger>
          <AccordionContent>
            Yes. It's animated by default, but you can disable it if you prefer.
          </AccordionContent>
        </AccordionItem>
      </>
    ),
  },
};

export const Multiple: Story = {
  args: {
    type: 'multiple',
    children: (
      <>
        <AccordionItem value="item-1">
          <AccordionTrigger>Can I open multiple items?</AccordionTrigger>
          <AccordionContent>
            Yes. When type is set to "multiple", you can have multiple items open at the same time.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>What about single mode?</AccordionTrigger>
          <AccordionContent>
            In single mode, only one item can be open at a time. Opening a new item closes the previous one.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Is it responsive?</AccordionTrigger>
          <AccordionContent>
            Yes. The accordion component is fully responsive and works on all screen sizes.
          </AccordionContent>
        </AccordionItem>
      </>
    ),
  },
};

export const LongContent: Story = {
  args: {
    type: 'single',
    children: (
      <>
        <AccordionItem value="item-1">
          <AccordionTrigger>What is the purpose of this component?</AccordionTrigger>
          <AccordionContent>
            <p className="mb-2">
              The accordion component is a vertically stacked set of interactive headings
              that each contain a title, content snippet, or thumbnail representing a section
              of content.
            </p>
            <p className="mb-2">
              Clicking a heading expands or collapses the section, revealing or hiding its
              associated content. Accordions are useful for organizing large amounts of
              content into a compact space.
            </p>
            <p>
              They are commonly used for FAQs, product features, documentation, and any
              scenario where you want to present information in a space-efficient manner.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>How do I customize the styling?</AccordionTrigger>
          <AccordionContent>
            You can customize the accordion by passing custom className props to any of the
            sub-components (AccordionItem, AccordionTrigger, AccordionContent). The component
            uses Tailwind CSS classes for styling, making it easy to match your design system.
          </AccordionContent>
        </AccordionItem>
      </>
    ),
  },
};

export const CustomContent: Story = {
  args: {
    type: 'single',
    children: (
      <>
        <AccordionItem value="item-1">
          <AccordionTrigger>Pricing Plans</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="p-4 border rounded">
                <h4 className="font-semibold">Basic</h4>
                <p className="text-sm text-muted-foreground">$9/month</p>
              </div>
              <div className="p-4 border rounded">
                <h4 className="font-semibold">Pro</h4>
                <p className="text-sm text-muted-foreground">$29/month</p>
              </div>
              <div className="p-4 border rounded">
                <h4 className="font-semibold">Enterprise</h4>
                <p className="text-sm text-muted-foreground">Custom pricing</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Features</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc list-inside space-y-1">
              <li>Unlimited projects</li>
              <li>Advanced analytics</li>
              <li>Priority support</li>
              <li>Custom integrations</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </>
    ),
  },
};

export const SingleItem: Story = {
  args: {
    type: 'single',
    children: (
      <AccordionItem value="item-1">
        <AccordionTrigger>Click to expand</AccordionTrigger>
        <AccordionContent>
          This is a single accordion item. You can use this when you only need one
          expandable section.
        </AccordionContent>
      </AccordionItem>
    ),
  },
};
