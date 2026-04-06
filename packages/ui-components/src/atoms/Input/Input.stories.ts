import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Input } from './Input';

const meta = {
  title: 'Atoms/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible input component with variants, sizes, and built-in form validation states. Includes label, helper text, error handling, and icon support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'error', 'success'],
      description: 'Input visual variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Input size',
    },
    label: {
      control: 'text',
      description: 'Label for the input',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below input',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    success: {
      control: 'boolean',
      description: 'Show success state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the input',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
      description: 'Input type',
    },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter your text...',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Full Name',
    placeholder: 'John Doe',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Email Address',
    type: 'email',
    placeholder: 'john@example.com',
    helperText: "We'll never share your email with anyone else.",
  },
};

export const Error: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    error: 'Password must be at least 8 characters long',
  },
};

export const Success: Story = {
  args: {
    label: 'Username',
    placeholder: 'Choose a username',
    success: true,
    helperText: 'Username is available!',
  },
};

export const Small: Story = {
  args: {
    label: 'Zip Code',
    placeholder: '12345',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    label: 'Bio',
    placeholder: 'Tell us about yourself...',
    size: 'lg',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Field',
    placeholder: 'This field is disabled',
    disabled: true,
    value: 'Read-only value',
  },
};

export const WithLeftIcon: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search for anything...',
    leftIcon: '🔍',
  },
};

export const WithRightIcon: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'your@email.com',
    rightIcon: '✉️',
  },
};

export const NumberInput: Story = {
  args: {
    label: 'Quantity',
    type: 'number',
    placeholder: '0',
    min: 0,
    max: 100,
  },
};

export const TelInput: Story = {
  args: {
    label: 'Phone Number',
    type: 'tel',
    placeholder: '(555) 123-4567',
  },
};
