import React, { useEffect, useRef } from 'react';

interface VariableProximityProps {
  label: string;
  className?: string;
  fromFontVariationSettings: string;
  toFontVariationSettings: string;
  containerRef: React.RefObject<HTMLElement | null>;
  radius?: number;
  falloff?: 'linear' | 'exponential' | 'quadratic';
  onClick?: () => void;
  style?: React.CSSProperties;
}

export default function VariableProximity({
  label,
  className = '',
  fromFontVariationSettings,
  toFontVariationSettings,
  containerRef,
  radius = 150,
  falloff = 'linear',
  onClick,
  style,
}: VariableProximityProps) {
  const spansRef = useRef<(HTMLSpanElement | null)[]>([]);

  // Parser of settings
  const parseSettings = (settingsStr: string): Record<string, number> => {
    const result: Record<string, number> = {};
    const parts = settingsStr.split(',');
    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      const match = trimmed.match(/(['"]?[\w-]+['"]?)\s+([\d.-]+)/);
      if (match) {
        const axis = match[1];
        const value = parseFloat(match[2]);
        result[axis] = value;
      }
    }
    return result;
  };

  const parsedFrom = parseSettings(fromFontVariationSettings);
  const parsedTo = parseSettings(toFontVariationSettings);

  const cachedPositions = useRef<{ x: number; y: number }[]>([]);

  const calculatePositions = () => {
    cachedPositions.current = spansRef.current.map((span) => {
      if (!span) return { x: 0, y: 0 };
      const rect = span.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      if (cachedPositions.current.length === 0 || cachedPositions.current.every(p => p.x === 0 && p.y === 0)) {
        calculatePositions();
      }

      const mouseX = e.clientX;
      const mouseY = e.clientY;

      spansRef.current.forEach((span, index) => {
        if (!span) return;

        const pos = cachedPositions.current[index];
        if (!pos || (pos.x === 0 && pos.y === 0)) return;

        const distance = Math.sqrt((mouseX - pos.x) ** 2 + (mouseY - pos.y) ** 2);

        let factor = 0;
        if (distance < radius) {
          if (falloff === 'linear') {
            factor = 1 - distance / radius;
          } else if (falloff === 'exponential') {
            factor = Math.pow(1 - distance / radius, 2);
          } else if (falloff === 'quadratic') {
            factor = 1 - Math.pow(distance / radius, 2);
          }
        }

        // Interpolate axis settings
        const parts: string[] = [];
        for (const axis in parsedFrom) {
          const fromVal = parsedFrom[axis];
          const toVal = parsedTo[axis] !== undefined ? parsedTo[axis] : fromVal;
          const interpolated = fromVal + (toVal - fromVal) * factor;
          parts.push(`${axis} ${interpolated}`);
        }
        
        // Disable transitions on active mouse moves for ultra-responsive tracking
        span.style.transition = 'font-variation-settings 0.1s ease-out';
        span.style.fontVariationSettings = parts.join(', ');
      });
    };

    const handleMouseEnter = () => {
      calculatePositions();
    };

    const handleMouseLeave = () => {
      // Revert with a silky-smooth transitional curve
      spansRef.current.forEach((span) => {
        if (!span) return;
        span.style.transition = 'font-variation-settings 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        span.style.fontVariationSettings = fromFontVariationSettings;
      });
      cachedPositions.current = [];
    };

    const handleResizeOrScroll = () => {
      cachedPositions.current = [];
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResizeOrScroll, { passive: true });
    window.addEventListener('scroll', handleResizeOrScroll, { passive: true });
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mouseenter', handleMouseEnter, { passive: true });
      container.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResizeOrScroll);
      window.removeEventListener('scroll', handleResizeOrScroll);
      if (container) {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [containerRef, parsedFrom, parsedTo, radius, falloff, fromFontVariationSettings]);

  // Split label into words to handle space wrapping correctly
  const words = label.split(' ');
  let charIndexGlobal = 0;

  return (
    <div 
      className={`inline-flex flex-wrap ${className}`} 
      onClick={onClick} 
      style={{ ...style, cursor: onClick ? 'pointer' : 'default' }}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-flex whitespace-nowrap mr-[0.25em] last:mr-0">
          {word.split('').map((char, charIndex) => {
            const index = charIndexGlobal++;
            return (
              <span
                key={charIndex}
                ref={(el) => {
                  spansRef.current[index] = el;
                }}
                className="inline-block"
                style={{ fontVariationSettings: fromFontVariationSettings }}
              >
                {char}
              </span>
            );
          })}
        </span>
      ))}
    </div>
  );
}
