'use client';

export default function Hero() {
  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center px-6 md:px-8 lg:px-16 py-20 resend-canvas overflow-hidden">
      {/* Content - Centered on mobile, left on desktop like Resend */}
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="max-w-2xl mx-auto md:mx-0 text-center md:text-left">
          {/* Main headline - Resend style with gradient fade */}
          <h1 className="text-7xl sm:text-8xl md:text-8xl lg:text-9xl font-normal mb-6 md:mb-8 tracking-tight leading-[0.9]">
            <span className="text-gradient-fade font-serif">From </span>
            <span className="text-gradient-burgundy font-street">YN</span>
            <br />
            <span className="text-gradient-fade font-serif">to </span>
            <span className="shimmer font-serif">YG</span>
          </h1>

          {/* Subheadline - muted like Resend */}
          <p className="text-base md:text-lg text-[#a1a4a5] mb-8 max-w-md mx-auto md:mx-0 leading-7">
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
          <a
            href={process.env.NEXT_PUBLIC_TELEGRAM_URL || 'https://t.me/yntoyg'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-base md:text-lg text-[#a1a4a5] hover:text-white/70 transition-colors"
          >
            <span>Already hold $YNTOYG?</span>
            <span className="text-yg-gold/80 hover:text-yg-gold">Connect Telegram to claim videos →</span>
          </a>
        </div>
      </div>

      {/* Right side ambient glow element - hidden on mobile */}
      <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-yg-gold/5 via-transparent to-transparent" />
      </div>
    </section>
  );
}
