'use client';

import { useState } from 'react';

export default function ViralCalculator() {
  const [holders, setHolders] = useState(1000);
  const avgViews = 500;

  const dailyImpressions = holders * avgViews;
  const weeklyImpressions = dailyImpressions * 7;
  const monthlyImpressions = dailyImpressions * 30;

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 section-plain section-divider" id="the-math">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section header - Resend style */}
        <div className="text-center mb-16">
          <h2 className="section-heading text-white mb-4">
            The <span className="text-glow-gold">Math</span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto font-medium">
            Viral growth isn't luck - it's inevitable when we all post together
          </p>
        </div>

        {/* Calculator card - Glass style with elegant hover */}
        <div className="glass-card rounded-3xl p-8 md:p-12 hover:scale-[1.01]">
          {/* Royal Slider */}
          <div className="mb-12">
            <label className="block text-white/50 text-sm mb-6 font-medium tracking-wide uppercase">
              Number of Gentlemen Posting Daily
            </label>

            {/* Slider container with royal styling */}
            <div className="relative py-4">
              {/* Track background with gradient */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-full" />

              {/* Active track */}
              <div
                className="absolute top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-yg-gold/60 via-yg-gold to-yg-gold/80 rounded-full shadow-[0_0_10px_rgba(212,175,55,0.3)]"
                style={{ width: `${((holders - 100) / (10000 - 100)) * 100}%` }}
              />

              {/* Hidden native input */}
              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                value={holders}
                onChange={(e) => setHolders(Number(e.target.value))}
                className="royal-slider w-full h-6 appearance-none bg-transparent cursor-pointer relative z-10"
              />
            </div>

            {/* Scale markers */}
            <div className="flex justify-between items-center mt-4">
              <div className="flex flex-col items-start">
                <span className="text-white/30 text-xs font-medium">100</span>
                <span className="text-white/20 text-[10px]">MIN</span>
              </div>

              {/* Center value display - diamond style */}
              <div className="relative">
                <div className="absolute inset-0 bg-yg-gold/20 blur-xl rounded-full" />
                <div className="relative bg-gradient-to-b from-white/10 to-white/5 border border-yg-gold/30 rounded-xl px-6 py-2">
                  <span className="text-glow-gold font-bold text-3xl font-serif">{formatNumber(holders)}</span>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-white/30 text-xs font-medium">10,000</span>
                <span className="text-white/20 text-[10px]">MAX</span>
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 text-center">
              <div className="text-glow-gold text-4xl md:text-5xl font-bold font-serif mb-2">
                {formatNumber(dailyImpressions)}
              </div>
              <div className="text-white/50 text-sm">Daily Impressions</div>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 text-center">
              <div className="text-glow-gold text-4xl md:text-5xl font-bold font-serif mb-2">
                {formatNumber(weeklyImpressions)}
              </div>
              <div className="text-white/50 text-sm">Weekly Impressions</div>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 text-center">
              <div className="text-glow-gold text-4xl md:text-5xl font-bold font-serif mb-2">
                {formatNumber(monthlyImpressions)}
              </div>
              <div className="text-white/50 text-sm">Monthly Impressions</div>
            </div>
          </div>

          {/* Formula */}
          <div className="text-center">
            <div className="inline-block bg-white/[0.03] border border-white/5 rounded-xl px-6 py-4 mb-6">
              <code className="text-white/60 text-sm md:text-base">
                <span className="text-yg-gold">{formatNumber(holders)}</span> holders ×{' '}
                <span className="text-yg-gold">1</span> post/day ×{' '}
                <span className="text-yg-gold">{avgViews}</span> avg views ={' '}
                <span className="text-yg-gold font-bold">{formatNumber(dailyImpressions)}</span> daily
              </code>
            </div>
            <p className="text-white text-xl md:text-2xl font-semibold">
              Viral is <span className="text-glow-gold">INEVITABLE</span>
            </p>
          </div>
        </div>

        {/* Bottom quote - BIGGER and more visible */}
        <div className="text-center mt-12">
          <blockquote className="quote-featured">
            "The question isn't if we go viral — it's when."
          </blockquote>
        </div>
      </div>
    </section>
  );
}
