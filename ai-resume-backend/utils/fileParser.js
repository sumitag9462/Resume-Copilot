// ============================================================
// utils/fileParser.js — FILE TEXT EXTRACTOR
//
// Extracts plain text from PDF and DOCX files.
// pdf-parse v2: uses new PDFParse(new Uint8Array(buffer)), releasing resources in finally.
// mammoth: extracts raw text from .docx XML structure.
// ============================================================

const pdfParse = require('pdf-parse');
const mammoth  = require('mammoth');
const fs       = require('fs');

const parseFile = async (filePath, fileType) => {
  let parser = null;
  try {
    const normalizedType = (fileType || '').toLowerCase().includes('pdf') || (filePath && filePath.toLowerCase().endsWith('.pdf'))
      ? 'pdf'
      : (fileType || '').toLowerCase().includes('docx') || (filePath && filePath.toLowerCase().endsWith('.docx'))
        ? 'docx'
        : null;

    if (normalizedType === 'pdf') {
      const dataBuffer = await fs.promises.readFile(filePath);
      if (!dataBuffer || dataBuffer.length < 10) {
        throw new Error('Corrupted or empty PDF file');
      }

      parser = new pdfParse.PDFParse(new Uint8Array(dataBuffer));
      const result = await parser.getText();
      const extractedText = (result && result.text ? result.text : '').trim();
      return extractedText;

    } else if (normalizedType === 'docx') {
      const result = await mammoth.extractRawText({ path: filePath });
      return (result.value || '').trim();

    } else {
      throw new Error('Unsupported file type. Only PDF and DOCX are supported.');
    }
  } catch (error) {
    throw new Error(`File parsing failed: ${error.message}`);
  } finally {
    if (parser && typeof parser.destroy === 'function') {
      try {
        await parser.destroy();
      } catch (destroyErr) {
        // Safe cleanup ignore
      }
    }
  }
};

module.exports = { parseFile };
