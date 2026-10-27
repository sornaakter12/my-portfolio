/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ImageGallery } from './components/ImageGallery';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { WorkSample } from './data/portfolioData';

export default function App() {
  const [selectedSample, setSelectedSample] = useState<WorkSample | null>(null);

  return (
    <div className="min-h-screen bg-[#FAF9FF] text-[#1E1235] font-sans selection:bg-purple-200 selection:text-purple-900 flex flex-col">
      {/* Navigation */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Name & Introduction with Arched Portrait */}
        <Hero />

        {/* Core Skills: AI Image Create, Logo Design, Website Making, Tool Making */}
        <SkillsSection />

        {/* Work Samples (Kajer Nomona) */}
        <ProjectsSection onSelectSample={(sample) => setSelectedSample(sample)} />

        {/* User-Requested Image Gallery with Upload Feature */}
        <ImageGallery />

        {/* Direct Contact Information & Message Form */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Lightbox / Sample Viewer */}
      <ProjectModal
        sample={selectedSample}
        onClose={() => setSelectedSample(null)}
      />
    </div>
  );
}
