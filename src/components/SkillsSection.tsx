import React from 'react';
import { Sparkles, Feather, Layout, Wrench, CheckCircle2, ArrowRight } from 'lucide-react';
import { CORE_SKILLS } from '../data/portfolioData';

export const SkillsSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-purple-600" />;
      case 'Feather':
        return <Feather className="w-6 h-6 text-purple-600" />;
      case 'Layout':
        return <Layout className="w-6 h-6 text-purple-600" />;
      case 'Wrench':
        return <Wrench className="w-6 h-6 text-purple-600" />;
      default:
        return <Sparkles className="w-6 h-6 text-purple-600" />;
    }
  };

  return (
    <section id="skills" className="py-16 bg-[#FAF9FF] border-t border-purple-100/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-900 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>WHAT I DO</span>
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            My Core Skills
          </h2>
          <p className="mt-2 text-slate-600 text-sm">
            Here are the key creative and technical areas I specialize in.
          </p>
        </div>

        {/* 4 Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CORE_SKILLS.map((skill) => (
            <div
              key={skill.id}
              className="bg-white rounded-2xl p-6 border border-purple-100 hover:border-purple-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-purple-50 group-hover:bg-purple-100 text-purple-700 flex items-center justify-center mb-4 transition-colors">
                  {getIcon(skill.icon)}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-purple-700 transition-colors">
                  {skill.title}
                </h3>
                
                <span className="text-[11px] font-semibold text-purple-600 uppercase tracking-wider block mb-3">
                  {skill.category}
                </span>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {skill.description}
                </p>
              </div>

              {/* Highlights */}
              <div className="pt-3 border-t border-purple-50 space-y-1.5">
                {skill.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
