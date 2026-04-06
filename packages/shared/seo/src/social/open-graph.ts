/**
 * Open Graph and Social Media Optimization
 * Implements 2026 best practices for social sharing and Open Graph protocol
 */

import type { SEOConfig, SiteConfig, MetaTag } from '../types/seo.types';

export interface OpenGraphConfig {
  type: 'website' | 'article' | 'product' | 'video.other' | 'profile';
  title: string;
  description: string;
  url: string;
  image?: string;
  imageAlt?: string;
  imageWidth?: string;
  imageHeight?: string;
  imageType?: string;
  siteName?: string;
  locale?: string;
  determiner?: 'a' | 'an' | 'the' | 'auto' | '';
  audio?: string;
  video?: string;
}

export interface TwitterCardConfig {
  card: 'summary' | 'summary_large_image' | 'app' | 'player';
  site?: string;
  creator?: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  player?: {
    url: string;
    width: string;
    height: string;
    stream?: string;
  };
  app?: {
    iphone?: {
      name: string;
      app_id: string;
      url: string;
    };
    googleplay?: {
      name: string;
      app_id: string;
      url: string;
    };
  };
}

export class OpenGraphGenerator {
  private siteConfig: SiteConfig;

  constructor(siteConfig: SiteConfig) {
    this.siteConfig = siteConfig;
  }

  /**
   * Generate Open Graph meta tags
   */
  generateOpenGraphTags(config: OpenGraphConfig): MetaTag[] {
    const tags: MetaTag[] = [];

    // Basic Open Graph tags
    tags.push(
      { property: 'og:type', content: config.type },
      { property: 'og:title', content: config.title },
      { property: 'og:description', content: config.description },
      { property: 'og:url', content: config.url }
    );

    // Site name
    if (config.siteName || this.siteConfig.siteName) {
      tags.push({
        property: 'og:site_name',
        content: config.siteName || this.siteConfig.siteName,
      });
    }

    // Locale
    if (config.locale || this.siteConfig.locale) {
      tags.push({
        property: 'og:locale',
        content: config.locale || this.siteConfig.locale || 'en_US',
      });
    }

    // Determiner (a, an, the)
    if (config.determiner) {
      tags.push({ property: 'og:determiner', content: config.determiner });
    }

    // Image optimization
    if (config.image) {
      tags.push(
        { property: 'og:image', content: config.image },
        { property: 'og:image:alt', content: config.imageAlt || config.title },
        { property: 'og:image:width', content: config.imageWidth || '1200' },
        { property: 'og:image:height', content: config.imageHeight || '630' },
        { property: 'og:image:type', content: config.imageType || 'image/jpeg' }
      );

      // Add secure URL if using HTTPS
      if (config.image.startsWith('https://')) {
        tags.push({ property: 'og:image:secure_url', content: config.image });
      }
    }

    // Audio content
    if (config.audio) {
      tags.push(
        { property: 'og:audio', content: config.audio },
        { property: 'og:audio:type', content: 'audio/mpeg' }
      );

      if (config.audio.startsWith('https://')) {
        tags.push({ property: 'og:audio:secure_url', content: config.audio });
      }
    }

    // Video content
    if (config.video) {
      tags.push(
        { property: 'og:video', content: config.video },
        { property: 'og:video:type', content: 'video/mp4' }
      );

      if (config.video.startsWith('https://')) {
        tags.push({ property: 'og:video:secure_url', content: config.video });
      }
    }

    // Article specific tags
    if (config.type === 'article') {
      // These would be populated from the article data
      tags.push(
        { property: 'article:section', content: 'Marketing' },
        { property: 'article:tag', content: 'Digital Marketing' }
      );
    }

    // Product specific tags
    if (config.type === 'product') {
      tags.push(
        { property: 'product:brand', content: this.siteConfig.siteName },
        { property: 'product:availability', content: 'in stock' },
        { property: 'product:condition', content: 'new' }
      );
    }

    return tags;
  }

  /**
   * Generate Twitter Card meta tags
   */
  generateTwitterCardTags(config: TwitterCardConfig): MetaTag[] {
    const tags: MetaTag[] = [];

    // Basic Twitter Card tags
    tags.push(
      { name: 'twitter:card', content: config.card },
      { name: 'twitter:title', content: config.title },
      { name: 'twitter:description', content: config.description }
    );

    // Site and creator
    if (config.site || this.siteConfig.twitterHandle) {
      tags.push({
        name: 'twitter:site',
        content: config.site || this.siteConfig.twitterHandle || '',
      });
    }

    if (config.creator) {
      tags.push({ name: 'twitter:creator', content: config.creator });
    }

    // Image
    if (config.image) {
      tags.push(
        { name: 'twitter:image', content: config.image },
        { name: 'twitter:image:alt', content: config.imageAlt || config.title }
      );
    }

    // Player card (for video/audio)
    if (config.card === 'player' && config.player) {
      tags.push(
        { name: 'twitter:player', content: config.player.url },
        { name: 'twitter:player:width', content: config.player.width },
        { name: 'twitter:player:height', content: config.player.height }
      );

      if (config.player.stream) {
        tags.push({ name: 'twitter:player:stream', content: config.player.stream });
      }
    }

    // App card
    if (config.card === 'app' && config.app) {
      if (config.app.iphone) {
        tags.push(
          { name: 'twitter:app:name:iphone', content: config.app.iphone.name },
          { name: 'twitter:app:id:iphone', content: config.app.iphone.app_id },
          { name: 'twitter:app:url:iphone', content: config.app.iphone.url }
        );
      }

      if (config.app.googleplay) {
        tags.push(
          { name: 'twitter:app:name:googleplay', content: config.app.googleplay.name },
          { name: 'twitter:app:id:googleplay', content: config.app.googleplay.app_id },
          { name: 'twitter:app:url:googleplay', content: config.app.googleplay.url }
        );
      }
    }

    return tags;
  }

