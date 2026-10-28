import React, { useEffect } from 'react';
import { X, Sparkles, Terminal } from 'lucide-react';
import { WorkSample } from '../data/portfolioData';

interface ProjectModalProps {
  sample: WorkSample | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ sample, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (sample) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [sample, onClose]);

  if (!sample) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-purple-950/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-purple-100 animate-in zoom-in-95 duration-200 relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-purple-100 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
            {sample.categoryLabel}
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-purple-100 text-slate-600 hover:text-purple-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-5">
          <div className="rounded-2xl overflow-hidden bg-purple-50 border border-purple-100 shadow-inner flex items-center justify-center">
            <img
              src={
                sample.image && sample.image.startsWith('/src/assets/images/')
                  ? sample.image.replace('/src/assets/images/', '/assets/images/')
                  : sample.image
              }
              alt={sample.title}
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src.includes('/src/assets/images/')) {
                  target.src = target.src.replace('/src/assets/images/', '/assets/images/');
                }
              }}
              className="w-full max-h-[460px] object-contain"
            />
          </div>

          <div>
            <h2 className="font-serif-display text-2xl font-bold text-slate-900 mb-2">
              {sample.title}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {sample.description}
            </p>
          </div>

          {sample.promptUsed && (
            <div className="p-4 bg-purple-950 text-white rounded-xl border border-purple-800 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300 uppercase tracking-wider">
                <Terminal className="w-3.5 h-3.5 text-purple-400" />
                <span>AI Prompt Formula</span>
              </div>
              <p className="font-mono text-xs text-purple-100/90 bg-black/30 p-3 rounded-lg leading-relaxed select-all">
                &ldquo;{sample.promptUsed}&rdquo;
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-1.5 pt-2">
            {sample.tools.map((tool, idx) => (
              <span
                key={idx}
                className="text-xs bg-purple-50 text-purple-900 border border-purple-200 px-2.5 py-1 rounded-md font-medium"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-purple-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
