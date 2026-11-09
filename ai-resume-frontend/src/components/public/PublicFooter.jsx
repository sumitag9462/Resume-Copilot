import React from 'react';
import { Link } from 'react-router-dom';

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-white dark:bg-[#0F172A] border-[#E5E7EB] dark:border-[#334155] transition-colors py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-[#E5E7EB] dark:border-[#334155]">
          <div>
            <span className="text-base font-bold text-[#111827] dark:text-[#F8FAFC]">
              Resume Copilot
            </span>
            <p className="text-sm text-[#64748B] dark:text-[#CBD5E1] mt-1">
              AI-assisted resume analysis and career preparation.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-6 text-sm text-[#64748B] dark:text-[#CBD5E1]" aria-label="Footer navigation">
            <a href="#features" className="hover:text-[#111827] dark:hover:text-[#F8FAFC] transition-colors">
              Features
            </a>
            <a href="#how" className="hover:text-[#111827] dark:hover:text-[#F8FAFC] transition-colors">
              How It Works
            </a>
            <Link to="/login" className="hover:text-[#111827] dark:hover:text-[#F8FAFC] transition-colors">
              Log In
            </Link>
            <Link to="/register" className="hover:text-[#111827] dark:hover:text-[#F8FAFC] transition-colors">
              Sign Up
            </Link>
          </nav>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] dark:text-[#CBD5E1] gap-2">
          <span>&copy; {currentYear} Resume Copilot. All rights reserved.</span>
          <span>Designed with simplicity and clarity.</span>
        </div>
      </div>
    </footer>
  );
}

