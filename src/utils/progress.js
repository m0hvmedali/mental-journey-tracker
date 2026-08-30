// src/utils/progress.js

/**
 * Structure of user progress stored in localStorage ("userProgress")
 */
export function getUserProgress() {
  try {
    const raw = localStorage.getItem("userProgress");
    const current = raw ? JSON.parse(raw) : {};

    const cumulativeSecs = parseInt(localStorage.getItem('cumulativeTime') || '0', 10);
    const totalTime = current.totalTime || cumulativeSecs || 0;

    const timeline = Array.isArray(current.timeline) ? current.timeline : [];

    // Calculate active days & streak from timeline dates
    const activeDatesSet = new Set();
    timeline.forEach(item => {
      if (item.date) {
        const d = new Date(item.date).toISOString().split('T')[0];
        activeDatesSet.add(d);
      }
    });

    // Add today if there are entries today or cumulative time
    const activeDays = Math.max(activeDatesSet.size, current.activeDays || (activeDatesSet.size > 0 ? activeDatesSet.size : 1));
    
    // Calculate current streak
    const streak = calculateStreak(Array.from(activeDatesSet));

    return {
      totalTime,
      modulesCompleted: current.modulesCompleted || 0,
      entries: current.entries || 0,
      feelingsLogged: current.feelingsLogged || 0,
      activeDays,
      streak: Math.max(streak, current.streak || 1),
      lastActiveDate: current.lastActiveDate || (timeline.length > 0 ? timeline[timeline.length - 1].date : new Date().toISOString()),
      timeline
    };
  } catch (e) {
    console.error("Error reading user progress:", e);
    return {
      totalTime: 0,
      modulesCompleted: 0,
      entries: 0,
      feelingsLogged: 0,
      activeDays: 0,
      streak: 0,
      lastActiveDate: new Date().toISOString(),
      timeline: []
    };
  }
}

/**
 * Calculates continuous consecutive days streak
 */
function calculateStreak(datesArray) {
  if (!datesArray || datesArray.length === 0) return 0;
  
  const sorted = datesArray.map(d => new Date(d)).sort((a, b) => b - a);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  let streak = 0;
  let checkDate = new Date(today);

  // If latest entry is not today or yesterday, streak might be broken
  const latestDate = new Date(sorted[0]);
  latestDate.setHours(0,0,0,0);

  if (latestDate < yesterday) {
    return 0; // broken streak
  }

  if (latestDate.getTime() === yesterday.getTime()) {
    checkDate = yesterday;
  }

  for (let i = 0; i < sorted.length; i++) {
    const d = new Date(sorted[i]);
    d.setHours(0, 0, 0, 0);
    
    if (d.getTime() === checkDate.getTime()) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (d.getTime() < checkDate.getTime()) {
      break;
    }
  }

  return Math.max(streak, 1);
}

/**
 * Main function to update progress & add timeline event
 */
