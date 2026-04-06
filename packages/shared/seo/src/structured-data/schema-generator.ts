/**
 * Structured Data Schema Generator
 * Implements 2026 schema.org standards for JSON-LD generation
 */

import type {
  StructuredData,
  OrganizationData,
  LocalBusinessData,
  ArticleData,
  ProductData,
  FAQData,
  HowToData,
  SchemaGenerator as ISchemaGenerator,
} from '../types/seo.types';

export class SchemaGenerator implements ISchemaGenerator {
  /**
   * Generate Organization schema
   */
  organization(data: OrganizationData): StructuredData {
    return {
      type: 'Organization',
      properties: {
        name: data.name,
        url: data.url,
        logo: data.logo,
        description: data.description,
        address: data.address ? this.address(data.address) : undefined,
        contactPoint: data.contactPoint ? this.contactPoint(data.contactPoint) : undefined,
        sameAs: data.socialLinks,
        foundingDate: data.foundingDate,
        numberOfEmployees: data.numberOfEmployees,
        areaServed: data.address
          ? {
              '@type': 'Place',
              address: this.address(data.address),
            }
          : undefined,
      },
    };
  }

  /**
   * Generate LocalBusiness schema
   */
  localBusiness(data: LocalBusinessData): StructuredData {
    return {
      type: 'LocalBusiness',
      properties: {
        name: data.name,
        description: data.description,
        url: data.url,
        telephone: data.telephone,
        address: this.address(data.address),
        geo: data.geo ? this.geo(data.geo) : undefined,
        openingHoursSpecification: data.openingHours?.map((hours) => this.openingHours(hours)),
        priceRange: data.priceRange,
        paymentAccepted: data.paymentAccepted,
        currenciesAccepted: data.currenciesAccepted,
        servesCuisine: data.servesCuisine,
        aggregateRating: data.rating ? this.aggregateRating(data.rating) : undefined,
        review: data.rating?.reviews?.map((review) => this.review(review)),
        areaServed: data.address
          ? {
              '@type': 'Place',
              address: this.address(data.address),
            }
          : undefined,
        hasOfferCatalog: data.offers
          ? {
              '@type': 'OfferCatalog',
              itemListElement: data.offers.map((offer, index) => ({
                '@type': 'Offer',
                position: index + 1,
                ...this.offer(offer).properties,
              })),
            }
          : undefined,
      },
    };
  }

  /**
   * Generate Article schema
   */
  article(data: ArticleData): StructuredData {
    return {
      type: 'Article',
      properties: {
        headline: data.headline,
        description: data.description,
        image: data.image,
        author: data.author ? this.person(data.author) : undefined,
        publisher: data.publisher ? this.organization(data.publisher) : undefined,
        datePublished: data.datePublished,
        dateModified: data.dateModified,
        mainEntityOfPage: data.mainEntityOfPage,
        wordCount: data.wordCount,
        articleSection: data.articleSection,
        keywords: data.keywords,
        about: data.keywords
          ? data.keywords.map((keyword) => ({
              '@type': 'Thing',
              name: keyword,
            }))
          : undefined,
        inLanguage: data.author?.jobTitle ? 'en-US' : undefined,
        isPartOf: {
          '@type': 'CreativeWorkSeries',
          name: data.articleSection,
        },
      },
    };
  }

  /**
   * Generate Product schema
   */
  product(data: ProductData): StructuredData {
    return {
      type: 'Product',
      properties: {
        name: data.name,
        description: data.description,
        image: data.images,
        brand: data.brand ? this.brand(data.brand) : undefined,
        sku: data.sku,
        gtin: data.gtin,
        offers: data.offers?.map((offer) => this.offer(offer)),
        aggregateRating: data.rating ? this.aggregateRating(data.rating) : undefined,
        review: data.reviews?.map((review) => this.review(review)),
        category: data.brand?.name,
        material: undefined, // Can be added as needed
        weight: undefined, // Can be added as needed
        height: undefined, // Can be added as needed
        width: undefined, // Can be added as needed
        depth: undefined, // Can be added as needed
      },
    };
  }

