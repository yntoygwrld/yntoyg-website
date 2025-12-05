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

          {/* Royal Covenant Button with Dropdown */}
          <div className="relative inline-block">
            <div className="btn-covenant-wrapper">
              <button
                onClick={() => setShowCovenantMenu(!showCovenantMenu)}
                className="btn-covenant"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
                <span>Enter The Covenant</span>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </button>
            </div>

            {/* Dropdown Menu */}
            {showCovenantMenu && (
              <>
                {/* Backdrop to close menu */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowCovenantMenu(false)}
                />
                <div className="absolute left-1/2 -translate-x-1/2 mt-4 w-64 bg-[#0a0a0c]/95 backdrop-blur-sm border border-yg-gold/20 rounded-lg shadow-2xl z-20 overflow-hidden">
                  <button
                    onClick={() => {
                      setShowCovenantMenu(false);
                      onJoinClick();
                    }}
                    className="w-full px-5 py-4 text-left text-white/80 hover:bg-yg-gold/10 hover:text-white transition-all duration-300 border-b border-yg-gold/10 group"
                  >
                    <span className="block text-sm font-medium group-hover:text-yg-gold transition-colors">First time?</span>
                    <span className="block text-xs text-white/40 mt-0.5">Sign up with email</span>
                  </button>
                  <Link
                    href="/covenant"
                    className="block w-full px-5 py-4 text-left text-white/80 hover:bg-yg-gold/10 hover:text-white transition-all duration-300 group"
                    onClick={() => setShowCovenantMenu(false)}
                  >
                    <span className="block text-sm font-medium group-hover:text-yg-gold transition-colors">Already a member?</span>
                    <span className="block text-xs text-white/40 mt-0.5">Go to dashboard</span>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Subtle ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-radial from-yg-gold/5 via-transparent to-transparent" />
      </div>
    </section>
  );
}
