import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './locales/en/translation.json';
import translationZH from './locales/zh/translation.json';

import LeafletEN from './locales/en/Leaflet.json';
import LeafletZH from './locales/zh/Leaflet.json';

let EN = { ...translationEN, ...LeafletEN };
let ZH = { ...translationZH, ...LeafletZH };

const resources = {
  en: {
    translation: EN,
  },
  zh: {
    translation: ZH,
  },
};

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: 'en',
  lng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
