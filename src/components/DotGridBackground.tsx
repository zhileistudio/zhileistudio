import React, { useEffect, useRef } from 'react';

interface Dot {
  x: number;
  y: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
}

interface DotGridBackgroundProps {
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  activeColor?: string;
  proximity?: number;
  shockRadius?: number;
  shockStrength?: number;
  returnSpeed?: number;
  damping?: number;
  className?: string;
}

export default function DotGridBackground({
  dotSize = 3,
  gap = 24,
  baseColor = '#1A1A1A',
  activeColor = '#5C5C5C',
  proximity = 180,
  shockRadius = 130,
  shockStrength = 3,
  returnSpeed = 0.08,
  damping = 0.86,
  className = '',
}: DotGridBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dotsRef = useRef<Dot[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, lastX: 0, lastY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId: number;

    const hexToRgb = (hex: string) => {
      const value = hex.replace('#', '');
      return {
        r: parseInt(value.slice(0, 2), 16),
        g: parseInt(value.slice(2, 4), 16),
        b: parseInt(value.slice(4, 6), 16),
      };
    };

    const base = hexToRgb(baseColor);
    const active = hexToRgb(activeColor);

    const resize = () => {
      const parent = canvas.parentElement;
      const width = parent?.clientWidth || window.innerWidth;
      const height = parent?.clientHeight || window.innerHeight;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const dots: Dot[] = [];
      const step = dotSize + gap;

      for (let y = dotSize; y < height; y += step) {
        for (let x = dotSize; x < width; x += step) {
          dots.push({
            x,
            y,
            ox: 0,
            oy: 0,
            vx: 0,
            vy: 0,
          });
        }
      }

      dotsRef.current = dots;
    };

    const onMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouse = mouseRef.current;
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const dx = x - mouse.lastX;
      const dy = y - mouse.lastY;

      mouse.x = x;
      mouse.y = y;
      mouse.lastX = x;
      mouse.lastY = y;

      const speed = Math.hypot(dx, dy);

      if (speed > 8) {
        dotsRef.current.forEach(dot => {
          const dist = Math.hypot(dot.x - x, dot.y - y);

          if (dist < proximity) {
            const force = (1 - dist / proximity) * 0.55;
            dot.vx += dx * force;
            dot.vy += dy * force;
          }
        });
      }
    };

    const onClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      dotsRef.current.forEach(dot => {
        const dist = Math.hypot(dot.x - x, dot.y - y);

        if (dist < shockRadius) {
          const force = (1 - dist / shockRadius) * shockStrength;
          const angle = Math.atan2(dot.y - y, dot.x - x);

          dot.vx += Math.cos(angle) * force * 12;
          dot.vy += Math.sin(angle) * force * 12;
        }
      });
    };

    const draw = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;

      dotsRef.current.forEach(dot => {
        dot.vx += -dot.ox * returnSpeed;
        dot.vy += -dot.oy * returnSpeed;
        dot.vx *= damping;
        dot.vy *= damping;
        dot.ox += dot.vx;
        dot.oy += dot.vy;

        const dist = Math.hypot(dot.x - mouse.x, dot.y - mouse.y);
        const t = Math.max(0, 1 - dist / proximity);

        const r = Math.round(base.r + (active.r - base.r) * t);
        const g = Math.round(base.g + (active.g - base.g) * t);
        const b = Math.round(base.b + (active.b - base.b) * t);

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.beginPath();
        ctx.arc(dot.x + dot.ox, dot.y + dot.oy, dotSize / 2, 0, Math.PI * 2);
        ctx.fill();
      });

      rafId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('click', onClick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('click', onClick);
    };
  }, [
    dotSize,
    gap,
    baseColor,
    activeColor,
    proximity,
    shockRadius,
    shockStrength,
    returnSpeed,
    damping,
  ]);

  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        background: 'transparent',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
}
