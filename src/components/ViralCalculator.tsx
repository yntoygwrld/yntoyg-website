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
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            Viral growth isn't luck—it's inevitable when we all post together
          </p>
        </div>

        {/* Calculator card - Glass style */}
        <div className="glass-card rounded-3xl p-8 md:p-12">
          {/* Slider */}
          <div className="mb-12">
            <label className="block text-white/40 text-sm mb-4">
              Number of Gentlemen Posting Daily
            </label>
            <input
              type="range"
              min="100"
              max="10000"
              step="100"
              value={holders}
              onChange={(e) => setHolders(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-yg-gold"
            />
            <div className="flex justify-between text-white/30 text-sm mt-2">
              <span>100</span>
              <span className="text-glow-gold font-bold text-2xl">{formatNumber(holders)}</span>
              <span>10,000</span>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 text-center">
              <div className="text-glow-gold text-4xl md:text-5xl font-bold font-serif mb-2">
                {formatNumber(dailyImpressions)}
              </div>
              <div className="text-white/40 text-sm">Daily Impressions</div>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 text-center">
              <div className="text-glow-gold text-4xl md:text-5xl font-bold font-serif mb-2">
                {formatNumber(weeklyImpressions)}
              </div>
              <div className="text-white/40 text-sm">Weekly Impressions</div>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 text-center">
              <div className="text-glow-gold text-4xl md:text-5xl font-bold font-serif mb-2">
                {formatNumber(monthlyImpressions)}
              </div>
              <div className="text-white/40 text-sm">Monthly Impressions</div>
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

        {/* Bottom quote */}
        <div className="text-center mt-12">
          <blockquote className="text-white/30 italic text-lg font-serif">
            "The question isn't if we go viral - it's when."
          </blockquote>
        </div>
      </div>
    </section>
  );
}
