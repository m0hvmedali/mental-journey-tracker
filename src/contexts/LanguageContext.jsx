import React, { createContext, useContext, useEffect, useState } from 'react';
import arTranslations from '../locales/ar.json';
import enTranslations from '../locales/en.json';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  ar: arTranslations,
  en: enTranslations
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // قراءة اللغة من localStorage أو استخدام العربية كافتراضي
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    // تطبيق اتجاه النص على document
    const root = document.documentElement;
    if (language === 'ar') {
      root.setAttribute('dir', 'rtl');
      root.setAttribute('lang', 'ar');
    } else {
      root.setAttribute('dir', 'ltr');
      root.setAttribute('lang', 'en');
    }
    
    // حفظ اللغة في localStorage
    localStorage.setItem('language', language);
  }, [language]);

  const changeLanguage = (newLanguage) => {
    if (translations[newLanguage]) {
      setLanguage(newLanguage);
    }
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // إرجاع المفتاح إذا لم توجد الترجمة
      }
    }
    
    return value || key;
  };

  const value = {
    language,
    setLanguage,
    changeLanguage,
    t,
    isRTL: language === 'ar',
    availableLanguages: [
      { code: 'ar', name: 'العربية' },
      { code: 'en', name: 'English' }
    ]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

