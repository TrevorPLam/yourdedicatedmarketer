/**
 * Mock Data Generators
 *
 * Centralized mock data generation for consistent testing across the monorepo.
 * Uses faker.js for realistic test data generation.
 */

import { faker } from '@faker-js/faker';

// User-related mock data
export function createMockUser(overrides?: Partial<MockUser>): MockUser {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    avatar: faker.image.avatar(),
    role: faker.helpers.arrayElement(['user', 'admin', 'developer', 'designer']),
    status: faker.helpers.arrayElement(['active', 'inactive', 'pending']),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    lastLoginAt: faker.helpers.arrayElement([faker.date.recent(), null]),
    ...overrides,
  };
}

export function createMockUsers(count: number, overrides?: Partial<MockUser>): MockUser[] {
  return Array.from({ length: count }, () => createMockUser(overrides));
}

// Client-related mock data
export function createMockClient(overrides?: Partial<MockClient>): MockClient {
  const name = faker.company.name();
  return {
    id: faker.string.uuid(),
    name,
    slug: faker.helpers.slugify(name).toLowerCase(),
    domain: faker.internet.url(),
    status: faker.helpers.arrayElement(['active', 'inactive', 'pending', 'archived']),
    framework: faker.helpers.arrayElement(['astro', 'nextjs', 'hybrid']),
    database: faker.helpers.arrayElement(['supabase', 'neon', 'postgres']),
    theme: faker.helpers.arrayElement(['default', 'dark', 'custom']),
    plan: faker.helpers.arrayElement(['starter', 'professional', 'enterprise']),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    contactEmail: faker.internet.email(),
    contactPhone: faker.phone.number(),
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
      country: faker.location.country(),
    },
    ...overrides,
  };
}

export function createMockClients(count: number, overrides?: Partial<MockClient>): MockClient[] {
  return Array.from({ length: count }, () => createMockClient(overrides));
}

// Project-related mock data
export function createMockProject(overrides?: Partial<MockProject>): MockProject {
  return {
    id: faker.string.uuid(),
    name: faker.lorem.words(3),
    description: faker.lorem.paragraph(),
    status: faker.helpers.arrayElement(['planning', 'active', 'on-hold', 'completed', 'cancelled']),
    clientId: faker.string.uuid(),
    clientName: faker.company.name(),
    startDate: faker.date.past(),
    endDate: faker.date.future(),
    estimatedHours: faker.number.int({ min: 40, max: 1000 }),
    actualHours: faker.number.int({ min: 0, max: 1000 }),
    budget: faker.number.int({ min: 1000, max: 100000 }),
    actualCost: faker.number.int({ min: 0, max: 100000 }),
    priority: faker.helpers.arrayElement(['low', 'medium', 'high', 'critical']),
    managerId: faker.string.uuid(),
    team: createMockUsers(faker.number.int({ min: 2, max: 8 })),
    technologies: faker.helpers.arrayElements(
      [
        'React',
        'Next.js',
        'Astro',
        'TypeScript',
        'Tailwind CSS',
        'Supabase',
        'PostgreSQL',
        'Node.js',
        'Vite',
        'Storybook',
      ],
      { min: 2, max: 5 }
    ),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...overrides,
  };
}

export function createMockProjects(count: number, overrides?: Partial<MockProject>): MockProject[] {
  return Array.from({ length: count }, () => createMockProject(overrides));
}

// Task-related mock data
export function createMockTask(overrides?: Partial<MockTask>): MockTask {
  return {
    id: faker.string.uuid(),
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    status: faker.helpers.arrayElement(['todo', 'in-progress', 'review', 'done']),
    priority: faker.helpers.arrayElement(['low', 'medium', 'high', 'critical']),
    projectId: faker.string.uuid(),
    assigneeId: faker.helpers.arrayElement([faker.string.uuid(), null]),
    estimatedHours: faker.number.int({ min: 1, max: 40 }),
    actualHours: faker.number.int({ min: 0, max: 40 }),
    dueDate: faker.helpers.arrayElement([faker.date.future(), null]),
    completedAt: faker.helpers.arrayElement([faker.date.recent(), null]),
    tags: faker.helpers.arrayElements(
      ['bug', 'feature', 'enhancement', 'documentation', 'testing'],
      { min: 1, max: 3 }
    ),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...overrides,
  };
}

export function createMockTasks(count: number, overrides?: Partial<MockTask>): MockTask[] {
  return Array.from({ length: count }, () => createMockTask(overrides));
}

// Analytics mock data
export function createMockAnalytics(overrides?: Partial<MockAnalytics>): MockAnalytics {
  return {
    date: faker.date.recent(),
    pageViews: faker.number.int({ min: 100, max: 10000 }),
    uniqueVisitors: faker.number.int({ min: 50, max: 5000 }),
    bounceRate: faker.number.float({ min: 0.2, max: 0.8, fractionDigits: 2 }),
    avgSessionDuration: faker.number.int({ min: 30, max: 600 }),
    conversionRate: faker.number.float({ min: 0.01, max: 0.1, fractionDigits: 3 }),
    topPages: Array.from({ length: 5 }, () => ({
      path: faker.internet.url(),
      views: faker.number.int({ min: 10, max: 1000 }),
      uniqueViews: faker.number.int({ min: 5, max: 500 }),
    })),
    devices: {
      desktop: faker.number.int({ min: 30, max: 70 }),
      mobile: faker.number.int({ min: 20, max: 60 }),
      tablet: faker.number.int({ min: 5, max: 20 }),
    },
    sources: {
      organic: faker.number.int({ min: 20, max: 50 }),
      direct: faker.number.int({ min: 10, max: 30 }),
      social: faker.number.int({ min: 5, max: 25 }),
      referral: faker.number.int({ min: 5, max: 20 }),
    },
    ...overrides,
  };
}

