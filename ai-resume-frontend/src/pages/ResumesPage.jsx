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
        <div className="mb-8 rounded-3xl border border-white/10 bg-[linear-gradient(135deg,#151523_0%,#131B30_48%,#101828_100%)] p-6 shadow-[0_26px_60px_rgba(15,23,42,0.45)]">
          <p className="text-xs uppercase tracking-[0.3em] text-[#A78BFA]">Resume Hub</p>
          <h1 className="mt-1 font-heading text-2xl font-bold text-white">My Resumes</h1>
          <p className="mt-2 text-sm text-slate-300">Upload, manage, and analyze all your resume versions in one polished workspace.</p>
        </div>

        {/* Upload section */}
        <div className="card p-6 mb-8">
          <h2 className="mb-4 flex items-center gap-2 font-heading font-semibold text-white">
            <span className="w-1.5 h-5 bg-brand-600 rounded-full" />
            Upload New Resume
          </h2>
          <ResumeUploadZone onUpload={handleUpload} uploading={uploading} />
        </div>

        {/* Resumes list */}
        <div>
          <div className="flex items-center justify-between mb-4">
              <h2 className="flex items-center gap-2 font-heading font-semibold text-white">
              <span className="w-1.5 h-5 bg-purple-500 rounded-full" />
              All Resumes
              {!loading && (
                <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {resumes.length}
                </span>
              )}
            </h2>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card p-5 flex items-center gap-4">
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
            <div className="card p-12 text-center">
              <div className="w-20 h-20 bg-brand-50 rounded-3xl flex items-center justify-center mx-auto mb-5">
                <Files className="w-10 h-10 text-brand-300" />
              </div>
              <h3 className="font-heading font-semibold text-white">No resumes uploaded yet</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm text-slate-300">
                Upload your first resume above to start getting AI-powered insights.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {resumes.map((resume) => (
                <div
                  key={resume._id}
                  className={`card p-5 flex items-center gap-4 transition-all duration-200 ${
                    deleting === resume._id ? 'opacity-50 pointer-events-none' : 'hover:border-brand-200 hover:shadow-card-hover'
                  }`}
                >
                  {/* File icon */}
                  <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Files className="w-6 h-6 text-brand-600" />
                  </div>

                  {/* File info */}
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-semibold text-white">{resume.originalName}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(resume.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </span>
                      <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs font-medium uppercase text-slate-300">
                        {resume.fileType}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      to={`/analyzer?resumeId=${resume._id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 rounded-lg transition-colors"
                      title="ATS Analysis"
                    >
                      <ScanText className="w-3.5 h-3.5" /> ATS
                    </Link>
                    <Link
                      to={`/jd-match?resumeId=${resume._id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors"
                      title="JD Match"
                    >
                      <Briefcase className="w-3.5 h-3.5" /> Match
                    </Link>
                    <Link
                      to={`/cover-letter?resumeId=${resume._id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                      title="Cover Letter"
                    >
                      <FileText className="w-3.5 h-3.5" /> Letter
                    </Link>
                    <button
                      onClick={() => handleDelete(resume._id, resume.originalName)}
                      disabled={deleting === resume._id}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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