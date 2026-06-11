const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  "src/pages/LandingPage.jsx",
  "src/pages/ResumesPage.jsx",
  "src/components/resume/ResumeUploadZone.jsx",
  "src/components/layout/Navbar.jsx",
  "src/components/layout/Topbar.jsx"
];

filesToUpdate.forEach(file => {
  const fullPath = path.join("/Users/sumitagrawal/Desktop/resume-analyzer/ai-resume-frontend", file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    content = content.replace(/border-border-default/g, 'border-border-normal');
    fs.writeFileSync(fullPath, content);
    console.log(`Updated ${file}`);
  }
});
