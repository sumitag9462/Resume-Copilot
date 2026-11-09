const path = require('path');
const fs = require('fs');
const { parseFile } = require('../utils/fileParser');

describe('Phase 2: File Parser Engine (Real, Unmocked)', () => {
  const samplePdfPath = path.resolve(__dirname, 'fixtures', 'sample.pdf');
  const sampleDocxPath = path.resolve(__dirname, 'fixtures', 'sample.docx');

  test('A09: parses real PDF file without mocking and extracts text (> 50 chars)', async () => {
    expect(fs.existsSync(samplePdfPath)).toBe(true);
    const text = await parseFile(samplePdfPath, 'pdf');

    expect(typeof text).toBe('string');
    expect(text.length).toBeGreaterThan(50);
    expect(text).toContain('Jane Doe');
  });

  test('A09: parses real DOCX file without mocking and extracts text (> 50 chars)', async () => {
    expect(fs.existsSync(sampleDocxPath)).toBe(true);
    const text = await parseFile(sampleDocxPath, 'docx');

    expect(typeof text).toBe('string');
    expect(text.length).toBeGreaterThan(50);
    expect(text).toContain('Jane Doe');
    expect(text).toContain('Full Stack Engineer');
  });

  test('A09: throws descriptive error on empty or corrupted PDF file', async () => {
    const corruptPath = path.resolve(__dirname, 'fixtures', 'corrupt.pdf');
    fs.writeFileSync(corruptPath, 'corrupt data');

    try {
      await expect(parseFile(corruptPath, 'pdf')).rejects.toThrow(/File parsing failed/);
    } finally {
      if (fs.existsSync(corruptPath)) {
        fs.unlinkSync(corruptPath);
      }
    }
  });

  test('A09: throws descriptive error for unsupported file type', async () => {
    const txtPath = path.resolve(__dirname, 'fixtures', 'unsupported.xyz');
    fs.writeFileSync(txtPath, 'some text content');

    try {
      await expect(parseFile(txtPath, 'xyz')).rejects.toThrow(/Unsupported file type/);
    } finally {
      if (fs.existsSync(txtPath)) {
        fs.unlinkSync(txtPath);
      }
    }
  });
});

