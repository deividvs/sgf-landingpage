import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

console.log('main.tsx: Starting application initialization');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('main.tsx: Root element not found!');
  throw new Error('Root element not found');
}

console.log('main.tsx: Root element found, creating React root');

try {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
  console.log('main.tsx: React root rendered successfully');
} catch (error) {
  console.error('main.tsx: Error rendering app:', error);
  throw error;
}
