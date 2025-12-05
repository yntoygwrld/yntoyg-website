'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, UserPlus, LogIn } from 'lucide-react';
import Link from 'next/link';

interface CovenantPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUp: () => void;
}

export default function CovenantPopup({ isOpen, onClose, onSignUp }: CovenantPopupProps) {
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
    }, 250);
  };

  const handleSignUp = () => {
    closeModal();
    setTimeout(() => {
      onSignUp();
    }, 300);
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
        className={`relative w-full max-w-sm overflow-hidden rounded-[2rem] ${isClosing ? 'modal-content-closing' : 'modal-content'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ornate border frame */}
        <div className="absolute -inset-px bg-gradient-to-b from-yg-gold/30 via-yg-gold/10 to-yg-gold/30 rounded-[2rem]" />

        {/* Modal container */}
        <div className="relative bg-[#0a0a0c] rounded-[2rem] p-6">
          {/* Close button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-20 p-2 text-white/40 hover:text-white transition-colors bg-black/50 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-yg-gold/50 to-transparent" />
              <div className="w-2 h-2 rotate-45 bg-yg-gold/50" />
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-yg-gold/50 to-transparent" />
            </div>
            <h3 className="text-2xl font-serif text-white mb-2">
              Enter The <span className="text-glow-gold">Covenant</span>
            </h3>
            <p className="text-white/40 text-sm">
              Choose your path, gentleman
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {/* First time - Sign up */}
            <button
              onClick={handleSignUp}
              className="w-full flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-yg-gold/10 hover:border-yg-gold/30 transition-all group"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yg-gold/10 flex items-center justify-center group-hover:bg-yg-gold/20 transition-colors">
                <UserPlus className="w-6 h-6 text-yg-gold" />
              </div>
              <div className="text-left">
                <span className="block text-white font-medium group-hover:text-yg-gold transition-colors">First time?</span>
                <span className="block text-white/40 text-sm">Sign up with email</span>
              </div>
            </button>

            {/* Already a member - Dashboard */}
            <Link
              href="/covenant"
              onClick={closeModal}
              className="w-full flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-yg-gold/10 hover:border-yg-gold/30 transition-all group"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yg-gold/10 flex items-center justify-center group-hover:bg-yg-gold/20 transition-colors">
                <LogIn className="w-6 h-6 text-yg-gold" />
              </div>
              <div className="text-left">
                <span className="block text-white font-medium group-hover:text-yg-gold transition-colors">Already a member?</span>
                <span className="block text-white/40 text-sm">Go to dashboard</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
