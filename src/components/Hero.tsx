import React from 'react';
import { ArrowRight, Sparkles, Send, CheckCircle2, Camera, Lock } from 'lucide-react';
import { PROFILE } from '../data/portfolioData';

interface HeroProps {
  profileImageUrl: string;
  isOwnerAuthenticated: boolean;
  onOpenChangeImage: () => void;
  onOpenAuthModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  profileImageUrl,
  isOwnerAuthenticated,
  onOpenChangeImage,
  onOpenAuthModal,
}) => {
  return (
    <section id="home" className="relative pt-10 pb-16 lg:pt-16 lg:pb-20 overflow-hidden bg-white">
      {/* Subtle purple background glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-100/50 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Typographic Name & Core Services */}
          <div className="lg:col-span-7 flex flex-col items-start z-10">
            {/* Kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100/80 text-purple-900 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-purple-200/60">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>HELLO, I&apos;M</span>
            </div>

            {/* Name & Title */}
            <h1 className="font-serif-display text-4xl sm:text-5xl md:text-6xl text-slate-900 tracking-tight leading-[1.08] mb-3">
              Jannat Ara Sorna
              <span className="block font-script text-4xl sm:text-5xl md:text-6xl text-purple-700 font-normal leading-[1] mt-1 -rotate-2 origin-left">
                Creative Portfolio
              </span>
            </h1>

            {/* Core focus pills */}
            <div className="flex flex-wrap gap-2 my-4">
              <span className="px-3 py-1 bg-purple-950 text-white text-xs font-bold rounded-lg">
                AI Image Create
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-900 text-xs font-bold rounded-lg border border-purple-200">
                Logo Design
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-900 text-xs font-bold rounded-lg border border-purple-200">
                Website Making
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-900 text-xs font-bold rounded-lg border border-purple-200">
                Tool Making
              </span>
            </div>

            {/* Clear introduction */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mb-7">
              {PROFILE.shortBio}
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <a
                href="#work-samples"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white bg-purple-700 hover:bg-purple-800 rounded-xl shadow-md hover:shadow-lg transition-all group"
              >
                <span>VIEW WORK SAMPLES</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-purple-900 bg-white hover:bg-purple-50 rounded-xl border border-purple-200 shadow-xs transition-all"
              >
                <span>CONTACT ME</span>
                <Send className="w-4 h-4 text-purple-600 rotate-45" />
              </a>
            </div>

            {/* Quick bullet points */}
            <div className="mt-8 pt-6 border-t border-purple-100 w-full flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5 text-purple-900 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-purple-600" />
                Available for Freelance Projects
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>Fast &amp; High Quality Delivery</span>
            </div>
          </div>

          {/* Right Column: Arched Portrait matching reference flyer */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[340px] sm:max-w-[370px]">
              
              {/* Decorative Arched Shadow */}
              <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-t-[180px] rounded-b-3xl bg-purple-200/50 -z-10" />

              {/* Main Arched Frame */}
              <div className="relative overflow-hidden rounded-t-[170px] rounded-b-3xl border-4 border-white shadow-xl bg-purple-50 aspect-[3/4] group">
                <img
                  src={profileImageUrl || '/src/assets/images/jannat_portrait_1793073549037.jpg'}
                  alt="Jannat Ara Sorna Profile"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                />

                {/* Direct Action Button on Photo:
                    If Owner is authenticated: "Change Photo" button
                    If not authenticated: "Owner: Update Photo" button (requires owner password) */}
                <div className="absolute top-4 inset-x-4 flex justify-between items-center z-20 pointer-events-auto">
                  {isOwnerAuthenticated ? (
                    <button
                      onClick={onOpenChangeImage}
                      title="Replace this image with your own photo"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-900/95 hover:bg-purple-950 text-white rounded-xl shadow-lg border border-purple-300 text-xs font-bold transition-all hover:scale-105 backdrop-blur-md cursor-pointer"
                    >
                      <Camera className="w-4 h-4 text-purple-300" />
                      <span>Change Photo</span>
                    </button>
                  ) : (
                    <button
                      onClick={onOpenAuthModal}
                      title="Owner action: Sign in to add your own photo here"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/60 hover:bg-purple-950 text-white rounded-xl shadow-md border border-white/40 hover:border-purple-300 text-[11px] font-semibold transition-all hover:scale-105 backdrop-blur-md cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5 text-purple-300" />
                      <span>Owner: Add My Photo</span>
                      <Lock className="w-3 h-3 text-purple-300" />
                    </button>
                  )}
                </div>

                {/* Bottom dark subtle gradient */}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-purple-950/40 to-transparent pointer-events-none" />
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-3 -left-3 sm:-left-4 bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-purple-100 max-w-[190px]">
                <span className="text-[10px] font-bold text-purple-600 block uppercase tracking-wider mb-0.5">
                  DESIGNER &amp; CREATOR
                </span>
                <span className="text-xs font-semibold text-slate-800">
                  Jannat Ara Sorna
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
