'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Mail, Loader2, CheckCircle } from 'lucide-react';

interface EmailPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmailPopup({ isOpen, onClose }: EmailPopupProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setIsSuccess(false);
      setEmail('');
      setError('');
    }, 250);
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    const main = document.querySelector('main');
    if (isOpen && !isClosing) {
      document.body.style.overflow = 'hidden';
      if (main) {
        main.classList.add('modal-blur-active');
      }
    } else if (isClosing) {
      if (main) {
        main.classList.remove('modal-blur-active');
      }
    } else {
      document.body.style.overflow = '';
      if (main) {
        main.classList.remove('modal-blur-active');
      }
    }
    return () => {
      document.body.style.overflow = '';
      if (main) {
        main.classList.remove('modal-blur-active');
      }
    };
  }, [isOpen, isClosing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send magic link');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-6 md:p-8 ${isClosing ? 'modal-closing' : ''}`}
      onClick={closeModal}
    >
      {/* Backdrop */}
      <div className={`absolute inset-0 bg-black/70 ${isClosing ? 'modal-backdrop-closing' : 'modal-backdrop'}`} />

      {/* Modal */}
      <div
        className={`relative w-full max-w-md overflow-hidden rounded-[2rem] ${isClosing ? 'modal-content-closing' : 'modal-content'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ornate border frame */}
        <div className="absolute -inset-px bg-gradient-to-b from-yg-gold/30 via-yg-gold/10 to-yg-gold/30 rounded-[2rem]" />

        {/* Modal container */}
        <div className="relative bg-[#0a0a0c] rounded-[2rem] p-6 md:p-8">
          {/* Close button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-20 p-2 text-white/40 hover:text-white transition-colors bg-black/50 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>

          {isSuccess ? (
            // Success state
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yg-gold/20 mb-6">
                <CheckCircle className="w-8 h-8 text-yg-gold" />
              </div>
              <h3 className="text-2xl md:text-3xl font-serif text-white mb-3">
                Check Your <span className="text-glow-gold">Email</span>
              </h3>
              <p className="text-white/50 text-base mb-6">
                We've sent you a magic link to join the $YNTOYG Telegram bot.
              </p>
              <button
                onClick={closeModal}
                className="btn-outline"
              >
                Got it
              </button>
            </div>
          ) : (
            // Form state
            <>
              {/* Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="w-8 h-px bg-gradient-to-r from-transparent via-yg-gold/50 to-transparent" />
                  <div className="w-2 h-2 rotate-45 bg-yg-gold/50" />
                  <div className="w-8 h-px bg-gradient-to-r from-transparent via-yg-gold/50 to-transparent" />
                </div>
                <h3 className="text-2xl md:text-3xl font-serif text-white mb-2">
                  Join the <span className="text-glow-gold">Covenant</span>
                </h3>
                <p className="text-white/40 text-sm md:text-base">
                  Enter your email to receive your magic link
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Mail className="w-5 h-5 text-white/30" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="gentleman@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-yg-gold/50 focus:ring-1 focus:ring-yg-gold/50 transition-all"
                    disabled={isSubmitting}
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-sm text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-royal-gold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      Send Magic Link
                    </>
                  )}
                </button>
              </form>

              {/* Footer note */}
              <p className="text-white/30 text-xs text-center mt-6">
                You'll receive videos to this email.
              </p>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
