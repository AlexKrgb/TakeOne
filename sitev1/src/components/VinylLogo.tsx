import { motion } from 'motion/react';

export function VinylLogo() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "linear"
      }}
      className="w-12 h-12 cursor-pointer"
    >
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer vinyl disc */}
        <circle cx="50" cy="50" r="48" fill="#2E1510" stroke="#FCD478" strokeWidth="1"/>
        
        {/* Grooves */}
        <circle cx="50" cy="50" r="42" fill="none" stroke="#FCD478" strokeWidth="0.5" opacity="0.6"/>
        <circle cx="50" cy="50" r="38" fill="none" stroke="#FCD478" strokeWidth="0.5" opacity="0.6"/>
        <circle cx="50" cy="50" r="34" fill="none" stroke="#FCD478" strokeWidth="0.5" opacity="0.6"/>
        <circle cx="50" cy="50" r="30" fill="none" stroke="#FCD478" strokeWidth="0.5" opacity="0.6"/>
        
        {/* Label area */}
        <circle cx="50" cy="50" r="20" fill="#ED2800"/>
        
        {/* Center hole */}
        <circle cx="50" cy="50" r="8" fill="#2E1510"/>
        
        {/* Shine effect */}
        <path 
          d="M 30 30 Q 50 50 30 70" 
          stroke="#ffffff" 
          strokeWidth="2" 
          opacity="0.2" 
          fill="none"
        />
      </svg>
    </motion.div>
  );
}
