// ============================================================
// utils/fileParser.js — FILE TEXT EXTRACTOR
//
// This utility extracts plain text from PDF and DOCX files
// so we can send that text to the Gemini AI for analysis.
//
// pdf-parse: reads a PDF buffer → returns { text, numpages, info }
// mammoth:   reads a DOCX file → returns { value (text), messages }
//
// WHY extract text?
//   - AI models only accept text input (not raw binary files)
//   - Once extracted, we store it in MongoDB so we don't re-parse
//     every time the user runs a new analysis
// ============================================================

const pdfParse = require('pdf-parse');
const mammoth  = require('mammoth');
const fs       = require('fs');

const parseFile = async (filePath, fileType) => {
  try {
    if (fileType === 'pdf') {
      // fs.readFileSync returns a Buffer (raw binary data)
      // pdf-parse v2+ expects Uint8Array data for parsing.
      const dataBuffer = fs.readFileSync(filePath);
      const parser = new pdfParse.PDFParse(new Uint8Array(dataBuffer));
      const result = await parser.getText();
      return (result.text || '').trim();

    } else if (fileType === 'docx') {
      // mammoth extracts raw text from .docx XML structure
      // It also handles basic formatting like bullet points
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value.trim();

    } else {
      throw new Error('Unsupported file type. Only PDF and DOCX are supported.');
    }
  } catch (error) {
    throw new Error(`File parsing failed: ${error.message}`);
  }
};

module.exports = { parseFile };