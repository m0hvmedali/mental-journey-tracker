// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const rawUrl = typeof import.meta.env !== 'undefined' ? import.meta.env.VITE_SUPABASE_URL : (globalThis.process?.env?.VITE_SUPABASE_URL || '')
const rawKey = typeof import.meta.env !== 'undefined' ? import.meta.env.VITE_SUPABASE_ANON_KEY : (globalThis.process?.env?.VITE_SUPABASE_ANON_KEY || '')

// Check if a real Supabase configuration is present and valid
const isConfigured = Boolean(
  rawUrl &&
  rawUrl.trim() !== '' &&
  !rawUrl.includes('urzxbbqelpnzitqvffhs') &&
  rawUrl.startsWith('http') &&
  rawKey &&
  rawKey.trim() !== ''
)

const createMockQueryBuilder = () => {
  const dummyResult = { data: [], error: null }

  const builder = new Proxy({}, {
    get(target, prop) {
      if (prop === 'then') {
        return (resolve) => resolve(dummyResult)
      }
      if (prop === 'catch') {
        return (reject) => Promise.resolve(dummyResult).catch(reject)
      }
      return () => builder
    }
  })

  return builder
}

const mockStorage = {
  from: () => ({
    upload: async () => ({ data: { path: 'mock/path' }, error: null }),
    getPublicUrl: () => ({ data: { publicUrl: '' } }),
  })
}

const authListeners = new Set();

const mockAuth = {
  signInWithPassword: async ({ email, password: _password }) => {
    try {
      const storedUsersStr = localStorage.getItem('__mock_users__');
      const storedUsers = storedUsersStr ? JSON.parse(storedUsersStr) : {};
      
      let user = storedUsers[email];
      if (!user) {
        user = {
          id: 'user_' + Math.abs(email.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)),
          email,
          user_metadata: {
            username: email.split('@')[0],
            display_name: email.split('@')[0]
          },
          app_metadata: {},
          created_at: new Date().toISOString()
        };
        storedUsers[email] = user;
        localStorage.setItem('__mock_users__', JSON.stringify(storedUsers));
      }

      const session = {
        access_token: 'mock-token-' + Date.now(),
        token_type: 'bearer',
        user,
        expires_at: Math.floor(Date.now() / 1000) + 3600 * 24 * 7
      };

      localStorage.setItem('__mock_session__', JSON.stringify(session));
      authListeners.forEach(cb => {
        try { cb('SIGNED_IN', session); } catch (_err) { /* ignore */ }
      });

      return { data: { user, session }, error: null };
    } catch (err) {
      return { data: { user: null, session: null }, error: { message: err.message } };
    }
  },

  signUp: async ({ email, password: _password, options }) => {
    try {
      const storedUsersStr = localStorage.getItem('__mock_users__');
      const storedUsers = storedUsersStr ? JSON.parse(storedUsersStr) : {};
      
      const user = {
        id: 'user_' + Math.abs(email.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)),
        email,
        user_metadata: options?.data || {
          username: email.split('@')[0],
          display_name: email.split('@')[0]
        },
        app_metadata: {},
        created_at: new Date().toISOString()
      };
      storedUsers[email] = user;
      localStorage.setItem('__mock_users__', JSON.stringify(storedUsers));

      const session = {
        access_token: 'mock-token-' + Date.now(),
        token_type: 'bearer',
        user,
        expires_at: Math.floor(Date.now() / 1000) + 3600 * 24 * 7
      };

      localStorage.setItem('__mock_session__', JSON.stringify(session));
      authListeners.forEach(cb => {
        try { cb('SIGNED_IN', session); } catch (_err) { /* ignore */ }
      });

      return { data: { user, session }, error: null };
    } catch (err) {
      return { data: { user: null, session: null }, error: { message: err.message } };
    }
  },

  signOut: async () => {
    try {
      localStorage.removeItem('__mock_session__');
      authListeners.forEach(cb => {
        try { cb('SIGNED_OUT', null); } catch (_err) { /* ignore */ }
      });
      return { error: null };
    } catch (err) {
      return { error: { message: err.message } };
    }
  },

  getUser: async () => {
    try {
      const s = localStorage.getItem('__mock_session__');
      const session = s ? JSON.parse(s) : null;
      return { data: { user: session?.user || null }, error: null };
    } catch {
      return { data: { user: null }, error: null };
    }
  },

  getSession: async () => {
    try {
      const s = localStorage.getItem('__mock_session__');
      return { data: { session: s ? JSON.parse(s) : null }, error: null };
    } catch {
      return { data: { session: null }, error: null };
    }
  },

  onAuthStateChange: (callback) => {
    authListeners.add(callback);
    try {
      const s = localStorage.getItem('__mock_session__');
      const session = s ? JSON.parse(s) : null;
      if (session) {
        setTimeout(() => {
          try { callback('INITIAL_SESSION', session); } catch (_err) { /* ignore */ }
        }, 0);
      }
    } catch (_err) {
      /* ignore */
    }
    return {
      data: {
        subscription: {
          unsubscribe: () => authListeners.delete(callback)
        }
      }
    };
  },

  updateUser: async (attributes) => {
    try {
      const s = localStorage.getItem('__mock_session__');
      const session = s ? JSON.parse(s) : null;
      if (session && session.user) {
        session.user.user_metadata = { ...session.user.user_metadata, ...(attributes.data || {}) };
        localStorage.setItem('__mock_session__', JSON.stringify(session));
        authListeners.forEach(cb => {
          try { cb('USER_UPDATED', session); } catch (_err) { /* ignore */ }
        });
        return { data: { user: session.user }, error: null };
      }
    } catch (_err) {
      /* ignore */
    }
    return { data: { user: null }, error: null };
  }
}

const mockFunctions = {
  invoke: async () => {
    return { data: null, error: { message: 'Supabase Functions not configured in local mode' } };
  }
}

const mockSupabase = new Proxy(
  {
    storage: mockStorage,
    auth: mockAuth,
    functions: mockFunctions,
    from: () => createMockQueryBuilder(),
  },
  {
    get(target, prop) {
      if (prop in target) {
        return target[prop]
      }
      return () => createMockQueryBuilder()
    }
  }
)

let client = mockSupabase;
if (isConfigured) {
  try {
    client = createClient(rawUrl, rawKey);
  } catch (err) {
    console.error('Failed to initialize Supabase createClient:', err);
    client = mockSupabase;
  }
}

export const supabase = client;
export const isSupabaseConfigured = isConfigured;

// Upsert notification settings for a user
export const upsertNotificationSettings = async (settings) => {
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured; upsert skipped');
    return { data: null, error: null };
  }
  const { data, error } = await supabase.from('notification_settings').upsert(settings, {
    onConflict: 'user_id',
  });
  if (error) console.error('Failed to upsert notification settings:', error);
  return { data, error };
};
