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
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden fabric-texture grain">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yg-navy to-yg-navy -z-10" />

      {/* Content */}
      <div className="max-w-4xl mx-auto text-center z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 border border-yg-gold/20 rounded-full px-4 py-2 mb-12">
          <span className="w-2 h-2 bg-yg-gold rounded-full animate-pulse" />
          <span className="text-yg-cream/60 text-sm tracking-wide">The transformation begins</span>
        </div>

        {/* Main headline - Resend style with Playfair */}
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal mb-8 tracking-tight text-glow">
          <span className="text-yg-cream">From </span>
          <span className="text-yg-burgundy">YN</span>
          <span className="text-yg-cream"> to </span>
          <span className="shimmer">YG</span>
        </h1>

        {/* Subheadline - clean Inter */}
        <p className="text-lg md:text-xl text-yg-cream/50 mb-6 font-light tracking-wide">
          The Daily Young Gentleman Grind
        </p>

        <p className="text-base text-yg-cream/40 mb-16 max-w-xl mx-auto leading-relaxed">
          Buy $YNTOYG → Claim your daily video → Repost on socials →
          Climb the leaderboard. Together, we go viral.
        </p>

        {/* Email signup form - elegant minimal */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto mb-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-5 py-3.5 rounded-lg bg-white/5 border border-yg-cream/10 text-yg-cream placeholder-yg-cream/30 focus:outline-none focus:border-yg-gold/50 focus:bg-white/[0.07] transition-all text-sm"
            disabled={status === 'loading'}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {status === 'loading' ? 'Sending...' : 'Join the Movement'}
          </button>
        </form>

        {/* Status message */}
        {message && (
          <p className={`text-sm mb-8 ${status === 'success' ? 'text-green-400/80' : 'text-red-400/80'}`}>
            {message}
          </p>
        )}

        {/* Elegant divider */}
        <div className="elegant-divider max-w-xs mx-auto my-16" />

        {/* Features - minimal style */}
        <div className="flex flex-wrap items-center justify-center gap-12 text-yg-cream/40 text-sm">
          <div className="flex items-center gap-3">
            <span className="text-yg-gold/70">📹</span>
            <span className="tracking-wide">Daily Videos</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-yg-gold/70">🏆</span>
            <span className="tracking-wide">Leaderboard</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-yg-gold/70">∞</span>
            <span className="tracking-wide">Viral Potential</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator - subtle */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-px h-12 bg-gradient-to-b from-yg-gold/40 to-transparent" />
      </div>
    </section>
  );
}
