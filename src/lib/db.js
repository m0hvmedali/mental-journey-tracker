// src/lib/db.js
import { supabase } from '@/supabaseClient'

// 🧠 حفظ أي نوع بيانات (نصوص، JSON، إلخ)
export const saveTextToDB = async (table, payload) => {
  const username = localStorage.getItem('username')
  if (!username) {
    throw new Error('المستخدم غير مسجل دخول')
  }

  const dataWithUser = {
    ...payload,
    user_id: username,
    ts: Date.now(),
  }

  const { error } = await supabase.from(table).insert([dataWithUser])
  if (error) throw error

  return dataWithUser
}


export const uploadMediaToStorage = async (fileOrBlob, folder = 'diary') => {
    const fileName = `media_${Date.now()}`;
    const extension = fileOrBlob.type.split('/')[1] || 'bin';
    const filePath = `${folder}/${fileName}.${extension}`;
  
    const { data, error } = await supabase.storage
      .from('useruploads')
      .upload(filePath, fileOrBlob, {
        contentType: fileOrBlob.type,
      });
  
    if (error) {
      console.error("❌ Upload failed:", error);
      return null;
    }
  
    const { data: publicData } = supabase.storage
      .from('useruploads')
      .getPublicUrl(filePath);
  
    return publicData?.publicUrl;
  };
  