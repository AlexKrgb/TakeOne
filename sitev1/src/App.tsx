import { VinylLogo } from './components/VinylLogo';
import { TypewriterEffect } from './components/TypewriterEffect';
import { TentMenu } from './components/TentMenu';
import { SectionTransition } from './components/SectionTransition';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { CustomCursor } from './components/CustomCursor';
import { ContactSection } from './components/ContactSection';
import { ComingSoonSection } from './components/ComingSoonSection';
import { motion, useScroll, useTransform } from 'motion/react';
import { lazy, Suspense, useState, useEffect, useRef, useCallback } from 'react';

const ArchiveCarousel = lazy(() =>
  import('./components/ArchiveCarousel').then((module) => ({
    default: module.ArchiveCarousel,
  }))
);

export default function App() {
  const [bgColor, setBgColor] = useState('#220b04');
  const [aboutCurtainOpen, setAboutCurtainOpen] = useState(false);
  const aboutUsImageRef = useRef<HTMLDivElement>(null);
  const aboutUsSectionRef = useRef<HTMLDivElement>(null);
  const [isInAboutSection, setIsInAboutSection] = useState(false);
  const [currentSection, setCurrentSection] = useState<string>('home');
  const [previousSection, setPreviousSection] = useState<string>('home');
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [imageChangeCount, setImageChangeCount] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1920);
  const [showArchive, setShowArchive] = useState(false);
  const heroBgRef = useRef<HTMLDivElement>(null);
  const currentSectionRef = useRef('home');

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.documentElement.style.backgroundColor = bgColor;
    document.body.style.backgroundColor = bgColor;
  }, [bgColor]);

  const heroImages = [
    'https://i.imgur.com/poMNsgj.jpg',
    'https://i.imgur.com/Z5vEbd9.jpg',
    'https://i.imgur.com/7OTeZui.jpeg',
    'https://i.imgur.com/UvmX7DW.jpg',
    'https://i.imgur.com/4kAeojD.jpeg',
    'https://i.imgur.com/3gTQYZq.jpeg'
  ];

  const handleWordChange = useCallback((index: number) => {
    setHeroImageIndex((prev) => (prev + 1) % heroImages.length);
    setImageChangeCount((prev) => prev + 1);
  }, [heroImages.length]);

  const handleProgressChange = useCallback((progress: number) => {
    if (heroBgRef.current) {
      heroBgRef.current.style.opacity = String(progress);
    }
  }, []);

  const SECTIONS = [
    { id: 'home', color: '#220b04' },
    { id: 'next-event', color: '#FCD478' },
    { id: 'about', color: '#2E1510' },
    { id: 'archive', color: '#FCD478' },
    { id: 'contact', color: '#220b04' },
  ] as const;

  useEffect(() => {
    const sectionElements = SECTIONS
      .map((section) => ({ ...section, el: document.getElementById(section.id) }))
      .filter((section): section is (typeof SECTIONS)[number] & { el: HTMLElement } => section.el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        const section = SECTIONS.find((item) => item.id === visible.target.id);
        if (!section) return;

        setBgColor((prev) => (prev !== section.color ? section.color : prev));

        if (currentSectionRef.current !== section.id) {
          setPreviousSection(currentSectionRef.current);
          currentSectionRef.current = section.id;
          setCurrentSection(section.id);
        }

        setIsInAboutSection((prev) => {
          const next = section.id === 'about';
          return prev !== next ? next : prev;
        });
      },
      { threshold: [0.25, 0.5, 0.75], rootMargin: '-20% 0px -20% 0px' }
    );

    sectionElements.forEach(({ el }) => observer.observe(el));

    const archiveEl = document.getElementById('archive');
    const archiveObserver = archiveEl
      ? new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setShowArchive(true);
              archiveObserver.disconnect();
            }
          },
          { rootMargin: '500px' }
        )
      : null;

    if (archiveEl && archiveObserver) {
      archiveObserver.observe(archiveEl);
    }

    return () => {
      observer.disconnect();
      archiveObserver?.disconnect();
    };
  }, []);

  // Auto-close when leaving About section
  useEffect(() => {
    if (!isInAboutSection && aboutCurtainOpen) {
      setAboutCurtainOpen(false);
    }
  }, [isInAboutSection, aboutCurtainOpen]);

  const handleNavigate = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll-based animation for About Us section
  const { scrollYProgress: aboutScrollProgress } = useScroll({
    target: aboutUsSectionRef,
    offset: ["start end", "end start"]
  });

  const aboutTitleX = useTransform(aboutScrollProgress, [0, 0.4, 0.6, 1], [window.innerWidth, 0, 0, -200]);
  const aboutTitleOpacity = useTransform(aboutScrollProgress, [0, 0.3, 0.6, 0.8, 1], [0, 1, 1, 1, 0]);
  const aboutLogoX = useTransform(aboutScrollProgress, [0, 0.4, 0.6, 1], [-window.innerWidth, 0, 0, 200]);
  const aboutLogoOpacity = useTransform(aboutScrollProgress, [0, 0.3, 0.6, 0.8, 1], [0, 1, 1, 1, 0]);

  return (
    <div 
      className="text-white transition-colors duration-700 ease-in-out"
      style={{ backgroundColor: bgColor }}
    >
      <CustomCursor />
      {/* Hero Section */}
      <section 
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Images - Alternating Sides */}
        <div
          ref={heroBgRef}
          className={`absolute pointer-events-none transition-all duration-300 hero-bg-image ${
            windowWidth < 768 ? 'inset-0' : 'top-1/2 -translate-y-1/2'
          }`}
          style={{
            ...(windowWidth >= 768 && {
              [imageChangeCount % 2 === 0 ? 'right' : 'left']: '0%',
              width: '55%',
              height: '85vh',
            }),
            opacity: 1,
          }}
        >
          <div 
            className="relative w-full h-full overflow-hidden"
          >
            <ImageWithFallback
              src={heroImages[heroImageIndex]}
              alt={`Hero background ${heroImageIndex + 1}`}
              className="w-full h-full object-cover hero-bg-img"
            />
            {/* Soft edge overlay — replaces expensive CSS blur filter */}
            <div className="absolute inset-0 pointer-events-none hero-bg-soften" />
            {/* Fade effect on all 4 borders */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  linear-gradient(to right, rgba(34, 11, 4, 1) 0%, transparent 15%),
                  linear-gradient(to left, rgba(34, 11, 4, 1) 0%, transparent 15%),
                  linear-gradient(to bottom, rgba(34, 11, 4, 1) 0%, transparent 15%),
                  linear-gradient(to top, rgba(34, 11, 4, 1) 0%, transparent 15%)
                `
              }}
            />
          </div>
        </div>
        
        {/* Vinyl Logo - Top Left */}
        <div className="fixed hero-logo z-50">
          <VinylLogo />
        </div>

        {/* Menu - Top Right */}
        <TentMenu onNavigate={handleNavigate} bgColor={bgColor} />

        {/* Typewriter Center */}
        <div className="relative z-10 typewriter-container">
          <TypewriterEffect 
            fixedText="TakeOne is"
            texts={[
              'a concept',
              'a tribute',
              'People'
            ]}
            typingSpeed={150}
            deletingSpeed={75}
            pauseDuration={2000}
            onWordChange={handleWordChange}
            onProgressChange={handleProgressChange}
          />
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-[#ED2800] rounded-full flex items-start justify-center p-2">
            <motion.div
              className="w-1 h-2 bg-[#ED2800] rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Coming Soon Section */}
      <SectionTransition id="next-event">
        <ComingSoonSection resetTrigger={currentSection} />
      </SectionTransition>

      {/* About Us Section */}
      <div ref={aboutUsSectionRef} id="about">
        <SectionTransition className="relative min-h-screen flex items-center justify-between about-section overflow-hidden">
          {/* Background Color Shift - Only when curtain opens */}
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ backgroundColor: 'transparent' }}
            animate={{ 
              backgroundColor: aboutCurtainOpen ? '#FCD478' : 'transparent'
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />

          {/* Dim overlay instead of backdrop-blur for performance */}
          <motion.div
            className="absolute inset-0 z-20 bg-[#220b04]/55"
            initial={{ opacity: 0 }}
            animate={{ opacity: aboutCurtainOpen ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            style={{ pointerEvents: 'none' }}
          />

          <div className="absolute inset-0 flex items-center justify-between about-section overflow-hidden">
            {/* Title and Button Container */}
            <div 
              className="relative z-10 flex flex-col about-scroll-layer"
              style={{ 
                x: aboutTitleX,
                opacity: aboutTitleOpacity,
                gap: windowWidth < 640 ? '1.5rem' : windowWidth < 768 ? '2rem' : windowWidth < 1024 ? '2rem' : '3rem'
              }}
            >
              {/* Title - Blurs when open */}
              <motion.h2 
                className="about-title leading-[0.85] lowercase"
                style={{
                  fontSize: windowWidth < 640 ? '4rem' : windowWidth < 768 ? '6rem' : windowWidth < 1024 ? '8rem' : windowWidth < 1280 ? '10rem' : '12rem'
                }}
                animate={{
                  color: aboutCurtainOpen ? '#2E1510' : '#FCD478',
                  opacity: aboutCurtainOpen ? 0.3 : 1,
                }}
                transition={{ duration: 0.5 }}
              >
                about<br />us
              </motion.h2>
              
              {/* Plus/Minus Button - Stays sharp */}
              <motion.button 
                className="about-button rounded-full flex items-center justify-center group transition-all duration-300"
                style={{
                  width: windowWidth < 640 ? '4rem' : windowWidth < 768 ? '5rem' : windowWidth < 1024 ? '6rem' : windowWidth < 1280 ? '8rem' : '8rem',
                  height: windowWidth < 640 ? '4rem' : windowWidth < 768 ? '5rem' : windowWidth < 1024 ? '6rem' : windowWidth < 1280 ? '8rem' : '8rem',
                  borderWidth: windowWidth < 768 ? '2px' : '4px'
                }}
                animate={{
                  borderColor: aboutCurtainOpen ? '#2E1510' : '#FCD478',
                  backgroundColor: 'transparent'
                }}
                onClick={() => setAboutCurtainOpen(!aboutCurtainOpen)}
                whileHover={{ scale: 1.1, backgroundColor: aboutCurtainOpen ? '#2E1510' : '#FCD478' }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span 
                  className="about-button-text leading-none"
                  style={{
                    fontSize: windowWidth < 640 ? '2.5rem' : windowWidth < 768 ? '3rem' : windowWidth < 1024 ? '3.75rem' : windowWidth < 1280 ? '4.5rem' : '6rem'
                  }}
                  animate={{
                    color: aboutCurtainOpen ? '#2E1510' : '#FCD478'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {aboutCurtainOpen ? '−' : '+'}
                </motion.span>
              </motion.button>
            </div>
            
            <div className="relative z-10 mt-[34rem]" style={{ x: aboutLogoX, opacity: aboutLogoOpacity }}></div>
          </div>

          {/* Logo and Description Layer - Slide from Right with Staggered Animation */}
          <div className="absolute right-0 top-0 bottom-0 flex flex-col items-center justify-center about-logo-container z-30 pointer-events-none"
               style={{ width: windowWidth < 768 ? '100%' : '60%', padding: windowWidth < 640 ? '1rem' : windowWidth < 768 ? '2rem' : windowWidth < 1024 ? '2rem' : '4rem' }}>
            <div className="flex flex-col items-center w-full max-w-3xl"
                 style={{ gap: windowWidth < 640 ? '1rem' : windowWidth < 768 ? '1.5rem' : windowWidth < 1024 ? '2rem' : '2rem' }}>
              {/* Logo - First to appear */}
              <motion.div
                className="w-full flex justify-center"
                initial={{ x: typeof window !== 'undefined' ? window.innerWidth : 2000, opacity: 0 }}
                animate={aboutCurtainOpen ? {
                  x: 0,
                  opacity: 1
                } : {
                  x: typeof window !== 'undefined' ? window.innerWidth : 2000,
                  opacity: 0
                }}
                transition={{
                  duration: 0.8,
                  delay: aboutCurtainOpen ? 0.2 : 0,
                  ease: "easeInOut"
                }}
              >
                <ImageWithFallback
                  src="https://i.imgur.com/PzDcKRs.png"
                  alt="TakeOne Logo"
                  className="about-logo w-full h-auto scale-x-[-1]"
                  style={{
                    maxWidth: windowWidth < 640 ? '200px' : windowWidth < 768 ? '300px' : '28rem'
                  }}
                />
              </motion.div>

              {/* Description */}
              <div className="text-center w-full" style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
                {/* Headline - Second to appear */}
                <motion.p 
                  className="about-headline text-[#220b04] uppercase tracking-wide"
                  style={{
                    fontSize: windowWidth < 640 ? '1.125rem' : windowWidth < 768 ? '1.25rem' : windowWidth < 1024 ? '1.5rem' : '1.875rem',
                    marginBottom: windowWidth < 640 ? '1rem' : '1.5rem'
                  }}
                  initial={{ x: typeof window !== 'undefined' ? window.innerWidth : 2000, opacity: 0 }}
                  animate={aboutCurtainOpen ? {
                    x: 0,
                    opacity: 1
                  } : {
                    x: typeof window !== 'undefined' ? window.innerWidth : 2000,
                    opacity: 0
                  }}
                  transition={{
                    duration: 0.8,
                    delay: aboutCurtainOpen ? 0.4 : 0,
                    ease: "easeInOut"
                  }}
                >
                  TakeOne, a symbiosis. MUSIC | ART | PERFORMANCE
                </motion.p>
                
                {/* Body Text - Last to appear */}
                <motion.p 
                  className="about-body text-white leading-relaxed max-w-2xl mx-auto"
                  style={{
                    fontSize: windowWidth < 640 ? '0.875rem' : windowWidth < 768 ? '1rem' : '1.125rem'
                  }}
                  initial={{ x: typeof window !== 'undefined' ? window.innerWidth : 2000, opacity: 0 }}
                  animate={aboutCurtainOpen ? {
                    x: 0,
                    opacity: 1
                  } : {
                    x: typeof window !== 'undefined' ? window.innerWidth : 2000,
                    opacity: 0
                  }}
                  transition={{
                    duration: 0.8,
                    delay: aboutCurtainOpen ? 0.6 : 0,
                    ease: "easeInOut"
                  }}
                >
                  A space of possibilities unfolds. Here to stay. Through the many facets of electronic music, 
                  lose yourself between dance, installation, and being. Imagine the future—and everything is good. 
                  TakeOne—what are we waiting for
                </motion.p>
              </div>
            </div>
          </div>
        </SectionTransition>
      </div>

      {/* Archive Section */}
      <SectionTransition id="archive" className="relative min-h-screen flex flex-col items-center justify-center archive-section"
                         style={{
                           paddingTop: windowWidth < 768 ? '2rem' : windowWidth < 1024 ? '3rem' : '5rem',
                           paddingBottom: windowWidth < 768 ? '2rem' : windowWidth < 1024 ? '3rem' : '5rem'
                         }}>
        <motion.h2 
          className="archive-title leading-[0.85] text-[#2E1510] lowercase text-center"
          style={{
            fontSize: windowWidth < 640 ? '4rem' : windowWidth < 768 ? '6rem' : windowWidth < 1024 ? '8rem' : windowWidth < 1280 ? '10rem' : '12rem',
            marginBottom: windowWidth < 640 ? '2rem' : windowWidth < 768 ? '2rem' : windowWidth < 1024 ? '3rem' : '4rem',
            paddingLeft: '1rem',
            paddingRight: '1rem'
          }}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          archive
        </motion.h2>
        {showArchive ? (
          <Suspense
            fallback={
              <div className="w-full min-h-[60vh] flex items-center justify-center" aria-hidden="true">
                <div className="h-8 w-8 rounded-full border-2 border-[#2E1510]/30 border-t-[#ED2800] animate-spin" />
              </div>
            }
          >
            <ArchiveCarousel resetTrigger={currentSection} />
          </Suspense>
        ) : (
          <div className="min-h-[40vh] w-full" aria-hidden="true" />
        )}
      </SectionTransition>

      <ContactSection />

      <footer className="bg-[#2E1510] border-t-2 border-[#FCD478] py-8 text-center">
        <p className="text-white">© 2025 TakeOne Collective. All rights reserved.</p>
      </footer>
    </div>
  );
}
