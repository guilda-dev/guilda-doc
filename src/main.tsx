import React from 'react';
import ReactDOM from 'react-dom/client';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import App from './App';
import './constants.css';
import './index.css';
import langEn from '@/assets/lang/en.json';

i18n
  .use(initReactI18next) 
  .init({
    resources: {
      en: { translation: langEn }
    },
    lng: 'en',
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false
    }
  });

ReactDOM.createRoot(document.body as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
