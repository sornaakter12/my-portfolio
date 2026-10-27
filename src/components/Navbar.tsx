import React, { useState } from 'react';
import { Menu, X, Send, Camera, ShieldCheck, LogOut, Lock } from 'lucide-react';

interface NavbarProps {
  isOwnerAuthenticated?: boolean;
  onOpenChangeImage?: () => void;
  onOpenAuthModal?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isOwnerAuthenticated = false,
  onOpenChangeImage,
  onOpenAuthModal,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'HOME', href: '#home' },
    { label: 'MY SKILLS', href: '#skills' },
    { label: 'WORK SAMPLES', href: '#work-samples' },
    { label: 'GALLERY', href: '#gallery' },
    { label: 'CONTACT', href: '#contact' },
  ];

  return (
    <>
      {/* Owner-Only Admin Toolbar Banner (Only visible when authenticated as owner) */}
      {isOwnerAuthenticated && (
        <div className="bg-purple-950 text-white text-xs px-4 py-2 border-b border-purple-800 flex items-center justify-between gap-4 z-50">
          <div className="max-w-6xl mx-auto w-full flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-bold text-purple-200 uppercase tracking-wider text-[11px] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Owner Admin Mode Active
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onOpenChangeImage}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-800 hover:bg-purple-700 text-white rounded-lg font-semibold text-[11px] transition-colors shadow-xs"
              >
                <Camera className="w-3 h-3 text-purple-300" />
                <span>Change Profile Image</span>
              </button>

              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1 text-[11px] text-purple-300 hover:text-white transition-colors"
                title="Log Out"
              >
                <LogOut className="w-3 h-3" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

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

          {/* Zone 3: Primary Action & Discreet Owner Button */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            {!isOwnerAuthenticated && (
              <button
                onClick={onOpenAuthModal}
                title="Owner Login: Access profile photo update"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-800 bg-purple-50 hover:bg-purple-100 rounded-xl border border-purple-200 transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-purple-600" />
                <span>Owner Login</span>
              </button>
            )}

            <a
              href="#contact"
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-wide text-white bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 rounded-xl shadow-xs hover:shadow transition-all whitespace-nowrap"
            >
              <span>LET&apos;S TALK</span>
              <Send className="w-3.5 h-3.5 rotate-45" />
            </a>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            {!isOwnerAuthenticated && (
              <button
                onClick={onOpenAuthModal}
                className="p-2 text-purple-700 bg-purple-50 rounded-lg border border-purple-200 text-xs flex items-center gap-1"
                title="Owner Login"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            )}
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
              
              {isOwnerAuthenticated ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenChangeImage?.();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-purple-900 rounded-xl"
                >
                  <Camera className="w-3.5 h-3.5 text-purple-300" />
                  <span>Change Profile Image (Owner)</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuthModal?.();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-purple-900 bg-purple-50 border border-purple-200 rounded-xl"
                >
                  <Lock className="w-3.5 h-3.5 text-purple-600" />
                  <span>Owner Login (Add My Photo)</span>
                </button>
              )}

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
    </>
  );
};
