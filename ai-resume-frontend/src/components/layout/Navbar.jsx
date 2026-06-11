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
    <header className={`fixed inset-x-0 top-0 z-50 border-b border-white/6 transition-all duration-300 ${scrolled ? 'bg-[#080810]/85 shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl' : 'bg-transparent'}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7C5CFC] to-[#5B8FFF] shadow-[0_12px_30px_rgba(124,92,252,0.25)]">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="font-heading text-[20px] font-bold tracking-tight text-white">Resume Copilot</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="rounded-xl px-4 py-2 text-[15px] text-slate-300 transition hover:bg-white/6 hover:text-white">{link.label}</a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login" className="rounded-xl border border-white/10 bg-white/4 px-4 py-2 text-[14px] font-semibold text-slate-200 transition hover:border-white/18 hover:bg-white/8 hover:text-white">Sign In</Link>
          <Link to="/register" className="rounded-xl bg-gradient-to-r from-[#7C5CFC] to-[#5B8FFF] px-4 py-2 text-[14px] font-semibold text-white shadow-[0_12px_30px_rgba(124,92,252,0.28)] transition hover:scale-[1.03]">Get Started Free</Link>
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/8 bg-white/4 text-slate-100 md:hidden">
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-white/6 bg-[#080810]/95 px-6 py-4 md:hidden backdrop-blur-xl">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)} className="block rounded-xl px-3 py-3 text-[15px] text-slate-200 hover:bg-white/6 hover:text-white">{link.label}</a>
          ))}
          <div className="mt-3 flex flex-col gap-2 border-t border-white/6 pt-3">
            <Link to="/login" onClick={() => setMenuOpen(false)} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-[14px] font-semibold text-slate-100">Sign In</Link>
            <Link to="/register" onClick={() => setMenuOpen(false)} className="rounded-xl bg-gradient-to-r from-[#7C5CFC] to-[#5B8FFF] px-4 py-3 text-center text-[14px] font-semibold text-white">Get Started Free</Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar