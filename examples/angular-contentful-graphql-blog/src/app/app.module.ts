import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgxContentfulRichTextModule } from 'ngx-contentful-rich-text';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { BlogPostListComponent } from './blog-post-list/blog-post-list.component';
import { BlogPostComponent } from './blog-post/blog-post.component';

@NgModule({
  declarations: [AppComponent, BlogPostListComponent, BlogPostComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
    NgxContentfulRichTextModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
