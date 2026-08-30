// src/lib/storage.js
import { supabase } from '@/supabaseClient'

// 📁 رفع ملف لأي bucket بمسار مخصص
export const uploadFileToStorage = async (bucket, file, folder = '') => {
  const username = localStorage.getItem('username')
  if (!username) throw new Error('المستخدم غير مسجل دخول')

  const path = `${username}/${folder}/${Date.now()}_${file.name}`

  const { data, error } = await supabase.storage.from(bucket).upload(path, file)
  if (error) throw error

  // نجيب رابط الملف للعرض أو التخزين
  const { data: urlData } = await supabase.storage.from(bucket).getPublicUrl(path)
  return urlData.publicUrl
}
