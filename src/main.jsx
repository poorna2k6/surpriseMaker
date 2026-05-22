import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Register PWA service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

const root = document.getElementById('root');
if (!root) {
  document.body.innerHTML = '<div style="color:white;padding:2rem;font-family:sans-serif">ERROR: #root element not found</div>';
} else {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
