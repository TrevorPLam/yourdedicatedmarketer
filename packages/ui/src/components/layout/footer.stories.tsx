import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Footer } from './footer';
import { Github, Twitter, Linkedin } from 'lucide-react';

const meta: Meta<typeof Footer> = {
  title: 'Layout/Footer',
  component: Footer,
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
type Story = StoryObj<typeof Footer>;

export const Default: Story = {
  args: {
    navLinks: [
      { href: '/', label: 'Home' },
      { href: '/about', label: 'About' },
      { href: '/services', label: 'Services' },
      { href: '/contact', label: 'Contact' },
    ],
    contactInfo: {
      email: 'hello@example.com',
      phone: '+1 (555) 123-4567',
      address: '123 Main Street, City, State 12345',
    },
    socialLinks: [
      { href: 'https://github.com', icon: <Github className="h-5 w-5" />, label: 'GitHub' },
      { href: 'https://twitter.com', icon: <Twitter className="h-5 w-5" />, label: 'Twitter' },
      { href: 'https://linkedin.com', icon: <Linkedin className="h-5 w-5" />, label: 'LinkedIn' },
    ],
  },
};

export const Minimal: Story = {
  args: {
    navLinks: [],
    contactInfo: {},
    socialLinks: [],
  },
};

export const NavigationOnly: Story = {
  args: {
    navLinks: [
      { href: '/', label: 'Home' },
      { href: '/about', label: 'About' },
      { href: '/services', label: 'Services' },
    ],
  },
};

export const ContactOnly: Story = {
  args: {
    contactInfo: {
      email: 'hello@example.com',
      phone: '+1 (555) 123-4567',
    },
  },
};

export const SocialOnly: Story = {
  args: {
    socialLinks: [
      { href: 'https://github.com', icon: <Github className="h-5 w-5" />, label: 'GitHub' },
      { href: 'https://twitter.com', icon: <Twitter className="h-5 w-5" />, label: 'Twitter' },
    ],
  },
};

export const WithCustomCopyright: Story = {
  args: {
    navLinks: [
      { href: '/', label: 'Home' },
      { href: '/about', label: 'About' },
    ],
    copyright: '© 2026 Custom Company. All rights reserved.',
  },
};

export const WithCustomLogo: Story = {
  args: {
    logo: <div className="text-xl font-bold">YDM</div>,
    navLinks: [
      { href: '/', label: 'Home' },
      { href: '/services', label: 'Services' },
    ],
  },
};
