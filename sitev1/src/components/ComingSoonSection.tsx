import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { HERO_IMAGES } from '../content/siteAssets';
import { DynamicColorText } from './DynamicColorText';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Instagram } from 'lucide-react';

interface DJInfo {
  name: string;
  instagram: string;
  description: string;
}

interface ComingSoonSectionProps {
  resetTrigger?: string;
}

export function ComingSoonSection({ resetTrigger }: ComingSoonSectionProps = {}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedDJ, setSelectedDJ] = useState<DJInfo | null>(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1920);
  
  // Reset state when leaving the next-event section
  useEffect(() => {
    if (resetTrigger && resetTrigger !== 'next-event') {
      setIsExpanded(false);
      setSelectedDJ(null);
    }
  }, [resetTrigger]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const comingSoonImageRef = useRef<HTMLDivElement>(null);
  const eventImageRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const djDatabase: Record<string, DJInfo> = {
    "LONED": {
      name: "DJ AURORA",
      instagram: "@dj_aurora_official",
      description: "Pioneering techno artist known for ethereal soundscapes and deep bass lines. Aurora has been shaking dance floors across Europe for over a decade."
    },
    "YAARK": {
      name: "TECHNO SOUL",
      instagram: "@techno_soul_beats",
      description: "Master of melodic techno, blending soulful elements with driving beats. Known for marathon sets that take listeners on emotional journeys."
    },
    "BASS HARMONY": {
      name: "BASS HARMONY",
      instagram: "@bassharmony_dj",
      description: "Underground legend specializing in heavy basslines and hypnotic grooves. A resident DJ at some of Europe's most prestigious clubs."
    }
  };

  const eventDetails = {
    name: "MIRÒ CLUB ",
    date: "19 DEC 2025",
    location: "MIRO CLUB",
    address: "Piazza Domenicani, 3b, 39100 ",
    city: "Bolzano, Italy",
    lineup: ["LONED", "YAARK"]
  };

  return (
    <div ref={sectionRef} className="relative min-h-screen flex items-center overflow-hidden"
         style={{
           paddingRight: windowWidth < 640 ? '0.5rem' : windowWidth < 768 ? '1rem' : windowWidth < 1024 ? '2rem' : '0',
           flexDirection: windowWidth < 768 ? 'column' : 'row',
           justifyContent: windowWidth < 768 ? 'center' : 'flex-end',
           gap: windowWidth < 768 ? '2rem' : '0',
           paddingTop: windowWidth < 768 ? '2rem' : '0',
           paddingBottom: windowWidth < 768 ? '2rem' : '0'
         }}>
      {windowWidth >= 1024 && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translate(-20%, -50%)',
            width: '320px',
            height: '480px',
            borderRadius: '1.5rem',
            overflow: 'hidden',
            border: 'none',
            zIndex: 1,
            boxShadow: 'none'
          }}
        >
          <video
            ref={videoRef}
            src="/incoming/letters.mp4"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            autoPlay
            loop
            muted
            playsInline
            preload="none"
          />
        </div>
      )}
      {/* Coming Soon State */}
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.div 
            key="coming-soon"
            className="relative z-[2] flex items-center"
            style={{
              marginRight: windowWidth < 768 ? '0' : windowWidth < 1024 ? '2rem' : '4rem',
              gap: windowWidth < 640 ? '0.5rem' : windowWidth < 768 ? '0.75rem' : windowWidth < 1024 ? '1.5rem' : '2rem',
              flexDirection: 'row',
              width: windowWidth < 768 ? '100%' : 'auto',
              justifyContent: windowWidth < 768 ? 'center' : 'flex-start',
              paddingLeft: windowWidth < 768 ? '1rem' : '0',
              paddingRight: windowWidth < 768 ? '1rem' : '0'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {/* Plus Button */}
            <motion.button
              className="rounded-full border-[#2E1510] flex items-center justify-center flex-shrink-0 group relative overflow-hidden"
              style={{
                width: windowWidth < 640 ? '2.5rem' : windowWidth < 768 ? '3rem' : windowWidth < 1024 ? '4.5rem' : '8rem',
                height: windowWidth < 640 ? '2.5rem' : windowWidth < 768 ? '3rem' : windowWidth < 1024 ? '4.5rem' : '8rem',
                borderWidth: windowWidth < 640 ? '2px' : windowWidth < 768 ? '2px' : '4px'
              }}
              onClick={() => setIsExpanded(true)}
              whileHover={{ 
                scale: 1.15, 
                backgroundColor: '#ED2800',
                borderColor: '#ED2800',
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <motion.span 
                className="leading-none text-[#2E1510] flex items-center justify-center"
                style={{ 
                  marginTop: '-0.15em',
                  fontSize: windowWidth < 640 ? '1.5rem' : windowWidth < 768 ? '2rem' : windowWidth < 1024 ? '3rem' : '6rem'
                }}
                animate={{ rotate: 0 }}
                whileHover={{ color: '#ffffff', rotate: 90 }}
                transition={{ duration: 0.3 }}
              >
                +
              </motion.span>
            </motion.button>

            {/* Coming Soon Text */}
            <div style={{
              fontSize: windowWidth < 640 ? '2rem' : windowWidth < 768 ? '2.5rem' : windowWidth < 1024 ? '4rem' : windowWidth < 1280 ? '9rem' : '12rem'
            }}>
              <DynamicColorText
                text={'coming\nsoon'}
                className="leading-[0.85] lowercase"
                imageRef={comingSoonImageRef}
                defaultColor="#2E1510"
                overlapColor="white"
              />
            </div>
          </motion.div>
        ) : (
          /* Event Details State */
          <motion.div 
            key="event-details"
            className="relative z-[2] flex items-center"
            style={{
              marginRight: windowWidth < 768 ? '0' : '3rem',
              gap: windowWidth < 640 ? '0.5rem' : windowWidth < 768 ? '0.75rem' : windowWidth < 1024 ? '1.5rem' : '2rem',
              flexDirection: 'row',
              width: windowWidth < 768 ? '100%' : 'auto',
              justifyContent: windowWidth < 768 ? 'center' : 'flex-end',
              paddingLeft: windowWidth < 768 ? '1rem' : '0',
              paddingRight: windowWidth < 1024 ? '2rem' : windowWidth < 1280 ? '8rem' : '12rem',
              maxWidth: 'min(1200px, 100%)'
            }}
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {/* Minus Button */}
            <motion.button
              className="rounded-full border-[#2E1510] flex items-center justify-center flex-shrink-0 group relative overflow-hidden"
              style={{
                width: windowWidth < 640 ? '2.5rem' : windowWidth < 768 ? '3rem' : windowWidth < 1024 ? '4.5rem' : '8rem',
                height: windowWidth < 640 ? '2.5rem' : windowWidth < 768 ? '3rem' : windowWidth < 1024 ? '4.5rem' : '8rem',
                borderWidth: windowWidth < 640 ? '2px' : windowWidth < 768 ? '2px' : '4px'
              }}
              onClick={() => setIsExpanded(false)}
              initial={{ rotate: 90 }}
              animate={{ rotate: 0 }}
              whileHover={{ 
                scale: 1.15, 
                backgroundColor: '#ED2800',
                borderColor: '#ED2800',
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <motion.span 
                className="leading-none text-[#2E1510] flex items-center justify-center"
                style={{ 
                  marginTop: '-0.15em',
                  fontSize: windowWidth < 640 ? '1.5rem' : windowWidth < 768 ? '2rem' : windowWidth < 1024 ? '3rem' : '6rem'
                }}
                whileHover={{ color: '#ffffff' }}
                transition={{ duration: 0.3 }}
              >
                −
              </motion.span>
            </motion.button>

            {/* Event Info */}
            <motion.div 
              className="flex flex-col items-center text-center"
              style={{
                gap: windowWidth < 640 ? '0.75rem' : windowWidth < 768 ? '1rem' : '1.5rem',
                width: windowWidth < 768 ? '100%' : windowWidth < 1024 ? '70%' : '28rem',
                margin: '0 auto'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div style={{
                fontSize: windowWidth < 640 ? '2rem' : windowWidth < 768 ? '2.5rem' : windowWidth < 1024 ? '4rem' : '5rem',
                width: '100%',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                <DynamicColorText
                  text={eventDetails.name}
                  className="uppercase tracking-tight leading-none"
                  imageRef={eventImageRef}
                  defaultColor="#2E1510"
                  overlapColor="white"
                />
              </div>
              <div className="flex flex-col items-center" style={{ gap: windowWidth < 768 ? '0.5rem' : '0.75rem', width: '100%' }}>
                <p className="text-[#2E1510]"
                   style={{
                     fontSize: windowWidth < 640 ? '1rem' : windowWidth < 768 ? '1.25rem' : windowWidth < 1024 ? '1.875rem' : '1.875rem'
                   }}>
                  {eventDetails.date}
                </p>
                <p className="text-[#2E1510] opacity-80"
                   style={{
                     fontSize: windowWidth < 640 ? '0.875rem' : windowWidth < 768 ? '1rem' : windowWidth < 1024 ? '1.5rem' : '1.5rem'
                   }}>
                  {eventDetails.location}
                </p>
                <p className="text-[#2E1510] opacity-70"
                   style={{
                     fontSize: windowWidth < 640 ? '0.75rem' : windowWidth < 768 ? '0.875rem' : windowWidth < 1024 ? '1.25rem' : '1.25rem'
                   }}>
                  {eventDetails.address}
                </p>
                <p className="text-[#2E1510] opacity-70"
                   style={{
                     fontSize: windowWidth < 640 ? '0.75rem' : windowWidth < 768 ? '0.875rem' : windowWidth < 1024 ? '1.25rem' : '1.25rem'
                   }}>
                  {eventDetails.city}
                </p>
                <div className="mt-2 flex flex-wrap justify-center"
                     style={{
                       gap: windowWidth < 640 ? '0.5rem' : windowWidth < 768 ? '0.75rem' : '1rem',
                       marginTop: windowWidth < 768 ? '0.75rem' : '1rem'
                     }}>
                  {eventDetails.lineup.map((dj, index) => (
                    <motion.button
                      key={dj}
                      className="bg-[#2E1510] text-[#FCD478] cursor-pointer hover:bg-[#ED2800] transition-colors"
                      style={{
                        padding: windowWidth < 640 ? '0.5rem 0.75rem' : windowWidth < 768 ? '0.5rem 1rem' : '0.5rem 1rem',
                        fontSize: windowWidth < 640 ? '0.75rem' : windowWidth < 768 ? '0.875rem' : '1.125rem'
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                      onClick={() => setSelectedDJ(djDatabase[dj])}
                    >
                      {dj}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Container with Slide Animations */}
      <div className="relative"
           style={{
             width: windowWidth < 640 ? '280px' : windowWidth < 768 ? '320px' : windowWidth < 1024 ? '250px' : '375px',
             height: windowWidth < 640 ? '364px' : windowWidth < 768 ? '416px' : windowWidth < 1024 ? '325px' : '487px',
             marginLeft: windowWidth < 768 ? '0' : windowWidth < 1024 ? '-3rem' : '-16rem',
             alignSelf: windowWidth < 768 ? 'center' : 'auto'
           }}>
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            /* Coming Soon Poster */
            <motion.div 
              key="poster-coming-soon"
              ref={comingSoonImageRef}
              className="absolute inset-0"
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '200%', opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.43, 0.13, 0.23, 0.96] }}
            >
              <ImageWithFallback
                src={HERO_IMAGES[1]}
                alt="Coming Soon Event"
                className="w-full h-full object-cover"
              />
            </motion.div>
          ) : (
            /* Event Image */
            <motion.div 
              key="poster-event"
              ref={eventImageRef}
              className="absolute inset-0"
              initial={{ x: '-200%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.43, 0.13, 0.23, 0.96] }}
            >
              <ImageWithFallback
                src="/incoming/refract-2025-11-26_19-37-50.mp4"
                alt="Night Pulse Event Poster"
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* DJ Detail Dialog */}
      <Dialog open={selectedDJ !== null} onOpenChange={() => setSelectedDJ(null)}>
        <DialogContent className="bg-[#FCD478] border-[#2E1510]"
                       style={{
                         borderWidth: windowWidth < 768 ? '2px' : '4px',
                         maxWidth: windowWidth < 640 ? '90%' : windowWidth < 768 ? '85%' : '28rem',
                         padding: windowWidth < 768 ? '1rem' : '1.5rem'
                       }}>
          <DialogHeader>
            <DialogTitle className="text-[#2E1510] uppercase tracking-tight"
                         style={{
                           fontSize: windowWidth < 640 ? '1.5rem' : windowWidth < 768 ? '1.875rem' : '2.25rem'
                         }}>
              {selectedDJ?.name}
            </DialogTitle>
            <DialogDescription className="sr-only">
              DJ information including Instagram handle and bio
            </DialogDescription>
          </DialogHeader>
          <div style={{
            gap: windowWidth < 768 ? '0.75rem' : '1rem',
            marginTop: windowWidth < 768 ? '0.75rem' : '1rem'
          }} className="flex flex-col">
            <a 
              href={`https://instagram.com/${selectedDJ?.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#2E1510] hover:text-[#ED2800] transition-colors"
            >
              <Instagram size={windowWidth < 768 ? 20 : 24} />
              <span style={{ fontSize: windowWidth < 640 ? '0.875rem' : windowWidth < 768 ? '1rem' : '1.25rem' }}>{selectedDJ?.instagram}</span>
            </a>
            <p className="text-[#2E1510] leading-relaxed"
               style={{
                 fontSize: windowWidth < 640 ? '0.875rem' : windowWidth < 768 ? '1rem' : '1rem'
               }}>
              {selectedDJ?.description}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
