import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { AppServerModule } from './src/main.server';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
    const server = express();
    const serverDistFolder = dirname(fileURLToPath(import.meta.url));
    const browserDistFolder = resolve(serverDistFolder, '../browser');
    const indexHtml = join(serverDistFolder, 'index.server.html');

    const commonEngine = new CommonEngine();

    server.set('view engine', 'html');
    server.set('views', browserDistFolder);

    // Example Express Rest API endpoints
    // server.get('/api/**', (req, res) => { });
    // Serve static files from /browser
    server.get('**', express.static(browserDistFolder, {
        maxAge: '1y',
        index: 'index.html',
    }));

    // Short-circuit requests for ACME/.well-known and similar asset-specific endpoints
    // so they don't get sent to the Angular router (which will try to match them and error).
    server.get('/.well-known/*', (req, res) => {
        // If you actually need to serve files from .well-known, replace this with a proper
        // static file serving or a sendFile call pointing to the correct path.
        res.status(404).send('Not found');
    });

    // All regular routes use the Angular engine
    server.get('**', (req, res, next) => {
        const { protocol, originalUrl, baseUrl, headers } = req;

        commonEngine
            .render({
                bootstrap: AppServerModule,
                documentFilePath: indexHtml,
                url: `${protocol}://${headers.host}${originalUrl}`,
                publicPath: browserDistFolder,
                providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
            })
            .then((html) => res.send(html))
            .catch((err) => next(err));
    });

    return server;
}

function run(): void {
    const portEnv = process.env['PORT'] || '4000';
    const port = parseInt(portEnv, 10);

    // Start up the Node server
    const server = app();
    // Bind to 0.0.0.0 so the container can accept external connections (Railway, Docker).
    server.listen(port, '0.0.0.0', () => {
        console.log(`Node Express server listening on http://localhost:${port}`);
    });
}

// Only run the server when this file is executed directly. This avoids starting the
// server multiple times when the module is imported by other tooling or by a process
// manager which may import the module for inspection.
// In ESM, `process.argv[1]` equals the executed file path.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    run();
}
