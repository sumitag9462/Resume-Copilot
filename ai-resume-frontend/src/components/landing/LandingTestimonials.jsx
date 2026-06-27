import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, BadgeCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

const testimonials = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Senior Software Engineer",
    company: "Google",
    text: "My ATS score improved from 62 to 94 within ten minutes. The AI suggestions were surprisingly accurate and perfectly highlighted my impact.",
    rating: 5,
    avatar: "SJ"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Product Manager",
    company: "Stripe",
    text: "The way it matches my resume against specific JDs is mind-blowing. It saved me hours of manual tweaking for every application.",
    rating: 5,
    avatar: "MC"
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "Data Scientist",
    company: "Netflix",
    text: "Finally, an AI tool that actually understands technical context. It didn't just add keywords, it restructured my achievements to tell a better story.",
    rating: 5,
    avatar: "ER"
  }
];

export default function LandingTestimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const next = () => setActiveIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-32 relative bg-base">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-display font-bold text-white mb-4"
          >
            Success Stories
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-400"
          >
            Join thousands of professionals landing their dream roles.
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="glass-card p-8 md:p-12 rounded-3xl border border-white/[0.05] relative overflow-hidden"
            >
              {/* Decorative Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent-violet/10 rounded-full blur-[80px]" />

              <div className="relative z-10">
                <div className="flex gap-1 mb-6 text-warning">
                  {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                
                <p className="text-2xl md:text-3xl text-slate-200 font-medium leading-relaxed mb-10">
                  "{testimonials[activeIndex].text}"
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent-violet to-accent-teal flex items-center justify-center text-lg font-bold text-white shadow-lg">
                    {testimonials[activeIndex].avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-bold text-white">{testimonials[activeIndex].name}</h4>
                      <BadgeCheck className="w-4 h-4 text-accent-teal" />
                    </div>
                    <p className="text-sm text-slate-400">
                      {testimonials[activeIndex].role} at <span className="text-white font-medium">{testimonials[activeIndex].company}</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex justify-center gap-4 mt-8">
            <button 
              onClick={prev}
              className="w-12 h-12 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all"
              aria-label="Previous Testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={next}
              className="w-12 h-12 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all"
              aria-label="Next Testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
