// index.jsx or index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx'; // import App

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
