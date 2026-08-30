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
  // Remove dark: classes that we are going to absorb into semantic classes
  { regex: /dark:bg-\[#121e1a\]/g, replace: '' },
  { regex: /dark:bg-\[#15241f\]/g, replace: '' },
  { regex: /dark:bg-\[#182823\]/g, replace: '' },
  { regex: /dark:text-\[#e6f4ef\]/g, replace: '' },
  { regex: /dark:text-\[#a3c9bd\]/g, replace: '' },
  { regex: /dark:border-\[#1e332c\]/g, replace: '' },
  { regex: /dark:border-\[#264037\]/g, replace: '' },
  { regex: /dark:border-\[#2a473e\]/g, replace: '' },

  // Replace light mode hardcoded with semantic tokens
  { regex: /bg-white/g, replace: 'bg-bg-surface' },
  { regex: /bg-\[#f0f9f5\]/g, replace: 'bg-bg-surface-elevated' },
  { regex: /bg-\[#f9fbfa\]/g, replace: 'bg-bg-app' }, // or surface
  { regex: /text-\[#0e1b15\]/g, replace: 'text-text-primary' },
  { regex: /text-\[#101915\]/g, replace: 'text-text-primary' },
  { regex: /text-\[#5a8c76\]/g, replace: 'text-text-muted' },
  { regex: /text-\[#2d5a47\]/g, replace: 'text-text-secondary' },
  { regex: /border-\[#e7f3ee\]/g, replace: 'border-border-subtle' },
  { regex: /border-\[#e0e8e4\]/g, replace: 'border-border-medium' },
  { regex: /border-\[#d3e3dc\]/g, replace: 'border-border-medium' },
  
  // Cleanup multiple spaces
  { regex: /  +/g, replace: ' ' }
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  replacements.forEach(({ regex, replace }) => {
    content = content.replace(regex, replace);
  });
  
  // Fix empty class strings like className=" " -> className=""
  content = content.replace(/className="\s+"/g, 'className=""');
  // Fix spaces at start/end of quotes
  content = content.replace(/className="\s+/g, 'className="');
  content = content.replace(/\s+"/g, '"');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
    console.log('Refactored:', file);
  }
});

console.log(`Updated ${changedFiles} files with semantic tokens.`);
