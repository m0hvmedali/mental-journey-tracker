const fs = require('fs');
const filePath = 'supabase/migrations/20260830_full_content_migration_seed.sql';
let sql = fs.readFileSync(filePath, 'utf8');

// Fix content_locations
sql = sql.replace(
  /INSERT INTO public\.content_locations \(id, content_id, page_route, slot, order_index, is_visible\)\nVALUES\s+\('7000[^']+', \((SELECT id FROM public\.content WHERE slug = '[^']+' AND language = 'ar')\), '([^']+)', '([^']+)', (\d+), (true|false)\),\s+\('7000[^']+', \((SELECT id FROM public\.content WHERE slug = '[^']+' AND language = 'ar')\), '([^']+)', '([^']+)', (\d+), (true|false)\),\s+\('7000[^']+', \((SELECT id FROM public\.content WHERE slug = '[^']+' AND language = 'ar')\), '([^']+)', '([^']+)', (\d+), (true|false)\),\s+\('7000[^']+', \((SELECT id FROM public\.content WHERE slug = '[^']+' AND language = 'ar')\), '([^']+)', '([^']+)', (\d+), (true|false)\)\nON CONFLICT \(id\) DO NOTHING;/g,
  (match, s1, r1, slot1, oi1, v1, s2, r2, slot2, oi2, v2, s3, r3, slot3, oi3, v3, s4, r4, slot4, oi4, v4) => {
    return `INSERT INTO public.content_locations (content_id, page_route, slot, order_index, is_visible)
VALUES
  ((${s1}), '${r1}', '${slot1}', ${oi1}, ${v1}),
  ((${s2}), '${r2}', '${slot2}', ${oi2}, ${v2}),
  ((${s3}), '${r3}', '${slot3}', ${oi3}, ${v3}),
  ((${s4}), '${r4}', '${slot4}', ${oi4}, ${v4})
ON CONFLICT (page_route, slot, content_id) DO UPDATE SET order_index = EXCLUDED.order_index, is_visible = EXCLUDED.is_visible;`;
  }
);

// Fix content_blocks
const blockRegex = /INSERT INTO public\.content_blocks \(id, content_id, block_type, position, payload, metadata\)\nVALUES \('8000[^']+', \((SELECT id FROM public\.content WHERE slug = '([^']+)' AND language = 'ar')\), '([^']+)', (\d+), (.*?)::jsonb, (.*?)::jsonb\)\nON CONFLICT \(id\) DO NOTHING;/g;

sql = sql.replace(blockRegex, (match, sel, slug, blockType, pos, payload, meta) => {
  return `INSERT INTO public.content_blocks (content_id, block_type, position, payload, metadata)
VALUES ((${sel}), '${blockType}', ${pos}, ${payload}::jsonb, ${meta}::jsonb)
ON CONFLICT (content_id, position) DO UPDATE SET block_type = EXCLUDED.block_type, payload = EXCLUDED.payload, metadata = EXCLUDED.metadata;`;
});

fs.writeFileSync(filePath, sql);
