import { useEffect, useRef, useState, useCallback } from 'react';

interface DynamicColorTextProps {
  text: string;
  className?: string;
  imageRef: React.RefObject<HTMLDivElement>;
  defaultColor?: string;
  overlapColor?: string;
}

export function DynamicColorText({ 
  text, 
  className = '', 
  imageRef,
  defaultColor = '#2E1510',
  overlapColor = 'white'
}: DynamicColorTextProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const [charOverlaps, setCharOverlaps] = useState<boolean[]>([]);
  const overlapsRef = useRef<boolean[]>([]);
  const rafRef = useRef<number>();

  const checkOverlap = useCallback(() => {
    if (!textRef.current || !imageRef.current) return;

    const imageRect = imageRef.current.getBoundingClientRect();
    const chars = textRef.current.querySelectorAll('.char');
    
    const overlaps = Array.from(chars).map((char) => {
      const charRect = char.getBoundingClientRect();
      return !(
        charRect.right < imageRect.left ||
        charRect.left > imageRect.right ||
        charRect.bottom < imageRect.top ||
        charRect.top > imageRect.bottom
      );
    });

    const prev = overlapsRef.current;
    const changed =
      overlaps.length !== prev.length ||
      overlaps.some((value, index) => value !== prev[index]);

    if (changed) {
      overlapsRef.current = overlaps;
      setCharOverlaps(overlaps);
    }
  }, [imageRef]);

  useEffect(() => {
    const scheduleCheck = () => {
      if (rafRef.current === undefined) {
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = undefined;
          checkOverlap();
        });
      }
    };

    checkOverlap();
    window.addEventListener('scroll', scheduleCheck, { passive: true });
    window.addEventListener('resize', scheduleCheck, { passive: true });

    return () => {
      window.removeEventListener('scroll', scheduleCheck);
      window.removeEventListener('resize', scheduleCheck);
      if (rafRef.current !== undefined) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [checkOverlap]);

  const lines = text.split('\n');
  let charIndex = 0;

  return (
    <div ref={textRef} className={className}>
      {lines.map((line, lineIndex) => (
        <div key={lineIndex}>
          {line.split('').map((char, i) => {
            const currentCharIndex = charIndex++;
            const isOverlapping = charOverlaps[currentCharIndex];
            
            const displayChar = char === ' ' ? '\u00A0' : char;
            return (
              <span
                key={`${lineIndex}-${i}`}
                className="char inline-block transition-colors duration-200"
                style={{ 
                  color: isOverlapping ? overlapColor : defaultColor
                }}
              >
                {displayChar}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}