export function updateProgress(update) {
  const current = getUserProgress();

  let newTimelineItem = null;

  if (update.timeline) {
    const rawItem = update.timeline;
    const label = rawItem.label || rawItem.title || "خطوة جديدة في رحلتك";
    const gardenEffect = rawItem.gardenEffect || inferGardenEffect(label, rawItem.type);

    newTimelineItem = {
      id: rawItem.id || `evt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      label,
      title: label,
      description: rawItem.description || rawItem.desc || "خطوة إيجابية مضافة إلى حديقة تقدمك الشخصية.",
      type: rawItem.type || "general",
      gardenEffect,
      category: rawItem.category || "عام",
      date: rawItem.date || new Date().toISOString()
    };
  }

  const updatedTimeline = newTimelineItem 
    ? [...current.timeline, newTimelineItem]
    : current.timeline;

  const newTotalTime = current.totalTime + (update.totalTime || 0);
  if (update.totalTime) {
    localStorage.setItem('cumulativeTime', newTotalTime.toString());
  }

  const newData = {
    totalTime: newTotalTime,
    modulesCompleted: Math.max(current.modulesCompleted, update.modulesCompleted || 0),
    entries: current.entries + (update.entries || 0),
    feelingsLogged: current.feelingsLogged + (update.feelingsLogged || 0),
    activeDays: current.activeDays,
    streak: current.streak,
    lastActiveDate: new Date().toISOString(),
    timeline: updatedTimeline
  };

  localStorage.setItem("userProgress", JSON.stringify(newData));

  // Dispatch custom event so garden updates live
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('userProgressUpdated', { detail: newData }));
  }

  return newData;
}

/**
 * Event-driven progress tracker helper
 */
export function trackProgress({ type, title, description, gardenEffect, category, source }) {
  return updateProgress({
    timeline: {
      type: type || 'exercise',
      title: title || 'خطوة في طريق التعافي',
      label: title || 'خطوة في طريق التعافي',
      description: description || 'تم تسجيل هذه الخطوة بنجاح في حديقة تقدمك.',
      gardenEffect: gardenEffect || inferGardenEffect(title, type),
      category: category || 'عام',
      source
    }
  });
}

/**
 * Helper to infer garden effect based on title/type
 */
function inferGardenEffect(title = '', type = '') {
  const t = typeof title === 'string' ? title.toLowerCase() : String(title || '').toLowerCase();
  if (t.includes('module') || t.includes('مسار') || t.includes('وحدة') || type === 'module') return 'flower';
  if (t.includes('استمرار') || t.includes('streak') || t.includes('أيام') || type === 'streak') return 'tree';
  if (t.includes('مفكرة') || t.includes('journal') || t.includes('تأمل') || type === 'journal') return 'stone';
  if (t.includes('مشاعر') || t.includes('شعور') || type === 'emotion') return 'bud';
  if (t.includes('نبع') || t.includes('شلال') || t.includes('milestone')) return 'stream';
  return 'sprout';
}

/**
 * Get or initialize user profile info
 */
export function getUserProfile() {
  try {
    const raw = localStorage.getItem('userProfile');
    const storedUsername = localStorage.getItem('username') || 'ملاحق الذات';
    
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        name: parsed.name || storedUsername,
        username: parsed.username || storedUsername,
        bio: parsed.bio || 'في رحلة استكشاف الذات والتعافي النفسي وتنمية المرونة.',
        avatar: parsed.avatar || '🌱',
        avatarBg: parsed.avatarBg || 'bg-emerald-100 text-emerald-800 border-emerald-300',
        avatarUrl: parsed.avatarUrl || null,
        joinDate: parsed.joinDate || 'أغسطس 2026'
      };
    }

    return {
      name: storedUsername,
      username: storedUsername,
      bio: 'في رحلة استكشاف الذات والتعافي النفسي وتنمية المرونة.',
      avatar: '🌱',
      avatarBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      avatarUrl: null,
      joinDate: 'أغسطس 2026'
    };
  } catch {
    return {
      name: 'ملاحق الذات',
      username: 'ملاحق الذات',
      bio: 'في رحلة استكشاف الذات والتعافي النفسي.',
      avatar: '🌱',
      avatarBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      avatarUrl: null,
      joinDate: 'أغسطس 2026'
    };
  }
}

/**
 * Update user profile info
 */
export function updateUserProfile(profileData) {
  const current = getUserProfile();
  const updated = { ...current, ...profileData };
  localStorage.setItem('userProfile', JSON.stringify(updated));
  if (profileData.name || profileData.username) {
    localStorage.setItem('username', profileData.name || profileData.username);
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('userProfileUpdated', { detail: updated }));
  }
  return updated;
}

/**
 * Export all user progress and data as JSON file
 */
export function exportUserData() {
  const progress = getUserProgress();
  const profile = getUserProfile();
  const data = {
    profile,
    progress,
    exportedAt: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `garden-progress-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Reset progress with user safety confirmation
 */
export function resetUserProgress() {
  localStorage.removeItem("userProgress");
  localStorage.removeItem("cumulativeTime");
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('userProgressUpdated', { detail: getUserProgress() }));
  }
}
