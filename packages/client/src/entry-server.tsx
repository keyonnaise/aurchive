import { Transform } from 'stream';
import { QueryClient, QueryClientProvider, dehydrate } from '@tanstack/react-query';
import { Request, Response } from 'express';
import { isbot } from 'isbot';
import { renderToPipeableStream } from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { StaticRouter } from 'react-router-dom/server';
import App from '~app';

export async function renderer(req: Request, res: Response) {
  const helmetContext: Record<string, any> = {};
  const queryClient = new QueryClient();

  let isError = false;

  const stream = renderToPipeableStream(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={req.url}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </StaticRouter>
    </HelmetProvider>,
    {
      bootstrapModules: ['/index.js'],

      onShellReady() {
        if (!isbot(req.get('user-agent'))) {
          res.statusCode = isError ? 500 : 200;

          res.setHeader('content-type', 'text/html');
          stream.pipe(transformContent(helmetContext, queryClient)).pipe(res);
        }
      },

      onShellError() {
        res.statusCode = 500;

        res.setHeader('content-type', 'text/html');
        res.send('<h1>Something went wrong</h1>');
      },

      onAllReady() {
        if (isbot(req.get('user-agent'))) {
          res.statusCode = isError ? 500 : 200;

          res.setHeader('content-type', 'text/html');
          stream.pipe(transformContent(helmetContext, queryClient)).pipe(res);
        }
      },

      onError(error) {
        isError = true;

        console.error(error);
      },
    },
  );
}

function transformContent(helmetContext: Record<string, any>, queryClient: QueryClient) {
  let content = '';

  const transform = new Transform({
    transform(chunk, _, callback) {
      content += chunk;

      callback();
    },

    flush(callback) {
      const dehydrated = JSON.stringify(dehydrate(queryClient));
      const helmet = helmetContext.helmet;

      const data = `<!DOCTYPE html><html ${helmet.htmlAttributes.toString()}><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><link rel="icon" type="image/png" href="/favicon.ico" /><link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" /><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" /><link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}${helmet.priority.toString()}${helmet.script.toString()}</head><body><div id="root">${content}</div><script>window.__REACT_QUERY_STATE__=${dehydrated};</script></body></html>`;

      callback(null, data);

      queryClient.clear();
    },
  });

  return transform;
}
