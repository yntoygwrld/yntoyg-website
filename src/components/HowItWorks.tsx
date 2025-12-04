'use client';

const steps = [
  {
    number: '01',
    title: 'BUY',
    description: 'Get $YNTOYG on Pump.fun',
    icon: '💰',
    color: 'from-yg-gold/20 to-yg-gold/5',
  },
  {
    number: '02',
    title: 'CLAIM',
    description: 'Daily video via Telegram',
    icon: '🎬',
    color: 'from-yg-burgundy/20 to-yg-burgundy/5',
  },
  {
    number: '03',
    title: 'POST',
    description: 'Repost on your socials',
    icon: '📱',
    color: 'from-yg-forest/20 to-yg-forest/5',
  },
  {
    number: '04',
    title: 'EARN',
    description: 'Climb the leaderboard',
    icon: '🏆',
    color: 'from-yg-gold/20 to-yg-gold/5',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 px-4 bg-yg-navy" id="how-it-works">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-yg-cream mb-4">
            How It <span className="text-yg-gold">Works</span>
          </h2>
          <p className="text-yg-cream/60 text-lg max-w-2xl mx-auto">
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
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-yg-gold/50 to-transparent" />
              )}

              {/* Card */}
              <div className={`bg-gradient-to-br ${step.color} border border-yg-cream/10 rounded-2xl p-6 h-full transition-all duration-300 hover:border-yg-gold/30 hover:scale-105`}>
                {/* Step number */}
                <div className="text-yg-gold/30 text-6xl font-bold mb-4">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="text-4xl mb-4">{step.icon}</div>

                {/* Title */}
                <h3 className="text-xl font-bold text-yg-cream mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-yg-cream/60">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-yg-cream/60 mb-6">
            Ready to start your transformation?
          </p>
          <a
            href={process.env.NEXT_PUBLIC_TELEGRAM_URL || 'https://t.me/yntoyg'}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center gap-2"
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
