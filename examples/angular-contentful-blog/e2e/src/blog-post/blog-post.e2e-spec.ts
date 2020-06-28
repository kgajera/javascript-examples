import { BlogPost } from '../../../src/app/contentful/blog-post';
import { UniversalPage } from '../universal.po';

const POST_SLUGS = [
  'post-1',
  'post-2',
];

for (const slug of POST_SLUGS) {
  describe(`blog post: ${slug}`, () => {
    let page: UniversalPage;
    let blogPost: BlogPost;

    beforeAll(async () => {
      // Initialize the page object and navigate to it
      page = new UniversalPage(slug);
      await page.navigate();

      // Get the blog post data returned by Contentful's API from the transfer state store.
      // This is the expected data/model to be used in the page's DOM.
      blogPost = page.getTransferStateStoreValue(`slug=${slug}`)?.body.items[0].fields;

      // Take screenshot
      await page.saveScreenshot(slug);
    });

    it('should have blog post data in transfer state store', () => {
      expect(blogPost).toBeDefined();
    });

    it('should have set document title', () => {
      expect(page.getDocumentTitle()).toBe(blogPost.title);
    });

    it('should have h1 text', () => {
      expect(page.getHeading1Text()).toBe(blogPost.title);
    });

    it('should have SEO meta tags', () => {
      expect(page.getMetaContent('description')).toBe(blogPost.excerpt);
      expect(page.getMetaContent('keywords')).toBe(blogPost.keywords.join(','));
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
}
