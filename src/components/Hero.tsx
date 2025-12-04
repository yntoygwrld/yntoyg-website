'use client';

import dynamic from 'next/dynamic';

// Dynamically import the 3D component to avoid SSR issues
const QuarterZip3D = dynamic(() => import('./QuarterZip3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center">
      <div className="w-16 h-16 border-2 border-yg-gold/20 border-t-yg-gold rounded-full animate-spin" />
    </div>
  ),
});

interface HeroProps {
  onJoinClick: () => void;
}

export default function Hero({ onJoinClick }: HeroProps) {
  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center px-6 md:px-8 lg:px-16 py-20 resend-canvas overflow-hidden">
      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Two column layout on desktop */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">

          {/* Left side - Content */}
          <div className="flex-1 max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
            {/* Main headline - Resend style with gradient fade */}
            <h1 className="text-7xl sm:text-8xl md:text-8xl lg:text-9xl font-normal mb-6 md:mb-8 tracking-tight leading-[0.9]">
              <span className="text-gradient-fade font-serif">From </span>
              <span className="text-gradient-burgundy font-street">YN</span>
              <br />
              <span className="text-gradient-fade font-serif">to </span>
              <span className="shimmer font-serif">YG</span>
            </h1>

            {/* Subheadline - muted like Resend */}
            <p className="text-base md:text-lg text-[#a1a4a5] mb-8 max-w-md mx-auto lg:mx-0 leading-7">
              This is no mere sport - seize your opportunity.
              Buy $YNTOYG, claim daily videos, go viral together.
            </p>

            {/* Buttons - Stacked on mobile, row on desktop like Resend */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
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

          {/* Right side - 3D Quarter Zip (hidden on mobile, visible on lg+) */}
          <div className="hidden lg:flex flex-1 w-full max-w-2xl items-center justify-center">
            <div className="w-full h-[600px]">
              <QuarterZip3D />
            </div>
          </div>
        </div>
      </div>

      {/* Subtle ambient glow behind 3D element */}
      <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-yg-gold/5 via-transparent to-transparent" />
      </div>
    </section>
  );
}