  /**
   * Generate comprehensive social tags
   */
  generateSocialTags(ogConfig: OpenGraphConfig, twitterConfig?: TwitterCardConfig): MetaTag[] {
    const ogTags = this.generateOpenGraphTags(ogConfig);
    const twitterTags = twitterConfig
      ? this.generateTwitterCardTags(twitterConfig)
      : this.generateTwitterCardTags({
          card: 'summary_large_image',
          title: ogConfig.title,
          description: ogConfig.description,
          image: ogConfig.image,
          imageAlt: ogConfig.imageAlt,
        });

    return [...ogTags, ...twitterTags];
  }

  /**
   * Validate Open Graph configuration
   */
  validateOpenGraphConfig(config: OpenGraphConfig): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields
    if (!config.type) {
      errors.push('Open Graph type is required');
    }

    if (!config.title || config.title.trim().length === 0) {
      errors.push('Open Graph title is required');
    }

    if (!config.description || config.description.trim().length === 0) {
      errors.push('Open Graph description is required');
    }

    if (!config.url || !this.isValidURL(config.url)) {
      errors.push('Open Graph URL is required and must be valid');
    }

    // Title length validation
    if (config.title.length > 100) {
      errors.push('Open Graph title should be 100 characters or less');
    }

    // Description length validation
    if (config.description.length > 300) {
      errors.push('Open Graph description should be 300 characters or less');
    }

    // Image validation
    if (config.image && !this.isValidURL(config.image)) {
      errors.push('Open Graph image must be a valid URL');
    }

    // Image size recommendations
    if (config.image) {
      const width = parseInt(config.imageWidth || '1200');
      const height = parseInt(config.imageHeight || '630');

      if (width < 1200 || height < 630) {
        errors.push('Open Graph image should be at least 1200x630 pixels for optimal display');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate Twitter Card configuration
   */
  validateTwitterCardConfig(config: TwitterCardConfig): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields
    if (!config.card) {
      errors.push('Twitter Card type is required');
    }

    if (!config.title || config.title.trim().length === 0) {
      errors.push('Twitter Card title is required');
    }

    if (!config.description || config.description.trim().length === 0) {
      errors.push('Twitter Card description is required');
    }

    // Title length validation by card type
    const titleLimit = config.card === 'summary' ? 70 : 200;
    if (config.title.length > titleLimit) {
      errors.push(
        `Twitter Card title should be ${titleLimit} characters or less for ${config.card} cards`
      );
    }

    // Description length validation
    const descriptionLimit = config.card === 'summary' ? 200 : 280;
    if (config.description.length > descriptionLimit) {
      errors.push(
        `Twitter Card description should be ${descriptionLimit} characters or less for ${config.card} cards`
      );
    }

    // Player card validation
    if (config.card === 'player') {
      if (!config.player) {
        errors.push('Player configuration is required for player cards');
      } else {
        if (!config.player.url || !this.isValidURL(config.player.url)) {
          errors.push('Player URL is required and must be valid');
        }
        if (!config.player.width || !config.player.height) {
          errors.push('Player width and height are required');
        }
      }
    }

    // App card validation
    if (config.card === 'app') {
      if (!config.app || (!config.app.iphone && !config.app.googleplay)) {
        errors.push('App configuration is required for app cards');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Generate social sharing URLs
   */
  generateSharingUrls(
    url: string,
    title: string,
    description?: string
  ): { platform: string; url: string }[] {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedDescription = description ? encodeURIComponent(description) : '';

    return [
      {
        platform: 'Twitter',
        url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      },
      {
        platform: 'LinkedIn',
        url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      },
      {
        platform: 'Facebook',
        url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      },
      {
        platform: 'Reddit',
        url: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      },
      {
        platform: 'Pinterest',
        url: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
      },
      {
        platform: 'WhatsApp',
        url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      },
      {
        platform: 'Email',
        url: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%20${encodedUrl}`,
      },
    ];
  }

  /**
   * Basic URL validation
   */
  private isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Generate social media preview HTML
   */
  generateSocialPreview(config: OpenGraphConfig): string {
    return `
<div class="social-preview">
  <div class="social-preview-header">
    <img src="${config.image || '/default-og-image.jpg'}" alt="${config.imageAlt || config.title}" />
  </div>
  <div class="social-preview-content">
    <div class="social-preview-title">${config.title}</div>
    <div class="social-preview-description">${config.description}</div>
    <div class="social-preview-url">${config.url}</div>
  </div>
</div>
<style>
.social-preview {
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  overflow: hidden;
  max-width: 500px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
.social-preview-header img {
  width: 100%;
  height: 264px;
  object-fit: cover;
}
.social-preview-content {
  padding: 12px 16px;
}
.social-preview-title {
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.social-preview-description {
  color: #65676b;
  font-size: 16px;
  line-height: 20px;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.social-preview-url {
  color: #65676b;
  font-size: 12px;
  line-height: 16px;
  text-transform: uppercase;
}
</style>`;
  }
}
