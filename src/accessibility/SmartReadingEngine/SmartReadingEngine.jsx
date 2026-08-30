// src/accessibility/SmartReadingEngine/SmartReadingEngine.jsx
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getContrastGuardian } from './contrast-guardian';

/**
 * SmartReadingEngine Component
 * Global React lifecycle anchor for contrast guardian, SPA route awareness, and accessibility adjustments.
 */
export default function SmartReadingEngine() {
  const location = useLocation();
  const guardianRef = useRef(null);

  useEffect(() => {
    // Initialize Contrast Guardian singleton
    guardianRef.current = getContrastGuardian({ mode: 'safe' });

    // Initial scan on mount
    const timer = setTimeout(() => {
      guardianRef.current?.rescan();
    }, 100);

    // Observer for theme changes on <html> (dark mode toggle)
    const themeObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'class' || mutation.attributeName === 'data-theme') {
          guardianRef.current?.rescan();
        }
      }
    });

    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme']
    });

    return () => {
      clearTimeout(timer);
      themeObserver.disconnect();
      // Note: we keep the singleton active across SPA route changes, cleanup on full teardown
    };
  }, []);

  // Targeted rescan on SPA route change
  useEffect(() => {
    if (guardianRef.current) {
      // Allow new route DOM nodes to mount before triggering intersection observer
      const routeTimer = setTimeout(() => {
        guardianRef.current?.rescan();
      }, 150);

      return () => clearTimeout(routeTimer);
    }
  }, [location.pathname, location.search]);

  return null;
}
