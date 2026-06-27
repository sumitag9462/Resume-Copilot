import React from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

const logos = [
  'Google', 'Microsoft', 'Amazon', 'Adobe', 'Uber', 'Stripe', 
  'Atlassian', 'NVIDIA', 'Apple', 'Netflix', 'Airbnb', 'Framer', 'Vercel', 'Notion'
];

export default function SocialMarquee() {
  const prefersReduced = usePrefersReducedMotion();
  return (
    <section className="py-20 bg-base border-t border-b border-white/[0.04] overflow-hidden relative z-10">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-base to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-base to-transparent z-10" />
      
      <div className="flex flex-col items-center gap-10">
        <p className="text-sm font-semibold tracking-wide text-slate-400 text-center px-4 max-w-xl mx-auto">
          Trusted by ambitious students, developers, and professionals worldwide.
        </p>
        
        <div className="flex overflow-hidden w-full group">
          <div 
            className="flex space-x-16 min-w-max animate-marquee group-hover:[animation-play-state:paused] px-8"
            style={{ animationPlayState: prefersReduced ? 'paused' : undefined, animationDuration: '40s' }}
          >
            {[...logos, ...logos].map((logo, idx) => (
              <div 
                key={`${logo}-${idx}`} 
                className="group/logo relative text-2xl font-display font-bold text-slate-600/50 hover:text-white transition-all duration-500 hover:scale-110 cursor-default"
              >
                {logo}
                <div className="absolute -inset-4 bg-white/5 opacity-0 group-hover/logo:opacity-100 blur-xl rounded-full transition-opacity duration-500 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
