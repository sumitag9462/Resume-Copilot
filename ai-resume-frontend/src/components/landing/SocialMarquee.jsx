import React from 'react';

const logos = [
  'Google', 'Microsoft', 'Apple', 'Meta', 'Netflix', 'OpenAI', 'Stripe', 
  'Atlassian', 'Adobe', 'NVIDIA', 'Uber', 'Airbnb', 'Framer', 'Vercel', 'Notion'
];

export default function SocialMarquee() {
  return (
    <section className="py-12 border-b border-white/[0.04] bg-[#0A0B0F]/80 backdrop-blur-md overflow-hidden relative z-10">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0A0B0F] to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0A0B0F] to-transparent z-10" />
      
      <div className="flex flex-col items-center gap-8">
        <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500 font-medium">
          Trusted by candidates interviewing at
        </p>
        
        <div className="flex overflow-hidden w-full group">
          <div className="flex space-x-12 min-w-max animate-[marquee_40s_linear_infinite] group-hover:[animation-play-state:paused] px-6">
            {[...logos, ...logos].map((logo, idx) => (
              <div 
                key={`${logo}-${idx}`} 
                className="text-xl font-display font-bold text-slate-600 transition-colors duration-300 hover:text-white"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
