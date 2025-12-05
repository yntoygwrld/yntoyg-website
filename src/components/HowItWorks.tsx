'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Wallet, Film, Share2, Trophy, X, Bot, Star, Gift, ChevronRight, ChevronDown } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'BUY',
    description: 'Get $YNTOYG on Pump.fun',
    Icon: Wallet,
  },
  {
    number: '02',
    title: 'CLAIM',
    description: 'Daily videos via Telegram',
    Icon: Film,
  },
  {
    number: '03',
    title: 'POST',
    description: 'Repost on your socials',
    Icon: Share2,
  },
  {
    number: '04',
    title: 'EARN',
    description: 'Climb the leaderboard',
    Icon: Trophy,
  },
];

const detailSections = [
  {
    icon: Bot,
    title: 'The Telegram Bot',
    description: 'Connect your wallet to our exclusive Telegram bot. It verifies your $YNTOYG holdings and unlocks daily premium content designed to go viral.',
    highlight: 'Automated daily content delivery',
  },
  {
    icon: Star,
    title: 'The Points System',
    description: 'Every post you share earns points. Track your viral reach, engagement metrics, and climb the community leaderboard. Top performers get recognized.',
    highlight: 'Gamified viral growth',
  },
  {
    icon: Gift,
    title: 'Future Rewards',
    description: 'Points unlock exclusive rewards: airdrops, early access to features, community perks, and more. The more you contribute, the more you earn.',
    highlight: 'Coming soon',
  },
];

