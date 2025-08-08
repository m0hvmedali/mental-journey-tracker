import React, { createContext, useContext, useEffect, useState } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [dailyReminder, setDailyReminder] = useState(() => {
    return localStorage.getItem('dailyReminder') === 'true';
  });
  
  const [gratitudeReminder, setGratitudeReminder] = useState(() => {
    return localStorage.getItem('gratitudeReminder') === 'true';
  });

  const [dailyReminderTime, setDailyReminderTime] = useState(() => {
    return localStorage.getItem('dailyReminderTime') || '20:00';
  });

  const [gratitudeReminderTime, setGratitudeReminderTime] = useState(() => {
    return localStorage.getItem('gratitudeReminderTime') || '21:00';
  });

  useEffect(() => {
    localStorage.setItem('dailyReminder', dailyReminder.toString());
    localStorage.setItem('gratitudeReminder', gratitudeReminder.toString());
    localStorage.setItem('dailyReminderTime', dailyReminderTime);
    localStorage.setItem('gratitudeReminderTime', gratitudeReminderTime);

    // طلب إذن الإشعارات إذا كان أي منهما مفعل
    if ((dailyReminder || gratitudeReminder) && 'Notification' in window) {
      Notification.requestPermission();
    }

    // إعداد التذكيرات
    setupReminders();
  }, [dailyReminder, gratitudeReminder, dailyReminderTime, gratitudeReminderTime]);

  const setupReminders = () => {
    // إلغاء التذكيرات السابقة
    clearReminders();

    if (dailyReminder) {
      scheduleNotification(
        'daily',
        dailyReminderTime,
        'تذكير الكتابة اليومية',
        'حان وقت كتابة مذكراتك اليومية! 📝'
      );
    }

    if (gratitudeReminder) {
      scheduleNotification(
        'gratitude',
        gratitudeReminderTime,
        'تذكير كتابة الامتنان',
        'حان وقت كتابة ما تشعر بالامتنان له اليوم! 🙏'
      );
    }
  };

  const scheduleNotification = (type, time, title, body) => {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // إذا كان الوقت قد مضى اليوم، جدوله للغد
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilNotification = scheduledTime.getTime() - now.getTime();

    const timeoutId = setTimeout(() => {
      showNotification(title, body);
      // جدول التذكير للغد
      scheduleNotification(type, time, title, body);
    }, timeUntilNotification);

    // حفظ معرف التايمر لإلغائه لاحقاً
    localStorage.setItem(`${type}TimeoutId`, timeoutId.toString());
  };

  const clearReminders = () => {
    const dailyTimeoutId = localStorage.getItem('dailyTimeoutId');
    const gratitudeTimeoutId = localStorage.getItem('gratitudeTimeoutId');

    if (dailyTimeoutId) {
      clearTimeout(Number(dailyTimeoutId));
      localStorage.removeItem('dailyTimeoutId');
    }

    if (gratitudeTimeoutId) {
      clearTimeout(Number(gratitudeTimeoutId));
      localStorage.removeItem('gratitudeTimeoutId');
    }
  };

  const showNotification = (title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico', // يمكن تخصيص الأيقونة
        badge: '/favicon.ico',
        tag: 'mental-health-reminder'
      });
    }
  };

  const toggleDailyReminder = () => {
    setDailyReminder(prev => !prev);
  };

  const toggleGratitudeReminder = () => {
    setGratitudeReminder(prev => !prev);
  };

  const value = {
    dailyReminder,
    gratitudeReminder,
    dailyReminderTime,
    gratitudeReminderTime,
    setDailyReminderTime,
    setGratitudeReminderTime,
    toggleDailyReminder,
    toggleGratitudeReminder,
    showNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

