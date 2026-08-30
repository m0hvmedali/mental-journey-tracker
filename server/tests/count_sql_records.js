// server/tests/count_sql_records.js
import fs from 'fs';
import path from 'path';

const migrationsDir = 'supabase/migrations';

function countInsertsInFile(filename, tableName) {
  const filepath = path.join(migrationsDir, filename);
  if (!fs.existsSync(filepath)) {
    return 0;
  }
  const content = fs.readFileSync(filepath, 'utf8');
  
  // Find INSERT INTO tableName lines
  // Let's count how many records are inserted. 
  // Often there's an "INSERT INTO tableName" statement, then multiple rows as (..., ..., ...), (..., ..., ...);
  // We can count the number of value tuples or occurrences.
  // A robust way for our seed file is to see how many matching segments or rows are defined in the SQL.
  // Let's print out the exact matches or rows.
  
  // Let's write a parser based on the table name
  // In our 20260830_full_content_migration_seed.sql file:
  // Let's find "INSERT INTO tableName"
  const regex = new RegExp(`INSERT INTO\\s+"?${tableName}"?\\s+VALUES`, 'gi');
  const index = content.search(regex);
  if (index === -1) {
    // Try without quotes or different schema prefix
    const regex2 = new RegExp(`INSERT INTO\\s+public\\."?${tableName}"?\\s+VALUES`, 'gi');
    const index2 = content.search(regex2);
    if (index2 === -1) return 0;
  }
  
  // Let's read the INSERT statements. In standard seeds, there are multiple insert lines or one large insert with many tuples.
  // Let's look at the structure of our seed file for that specific table.
  // To keep it simple and ultra-precise, let's extract the block after "INSERT INTO ... VALUES" up to the next query or semicolon.
  // Let's count the matching rows or items.
  let matchesCount = 0;
  
  // Let's look for individual inserts or value lines.
  // In our generated seed, let's see how each table is seeded.
  return parseSeedRecords(content, tableName);
}

function parseSeedRecords(content, tableName) {
  // Let's count the exact number of items defined in the seed.
  // We can do this by finding the insert statement block for each table and counting the tuples.
  let blockStart = content.indexOf(`INSERT INTO public.${tableName}`);
  if (blockStart === -1) {
    blockStart = content.indexOf(`INSERT INTO ${tableName}`);
  }
  if (blockStart === -1) {
    // Try quoted name
    blockStart = content.indexOf(`INSERT INTO public."${tableName}"`);
    if (blockStart === -1) {
      blockStart = content.indexOf(`INSERT INTO "${tableName}"`);
    }
  }
  
  if (blockStart === -1) return 0;
  
  // Find the end of this statement (the next semicolon ';')
  const blockEnd = content.indexOf(';', blockStart);
  if (blockEnd === -1) return 0;
  
  const block = content.substring(blockStart, blockEnd);
  
  // Count the number of value rows. Each row is typically enclosed in parentheses: (val1, val2, ...), 
  // Let's count occurrences of rows. In standard formatted SQL:
  // ( ... )
  // We can count occurrences of '),(' or '),\n(' or similar.
  // Let's count the number of lines starting with '(' or containing '(' after commas.
  // Or we can count commas outside quotes or parentheses.
  // To be super safe and precise, let's count occurrences of "('" or "(" at the start of values.
  // Let's analyze the format of our seed file for emotions, insights, references, etc.
  
  // Let's count the parentheses blocks. A row starts with '(' and ends with ')' followed by ',' or ';'
  // We can do this by extracting everything inside VALUES (...)
  const valuesIdx = block.toUpperCase().indexOf('VALUES');
  if (valuesIdx === -1) return 0;
  const valuesStr = block.substring(valuesIdx + 6);
  
  // Count top-level tuples in valuesStr
  let count = 0;
  let inString = false;
  let stringChar = '';
  let parenDepth = 0;
  let escaped = false;
  
  for (let i = 0; i < valuesStr.length; i++) {
    const char = valuesStr[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === '\\') {
      escaped = true;
      continue;
    }
    // Handle quotes (PostgreSQL strings use single quotes)
    if ((char === "'" || char === '"') && !escaped) {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (stringChar === char) {
        // Check for double single quotes in SQL (e.g. '') which is an escaped single quote
        if (char === "'" && valuesStr[i + 1] === "'") {
          i++; // skip next quote
        } else {
          inString = false;
        }
      }
    }
    
    if (!inString) {
      if (char === '(') {
        if (parenDepth === 0) {
          count++;
        }
        parenDepth++;
      } else if (char === ')') {
        parenDepth--;
      }
    }
  }
  
  return count;
}

const seedFile = '20260830_full_content_migration_seed.sql';
console.log('--- COUNTING SQL SEED RECORDS ---');
const tables = [
  'emotions_encyclopedia',
  'psychology_insights',
  'scientific_references',
  'modules',
  'module_lessons',
  'content',
  'content_blocks'
];

tables.forEach(table => {
  const count = countInsertsInFile(seedFile, table);
  console.log(`Table "${table}": SQL Seed Records = ${count}`);
});