export default function HowItWorks() {
  const [showModal, setShowModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openModal = () => {
    setShowModal(true);
    setIsClosing(false);
  };

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setIsClosing(false);
    }, 250); // Match animation duration
  };

  // Lock body scroll and blur page when modal is open
  useEffect(() => {
    const main = document.querySelector('main');
    if (showModal && !isClosing) {
      document.body.style.overflow = 'hidden';
      if (main) {
        main.classList.add('modal-blur-active');
      }
    } else if (isClosing) {
      if (main) {
        main.classList.remove('modal-blur-active');
      }
    } else {
      document.body.style.overflow = '';
      if (main) {
        main.classList.remove('modal-blur-active');
      }
    }
    return () => {
      document.body.style.overflow = '';
      if (main) {
        main.classList.remove('modal-blur-active');
      }
    };
  }, [showModal, isClosing]);

  return (
    <>
      <section className="py-12 md:py-24 px-6 md:px-8 lg:px-16 section-plain section-divider" id="how-it-works">
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Section header - Resend style, centered */}
          <div className="text-center mb-8 md:mb-16">
            <h2 className="section-heading text-white mb-4 md:mb-5 text-[46px] md:text-[56px] lg:text-6xl">
              How It <span className="text-glow-gold">Works</span>
            </h2>
            <p className="text-[#a1a4a5] text-xl md:text-2xl max-w-md md:max-w-2xl mx-auto font-medium leading-9">
              Four simple steps to transform<br className="md:hidden" /> from <span className="text-gradient-burgundy font-street text-2xl md:text-3xl">YN</span> to <span className="text-gradient-gold font-serif text-2xl md:text-3xl">YG</span>
            </p>

            {/* Scroll indicator on mobile */}
            <div className="mt-6 md:hidden flex flex-col items-center text-white/30">
              <span className="text-xs mb-1">Scroll</span>
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </div>
          </div>

          {/* Steps grid - centered cards on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 max-w-sm md:max-w-none mx-auto">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative group"
              >
                {/* Connector line - elegant gold gradient */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px">
                    <div className="w-full h-full bg-gradient-to-r from-yg-gold/40 via-yg-gold/20 to-transparent" />
                  </div>
                )}

                {/* Card - Glass style with elegant hover, centered content on mobile */}
                <div className="glass-card rounded-2xl p-6 pt-3 h-full hover:scale-[1.02] text-center md:text-left">
                  {/* Step number - embossed effect */}
                  <div className="text-5xl md:text-6xl font-bold mb-0 md:mb-1 font-serif step-number-emboss">
                    {step.number}
                  </div>

                  {/* Icon with emboss effect */}
                  <div className="mb-4 md:mb-4 flex justify-center md:justify-start">
                    <step.Icon className="w-7 h-7 md:w-8 md:h-8 icon-gold-emboss" strokeWidth={1.5} />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-2">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[#a1a4a5] text-base">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* More Details link */}
          <div className="text-center mt-10">
            <button
              onClick={openModal}
              className="inline-flex items-center gap-2 text-white/50 hover:text-yg-gold text-base md:text-lg transition-all duration-300 group"
            >
              <span className="border-b border-dashed border-white/30 group-hover:border-yg-gold/50 pb-0.5">
                Learn more about the system
              </span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <p className="text-white/60 text-lg font-medium mb-6">
              Ready to start your transformation?
            </p>
            <a
              href={process.env.NEXT_PUBLIC_TELEGRAM_URL || 'https://t.me/yntoyg'}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z" />
              </svg>
              Join Telegram
            </a>
          </div>
        </div>
      </section>

      {/* Aristocratic Modal - rendered via portal to avoid blur */}
      {mounted && showModal && createPortal(
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-6 md:p-8 ${isClosing ? 'modal-closing' : ''}`}
          onClick={closeModal}
        >
          {/* Backdrop */}
          <div className={`absolute inset-0 bg-black/70 ${isClosing ? 'modal-backdrop-closing' : 'modal-backdrop'}`} />

          {/* Modal */}
          <div
            className={`relative w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-[2rem] md:rounded-[2.5rem] ${isClosing ? 'modal-content-closing' : 'modal-content'}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ornate border frame */}
            <div className="absolute -inset-px bg-gradient-to-b from-yg-gold/30 via-yg-gold/10 to-yg-gold/30 rounded-[2rem] md:rounded-[2.5rem]" />

            {/* Modal container */}
            <div className="relative bg-[#0a0a0c] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden">
              {/* Close button - fixed position */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-20 p-2 text-white/40 hover:text-white transition-colors bg-black/50 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Top fade gradient */}
              <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#0a0a0c] to-transparent z-10 pointer-events-none" />

              {/* Bottom fade gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#0a0a0c] to-transparent z-10 pointer-events-none" />

              {/* Scrollable content */}
              <div className="overflow-y-auto max-h-[80vh] p-6 md:p-10 modal-scroll">
                {/* Header with ornate styling */}
                <div className="text-center mb-10 pt-2">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="w-12 h-px bg-gradient-to-r from-transparent via-yg-gold/50 to-transparent" />
                    <div className="w-2 h-2 rotate-45 bg-yg-gold/50" />
                    <div className="w-12 h-px bg-gradient-to-r from-transparent via-yg-gold/50 to-transparent" />
                  </div>
                  <h3 className="text-[32px] md:text-[42px] font-serif text-white mb-3">
                    The <span className="text-glow-gold">Young Gentleman's</span> System
                  </h3>
                  <p className="text-white/40 text-base md:text-lg">
                    A refined approach to community-driven viral growth
                  </p>
                </div>

                {/* Detail sections */}
                <div className="space-y-6">
                  {detailSections.map((section, index) => (
                    <div
                      key={section.title}
                      className="relative"
                    >
                      {/* Connector line between sections */}
                      {index < detailSections.length - 1 && (
                        <div className="absolute left-6 top-16 w-px h-[calc(100%-2rem)] bg-gradient-to-b from-yg-gold/20 to-transparent" />
                      )}

                      <div className="flex gap-4">
                        {/* Icon circle */}
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yg-gold/10 border border-yg-gold/20 flex items-center justify-center">
                          <section.icon className="w-5 h-5 text-yg-gold" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-1">
                          <div className="flex flex-col items-start md:flex-row md:items-center gap-2 md:gap-3 mb-2">
                            <h4 className="text-xl md:text-2xl font-semibold text-white">
                              {section.title}
                            </h4>
                            <span className="text-[11px] md:text-xs uppercase tracking-wider px-2.5 py-1 bg-yg-gold/10 border border-yg-gold/20 rounded-full text-yg-gold/70 whitespace-nowrap">
                              {section.highlight}
                            </span>
                          </div>
                          <p className="text-white/50 text-base md:text-lg leading-relaxed">
                            {section.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer ornament and CTA */}
                <div className="mt-10 pt-8 border-t border-white/5 pb-4">
                  <div className="text-center">
                    <p className="text-white/30 text-xs mb-6">
                      Join the movement. Rise with the community.
                    </p>
                    <a
                      href={process.env.NEXT_PUBLIC_TELEGRAM_URL || 'https://t.me/yntoyg'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-royal-gold"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z" />
                      </svg>
                      Connect via Telegram
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
