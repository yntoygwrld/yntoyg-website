'use client';

export default function Hero() {
  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center px-4 md:px-8 lg:px-16 py-20 resend-canvas overflow-hidden">
      {/* Content - Left aligned like Resend */}
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="max-w-2xl">
          {/* Main headline - Resend style with gradient fade */}
          <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-normal mb-8 tracking-tight leading-[0.9]">
            <span className="text-gradient-fade">From </span>
            <span className="text-gradient-burgundy">YN</span>
            <br />
            <span className="text-gradient-fade">to </span>
            <span className="text-gradient-gold">YG</span>
          </h1>

          {/* Subheadline - muted like Resend */}
          <p className="text-base md:text-lg text-white/50 mb-8 max-w-md leading-relaxed">
            The best way to transform from street to success.
            Buy $YNTOYG, claim daily videos, go viral together.
          </p>

          {/* Buttons - Resend style */}
          <div className="flex items-center gap-4 mb-8">
            <a
              href="https://pump.fun"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Purchase
            </a>
            <button
              onClick={scrollToHowItWorks}
              className="btn-secondary"
            >
              Learn More
            </button>
          </div>

          {/* Subtle Telegram connect - optional, non-intrusive */}
          <a
            href={process.env.NEXT_PUBLIC_TELEGRAM_URL || 'https://t.me/yntoyg'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/60 transition-colors"
          >
            <span>Already hold $YNTOYG?</span>
            <span className="text-yg-gold/70 hover:text-yg-gold">Connect Telegram to claim videos →</span>
          </a>
        </div>
      </div>

      {/* Right side ambient glow element (placeholder for 3D object) */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-yg-gold/5 via-transparent to-transparent" />
      </div>
    </section>
  );
}
