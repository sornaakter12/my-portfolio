import React, { useState } from 'react';
import { Menu, X, Send, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'HOME', href: '#home' },
    { label: 'MY SKILLS', href: '#skills' },
    { label: 'WORK SAMPLES', href: '#work-samples' },
    { label: 'GALLERY', href: '#gallery' },
    { label: 'CONTACT', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-purple-100/80 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a href="#home" className="flex items-center gap-2.5 text-slate-900 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-700 to-indigo-800 flex items-center justify-center text-white font-bold shadow-sm group-hover:scale-105 transition-transform">
            <span className="font-serif-display text-lg">J</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif-display text-lg font-bold tracking-tight text-purple-950 group-hover:text-purple-700 transition-colors whitespace-nowrap">
              Jannat Ara Sorna
            </span>
            <span className="text-[10px] tracking-wider uppercase font-semibold text-purple-600/80 whitespace-nowrap">
              Creator &amp; Designer
            </span>
          </div>
        </a>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold tracking-wider text-slate-600">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-purple-700 transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-purple-600 hover:after:w-full after:transition-all whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <a
            href="#contact"
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-wide text-white bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 rounded-xl shadow-xs hover:shadow transition-all whitespace-nowrap"
          >
            <span>LET&apos;S TALK</span>
            <Send className="w-3.5 h-3.5 rotate-45" />
          </a>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-purple-700 hover:bg-purple-50 rounded-lg"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-purple-100 px-5 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-3 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-purple-100">
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-lg shadow-sm"
              >
                <span>LET&apos;S TALK</span>
                <Send className="w-3.5 h-3.5 rotate-45" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
