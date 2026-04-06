export const SITE_CONFIG = {
  site: 'https://client-alpha.com',
  title: 'Client Alpha - Innovative Solutions',
  description: 'Leading provider of innovative business solutions and digital transformation services.',
  defaultLocale: 'en',
  trailingSlash: 'never',
};

export const CLIENT_CONFIG = {
  name: 'Client Alpha',
  domain: 'client-alpha.com',
  industry: 'Technology',
  theme: 'alpha-brand',
  features: {
    analytics: true,
    blog: true,
    contact: true,
    portfolio: true,
    careers: true,
    newsletter: true,
  },
  branding: {
    logo: '/images/alpha-logo.svg',
    favicon: '/favicon.ico',
    primaryColor: '#2563eb',
    secondaryColor: '#64748b',
  },
  contact: {
    email: 'info@client-alpha.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business Ave, Suite 100, New York, NY 10001',
  },
  social: {
    twitter: 'https://twitter.com/clientalpha',
    linkedin: 'https://linkedin.com/company/client-alpha',
    github: 'https://github.com/clientalpha',
  },
};

export const SEO_CONFIG = {
  ogImage: '/images/og-image.jpg',
  ogImageAlt: 'Client Alpha - Innovative Solutions',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterCard: 'summary_large_image',
  twitterCreator: '@clientalpha',
};

export const I18N_CONFIG = {
  locales: ['en', 'es', 'fr', 'de'],
  defaultLocale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {
      navigation: {
        home: 'Home',
        about: 'About',
        services: 'Services',
        portfolio: 'Portfolio',
        blog: 'Blog',
        contact: 'Contact',
        careers: 'Careers',
      },
      common: {
        learnMore: 'Learn More',
        getStarted: 'Get Started',
        contactUs: 'Contact Us',
        readMore: 'Read More',
        backToTop: 'Back to Top',
      },
    },
    es: {
      navigation: {
        home: 'Inicio',
        about: 'Nosotros',
        services: 'Servicios',
        portfolio: 'Portafolio',
        blog: 'Blog',
        contact: 'Contacto',
        careers: 'Carreras',
      },
      common: {
        learnMore: 'Más Información',
        getStarted: 'Comenzar',
        contactUs: 'Contáctanos',
        readMore: 'Leer Más',
        backToTop: 'Volver Arriba',
      },
    },
    fr: {
      navigation: {
        home: 'Accueil',
        about: 'À Propos',
        services: 'Services',
        portfolio: 'Portfolio',
        blog: 'Blog',
        contact: 'Contact',
        careers: 'Carrières',
      },
      common: {
        learnMore: 'En Savoir Plus',
        getStarted: 'Commencer',
        contactUs: 'Nous Contacter',
        readMore: 'Lire Plus',
        backToTop: 'Retour en Haut',
      },
    },
    de: {
      navigation: {
        home: 'Startseite',
        about: 'Über Uns',
        services: 'Dienstleistungen',
        portfolio: 'Portfolio',
        blog: 'Blog',
        contact: 'Kontakt',
        careers: 'Karriere',
      },
      common: {
        learnMore: 'Mehr Erfahren',
        getStarted: 'Loslegen',
        contactUs: 'Kontaktieren Sie Uns',
        readMore: 'Mehr Lesen',
        backToTop: 'Nach Oben',
      },
    },
  },
};
