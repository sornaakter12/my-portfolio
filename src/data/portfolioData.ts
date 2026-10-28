/**
 * Clean Portfolio Data for Jannat Ara Sorna
 * Focused on core skills: AI Image Create, Logo Design, Website Making, Tool Making
 * Uses direct asset imports for guaranteed static bundling on Firebase Hosting and GitHub Pages.
 */

import aiArtworkImg from '../assets/images/project_ai_artwork_1793073549524.jpg';
import logoDesignImg from '../assets/images/sample_logo_design_1793075212924.jpg';
import websiteMakingImg from '../assets/images/sample_website_making_1793075212980.jpg';
import socialMediaImg from '../assets/images/project_social_media_1793073550444.jpg';

export interface WorkSample {
  id: string;
  title: string;
  category: 'ai-image' | 'logo-design' | 'website-making' | 'tool-making';
  categoryLabel: string;
  image: string;
  description: string;
  tools: string[];
  features?: string[];
  promptUsed?: string;
}

export interface SkillItem {
  id: string;
  title: string;
  category: string;
  description: string;
  highlights: string[];
  icon: string;
}

export const PROFILE = {
  name: 'Jannat Ara Sorna',
  title: 'Digital Creator & Designer',
  tagline: 'AI Image Create · Logo Design · Website Making · Tool Making',
  shortBio: "Hi, I'm Jannat Ara Sorna. I create high-quality AI images, craft memorable logos, build modern responsive websites, and develop interactive web tools.",
  email: 'j41975994@gmail.com',
  phone: '+880 1700-000000',
  location: 'Bangladesh (Available for Remote Work)',
  socialLinks: {
    behance: 'https://behance.net',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    pinterest: 'https://pinterest.com',
  },
};

export const CORE_SKILLS: SkillItem[] = [
  {
    id: 'ai-image',
    title: 'AI Image Create',
    category: 'Generative AI',
    description: 'Generating stunning, high-resolution digital artwork, fantasy concept scenes, and photo-style graphics using tailored prompt crafting.',
    highlights: ['Midjourney & Imagen prompts', 'Concept art & backgrounds', 'Lighting & style control'],
    icon: 'Sparkles',
  },
  {
    id: 'logo-design',
    title: 'Logo Design',
    category: 'Branding & Identity',
    description: 'Designing clean, timeless logos and brand marks that give businesses a distinctive and memorable visual identity.',
    highlights: ['Minimalist & luxury monograms', 'Brand color palettes', 'Vector & print ready'],
    icon: 'Feather',
  },
  {
    id: 'website-making',
    title: 'Website Making',
    category: 'Web Design & UI',
    description: 'Building modern, fully responsive websites with clean typography, elegant layouts, and smooth mobile compatibility.',
    highlights: ['Responsive desktop & mobile', 'Modern purple/clean aesthetics', 'Fast loading & clean structure'],
    icon: 'Layout',
  },
  {
    id: 'tool-making',
    title: 'Tool Making',
    category: 'Interactive Utilities',
    description: 'Creating practical web tools, prompt generators, design calculators, and interactive widgets tailored to user needs.',
    highlights: ['Interactive user interfaces', 'Prompt builders & generators', 'Custom web utilities'],
    icon: 'Wrench',
  },
];

export const WORK_SAMPLES: WorkSample[] = [
  {
    id: 'sample-ai-image',
    title: 'Crystal Botanical Sanctuary (AI Concept Art)',
    category: 'ai-image',
    categoryLabel: 'AI Image Create',
    image: aiArtworkImg,
    description: 'Fantasy concept artwork generated with generative AI, featuring bioluminescent lavender flowers, glowing crystals, and cinematic ambient lighting.',
    tools: ['Generative AI', 'Prompt Syntax', 'Digital Art'],
    promptUsed: 'Vibrant digital concept artwork created with generative AI, fantastical surreal botanical garden with luminous violet and lavender flowers, glowing crystal elements, dreamy cinematic lighting, high resolution digital art showcase',
  },
  {
    id: 'sample-logo-design',
    title: 'Aethel Luxury Monogram & Brand Logo',
    category: 'logo-design',
    categoryLabel: 'Logo Design',
    image: logoDesignImg,
    description: 'Embossed luxury monogram emblem in royal purple and gold foil, designed for an upscale beauty and fashion lifestyle brand.',
    tools: ['Logo Concepting', 'Vector Branding', 'Typography Hierarchy'],
    features: ['Custom monogram ligature', 'High-contrast purple & gold scheme', 'Scalable branding'],
  },
  {
    id: 'sample-website-making',
    title: 'Aura Responsive Web Design & UI',
    category: 'website-making',
    categoryLabel: 'Website Making',
    image: websiteMakingImg,
    description: 'Clean modern website interface with responsive layouts, purple accents, balanced whitespace, and seamless device responsiveness.',
    tools: ['React & Tailwind', 'Responsive Design', 'Clean UI Architecture'],
    features: ['Fluid mobile-to-desktop grid', 'Accessible typography', 'Fast client-side interaction'],
  },
  {
    id: 'sample-tool-making',
    title: 'Interactive Design Palette & AI Prompt Tool',
    category: 'tool-making',
    categoryLabel: 'Tool Making',
    image: socialMediaImg,
    description: 'A live interactive utility built to instantly generate coordinated color palettes, hex codes, and generative AI prompt formulas with one click.',
    tools: ['Interactive Web Logic', 'State Management', 'Prompt Algorithm'],
    features: ['Instant 1-click generation', 'Direct clipboard copy', 'Live preview in browser'],
  },
];
