const fs = require('fs');

const filePath = 'supabase/migrations/20260830_full_content_migration_seed.sql';
let sql = fs.readFileSync(filePath, 'utf8');

const contentMap = {};
const contentRegex = /INSERT INTO public\.content .*?VALUES \('([^']+)', '([^']+)'/gs;
let match;
while ((match = contentRegex.exec(sql)) !== null) {
  contentMap[match[1]] = match[2];
}

console.log('Extracted content mappings:', Object.keys(contentMap).length);

// Fix content_blocks
let blockCount = 0;
const blockRegex = /INSERT INTO public\.content_blocks \(id, content_id, block_type, position, payload, metadata\)\nVALUES \('([^']+)', '([^']+)', '([^']+)', (\d+), (.*?)::jsonb, (.*?)::jsonb\)\nON CONFLICT \(id\) DO NOTHING;/g;

sql = sql.replace(blockRegex, (match, id, contentId, blockType, position, payload, metadata) => {
  const contSlug = contentMap[contentId];
  if (!contSlug) {
    console.error('Missing content mapping for block with content_id:', contentId);
    return match;
  }
  blockCount++;
  // We can also change ON CONFLICT (id) DO NOTHING to ON CONFLICT (content_id, position) DO UPDATE if it existed, but let's just fix the FK
  return `INSERT INTO public.content_blocks (id, content_id, block_type, position, payload, metadata)
VALUES ('${id}', (SELECT id FROM public.content WHERE slug = '${contSlug}' AND language = 'ar'), '${blockType}', ${position}, ${payload}::jsonb, ${metadata}::jsonb)
ON CONFLICT (id) DO NOTHING;`;
});
console.log('Fixed content_blocks:', blockCount);

// Fix content_locations
let locCount = 0;
const locRegex = /INSERT INTO public\.content_locations \(id, content_id, page_route, slot, order_index, is_visible\)\nVALUES \('([^']+)', '([^']+)', '([^']+)', '([^']+)', (\d+), (true|false)\)\nON CONFLICT \(id\) DO NOTHING;/g;

sql = sql.replace(locRegex, (match, id, contentId, pageRoute, slot, orderIndex, isVisible) => {
  const contSlug = contentMap[contentId];
  if (!contSlug) {
    console.error('Missing content mapping for location with content_id:', contentId);
    return match;
  }
  locCount++;
  return `INSERT INTO public.content_locations (id, content_id, page_route, slot, order_index, is_visible)
VALUES ('${id}', (SELECT id FROM public.content WHERE slug = '${contSlug}' AND language = 'ar'), '${pageRoute}', '${slot}', ${orderIndex}, ${isVisible})
ON CONFLICT (id) DO NOTHING;`;
});
console.log('Fixed content_locations:', locCount);

fs.writeFileSync(filePath, sql);
