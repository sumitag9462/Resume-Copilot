const extractAndCleanJSON = (rawText) => {
  const match = rawText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  let cleaned = match ? match[0] : rawText.trim();
  
  let inString = false;
  let isEscaped = false;
  let fixed = "";
  for (let i = 0; i < cleaned.length; i++) {
    let char = cleaned[i];
    
    if (char === '"' && !isEscaped) {
      inString = !inString;
    }
    
    if (char === '\\' && !isEscaped) {
      isEscaped = true;
    } else {
      isEscaped = false;
    }

    if (inString) {
      if (char === '\n') fixed += '\\n';
      else if (char === '\r') fixed += '\\r';
      else if (char === '\t') fixed += '\\t';
      else fixed += char;
    } else {
      fixed += char;
    }
  }
  return fixed;
};

const badJson = '{\n  "improvedResume": "Here is line 1.\nAnd here is line 2 with a \\"quote\\" and\nline 3."\n}';

console.log("Original JSON:");
console.log(badJson);

try {
  JSON.parse(badJson.trim());
  console.log("Original parsed successfully!?");
} catch(e) {
  console.error("Original failed:", e.message);
}

const fixedJson = extractAndCleanJSON(badJson);
console.log("Fixed JSON:");
console.log(fixedJson);

try {
  console.log(JSON.parse(fixedJson));
  console.log("Fixed parsed successfully!");
} catch(e) {
  console.error("Fixed failed:", e.message);
}
