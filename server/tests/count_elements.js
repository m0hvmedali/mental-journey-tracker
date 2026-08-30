// server/tests/count_elements.js
import fs from 'fs';
import path from 'path';

// Load Emotions
const emotionsRaw = fs.readFileSync(path.resolve('src/data/emotions_details.json'), 'utf8');
const emotions = JSON.parse(emotionsRaw);
console.log('--- EMOTIONS ---');
console.log('Source count:', emotions.length);

// Load Psychology Insights
const insightsRaw = fs.readFileSync(path.resolve('public/psychology_insights_dataset.json'), 'utf8');
const insights = JSON.parse(insightsRaw);
console.log('\n--- PSYCHOLOGY INSIGHTS ---');
console.log('Source count:', insights.length);

// Load Scientific References from Refrance.jsx
const refranceRaw = fs.readFileSync(path.resolve('src/pages/Refrance.jsx'), 'utf8');
// Find the sources array elements. We can match each item inside "const sources = ["
// Let's count occurrences of "link: " inside the sources array.
// To do this reliably, let's extract the "const sources = [" block.
const sourcesStartIndex = refranceRaw.indexOf('const sources = [');
const sourcesEndIndex = refranceRaw.indexOf('export default function SourcesPage()');
const sourcesBlock = refranceRaw.substring(sourcesStartIndex, sourcesEndIndex);
const linkCount = (sourcesBlock.match(/link:/g) || []).length;
console.log('\n--- SCIENTIFIC REFERENCES ---');
console.log('Source count (links found in array):', linkCount);

// Load Modules and Lessons
import { MODULES_DATA } from '../../src/data/modulesData.js';
console.log('\n--- MODULES & LESSONS ---');
console.log('Source modules count:', MODULES_DATA.length);
let totalLessons = 0;
MODULES_DATA.forEach(mod => {
  totalLessons += mod.pages.length;
  console.log(`Module: "${mod.title}" has ${mod.pages.length} lessons/pages`);
});
console.log('Total Lessons count:', totalLessons);
