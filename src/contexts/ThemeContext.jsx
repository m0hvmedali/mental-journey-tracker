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
 // Theme state can be 'light', 'dark', or 'system'
 const [theme, setThemeState] = useState(() => {
 return localStorage.getItem('theme') || 'system';
 });

 const [resolvedTheme, setResolvedTheme] = useState(() => {
 const saved = localStorage.getItem('theme') || 'system';
 if (saved === 'dark') return 'dark';
 if (saved === 'light') return 'light';
 return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
 });

 useEffect(() => {
 const root = document.documentElement;
 const body = document.body;

 const applyTheme = (isDarkTheme) => {
 if (isDarkTheme) {
 root.classList.add('dark');
 if (body) body.classList.add('dark');
 setResolvedTheme('dark');
 } else {
 root.classList.remove('dark');
 if (body) body.classList.remove('dark');
 setResolvedTheme('light');
 }
 };

 if (theme === 'system') {
 const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
 applyTheme(mediaQuery.matches);

 const handleChange = (e) => {
 applyTheme(e.matches);
 };

 mediaQuery.addEventListener('change', handleChange);
 return () => mediaQuery.removeEventListener('change', handleChange);
 } else {
 applyTheme(theme === 'dark');
 }
 }, [theme]);

 const setTheme = (newTheme) => {
 setThemeState(newTheme);
 localStorage.setItem('theme', newTheme);
 };

 const toggleTheme = () => {
 if (resolvedTheme === 'light') {
 setTheme('dark');
 } else {
 setTheme('light');
 }
 };

 const value = {
 theme,
 setTheme,
 toggleTheme,
 resolvedTheme,
 isDark: resolvedTheme === 'dark'
 };

 return (
 <ThemeContext.Provider value={value}>
 {children}
 </ThemeContext.Provider>
 );
};
