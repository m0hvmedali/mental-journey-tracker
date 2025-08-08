import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';

const TawkToChat = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    // تحقق من وجود السكريبت مسبقاً
    if (document.getElementById('tawk-script')) {
      return;
    }

    // إعداد متغيرات Tawk.to
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    // إعداد اللغة
    window.Tawk_API.onLoad = function() {
      setIsLoaded(true);
      // تخصيص الرسائل حسب اللغة
      if (language === 'ar') {
        window.Tawk_API.setAttributes({
          'name': 'مستخدم',
          'email': '',
          'hash': ''
        }, function(error) {});
      }
    };

    // إنشاء السكريبت
    const script = document.createElement('script');
    script.id = 'tawk-script';
    script.async = true;
    script.src = 'https://embed.tawk.to/687af1587f202b19181eefc9/1j0g3th83'; // معرف تجريبي - يجب استبداله
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    
    // إضافة السكريبت
    document.head.appendChild(script);

    // تنظيف عند إلغاء التحميل
    return () => {
      const existingScript = document.getElementById('tawk-script');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
      // إخفاء الويدجت
      if (window.Tawk_API) {
        window.Tawk_API.hideWidget;
      }
    };
  }, [language]);

  return null;
};

// دوال للتحكم في الشات بوت
export const openTawkChat = () => {
  if (window.Tawk_API && window.Tawk_API.maximize) {
    window.Tawk_API.maximize();
  } else {
    // محاولة فتح الشات بعد تحميله
    setTimeout(() => {
      if (window.Tawk_API && window.Tawk_API.maximize) {
        window.Tawk_API.maximize();
      }
    }, 2000);
  }
};

export const closeTawkChat = () => {
  if (window.Tawk_API && window.Tawk_API.minimize) {
    window.Tawk_API.minimize();
  }
};

export const hideTawkChat = () => {
  if (window.Tawk_API && window.Tawk_API.hideWidget) {
    window.Tawk_API.hideWidget();
  }
};

export const showTawkChat = () => {
  if (window.Tawk_API && window.Tawk_API.showWidget) {
    window.Tawk_API.showWidget();
  }
};

export default TawkToChat;