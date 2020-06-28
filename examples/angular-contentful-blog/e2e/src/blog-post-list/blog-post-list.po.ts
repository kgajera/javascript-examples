import { ElementArrayFinder, ElementFinder, by, element } from 'protractor';

import { UniversalPage } from '../universal.po';

export class BlogPostListPage extends UniversalPage {

  getBlogPostListItems(): ElementArrayFinder {
    return element.all(by.tagName('article'));
  }

  getBlogPostLink(slug: string): ElementFinder {
    return element(by.css(`a[href=/${slug}]`));
  }

}
