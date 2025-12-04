'use client';

import { useState } from 'react';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import ViralCalculator from '@/components/ViralCalculator';
import JoinCTA from '@/components/JoinCTA';
import EmailPopup from '@/components/EmailPopup';

export default function Home() {
  const [isEmailPopupOpen, setIsEmailPopupOpen] = useState(false);

  const openEmailPopup = () => setIsEmailPopupOpen(true);
  const closeEmailPopup = () => setIsEmailPopupOpen(false);

  return (
    <main className="min-h-screen bg-yg-navy">
      <Hero onJoinClick={openEmailPopup} />
      <HowItWorks />
      <ViralCalculator />
      <JoinCTA onJoinClick={openEmailPopup} />

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-yg-cream/10">
        <div className="max-w-6xl mx-auto text-center text-yg-cream/40 text-sm">
          © 2025 $YNTOYG. All rights reserved.
        </div>
      </footer>

      {/* Email Popup */}
      <EmailPopup isOpen={isEmailPopupOpen} onClose={closeEmailPopup} />
    </main>
  );
}
