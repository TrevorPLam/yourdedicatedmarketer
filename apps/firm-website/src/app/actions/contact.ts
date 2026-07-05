'use server';

import { z } from 'zod';
import { Resend } from 'resend';

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
  // Extract form data - handle null values properly
  const rawData = {
    name: formData.get('name') || '',
    email: formData.get('email') || '',
    phone: formData.get('phone') || undefined,
    company: formData.get('company') || undefined,
    message: formData.get('message') || '',
  };

  // Validate with Zod
  const result = ContactFormSchema.safeParse(rawData);

  // Return validation errors if validation fails
  if (!result.success) {
    // Transform Zod error issues to fieldErrors format
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as string | undefined;
      if (field) {
        if (!fieldErrors[field]) {
          fieldErrors[field] = [];
        }
        fieldErrors[field].push(issue.message);
      }
    }
    return {
      success: false,
      message: 'Please fix the errors below.',
      errors: fieldErrors,
    };
  }

  // Validation passed - send email via Resend
  const { name, email, phone, company, message } = result.data;

  // Validate environment variables
  const resendApiKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL;
  const fromEmail = process.env.FROM_EMAIL;

  if (!resendApiKey || !contactEmail || !fromEmail) {
    console.error('Missing required environment variables for Resend');
    return {
      success: false,
      message: 'Server configuration error. Please try again later.',
      errors: {},
    };
  }

  try {
    const resend = new Resend(resendApiKey);

    // Build email text content
    const emailText = `
Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Company: ${company || 'Not provided'}

Message:
${message}
    `.trim();

    // Send email via Resend
    await resend.emails.send({
      from: fromEmail,
      to: contactEmail,
      subject: `New Contact Form Submission from ${name}`,
      text: emailText,
      replyTo: email,
    });

    // Return success state
    return {
      success: true,
      message: 'Thank you for your message! We\'ll get back to you soon.',
      errors: {},
    };
  } catch (error) {
    console.error('Error sending email via Resend:', error);
    return {
      success: false,
      message: 'Failed to send message. Please try again later.',
      errors: {},
    };
  }
}
