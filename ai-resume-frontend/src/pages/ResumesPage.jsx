import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Files, Trash2, ScanText, Briefcase, FileText, Clock, UploadCloud, HardDrive, AlertCircle, Plus, ChevronRight, CheckCircle2, File, X } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import ResumeUploadZone from '../components/resume/ResumeUploadZone'
import { getAllResumes, uploadResume, deleteResume } from '../api/resumeApi'
import toast from 'react-hot-toast'
import GlassCard from '../components/ui/GlassCard'
import GradientButton from '../components/ui/GradientButton'

const ResumesPage = () => {
  const [resumes,   setResumes]   = useState([])
  const [loading,   setLoading]   = useState(true)
  const [uploading, setUploading] = useState(false)
  const [deleting,  setDeleting]  = useState(null)
  const [showUpload, setShowUpload] = useState(false)

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

  const handleUpload = async (file) => {
    setUploading(true)
    try {
      const data = await uploadResume(file)
      toast.success('Resume uploaded successfully! ✅')
      setResumes((prev) => [data.resume, ...prev])
      setShowUpload(false)
      return true
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed. Please try again.')
      return false
    } finally {
      setUploading(false)
    }
  }

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
      <div className="mx-auto w-full max-w-[1200px] flex flex-col gap-8">

        {/* Premium Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-md">
              <Files className="h-3.5 w-3.5 text-accent-violet-light" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">Document Hub</span>
            </div>
            <h1 className="font-display text-4xl lg:text-5xl font-bold tracking-tight text-white mb-2">
              My Resumes
            </h1>
            <p className="text-sm text-slate-400 max-w-lg leading-relaxed">
              Upload, manage, and analyze your master and targeted resumes. Create multiple versions tailored to specific roles.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <GlassCard className="flex items-center gap-4 px-5 py-3 rounded-2xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.05]">
                <HardDrive className="h-4 w-4 text-accent-teal" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-0.5">Storage</p>
                <p className="text-[14px] font-bold text-white leading-none">{resumes.length} / <span className="text-slate-500">Unlimited</span></p>
              </div>
            </GlassCard>
            
            <GradientButton onClick={() => setShowUpload(!showUpload)} className="h-14 px-6 rounded-2xl">
              {showUpload ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              {showUpload ? 'Cancel Upload' : 'Upload Resume'}
            </GradientButton>
          </div>
        </div>

        {/* Upload Zone (Collapsible) */}
        <AnimatePresence>
          {(showUpload || resumes.length === 0) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden z-10 relative"
            >
              <GlassCard className="p-8 lg:p-12 border border-accent-violet/30 shadow-[0_0_50px_rgba(124,111,247,0.15)] relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none" />
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent-violet/20 blur-[100px] rounded-full pointer-events-none transition-transform duration-700 group-hover:scale-150 group-hover:bg-accent-violet/30" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-teal/20 blur-[100px] rounded-full pointer-events-none transition-transform duration-700 group-hover:scale-150 group-hover:bg-accent-teal/30" />
                
                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-display font-bold text-white mb-2">Upload Center</h2>
                    <p className="text-sm text-slate-400">Drag and drop your PDF or DOCX file to begin AI analysis.</p>
                  </div>
                  <ResumeUploadZone onUpload={handleUpload} uploading={uploading} />
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resumes Grid */}
        <div className="relative z-10">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-[12px] font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-violet animate-pulse" />
              Document Library
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <GlassCard key={i} className="p-6 h-64 flex flex-col justify-between">
                  <div className="skeleton h-12 w-12 rounded-xl mb-4" />
                  <div className="space-y-3">
                    <div className="skeleton h-4 w-[80%] rounded" />
                    <div className="skeleton h-3 w-[40%] rounded" />
                  </div>
                  <div className="flex gap-2 mt-6">
                    <div className="skeleton h-8 w-20 rounded-lg" />
                    <div className="skeleton h-8 w-20 rounded-lg" />
                  </div>
                </GlassCard>
              ))}
            </div>
          ) : resumes.length === 0 && !showUpload ? (
             null // Empty state handled by the auto-showing upload zone above
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {resumes.map((resume, index) => (
                  <motion.div
                    key={resume._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                  >
                    <GlassCard 
                      hoverEffect
                      className={`h-[280px] flex flex-col p-6 group cursor-default transition-all duration-300 ${
                        deleting === resume._id ? 'pointer-events-none opacity-50 scale-95' : ''
                      }`}
                    >
                      {/* Document Wireframe Background Graphic */}
                      <div className="absolute right-0 top-0 w-32 h-32 opacity-5 pointer-events-none overflow-hidden rounded-tr-3xl">
                        <File className="w-48 h-48 -mt-8 -mr-8 text-white rotate-12 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110" />
                      </div>

                      <div className="flex justify-between items-start mb-auto relative z-10">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.02] shadow-inner transition-colors duration-500 group-hover:border-accent-violet/50 group-hover:bg-accent-violet/10 group-hover:shadow-[0_0_20px_rgba(124,111,247,0.2)]">
                          <Files className="h-6 w-6 text-slate-400 transition-colors duration-500 group-hover:text-accent-violet-light" />
                        </div>
                        <div className="flex flex-col items-end gap-2">
                           <button
                            onClick={() => handleDelete(resume._id, resume.originalName)}
                            disabled={deleting === resume._id}
                            className="flex h-8 w-8 items-center justify-center rounded-xl border border-transparent text-slate-500 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30"
                            title="Delete resume"
                          >
                            {deleting === resume._id
                              ? <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-400/30 border-t-red-500" />
                              : <Trash2 className="h-3.5 w-3.5" />
                            }
                          </button>
                        </div>
                      </div>

                      <div className="relative z-10 mt-6">
                        <p className="truncate text-lg font-display font-bold text-white transition-colors group-hover:text-accent-violet-light">{resume.originalName}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="flex items-center gap-1.5 rounded-lg bg-white/[0.04] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border border-white/[0.05]">
                            <Clock className="h-3 w-3" />
                            {new Date(resume.createdAt).toLocaleDateString()}
                          </span>
                          <span className="rounded-lg bg-white/[0.04] px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 border border-white/[0.05]">
                            {resume.fileType.replace('.', '')}
                          </span>
                        </div>
                      </div>

                      {/* Hover Quick Actions */}
                      <div className="relative z-10 mt-6 flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-2 px-2">
                        <Link
                          to={`/analyzer?resumeId=${resume._id}`}
                          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-300 transition-all hover:border-accent-teal/50 hover:bg-accent-teal/20 hover:text-accent-teal-light shadow-sm"
                        >
                          <ScanText className="h-3.5 w-3.5" /> Analyze
                        </Link>
                        <Link
                          to={`/jd-match?resumeId=${resume._id}`}
                          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-300 transition-all hover:border-accent-violet/50 hover:bg-accent-violet/20 hover:text-accent-violet-light shadow-sm"
                        >
                          <Briefcase className="h-3.5 w-3.5" /> Match
                        </Link>
                        <Link
                          to={`/cover-letter?resumeId=${resume._id}`}
                          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-300 transition-all hover:border-amber-500/50 hover:bg-amber-500/20 hover:text-amber-300 shadow-sm"
                        >
                          <FileText className="h-3.5 w-3.5" /> Letter
                        </Link>
                      </div>

                    </GlassCard>
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