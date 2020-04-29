import { Injectable } from '@angular/core';
import {
  ContentfulClientApi,
  Entry,
  EntryCollection,
  createClient,
} from 'contentful';

import { environment } from '../../environments/environment';
import { BlogPost } from './blog-post';
import { HttpClientAxiosAdapterService } from './http-client-axios-adapter.service';

@Injectable({
  providedIn: 'root',
})
export class ContentfulApiService {
  private clientApi: ContentfulClientApi;

  constructor(
    private httpClientAxiosAdapterService: HttpClientAxiosAdapterService
  ) {
    this.clientApi = createClient({
      space: environment.contentful.space,
      accessToken: environment.contentful.accessToken,
      adapter: httpClientAxiosAdapterService.getAdapter(),
    });
  }

  /**
   * Get a single blog post by its slug
   *
   * @param id The slug for the blog post
   */
  getBlogPost(slug: string): Promise<Entry<BlogPost>> {
    return this.getBlogPosts({
      'fields.slug': slug,
    }).then((response) => response.items[0]);
  }

  /**
   * Get listing of all blog posts
   *
   * @param query Filter object
   */
  getBlogPosts(query?: object): Promise<EntryCollection<BlogPost>> {
    return this.clientApi.getEntries<BlogPost>(
      Object.assign({}, query, { content_type: 'blogPost' })
    );
  }
}
