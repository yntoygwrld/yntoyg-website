'use client';

import { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function CovenantJoin() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
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
            <h2 className="text-xl font-semibold text-white mb-2">Check Your Email</h2>
            <p className="text-white/50 mb-4">
              We've sent you a magic link to join our Telegram and start claiming daily videos.
            </p>
            <p className="text-white/30 text-sm">
              The link expires in 24 hours
            </p>
            <p className="text-amber-400/70 text-xs mt-3 px-4 py-2 bg-amber-400/5 rounded-lg">
              ⚠️ Don't see it? Check your spam folder and mark as "not spam"
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

            <button
              type="submit"
              disabled={isLoading || !email}
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
