export interface Service {
  title: string;
  slug: string;
  description: string;
  body: string;
  featured?: boolean;
  order?: number;
}

export interface Industry {
  title: string;
  slug: string;
  description: string;
  body: string;
  featured?: boolean;
  order?: number;
}

export interface Demo {
  title: string;
  slug: string;
  description: string;
  body: string;
  liveUrl?: string;
  repoUrl?: string;
  thumbnail?: string;
  featured?: boolean;
  order?: number;
}

export interface FAQ {
  question: string;
  slug: string;
  answer: string;
  category?: string;
  order?: number;
}

export interface Page {
  title: string;
  slug: string;
  description?: string;
  body: string;
  metaTitle?: string;
  metaDescription?: string;
}

export type ContentItem = Service | Industry | Demo | FAQ | Page;

export interface ContentData<T = ContentItem> {
  data: T;
  content: string;
}
