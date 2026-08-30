const fs = require('fs');

let adminCode = fs.readFileSync('src/services/adminContentService.js', 'utf8');
// Fix saveShortcutItems
adminCode = adminCode.replace(
`        if (error) throw error;
        }
        return true;
      } catch (err) {
        console.error('saveShortcutItems error:', err);`,
`        if (error) throw error;
        }
        contentService.clearShortcutsCache();
        return true;
      } catch (err) {
        console.error('saveShortcutItems error:', err);`
);

adminCode = adminCode.replace(
`    if(localStore.shortcuts) {
      localStore.shortcuts = localStore.shortcuts.filter(s => s.id !== id);
    }
    return true;
  },`,
`    if(localStore.shortcuts) {
      localStore.shortcuts = localStore.shortcuts.filter(s => s.id !== id);
    }
    contentService.clearShortcutsCache();
    return true;
  },`
);

adminCode = adminCode.replace(
`    }
    return true;
  },
  /**`,
`    }
    contentService.clearShortcutsCache();
    return true;
  },
  /**`
); // Note: Make sure it's saveShortcutItems end
fs.writeFileSync('src/services/adminContentService.js', adminCode);
