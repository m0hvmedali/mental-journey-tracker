// server/tests/query_supabase.js
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Safely parse local .env file manually if it exists
try {
  if (fs.existsSync('.env')) {
    const envContent = fs.readFileSync('.env', 'utf8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        // Remove surrounding quotes if any
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
        globalThis.process.env[key] = value;
      }
    });
    console.log('Loaded credentials from local .env file successfully.');
  }
} catch (e) {
  console.log('No local .env file read or parsed:', e.message);
}

const rawUrl = typeof import.meta.env !== 'undefined' ? import.meta.env.VITE_SUPABASE_URL : (globalThis.process?.env?.VITE_SUPABASE_URL || globalThis.process?.env?.SUPABASE_URL || '');
const rawKey = typeof import.meta.env !== 'undefined' ? import.meta.env.VITE_SUPABASE_ANON_KEY : (globalThis.process?.env?.VITE_SUPABASE_ANON_KEY || globalThis.process?.env?.SUPABASE_ANON_KEY || '');

console.log('Supabase Connection Diagnostics:');
console.log('URL Length:', rawUrl?.length || 0);
console.log('Key Length:', rawKey?.length || 0);

if (!rawUrl || !rawKey) {
  console.log('❌ Error: Supabase URL or Anon Key is missing from the environment!');
  globalThis.process.exit(0);
}

const supabase = createClient(rawUrl, rawKey);

async function checkDatabaseCounts() {
  const tables = [
    'emotions_encyclopedia',
    'psychology_insights',
    'scientific_references',
    'modules',
    'module_lessons',
    'content',
    'content_blocks'
  ];

  console.log('\nQuerying actual Supabase live instance:');
  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`- Table "${table}": Error/Not Found (${error.message})`);
      } else {
        console.log(`- Table "${table}": Actual DB Count = ${count}`);
      }
    } catch (err) {
      console.log(`- Table "${table}": Exception triggered (${err.message})`);
    }
  }
}

checkDatabaseCounts().catch(err => {
  console.error('Diagnostic run failed:', err);
});
