import { useState, useEffect } from 'react';

interface TypewriterEffectProps {
  fixedText: string;
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  onWordChange?: (index: number) => void;
  onProgressChange?: (progress: number) => void;
}

export function TypewriterEffect({ 
  fixedText,
  texts, 
  typingSpeed = 100, 
  deletingSpeed = 50,
  pauseDuration = 2000,
  onWordChange,
  onProgressChange
}: TypewriterEffectProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Notify when currentIndex changes
  useEffect(() => {
    if (onWordChange) {
      onWordChange(currentIndex);
    }
  }, [currentIndex, onWordChange]);

  useEffect(() => {
    const currentText = texts[currentIndex];
    
    // Calculate and report progress
    const progress = currentText.length > 0 ? displayText.length / currentText.length : 0;
    if (onProgressChange) {
      onProgressChange(progress);
    }
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        } else {
          // Finished typing, wait then start deleting
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        // Deleting
        if (displayText.length > 0) {
          setDisplayText(currentText.slice(0, displayText.length - 1));
        } else {
          // Finished deleting, move to next text
          setIsDeleting(false);
          setCurrentIndex((currentIndex + 1) % texts.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentIndex, texts, typingSpeed, deletingSpeed, pauseDuration, onProgressChange]);

  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1920);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex items-center justify-center">
      <span className="typewriter-text tracking-tight text-white"
            style={{
              fontSize: windowWidth < 640 ? '1.875rem' : windowWidth < 768 ? '2.25rem' : windowWidth < 1024 ? '3rem' : windowWidth < 1280 ? '3.75rem' : '6rem',
              paddingLeft: '1rem',
              paddingRight: '1rem'
            }}>
        {fixedText}{' '}
        <span className="text-[#ED2800]">{displayText}</span>
      </span>
      <span
        className="typewriter-cursor inline-block bg-[#ED2800] typewriter-cursor-blink"
        style={{
          width: windowWidth < 768 ? '2px' : '4px',
          height: windowWidth < 640 ? '2rem' : windowWidth < 768 ? '3rem' : windowWidth < 1024 ? '4rem' : windowWidth < 1280 ? '6rem' : '6rem',
          marginLeft: windowWidth < 768 ? '0.25rem' : '0.5rem'
        }}
      />
    </div>
  );
}
