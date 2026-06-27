import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 250000, suffix: '+', label: 'Resumes Optimized', color: 'from-white to-slate-400' },
  { value: 92, suffix: '%', label: 'Interview Rate', color: 'from-accent-violet to-blue-400' },
  { value: 15000, suffix: '+', label: 'Offers Accepted', color: 'from-accent-teal to-emerald-400' }
];

export default function LandingStats() {
  const sectionRef = useRef(null);
  const countersRef = useRef([]);

  useEffect(() => {
    const tweens = [];

    countersRef.current.forEach((counter, i) => {
      if (!counter) return;
      const target = parseFloat(counter.getAttribute('data-target'));
      const obj = { val: 0 };

      const tween = gsap.to(obj, {
        val: target,
        duration: 2.5,
        ease: 'power3.out',
        delay: i * 0.2,
        onUpdate: () => {
          if (counter) counter.textContent = Math.ceil(obj.val).toLocaleString();
        },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });
      tweens.push(tween);
    });

    return () => {
      tweens.forEach(tween => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-32 relative bg-base overflow-hidden border-t border-white/[0.04]">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-accent-violet/5 blur-[120px] rounded-[100%]" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className="card-3d relative rounded-3xl border border-white/[0.08] bg-[#111318]/50 backdrop-blur-xl p-10 text-center group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="flex items-baseline justify-center text-5xl lg:text-7xl font-bold font-display tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-br">
                <span 
                  ref={el => countersRef.current[idx] = el} 
                  data-target={stat.value}
                  className={`bg-clip-text text-transparent bg-gradient-to-br ${stat.color}`}
                >
                  0
                </span>
                <span className={`text-4xl lg:text-5xl bg-clip-text text-transparent bg-gradient-to-br ${stat.color}`}>
                  {stat.suffix}
                </span>
              </div>
              
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                {stat.label}
              </div>

              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.05] to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
