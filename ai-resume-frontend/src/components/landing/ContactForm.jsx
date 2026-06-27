import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageSquare, User, Mail, Loader2 } from 'lucide-react';
import api from '../../api/axiosConfig';
import toast from 'react-hot-toast';
import GlassCard from '../ui/GlassCard';
import GradientButton from '../ui/GradientButton';

const MotionGlassCard = motion(GlassCard);

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact/submit', formData);
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-32 relative bg-base border-t border-white/[0.04] overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-violet/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-6"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-300">Get in touch</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight"
          >
            Have a question? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-violet to-accent-teal">We'd love to hear from you.</span>
          </motion.h2>
        </div>

        <MotionGlassCard 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="card-3d p-8 md:p-12 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] max-w-2xl mx-auto"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <User className="w-4 h-4 text-accent-violet" /> Name
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="John Doe"
                  className="w-full bg-[#1A1D27]/80 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-accent-violet focus:ring-1 focus:ring-accent-violet transition-colors"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-accent-teal" /> Email
                </label>
                <input 
                  type="email" 
                  required
                  placeholder="john@example.com"
                  className="w-full bg-[#1A1D27]/80 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-accent-teal focus:ring-1 focus:ring-accent-teal transition-colors"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-400" /> Message
              </label>
              <textarea 
                required
                rows="5"
                placeholder="How can we help you?"
                className="w-full bg-[#1A1D27]/80 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors resize-none"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              />
            </div>

            <GradientButton 
              type="submit" 
              disabled={loading}
              className="w-full h-14 text-base shadow-[0_0_30px_rgba(124,111,247,0.3)] mt-4 disabled:opacity-70 flex items-center justify-center"
            >
              {loading ? (
                <>Sending... <Loader2 className="w-5 h-5 ml-2 animate-spin" /></>
              ) : (
                <>Send Message <Send className="w-5 h-5 ml-2" /></>
              )}
            </GradientButton>
          </form>
        </MotionGlassCard>
      </div>
    </section>
  );
}
