import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Header } from './header';

const meta: Meta<typeof Header> = {
  title: 'Layout/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ margin: '-1rem' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {
    navItems: [
      { href: '/', label: 'Home' },
      { href: '/about', label: 'About' },
      { href: '/services', label: 'Services' },
      { href: '/contact', label: 'Contact' },
    ],
  },
};

export const WithCustomLogo: Story = {
  args: {
    navItems: [
      { href: '/', label: 'Home' },
      { href: '/about', label: 'About' },
    ],
    logo: <div className="text-2xl font-bold text-primary">YDM</div>,
  },
};

export const Minimal: Story = {
  args: {
    navItems: [],
  },
};

export const SingleNavItem: Story = {
  args: {
    navItems: [{ href: '/services', label: 'Services' }],
  },
};
