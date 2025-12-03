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
    <section className="py-24 px-4 bg-gradient-to-b from-yg-navy to-yg-navy/95" id="the-math">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-yg-cream mb-4">
            The <span className="text-yg-gold">Math</span>
          </h2>
          <p className="text-yg-cream/60 text-lg max-w-2xl mx-auto">
            Viral growth isn't luck—it's inevitable when we all post together
          </p>
        </div>

        {/* Calculator card */}
        <div className="bg-gradient-to-br from-yg-gold/10 to-yg-burgundy/10 border border-yg-cream/10 rounded-3xl p-8 md:p-12">
          {/* Slider */}
          <div className="mb-12">
            <label className="block text-yg-cream/60 text-sm mb-4">
              Number of Gentlemen Posting Daily
            </label>
            <input
              type="range"
              min="100"
              max="10000"
              step="100"
              value={holders}
              onChange={(e) => setHolders(Number(e.target.value))}
              className="w-full h-3 bg-yg-navy rounded-lg appearance-none cursor-pointer accent-yg-gold"
            />
            <div className="flex justify-between text-yg-cream/40 text-sm mt-2">
              <span>100</span>
              <span className="text-yg-gold font-bold text-2xl">{formatNumber(holders)}</span>
              <span>10,000</span>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-yg-navy/50 rounded-2xl p-6 text-center">
              <div className="text-yg-gold text-4xl md:text-5xl font-bold mb-2">
                {formatNumber(dailyImpressions)}
              </div>
              <div className="text-yg-cream/60">Daily Impressions</div>
            </div>
            <div className="bg-yg-navy/50 rounded-2xl p-6 text-center">
              <div className="text-yg-gold text-4xl md:text-5xl font-bold mb-2">
                {formatNumber(weeklyImpressions)}
              </div>
              <div className="text-yg-cream/60">Weekly Impressions</div>
            </div>
            <div className="bg-yg-navy/50 rounded-2xl p-6 text-center">
              <div className="text-yg-gold text-4xl md:text-5xl font-bold mb-2">
                {formatNumber(monthlyImpressions)}
              </div>
              <div className="text-yg-cream/60">Monthly Impressions</div>
            </div>
          </div>

          {/* Formula */}
          <div className="text-center">
            <div className="inline-block bg-yg-navy/70 rounded-xl px-6 py-4 mb-6">
              <code className="text-yg-cream/80 text-sm md:text-base">
                <span className="text-yg-gold">{formatNumber(holders)}</span> holders ×{' '}
                <span className="text-yg-gold">1</span> post/day ×{' '}
                <span className="text-yg-gold">{avgViews}</span> avg views ={' '}
                <span className="text-yg-gold font-bold">{formatNumber(dailyImpressions)}</span> daily
              </code>
            </div>
            <p className="text-yg-cream text-xl md:text-2xl font-bold">
              Viral is <span className="shimmer">INEVITABLE</span>
            </p>
          </div>
        </div>

        {/* Bottom quote */}
        <div className="text-center mt-12">
          <blockquote className="text-yg-cream/60 italic text-lg">
            "The question isn't if we go viral—it's when."
          </blockquote>
        </div>
      </div>
    </section>
  );
}
