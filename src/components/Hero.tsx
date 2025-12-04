'use client';

import { useState } from 'react';

export default function Hero() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage('Check your email for the magic link!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Failed to send. Try again.');
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-yg-navy via-yg-navy to-yg-burgundy/20 -z-10" />

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-yg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-yg-burgundy/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="max-w-4xl mx-auto text-center z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-yg-gold/10 border border-yg-gold/30 rounded-full px-4 py-2 mb-8">
          <span className="text-yg-gold text-sm font-medium">🎩 The transformation begins</span>
        </div>

        {/* Main headline */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          <span className="text-yg-cream">FROM </span>
          <span className="text-yg-burgundy">YN</span>
          <span className="text-yg-cream"> TO </span>
          <span className="shimmer">YG</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-yg-cream/80 mb-4">
          Young Gentlemen - The Daily Grind
        </p>

        <p className="text-lg text-yg-cream/60 mb-12 max-w-2xl mx-auto">
          Buy $YNTOYG → Claim your unique daily video → Repost on socials →
          Climb the leaderboard. Together, we go viral.
        </p>

        {/* Email signup form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto mb-8">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-6 py-4 rounded-lg bg-yg-navy/50 border border-yg-gold/30 text-yg-cream placeholder-yg-cream/40 focus:outline-none focus:border-yg-gold transition-colors"
            disabled={status === 'loading'}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Sending...' : 'Join the Movement'}
          </button>
        </form>

        {/* Status message */}
        {message && (
          <p className={`text-sm mb-8 ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
            {message}
          </p>
        )}

        {/* Social proof */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-yg-cream/60 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-yg-gold font-bold text-2xl">1,000+</span>
            <span>Gentlemen</span>
          </div>
          <div className="h-8 w-px bg-yg-cream/20" />
          <div className="flex items-center gap-2">
            <span className="text-yg-gold font-bold text-2xl">15M+</span>
            <span>Monthly Impressions</span>
          </div>
          <div className="h-8 w-px bg-yg-cream/20" />
          <div className="flex items-center gap-2">
            <span className="text-yg-gold font-bold text-2xl">∞</span>
            <span>Viral Potential</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-yg-gold/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
