import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from './app/App';
import { AuthProvider } from './features/auth/AuthProvider';
import { SyncProvider } from './features/sync/SyncProvider';
import { ToastProvider } from './components/ui/Toast';
import './styles/index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SyncProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </SyncProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HashRouter>
  </React.StrictMode>
);
