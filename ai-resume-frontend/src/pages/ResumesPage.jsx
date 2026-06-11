// =============================================================
// src/pages/ResumesPage.jsx — MY RESUMES
//
// Shows:
//   - Upload zone (top)
//   - List of all uploaded resumes
//   - Delete button per resume
//   - Links to analyze each resume
// =============================================================

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Files, Trash2, ScanText, Briefcase, FileText, Clock, AlertCircle } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import ResumeUploadZone from '../components/resume/ResumeUploadZone'
import { getAllResumes, uploadResume, deleteResume } from '../api/resumeApi'
import toast from 'react-hot-toast'

const ResumesPage = () => {
  const [resumes,   setResumes]   = useState([])
  const [loading,   setLoading]   = useState(true)
  const [uploading, setUploading] = useState(false)
  const [deleting,  setDeleting]  = useState(null)  // stores the _id being deleted

  // Fetch resumes on mount
  const fetchResumes = async () => {
    try {
      const data = await getAllResumes()
      setResumes(data.resumes || [])
    } catch {
      toast.error('Could not load resumes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchResumes() }, [])

  // Upload handler
  const handleUpload = async (file) => {
    setUploading(true)
    try {
      const data = await uploadResume(file)
      toast.success('Resume uploaded successfully! ✅')
      setResumes((prev) => [data.resume, ...prev])
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  // Delete handler
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return
    setDeleting(id)
    try {
      await deleteResume(id)
      setResumes((prev) => prev.filter((r) => r._id !== id))
      toast.success('Resume deleted')
    } catch {
      toast.error('Could not delete resume')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <DashboardLayout>
      <div className="p-8 max-w-4xl mx-auto page-enter">

        {/* Header */}
        <div className="mb-8 rounded-2xl border border-border-normal bg-[linear-gradient(135deg,#111318_0%,#181C24_100%)] p-6 shadow-[0_26px_60px_rgba(0,0,0,0.45)]">
          <p className="text-xs uppercase tracking-[0.3em] text-accent-violet">Resume Hub</p>
          <h1 className="mt-1 font-display text-2xl font-bold text-text-primary">My Resumes</h1>
          <p className="mt-2 text-sm text-text-secondary">Upload, manage, and analyze all your resume versions in one polished workspace.</p>
        </div>

        {/* Upload section */}
        <div className="card p-6 mb-8 border border-border-normal bg-bg-surface">
          <h2 className="mb-4 flex items-center gap-2 font-display font-semibold text-text-primary">
            <span className="w-1 h-5 bg-gradient-to-b from-accent-violet to-accent-teal rounded-full" />
            Upload New Resume
          </h2>
          <ResumeUploadZone onUpload={handleUpload} uploading={uploading} />
        </div>

        {/* Resumes list */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center gap-2 font-display font-semibold text-text-primary">
              <span className="w-1 h-5 bg-gradient-to-b from-accent-violet to-accent-teal rounded-full" />
              All Resumes
              {!loading && (
                <span className="text-xs font-normal text-text-muted bg-bg-muted px-2 py-0.5 rounded-full">
                  {resumes.length}
                </span>
              )}
            </h2>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card p-5 flex items-center gap-4 border border-border-normal bg-bg-surface">
                  <div className="skeleton w-12 h-12 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-3.5 w-64 rounded" />
                    <div className="skeleton h-2.5 w-40 rounded" />
                  </div>
                  <div className="skeleton w-24 h-8 rounded-lg" />
                </div>
              ))}
            </div>
          ) : resumes.length === 0 ? (
            <div className="card p-12 text-center bg-bg-surface border border-border-normal">
              <div className="w-20 h-20 bg-gradient-to-br from-accent-violet/10 to-accent-teal/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Files className="w-10 h-10 text-accent-violet" />
              </div>
              <h3 className="font-display font-semibold text-text-primary text-lg">No resumes uploaded yet</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm text-text-secondary">
                Upload your first resume above to start getting AI-powered insights.
              </p>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent-violet to-accent-teal px-5 py-2.5 text-sm font-medium text-white shadow-[0_0_24px_rgba(124,111,247,0.25)] transition hover:opacity-95"
              >
                Upload your first resume
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {resumes.map((resume) => (
                <div
                  key={resume._id}
                  className={`card p-5 flex items-center gap-4 transition-all duration-200 border border-border-normal bg-bg-surface ${
                    deleting === resume._id ? 'opacity-50 pointer-events-none' : 'hover:border-border-strong hover:bg-bg-elevated/40'
                  }`}
                >
                  {/* File icon */}
                  <div className="w-12 h-12 bg-bg-muted rounded-xl flex items-center justify-center flex-shrink-0 border border-border-subtle">
                    <Files className="w-6 h-6 text-accent-violet" />
                  </div>

                  {/* File info */}
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-semibold text-text-primary">{resume.originalName}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-text-secondary flex items-center gap-1">
                        <Clock className="w-3 h-3 text-text-muted" />
                        {new Date(resume.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </span>
                      <span className="rounded-full bg-bg-muted border border-border-subtle px-2 py-0.5 text-xs font-medium uppercase text-text-secondary">
                        {resume.fileType}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      to={`/analyzer?resumeId=${resume._id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-accent-teal bg-accent-teal/10 hover:bg-accent-teal/20 border border-accent-teal/25 rounded-lg transition-colors"
                      title="ATS Analysis"
                    >
                      <ScanText className="w-3.5 h-3.5" /> ATS
                    </Link>
                    <Link
                      to={`/jd-match?resumeId=${resume._id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-accent-violet bg-accent-violet/10 hover:bg-accent-violet/20 border border-accent-violet/25 rounded-lg transition-colors"
                      title="JD Match"
                    >
                      <Briefcase className="w-3.5 h-3.5" /> Match
                    </Link>
                    <Link
                      to={`/cover-letter?resumeId=${resume._id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 rounded-lg transition-colors"
                      title="Cover Letter"
                    >
                      <FileText className="w-3.5 h-3.5" /> Letter
                    </Link>
                    <button
                      onClick={() => handleDelete(resume._id, resume.originalName)}
                      disabled={deleting === resume._id}
                      className="p-2 text-text-secondary hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete resume"
                    >
                      {deleting === resume._id
                        ? <div className="w-4 h-4 rounded-full border-2 border-red-300 border-t-red-500 animate-spin" />
                        : <Trash2 className="w-4 h-4" />
                      }
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ResumesPage