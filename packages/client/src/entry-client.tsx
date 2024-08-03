import { StrictMode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import App from '~app';
import { queryClient } from '~hooks/queries/queryClient';

const root = document.getElementById('root')!;
const children = (
  <HelmetProvider>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </HelmetProvider>
);

if (root.childElementCount === 0) {
  createRoot(root).render(<StrictMode>{children}</StrictMode>);

  console.log('ℹ️ 렌더링 방식: Client-Side Rendering');
} else {
  hydrateRoot(root, children);

  console.log('ℹ️ 렌더링 방식: Server-Side Rendering');
}
