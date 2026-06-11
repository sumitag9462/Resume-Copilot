import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Sparkles, X } from 'lucide-react'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How it Works', href: '#how' },
    { label: 'Pricing', href: '#pricing' },
  ]

  return (
    <header className={`fixed inset-x-0 top-0 z-50 border-b border-border-subtle transition-all duration-300 ${scrolled ? 'bg-bg-surface/80 shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-md' : 'bg-transparent'}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-violet to-accent-teal shadow-[0_12px_30px_rgba(124,111,247,0.25)]">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-[20px] font-semibold tracking-tight text-text-primary">Resume Copilot</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="rounded-xl px-4 py-2 text-[15px] text-text-secondary transition-all duration-150 hover:bg-white/5 hover:text-text-primary">{link.label}</a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login" className="rounded-xl border border-border-normal bg-transparent px-4 py-2 text-[14px] font-semibold text-text-secondary transition duration-150 hover:border-border-strong hover:text-text-primary">Sign In</Link>
          <Link to="/register" className="rounded-full bg-gradient-to-r from-accent-violet to-accent-teal px-4 py-2 text-[14px] font-medium text-white shadow-[0_12px_30px_rgba(124,111,247,0.25)] transition duration-200 hover:opacity-90">Get Started Free</Link>
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border-normal bg-bg-surface text-text-primary md:hidden">
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-border-subtle bg-bg-surface/95 px-6 py-4 md:hidden backdrop-blur-xl">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)} className="block rounded-xl px-3 py-3 text-[15px] text-text-secondary transition-all duration-150 hover:bg-white/5 hover:text-text-primary">{link.label}</a>
          ))}
          <div className="mt-3 flex flex-col gap-2 border-t border-border-subtle pt-3">
            <Link to="/login" onClick={() => setMenuOpen(false)} className="rounded-xl border border-border-normal bg-transparent px-4 py-3 text-center text-[14px] font-semibold text-text-secondary transition duration-150 hover:border-border-strong hover:text-text-primary">Sign In</Link>
            <Link to="/register" onClick={() => setMenuOpen(false)} className="rounded-full bg-gradient-to-r from-accent-violet to-accent-teal px-4 py-3 text-center text-[14px] font-medium text-white shadow-[0_12px_30px_rgba(124,111,247,0.25)] transition duration-200 hover:opacity-90">Get Started Free</Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar