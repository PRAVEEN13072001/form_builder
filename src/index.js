import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import ErrorBoundary from './pages/ErrorBoundary'; // Import the ErrorBoundary component

// Create the root only once
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app inside MantineProvider for theme and styling
root.render(
  <ErrorBoundary>
    <MantineProvider>
      <App />
    </MantineProvider>
  </ErrorBoundary>
);

// Performance monitoring
reportWebVitals();
