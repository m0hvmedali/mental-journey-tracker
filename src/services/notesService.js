// src/services/notesService.js
import { supabase, isSupabaseConfigured } from '@/supabaseClient';

const LOCAL_STORAGE_KEY = 'user_sticky_notes';
let isNotesTableAvailable = true;

// Helper to get active user ID
const getCurrentUserId = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id) return user.id;
  } catch {
    // ignore
  }
  return localStorage.getItem('username') || 'guest';
};

const isUUID = (str) => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str || '');
};

/**
  Fetch all sticky notes for the current user
*/
export async function getNotes() {
  const userId = await getCurrentUserId();
  let dbNotes = [];

  // Load local notes first as immediate source
  let localNotes = [];
  try {
    const localRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
    localNotes = localRaw ? JSON.parse(localRaw) : [];
  } catch (err) {
    console.warn('Error reading local notes:', err);
  }

  // Try fetching from Supabase only if configured and table hasn't failed with 404
  if (isSupabaseConfigured && isNotesTableAvailable && isUUID(userId)) {
    try {
      const { data, error } = await supabase
        .from('user_notes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        isNotesTableAvailable = false;
      } else if (Array.isArray(data)) {
        dbNotes = data;
      }
    } catch {
      isNotesTableAvailable = false;
    }
  }

  // Merge local notes and db notes
  try {
    const map = new Map();
    [...dbNotes, ...localNotes].forEach(item => {
      if (item && item.id) {
        map.set(item.id, item);
      }
    });

    const merged = Array.from(map.values()).sort((a, b) => {
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    });

    return merged;
  } catch {
    return localNotes.length > 0 ? localNotes : dbNotes;
  }
}

/**
  Save or update a note
*/
export async function saveNote(noteData) {
  const userId = await getCurrentUserId();
  const now = new Date().toISOString();

  const noteId = (noteData.id && isUUID(noteData.id)) 
    ? noteData.id 
    : (noteData.id || crypto.randomUUID());

  const note = {
    id: noteId,
    user_id: userId,
    content: noteData.content || '',
    color: noteData.color || 'emerald',
    source_path: noteData.source_path || noteData.source?.path || (typeof window !== 'undefined' ? window.location.pathname : ''),
    source_title: noteData.source_title || noteData.source?.title || (typeof document !== 'undefined' ? document.title : 'ملاحظة عامة'),
    source_type: noteData.source_type || 'page',
    position: noteData.position || { x: 20, y: 80 },
    created_at: noteData.created_at || now,
    updated_at: now
  };

  // 1. Save locally immediately
  try {
    const localRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
    const localNotes = localRaw ? JSON.parse(localRaw) : [];
    const existingIdx = localNotes.findIndex(n => n.id === note.id);

    if (existingIdx >= 0) {
      localNotes[existingIdx] = note;
    } else {
      localNotes.unshift(note);
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localNotes));
  } catch (err) {
    console.error('Error saving note locally:', err);
  }

  // 2. Try saving to Supabase if authenticated with valid UUID
  if (isSupabaseConfigured && isNotesTableAvailable && isUUID(userId) && isUUID(note.id)) {
    try {
      const { error } = await supabase.from('user_notes').upsert([note]);
      if (error) {
        console.warn('Supabase user_notes upsert warning:', error?.message || error);
      }
    } catch (err) {
      console.warn('Supabase user_notes upsert error:', err?.message || err);
    }
  }

  // Dispatch custom event for real-time UI synchronization
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('userNotesUpdated', { detail: note }));
  }

  return note;
}

/**
  Delete a note
*/
export async function deleteNote(noteId) {
  // 1. Remove locally
  try {
    const localRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (localRaw) {
      const localNotes = JSON.parse(localRaw).filter(n => n.id !== noteId);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localNotes));
    }
  } catch (err) {
    console.error('Error deleting local note:', err);
  }

  // 2. Delete from Supabase if valid UUID
  if (isSupabaseConfigured && isNotesTableAvailable && isUUID(noteId)) {
    try {
      await supabase.from('user_notes').delete().eq('id', noteId);
    } catch {
      // ignore
    }
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('userNotesUpdated', { detail: { id: noteId, deleted: true } }));
  }
}
