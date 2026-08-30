// src/lib/db.js
import { supabase, isSupabaseConfigured } from '@/supabaseClient';

// 🧠 حفظ أي نوع بيانات (نصوص، JSON، إلخ) مع دعم الحفظ المحلي التلقائي في حال تعذر الاتصال
export const saveTextToDB = async (table, payload) => {
  const username = localStorage.getItem('username') || 'guest';

  const dataWithUser = {
    id: payload.id || `entry_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    ...payload,
    user_id: username,
    ts: Date.now(),
  };

  // Attempt saving to Supabase if configured
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.from(table).insert([dataWithUser]);
      if (error) {
        console.warn(`Supabase notice on table ${table}:`, error.message || error);
      }
    } catch (err) {
      console.warn(`Supabase insert to ${table} failed, saved locally:`, err);
    }
  }

  // Always persist in local storage cache
  try {
    const localKey = `${table}_${username}`;
    const existingRaw = localStorage.getItem(localKey);
    const existing = existingRaw ? JSON.parse(existingRaw) : [];
    localStorage.setItem(localKey, JSON.stringify([dataWithUser, ...existing]));
  } catch (localErr) {
    console.warn('LocalStorage save error:', localErr);
  }

  return dataWithUser;
};

export const uploadMediaToStorage = async (fileOrBlob, folder = 'diary') => {
  if (!fileOrBlob) return null;

  try {
    const fileName = `media_${Date.now()}`;
    const extension = fileOrBlob.type?.split('/')[1] || 'bin';
    const filePath = `${folder}/${fileName}.${extension}`;

    const { error } = await supabase.storage
      .from('useruploads')
      .upload(filePath, fileOrBlob, {
        contentType: fileOrBlob.type || 'application/octet-stream',
      });

    if (error) {
      console.warn("Media remote upload notice, using local blob:", error);
      return URL.createObjectURL(fileOrBlob);
    }

    const { data: publicData } = supabase.storage
      .from('useruploads')
      .getPublicUrl(filePath);

    return publicData?.publicUrl || URL.createObjectURL(fileOrBlob);
  } catch (err) {
    console.warn("Storage upload error fallback to local blob:", err);
    return URL.createObjectURL(fileOrBlob);
  }
};
