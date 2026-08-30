const fs = require('fs');
let code = fs.readFileSync('src/services/contentService.js', 'utf8');

const shortcutMethods = `
  // ============================================================================
  // HOMEPAGE SHORTCUTS
  // ============================================================================
  async getHomepageShortcuts() {
    const cacheKey = 'homepage_shortcuts';
    const cached = getCached(cacheKey);
    if (cached) return cached;

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('homepage_shortcuts')
          .select('*, items:homepage_shortcut_items(*, content(*))')
          .eq('is_visible', true)
          .order('sort_order', { ascending: true })
          .order('sort_order', { referencedTable: 'homepage_shortcut_items', ascending: true });
        
        if (error) throw error;
        
        // Filter out items where content is not published
        const filteredData = (data || []).map(shortcut => {
          return {
            ...shortcut,
            items: (shortcut.items || []).filter(item => item.content && item.content.status === 'published')
          };
        }).filter(shortcut => shortcut.items.length > 0);

        setCache(cacheKey, filteredData);
        return filteredData;
      } catch (err) {
        console.error('getHomepageShortcuts error:', err);
        return [];
      }
    }
    return [];
  },
`;

code = code.replace("export const contentService = {", "export const contentService = {\n" + shortcutMethods);

fs.writeFileSync('src/services/contentService.js', code);
