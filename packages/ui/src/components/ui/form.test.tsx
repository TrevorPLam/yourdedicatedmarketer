import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input } from './input';
import { Textarea } from './textarea';
import { Label } from './label';

describe('Form Components', () => {
  describe('Input', () => {
    it('renders input with default props', () => {
      render(<Input placeholder="Enter text" />);
      const input = screen.getByPlaceholderText('Enter text');
      expect(input).toBeInTheDocument();
      expect(input).toHaveClass('border-input');
    });

    it('applies custom className', () => {
      render(<Input className="custom-class" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-class');
    });

    it('renders with different types', () => {
      render(<Input type="email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });
  });

  describe('Textarea', () => {
    it('renders textarea with default props', () => {
      render(<Textarea placeholder="Enter message" />);
      const textarea = screen.getByPlaceholderText('Enter message');
      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveClass('border-input');
    });

    it('applies custom className', () => {
      render(<Textarea className="custom-class" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('custom-class');
    });

    it('has minimum height', () => {
      render(<Textarea />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('min-h-16');
    });
  });

  describe('Label', () => {
    it('renders label with text', () => {
      render(<Label>Email</Label>);
      const label = screen.getByText('Email');
      expect(label).toBeInTheDocument();
      expect(label).toHaveClass('text-sm');
    });

    it('applies custom className', () => {
      render(<Label className="custom-class">Name</Label>);
      const label = screen.getByText('Name');
      expect(label).toHaveClass('custom-class');
    });

    it('associates with input via htmlFor', () => {
      render(
        <>
          <Label htmlFor="email">Email</Label>
          <Input id="email" />
        </>
      );
      const label = screen.getByText('Email');
      const input = screen.getByRole('textbox');
      expect(label).toHaveAttribute('for', 'email');
      expect(input).toHaveAttribute('id', 'email');
    });
  });

  describe('Form Component Integration', () => {
    it('renders form field with label and input', () => {
      render(
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Your name" />
        </div>
      );
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument();
    });

    it('renders form field with label and textarea', () => {
      render(
        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" placeholder="Your message" />
        </div>
      );
      expect(screen.getByText('Message')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Your message')).toBeInTheDocument();
    });
  });
});
