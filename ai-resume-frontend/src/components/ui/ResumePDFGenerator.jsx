import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';
import html2pdf from 'html2pdf.js';
import toast from 'react-hot-toast';

const ResumePDFGenerator = forwardRef(({ markdownContent }, ref) => {
  const printRef = useRef();

  useImperativeHandle(ref, () => ({
    generatePDF: (filename = "Resume.pdf") => {
      const element = printRef.current;
      if (!element) return;

      const opt = {
        margin:       [15, 15, 15, 15],
        filename:     filename,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      const loadingToast = toast.loading('Generating Professional PDF...');
      
      // We must render it temporarily to the DOM in a visible way for html2canvas to capture it
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = '800px';
      container.style.zIndex = '-9999'; // Hidden behind the app background
      container.style.background = '#ffffff';
      
      const clone = element.cloneNode(true);
      clone.style.display = 'block';
      container.appendChild(clone);
      document.body.appendChild(container);
      
      html2pdf().set(opt).from(container).save().then(() => {
        document.body.removeChild(container);
        toast.dismiss(loadingToast);
        toast.success("PDF Downloaded!");
      }).catch(err => {
        if (document.body.contains(container)) {
          document.body.removeChild(container);
        }
        toast.dismiss(loadingToast);
        toast.error("Failed to generate PDF");
        console.error(err);
      });
    }
  }));

  // We apply professional, clean CSS styling that html2pdf will capture
  return (
    <div style={{ display: 'none' }}>
      <div 
        ref={printRef} 
        style={{
          width: '800px', // Standard width for A4 relative to standard font sizes
        padding: '0',
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          color: '#333',
          lineHeight: '1.5',
          backgroundColor: '#fff',
          boxSizing: 'border-box'
        }}
        className="resume-pdf-template"
      >
        <style>
          {`
            .resume-pdf-template h1 { font-size: 26px; font-weight: bold; margin-bottom: 5px; text-align: center; color: #111; text-transform: uppercase; letter-spacing: 1px; }
            .resume-pdf-template h2 { font-size: 16px; font-weight: bold; margin-top: 18px; margin-bottom: 8px; color: #222; border-bottom: 1px solid #ccc; padding-bottom: 2px; text-transform: uppercase; }
            .resume-pdf-template h3 { font-size: 14px; font-weight: bold; margin-top: 10px; margin-bottom: 4px; color: #333; }
            .resume-pdf-template p { font-size: 12px; margin-bottom: 8px; }
            .resume-pdf-template ul { margin-top: 4px; margin-bottom: 8px; padding-left: 20px; font-size: 12px; }
            .resume-pdf-template li { margin-bottom: 4px; }
            .resume-pdf-template a { color: #0056b3; text-decoration: none; }
            .resume-pdf-template strong { font-weight: bold; color: #111; }
          `}
        </style>
        <ReactMarkdown>
          {markdownContent || ""}
        </ReactMarkdown>
      </div>
    </div>
  );
});

export default ResumePDFGenerator;
