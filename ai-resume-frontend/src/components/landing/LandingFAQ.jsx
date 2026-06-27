import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircleQuestion } from 'lucide-react';

const faqs = [
  { q: "How does ATS scoring work?", a: "Our AI simulates how major Applicant Tracking Systems (ATS) like Workday, Taleo, and Greenhouse parse your resume. It checks for formatting, keyword density, and section recognition to predict your score." },
  { q: "How accurate are AI recommendations?", a: "Highly accurate. Our models are trained on millions of successful resumes and continuously updated against current job market trends and JD matching algorithms." },
  { q: "Can recruiters see my resume?", a: "No. Your resume is entirely private unless you explicitly choose to share it or export it. We do not operate a public database of candidates." },
  { q: "Can I export to PDF?", a: "Yes, Pro users can export optimized resumes in both PDF and Word formats, ensuring ATS compatibility and perfect formatting." },
  { q: "What AI model is used?", a: "We use a combination of fine-tuned Gemini 1.5 Pro and our proprietary matching algorithms specifically designed for career contexts." },
  { q: "Can universities use this platform?", a: "Absolutely. We offer an Enterprise plan tailored for placement cells, allowing batch processing, student analytics, and custom branding." },
  { q: "Do I need coding knowledge?", a: "Not at all. Resume Copilot is designed to be intuitive and accessible for professionals across all industries, from tech to finance to healthcare." },
  { q: "Can I customize resumes?", a: "Yes, you can generate multiple versions of your resume tailored to different specific job descriptions using our JD Match feature." }
];

export default function LandingFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="py-32 relative bg-base">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.08] mb-6"
          >
            <MessageCircleQuestion className="w-6 h-6 text-slate-400" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-display font-bold text-white mb-4"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400"
          >
            Everything you need to know about Resume Copilot.
          </motion.p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel border border-white/[0.05] rounded-2xl overflow-hidden hover:border-white/[0.1] transition-colors"
            >
              <button 
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className={`text-base md:text-lg font-medium transition-colors ${openIndex === i ? 'text-white' : 'text-slate-300'}`}>
                  {faq.q}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${openIndex === i ? 'bg-accent-violet/20 text-accent-violet' : 'bg-white/[0.03] text-slate-500'}`}>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} />
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-slate-400 leading-relaxed text-base border-t border-white/[0.03]">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
