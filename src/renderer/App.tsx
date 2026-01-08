import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppContextProvider } from './app/AppContextProvider';

const App = () => (
  <AppContextProvider />
);

const appElement = document.getElementById('app');

if (appElement === null) {
  throw new Error("Element with ID 'app' not found in the DOM.");
}

const root = createRoot(appElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
