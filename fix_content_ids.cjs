const fs = require('fs');
const filePath = 'supabase/migrations/20260830_full_content_migration_seed.sql';
let sql = fs.readFileSync(filePath, 'utf8');

const revMap = {
  'thinking-errors': '55555555-5555-5555-5555-555555555551',
  'defense-mechanisms': '55555555-5555-5555-5555-555555555552',
  'tolerance-window': '55555555-5555-5555-5555-555555555553',
  'about': '55555555-5555-5555-5555-555555555554'
};

const brokenRegex = /VALUES \(\(SELECT id FROM public\.content WHERE slug = '([^']+)' AND language = 'ar'\), '([^']+)'/g;

sql = sql.replace(brokenRegex, (match, slug1, slug2) => {
  if (slug1 === slug2 && revMap[slug1]) {
    return `VALUES ('${revMap[slug1]}', '${slug2}'`;
  }
  return match;
});

fs.writeFileSync(filePath, sql);
