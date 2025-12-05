'use client';

import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Show cursor when mouse moves
      if (!isVisible) setIsVisible(true);

      // Update cursor position with transform for smooth performance
      cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // Track hover state for interactive elements
    const handleElementMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('select') ||
        target.closest('[onclick]') ||
        target.closest('.cursor-pointer') ||
        window.getComputedStyle(target).cursor === 'pointer';

      setIsHovering(isInteractive);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleElementMouseOver);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleElementMouseOver);
    };
  }, [isVisible]);

  // Don't render on touch devices
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  if (isTouchDevice) return null;

  return (
    <div
      ref={cursorRef}
      className="custom-cursor-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '32px',
        height: '32px',
        pointerEvents: 'none',
        zIndex: 99999,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.15s ease',
        willChange: 'transform',
      }}
    >
      {/* Pointer cursor */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          top: '-4px',
          left: '-4px',
          opacity: isHovering ? 0 : 1,
          transition: 'opacity 0.15s ease, transform 0.15s ease',
          transform: isHovering ? 'scale(0.8)' : 'scale(1)',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
        }}
      >
        <defs>
          <linearGradient id="cursorGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5E6A3" />
            <stop offset="25%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#F5E6A3" />
            <stop offset="75%" stopColor="#B8972F" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>
          <linearGradient id="cursorDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </linearGradient>
        </defs>
        {/* Arrow pointer shape */}
        <path
          d="M8 4L8 26L13 21L17 28L21 26L17 19L24 19L8 4Z"
          fill="url(#cursorDark)"
          stroke="url(#cursorGold)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>

      {/* Hand/pointer cursor for interactive elements */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          top: '-2px',
          left: '-2px',
          opacity: isHovering ? 1 : 0,
          transition: 'opacity 0.15s ease, transform 0.15s ease',
          transform: isHovering ? 'scale(1)' : 'scale(0.8)',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
        }}
      >
        {/* Pointing hand shape */}
        <path
          d="M14 6C14 4.89543 14.8954 4 16 4C17.1046 4 18 4.89543 18 6V14H14V6Z"
          fill="url(#cursorDark)"
          stroke="url(#cursorGold)"
          strokeWidth="1.2"
        />
        <path
          d="M18 11C18 9.89543 18.8954 9 20 9C21.1046 9 22 9.89543 22 11V16H18V11Z"
          fill="url(#cursorDark)"
          stroke="url(#cursorGold)"
          strokeWidth="1.2"
        />
        <path
          d="M22 13C22 11.8954 22.8954 11 24 11C25.1046 11 26 11.8954 26 13V17H22V13Z"
          fill="url(#cursorDark)"
          stroke="url(#cursorGold)"
          strokeWidth="1.2"
        />
        <path
          d="M10 14C10 12.8954 10.8954 12 12 12C13.1046 12 14 12.8954 14 14V15H10V14Z"
          fill="url(#cursorDark)"
          stroke="url(#cursorGold)"
          strokeWidth="1.2"
        />
        <path
          d="M10 15V22C10 25.3137 12.6863 28 16 28H20C23.3137 28 26 25.3137 26 22V17H10V15Z"
          fill="url(#cursorDark)"
          stroke="url(#cursorGold)"
          strokeWidth="1.2"
        />
      </svg>
    </div>
  );
}
