import { useState } from 'react';
import { Send, Building, Briefcase, MessageSquare, Copy, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateOutreach } from '../api/outreachApi';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/layout/DashboardLayout';

const OutreachPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    targetRole: '',
    companyName: '',
    tone: 'professional'
  });
  const [result, setResult] = useState(null);
  const [copiedSection, setCopiedSection] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.targetRole || !formData.companyName) {
      toast.error('Please fill in both Role and Company Name.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await generateOutreach(formData);
      if (response.success && response.data) {
        setResult(response.data);
        toast.success('Outreach materials generated successfully!');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to generate outreach.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text, section) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <DashboardLayout title="Outreach">
        <div className="mx-auto max-w-5xl p-6 lg:p-8">
          <header className="mb-8">
            <h1 className="text-[28px] font-bold text-text-primary tracking-tight font-display flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-violet/10">
                <Send className="h-5 w-5 text-accent-violet" />
              </div>
              Cold Outreach Generator
            </h1>
            <p className="mt-2 text-[15px] text-text-secondary max-w-2xl">
              Leverage AI to draft highly targeted cold emails and LinkedIn messages for recruiters and hiring managers.
            </p>
          </header>

          <div className="grid gap-8 lg:grid-cols-[350px_1fr]">
            {/* Input Form */}
            <div className="rounded-2xl border border-border-subtle bg-bg-surface p-6 shadow-sm h-fit">
              <form onSubmit={handleGenerate} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-text-secondary">Target Role</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                    <input
                      type="text"
                      className="w-full rounded-xl border border-border-subtle bg-bg-base py-2.5 pl-10 pr-4 text-[14px] text-text-primary placeholder:text-text-muted focus:border-accent-violet focus:outline-none focus:ring-1 focus:ring-accent-violet transition-colors"
                      placeholder="e.g. Senior Frontend Engineer"
                      value={formData.targetRole}
                      onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-text-secondary">Company Name</label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                    <input
                      type="text"
                      className="w-full rounded-xl border border-border-subtle bg-bg-base py-2.5 pl-10 pr-4 text-[14px] text-text-primary placeholder:text-text-muted focus:border-accent-violet focus:outline-none focus:ring-1 focus:ring-accent-violet transition-colors"
                      placeholder="e.g. Google, Stripe"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-text-secondary">Tone</label>
                  <select
                    className="w-full rounded-xl border border-border-subtle bg-bg-base py-2.5 px-4 text-[14px] text-text-primary focus:border-accent-violet focus:outline-none focus:ring-1 focus:ring-accent-violet transition-colors appearance-none"
                    value={formData.tone}
                    onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                  >
                    <option value="professional">Professional & Direct</option>
                    <option value="enthusiastic">Enthusiastic & Passionate</option>
                    <option value="casual">Casual & Conversational</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-accent-violet py-3 text-[14px] font-semibold text-white transition hover:bg-accent-violet/90 active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2 mt-4"
                >
                  {isLoading ? 'Drafting...' : (
                    <>
                      <Send className="h-4 w-4" /> Generate Drafts
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Results Section */}
            <div className="rounded-2xl border border-border-subtle bg-bg-surface p-6 shadow-sm flex flex-col min-h-[500px]">
              {!result && !isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
                  <MessageSquare className="h-12 w-12 text-text-muted mb-4" />
                  <p className="text-[15px] text-text-secondary">Fill out the details on the left to generate personalized outreach drafts.</p>
                </div>
              ) : isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-violet border-t-transparent mb-4"></div>
                  <p className="text-[14px] text-text-secondary animate-pulse">Crafting the perfect message...</p>
                </div>
              ) : result ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Email Section */}
                  <div>
                    <h3 className="text-[15px] font-semibold text-text-primary mb-3 flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent-violet/10 text-accent-violet text-[12px]">1</span>
                      Cold Email
                    </h3>
                    
                    <div className="rounded-xl border border-border-subtle bg-bg-base overflow-hidden relative group">
                      <div className="border-b border-border-subtle bg-bg-surface px-4 py-3 flex justify-between items-center">
                        <span className="text-[13px] text-text-secondary font-medium">
                          Subject: <span className="text-text-primary font-semibold">{result.emailSubject}</span>
                        </span>
                        <button 
                          onClick={() => copyToClipboard(result.emailSubject + '\n\n' + result.emailBody, 'email')}
                          className="text-text-muted hover:text-text-primary transition p-1"
                          title="Copy Email"
                        >
                          {copiedSection === 'email' ? <CheckCircle2 className="h-4 w-4 text-accent-teal" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                      <div className="p-4 text-[14px] text-text-secondary whitespace-pre-wrap leading-relaxed">
                        {result.emailBody}
                      </div>
                    </div>
                  </div>

                  {/* LinkedIn Section */}
                  <div>
                    <h3 className="text-[15px] font-semibold text-text-primary mb-3 flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#0077b5]/10 text-[#0077b5] text-[12px]">2</span>
                      LinkedIn Connection Request
                    </h3>
                    <div className="rounded-xl border border-border-subtle bg-bg-base relative group">
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition">
                        <button 
                          onClick={() => copyToClipboard(result.linkedinMessage, 'linkedin')}
                          className="rounded-md bg-bg-surface p-1.5 border border-border-subtle text-text-muted hover:text-text-primary shadow-sm"
                          title="Copy LinkedIn Message"
                        >
                          {copiedSection === 'linkedin' ? <CheckCircle2 className="h-4 w-4 text-accent-teal" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                      <div className="p-4 text-[14px] text-text-secondary whitespace-pre-wrap leading-relaxed pr-12">
                        {result.linkedinMessage}
                      </div>
                      <div className="px-4 py-2 border-t border-border-subtle bg-bg-surface flex justify-between items-center rounded-b-xl">
                        <span className="text-[11px] text-text-muted">Max 300 characters</span>
                        <span className={`text-[11px] font-medium ${result.linkedinMessage.length > 300 ? 'text-red-400' : 'text-accent-teal'}`}>
                          {result.linkedinMessage.length} / 300
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </div>
          </div>
        </div>
    </DashboardLayout>
  );
};

export default OutreachPage;
