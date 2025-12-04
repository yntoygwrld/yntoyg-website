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
    <section className="min-h-screen flex items-center px-4 md:px-8 lg:px-16 py-20 resend-canvas overflow-hidden">
      {/* Content - Left aligned like Resend */}
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="max-w-2xl">
          {/* Main headline - Resend style with gradient fade */}
          <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-normal mb-8 tracking-tight leading-[0.9]">
            <span className="text-gradient-fade">From </span>
            <span className="text-gradient-burgundy">YN</span>
            <br />
            <span className="text-gradient-fade">to </span>
            <span className="text-gradient-gold">YG</span>
          </h1>

          {/* Subheadline - muted like Resend */}
          <p className="text-base md:text-lg text-white/50 mb-8 max-w-md leading-relaxed">
            The best way to transform from street to success.
            Buy $YNTOYG, claim daily videos, go viral together.
          </p>

          {/* Buttons - Resend style */}
          <div className="flex items-center gap-2 mb-12">
            <button className="btn-primary">
              Get Started
            </button>
            <button className="btn-secondary">
              Learn More
            </button>
          </div>

          {/* Email signup - subtle */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-sm">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-all text-sm"
              disabled={status === 'loading'}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-5 py-3 rounded-lg bg-white/10 text-white/80 text-sm font-medium hover:bg-white/15 transition-all disabled:opacity-50"
            >
              {status === 'loading' ? '...' : 'Join'}
            </button>
          </form>

          {/* Status message */}
          {message && (
            <p className={`text-sm mt-4 ${status === 'success' ? 'text-green-400/80' : 'text-red-400/80'}`}>
              {message}
            </p>
          )}
        </div>
      </div>

      {/* Right side ambient glow element (like Resend's 3D keyboard) */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-yg-gold/5 via-transparent to-transparent" />
      </div>
    </section>
  );
}
