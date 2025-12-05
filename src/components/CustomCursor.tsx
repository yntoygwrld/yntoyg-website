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

      setIsHovering(!!isInteractive);
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
      {/* Golden pointer cursor - default */}
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
          transition: 'opacity 0.15s ease',
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
        </defs>
        {/* Arrow pointer - black outline */}
        <path
          d="M8 4L8 26L13 21L17 28L21 26L17 19L24 19L8 4Z"
          fill="#000000"
          stroke="#000000"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Arrow pointer - gold fill */}
        <path
          d="M8 4L8 26L13 21L17 28L21 26L17 19L24 19L8 4Z"
          fill="url(#cursorGold)"
          stroke="#000000"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>

      {/* Royal X cursor - on hover */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          top: '0px',
          left: '0px',
          opacity: isHovering ? 1 : 0,
          transition: 'opacity 0.15s ease',
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))',
        }}
      >
        <defs>
          <linearGradient id="royalGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5E6A3" />
            <stop offset="25%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#F5E6A3" />
            <stop offset="75%" stopColor="#B8972F" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>
        </defs>
        {/* Black outline for visibility */}
        <path
          d="M6 6L18 18M18 6L6 18"
          stroke="#000000"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* X shape with royal gold gradient */}
        <path
          d="M6 6L18 18M18 6L6 18"
          stroke="url(#royalGold)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
