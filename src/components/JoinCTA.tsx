'use client';

import dynamic from 'next/dynamic';

const QuarterZip3D = dynamic(() => import('./QuarterZip3D'), {
  ssr: false,
  loading: () => <div className="w-full h-[250px]" />,
});

const socialLinks = [
  {
    name: 'Instagram',
    href: 'https://instagram.com/yntoyg',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: 'Telegram',
    href: process.env.NEXT_PUBLIC_TELEGRAM_URL || 'https://t.me/yntoyg',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z" />
      </svg>
    ),
  },
  {
    name: 'Twitter',
    href: process.env.NEXT_PUBLIC_TWITTER_URL || '#',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'TikTok',
    href: process.env.NEXT_PUBLIC_TIKTOK_URL || '#',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
  {
    name: 'DexScreener',
    href: '#',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        {/* Candlestick chart icon - represents DEX analytics */}
        <rect x="3" y="8" width="3" height="8" rx="0.5" />
        <rect x="10.5" y="4" width="3" height="12" rx="0.5" />
        <rect x="18" y="10" width="3" height="6" rx="0.5" />
        <line x1="4.5" y1="5" x2="4.5" y2="8" stroke="currentColor" strokeWidth="1.5" />
        <line x1="4.5" y1="16" x2="4.5" y2="19" stroke="currentColor" strokeWidth="1.5" />
        <line x1="12" y1="1" x2="12" y2="4" stroke="currentColor" strokeWidth="1.5" />
        <line x1="12" y1="16" x2="12" y2="20" stroke="currentColor" strokeWidth="1.5" />
        <line x1="19.5" y1="7" x2="19.5" y2="10" stroke="currentColor" strokeWidth="1.5" />
        <line x1="19.5" y1="16" x2="19.5" y2="22" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    name: 'Pump.fun',
    href: '#',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        {/* Rocket/pump icon - represents token launches */}
        <path d="M12 2C12 2 8 6 8 12c0 2.5 1 4.5 2.5 6l-1 3.5 2.5-1.5 2.5 1.5-1-3.5c1.5-1.5 2.5-3.5 2.5-6 0-6-4-10-4-10z" />
        <circle cx="12" cy="10" r="2" fill="currentColor" opacity="0.3" />
        <path d="M6 14c-1 1-2 3-2 4s2 1 3 0c.5-.5 1-2 1-2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M18 14c1 1 2 3 2 4s-2 1-3 0c-.5-.5-1-2-1-2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

interface JoinCTAProps {
  onJoinClick: () => void;
}

export default function JoinCTA({ onJoinClick }: JoinCTAProps) {
  return (
    <section className="py-12 md:py-24 px-6 md:px-8 lg:px-16 section-plain section-divider" id="join">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Main CTA - Glass card with elegant hover */}
        <div className="glass-card rounded-2xl md:rounded-3xl p-6 md:p-10 lg:p-16 mb-8 md:mb-12 hover:scale-[1.01]">
          <h2 className="section-heading text-white mb-4 md:mb-6 text-3xl md:text-4xl lg:text-5xl">
            Ready to <span className="text-glow-gold">Transform</span>?
          </h2>
          <p className="text-[#a1a4a5] text-xl md:text-2xl mb-6 md:mb-8 max-w-xl mx-auto leading-8">
            Join the movement. Claim your daily videos.<br className="md:hidden" /> Rise from <span className="text-gradient-burgundy font-street text-2xl md:text-3xl">YN</span> to <span className="text-gradient-gold font-serif text-2xl md:text-3xl">YG</span>.
          </p>

          {/* Primary buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://pump.fun"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full sm:w-auto"
            >
              Buy $YNTOYG
            </a>
            <button
              onClick={onJoinClick}
              className="btn-secondary w-full sm:w-auto"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Claim Videos
            </button>
          </div>
        </div>

        {/* Social links */}
        <div className="mb-8 md:mb-12">
          <p className="text-white/30 text-xs md:text-sm mb-4 md:mb-6">Follow us everywhere</p>
          <div className="flex justify-center gap-3 md:gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 md:p-3 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                aria-label={link.name}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>

        {/* 3D Quarter Zip */}
        <div className="my-2">
          <QuarterZip3D />
        </div>

        {/* Contract address placeholder */}
        <div className="bg-white/[0.02] border border-white/5 rounded-lg md:rounded-xl px-4 md:px-6 py-3 md:py-4 inline-block">
          <p className="text-white/30 text-[10px] md:text-xs mb-1">Contract Address</p>
          <code className="text-yg-gold text-xs md:text-sm">
            Coming soon...
          </code>
        </div>
      </div>
    </section>
  );
}
