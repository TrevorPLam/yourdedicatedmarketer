'use server';

import { z } from 'zod';

/**
 * Zod schema for contact form validation.
 * Validates name, email, phone (optional), company (optional), and message.
 */
const ContactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

/**
 * Form state interface for useActionState.
 */
export interface ContactFormState {
  success: boolean;
  message: string;
  errors: Record<string, string[]>;
}

/**
 * Initial state for the contact form.
 */
export const initialContactState: ContactFormState = {
  success: false,
  message: '',
  errors: {},
};

/**
 * Server Action to handle contact form submission.
 * Validates form data with Zod and returns success/error state.
 *
 * @param prevState - Previous form state (required by useActionState)
 * @param formData - Form data from the contact form
 * @returns Form state with success status, message, and field errors
 */
export async function submitContact(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  // Extract form data
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    company: formData.get('company'),
    message: formData.get('message'),
  };

  // Validate with Zod
  const result = ContactFormSchema.safeParse(rawData);

  // Return validation errors if validation fails
  if (!result.success) {
    const treeifiedError = z.treeifyError(result.error);
    // Transform treeifiedError properties to fieldErrors format
    const fieldErrors: Record<string, string[]> = {};
    if (treeifiedError.properties) {
      for (const [field, errorInfo] of Object.entries(treeifiedError.properties)) {
        if (errorInfo && 'errors' in errorInfo) {
          fieldErrors[field] = errorInfo.errors;
        }
      }
    }
    return {
      success: false,
      message: 'Please fix the errors below.',
      errors: fieldErrors,
    };
  }

  // Validation passed - in a real implementation, this would:
  // - Send email via Resend (Phase 4, P022)
  // - Store in database
  // - Trigger notifications

  const { name, email, phone, company, message } = result.data;

  // Log submission (placeholder for actual email sending)
  console.log('Contact form submission:', {
    name,
    email,
    phone: phone || 'Not provided',
    company: company || 'Not provided',
    message,
  });

  // Return success state
  return {
    success: true,
    message: 'Thank you for your message! We\'ll get back to you soon.',
    errors: {},
  };
}
