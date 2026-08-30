const fs = require('fs');
const filePath = 'supabase/migrations/20260830_full_content_migration_seed.sql';
let sql = fs.readFileSync(filePath, 'utf8');

const contentMap = {
  '55555555-5555-5555-5555-555555555551': 'thinking-errors',
  '55555555-5555-5555-5555-555555555552': 'defense-mechanisms',
  '55555555-5555-5555-5555-555555555553': 'tolerance-window',
  '55555555-5555-5555-5555-555555555554': 'about'
};

// Replace 5555... IDs in content_locations with subqueries
sql = sql.replace(/('55555555-5555-5555-5555-55555555555[1234]')/g, (match, idStr) => {
  const id = idStr.replace(/'/g, '');
  const slug = contentMap[id];
  if (slug) {
    return `(SELECT id FROM public.content WHERE slug = '${slug}' AND language = 'ar')`;
  }
  return match;
});

fs.writeFileSync(filePath, sql);
