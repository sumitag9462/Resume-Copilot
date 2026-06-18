import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const testimonials = [
  { quote: 'The ATS score jumped from 54 to 89 and I got 3 interview calls in 2 weeks.', author: 'Rahul S.', role: 'Software Engineer', company: 'Google' },
  { quote: 'The JD match feature told me exactly which keywords I was missing for every role.', author: 'Priya M.', role: 'Product Manager', company: 'Amazon' },
  { quote: 'Cover letter AI saved me hours. The startup tone felt genuinely polished.', author: 'Arjun K.', role: 'UX Designer', company: 'Figma' },
  { quote: 'It gave me an honest ATS check — exactly what I needed to improve fast.', author: 'Vikram D.', role: 'Backend Developer', company: 'Stripe' },
  { quote: 'I used 4 resume versions and tracked which one performed best for different roles.', author: 'Meera J.', role: 'Business Analyst', company: 'Microsoft' },
  { quote: 'From zero responses to interview invites — the insights were concrete and actionable.', author: 'Sneha T.', role: 'Data Analyst', company: 'Meta' },
];

export default function TestimonialCarousel() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const x = useTransform(scrollYProgress, [0, 1], [100, -300]);

  return (
    <section ref={containerRef} className="py-32 relative bg-base overflow-hidden">
      <div className="text-center max-w-3xl mx-auto mb-20 px-6">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
          Wall of Love
        </h2>
        <p className="text-slate-400 text-lg">Don't just take our word for it. Here's what job seekers are saying.</p>
      </div>

      <div className="relative w-full overflow-hidden flex flex-col gap-6">
        {/* Track 1 */}
        <motion.div style={{ x }} className="flex gap-6 w-max pl-[10vw]">
          {[...testimonials, ...testimonials].map((t, i) => (
            <div 
              key={i} 
              className="w-[400px] flex-shrink-0 card p-8 rounded-3xl bg-[#111318]/60 backdrop-blur-md border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(124,111,247,0.15)] group"
            >
              <div className="flex text-amber-400 mb-6">
                {'★★★★★'}
              </div>
              <p className="text-slate-300 text-[15px] leading-relaxed mb-6">"{t.quote}"</p>
              <div className="flex items-center gap-4 mt-auto pt-6 border-t border-white/5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-violet to-accent-teal flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(124,111,247,0.3)]">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{t.author}</div>
                  <div className="text-xs text-slate-500">{t.role} · {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
