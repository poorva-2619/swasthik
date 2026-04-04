import React, { createContext, useState, useContext, useEffect } from 'react';
import { getTranslation } from '../i18n';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Try to load saved language from localStorage, default to 'en'
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('swasthik_lang') || 'en';
  });

  // Save to localStorage when language changes
  useEffect(() => {
    localStorage.setItem('swasthik_lang', currentLang);
    // You could also set HTML lang attribute
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  const t = (key) => getTranslation(currentLang, key);

  return (
    <LanguageContext.Provider value={{ currentLang, setCurrentLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
