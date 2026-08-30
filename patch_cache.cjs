const fs = require('fs');

let contentCode = fs.readFileSync('src/services/contentService.js', 'utf8');
contentCode = contentCode.replace("export const contentService = {", "export const contentService = {\n  clearShortcutsCache() { cache.delete('homepage_shortcuts'); },\n");
fs.writeFileSync('src/services/contentService.js', contentCode);

let adminCode = fs.readFileSync('src/services/adminContentService.js', 'utf8');
const adminImport = "import { contentService } from './contentService';\n";
adminCode = adminImport + adminCode;

adminCode = adminCode.replace("return newSc;", "contentService.clearShortcutsCache();\n    return newSc;"); // in createShortcut
adminCode = adminCode.replace("return data;", "contentService.clearShortcutsCache();\n        return data;"); // in supabase createShortcut, updateShortcut
adminCode = adminCode.replace("return localStore.shortcuts[idx];", "contentService.clearShortcutsCache();\n      return localStore.shortcuts[idx];"); // in updateShortcut
adminCode = adminCode.replace("return true;", "contentService.clearShortcutsCache();\n        return true;"); // multiple places (delete, saveItems)
fs.writeFileSync('src/services/adminContentService.js', adminCode);
