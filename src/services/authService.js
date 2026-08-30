import { supabase } from '@/supabaseClient';

/**
 * Format any username (Arabic, English, etc.) or email into a valid Supabase Auth email.
 */
export function formatLoginIdentifier(input) {
  const trimmed = (input || '').trim();
  if (!trimmed) return '';
  if (trimmed.includes('@')) {
    return trimmed.toLowerCase();
  }
  // Convert username to a safe hex representation for Supabase email compatibility
  const utf8Bytes = new TextEncoder().encode(trimmed.toLowerCase());
  const hex = Array.from(utf8Bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  return `u_${hex}@journey.app`;
}

/**
 * Ensure passwords of any length (even 1 character) satisfy internal auth engine requirements
 * without imposing any restrictions on the user.
 */
export function normalizePassword(password) {
  const p = password || '';
  if (p.length < 6) {
    return `_p_${p}_pad_secure_`;
  }
  return p;
}

/**
 * Service to handle authentication using Supabase.
 */
export const authService = {
  /**
   * Register a new user with username or email
   */
  async signUp(identifier, password, displayName) {
    const email = formatLoginIdentifier(identifier);
    const safePassword = normalizePassword(password);
    const actualName = displayName || identifier.trim();

    const { data, error } = await supabase.auth.signUp({
      email,
      password: safePassword,
      options: {
        data: {
          display_name: actualName,
          username: identifier.trim(),
        },
      },
    });
    if (error) throw error;

    if (actualName) {
      localStorage.setItem('username', actualName);
    }

    return data;
  },

  /**
   * Login an existing user with username or email
   */
  async signIn(identifier, password) {
    const email = formatLoginIdentifier(identifier);
    const safePassword = normalizePassword(password);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: safePassword,
    });
    if (error) throw error;

    const resolvedName = data.user?.user_metadata?.display_name || data.user?.user_metadata?.username || identifier.trim();
    if (resolvedName && !resolvedName.startsWith('u_')) {
      localStorage.setItem('username', resolvedName);
    }

    return data;
  },

  /**
   * Log out the current user
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Get the current user session
   */
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    if (data?.session?.user) {
      const u = data.session.user;
      const resolvedName = u.user_metadata?.display_name || u.user_metadata?.username;
      if (resolvedName && !resolvedName.startsWith('u_')) {
        localStorage.setItem('username', resolvedName);
      }
    }
    return data.session;
  },

  /**
   * Get the current user details
   */
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          const u = session.user;
          const resolvedName = u.user_metadata?.display_name || u.user_metadata?.username;
          if (resolvedName && !resolvedName.startsWith('u_')) {
            localStorage.setItem('username', resolvedName);
          }
        }
        callback(event, session);
      }
    );
    return subscription;
  },
};

