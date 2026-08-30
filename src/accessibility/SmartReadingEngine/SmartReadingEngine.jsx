// src/accessibility/SmartReadingEngine/SmartReadingEngine.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * SmartReadingEngine Component
 * Handles typography rhythm and reading layout adjustments.
 * Photon-level color/contrast corrections are handled by VIE v3 (VIEProvider).
 */
export default function SmartReadingEngine() {
  const location = useLocation();

  useEffect(() => {
    // Reading rhythm viewport / scroll adjustments on route change
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return null;
}

