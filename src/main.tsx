import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Remove the initial loading spinner once React has painted
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    const loader = document.getElementById('initial-loader');
    if (loader) {
      loader.classList.add('hidden');
      loader.addEventListener('transitionend', () => loader.remove(), { once: true });
    }
  });
});
