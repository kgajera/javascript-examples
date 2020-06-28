import { Entry } from 'contentful';

import { BlogPost } from '../../../src/app/contentful/blog-post';
import { BlogPostListPage } from './blog-post-list.po';

describe('blog post list', () => {
  let page: BlogPostListPage;
  let blogPosts: Entry<BlogPost>[];

  beforeAll(async () => {
    page = new BlogPostListPage('/');
    await page.navigate();

    // Get the blog posts data returned by Contentful's API from the transfer state store.
    // This is the expected data/model to be used in the page's DOM.
    blogPosts = page.getTransferStateStoreValue('content_type=blogPost')?.body.items;

    await page.saveScreenshot('index');
  });

  it('should have blog posts data in transfer state store', () => {
    expect(blogPosts).toBeDefined();
  });

  it('should have title', () => {
    expect(page.getHeading1Text()).toBe('Blog Posts');
  });

  it('should list blog posts', async () => {
    const blogPostElements = await page.getBlogPostListItems();
    expect(blogPostElements.length).toBe(blogPosts.length);
  });

  it('should contain link to each blog post', () => {
    for (const blogPost of blogPosts) {
      expect(page.getBlogPostLink(blogPost.fields.slug)).toBeDefined();
    }
  });

  it('should have no accessibility violations', async () => {
    const results = await page.analyzeAccessibility();
    expect(results.violations.length).toBe(0);
  });

  it('should have no errors in browser logs', async () => {
    const entries = await page.getLogEntries();
    expect(entries.length).toBe(0);
  });

});
