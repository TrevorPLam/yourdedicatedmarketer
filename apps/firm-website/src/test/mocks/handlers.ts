import { http, HttpResponse } from 'msw';

// MSW handlers for integration tests
// These intercept HTTP requests at the network boundary
export const handlers = [
  // Example: Mock API endpoint for services
  http.get('/api/services', () => {
    return HttpResponse.json([
      {
        title: 'Web Design',
        slug: 'web-design',
        description: 'Custom website design services',
      },
      {
        title: 'SEO Optimization',
        slug: 'seo-optimization',
        description: 'Search engine optimization services',
      },
    ]);
  }),

  // Example: Mock API endpoint for a single service
  http.get('/api/services/:slug', ({ params }) => {
    const { slug } = params;
    return HttpResponse.json({
      title: 'Web Design',
      slug,
      description: 'Custom website design services',
      content: '# Web Design\n\nOur web design services...',
    });
  }),

  // Example: Mock form submission
  http.post('/api/contact', async ({ request }) => {
    await request.json();
    return HttpResponse.json({ success: true, message: 'Message sent' });
  }),
];
