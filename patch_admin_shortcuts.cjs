const fs = require('fs');
let code = fs.readFileSync('src/services/adminContentService.js', 'utf8');

const shortcutMethods = `
  // ============================================================================
  // HOMEPAGE SHORTCUTS MANAGEMENT
  // ============================================================================
  async getShortcuts() {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('homepage_shortcuts')
          .select('*, items:homepage_shortcut_items(*, content(*))')
          .order('sort_order', { ascending: true })
          .order('sort_order', { referencedTable: 'homepage_shortcut_items', ascending: true });
        
        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error('getShortcuts error:', err);
        throw err;
      }
    }
    return localStore.shortcuts || [];
  },

  async createShortcut(shortcutData) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('homepage_shortcuts')
          .insert([shortcutData])
          .select()
          .single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.error('createShortcut error:', err);
        throw err;
      }
    }
    const newSc = { ...shortcutData, id: crypto.randomUUID(), created_at: new Date().toISOString() };
    if(!localStore.shortcuts) localStore.shortcuts = [];
    localStore.shortcuts.push(newSc);
    return newSc;
  },

  async updateShortcut(id, shortcutData) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('homepage_shortcuts')
          .update(shortcutData)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.error('updateShortcut error:', err);
        throw err;
      }
    }
    const idx = (localStore.shortcuts || []).findIndex(s => s.id === id);
    if(idx > -1) {
      localStore.shortcuts[idx] = { ...localStore.shortcuts[idx], ...shortcutData };
      return localStore.shortcuts[idx];
    }
    throw new Error('Shortcut not found locally');
  },

  async deleteShortcut(id) {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('homepage_shortcuts')
          .delete()
          .eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('deleteShortcut error:', err);
        throw err;
      }
    }
    if(localStore.shortcuts) {
      localStore.shortcuts = localStore.shortcuts.filter(s => s.id !== id);
    }
    return true;
  },

  async saveShortcutItems(shortcutId, items) {
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('homepage_shortcut_items')
          .delete()
          .eq('shortcut_id', shortcutId);
          
        if (items && items.length > 0) {
          const insertData = items.map((item, index) => ({
            shortcut_id: shortcutId,
            content_id: item.content_id,
            sort_order: item.sort_order ?? index
          }));
          const { error } = await supabase
            .from('homepage_shortcut_items')
            .insert(insertData);
          if (error) throw error;
        }
        return true;
      } catch (err) {
        console.error('saveShortcutItems error:', err);
        throw err;
      }
    }
    return true;
  },
`;

code = code.replace("const adminContentService = {", "const adminContentService = {\n" + shortcutMethods);

fs.writeFileSync('src/services/adminContentService.js', code);
