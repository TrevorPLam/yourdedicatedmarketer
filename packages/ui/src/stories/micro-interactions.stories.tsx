import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Globe } from 'lucide-react';

const meta: Meta = {
  title: 'Design/Micro-Interactions',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Living documentation for the micro-interaction system used across the UI.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ButtonHoverAndActive: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="default">Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="gradient">Gradient</Button>
      <Button variant="glow">Glow</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Buttons use a subtle scale (2%) and lift (0.5) on hover, a brief press (scale 0.98) on active, and a slight shadow/brightness lift. Transitions run 150ms and use ease-out timing. All motion is suppressed when prefers-reduced-motion is active.',
      },
    },
  },
};

export const CardHoverEffects: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="w-[300px]" lift>
        <CardHeader>
          <CardTitle>Lift on Hover</CardTitle>
          <CardDescription>Card rises and shadow deepens</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Hover to see the card lift 4px and the shadow grow larger.</p>
        </CardContent>
      </Card>
      <Card className="w-[300px]" variant="gradient-primary" lift>
        <CardHeader>
          <CardTitle>Gradient Lift</CardTitle>
          <CardDescription>Gradient border with lift</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Gradient cards lift the outer wrapper so the gradient border stays intact.</p>
        </CardContent>
      </Card>
    </div>
  ),
};

export const IconHoverAnimation: Story = {
  render: () => (
    <div className="grid md:grid-cols-3 gap-8 max-w-4xl">
      {[
        { label: 'Website Design', icon: <Globe className="h-8 w-8 text-primary" /> },
      ].map(({ label, icon }) => (
        <div
          key={label}
          className="group rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/20"
        >
          <div className="mb-4 transition-transform duration-200 ease-out group-hover:scale-110 group-hover:rotate-3 motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0">
            {icon}
          </div>
          <h3 className="text-xl font-semibold">{label}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Icons scale and rotate on hover using transform-only animations.
          </p>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Icon wrappers use transform-only scale and rotate micro-interactions. Motion is disabled under prefers-reduced-motion.',
      },
    },
  },
};

export const FocusAndActiveStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <Button>Focus this button (tab)</Button>
      <Button variant="outline">Outline focus</Button>
      <Button asChild variant="link">
        <a href="/">Link focus</a>
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Focus states use a visible ring with offset. Active states provide a brief press effect.',
      },
    },
  },
};
