import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // قراءة الثيم من localStorage أو استخدام الافتراضي
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    // تطبيق الثيم على body و documentElement
    const root = document.documentElement;
    const body = document.body;

    // إزالة أي حالة داكنة سابقة
    root.classList.remove('dark');
    body.classList.remove('dark');

    if (theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
    }

    // حفظ الثيم في localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};