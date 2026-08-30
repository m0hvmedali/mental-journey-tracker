// src/services/notesService.js
import { supabase, isSupabaseConfigured } from '@/supabaseClient';

const LOCAL_STORAGE_KEY = 'user_sticky_notes';
let isNotesTableAvailable = true;

// Helper to get active user ID
const getCurrentUserId = () => {
  return localStorage.getItem('username') || 'guest';
};

/**
  Fetch all sticky notes for the current user
*/
export async function getNotes() {
  const userId = getCurrentUserId();
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
  if (isSupabaseConfigured && isNotesTableAvailable) {
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
  const userId = getCurrentUserId();
  const now = new Date().toISOString();

  const note = {
    id: noteData.id || `note_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    user_id: userId,
    content: noteData.content || '',
    color: noteData.color || 'emerald',
    source_path: noteData.source_path || noteData.source?.path || window.location.pathname,
    source_title: noteData.source_title || noteData.source?.title || document.title || 'ملاحظة عامة',
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

  // 2. Try saving to Supabase
  if (isSupabaseConfigured && isNotesTableAvailable) {
    try {
      const { error } = await supabase.from('user_notes').upsert([note]);
      if (error) {
        isNotesTableAvailable = false;
      }
    } catch {
      isNotesTableAvailable = false;
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

  // 2. Delete from Supabase
  if (isSupabaseConfigured && isNotesTableAvailable) {
    try {
      const { error } = await supabase.from('user_notes').delete().eq('id', noteId);
      if (error) {
        isNotesTableAvailable = false;
      }
    } catch {
      isNotesTableAvailable = false;
    }
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('userNotesUpdated', { detail: { id: noteId, deleted: true } }));
  }
}
