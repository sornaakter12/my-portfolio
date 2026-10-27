import React from 'react';
import { ArrowUp, Sparkles, Lock, ShieldCheck } from 'lucide-react';

interface FooterProps {
  isOwnerAuthenticated?: boolean;
  onOpenAuthModal?: () => void;
  onOpenChangeImage?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  isOwnerAuthenticated = false,
  onOpenAuthModal,
  onOpenChangeImage,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#140A26] text-white py-10 border-t border-purple-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-purple-900/40">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-700 flex items-center justify-center text-white font-bold">
              <span className="font-serif-display text-base">J</span>
            </div>
            <div>
              <span className="font-serif-display text-lg font-bold text-white block">
                Jannat Ara Sorna
              </span>
              <span className="text-[10px] text-purple-300 font-semibold uppercase tracking-wider">
                AI Image · Logo · Website · Tool Making
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-5 text-xs font-semibold text-purple-200">
            <a href="#home" className="hover:text-white transition-colors">HOME</a>
            <a href="#skills" className="hover:text-white transition-colors">MY SKILLS</a>
            <a href="#work-samples" className="hover:text-white transition-colors">WORK SAMPLES</a>
            <a href="#gallery" className="hover:text-white transition-colors">GALLERY</a>
            <a href="#contact" className="hover:text-white transition-colors">CONTACT</a>
          </div>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="w-9 h-9 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 hover:text-white flex items-center justify-center transition-colors border border-purple-700/50"
            title="Back to Top"
            aria-label="Back to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-purple-300/60">
          <p>© 2026 Jannat Ara Sorna | Personal Portfolio</p>
          
          <div className="flex items-center gap-4">
            {isOwnerAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenChangeImage}
                  className="text-[11px] text-purple-300 hover:text-white underline underline-offset-2 transition-colors flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Change Profile Image</span>
                </button>
                <span className="text-purple-600">·</span>
                <button
                  onClick={onOpenAuthModal}
                  className="text-[11px] text-purple-300 hover:text-white transition-colors"
                >
                  Owner Settings
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="text-[11px] text-purple-400/80 hover:text-purple-200 transition-colors flex items-center gap-1"
                title="Owner Administration Portal"
              >
                <Lock className="w-3 h-3" />
                <span>Owner Portal</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
