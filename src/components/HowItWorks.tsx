'use client';

import { Wallet, Film, Share2, Trophy } from 'lucide-react';

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

export default function HowItWorks() {
  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 section-plain section-divider" id="how-it-works">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header - Resend style */}
        <div className="text-center mb-16">
          <h2 className="section-heading text-white mb-4">
            How It <span className="text-glow-gold">Works</span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto font-medium">
            Four simple steps to transform from YN to YG
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative group"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-white/20 to-transparent" />
              )}

              {/* Card - Glass style */}
              <div className="glass-card rounded-2xl p-6 h-full transition-all duration-300 hover:scale-[1.02]">
                {/* Step number */}
                <div className="text-yg-gold/20 text-6xl font-bold mb-4 font-serif">
                  {step.number}
                </div>

                {/* Icon with emboss effect */}
                <div className="mb-4">
                  <step.Icon className="w-8 h-8 icon-gold-emboss" strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-white/50 text-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
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
  );
}
