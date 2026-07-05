# Forms Documentation

This document describes the forms implementation in the marketing website, including the contact form with email sending via Resend.

## Contact Form

The contact form is located at `/contact` and uses React 19 Server Actions for form submission and validation.

### Implementation Details

- **Location**: `apps/firm-website/src/app/(marketing)/contact/page.tsx`
- **Server Action**: `apps/firm-website/src/app/actions/contact.ts`
- **Form Component**: `apps/firm-website/src/components/features/contact/contact-form.tsx`

### Form Fields

- **Name** (required): Minimum 2 characters
- **Email** (required): Valid email address
- **Phone** (optional): Free text
- **Company** (optional): Free text
- **Message** (required): Minimum 10 characters

### Validation

Form validation is performed server-side using Zod v4:
- Schema: `ContactFormSchema` in `contact.ts`
- Validation errors are returned as field-level errors
- Uses `z.treeifyError()` for error formatting (Zod v4 API)

### State Management

The form uses React 19's `useActionState` hook:
- Initial state: `initialContactState`
- Loading state: `useFormStatus` on submit button
- Success/error messages displayed to user

### Email Sending (Resend)

The contact form sends emails via Resend API after successful validation.

#### Environment Variables

Required environment variables (see `.env.example`):

```bash
RESEND_API_KEY=re_xxxx
CONTACT_EMAIL=hello@yourdedicatedmarketer.com
FROM_EMAIL=noreply@yourdedicatedmarketer.com
```

#### Setup Instructions

1. Create a Resend account at https://resend.com
2. Verify your domain in Resend
3. Generate an API key
4. Add the API key to your `.env.local` file
5. Set `CONTACT_EMAIL` to your receiving email address
6. Set `FROM_EMAIL` to a verified sender address in Resend

#### Email Content

Emails are sent as plain text with the following format:

```
Name: [name]
Email: [email]
Phone: [phone or "Not provided"]
Company: [company or "Not provided"]

Message:
[message]
```

The `replyTo` field is set to the submitter's email for easy replies.

#### Error Handling

- Missing environment variables: Returns user-friendly error message
- Resend API errors: Logs to console, returns user-friendly error message
- Validation errors: Field-level errors displayed next to inputs

### Testing

Unit tests are located in `apps/firm-website/src/app/actions/contact.test.ts`:

- Validates form data and returns errors for invalid input
- Tests successful email sending with valid data
- Tests missing environment variables handling
- Tests Resend API error handling
- Tests optional fields (phone, company) when not provided

Run tests with:
```bash
pnpm --filter @repo/firm-website test
```

## Future Enhancements

- HTML email templates (currently plain text)
- Confirmation email to submitter
- Toast notifications for better UX
- Email attachment support
- Rate limiting for form submissions
