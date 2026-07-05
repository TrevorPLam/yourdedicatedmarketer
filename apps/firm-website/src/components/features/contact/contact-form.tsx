'use client';

import { useActionState, useRef, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { Button } from '@repo/ui';
import { Input } from '@repo/ui';
import { Textarea } from '@repo/ui';
import { Label } from '@repo/ui';
import { submitContact, initialContactState, type ContactFormState } from '@/app/actions/contact';
import { event } from '@/lib/gtag';

/**
 * Submit button component with loading state.
 * Uses useFormStatus to show pending state during form submission.
 */
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Sending...' : 'Send Message'}
    </Button>
  );
}

/**
 * Contact form component with validation and state management.
 * Uses React 19's useActionState for server action integration.
 *
 * @returns Contact form with fields for name, email, phone, company, and message
 */
export function ContactForm() {
  const [state, formAction] = useActionState<ContactFormState, FormData>(
    submitContact,
    initialContactState
  );
  const formRef = useRef<HTMLFormElement>(null);
  const conversionEventFired = useRef(false);
  const isInitialRender = useRef(true);

  // Show toast notifications on state changes (not on initial render)
  useEffect(() => {
    // Skip initial render
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    // Show success toast
    if (state.success) {
      toast.success('Message sent successfully!');

      // Track GA4 conversion event (only once per submission)
      if (!conversionEventFired.current) {
        event('form_submission', { form_type: 'contact' });
        conversionEventFired.current = true;
      }
    }

    // Show error toast (when not successful and has a message)
    if (!state.success && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  // Reset form on successful submission
  if (state.success && formRef.current) {
    formRef.current.reset();
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Your name"
          required
          aria-invalid={!!state.errors?.name}
        />
        {state.errors?.name && (
          <p className="text-sm text-destructive">{state.errors.name[0]}</p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="your@email.com"
          required
          aria-invalid={!!state.errors?.email}
        />
        {state.errors?.email && (
          <p className="text-sm text-destructive">{state.errors.email[0]}</p>
        )}
      </div>

      {/* Phone Field (Optional) */}
      <div className="space-y-2">
        <Label htmlFor="phone">Phone (Optional)</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="+1 (555) 123-4567"
          aria-invalid={!!state.errors?.phone}
        />
        {state.errors?.phone && (
          <p className="text-sm text-destructive">{state.errors.phone[0]}</p>
        )}
      </div>

      {/* Company Field (Optional) */}
      <div className="space-y-2">
        <Label htmlFor="company">Company (Optional)</Label>
        <Input
          id="company"
          name="company"
          type="text"
          placeholder="Your company"
          aria-invalid={!!state.errors?.company}
        />
        {state.errors?.company && (
          <p className="text-sm text-destructive">{state.errors.company[0]}</p>
        )}
      </div>

      {/* Message Field */}
      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell us about your project..."
          required
          rows={6}
          aria-invalid={!!state.errors?.message}
        />
        {state.errors?.message && (
          <p className="text-sm text-destructive">{state.errors.message[0]}</p>
        )}
      </div>

      {/* Submit Button */}
      <SubmitButton />

      {/* Success/Error Message */}
      {state.message && (
        <p
          className={`text-sm ${
            state.success ? 'text-green-600' : 'text-destructive'
          }`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
