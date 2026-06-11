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

  const handleUpload = () => {
    if (file && onUpload) onUpload(file)
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
            relative border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer
            transition-all duration-300 group overflow-hidden
            ${dragOver
              ? 'border-brand-500 bg-gradient-to-br from-brand-50 via-white to-purple-50 scale-[1.01] shadow-glow'
              : 'border-slate-200 hover:border-brand-400 hover:bg-gradient-to-br hover:from-brand-50 hover:via-white hover:to-purple-50 hover:shadow-card-hover'
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
          <div className="flex flex-col items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300
              ${dragOver ? 'bg-brand-100 scale-110' : 'bg-slate-100 group-hover:bg-brand-100 group-hover:scale-105'}`}>
              <Upload className={`w-7 h-7 transition-colors ${dragOver ? 'text-brand-600' : 'text-slate-400 group-hover:text-brand-600'}`} />
            </div>
            <div>
              <p className="text-slate-800 font-semibold font-heading text-lg">
                {dragOver ? 'Drop it here!' : 'Drag & drop your resume'}
              </p>
              <p className="text-slate-400 text-sm mt-1">
                or <span className="text-brand-600 font-medium">click to browse</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-500 font-medium">PDF</span>
              <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-500 font-medium">DOCX</span>
              <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-500 font-medium">Max 5MB</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-brand-200 bg-brand-50/40 rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-brand-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm truncate max-w-[220px]">{file.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {file.type.includes('pdf') ? 'PDF Document' : 'Word Document'} · {formatSize(file.size)}
              </p>
            </div>
          </div>
          <button
            onClick={clearFile}
            className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {file && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="btn-primary w-full py-3 text-base"
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