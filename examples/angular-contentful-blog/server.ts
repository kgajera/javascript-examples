import 'zone.js/dist/zone-node';

// tslint:disable-next-line: ordered-imports
import { APP_BASE_HREF } from '@angular/common';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { ContentfulClientApi, EntryCollection, createClient } from 'contentful';
import * as express from 'express';
import { Request, Response } from 'express';
import { existsSync } from 'fs';
import { join } from 'path';
import { EnumChangefreq, SitemapItem, SitemapStream } from 'sitemap';
import { createGzip } from 'zlib';

import { environment } from './src/environments/environment';
import { AppServerModule } from './src/main.server';

const contentfulClientApi: ContentfulClientApi = createClient({
  space: environment.contentful.space,
  accessToken: environment.contentful.accessToken,
});

// The Express app is exported so that it can be used by serverless Functions.
export function app() {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/angular-contentful-blog/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Sitemap
  server.get('/sitemap.xml', sitemap);

  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

  return server;
}

function run() {
  const port = process.env.PORT || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

async function sitemap(req: Request, res: Response) {
  res.header('Content-Type', 'application/xml');
  res.header('Content-Encoding', 'gzip');

  try {
    const sitemapStream = new SitemapStream({
      // This is required because we will be adding sitemap entries using relative URLs
      hostname: environment.hostUrl
    });
    const pipeline = sitemapStream.pipe(createGzip());

    // Fetch blog posts from Contentful
    const blogPostCollection: EntryCollection<{
      slug: string;
    }> = await contentfulClientApi.getEntries({
      content_type: 'blogPost',
      limit: 1000,
    });

    for (const entry of blogPostCollection.items) {
      /**
       * For each blog post, add a new sitemap item. The Angular app contains
       * a route that uses the blog post's slug as a route parameter. So the
       * 'url' value will be the slug and is a relative URL that matches our
       * Angular route.
       */
      sitemapStream.write({
        changefreq: EnumChangefreq.MONTHLY,
        lastmod: entry.sys.updatedAt,
        priority: .7,
        url: entry.fields.slug,
      } as SitemapItem);
    }

    // Add any other sitemap items for other pages of your site
    sitemapStream.write({
      changefreq: EnumChangefreq.DAILY,
      priority: 1,
      url: '',
    } as SitemapItem);

    // Stream write the response
    sitemapStream.end();
    pipeline.pipe(res).on('error', (error: Error) => {
      throw error;
    });
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
