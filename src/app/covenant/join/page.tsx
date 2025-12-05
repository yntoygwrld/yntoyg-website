'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import Link from 'next/link';

declare global {
  interface Window {
    turnstile: {
      render: (container: string | HTMLElement, options: {
        sitekey: string;
        callback: (token: string) => void;
        'error-callback'?: () => void;
        'expired-callback'?: () => void;
        theme?: 'light' | 'dark' | 'auto';
        size?: 'normal' | 'compact';
      }) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

export default function CovenantJoin() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const renderTurnstile = useCallback(() => {
    if (turnstileRef.current && window.turnstile && !widgetIdRef.current) {
      widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
        sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '',
        callback: (token: string) => setTurnstileToken(token),
        'error-callback': () => setError('Security verification failed. Please refresh.'),
        'expired-callback': () => setTurnstileToken(''),
        theme: 'dark',
      });
    }
  }, []);

  useEffect(() => {
    // Check if turnstile is already loaded
    if (window.turnstile) {
      renderTurnstile();
    } else {
      // Wait for script to load
      const checkTurnstile = setInterval(() => {
        if (window.turnstile) {
          clearInterval(checkTurnstile);
          renderTurnstile();
        }
      }, 100);

      return () => clearInterval(checkTurnstile);
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [renderTurnstile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!turnstileToken) {
      setError('Please complete the security verification');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, turnstileToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send link');
      }

      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0c] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-yg-gold/50 to-transparent" />
            <div className="w-2 h-2 rotate-45 bg-yg-gold/50" />
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-yg-gold/50 to-transparent" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-white mb-2">
            Join The <span className="text-glow-gold">Covenant</span>
          </h1>
          <p className="text-white/40">Enter your email to begin your transformation</p>
        </div>

        {sent ? (
          <div className="glass-card rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-yg-gold/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-yg-gold" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-3">Magic Link Sent!</h2>

            {/* Step-by-step instructions */}
            <div className="text-left space-y-2 mb-5 px-2">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yg-gold/20 flex items-center justify-center text-yg-gold text-xs font-bold">1</span>
                <p className="text-white/60 text-sm">Check your inbox for an email from <span className="text-white/80">YNTOYG Covenant</span></p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yg-gold/20 flex items-center justify-center text-yg-gold text-xs font-bold">2</span>
                <p className="text-white/60 text-sm">Click the link to connect your <span className="text-white/80">Telegram</span></p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yg-gold/20 flex items-center justify-center text-yg-gold text-xs font-bold">3</span>
                <p className="text-white/60 text-sm">Join our community to unlock <span className="text-white/80">daily videos</span></p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yg-gold/20 flex items-center justify-center text-yg-gold text-xs font-bold">4</span>
                <p className="text-white/60 text-sm">Start earning <span className="text-white/80">points</span> on the leaderboard</p>
              </div>
            </div>

            <p className="text-white/30 text-xs mb-3">
              Link expires in 24 hours
            </p>
            <p className="text-amber-400/70 text-xs px-4 py-2 bg-amber-400/5 rounded-lg">
              Don't see it? Check your spam folder and mark as "not spam"
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8">
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Mail className="w-5 h-5 text-white/30" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="gentleman@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-yg-gold/50 focus:ring-1 focus:ring-yg-gold/50 transition-all"
                disabled={isLoading}
                required
              />
            </div>

            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

            {/* Turnstile Widget */}
            <div ref={turnstileRef} className="flex justify-center mb-4" />

            <button
              type="submit"
              disabled={isLoading || !email || !turnstileToken}
              className="w-full btn-royal-gold flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="elegant-spinner-light" />
                  <span>Joining</span>
                  <span className="elegant-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                </>
              ) : (
                'Join the Covenant'
              )}
            </button>

            <p className="text-white/30 text-xs text-center mt-4">
              You'll receive a magic link to connect your Telegram
            </p>
          </form>
        )}

        {/* Already have an account - Login */}
        <div className="text-center mt-6">
          <Link
            href="/covenant/login"
            className="page-transition-link text-white/50 hover:text-yg-gold text-sm transition-colors group"
          >
            <span>Already a member?</span>
            <span className="text-yg-gold group-hover:text-yg-gold/80 transition-colors">Sign in →</span>
          </Link>
        </div>

        {/* Back to home */}
        <div className="text-center mt-3">
          <Link href="/" className="text-white/30 text-sm hover:text-white/50 transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