// Content mock data
export function createMockBlogPost(overrides?: Partial<MockBlogPost>): MockBlogPost {
  const title = faker.lorem.sentence();
  return {
    id: faker.string.uuid(),
    title,
    slug: faker.helpers.slugify(title).toLowerCase(),
    excerpt: faker.lorem.paragraph(),
    content: faker.lorem.paragraphs(5),
    status: faker.helpers.arrayElement(['draft', 'review', 'published', 'archived']),
    publishedAt: faker.helpers.arrayElement([faker.date.recent(), null]),
    authorId: faker.string.uuid(),
    authorName: faker.person.fullName(),
    categoryId: faker.string.uuid(),
    categoryName: faker.lorem.words(2),
    tags: faker.helpers.arrayElements(
      ['marketing', 'design', 'development', 'business', 'technology'],
      { min: 2, max: 4 }
    ),
    featuredImage: faker.image.url(),
    readingTime: faker.number.int({ min: 3, max: 15 }),
    views: faker.number.int({ min: 0, max: 10000 }),
    likes: faker.number.int({ min: 0, max: 1000 }),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...overrides,
  };
}

export function createMockBlogPosts(
  count: number,
  overrides?: Partial<MockBlogPost>
): MockBlogPost[] {
  return Array.from({ length: count }, () => createMockBlogPost(overrides));
}

// Form mock data
export function createMockFormData(fields: Record<string, 'string' | 'number' | 'email' | 'date'>) {
  const data: Record<string, any> = {};

  for (const [field, type] of Object.entries(fields)) {
    switch (type) {
      case 'string':
        data[field] = faker.lorem.words(3);
        break;
      case 'number':
        data[field] = faker.number.int({ min: 1, max: 100 });
        break;
      case 'email':
        data[field] = faker.internet.email();
        break;
      case 'date':
        data[field] = faker.date.recent().toISOString().split('T')[0];
        break;
    }
  }

  return data;
}

// API response mock data
export function createMockApiResponse<T>(
  data: T,
  overrides?: Partial<MockApiResponse<T>>
): MockApiResponse<T> {
  return {
    success: true,
    data,
    message: faker.helpers.arrayElement(['Success', 'Operation completed', 'Request processed']),
    timestamp: faker.date.recent().toISOString(),
    requestId: faker.string.uuid(),
    ...overrides,
  };
}

export function createMockErrorResponse(overrides?: Partial<MockErrorResponse>): MockErrorResponse {
  return {
    success: false,
    error: {
      code: faker.helpers.arrayElement([
        'VALIDATION_ERROR',
        'NOT_FOUND',
        'UNAUTHORIZED',
        'SERVER_ERROR',
      ]),
      message: faker.lorem.sentence(),
      details: faker.helpers.arrayElement([faker.lorem.paragraph(), null]),
    },
    timestamp: faker.date.recent().toISOString(),
    requestId: faker.string.uuid(),
    ...overrides,
  };
}

// Type definitions
interface MockUser {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  avatar: string;
  role: 'user' | 'admin' | 'developer' | 'designer';
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
}

interface MockClient {
  id: string;
  name: string;
  slug: string;
  domain: string;
  status: 'active' | 'inactive' | 'pending' | 'archived';
  framework: 'astro' | 'nextjs' | 'hybrid';
  database: 'supabase' | 'neon' | 'postgres';
  theme: string;
  plan: 'starter' | 'professional' | 'enterprise';
  createdAt: Date;
  updatedAt: Date;
  contactEmail: string;
  contactPhone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface MockProject {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  clientId: string;
  clientName: string;
  startDate: Date;
  endDate: Date;
  estimatedHours: number;
  actualHours: number;
  budget: number;
  actualCost: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  managerId: string;
  team: MockUser[];
  technologies: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface MockTask {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  projectId: string;
  assigneeId: string | null;
  estimatedHours: number;
  actualHours: number;
  dueDate: Date | null;
  completedAt: Date | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface MockAnalytics {
  date: Date;
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: number;
  conversionRate: number;
  topPages: Array<{
    path: string;
    views: number;
    uniqueViews: number;
  }>;
  devices: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  sources: {
    organic: number;
    direct: number;
    social: number;
    referral: number;
  };
}

interface MockBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: 'draft' | 'review' | 'published' | 'archived';
  publishedAt: Date | null;
  authorId: string;
  authorName: string;
  categoryId: string;
  categoryName: string;
  tags: string[];
  featuredImage: string;
  readingTime: number;
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

interface MockApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
  requestId: string;
}

interface MockErrorResponse {
  success: boolean;
  error: {
    code: string;
    message: string;
    details: string | null;
  };
  timestamp: string;
  requestId: string;
}
