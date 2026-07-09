import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card';
import { Button } from './button';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here. This is the main body of the card.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithoutFooter: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here. This card has no footer.</p>
      </CardContent>
    </Card>
  ),
};

export const WithoutHeader: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardContent>
        <p>This card has no header, just content.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
};

export const ContentOnly: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardContent>
        <p>This card has only content, no header or footer.</p>
      </CardContent>
    </Card>
  ),
};

export const WithMultipleActions: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Confirm Action</CardTitle>
        <CardDescription>Are you sure you want to proceed?</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This action cannot be undone.</p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button variant="destructive">Confirm</Button>
      </CardFooter>
    </Card>
  ),
};

export const LongContent: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Long Content Card</CardTitle>
        <CardDescription>Card with longer content</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-2">
          This is a card with longer content to demonstrate how it handles
          multiple paragraphs of text.
        </p>
        <p className="mb-2">
          The card component is flexible and can accommodate various content
          lengths while maintaining a clean and organized appearance.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </CardContent>
      <CardFooter>
        <Button>Read More</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithHoverLift: Story = {
  render: () => (
    <Card className="w-[350px]" lift>
      <CardHeader>
        <CardTitle>Hover Lift Effect</CardTitle>
        <CardDescription>Hover over this card to see the lift effect</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card has a hover lift effect that subtly raises it when you hover over it.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
};

export const GradientPrimary: Story = {
  render: () => (
    <Card className="w-[350px]" variant="gradient-primary">
      <CardHeader>
        <CardTitle>Gradient Primary Border</CardTitle>
        <CardDescription>Card with primary gradient border</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card features a gradient border using the primary color palette.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
};

export const GradientAccent: Story = {
  render: () => (
    <Card className="w-[350px]" variant="gradient-accent">
      <CardHeader>
        <CardTitle>Gradient Accent Border</CardTitle>
        <CardDescription>Card with accent gradient border</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card features a gradient border using the accent color palette.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithInnerShadow: Story = {
  render: () => (
    <Card className="w-[350px]" innerShadow>
      <CardHeader>
        <CardTitle>Inner Shadow Effect</CardTitle>
        <CardDescription>Card with subtle inner shadow</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card has a subtle inner shadow for added depth and visual interest.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
};

export const CombinedEffects: Story = {
  render: () => (
    <Card className="w-[350px]" lift innerShadow variant="gradient-primary">
      <CardHeader>
        <CardTitle>Combined Effects</CardTitle>
        <CardDescription>Lift, inner shadow, and gradient border</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card combines all three effects: hover lift, inner shadow, and gradient border.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
};
