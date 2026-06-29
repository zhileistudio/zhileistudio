import React, { useState, useRef, useEffect } from 'react';
import './GlareHover.css';

interface GlareHoverProps {
  children: React.ReactNode;
  glareColor?: string;
  glareOpacity?: number;
  glareAngle?: number;
  glareSize?: number;
  transitionDuration?: number;
  playOnce?: boolean;
  key?: React.Key;
}

export default function GlareHover({
  children,
  glareColor = '#ffffff',
  glareOpacity = 0.15, // 默认改为 0.15 白色眩光低透明度，柔和低调
  glareAngle = -30,
  glareSize = 350,
  transitionDuration = 650,
  playOnce = false,
}: GlareHoverProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({
    opacity: 0,
    transform: 'translate(-50%, -50%)',
    position: 'absolute',
    pointerEvents: 'none',
    zIndex: 3,
  });
  const [isHovered, setIsHovered] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (playOnce && hasPlayed) return;

      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setStyle({
        position: 'absolute',
        top: `${y}px`,
        left: `${x}px`,
        width: `${glareSize}px`,
        height: `${glareSize}px`,
        background: `radial-gradient(circle, ${glareColor} 0%, transparent 70%)`,
        opacity: glareOpacity,
        transform: `translate(-50%, -50%) rotate(${glareAngle}deg)`,
        pointerEvents: 'none',
        mixBlendMode: 'overlay',
        zIndex: 3,
        transition: isHovered ? 'none' : `opacity ${transitionDuration}ms ease, transform ${transitionDuration}ms ease`,
      });
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      setStyle((prev) => ({
        ...prev,
        opacity: 0,
        transition: `all ${transitionDuration}ms ease`,
      }));
      if (playOnce) {
        setHasPlayed(true);
      }
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [glareColor, glareOpacity, glareAngle, glareSize, transitionDuration, playOnce, hasPlayed, isHovered]);

  return (
    <div
      ref={containerRef}
      className="glare-hover-container"
    >
      {children}
      <div style={style} />
    </div>
  );
}
