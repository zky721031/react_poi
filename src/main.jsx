// import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.scss';
import { CookiesProvider } from 'react-cookie';
import './i18n.js';

// console.log('url => ', import.meta.env.APP_URL_API);
// console.log('another => ', import.meta.env.APP_ANOTHER_VAR);

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename={'/v4'}>
    <CookiesProvider>
      <App />
    </CookiesProvider>
  </BrowserRouter>
);
