import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../ui/ThemeToggle';

export default function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const scrollToSection = (e, sectionId) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-[#0F172A] border-[#E5E7EB] dark:border-[#334155] transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Text wordmark */}
        <Link
          to="/"
          className="text-lg font-bold tracking-tight text-[#111827] dark:text-[#F8FAFC] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        >
          Resume Copilot
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          <a
            href="#features"
            onClick={(e) => scrollToSection(e, 'features')}
            className="text-sm font-medium text-[#64748B] dark:text-[#CBD5E1] hover:text-[#111827] dark:hover:text-[#F8FAFC] transition-colors"
          >
            Features
          </a>
          <a
            href="#how"
            onClick={(e) => scrollToSection(e, 'how')}
            className="text-sm font-medium text-[#64748B] dark:text-[#CBD5E1] hover:text-[#111827] dark:hover:text-[#F8FAFC] transition-colors"
          >
            How It Works
          </a>

          {/* Auth actions */}
          <div className="flex items-center gap-3 pl-4 border-l border-[#E5E7EB] dark:border-[#334155]">
            <ThemeToggle />

            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center h-9 px-4 rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#2563EB] dark:hover:bg-[#1D4ED8] text-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center h-9 px-3.5 rounded-md text-sm font-medium text-[#111827] dark:text-[#F8FAFC] hover:bg-[#F8FAFC] dark:hover:bg-[#172033] transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center h-9 px-4 rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#2563EB] dark:hover:bg-[#1D4ED8] text-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile menu button and theme toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-[#E5E7EB] dark:border-[#334155] text-[#64748B] dark:text-[#CBD5E1] hover:text-[#111827] dark:hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#0F172A] px-4 pt-3 pb-6 space-y-3">
          <a
            href="#features"
            onClick={(e) => scrollToSection(e, 'features')}
            className="block py-2 text-base font-medium text-[#64748B] dark:text-[#CBD5E1] hover:text-[#111827] dark:hover:text-[#F8FAFC]"
          >
            Features
          </a>
          <a
            href="#how"
            onClick={(e) => scrollToSection(e, 'how')}
            className="block py-2 text-base font-medium text-[#64748B] dark:text-[#CBD5E1] hover:text-[#111827] dark:hover:text-[#F8FAFC]"
          >
            How It Works
          </a>

          <div className="pt-3 border-t border-[#E5E7EB] dark:border-[#334155] flex flex-col gap-2.5">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center h-10 rounded-md bg-[#2563EB] text-white text-sm font-medium"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center h-10 rounded-md border border-[#E5E7EB] dark:border-[#334155] text-sm font-medium text-[#111827] dark:text-[#F8FAFC]"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center h-10 rounded-md bg-[#2563EB] text-white text-sm font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