  /**
   * Generate FAQ schema
   */
  faq(data: FAQData): StructuredData {
    return {
      type: 'FAQPage',
      properties: {
        mainEntity: data.questions.map((q) => ({
          '@type': 'Question',
          name: q.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: q.answer,
          },
        })),
      },
    };
  }

  /**
   * Generate HowTo schema
   */
  howTo(data: HowToData): StructuredData {
    return {
      type: 'HowTo',
      properties: {
        name: data.name,
        description: data.description,
        image: data.image,
        totalTime: data.totalTime,
        supply: data.supplies?.map((supply) => ({
          '@type': 'HowToSupply',
          name: supply,
        })),
        tool: data.tools?.map((tool) => ({
          '@type': 'HowToTool',
          name: tool,
        })),
        step: data.steps.map((step, index) => ({
          '@type': 'HowToStep',
          position: index + 1,
          name: step.name,
          text: step.text,
          image: step.image,
          url: step.url,
        })),
        estimatedCost: {
          '@type': 'MonetaryAmount',
          currency: 'USD',
          value: '0',
        },
        toolRequired: data.tools && data.tools.length > 0,
        supplyRequired: data.supplies && data.supplies.length > 0,
      },
    };
  }

  /**
   * Generate BreadcrumbList schema
   */
  breadcrumbList(breadcrumbs: { name: string; url: string }[]): StructuredData {
    return {
      type: 'BreadcrumbList',
      properties: {
        itemListElement: breadcrumbs.map((breadcrumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: breadcrumb.name,
          item: breadcrumb.url,
        })),
      },
    };
  }

  /**
   * Generate WebSite schema
   */
  website(
    siteName: string,
    siteUrl: string,
    potentialActions?: { name: string; target: string }[]
  ): StructuredData {
    return {
      type: 'WebSite',
      properties: {
        name: siteName,
        url: siteUrl,
        potentialAction: potentialActions?.map((action) => ({
          '@type': 'SearchAction',
          target: action.target,
          'query-input': `required name=${action.name}`,
        })),
      },
    };
  }

  /**
   * Generate Person schema
   */
  person(data: {
    name: string;
    url?: string;
    jobTitle?: string;
    image?: string;
    sameAs?: string[];
  }): StructuredData {
    return {
      type: 'Person',
      properties: {
        name: data.name,
        url: data.url,
        jobTitle: data.jobTitle,
        image: data.image,
        sameAs: data.sameAs,
        worksFor: data.url
          ? {
              '@type': 'Organization',
              url: data.url,
            }
          : undefined,
      },
    };
  }

  /**
   * Generate Event schema
   */
  event(data: {
    name: string;
    description: string;
    startDate: string;
    endDate?: string;
    location?: {
      name: string;
      address: any;
    };
    url?: string;
    image?: string;
    offers?: {
      price: string;
      currency: string;
      availability: string;
      url: string;
    }[];
  }): StructuredData {
    return {
      type: 'Event',
      properties: {
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        location: data.location
          ? {
              '@type': 'Place',
              name: data.location.name,
              address: this.address(data.location.address),
            }
          : undefined,
        url: data.url,
        image: data.image,
        offers: data.offers?.map((offer) => ({
          '@type': 'Offer',
          price: offer.price,
          priceCurrency: offer.currency,
          availability: `https://schema.org/${offer.availability}`,
          url: offer.url,
        })),
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      },
    };
  }

  // Helper methods for generating nested schema objects
  private address(data: any): any {
    return {
      '@type': 'PostalAddress',
      streetAddress: data.streetAddress,
      addressLocality: data.addressLocality,
      addressRegion: data.addressRegion,
      postalCode: data.postalCode,
      addressCountry: data.addressCountry,
    };
  }

  private contactPoint(data: any): any {
    return {
      '@type': 'ContactPoint',
      telephone: data.telephone,
      contactType: data.contactType,
      availableLanguage: data.availableLanguage,
      areaServed: data.availableLanguage
        ? {
            '@type': 'Country',
            name: data.availableLanguage[0],
          }
        : undefined,
    };
  }

  private openingHours(data: any): any {
    return {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: data.dayOfWeek,
      opens: data.opens,
      closes: data.closes,
      validFrom: data.validFrom,
      validThrough: data.validThrough,
    };
  }

  private geo(data: any): any {
    return {
      '@type': 'GeoCoordinates',
      latitude: data.latitude,
      longitude: data.longitude,
    };
  }

  private person(data: any): any {
    return {
      '@type': 'Person',
      name: data.name,
      url: data.url,
      jobTitle: data.jobTitle,
      sameAs: data.sameAs,
    };
  }

  private brand(data: any): any {
    return {
      '@type': 'Brand',
      name: data.name,
      logo: data.logo,
      slogan: data.slogan,
      description: data.description,
    };
  }

  private offer(data: any): StructuredData {
    return {
      type: 'Offer',
      properties: {
        price: data.price,
        priceCurrency: data.currency,
        availability: `https://schema.org/${data.availability}`,
        validFrom: data.validFrom,
        validThrough: data.validThrough,
        seller: data.seller ? this.organization(data.seller) : undefined,
        itemCondition: 'https://schema.org/NewCondition',
        shippingDetails: data.shipping
          ? {
              '@type': 'OfferShippingDetails',
              shippingRate: {
                '@type': 'MonetaryAmount',
                value: data.shipping.cost,
                currency: data.currency,
              },
            }
          : undefined,
      },
    };
  }

  private aggregateRating(data: any): any {
    return {
      '@type': 'AggregateRating',
      ratingValue: data.ratingValue,
      reviewCount: data.reviewCount,
      bestRating: data.bestRating || 5,
      worstRating: data.worstRating || 1,
      itemReviewed: data.itemReviewed,
    };
  }

  private review(data: any): any {
    return {
      '@type': 'Review',
      author: this.person(data.author),
      reviewRating: this.rating(data.rating),
      reviewBody: data.reviewBody,
      datePublished: data.datePublished,
      reviewAspect: data.reviewAspect,
    };
  }

  private rating(data: any): any {
    return {
      '@type': 'Rating',
      ratingValue: data.ratingValue,
      bestRating: data.bestRating || 5,
      worstRating: data.worstRating || 1,
      ratingExplanation: data.ratingExplanation,
    };
  }

  private organization(data: any): any {
    return {
      '@type': 'Organization',
      name: data.name,
      url: data.url,
      logo: data.logo,
    };
  }
}
