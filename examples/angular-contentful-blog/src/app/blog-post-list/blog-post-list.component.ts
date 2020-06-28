import { Component, OnInit } from '@angular/core';
import { Entry } from 'contentful';

import { BlogPost } from '../contentful/blog-post';
import { ContentfulApiService } from '../contentful/contentful-api.service';

@Component({
  selector: 'app-blog-post-list',
  template: `
    <h1>Blog Posts</h1>
    <article *ngFor="let blogPost of blogPosts">
      <h2>
        <a [routerLink]="blogPost.fields.slug">{{ blogPost.fields.title }}</a>
      </h2>
      <p>{{ blogPost.fields.excerpt }}</p>
    </article>
  `,
  styleUrls: ['./blog-post-list.component.scss'],
})
export class BlogPostListComponent implements OnInit {
  blogPosts: Array<Entry<BlogPost>>;

  constructor(private contentfulApiService: ContentfulApiService) {}

  ngOnInit(): void {
    this.contentfulApiService
      .getBlogPosts()
      .then((blogPosts) => (this.blogPosts = blogPosts.items));
  }
}
