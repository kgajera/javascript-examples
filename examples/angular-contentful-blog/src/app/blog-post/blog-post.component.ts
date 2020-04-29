import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Entry } from 'contentful';

import { BlogPost } from '../contentful/blog-post';
import { ContentfulApiService } from '../contentful/contentful-api.service';

@Component({
  selector: 'app-blog-post',
  template: `
    <ng-container *ngIf="blogPost; else loading">
      <h1>{{ blogPost.fields.title }}</h1>
      <img
        [src]="blogPost.fields.featuredImage.fields.file.url"
        [alt]="blogPost.fields.featuredImage.fields.title"
      />
      <ngx-contentful-rich-text [document]="blogPost.fields.content">
      </ngx-contentful-rich-text>
    </ng-container>
    <ng-template #loading>Loading...</ng-template>
  `,
  styleUrls: ['./blog-post.component.scss'],
})
export class BlogPostComponent implements OnInit {
  blogPost: Entry<BlogPost>;

  constructor(
    private route: ActivatedRoute,
    private meta: Meta,
    private title: Title,
    private contentfulApiService: ContentfulApiService
  ) {}

  ngOnInit(): void {
    const slug: string = this.route.snapshot.paramMap.get('slug');

    this.contentfulApiService.getBlogPost(slug).then((blogPost) => {
      this.blogPost = blogPost;

      // Set the document title
      this.title.setTitle(blogPost.fields.title);

      // Add meta tags for SEO
      this.meta.addTags([
        {
          name: 'description',
          content: blogPost.fields.excerpt,
        },
        {
          name: 'keywords',
          content: blogPost.fields.keywords.join(','),
        },
        {
          name: 'og:image',
          content: blogPost.fields.featuredImage.fields.file.url,
        },
      ]);
    });
  }
}
