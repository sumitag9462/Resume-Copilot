// =============================================================
// src/components/resume/ResumeUploadZone.jsx
//
// Drag-and-drop file upload zone.
// Validates: only PDF/DOCX, max 5MB.
// Shows file preview after selection before upload.
// Calls onUpload(file) prop when user confirms.
// =============================================================

import { useState, useRef } from 'react'
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react'

const ACCEPTED = {
  'application/pdf': '.pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
}
const MAX_SIZE = 5 * 1024 * 1024  // 5MB

const ResumeUploadZone = ({ onUpload, uploading = false }) => {
  const [dragOver,  setDragOver]  = useState(false)
  const [file,      setFile]      = useState(null)
  const [error,     setError]     = useState('')
  const inputRef = useRef(null)

  const validate = (f) => {
    if (!ACCEPTED[f.type]) return 'Only PDF and DOCX files are accepted.'
    if (f.size > MAX_SIZE)  return 'File must be under 5MB.'
    return null
  }

  const handleFile = (f) => {
    const err = validate(f)
    if (err) { setError(err); setFile(null); return }
    setError('')
    setFile(f)
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const onInputChange = (e) => {
    const f = e.target.files[0]
    if (f) handleFile(f)
  }

  const handleUpload = async () => {
    if (file && onUpload) {
      const success = await onUpload(file)
      if (success) {
        clearFile()
      }
    }
  }

  const clearFile = () => { setFile(null); setError('') }

  const formatSize = (bytes) => {
    if (bytes < 1024)       return `${bytes} B`
    if (bytes < 1024*1024)  return `${(bytes/1024).toFixed(1)} KB`
    return `${(bytes/(1024*1024)).toFixed(1)} MB`
  }

  return (
    <div className="w-full space-y-4">
      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            bg-bg-elevated rounded-2xl border transition-all duration-300 p-6 text-center cursor-pointer group
            ${dragOver
              ? 'border-accent-violet bg-bg-muted/70 shadow-[0_0_20px_rgba(124,111,247,0.2)]'
              : 'border-border-normal hover:border-accent-violet/60 hover:bg-bg-muted'
            }
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx"
            onChange={onInputChange}
            className="hidden"
          />
          <div 
            className="p-8 flex flex-col items-center gap-4 transition-all duration-300"
            style={{
              background: 'linear-gradient(#181C24, #181C24) padding-box, linear-gradient(135deg, rgba(124,111,247,0.4), rgba(46,203,173,0.4)) border-box',
              border: '2px dashed transparent',
              borderRadius: '16px',
            }}
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center border border-border-normal bg-bg-surface transition-all duration-300 hover:scale-105 flex-shrink-0">
              <Upload className="w-7 h-7 text-accent-violet" />
            </div>
            <div>
              <p className="text-text-secondary text-base font-semibold font-display">
                {dragOver ? 'Drop it here!' : 'Drag & drop your resume'}
              </p>
              <p className="text-text-muted text-sm mt-1">
                or <span className="text-accent-violet hover:text-accent-violet-light underline font-medium">click to browse</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-bg-muted border border-border-subtle rounded-full text-xs text-text-muted font-medium font-display">PDF</span>
              <span className="px-3 py-1 bg-bg-muted border border-border-subtle rounded-full text-xs text-text-muted font-medium font-display">DOCX</span>
              <span className="px-3 py-1 bg-bg-muted border border-border-subtle rounded-full text-xs text-text-muted font-medium font-display">Max 5MB</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-border-normal bg-bg-surface rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-bg-muted rounded-xl flex items-center justify-center flex-shrink-0 border border-border-subtle">
              <FileText className="w-6 h-6 text-accent-violet" />
            </div>
            <div>
              <p className="font-semibold text-text-primary text-sm truncate max-w-[220px]">{file.name}</p>
              <p className="text-xs text-text-secondary mt-0.5">
                {file.type.includes('pdf') ? 'PDF Document' : 'Word Document'} · {formatSize(file.size)}
              </p>
            </div>
          </div>
          <button
            onClick={clearFile}
            className="p-2 hover:bg-red-500/10 rounded-lg text-text-secondary hover:text-red-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {file && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="btn-primary w-full py-3 text-base rounded-full bg-gradient-to-r from-accent-violet to-accent-teal text-white shadow-[0_12px_30px_rgba(124,111,247,0.25)] hover:opacity-95 transition"
        >
          {uploading ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Uploading & extracting text…
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Upload Resume
            </>
          )}
        </button>
      )}
    </div>
  )
}

export default ResumeUploadZone