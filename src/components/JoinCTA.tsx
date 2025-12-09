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
    href: 'https://x.com/yntoyg',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'TikTok',
    href: 'https://www.tiktok.com/@yntoyg',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
  {
    name: 'DexScreener',
    href: 'https://dexscreener.com/solana/DKQK952DZY59uhAgvZDNyMkDieGc7U25kNf4Q5FJpump',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 500 500">
        <path fillRule="evenodd" clipRule="evenodd" d="M301.226 178.11C319.434 170.483 342.603 159.257 365.799 143.875C370.69 152.407 371.226 159.852 368.706 165.863C366.92 170.1 363.555 173.785 359.131 176.717C354.339 179.885 348.355 182.192 341.74 183.438C329.188 185.813 314.533 184.427 301.226 178.11ZM304.383 256.253L328.486 267.948C279.271 291.118 265.892 334.142 250 376.047C234.109 334.142 220.728 291.118 171.515 267.948L195.619 256.253C197.95 255.513 199.943 254.172 201.312 252.422C202.681 250.672 203.355 248.603 203.238 246.512C201.029 207.267 213.644 189.912 230.66 179.015C236.763 175.112 243.426 173.152 250 173.152C256.573 173.152 263.236 175.112 269.341 179.015C286.357 189.912 298.972 207.267 296.763 246.512C296.646 248.603 297.321 250.672 298.689 252.422C300.058 254.172 302.051 255.513 304.383 256.253ZM250 0C277.861 0.628333 305.791 5.17167 330.031 14.01C346.817 20.1383 362.48 28.2333 376.662 37.9133C383.067 42.2833 388.341 46.505 394.15 51.365C409.819 51.82 432.718 37.1983 443.349 23.5167C425.053 73.9 341.565 133.398 283.765 156.165C283.742 156.157 283.726 156.145 283.708 156.135C273.335 149.482 261.668 146.155 250 146.155C238.331 146.155 226.666 149.482 216.293 156.135C216.275 156.143 216.259 156.158 216.236 156.165C158.434 133.398 74.948 73.9 56.6523 23.5167C67.2813 37.1983 90.1801 51.82 105.849 51.365C111.66 46.5067 116.934 42.2833 123.337 37.9133C137.519 28.2333 153.182 20.1383 169.968 14.01C194.21 5.17167 222.14 0.628333 250 0ZM198.773 178.11C180.567 170.483 157.396 159.257 134.202 143.875C129.311 152.407 128.775 159.852 131.293 165.863C133.081 170.1 136.446 173.785 140.869 176.717C145.662 179.885 151.646 182.192 158.261 183.438C170.813 185.813 185.466 184.427 198.773 178.11Z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M391.204 125.027C403.974 114.202 415.226 102.22 424.274 91.5283L428.869 98.7933C443.663 123.655 451.349 148.417 451.349 176.283L451.317 220.503L451.595 243.427C452.667 299.703 467.163 356.642 500 408.748L431.296 362.212L382.683 428.477L331.611 388.092L250 499.34L168.389 388.093L117.319 428.478L68.7063 362.213L0 408.75C32.8373 356.643 47.3333 299.705 48.4067 243.428L48.6845 220.505L48.6528 176.285C48.6528 148.417 56.3373 123.655 71.1349 98.795L75.7282 91.53C84.7758 102.222 96.0258 114.202 108.798 125.028L104.81 131.987C97.0615 145.502 94.496 160.613 100.532 174.985C104.423 184.242 111.524 192.18 120.679 198.24C129.567 204.125 140.087 208.092 151.101 210.175C158.276 211.532 165.585 212.09 172.847 211.9C171.153 219.968 170.413 228.337 170.365 236.863L105.556 268.307L155.567 291.855C159.565 293.738 163.37 295.894 166.944 298.303C208.177 329.4 232.966 421.395 250.002 466.33C267.04 421.395 291.827 329.4 333.062 298.303C336.636 295.894 340.441 293.737 344.438 291.855L394.45 268.307L329.639 236.863C329.591 228.337 328.851 219.968 327.157 211.9C334.419 212.09 341.728 211.532 348.903 210.175C359.917 208.092 370.438 204.125 379.325 198.24C388.478 192.18 395.581 184.242 399.47 174.985C405.508 160.613 402.94 145.503 395.194 131.987L391.206 125.028L391.204 125.027Z" />
      </svg>
    ),
  },
  {
    name: 'Pump.fun',
    href: 'https://pump.fun/coin/DKQK952DZY59uhAgvZDNyMkDieGc7U25kNf4Q5FJpump',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        {/* Capsule/pill shape - Pump.fun logo, rotated so clear side points top-right */}
        <g transform="rotate(-135 12 12)">
          {/* Top half filled */}
          <path d="M12 2C9.24 2 7 4.24 7 7v5h10V7c0-2.76-2.24-5-5-5z" fill="currentColor" />
          {/* Bottom half outline only */}
          <path d="M7 12v5c0 2.76 2.24 5 5 5s5-2.24 5-5v-5H7z" fill="none" stroke="currentColor" strokeWidth="1.5" />
          {/* Divider line */}
          <line x1="7" y1="12" x2="17" y2="12" stroke="currentColor" strokeWidth="1.5" />
        </g>
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
            Join the movement. Claim daily videos from your dashboard.<br className="md:hidden" /> Rise from <span className="text-gradient-burgundy font-street text-2xl md:text-3xl">YN</span> to <span className="text-gradient-gold font-serif text-2xl md:text-3xl">YG</span>.
          </p>

          {/* Primary buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://pump.fun/coin/DKQK952DZY59uhAgvZDNyMkDieGc7U25kNf4Q5FJpump"
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

        {/* Contract address */}
        <a
          href="https://pump.fun/coin/DKQK952DZY59uhAgvZDNyMkDieGc7U25kNf4Q5FJpump"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white/[0.02] border border-white/5 rounded-lg md:rounded-xl px-4 md:px-6 py-3 md:py-4 inline-block hover:border-yg-gold/30 hover:bg-white/[0.04] transition-all cursor-pointer"
        >
          <p className="text-white/30 text-[10px] md:text-xs mb-1">Contract Address</p>
          <code className="text-yg-gold text-xs md:text-sm font-mono break-all">
            DKQK952DZY59uhAgvZDNyMkDieGc7U25kNf4Q5FJpump
          </code>
        </a>
      </div>
    </section>
  );
}
