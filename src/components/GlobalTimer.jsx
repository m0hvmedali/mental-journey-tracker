// src/components/GlobalTimer.jsx
import { useEffect } from 'react';

export default function GlobalTimer() {
  useEffect(() => {
    const STORAGE_KEY = 'cumulativeTime';
    let startTime = Date.now();
    let existingTime = parseInt(localStorage.getItem(STORAGE_KEY)) || 0;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - startTime) / 1000);
      localStorage.setItem(STORAGE_KEY, existingTime + elapsedSeconds);
    }, 10000); // نحفظ كل 10 ثواني

    return () => clearInterval(interval);
  }, []);

  return null; // مفيش UI
}
