import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Files, Trash2, ScanText, Briefcase, FileText, Clock, UploadCloud, HardDrive, AlertCircle } from 'lucide-react'
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
      return true
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed. Please try again.')
      return false
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
      <div className="mx-auto w-full max-w-[1000px] page-enter">

        {/* Premium Contextual Header */}
        <div className="mb-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent-violet/20 bg-accent-violet/5 px-3 py-1">
              <UploadCloud className="h-3.5 w-3.5 text-accent-violet-light" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-violet-light">Document Hub</span>
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-white">My Resumes</h1>
            <p className="mt-2 text-[14px] text-slate-400">Upload, manage, and analyze your master and targeted resumes.</p>
          </div>

          <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-white/[0.06] bg-[#0E101A] p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04]">
              <HardDrive className="h-5 w-5 text-slate-400" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Storage Used</p>
              <p className="text-[14px] font-bold text-white">{resumes.length} / <span className="text-slate-400">Unlimited</span></p>
            </div>
          </div>
        </div>

        {/* Upload Zone */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card mb-10 overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/[0.06] bg-[#0A0B0F] px-6 py-4">
            <h2 className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.1em] text-slate-300">
              <span className="h-4 w-1.5 rounded-full bg-gradient-to-b from-accent-violet to-accent-teal" />
              Upload New Resume
            </h2>
          </div>
          <div className="p-6">
            <ResumeUploadZone onUpload={handleUpload} uploading={uploading} />
          </div>
        </motion.div>

        {/* Resumes List */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[12px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Uploaded Documents
              {!loading && resumes.length > 0 && (
                <span className="ml-2 inline-flex items-center justify-center rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-white">
                  {resumes.length}
                </span>
              )}
            </h2>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card flex items-center gap-4 p-5">
                  <div className="skeleton h-12 w-12 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-3.5 w-64 rounded" />
                    <div className="skeleton h-2.5 w-40 rounded" />
                  </div>
                  <div className="skeleton h-8 w-24 rounded-lg" />
                </div>
              ))}
            </div>
          ) : resumes.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card flex flex-col items-center justify-center border border-dashed border-white/[0.1] bg-white/[0.01] px-6 py-16 text-center">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-violet/10 to-accent-teal/10 shadow-[0_0_30px_rgba(124,111,247,0.15)] ring-1 ring-white/[0.05]">
                <Files className="h-8 w-8 text-accent-violet-light" />
              </div>
              <h3 className="font-display text-lg font-bold text-white">No resumes uploaded yet</h3>
              <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-slate-400">
                Upload your master resume to start generating cover letters, matching with jobs, and getting AI-powered ATS insights.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {resumes.map((resume) => (
                  <motion.div
                    key={resume._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
                    className={`card group relative overflow-hidden p-5 transition-all duration-300 ${
                      deleting === resume._id ? 'pointer-events-none opacity-50' : 'hover:-translate-y-0.5 hover:border-accent-violet/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-accent-violet/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    
                    <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                      {/* Icon */}
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-[#0A0B0F] transition-colors group-hover:border-accent-violet/30 group-hover:bg-accent-violet/10">
                        <Files className="h-5 w-5 text-slate-400 transition-colors group-hover:text-accent-violet-light" />
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[15px] font-bold text-white">{resume.originalName}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-3">
                          <span className="flex items-center gap-1.5 text-[12px] font-medium text-slate-400">
                            <Clock className="h-3 w-3" />
                            {new Date(resume.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          <span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            {resume.fileType}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex shrink-0 flex-wrap items-center gap-2">
                        <Link
                          to={`/analyzer?resumeId=${resume._id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-accent-teal/20 bg-accent-teal/10 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-accent-teal transition-colors hover:border-accent-teal/40 hover:bg-accent-teal/20"
                        >
                          <ScanText className="h-3.5 w-3.5" /> Analyze
                        </Link>
                        <Link
                          to={`/jd-match?resumeId=${resume._id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-accent-violet/20 bg-accent-violet/10 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-accent-violet transition-colors hover:border-accent-violet/40 hover:bg-accent-violet/20"
                        >
                          <Briefcase className="h-3.5 w-3.5" /> Match
                        </Link>
                        <Link
                          to={`/cover-letter?resumeId=${resume._id}`}
                          className="hidden items-center gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-amber-500 transition-colors hover:border-amber-500/40 hover:bg-amber-500/20 md:inline-flex"
                        >
                          <FileText className="h-3.5 w-3.5" /> Letter
                        </Link>
                        
                        <div className="h-8 w-px bg-white/[0.08] mx-1 hidden sm:block" />
                        
                        <button
                          onClick={() => handleDelete(resume._id, resume.originalName)}
                          disabled={deleting === resume._id}
                          className="flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-transparent text-slate-500 transition-colors hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                          title="Delete resume"
                        >
                          {deleting === resume._id
                            ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-400/30 border-t-red-500" />
                            : <Trash2 className="h-4 w-4" />
                          }
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ResumesPage