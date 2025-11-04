import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

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

  return (
    <div className="flex items-center justify-center">
      <span className="text-6xl md:text-8xl tracking-tight text-white">
        {fixedText}{' '}
        <span className="text-[#ED2800]">{displayText}</span>
      </span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-block w-1 h-16 md:h-24 bg-[#ED2800] ml-2"
      />
    </div>
  );
}
