import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Container } from './container';

const meta: Meta<typeof Container> = {
  title: 'UI/Container',
  component: Container,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    maxWidth: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Container>;

export const Small: Story = {
  args: {
    maxWidth: 'sm',
    children: (
      <div className="bg-muted p-4 rounded">
        Small container (max-w-sm)
      </div>
    ),
  },
};

export const Medium: Story = {
  args: {
    maxWidth: 'md',
    children: (
      <div className="bg-muted p-4 rounded">
        Medium container (max-w-md)
      </div>
    ),
  },
};

export const Large: Story = {
  args: {
    maxWidth: 'lg',
    children: (
      <div className="bg-muted p-4 rounded">
        Large container (max-w-lg)
      </div>
    ),
  },
};

export const ExtraLarge: Story = {
  args: {
    maxWidth: 'xl',
    children: (
      <div className="bg-muted p-4 rounded">
        Extra large container (max-w-xl)
      </div>
    ),
  },
};

export const Full: Story = {
  args: {
    maxWidth: 'full',
    children: (
      <div className="bg-muted p-4 rounded">
        Full width container (max-w-full)
      </div>
    ),
  },
};

export const WithContent: Story = {
  args: {
    maxWidth: 'xl',
    children: (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Page Title</h1>
        <p className="text-muted-foreground">
          This is a container with typical page content. The container provides
          consistent horizontal padding and centers content with a maximum width.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-muted p-4 rounded">Card 1</div>
          <div className="bg-muted p-4 rounded">Card 2</div>
        </div>
      </div>
    ),
  },
};
