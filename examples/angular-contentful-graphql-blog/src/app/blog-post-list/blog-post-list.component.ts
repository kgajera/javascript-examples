import { Component, OnInit } from '@angular/core';

import { BlogPostListItemFragment, BlogPostsGQL } from '../generated/graphql';

@Component({
  selector: 'app-blog-post-list',
  template: `<ng-container *ngFor="let blogPost of blogPosts">
    <article *ngIf="blogPost">
      <h2>
        <a [routerLink]="blogPost.slug">{{ blogPost.title }}</a>
      </h2>
      <p>{{ blogPost.excerpt }}</p>
    </article>
  </ng-container>`,
  styleUrls: ['./blog-post-list.component.scss'],
})
export class BlogPostListComponent implements OnInit {
  blogPosts: (BlogPostListItemFragment | null)[] | undefined;

  constructor(private blogPostsGQL: BlogPostsGQL) {}

  ngOnInit(): void {
    this.blogPostsGQL.fetch().subscribe(({ data }) => {
      this.blogPosts = data.blogPostCollection?.items;
    });
  }
}
