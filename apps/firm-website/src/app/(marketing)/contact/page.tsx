import { ContactForm } from '@/components/features/contact/contact-form';
import type { Metadata } from 'next';

// Make contact page dynamic to avoid Server Action issues during static generation
export const dynamic = 'force-dynamic';

/**
 * Generate metadata for the contact page.
 */
export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Your Dedicated Marketer. We\'d love to hear about your project and discuss how we can help your business grow.',
};

/**
 * Contact page with form for user inquiries.
 * Renders the ContactForm component with validation and server action integration.
 */
export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto max-w-2xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Get in Touch
          </h1>
          <p className="text-lg text-muted-foreground">
            Have a project in mind? We'd love to hear from you. Fill out the form
            below and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-8 shadow-sm">
          <ContactForm />
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-2 text-lg font-semibold">Email</h3>
            <p className="text-muted-foreground">contact@yourdedicatedmarketer.com</p>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold">Phone</h3>
            <p className="text-muted-foreground">+1 (555) 123-4567</p>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold">Address</h3>
            <p className="text-muted-foreground">
              123 Marketing St
              <br />
              Business City, BC 12345
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold">Hours</h3>
            <p className="text-muted-foreground">
              Monday - Friday
              <br />
              9:00 AM - 5:00 PM PST
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
