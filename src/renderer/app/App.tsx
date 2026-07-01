import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppContextProvider } from './AppContextProvider';

const App = () => (
  <AppContextProvider />
);

const appElement = document.getElementById('app');

if (appElement === null) {
  throw new Error("Element with ID 'app' not found in the DOM.");
}

const root = createRoot(appElement, {
  onUncaughtError: (error, errorInfo) => {
    console.error('Uncaught error:', error, errorInfo);
    return <>Something went so badly wrong that it had to be caught at `createRoot`.</>;
  },
});
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

requestAnimationFrame(() => {
  const loader = document.getElementById('loading-root');
  if (loader) {
    loader.classList.add('fade-out');
    setTimeout(() => {
      loader.remove();
    }, 500);
  }
});
