/**
 * Consent Management System
 *
 * GDPR/CCPA compliant consent management for analytics tracking.
 * Supports multiple regions, consent modes, and user preferences.
 *
 * @version 1.0.0
 * @agency/analytics
 */

import type { ConsentState } from '../interfaces/analytics.adapter';

export interface ConsentConfig {
  defaultConsent: Partial<ConsentState>;
  region: 'EU' | 'US' | 'CA' | 'UK' | 'GLOBAL';
  cookieDomain?: string;
  cookieExpiryDays?: number;
  requireExplicitConsent?: boolean;
  showConsentBanner?: boolean;
  consentVersion?: string;
  privacyPolicyUrl?: string;
  customCategories?: string[];
}

export interface ConsentBannerConfig {
  title: string;
  description: string;
  acceptAllText: string;
  rejectAllText: string;
  customizeText: string;
  privacyPolicyText: string;
  privacyPolicyUrl?: string;
  categories: ConsentCategory[];
  position: 'top' | 'bottom' | 'center';
  theme: 'light' | 'dark' | 'auto';
  showCloseButton?: boolean;
  autoHide?: boolean;
  autoHideDelay?: number;
}

export interface ConsentCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
  enabled: boolean;
  cookies?: string[];
  scripts?: string[];
}

export interface ConsentEvent {
  type: 'consent_given' | 'consent_updated' | 'consent_withdrawn';
  categories: Record<string, boolean>;
  timestamp: number;
  region: string;
  version: string;
}

export class ConsentManager {
  private config: ConsentConfig;
  private currentConsent: ConsentState;
  private listeners: ((event: ConsentEvent) => void)[] = [];
  private consentBanner: HTMLElement | null = null;
  private validationIntervalId: ReturnType<typeof setInterval> | null = null;
  private autoHideTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private isInitialized = false;
  private readonly STORAGE_KEY = 'agency_consent';
  private readonly CONSENT_VERSION = '1.0.0';

  constructor(config: ConsentConfig) {
    this.config = {
      cookieExpiryDays: 365,
      requireExplicitConsent: config.region === 'EU' || config.region === 'UK',
      showConsentBanner: true,
      consentVersion: this.CONSENT_VERSION,
      ...config,
    };

    this.currentConsent = this.loadConsent();
  }

  /**
   * Initialize consent management
   */
  initialize(): void {
    if (this.isInitialized) {
      return;
    }

    // Check if consent is needed
    if (this.shouldShowConsentBanner()) {
      this.showConsentBanner();
    }

    // Set up periodic consent validation
    this.setupConsentValidation();

    // Handle region-specific requirements
    this.handleRegionalRequirements();

    this.isInitialized = true;
  }

  /**
   * Get current consent state
   */
  getConsent(): ConsentState {
    return { ...this.currentConsent };
  }

  /**
   * Update consent state
   */
  updateConsent(consent: Partial<ConsentState>): void {
    const updatedConsent = {
      ...this.currentConsent,
      ...consent,
      timestamp: Date.now(),
      version: this.config.consentVersion || this.CONSENT_VERSION,
    };

    this.currentConsent = updatedConsent;
    this.saveConsent(updatedConsent);

    // Notify listeners
    this.notifyListeners({
      type: this.hasAnyConsent(updatedConsent) ? 'consent_given' : 'consent_updated',
      categories: {
        analytics: updatedConsent.analytics,
        advertising: updatedConsent.advertising,
        functional: updatedConsent.functional,
        personalization: updatedConsent.personalization,
      },
      timestamp: updatedConsent.timestamp,
      region: this.config.region,
      version: updatedConsent.version || this.CONSENT_VERSION,
    });

    // Hide banner if shown
    if (this.consentBanner) {
      this.hideConsentBanner();
    }
  }

  /**
   * Grant all consent
   */
  grantAllConsent(): void {
    this.updateConsent({
      analytics: true,
      advertising: true,
      functional: true,
      personalization: true,
    });
  }

  /**
   * Deny all consent (except required)
   */
  denyAllConsent(): void {
    this.updateConsent({
      analytics: false,
      advertising: false,
      functional: false,
      personalization: false,
    });
  }

