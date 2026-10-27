/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ImageGallery } from './components/ImageGallery';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { ChangeProfileImageModal } from './components/ChangeProfileImageModal';
import { OwnerAuthModal } from './components/OwnerAuthModal';
import { WorkSample } from './data/portfolioData';

const OWNER_TOKEN_KEY = 'jannat_owner_auth_token_v1';
const DEFAULT_IMAGE = '/src/assets/images/jannat_portrait_1793073549037.jpg';

export default function App() {
  const [selectedSample, setSelectedSample] = useState<WorkSample | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string>(DEFAULT_IMAGE);
  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState<boolean>(false);
  const [ownerEmail, setOwnerEmail] = useState<string>('j41975994@gmail.com');
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Modals
  const [isChangeImageOpen, setIsChangeImageOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // 1. Fetch server-persisted profile image on mount
  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const res = await fetch('/api/profile-image');
        if (res.ok) {
          const data = await res.json();
          if (data.profileImageUrl) {
            setProfileImageUrl(data.profileImageUrl);
          }
        }
      } catch (err) {
        console.error('Failed to fetch profile image from server:', err);
      }
    };

    fetchProfileImage();
  }, []);

  // 2. Verify owner session on mount
  useEffect(() => {
    const token = localStorage.getItem(OWNER_TOKEN_KEY);
    if (!token) return;

    setAuthToken(token);
    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setIsOwnerAuthenticated(true);
          if (data.ownerEmail) setOwnerEmail(data.ownerEmail);
        } else {
          localStorage.removeItem(OWNER_TOKEN_KEY);
          setAuthToken(null);
          setIsOwnerAuthenticated(false);
        }
      })
      .catch((err) => {
        console.error('Error verifying owner session:', err);
      });
  }, []);

  const handleLoginSuccess = (token: string, email: string) => {
    localStorage.setItem(OWNER_TOKEN_KEY, token);
    setAuthToken(token);
    setIsOwnerAuthenticated(true);
    setOwnerEmail(email);
    setIsAuthModalOpen(false);
    // Directly open the image upload modal right upon successful login!
    setIsChangeImageOpen(true);
  };

  const handleLogout = async () => {
    if (authToken) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${authToken}` },
        });
      } catch (e) {
        console.error('Logout error', e);
      }
    }
    localStorage.removeItem(OWNER_TOKEN_KEY);
    setAuthToken(null);
    setIsOwnerAuthenticated(false);
    setIsChangeImageOpen(false);
  };

  const handleImageUpdated = (newUrl: string) => {
    setProfileImageUrl(newUrl);
  };

  return (
    <div className="min-h-screen bg-[#FAF9FF] text-[#1E1235] font-sans selection:bg-purple-200 selection:text-purple-900 flex flex-col">
      {/* Navigation */}
      <Navbar
        isOwnerAuthenticated={isOwnerAuthenticated}
        onOpenChangeImage={() => setIsChangeImageOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Sections */}
      <main className="flex-1">
        {/* Name & Introduction with Arched Portrait (Dynamic and Owner-Editable) */}
        <Hero
          profileImageUrl={profileImageUrl}
          isOwnerAuthenticated={isOwnerAuthenticated}
          onOpenChangeImage={() => setIsChangeImageOpen(true)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />

        {/* Core Skills: AI Image Create, Logo Design, Website Making, Tool Making */}
        <SkillsSection />

        {/* Work Samples (Kajer Nomona) */}
        <ProjectsSection onSelectSample={(sample) => setSelectedSample(sample)} />

        {/* Work Gallery with Upload Feature */}
        <ImageGallery />

        {/* Direct Contact Information & Message Form */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer
        isOwnerAuthenticated={isOwnerAuthenticated}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenChangeImage={() => setIsChangeImageOpen(true)}
      />

      {/* Lightbox / Sample Viewer */}
      <ProjectModal
        sample={selectedSample}
        onClose={() => setSelectedSample(null)}
      />

      {/* Owner-Only: Profile Image Upload & Preview Modal */}
      <ChangeProfileImageModal
        isOpen={isChangeImageOpen}
        onClose={() => setIsChangeImageOpen(false)}
        currentImageUrl={profileImageUrl}
        onImageUpdated={handleImageUpdated}
        token={authToken}
      />

      {/* Owner Authentication Modal */}
      <OwnerAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        isAuthenticated={isOwnerAuthenticated}
        ownerEmail={ownerEmail}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
        onOpenChangeImage={() => setIsChangeImageOpen(true)}
        token={authToken}
      />
    </div>
  );
}
