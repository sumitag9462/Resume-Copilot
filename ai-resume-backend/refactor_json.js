const fs = require('fs');
const path = require('path');

const filesToProcess = [
  'ComparisonEngine.js',
  'outreachService.js',
  'weakLanguageService.js',
  'InterviewQuestionService.js',
  'bulletEnhancerService.js',
  'bulletEnchancerService.js', // typo file
  'resumeRebuildService.js',
  'interviewQuestionsService.js', // duplicate?
  'geminiService.js'
];

filesToProcess.forEach(file => {
  const filePath = path.join(__dirname, 'services', file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 1. Add extractAndCleanJSON to imports if aiHelper is imported
  if (content.includes("require('./aiHelper')") || content.includes('require("./aiHelper")')) {
    if (!content.includes("extractAndCleanJSON")) {
      content = content.replace(/\{([^}]+)\}\s*=\s*require\(['"]\.\/aiHelper['"]\)/g, (match, p1) => {
        return `{ ${p1.trim()}, extractAndCleanJSON } = require('./aiHelper')`;
      });
    }
  } else if (content.includes("require('../services/aiHelper')") || content.includes('require("../services/aiHelper")')) {
      if (!content.includes("extractAndCleanJSON")) {
        content = content.replace(/\{([^}]+)\}\s*=\s*require\(['"]\.\.\/services\/aiHelper['"]\)/g, (match, p1) => {
          return `{ ${p1.trim()}, extractAndCleanJSON } = require('../services/aiHelper')`;
        });
      }
  }

  // 2. Replace extraction logic
  // Looking for:
  // const match = raw.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  // const cleaned = match ? match[0] : raw.trim();
  // let parsed = JSON.parse(cleaned); (or similar)
  
  // A generic way: just find "const match = <var>.match(/\{.../)" up to "JSON.parse(...)"
  
  // It's safer to use manual regexes for the patterns we saw
  const regex1 = /const\s+match\s*=\s*([A-Za-z0-9_]+)\.match\(\/\\\{\[\\s\\S\]\*\\\}\|\\\[\[\\s\\S\]\*\\\]\/\);\s*const\s+([A-Za-z0-9_]+)\s*=\s*match\s*\?\s*match\[0\]\s*:\s*\1\.trim\(\);\s*(?:let\s+parsed;?\s*try\s*\{\s*parsed\s*=\s*JSON\.parse\(\2\);?|const\s+([A-Za-z0-9_]+)\s*=\s*JSON\.parse\(\2\);?|parsedJSON\s*=\s*JSON\.parse\(\2\);?)/g;

  // Let's just do an ad-hoc replace for each file
});
