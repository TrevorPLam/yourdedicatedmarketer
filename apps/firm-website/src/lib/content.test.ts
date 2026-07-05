import { describe, it, expect, vi, beforeEach } from 'vitest';

// Create mock functions using vi.hoisted
const { mockReaddirSync, mockReadFileSync, mockExistsSync } = vi.hoisted(() => ({
  mockReaddirSync: vi.fn(),
  mockReadFileSync: vi.fn(),
  mockExistsSync: vi.fn(),
}));

// Mock fs - default import
vi.mock('fs', () => ({
  default: {
    readdirSync: mockReaddirSync,
    readFileSync: mockReadFileSync,
    existsSync: mockExistsSync,
  },
}));

// Mock path - default import
vi.mock('path', () => ({
  default: {
    join: vi.fn((...args: string[]) => args.join('/')),
  },
}));

import { getAllContent, getAllSlugs, getContentBySlug } from './content';

describe('Content Utilities - Unit Tests with Mocked File System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllSlugs', () => {
    it('should return an array of slugs from directory', async () => {
      mockReaddirSync.mockReturnValue(['test1.mdx', 'test2.mdx', 'not-mdx.txt']);
      
      const slugs = await getAllSlugs('test-dir');
      
      expect(mockReaddirSync).toHaveBeenCalled();
      expect(Array.isArray(slugs)).toBe(true);
      expect(slugs).toEqual(['test1', 'test2']);
    });

    it('should return empty array for non-existent directory', async () => {
      mockReaddirSync.mockImplementation(() => {
        throw new Error('Directory not found');
      });
      
      const slugs = await getAllSlugs('non-existent');
      
      expect(slugs).toEqual([]);
    });

    it('should return empty array for directory with no MDX files', async () => {
      mockReaddirSync.mockReturnValue(['file1.txt', 'file2.json']);
      
      const slugs = await getAllSlugs('test-dir');
      
      expect(slugs).toEqual([]);
    });
  });

  describe('getContentBySlug', () => {
    it('should return content data for a valid slug', async () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue('---\ntitle: Test Title\nslug: test-slug\n---\n\nTest content');
      
      const content = await getContentBySlug<{ title: string; slug: string }>('test-dir-1', 'test-slug-1');
      
      expect(content).not.toBeNull();
      expect(content?.data).toBeDefined();
      expect(content?.data.title).toBe('Test Title');
      expect(content?.data.slug).toBe('test-slug');
      expect(content?.content).toBeDefined();
      expect(typeof content?.content).toBe('string');
    });

    it('should return null for non-existent file', async () => {
      mockExistsSync.mockReturnValue(false);
      
      const content = await getContentBySlug<{ title: string }>('test-dir-2', 'non-existent-2');
      
      expect(content).toBeNull();
    });

    it('should return null on file read error', async () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockImplementation(() => {
        throw new Error('Read error');
      });
      
      const content = await getContentBySlug<{ title: string }>('test-dir-3', 'test-slug-3');
      
      expect(content).toBeNull();
    });
  });

  describe('getAllContent', () => {
    it('should return an array of all content items', async () => {
      mockReaddirSync.mockReturnValue(['test1.mdx', 'test2.mdx']);
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue('---\ntitle: Test\nslug: test\n---\n\nContent');
      
      const contents = await getAllContent<{ title: string; slug: string }>('test-dir-4');
      
      expect(Array.isArray(contents)).toBe(true);
      expect(contents.length).toBe(2);
    });

    it('should return empty array for non-existent directory', async () => {
      mockReaddirSync.mockImplementation(() => {
        throw new Error('Directory not found');
      });
      
      const contents = await getAllContent<{ title: string }>('non-existent-5');
      
      expect(contents).toEqual([]);
    });

    it('should filter out null items', async () => {
      mockReaddirSync.mockReturnValue(['test1.mdx', 'test2.mdx']);
      mockExistsSync.mockReturnValue(false); // File doesn't exist
      
      const contents = await getAllContent<{ title: string }>('test-dir-6');
      
      expect(contents).toEqual([]);
    });

    it('should handle invalid format gracefully', async () => {
      mockReaddirSync.mockReturnValue(['test1.mdx']);
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockImplementation(() => {
        throw new Error('Invalid format');
      });
      
      const contents = await getAllContent<{ title: string }>('test-dir-7');
      
      expect(contents).toEqual([]);
    });
  });
});
