import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogPostGQL, BlogPostItemFragment } from '../generated/graphql';

@Component({
  selector: 'app-blog-post',
  template: `
    <ng-container *ngIf="blogPost">
      <h1>{{ blogPost.title }}</h1>
      <img
        *ngIf="blogPost.featuredImage as image"
        [src]="image.url"
        [alt]="image.title"
      />
      <ngx-contentful-rich-text [document]="blogPost.content?.json">
      </ngx-contentful-rich-text>
    </ng-container>
  `,
  styleUrls: ['./blog-post.component.scss'],
})
export class BlogPostComponent implements OnInit {
  blogPost?: BlogPostItemFragment | null;

  constructor(
    private route: ActivatedRoute,
    private blogPostsGQL: BlogPostGQL
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');

    this.blogPostsGQL
      .fetch({
        slug,
      })
      .subscribe(({ data }) => {
        this.blogPost = data.blogPostCollection?.items[0];
      });
  }
}
