import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../ui/ThemeToggle';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-white dark:bg-[#0F172A] text-[#111827] dark:text-[#F8FAFC] transition-colors">
      {/* Top Header */}
      <header className="w-full border-b border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#0F172A] transition-colors">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="text-lg font-bold tracking-tight text-[#111827] dark:text-[#F8FAFC] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          >
            Resume Copilot
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Centered Form Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-[440px]">
          <div className="bg-white dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#334155] rounded-xl p-6 sm:p-8 shadow-sm">
            {title && (
              <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-[#111827] dark:text-[#F8FAFC]">
                  {title}
                </h1>
                {subtitle && (
                  <p className="mt-1.5 text-sm text-[#64748B] dark:text-[#CBD5E1]">
                    {subtitle}
                  </p>
                )}
              </div>
            )}
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-[#E5E7EB] dark:border-[#334155] text-center text-xs text-[#64748B] dark:text-[#CBD5E1]">
        <div className="mx-auto max-w-7xl px-4">
          <span>&copy; {new Date().getFullYear()} Resume Copilot. Simple, thoughtful career tools.</span>
        </div>
      </footer>
    </div>
  );
}

