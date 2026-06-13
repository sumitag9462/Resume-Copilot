const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'services');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Pattern 1
  content = content.replace(
    /const cleaned = raw\.replace\(\/\^```(?:\(\?:json\)\?)?\\n\?\/i, ""\)\.replace\(\/\\n\?```\$\/i, ""\)\.trim\(\);/g,
    'const match = raw.match(/\\{[\\s\\S]*\\}|\\[[\\s\\S]*\\]/);\n  const cleaned = match ? match[0] : raw.trim();'
  );

  // Pattern 2 (ComparisonEngine.js)
  content = content.replace(
    /const cleanedText = raw\s*\n\s*\.replace\(\/```json\\s\*\/\w*, ""\)\s*\n\s*\.replace\(\/```\\s\*\/\w*, ""\)\s*\n\s*\.trim\(\);/g,
    'const match = raw.match(/\\{[\\s\\S]*\\}|\\[[\\s\\S]*\\]/);\n      const cleanedText = match ? match[0] : raw.trim();'
  );

  // Pattern 3 (geminiService.js)
  content = content.replace(
    /const cleaned = text\s*\n\s*\.replace\(\/```json\\s\*\/\w*, ''\)\s*\n\s*\.replace\(\/```\\s\*\/\w*, ''\)\s*\n\s*\.trim\(\);/g,
    'const match = text.match(/\\{[\\s\\S]*\\}|\\[[\\s\\S]*\\]/);\n    const cleaned = match ? match[0] : text.trim();'
  );

  // Fix InterviewQuestionService.js and interviewQuestionsService.js duplicate logic
  // Also fix bulletEnchancerService.js and bulletEnhancerService.js

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
