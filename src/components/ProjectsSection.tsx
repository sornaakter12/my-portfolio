import React, { useState } from 'react';
import { Eye, Sparkles, Feather, Layout, Wrench } from 'lucide-react';
import { WORK_SAMPLES, WorkSample } from '../data/portfolioData';

interface ProjectsSectionProps {
  onSelectSample: (sample: WorkSample) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onSelectSample }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'ai-image' | 'logo-design' | 'website-making' | 'tool-making'>('all');

  const filteredSamples = activeTab === 'all'
    ? WORK_SAMPLES
    : WORK_SAMPLES.filter((s) => s.category === activeTab);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ai-image':
        return <Sparkles className="w-3.5 h-3.5" />;
      case 'logo-design':
        return <Feather className="w-3.5 h-3.5" />;
      case 'website-making':
        return <Layout className="w-3.5 h-3.5" />;
      case 'tool-making':
        return <Wrench className="w-3.5 h-3.5" />;
      default:
        return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  return (
    <section id="work-samples" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-900 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>KAJER NOMONA</span>
            </div>
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Samples of My Work
            </h2>
            <p className="mt-2 text-slate-600 text-sm max-w-lg">
              Here are real examples of my work in AI image creation, logo designing, website making, and interactive web tools.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="inline-flex p-1 bg-purple-50 rounded-xl border border-purple-100 overflow-x-auto self-start md:self-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'all' ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-600 hover:text-purple-900'
              }`}
            >
              All Samples
            </button>
            <button
              onClick={() => setActiveTab('ai-image')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'ai-image' ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-600 hover:text-purple-900'
              }`}
            >
              AI Image
            </button>
            <button
              onClick={() => setActiveTab('logo-design')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'logo-design' ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-600 hover:text-purple-900'
              }`}
            >
              Logo Design
            </button>
            <button
              onClick={() => setActiveTab('website-making')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'website-making' ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-600 hover:text-purple-900'
              }`}
            >
              Website Making
            </button>
            <button
              onClick={() => setActiveTab('tool-making')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'tool-making' ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-600 hover:text-purple-900'
              }`}
            >
              Tool Making
            </button>
          </div>
        </div>

        {/* Work Samples Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {filteredSamples.map((sample) => (
            <div
              key={sample.id}
              className="group bg-white rounded-2xl border border-purple-100 hover:border-purple-300 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Image Container */}
                <div
                  className="relative aspect-[16/10] overflow-hidden bg-purple-50 cursor-pointer"
                  onClick={() => onSelectSample(sample)}
                >
                  <img
                    src={sample.image}
                    alt={sample.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Badge */}
                  <div className="absolute top-3 left-3 bg-purple-950/85 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1.5">
                    {getCategoryIcon(sample.category)}
                    <span>{sample.categoryLabel}</span>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-purple-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-purple-950 rounded-xl text-xs font-bold shadow-lg">
                      <Eye className="w-4 h-4 text-purple-700" />
                      <span>View Sample</span>
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3
                    onClick={() => onSelectSample(sample)}
                    className="text-lg font-bold text-slate-900 group-hover:text-purple-700 transition-colors cursor-pointer mb-2"
                  >
                    {sample.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {sample.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {sample.tools.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* View Button */}
              <div className="px-6 pb-6 pt-0">
                <button
                  type="button"
                  onClick={() => onSelectSample(sample)}
                  className="w-full py-2.5 px-4 bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold rounded-xl border border-purple-200/80 flex items-center justify-center gap-2 transition-colors"
                >
                  <Eye className="w-4 h-4 text-purple-600" />
                  <span>Inspect Work Sample</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