  /**
   * Withdraw all consent
   */
  withdrawConsent(): void {
    this.updateConsent({
      analytics: false,
      advertising: false,
      functional: false,
      personalization: false,
    });

    // Clear cookies and data
    this.clearTrackingData();

    // Notify listeners
    this.notifyListeners({
      type: 'consent_withdrawn',
      categories: {
        analytics: false,
        advertising: false,
        functional: false,
        personalization: false,
      },
      timestamp: Date.now(),
      region: this.config.region,
      version: this.CONSENT_VERSION,
    });
  }

  /**
   * Add consent change listener
   */
  addListener(listener: (event: ConsentEvent) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Check if consent is required
   */
  isConsentRequired(): boolean {
    return this.config.requireExplicitConsent || false;
  }

  /**
   * Check if specific category has consent
   */
  hasConsent(category: keyof Omit<ConsentState, 'timestamp' | 'region' | 'version'>): boolean {
    return this.currentConsent[category] || false;
  }

  /**
   * Show consent banner
   */
  showConsentBanner(config?: ConsentBannerConfig): void {
    if (this.consentBanner) {
      return; // Already showing
    }

    const bannerConfig = this.getDefaultBannerConfig(config);
    this.consentBanner = this.createConsentBanner(bannerConfig);
    document.body.appendChild(this.consentBanner);

    // Auto-hide if configured
    if (bannerConfig.autoHide && bannerConfig.autoHideDelay) {
      this.clearAutoHideTimeout();
      this.autoHideTimeoutId = setTimeout(() => {
        this.hideConsentBanner();
      }, bannerConfig.autoHideDelay);
    }
  }

  /**
   * Hide consent banner
   */
  hideConsentBanner(): void {
    this.clearAutoHideTimeout();

    if (this.consentBanner && this.consentBanner.parentNode) {
      this.consentBanner.parentNode.removeChild(this.consentBanner);
      this.consentBanner = null;
    }
  }

  /**
   * Destroy consent manager resources
   */
  destroy(): void {
    this.hideConsentBanner();
    this.clearValidationInterval();
    this.listeners = [];
    this.isInitialized = false;
  }

  /**
   * Load consent from storage
   */
  private loadConsent(): ConsentState {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const consent = JSON.parse(stored) as ConsentState;

        // Check if consent version matches
        if (consent.version === this.config.consentVersion) {
          return consent;
        }
      }
    } catch (error) {
      console.warn('Failed to load consent from storage:', error);
    }

