import express from 'express';
import compression from 'compression';
import morgan from 'morgan';
import { createRequestHandler } from '@remix-run/express';

import * as serverBuild from '@remix-run/dev/server-build';

const app = express();

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by');

// Remix fingerprints its assets so we can cache forever.
app.use('/build', express.static('public/build', { immutable: true, maxAge: '1y' }));

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static('public/build', { maxAge: '1h' }));

app.use(morgan('tiny'));

app.all(
  '*',
  createRequestHandler({
    build: serverBuild,
    mode: process.env.NODE_ENV,
  })
);

const hostPort = process.env.HOST_PORT;
const appPort = process.env.APP_PORT || 3000;

const server = app.listen(appPort, () => {
  console.log(`Express server listening at http://localhost:${hostPort ?? appPort}`);
});

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

function shutdown() {
  console.log('Shutting down server...');
  server?.close((err) => {
    if (err) console.log('Shutdown encountered error ', err);

    process.exit(err ? 1 : 0);
  });
}
