import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, CheckCircle } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

const cards = [
  {
    icon: Shield,
    title: "Privacy First",
    desc: "Your resumes are encrypted. Never sold. Never shared without your explicit consent.",
    color: "text-accent-teal",
    bg: "bg-accent-teal/10"
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    desc: "Built on AWS with bank-level AES-256 encryption for all user data.",
    color: "text-accent-violet",
    bg: "bg-accent-violet/10"
  },
  {
    icon: Eye,
    title: "AI Transparency",
    desc: "We explain every recommendation. No black box magic, just clear reasoning.",
    color: "text-info",
    bg: "bg-info/10"
  },
  {
    icon: CheckCircle,
    title: "GDPR Ready",
    desc: "Your data belongs to you. Export or delete everything with a single click.",
    color: "text-success",
    bg: "bg-success/10"
  }
];

export default function SecurityTrust() {
  return (
    <section className="py-24 relative bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-display font-bold text-white mb-4"
          >
            Built on Trust.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto"
          >
            Your career data is highly sensitive. We treat it with the respect and security it deserves.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className="p-8 h-full group hover:border-white/[0.1] transition-colors border border-white/[0.04]">
                <div className={`w-12 h-12 rounded-2xl ${card.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <h4 className="text-lg font-bold text-white mb-3">{card.title}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {card.desc}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
