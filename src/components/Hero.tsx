'use client';

import { useState } from 'react';
import Link from 'next/link';

interface HeroProps {
  onJoinClick: () => void;
}

export default function Hero({ onJoinClick }: HeroProps) {
  const [showCovenantMenu, setShowCovenantMenu] = useState(false);

  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6 md:px-8 lg:px-16 py-20 resend-canvas overflow-hidden">
      {/* Enter The Covenant Button - Top Right */}
      <div className="absolute top-6 right-6 z-20">
        <div className="relative">
          <button
            onClick={() => setShowCovenantMenu(!showCovenantMenu)}
            className="px-4 py-2 bg-yg-gold/10 border border-yg-gold/30 rounded-lg text-yg-gold hover:bg-yg-gold/20 hover:border-yg-gold/50 transition-all duration-300 text-sm font-medium"
          >
            Enter The Covenant
          </button>

          {/* Dropdown Menu */}
          {showCovenantMenu && (
            <>
              {/* Backdrop to close menu */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowCovenantMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-[#0a0a0c] border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden">
                <button
                  onClick={() => {
                    setShowCovenantMenu(false);
                    onJoinClick();
                  }}
                  className="w-full px-4 py-3 text-left text-white/70 hover:bg-white/5 hover:text-white transition-colors border-b border-white/5"
                >
                  <span className="block text-sm font-medium">First time?</span>
                  <span className="block text-xs text-white/40">Sign up with email</span>
                </button>
                <Link
                  href="/covenant"
                  className="block w-full px-4 py-3 text-left text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                  onClick={() => setShowCovenantMenu(false)}
                >
                  <span className="block text-sm font-medium">Already a member?</span>
                  <span className="block text-xs text-white/40">Go to dashboard</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full relative z-10">
        {/* Content - Centered */}
        <div className="text-center">
          {/* Main headline - Resend style with gradient fade */}
          <h1 className="text-7xl sm:text-8xl md:text-8xl lg:text-9xl font-normal mb-6 md:mb-8 tracking-tight leading-[0.9]">
            <span className="text-gradient-fade font-serif">From </span>
            <span className="text-gradient-burgundy font-street">YN</span>
            <br />
            <span className="text-gradient-fade font-serif">to </span>
            <span className="shimmer font-serif">YG</span>
          </h1>

          {/* Subheadline - muted like Resend */}
          <p className="text-base md:text-lg text-[#a1a4a5] mb-8 max-w-md mx-auto leading-7">
            This is no mere sport - seize your opportunity.
            Buy $YNTOYG, claim daily videos, go viral together.
          </p>

          {/* Buttons - Stacked on mobile, row on desktop like Resend */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
            <a
              href="https://pump.fun"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full md:w-auto"
            >
              Purchase
            </a>
            <button
              onClick={scrollToHowItWorks}
              className="btn-secondary w-full md:w-auto"
            >
              Learn More
            </button>
          </div>

          {/* Subtle Telegram connect - optional, non-intrusive */}
          <button
            onClick={onJoinClick}
            className="inline-flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-base md:text-lg text-[#a1a4a5] hover:text-white/70 transition-colors"
          >
            <span>Already hold $YNTOYG?</span>
            <span className="text-yg-gold/80 hover:text-yg-gold">Connect to claim videos →</span>
          </button>
        </div>
      </div>

      {/* Subtle ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-radial from-yg-gold/5 via-transparent to-transparent" />
      </div>
    </section>
  );
}
