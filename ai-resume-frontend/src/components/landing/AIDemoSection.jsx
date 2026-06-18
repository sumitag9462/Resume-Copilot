import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FileUp, Search, Brain, Target, Mail, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const pipelineSteps = [
  { id: 'upload', icon: FileUp, title: 'Resume Upload', desc: 'PDF/DOCX ingested and text extracted.', color: '#7C5CFC' },
  { id: 'parse', icon: Search, title: 'AI Parsing', desc: 'Entities, skills, and experience mapped.', color: '#5B8FFF' },
  { id: 'analyze', icon: Brain, title: 'ATS Analysis', desc: 'Format and keyword checks performed.', color: '#00D4AA' },
  { id: 'match', icon: Target, title: 'JD Match', desc: 'Scored against target job description.', color: '#F59E0B' },
  { id: 'cover', icon: Mail, title: 'Cover Letter', desc: 'AI generates highly tailored letter.', color: '#F472B6' },
];

export default function AIDemoSection() {
  const containerRef = useRef(null);
  const lineRef = useRef(null);
  const packetRef = useRef(null);
  const stepsRefs = useRef([]);

  useEffect(() => {
    if (!containerRef.current || !lineRef.current || !packetRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 30%',
        end: 'bottom 70%',
        scrub: 1,
      }
    });

    // Animate the line drawing down
    tl.fromTo(lineRef.current, { height: '0%' }, { height: '100%', ease: 'none' }, 0);
    
    // Animate the packet moving down
    tl.fromTo(packetRef.current, { top: '0%' }, { top: '100%', ease: 'none' }, 0);

    // Animate each step as the packet reaches it
    stepsRefs.current.forEach((step, i) => {
      if (!step) return;
      const progress = i / (pipelineSteps.length - 1);
      
      tl.fromTo(step, 
        { scale: 0.9, opacity: 0.3, filter: 'blur(4px)' },
        { 
          scale: 1.05, 
          opacity: 1, 
          filter: 'blur(0px)',
          duration: 0.1, 
          yoyo: true, 
          repeat: 1, 
          ease: 'power2.out' 
        }, 
        progress - 0.05
      );
    });

  }, []);

  return (
    <section id="demo" className="py-32 relative bg-[#0A0B0F] overflow-hidden border-t border-white/[0.04]">
      {/* Background grid */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10" ref={containerRef}>
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            The AI Pipeline
          </h2>
          <p className="text-slate-400 text-lg">Watch how our neural engines process your profile in real-time.</p>
        </div>

        <div className="relative py-10">
          {/* Vertical track line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-white/5 rounded-full overflow-hidden">
            <div ref={lineRef} className="w-full bg-gradient-to-b from-accent-violet via-accent-teal to-accent-violet" />
          </div>

          {/* Traveling Packet */}
          <div 
            ref={packetRef} 
            className="absolute left-1/2 -translate-x-1/2 w-4 h-16 rounded-full bg-white shadow-[0_0_20px_#fff,0_0_40px_#7C5CFC] z-20"
            style={{ top: '0%' }}
          />

          {/* Steps */}
          <div className="flex flex-col gap-24 relative z-10">
            {pipelineSteps.map((step, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div 
                  key={step.id} 
                  ref={el => stepsRefs.current[idx] = el}
                  className={`flex items-center gap-8 ${isEven ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${isEven ? 'text-right' : 'text-left'}`}>
                    <h3 className="text-2xl font-display font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-slate-400">{step.desc}</p>
                  </div>
                  
                  <div className="relative flex-shrink-0 w-20 h-20 rounded-2xl bg-[#111318] border border-white/10 flex items-center justify-center shadow-xl">
                    {/* Glow behind node */}
                    <div className="absolute inset-0 rounded-2xl blur-xl opacity-30" style={{ backgroundColor: step.color }} />
                    <step.icon className="w-8 h-8 text-white relative z-10" />
                  </div>
                  
                  <div className="flex-1" />
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-slate-300 font-mono text-sm">
            Processing time: <span className="text-accent-teal font-bold">1.4s</span> total
          </div>
        </div>
      </div>
    </section>
  );
}
