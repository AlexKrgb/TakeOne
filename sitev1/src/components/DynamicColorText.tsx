import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

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

  const checkOverlap = () => {
    if (!textRef.current || !imageRef.current) return;

    const imageRect = imageRef.current.getBoundingClientRect();
    const chars = textRef.current.querySelectorAll('.char');
    
    const overlaps = Array.from(chars).map((char) => {
      const charRect = char.getBoundingClientRect();
      
      // Check if character overlaps with image
      return !(
        charRect.right < imageRect.left ||
        charRect.left > imageRect.right ||
        charRect.bottom < imageRect.top ||
        charRect.top > imageRect.bottom
      );
    });

    setCharOverlaps(overlaps);
  };

  useEffect(() => {
    // Initial check
    checkOverlap();

    // Check on scroll and resize
    const handleUpdate = () => {
      requestAnimationFrame(checkOverlap);
    };

    window.addEventListener('scroll', handleUpdate);
    window.addEventListener('resize', handleUpdate);

    // Set up a MutationObserver to detect when elements are mounted
    const observer = new MutationObserver(handleUpdate);
    if (textRef.current) {
      observer.observe(textRef.current, { childList: true, subtree: true });
    }

    // Also check periodically for the first few seconds to catch animations
    const interval = setInterval(checkOverlap, 100);
    setTimeout(() => clearInterval(interval), 3000);

    return () => {
      window.removeEventListener('scroll', handleUpdate);
      window.removeEventListener('resize', handleUpdate);
      observer.disconnect();
      clearInterval(interval);
    };
  }, [imageRef]);

  // Split text into lines and characters
  const lines = text.split('\n');
  let charIndex = 0;

  return (
    <div ref={textRef} className={className}>
      {lines.map((line, lineIndex) => (
        <div key={lineIndex}>
          {line.split('').map((char, i) => {
            const currentCharIndex = charIndex++;
            const isOverlapping = charOverlaps[currentCharIndex];
            
            return (
              <span
                key={`${lineIndex}-${i}`}
                className="char inline-block transition-colors duration-200"
                style={{ 
                  color: isOverlapping ? overlapColor : defaultColor
                }}
              >
                {char}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}