    // Return default consent
    return {
      analytics: this.config.defaultConsent.analytics || false,
      advertising: this.config.defaultConsent.advertising || false,
      functional: this.config.defaultConsent.functional || false,
      personalization: this.config.defaultConsent.personalization || false,
      timestamp: Date.now(),
      region: this.config.region,
      version: this.config.consentVersion || this.CONSENT_VERSION,
    };
  }

  /**
   * Save consent to storage
   */
  private saveConsent(consent: ConsentState): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(consent));
    } catch (error) {
      console.warn('Failed to save consent to storage:', error);
    }
  }

  /**
   * Check if consent banner should be shown
   */
  private shouldShowConsentBanner(): boolean {
    if (!this.config.showConsentBanner) {
      return false;
    }

    if (!this.config.requireExplicitConsent) {
      return false;
    }

    // Check if user has already given consent
    const hasConsent = this.hasAnyConsent(this.currentConsent);
    if (hasConsent) {
      return false;
    }

    return true;
  }

  /**
   * Check if any consent is given
   */
  private hasAnyConsent(consent: ConsentState): boolean {
    return (
      consent.analytics || consent.advertising || consent.functional || consent.personalization
    );
  }

  /**
   * Get default banner configuration
   */
  private getDefaultBannerConfig(override?: ConsentBannerConfig): ConsentBannerConfig {
    return {
      title: 'Privacy & Cookie Consent',
      description:
        'We use cookies and similar technologies to help personalize content, tailor and measure ads, and provide a better experience. By clicking accept, you agree to this, as outlined in our Cookie Policy.',
      acceptAllText: 'Accept All',
      rejectAllText: 'Reject All',
      customizeText: 'Customize',
      privacyPolicyText: 'Privacy Policy',
      categories: this.getDefaultCategories(),
      position: 'bottom',
      theme: 'auto',
      showCloseButton: false,
      autoHide: false,
      ...override,
    };
  }

  /**
   * Get default consent categories
   */
  private getDefaultCategories(): ConsentCategory[] {
    return [
      {
        id: 'analytics',
        name: 'Analytics',
        description: 'Help us understand how our website is being used so we can improve it.',
        required: false,
        enabled: false,
        cookies: ['_ga', '_gid', '_gat'],
        scripts: ['google-analytics', 'plausible'],
      },
      {
        id: 'advertising',
        name: 'Advertising',
        description: 'Used to deliver ads that are relevant to you and your interests.',
        required: false,
        enabled: false,
        cookies: ['_gcl_au', 'fr', 'IDE', 'test_cookie'],
        scripts: ['google-ads', 'doubleclick'],
      },
      {
        id: 'functional',
        name: 'Functional',
        description: 'Enable enhanced functionality and personalization.',
        required: false,
        enabled: false,
        cookies: ['session_id', 'preferences'],
        scripts: ['personalization'],
      },
      {
        id: 'personalization',
        name: 'Personalization',
        description: 'Allow us to personalize content and ads based on your interests.',
        required: false,
        enabled: false,
        cookies: ['personalization_id'],
        scripts: ['recommendations'],
      },
    ];
  }

  /**
   * Create consent banner element
   *
   * Uses DOM API exclusively to prevent XSS — no innerHTML with user-supplied data.
   */
  private createConsentBanner(config: ConsentBannerConfig): HTMLElement {
    const banner = document.createElement('div');
    banner.className = `consent-banner consent-banner--${config.position} consent-banner--${config.theme}`;

    const content = document.createElement('div');
    content.className = 'consent-banner__content';

    const titleEl = document.createElement('h3');
    titleEl.className = 'consent-banner__title';
    titleEl.textContent = config.title;
    content.appendChild(titleEl);

    const descEl = document.createElement('p');
    descEl.className = 'consent-banner__description';
    descEl.textContent = config.description;
    content.appendChild(descEl);

    // Categories
    const categoriesDiv = document.createElement('div');
    categoriesDiv.className = 'consent-banner__categories';

    config.categories.forEach((category) => {
      const categoryDiv = document.createElement('div');
      categoryDiv.className = 'consent-category';

      const label = document.createElement('label');
      label.className = 'consent-category__label';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `consent-${category.id}`;
      checkbox.setAttribute('data-category', category.id);
      if (category.required) {
        checkbox.disabled = true;
        checkbox.checked = true;
      } else if (category.enabled) {
        checkbox.checked = true;
      }

      const nameSpan = document.createElement('span');
      nameSpan.className = 'consent-category__name';
      nameSpan.textContent = category.name;

      label.appendChild(checkbox);
      label.appendChild(nameSpan);

      if (category.required) {
        const requiredSpan = document.createElement('span');
        requiredSpan.className = 'consent-category__required';
        requiredSpan.textContent = '(Required)';
        label.appendChild(requiredSpan);
      }

      const categoryDesc = document.createElement('p');
      categoryDesc.className = 'consent-category__description';
      categoryDesc.textContent = category.description;

      categoryDiv.appendChild(label);
      categoryDiv.appendChild(categoryDesc);
      categoriesDiv.appendChild(categoryDiv);
    });

    content.appendChild(categoriesDiv);

    // Actions
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'consent-banner__actions';

    const rejectBtn = document.createElement('button');
    rejectBtn.className = 'consent-banner__button consent-banner__button--secondary';
    rejectBtn.setAttribute('data-action', 'reject');
    rejectBtn.textContent = config.rejectAllText;
    actionsDiv.appendChild(rejectBtn);

    const customizeBtn = document.createElement('button');
    customizeBtn.className = 'consent-banner__button consent-banner__button--secondary';
    customizeBtn.setAttribute('data-action', 'customize');
    customizeBtn.textContent = config.customizeText;
    actionsDiv.appendChild(customizeBtn);

    const acceptBtn = document.createElement('button');
    acceptBtn.className = 'consent-banner__button consent-banner__button--primary';
    acceptBtn.setAttribute('data-action', 'accept');
    acceptBtn.textContent = config.acceptAllText;
    actionsDiv.appendChild(acceptBtn);

    if (config.privacyPolicyUrl) {
      // Validate URL protocol to prevent javascript: XSS via href
      let safeHref = '#';
      try {
        const parsed = new URL(config.privacyPolicyUrl);
        if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
          safeHref = config.privacyPolicyUrl;
        }
      } catch {
        // Invalid URL — leave href as safe '#'
      }
      const link = document.createElement('a');
      link.href = safeHref;
      link.className = 'consent-banner__link';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = config.privacyPolicyText;
      actionsDiv.appendChild(link);
    }

    content.appendChild(actionsDiv);

    if (config.showCloseButton) {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'consent-banner__close';
      closeBtn.setAttribute('data-action', 'close');
      closeBtn.textContent = '\u00d7';
      content.appendChild(closeBtn);
    }

    banner.appendChild(content);

    // Add event listeners
    this.attachBannerEventListeners(banner, config);

    return banner;
  }

  /**
   * Attach event listeners to banner
   */
  private attachBannerEventListeners(banner: HTMLElement, config: ConsentBannerConfig): void {
    banner.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const action = target.getAttribute('data-action');

      switch (action) {
        case 'accept':
          this.handleAcceptAll();
          break;
        case 'reject':
          this.handleRejectAll();
          break;
        case 'customize':
          this.handleCustomize();
          break;
        case 'close':
          this.hideConsentBanner();
          break;
      }
    });

    // Handle category checkboxes
    banner.addEventListener('change', (event) => {
      const target = event.target as HTMLInputElement;
      const category = target.getAttribute('data-category');
      const categoryConfig = category
        ? config.categories.find((configuredCategory) => configuredCategory.id === category)
        : undefined;

      if (categoryConfig && !categoryConfig.required) {
        categoryConfig.enabled = target.checked;
      }
    });
  }

  /**
   * Handle accept all action
   */
  private handleAcceptAll(): void {
    this.grantAllConsent();
  }

  /**
   * Handle reject all action
   */
  private handleRejectAll(): void {
    this.denyAllConsent();
  }

  /**
   * Handle customize action
   */
  private handleCustomize(): void {
    // Toggle category visibility
    const categories = this.consentBanner?.querySelector('.consent-banner__categories');
    if (categories) {
      categories.classList.toggle('consent-banner__categories--visible');
    }
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(event: ConsentEvent): void {
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in consent listener:', error);
      }
    });
  }

  /**
   * Setup consent validation
   */
  private setupConsentValidation(): void {
    if (this.validationIntervalId) {
      return;
    }

    // Validate consent periodically
    this.validationIntervalId = setInterval(
      () => {
        this.validateConsent();
      },
      24 * 60 * 60 * 1000
    ); // Daily
  }

  private clearValidationInterval(): void {
    if (this.validationIntervalId) {
      clearInterval(this.validationIntervalId);
      this.validationIntervalId = null;
    }
  }

  private clearAutoHideTimeout(): void {
    if (this.autoHideTimeoutId) {
      clearTimeout(this.autoHideTimeoutId);
      this.autoHideTimeoutId = null;
    }
  }

  /**
   * Validate current consent
   */
  private validateConsent(): void {
    // Check if consent version is still valid
    if (this.currentConsent.version !== this.config.consentVersion) {
      // Show banner again for new version
      this.showConsentBanner();
    }

    // Check if consent has expired
    const age = Date.now() - this.currentConsent.timestamp;
    const maxAge = (this.config.cookieExpiryDays || 365) * 24 * 60 * 60 * 1000;

    if (age > maxAge) {
      // Consent expired, show banner again
      this.showConsentBanner();
    }
  }

  /**
   * Handle regional requirements
   */
  private handleRegionalRequirements(): void {
    switch (this.config.region) {
      case 'EU':
      case 'UK':
        // Strict consent required
        this.config.requireExplicitConsent = true;
        break;
      case 'CA':
        // CCPA requirements
        this.config.requireExplicitConsent = false;
        break;
      case 'US':
        // Less strict, but still show banner
        this.config.requireExplicitConsent = false;
        break;
    }
  }

  /**
   * Clear tracking data
   */
  private clearTrackingData(): void {
    // Clear analytics cookies
    const analyticsCookies = ['_ga', '_gid', '_gat', '_gcl_au', 'fr', 'IDE'];
    analyticsCookies.forEach((cookie) => {
      document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
    });

    // Clear localStorage data
    const keysToRemove = ['analytics_consent', 'user_preferences'];
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });

    // Trigger data deletion event for analytics providers
    window.dispatchEvent(
      new CustomEvent('consent:withdrawn', {
        detail: { timestamp: Date.now() },
      })
    );
  }
}
