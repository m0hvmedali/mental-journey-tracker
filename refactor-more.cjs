const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = walkSync(dirFile, filelist);
    } catch (err) {
      if (err.code === 'ENOTDIR' || err.code === 'EBADF') {
        if (dirFile.endsWith('.jsx') || dirFile.endsWith('.tsx')) {
          filelist.push(dirFile);
        }
      }
    }
  });
  return filelist;
};

const files = walkSync('src');
let changedFiles = 0;

const replacements = [
  { regex: /dark:bg-\[#1f382f\]/g, replace: '' },
  { regex: /dark:bg-\[#264037\]/g, replace: '' },
  { regex: /dark:bg-\[#1a2c27\]/g, replace: '' },
  { regex: /dark:bg-\[#0b1311\]/g, replace: '' },
  { regex: /dark:bg-\[#0e1b15\]/g, replace: '' },
  
  { regex: /bg-\[#f8fcfa\]/g, replace: 'bg-bg-app' },
  { regex: /bg-\[#e7f3ee\]/g, replace: 'bg-bg-surface-hover' },
  { regex: /bg-\[#f2f8f5\]/g, replace: 'bg-bg-surface' },
  { regex: /bg-\[#e0f0e9\]/g, replace: 'bg-bg-surface-hover' },
  { regex: /bg-\[#f0f9f4\]/g, replace: 'bg-bg-surface-elevated' },
  
  { regex: /text-\[#4e9778\]/g, replace: 'text-emerald-600' },
  { regex: /dark:text-\[#34d399\]/g, replace: 'dark:text-emerald-400' },
  { regex: /dark:text-\[#72a897\]/g, replace: 'text-text-muted' },
  
  { regex: /  +/g, replace: ' ' }
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  replacements.forEach(({ regex, replace }) => {
    content = content.replace(regex, replace);
  });
  
  content = content.replace(/className="\s+"/g, 'className=""');
  content = content.replace(/className="\s+/g, 'className="');
  content = content.replace(/\s+"/g, '"');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
    console.log('Refactored more:', file);
  }
});
console.log(`Updated ${changedFiles} files with more semantic tokens.`);
