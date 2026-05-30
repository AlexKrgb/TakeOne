import { useState, useEffect } from 'react';

export function VinylLogo() {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1920);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className="vinyl-logo vinyl-logo-spin cursor-pointer"
      style={{
        width: windowWidth < 768 ? '2rem' : windowWidth < 1024 ? '2.5rem' : '3rem',
        height: windowWidth < 768 ? '2rem' : windowWidth < 1024 ? '2.5rem' : '3rem',
        willChange: 'transform',
      }}
    >
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="48" fill="#2E1510" stroke="#FCD478" strokeWidth="1"/>
        <circle cx="50" cy="50" r="42" fill="none" stroke="#FCD478" strokeWidth="0.5" opacity="0.6"/>
        <circle cx="50" cy="50" r="38" fill="none" stroke="#FCD478" strokeWidth="0.5" opacity="0.6"/>
        <circle cx="50" cy="50" r="34" fill="none" stroke="#FCD478" strokeWidth="0.5" opacity="0.6"/>
        <circle cx="50" cy="50" r="30" fill="none" stroke="#FCD478" strokeWidth="0.5" opacity="0.6"/>
        <circle cx="50" cy="50" r="20" fill="#ED2800"/>
        <circle cx="50" cy="50" r="8" fill="#2E1510"/>
        <path 
          d="M 30 30 Q 50 50 30 70" 
          stroke="#ffffff" 
          strokeWidth="2" 
          opacity="0.2" 
          fill="none"
        />
      </svg>
    </div>
  );
}
