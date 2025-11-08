import { VinylLogo } from './components/VinylLogo';
import { TypewriterEffect } from './components/TypewriterEffect';
import { TentMenu } from './components/TentMenu';
import { SectionTransition } from './components/SectionTransition';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { CustomCursor } from './components/CustomCursor';
import { ArchiveCarousel } from './components/ArchiveCarousel';
import { ComingSoonSection } from './components/ComingSoonSection';
import { motion, useScroll, useTransform } from 'motion/react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Instagram, Music, MessageCircle, Mail } from 'lucide-react';

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
  const [typingProgress, setTypingProgress] = useState(1);

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
    setTypingProgress(progress);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: 'home', color: '#220b04' },
        { id: 'next-event', color: '#FCD478' },
        { id: 'about', color: '#2E1510' },
        { id: 'archive', color: '#FCD478' },
        { id: 'contact', color: '#220b04' }
      ];

      const scrollPosition = window.scrollY + window.innerHeight / 2;
      let currentlyInAbout = false;
      let newSection = 'home';

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setBgColor(section.color);
            newSection = section.id;
            if (section.id === 'about') {
              currentlyInAbout = true;
            }
            break;
          }
        }
      }

      // Track section changes and reset when leaving
      if (newSection !== currentSection) {
        setPreviousSection(currentSection);
        setCurrentSection(newSection);
      }

      setIsInAboutSection(currentlyInAbout);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentSection]);

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
          className="absolute top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300"
          style={{
            [imageChangeCount % 2 === 0 ? 'right' : 'left']: '0%',
            width: '55%',
            height: '85vh',
            opacity: typingProgress,
          }}
        >
          <div 
            className="relative w-full h-full overflow-hidden"
          >
            <ImageWithFallback
              src={heroImages[heroImageIndex]}
              alt={`Hero background ${heroImageIndex + 1}`}
              className="w-full h-full object-cover"
              style={{ filter: 'blur(2px)' }}
            />
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
        <div className="fixed top-8 left-8 z-50">
          <VinylLogo />
        </div>

        {/* Menu - Top Right */}
        <TentMenu onNavigate={handleNavigate} bgColor={bgColor} />

        {/* Typewriter Center */}
        <div className="relative z-10 px-4">
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
        <SectionTransition className="relative min-h-screen flex items-center justify-between px-16 overflow-hidden">
          {/* Background Color Shift - Only when curtain opens */}
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ backgroundColor: 'transparent' }}
            animate={{ 
              backgroundColor: aboutCurtainOpen ? '#FCD478' : 'transparent'
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />

          {/* Backdrop Blur Overlay */}
          <motion.div
            className="absolute inset-0 z-20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: aboutCurtainOpen ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            style={{ pointerEvents: 'none' }}
          />

          <div className="absolute inset-0 flex items-center justify-between px-16 overflow-hidden">
            {/* Title and Button Container */}
            <div 
              className="relative z-10 flex flex-col gap-12"
              style={{ 
                x: aboutTitleX,
                opacity: aboutTitleOpacity
              }}
            >
              {/* Title - Blurs when open */}
              <motion.h2 
                className="text-[12rem] leading-[0.85] lowercase"
                animate={{
                  color: aboutCurtainOpen ? '#2E1510' : '#FCD478',
                  filter: aboutCurtainOpen ? 'blur(4px)' : 'blur(0px)'
                }}
                transition={{ duration: 0.5 }}
              >
                about<br />us
              </motion.h2>
              
              {/* Plus/Minus Button - Stays sharp */}
              <motion.button 
                className="w-32 h-32 rounded-full border-4 flex items-center justify-center group transition-all duration-300"
                animate={{
                  borderColor: aboutCurtainOpen ? '#2E1510' : '#FCD478',
                  backgroundColor: 'transparent'
                }}
                onClick={() => setAboutCurtainOpen(!aboutCurtainOpen)}
                whileHover={{ scale: 1.1, backgroundColor: aboutCurtainOpen ? '#2E1510' : '#FCD478' }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span 
                  className="text-8xl leading-none"
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
          <div className="absolute right-0 top-0 bottom-0 flex flex-col items-center justify-center px-16 z-30 pointer-events-none" style={{ width: '60%' }}>
            <div className="flex flex-col items-center gap-8 w-full max-w-3xl">
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
                  className="max-w-md w-full h-auto scale-x-[-1]"
                />
              </motion.div>

              {/* Description */}
              <div className="text-center w-full">
                {/* Headline - Second to appear */}
                <motion.p 
                  className="text-3xl text-[#220b04] mb-6 uppercase tracking-wide"
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
                  className="text-lg text-white leading-relaxed max-w-2xl mx-auto"
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
      <SectionTransition id="archive" className="relative min-h-screen flex flex-col items-center justify-center py-20">
        <motion.h2 
          className="text-[12rem] leading-[0.85] mb-16 text-[#2E1510] lowercase text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          archive
        </motion.h2>
        <ArchiveCarousel resetTrigger={currentSection} />
      </SectionTransition>

      {/* Contact Us Section */}
      <SectionTransition id="contact" className="relative min-h-screen flex items-center justify-center py-20">
        <div className="relative z-10 px-4 max-w-6xl w-full">
          {/* Animated Title */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-[12rem] leading-[0.85] text-[#FCD478] mb-4 lowercase">
              let's connect
            </h2>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Email Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative h-full bg-gradient-to-br from-[#FCD478]/20 to-[#ED2800]/20 p-8 rounded-2xl border-2 border-[#FCD478] hover:border-[#ED2800] transition-colors duration-300 overflow-hidden">
                {/* Animated background circle */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#ED2800]/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" style={{ willChange: 'transform' }}></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-[#ED2800] rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300" style={{ willChange: 'transform' }}>
                      <Mail className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl text-[#FCD478]">Email Us</h3>
                  </div>
                  <p className="text-white text-lg mb-4">For bookings, collaborations, or inquiries</p>
                  <a 
                    href="mailto:info@housecollective.com" 
                    className="text-2xl text-[#ED2800] hover:text-[#FCD478] transition-colors duration-300 break-all"
                  >
                    info@housecollective.com
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Social Media Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative h-full bg-gradient-to-br from-[#ED2800]/20 to-[#FCD478]/20 p-8 rounded-2xl border-2 border-[#FCD478] hover:border-[#ED2800] transition-colors duration-300 overflow-hidden">
                {/* Animated background circle */}
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#FCD478]/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" style={{ willChange: 'transform' }}></div>
                
                <div className="relative z-10">
                  <h3 className="text-3xl text-[#FCD478] mb-6">Follow The Vibe</h3>
                  <p className="text-white text-lg mb-8">Stay connected on social media</p>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {/* Instagram */}
                    <a
                      href="https://www.instagram.com/takeone.collective/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-3 p-4 bg-[#220b04]/40 rounded-xl border border-[#FCD478]/30 hover:border-[#ED2800] hover:bg-[#ED2800]/20 hover:scale-105 transition-all duration-200"
                      style={{ willChange: 'transform' }}
                    >
                      <Instagram className="w-8 h-8 text-[#FCD478]" />
                      <span className="text-white text-sm">Instagram</span>
                    </a>

                    {/* SoundCloud */}
                    <a
                      href="#"
                      className="flex flex-col items-center gap-3 p-4 bg-[#220b04]/40 rounded-xl border border-[#FCD478]/30 hover:border-[#ED2800] hover:bg-[#ED2800]/20 hover:scale-105 transition-all duration-200"
                      style={{ willChange: 'transform' }}
                    >
                      <Music className="w-8 h-8 text-[#FCD478]" />
                      <span className="text-white text-sm">SoundCloud</span>
                    </a>

                    {/* WhatsApp */}
                    <a
                      href="https://wa.me/1234567890"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-3 p-4 bg-[#220b04]/40 rounded-xl border border-[#FCD478]/30 hover:border-[#ED2800] hover:bg-[#ED2800]/20 hover:scale-105 transition-all duration-200"
                      style={{ willChange: 'transform' }}
                    >
                      <MessageCircle className="w-8 h-8 text-[#FCD478]" />
                      <span className="text-white text-sm">WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <p className="text-2xl text-white max-w-2xl mx-auto leading-relaxed">
              Join us on the journey through sound, art, and culture
            </p>
          </motion.div>
        </div>
      </SectionTransition>

      {/* Footer */}
      <footer className="bg-[#2E1510] border-t-2 border-[#FCD478] py-8 text-center">
        <p className="text-white">© 2025 House Music Collective. All rights reserved.</p>
      </footer>
    </div>
  );
}
