const fs = require('fs');

const filePath = 'supabase/migrations/20260830_full_content_migration_seed.sql';
let sql = fs.readFileSync(filePath, 'utf8');

// Mapping of hardcoded module IDs to their slugs
const moduleMap = {
  '40000000-0000-0000-0000-000000000001': 'what-is-going',
  '40000000-0000-0000-0000-000000000002': 'where-do-you-stand',
  '40000000-0000-0000-0000-000000000003': 'how-will-we-fix-it',
  '40000000-0000-0000-0000-000000000004': 'how-to-stay-stable'
};

// We need to extract the content mapping from the SQL itself
const contentMap = {};
const contentRegex = /INSERT INTO public\.content.*?VALUES \('([^']+)', '([^']+)'/gs;
let match;
while ((match = contentRegex.exec(sql)) !== null) {
  contentMap[match[1]] = match[2];
}

console.log('Extracted content mappings:', Object.keys(contentMap).length);

// Now find all INSERT INTO public.module_lessons
const lessonRegex = /INSERT INTO public\.module_lessons \(id, module_id, content_id, section_name, order_index\)\s+VALUES \('([^']+)', '([^']+)', '([^']+)', '([^']+)', (\d+)\)\s+ON CONFLICT \(id\) DO UPDATE SET section_name = EXCLUDED\.section_name, order_index = EXCLUDED\.order_index;/g;

sql = sql.replace(lessonRegex, (match, id, moduleId, contentId, sectionName, orderIndex) => {
  const modSlug = moduleMap[moduleId];
  const contSlug = contentMap[contentId];
  
  if (!modSlug || !contSlug) {
    console.error('Missing mapping for', moduleId, contentId);
    return match;
  }
  
  return `INSERT INTO public.module_lessons (module_id, content_id, section_name, order_index)
VALUES (
  (SELECT id FROM public.modules WHERE slug = '${modSlug}'),
  (SELECT id FROM public.content WHERE slug = '${contSlug}' AND language = 'ar'),
  '${sectionName}',
  ${orderIndex}
)
ON CONFLICT (module_id, content_id) DO UPDATE SET section_name = EXCLUDED.section_name, order_index = EXCLUDED.order_index;`;
});

fs.writeFileSync(filePath, sql);
console.log('Done rewriting module_lessons in seed file.');
