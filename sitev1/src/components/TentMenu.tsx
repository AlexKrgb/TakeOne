import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TentMenuProps {
  onNavigate: (section: string) => void;
  bgColor: string;
}

export function TentMenu({ onNavigate, bgColor }: TentMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: 'Home', id: 'home' },
    { label: 'Next Event', id: 'next-event' },
    { label: 'About Us', id: 'about' },
    { label: 'Archive', id: 'archive' },
    { label: 'Contact Us', id: 'contact' },
  ];

  const handleNavigate = (id: string) => {
    onNavigate(id);
    setIsOpen(false);
  };

  // Alternate between light and dark menu theme based on section
  const getMenuColors = (currentBg: string) => {
    const sectionThemes: { [key: string]: 'light' | 'dark' } = {
      '#220b04': 'light',  // Home (1st) -> light menu
      '#FCD478': 'dark',   // Next Event (2nd) -> dark menu
      '#2E1510': 'light',  // About (3rd) -> light menu
      '#ED2800': 'dark',   // Archive (4th) -> dark menu
    };

    const theme = sectionThemes[currentBg] || 'light'; // Default to light for Contact
    
    if (theme === 'light') {
      return {
        bg: '#FCD478',
        text: '#2E1510'
      };
    } else {
      return {
        bg: '#220b04',
        text: '#FCD478'
      };
    }
  };

  const menuColors = getMenuColors(bgColor);

  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1920);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="fixed z-50"
         style={{
           top: windowWidth < 768 ? '1rem' : '2rem',
           right: windowWidth < 768 ? '1rem' : '2rem'
         }}>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="menu-button flex items-center justify-center bg-transparent text-[#ED2800] hover:opacity-70 transition-all duration-300 uppercase"
          style={{
            padding: windowWidth < 768 ? '0.375rem 0.75rem' : '0.5rem 1rem',
            fontSize: windowWidth < 768 ? '0.875rem' : '1rem'
          }}
          aria-label="Open menu"
        >
          [Menu]
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ 
              height: 0,
              opacity: 0 
            }}
            animate={{ 
              height: '100vh',
              opacity: 1 
            }}
            exit={{ 
              height: 0,
              opacity: 0 
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed top-0 left-0 w-full overflow-hidden"
            style={{
              transformOrigin: 'top',
              backgroundColor: menuColors.bg
            }}
          >
            {/* Close button in top right */}
            <button
              onClick={() => setIsOpen(false)}
              className="fixed menu-button flex items-center justify-center bg-transparent hover:opacity-70 transition-all duration-300 uppercase"
              style={{ 
                color: menuColors.text,
                top: windowWidth < 768 ? '1rem' : '2rem',
                right: windowWidth < 768 ? '1rem' : '2rem',
                padding: windowWidth < 768 ? '0.375rem 0.75rem' : '0.5rem 1rem',
                fontSize: windowWidth < 768 ? '0.875rem' : '1rem'
              }}
              aria-label="Close menu"
            >
              [Close]
            </button>

            <motion.nav 
              className="menu-nav flex flex-col items-start justify-center h-full"
              style={{
                paddingLeft: windowWidth < 640 ? '2rem' : windowWidth < 768 ? '2rem' : windowWidth < 1024 ? '3rem' : '4rem',
                gap: windowWidth < 640 ? '1rem' : windowWidth < 768 ? '1rem' : windowWidth < 1024 ? '1.5rem' : '2rem'
              }}
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.2,
                    delayChildren: 0.5
                  }
                }
              }}
            >
              {menuItems.map((item) => (
                <motion.button
                  key={item.id}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  transition={{ 
                    duration: 0.7,
                    ease: "easeOut"
                  }}
                  onClick={() => handleNavigate(item.id)}
                  className="menu-item hover:scale-110 transition-transform duration-200 uppercase"
                  style={{ 
                    color: menuColors.text,
                    fontSize: windowWidth < 640 ? '1.5rem' : windowWidth < 768 ? '1.5rem' : windowWidth < 1024 ? '1.875rem' : '2.25rem'
                  }}
                >
                  {item.label}
                </motion.button>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
