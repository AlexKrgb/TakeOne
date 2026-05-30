import { useState, useRef, useEffect, useMemo, memo, useCallback, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X, Grid3x3, List, Play, Pause, Calendar, Filter } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArchiveStats } from './ArchiveStats';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const VenueMap = lazy(() =>
  import('./VenueMap').then((module) => ({
    default: module.VenueMap,
  }))
);

interface Event {
  id: string;
  title: string;
  month: string;
  year: number;
  date: string;
  sets: number;
  poster: string;
  venue: string;
  venueAddress: string;
  description: string;
  gallery: string[];
  djs: string[];
  genre: string[];
}

// Helper function to generate gallery paths
const generateGallery = (eventFolder: string, count: number): string[] => {
  return Array.from({ length: count }, (_, i) => 
    `/images/events/${eventFolder}/gallery-${i + 1}.webp`
  );
};

const events: Event[] = [
  {
    id: '1',
    title: 'Mirò Club - R Room',
    month: 'April',
    year: 2025,
    date: 'April 18, 2025',
    sets: 12,
    poster: '/images/events/event-miro-2/poster.webp',
    venue: 'Miro Club',
    venueAddress: 'Piazza Domenicani, 3b, 39100 Bolzano BZ',
    description: 'An unforgettable night celebrating the longest day of the year with house music legends and rising stars.',
    gallery: generateGallery('event-miro-2', 10),
    djs: ['Bossifunk', 'Mattia Lorenzi', 'Alan La Rocc', 'Loned'],
    genre: ['Deep House', 'Tech House']
  },
  {
    id: '2',
    title: 'TakeONE X Zoona Magnifique',
    month: 'May',
    year: 2025,
    date: 'May 03, 2025',
    sets: 8,
    poster: '/images/events/event-zoona-2/poster.webp',
    venue: 'Zoona',
    venueAddress: 'Via Vincenzo Lancia, 1, 39100 Bolzano BZ',
    description: 'Deep house and minimal techno took over the dance floor for an intimate night of pure rhythm.',
    gallery: generateGallery('event-zoona-2', 10),
    djs: ['XTO', 'Loned', '?'],
    genre: ['Minimal', 'Deep House']
  },
  {
    id: '3',
    title: 'TakeONE X Goethe Haus',
    month: 'May',
    year: 2024,
    date: 'May 15, 2024',
    sets: 15,
    poster: '/images/events/event-goethe-haus-1/poster.webp',
    venue: 'Goethe Haus',
    venueAddress: 'Via Goethe, 42, 39100 Bolzano BZ',
    description: 'We brought in the new year with heavy basslines and non-stop energy from midnight to sunrise.',
    gallery: generateGallery('event-goethe-haus-1', 5),
    djs: ['Loned', 'Mirko Ventura'],
    genre: ['Tech House', 'Techno']
  },
  {
    id: '4',
    title: 'TakeONE X Roncolo',
    month: 'March',
    year: 2025,
    date: 'March 22, 2025',
    sets: 10,
    poster: '/images/events/event-castel-roncolo-1/poster.webp',
    venue: 'Castel Roncolo',
    venueAddress: 'Sentiero imperatore Francesco Giuseppe, 1, 39100 Bolzano BZ',
    description: 'A celebration of transition, blending organic sounds with electronic beats under the autumn sky.',
    gallery: generateGallery('event-castel-roncolo-1', 10),
    djs: ['Loned', 'Morris Ferrari', 'Alan La Rocc'],
    genre: ['Organic House', 'Deep House']
  },
  {
    id: '5',
    title: 'TakeONE X Lampele',
    month: 'November',
    year: 2024,
    date: 'November 15, 2024',
    sets: 9,
    poster: '/images/events/event-miro-1/poster.webp',
    venue: 'Miro Club',
    venueAddress: 'Piazza Domenicani, 3b, 39100 Bolzano BZ',
    description: 'Fresh beats to welcome the new season with uplifting melodies and groovy basslines.',
    gallery: generateGallery('event-miro-1', 4),
    djs: ['Loned', 'Yasmin'],
    genre: ['Progressive House', 'Melodic Techno']
  },
  {
    id: '6',
    title: 'TakeONE X Zoona',
    month: 'September',
    year: 2024,
    date: 'September 06, 2024',
    sets: 11,
    poster: '/images/events/event-zoona-1/poster.webp',
    venue: 'Zoona',
    venueAddress: 'Via Vincenzo Lancia, 1, 39100 Bolzano BZ',
    description: 'Raw industrial sounds and heavy beats to warm up the coldest nights.',
    gallery: generateGallery('event-zoona-1', 0),
    djs: ['Morris Ferrari', 'Loned', 'Mattia Lorenzi'],
    genre: ['Techno', 'Industrial']
  },
  {
    id: '7',
    title: 'TakeONE X Unstructured',
    month: 'September',
    year: 2025,
    date: 'September 19, 2025',
    sets: 0,
    poster: '/images/events/event-zoona-3/poster.webp',
    venue: 'Zoona',
    venueAddress: 'Via Vincenzo Lancia, 1, 39100 Bolzano BZ',
    description: 'Event description to be updated.',
    gallery: generateGallery('event-zoona-3', 14),
    djs: [],
    genre: []
  },
  {
    id: '8',
    title: 'TakeONE X Mirò R Room',
    month: 'September',
    year: 2025,
    date: 'September 12, 2025',
    sets: 0,
    poster: '/images/events/event-miro-3/poster.webp',
    venue: 'Miro Club',
    venueAddress: 'Piazza Domenicani, 3b, 39100 Bolzano BZ',
    description: 'Event description to be updated.',
    gallery: generateGallery('event-miro-3', 7),
    djs: ["Young XTO, Loned, Alan La Rocc"],
    genre: []
  },
  {
    id: '9',
    title: 'TakeONE X Astra TOOLBOX',
    month: 'January',
    year: 2025,
    date: 'January 17, 2025',
    sets: 1,
    poster: '/images/events/event-astra-1/poster.webp',
    venue: 'Astra Brixen',
    venueAddress: 'Via Roma, 11, 39042 Bressanone BZ',
    description: 'A night of electronic music at Astra Brixen.',
    gallery: generateGallery('event-astra-1', 0),
    djs: ['Loned'],
    genre: []
  }
];

// Helper function to get event by ID from events array
const getEventById = (id: string) => {
  return events.find(e => e.id === id);
};

// Helper function to count DJs (handles both array of strings and comma-separated strings)
const countDJs = (djs: string[]): number => {
  return djs.reduce((count, dj) => {
    const trimmed = dj.trim();
    if (trimmed === '') return count;
    // If the string contains commas, split and count each DJ
    if (trimmed.includes(',')) {
      return count + trimmed.split(',').filter(d => d.trim() !== '').length;
    }
    return count + 1;
  }, 0);
};

// Real venues in Bolzano with the 8 carousel events: 1 Castel Roncolo, 1 Goethe Haus, 3 Zoona, 3 Mirò
const realVenues = [
  { 
    name: 'Miro Club', 
    address: 'Piazza Domenicani, 3b, 39100 Bolzano BZ', 
    position: { lat: 46.49750405812552, lng: 11.352452835712338 },
    events: [
      getEventById('1')!,
      getEventById('5')!,
      getEventById('8')!
    ]
  },
  { 
    name: 'Zoona', 
    address: 'Via Vincenzo Lancia, 1, 39100 Bolzano BZ', 
    position: { lat: 46.484823870426304, lng: 11.337192612674903 },
    events: [
      getEventById('2')!,
      getEventById('6')!,
      getEventById('7')!
    ]
  },
  { 
    name: 'Goethe Haus', 
    address: 'Via Goethe, 42, 39100 Bolzano BZ', 
    position: { lat: 46.4982351952385, lng: 11.352331620903415 },
    events: [
      getEventById('3')!
    ]
  },
  { 
    name: 'Castel Roncolo', 
    address: 'Sentiero imperatore Francesco Giuseppe, 1, 39100 Bolzano BZ', 
    position: { lat: 46.517748493962706, lng: 11.359062009518354 },
    events: [
      getEventById('4')!
    ]
  },
  { 
    name: 'Astra Brixen', 
    address: 'Via Roma, 11, 39042 Bressanone BZ', 
    position: { lat: 46.716610972149525, lng: 11.652391936557878 },
    events: [
      getEventById('9')!
    ]
  }
];

const venues = realVenues.map(venue => ({
  ...venue,
  eventCount: venue.events?.length || 0
}));

const allDJs = [
  { name: 'Maya Luna', genre: 'Deep House', appearances: 3, image: '' },
  { name: 'DJ Sisko', genre: 'Tech House', appearances: 3, image: '' },
  { name: 'Deep Mark', genre: 'Minimal', appearances: 4, image: '' },
  { name: 'Nina Kraviz', genre: 'Techno', appearances: 3, image: '' },
  { name: 'Acid Anna', genre: 'Acid House', appearances: 3, image: '' },
  { name: 'Vinyl Viktor', genre: 'Classic House', appearances: 3, image: '' },
  { name: 'Bass Queen', genre: 'Bass House', appearances: 2, image: '' },
  { name: 'Techno Tom', genre: 'Techno', appearances: 2, image: '' }
];

type ViewMode = 'carousel' | 'grid';

interface ArchiveCarouselProps {
  resetTrigger?: string;
}

// Global image cache to prevent reloads
const imageCache = new Map<string, HTMLImageElement>();

export const ArchiveCarousel = memo(function ArchiveCarousel({ resetTrigger }: ArchiveCarouselProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('carousel');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedDJ, setSelectedDJ] = useState<string>('all');
  const [selectedVenue, setSelectedVenue] = useState<string>('all');
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1920);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Reset all state when leaving the archive section
  useEffect(() => {
    if (resetTrigger && resetTrigger !== 'archive') {
      setSelectedEvent(null);
      setSelectedGalleryIndex(0);
      setViewMode('carousel');
      setSelectedYear('all');
      setSelectedMonth('all');
      setSelectedDJ('all');
      setSelectedVenue('all');
      setCurrentIndex(0);
      setFullScreenImage(null);
    }
  }, [resetTrigger]);
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollIntervalRef = useRef<number | null>(null);
  const carouselSectionRef = useRef<HTMLDivElement>(null);
  const [isCarouselInView, setIsCarouselInView] = useState(false);
  
  // Detect when carousel section is in view to close venue panel
  useEffect(() => {
    if (!carouselSectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsCarouselInView(entry.isIntersecting);
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the carousel is visible
        rootMargin: '-100px 0px', // Add some margin to trigger earlier
      }
    );

    observer.observe(carouselSectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Filter events
  const filteredEvents = events.filter(event => {
    if (selectedYear !== 'all' && event.year.toString() !== selectedYear) return false;
    if (selectedMonth !== 'all' && event.month !== selectedMonth) return false;
    if (selectedDJ !== 'all' && !event.djs.includes(selectedDJ)) return false;
    if (selectedVenue !== 'all' && event.venue !== selectedVenue) return false;
    return true;
  });

  // Get unique years and months
  const years = Array.from(new Set(events.map(e => e.year))).sort((a, b) => b - a);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Calculate statistics from real event data
  const totalSets = events.reduce((sum, event) => sum + event.sets, 0);
  const uniqueDJs = new Set(events.flatMap(e => e.djs.filter(dj => dj.trim() !== ''))).size;
  const venuesWithEvents = venues.filter(venue => (venue.events?.length || 0) > 0).length;

  // Reset current index when filters change
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedYear, selectedMonth, selectedDJ, selectedVenue]);

  // Auto-scroll functionality
  useEffect(() => {
    if (isAutoScrolling && viewMode === 'carousel' && filteredEvents.length > 0) {
      autoScrollIntervalRef.current = window.setInterval(() => {
        setCurrentIndex(prev => {
          const nextIndex = prev + 1;
          return nextIndex >= filteredEvents.length ? 0 : nextIndex;
        });
       }, 5000); // Change slide every 5 seconds

      return () => {
        if (autoScrollIntervalRef.current) {
          clearInterval(autoScrollIntervalRef.current);
        }
      };
    }
  }, [isAutoScrolling, viewMode, filteredEvents.length]);

  const scroll = (direction: 'left' | 'right') => {
    if (filteredEvents.length === 0) return;
    
    if (direction === 'left') {
      setCurrentIndex(prev => prev === 0 ? filteredEvents.length - 1 : prev - 1);
    } else {
      setCurrentIndex(prev => (prev + 1) % filteredEvents.length);
    }
  };

  // Memoize card width calculation to prevent flickering
  const cardWidthPx = useMemo(() => {
    if (windowWidth < 640) return 280;
    if (windowWidth < 768) return 320;
    return 320;
  }, [windowWidth]);

  // Memoize transform calculation
  const carouselTransform = useMemo(() => {
    const gap = 24; // 1.5rem = 24px
    const offset = currentIndex * (cardWidthPx + gap);
    return `translate3d(-${offset}px, 0, 0)`;
  }, [currentIndex, cardWidthPx]);

  // Update transform using ref to avoid re-renders
  useEffect(() => {
    if (carouselContainerRef.current && viewMode === 'carousel') {
      const gap = 24;
      const offset = currentIndex * (cardWidthPx + gap);
      const transform = `translate3d(-${offset}px, 0, 0)`;
      carouselContainerRef.current.style.transform = transform;
    }
  }, [currentIndex, cardWidthPx, viewMode]);

  // Preload all carousel images to prevent flickering and cache them globally
  useEffect(() => {
    if (viewMode === 'carousel' && filteredEvents.length > 0) {
      filteredEvents.forEach((event) => {
        // Check if already cached and loaded
        const cachedImg = imageCache.get(event.poster);
        if (cachedImg && cachedImg.complete && cachedImg.naturalWidth > 0) {
          return;
        }
        
        const img = new Image();
        // Cache the image globally before setting src
        imageCache.set(event.poster, img);
        img.src = event.poster;
        // Decode the image to ensure it's ready
        img.decode().catch(() => {
          // If decode fails, still mark as loaded if complete
          if (img.complete) {
            // Image is loaded even if decode failed
          }
        });
      });
    }
  }, [viewMode, filteredEvents]);

  // Stable callback for event selection
  const handleEventSelect = useCallback((event: Event) => {
    setSelectedEvent(event);
    setSelectedGalleryIndex(0);
  }, []);

  const handleYearClick = (year: string) => {
    setSelectedYear(year);
  };

  const handleDJClick = (djName: string) => {
    setSelectedDJ(djName);
  };

  const handleVenueClick = (venueName: string) => {
    setSelectedVenue(venueName);
  };

  const clearFilters = () => {
    setSelectedYear('all');
    setSelectedMonth('all');
    setSelectedDJ('all');
    setSelectedVenue('all');
  };

  const EventCard = memo(({ event, index, isCarousel, windowWidth, onSelect }: { 
    event: Event; 
    index: number;
    isCarousel: boolean;
    windowWidth: number;
    onSelect: (event: Event) => void;
  }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(() => {
      // Check if image is already cached and loaded on initial render
      if (event.poster.toLowerCase().endsWith('.mp4') || 
          event.poster.toLowerCase().endsWith('.webm') || 
          event.poster.toLowerCase().endsWith('.mov')) {
        return true;
      }
      const cachedImg = imageCache.get(event.poster);
      return !!(cachedImg && cachedImg.complete && cachedImg.naturalWidth > 0);
    });
    const imgRef = useRef<HTMLImageElement | null>(null);
    const imageSrcRef = useRef<string>(event.poster);
    const hasInitializedRef = useRef(false);
    const loadingCheckRef = useRef<string | null>(null);
    
    const cardWidth = useMemo(() => {
      if (!isCarousel) return '100%';
      return windowWidth < 640 ? '280px' : windowWidth < 768 ? '320px' : '320px';
    }, [isCarousel, windowWidth]);
    
    const cardHeight = useMemo(() => {
      return windowWidth < 640 ? '480px' : windowWidth < 768 ? '520px' : '500px';
    }, [windowWidth]);

    const isVideo = useMemo(() => {
      const poster = event.poster.toLowerCase();
      return poster.endsWith('.mp4') || poster.endsWith('.webm') || poster.endsWith('.mov');
    }, [event.poster]);

    // Pre-check if image is already loaded - only run once per image
    useEffect(() => {
      // Skip if we've already checked this exact image
      if (loadingCheckRef.current === event.poster && hasInitializedRef.current) {
        return;
      }
      
      // Check if image actually changed
      const imageChanged = imageSrcRef.current !== event.poster;
      
      // Update refs
      imageSrcRef.current = event.poster;
      loadingCheckRef.current = event.poster;
      
      if (isVideo) {
        setImageLoaded(true);
        hasInitializedRef.current = true;
        return;
      }
      
      // Check global cache first
      const cachedImg = imageCache.get(event.poster);
      if (cachedImg && cachedImg.complete && cachedImg.naturalWidth > 0) {
        setImageLoaded(true);
        hasInitializedRef.current = true;
        return;
      }
      
      // Check if image is already in browser cache
      const img = cachedImg || new Image();
      if (!cachedImg) {
        imageCache.set(event.poster, img);
      }
      
      if (img.complete && img.naturalWidth > 0) {
        setImageLoaded(true);
        hasInitializedRef.current = true;
        return;
      }
      
      // Reset loading state only if image actually changed
      if (imageChanged) {
        setImageLoaded(false);
        hasInitializedRef.current = false;
      }
      
      const handleLoad = () => {
        if (img.src === event.poster) {
          setImageLoaded(true);
          hasInitializedRef.current = true;
        }
      };
      
      const handleError = () => {
        if (img.src === event.poster) {
          setImageLoaded(true);
          hasInitializedRef.current = true;
        }
      };
      
      img.onload = handleLoad;
      img.onerror = handleError;
      
      if (!cachedImg || !img.complete) {
        img.src = event.poster;
      } else {
        // Image was cached but check completed, trigger load handler
        handleLoad();
      }
      
      // Cleanup
      return () => {
        if (img.onload === handleLoad) img.onload = null;
        if (img.onerror === handleError) img.onerror = null;
      };
    }, [event.poster, isVideo]); // Only depend on poster and isVideo

    return (
      <div
        className={`${isCarousel ? 'flex-shrink-0 event-card' : 'w-full'} cursor-pointer group`}
        style={{
          width: cardWidth,
          height: cardHeight,
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          willChange: isCarousel ? 'transform' : 'auto'
        }}
        onClick={() => onSelect(event)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`bg-[#2E1510] rounded-2xl overflow-hidden shadow-lg border-2 h-full flex flex-col ${
          isHovered ? 'shadow-2xl border-[#ED2800]' : 'border-[#2E1510]'
        }`}
        style={{
          transition: 'box-shadow 0.3s ease, border-color 0.3s ease'
        }}>
          <div className="relative h-64 flex-shrink-0 overflow-hidden" style={{
            transform: 'translateZ(0)',
            WebkitTransform: 'translateZ(0)',
            willChange: 'auto',
            isolation: 'isolate'
          }}>
            <div className="w-full h-full overflow-hidden" style={{
              transform: 'translateZ(0)',
              WebkitTransform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              position: 'relative'
            }}>
              {isVideo ? (
                <video
                  src={event.poster}
                  className="w-full h-full object-cover"
                  style={{ 
                    pointerEvents: 'none',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    transform: 'translateZ(0)',
                    WebkitTransform: 'translateZ(0)',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    willChange: 'auto',
                    opacity: 1
                  }}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                />
              ) : (
                <img
                  ref={imgRef}
                  src={event.poster}
                  alt={event.title}
                  loading="eager"
                  className="w-full h-full object-cover"
                  style={{ 
                    pointerEvents: 'none',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    transform: 'translateZ(0)',
                    WebkitTransform: 'translateZ(0)',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    imageRendering: 'auto',
                    WebkitImageRendering: 'auto',
                    willChange: 'auto',
                    opacity: imageLoaded ? 1 : 0,
                    transition: imageLoaded ? 'opacity 0.1s ease-in' : 'none',
                    contentVisibility: 'auto'
                  }}
                  decoding="async"
                  onLoad={(e) => {
                    const img = e.currentTarget;
                    // Only update if not already loaded to prevent flickering
                    if (!imageLoaded) {
                      // Use requestAnimationFrame to batch the update
                      requestAnimationFrame(() => {
                        setImageLoaded(true);
                        // Force GPU layer and prevent reload
                        img.style.transform = 'translateZ(0)';
                        img.style.willChange = 'auto';
                      });
                    }
                  }}
                  onError={() => {
                    if (!imageLoaded) {
                      setImageLoaded(true);
                    }
                  }}
                />
              )}
              {!isVideo && !imageLoaded && (
                <div className="absolute inset-0 bg-[#2E1510]/50 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-[#FCD478] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#2E1510] to-transparent opacity-60 pointer-events-none" />
            <div className="absolute top-4 right-4 flex flex-wrap gap-2 pointer-events-none">
              {event.genre.slice(0, 2).map(g => (
                <Badge key={g} className="bg-[#FCD478] text-[#2E1510] border-0">{g}</Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col flex-1 min-h-0 overflow-hidden"
               style={{
                 padding: windowWidth < 640 ? '0.75rem' : windowWidth < 768 ? '1rem' : '1.5rem'
               }}>
            <h3 className="text-white mb-1 line-clamp-2"
                style={{
                  fontSize: windowWidth < 640 ? '0.875rem' : windowWidth < 768 ? '1rem' : '1.5rem',
                  lineHeight: '1.3'
                }}>
              {event.title}
            </h3>
            <p className="text-[#FCD478] mb-0.5"
               style={{
                 fontSize: windowWidth < 640 ? '0.75rem' : windowWidth < 768 ? '0.875rem' : '1rem'
               }}>
              {event.date}
            </p>
            <p className="text-white/60 mb-2"
               style={{
                 fontSize: windowWidth < 640 ? '0.625rem' : windowWidth < 768 ? '0.75rem' : '0.875rem'
               }}>
              {countDJs(event.djs)} Sets • {event.venue}
            </p>
            <div className="flex flex-wrap gap-1 mt-auto overflow-y-auto"
                 style={{
                   maxHeight: windowWidth < 640 ? '3rem' : windowWidth < 768 ? '3.5rem' : 'auto'
                 }}>
              {event.djs.slice(0, windowWidth < 640 ? 4 : windowWidth < 768 ? 5 : 3).map(dj => (
                <span key={dj} className="text-white/40"
                      style={{
                        fontSize: windowWidth < 640 ? '0.625rem' : windowWidth < 768 ? '0.75rem' : '0.75rem'
                      }}>
                  {dj}
                </span>
              ))}
              {event.djs.length > (windowWidth < 640 ? 4 : windowWidth < 768 ? 5 : 3) && (
                <span className="text-white/40"
                      style={{
                        fontSize: windowWidth < 640 ? '0.625rem' : windowWidth < 768 ? '0.75rem' : '0.75rem'
                      }}>
                  +{event.djs.length - (windowWidth < 640 ? 4 : windowWidth < 768 ? 5 : 3)} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }, (prevProps, nextProps) => {
    // Custom comparison to prevent unnecessary re-renders
    return (
      prevProps.event.id === nextProps.event.id &&
      prevProps.event.poster === nextProps.event.poster &&
      prevProps.isCarousel === nextProps.isCarousel &&
      prevProps.windowWidth === nextProps.windowWidth &&
      prevProps.index === nextProps.index
    );
  });

  return (
    <div className="w-full">
      {/* Statistics Dashboard */}
      <ArchiveStats
        totalEvents={events.length}
        totalSets={totalSets}
        totalVenues={venuesWithEvents}
        totalDJs={uniqueDJs}
      />

      {/* Venue Map */}
      <Suspense
        fallback={
          <div
            className="relative mx-auto rounded-2xl overflow-hidden border-2 border-[#2E1510] mb-8 bg-[#2E1510]/10 animate-pulse"
            style={{ width: '70%', maxWidth: '70%', height: '600px', minHeight: '600px' }}
          />
        }
      >
        <VenueMap
          venues={venues}
          onVenueClick={handleVenueClick}
          resetTrigger={resetTrigger}
          closeOnCarouselView={isCarouselInView}
        />
      </Suspense>

      {/* Year Navigator */}
      <div ref={carouselSectionRef} className="flex flex-wrap justify-center gap-3 mb-8">
        <Button
          onClick={() => handleYearClick('all')}
          variant={selectedYear === 'all' ? 'default' : 'outline'}
          className={selectedYear === 'all' ? 'bg-[#ED2800] hover:bg-[#ED2800]/80 text-white' : 'bg-[#2E1510] text-white hover:bg-[#2E1510]/80 border-[#2E1510]'}
        >
          All Years
        </Button>
        {years.map(year => (
          <Button
            key={year}
            onClick={() => handleYearClick(year.toString())}
            variant={selectedYear === year.toString() ? 'default' : 'outline'}
            className={selectedYear === year.toString() ? 'bg-[#ED2800] hover:bg-[#ED2800]/80 text-white' : 'bg-[#2E1510] text-white hover:bg-[#2E1510]/80 border-[#2E1510]'}
          >
            {year}
          </Button>
        ))}
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[160px] bg-[#2E1510] text-white border-[#2E1510]">
              <SelectValue placeholder="All Months" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Months</SelectItem>
              {months.map(month => (
                <SelectItem key={month} value={month}>{month}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedDJ} onValueChange={setSelectedDJ}>
            <SelectTrigger className="w-[160px] bg-[#2E1510] text-white border-[#2E1510]">
              <SelectValue placeholder="All DJs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All DJs</SelectItem>
              {allDJs.map(dj => (
                <SelectItem key={dj.name} value={dj.name}>{dj.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedVenue} onValueChange={setSelectedVenue}>
            <SelectTrigger className="w-[160px] bg-[#2E1510] text-white border-[#2E1510]">
              <SelectValue placeholder="All Venues" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Venues</SelectItem>
              {venues.map(venue => (
                <SelectItem key={venue.name} value={venue.name}>{venue.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(selectedYear !== 'all' || selectedMonth !== 'all' || selectedDJ !== 'all' || selectedVenue !== 'all') && (
            <Button
              onClick={clearFilters}
              variant="outline"
              className="bg-transparent text-[#2E1510] border-[#2E1510] hover:bg-[#2E1510] hover:text-white"
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {viewMode === 'carousel' && (
            <Button
              onClick={() => setIsAutoScrolling(!isAutoScrolling)}
              variant="outline"
              size="icon"
              className={`${isAutoScrolling ? 'bg-[#ED2800] text-white border-[#ED2800]' : 'bg-[#2E1510] text-white border-[#2E1510]'} hover:bg-[#ED2800] hover:text-white`}
              title={isAutoScrolling ? 'Stop auto-scroll' : 'Start auto-scroll'}
            >
              {isAutoScrolling ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
          )}
          
          <Button
            onClick={() => setViewMode('carousel')}
            variant="outline"
            size="icon"
            className={`${viewMode === 'carousel' ? 'bg-[#ED2800] text-white border-[#ED2800]' : 'bg-[#2E1510] text-white border-[#2E1510]'} hover:bg-[#ED2800] hover:text-white`}
            title="Carousel view"
          >
            <List className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={() => setViewMode('grid')}
            variant="outline"
            size="icon"
            className={`${viewMode === 'grid' ? 'bg-[#ED2800] text-white border-[#ED2800]' : 'bg-[#2E1510] text-white border-[#2E1510]'} hover:bg-[#ED2800] hover:text-white`}
            title="Grid view"
          >
            <Grid3x3 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Event Display */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-2xl text-[#2E1510]">No events found matching your filters</p>
        </div>
      ) : viewMode === 'carousel' ? (
        <div className="relative w-full px-4">
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[#2E1510] text-white flex items-center justify-center hover:bg-[#2E1510]/80 transition-colors"
            aria-label="Previous events"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[#2E1510] text-white flex items-center justify-center hover:bg-[#2E1510]/80 transition-colors"
            aria-label="Next events"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="overflow-hidden w-full px-12 py-8">
            <div 
              ref={carouselContainerRef}
              className="flex gap-6"
              style={{
                transform: carouselTransform,
                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                willChange: 'transform',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                perspective: '1000px',
                WebkitPerspective: '1000px',
                contain: 'layout style paint'
              }}
            >
              {filteredEvents.map((event, index) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  index={index}
                  isCarousel={viewMode === 'carousel'}
                  windowWidth={windowWidth}
                  onSelect={handleEventSelect}
                />
              ))}
            </div>
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center gap-2 mt-6">
            {filteredEvents.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-[#ED2800] w-8' 
                    : 'bg-[#2E1510]/30 hover:bg-[#2E1510]/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 max-w-7xl mx-auto">
          {filteredEvents.map((event, index) => (
            <EventCard 
              key={event.id} 
              event={event} 
              index={index}
              isCarousel={false}
              windowWidth={windowWidth}
              onSelect={handleEventSelect}
            />
          ))}
        </div>
      )}

      {/* Event Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex bg-[#220b04]/95 backdrop-blur-md"
            style={{
              alignItems: windowWidth < 768 ? 'flex-start' : 'center',
              justifyContent: 'center',
              padding: windowWidth < 768 ? '0.5rem' : '1rem',
              paddingTop: windowWidth < 768 ? '4rem' : '1rem'
            }}
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full overflow-y-auto bg-[#FCD478] shadow-2xl"
              style={{
                maxWidth: windowWidth < 640 ? '100%' : windowWidth < 768 ? '95%' : '80rem',
                maxHeight: windowWidth < 768 ? 'calc(95vh - 4rem)' : '90vh',
                borderRadius: windowWidth < 768 ? '1rem' : '1.5rem',
                marginTop: windowWidth < 768 ? '0' : '0'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute z-10 rounded-full bg-[#2E1510] text-white flex items-center justify-center hover:bg-[#ED2800] transition-colors"
                style={{
                  top: windowWidth < 768 ? '0.75rem' : '1.5rem',
                  right: windowWidth < 768 ? '0.75rem' : '1.5rem',
                  width: windowWidth < 768 ? '2rem' : '3rem',
                  height: windowWidth < 768 ? '2rem' : '3rem'
                }}
                aria-label="Close modal"
              >
                <X style={{ width: windowWidth < 768 ? '1rem' : '1.5rem', height: windowWidth < 768 ? '1rem' : '1.5rem' }} />
              </button>

              <div style={{
                padding: windowWidth < 640 ? '1rem' : windowWidth < 768 ? '1.5rem' : windowWidth < 1024 ? '2rem' : '3rem'
              }}>
                {/* Poster container */}
                <div 
                  className="relative mx-auto rounded-xl overflow-hidden shadow-xl bg-[#2E1510]/20 transition-all duration-300 ease-out cursor-pointer" 
                  style={{ 
                    maxWidth: windowWidth < 640 ? '100%' : windowWidth < 768 ? '100%' : '650px',
                    width: 'fit-content',
                    marginBottom: windowWidth < 768 ? '1.5rem' : '2rem',
                    borderRadius: windowWidth < 768 ? '0.75rem' : '1rem'
                  }}
                  onClick={() => setFullScreenImage(selectedEvent.poster)}
                >
                  <ImageWithFallback
                    src={selectedEvent.poster}
                    alt={selectedEvent.title}
                    className="object-contain block"
                    style={{ 
                      maxWidth: windowWidth < 640 ? '100%' : windowWidth < 768 ? '100%' : '650px',
                      maxHeight: windowWidth < 640 ? '300px' : windowWidth < 768 ? '400px' : '650px',
                      width: 'auto',
                      height: 'auto',
                      display: 'block',
                      pointerEvents: 'none'
                    }}
                  />
                </div>

                <div style={{ marginBottom: windowWidth < 768 ? '1.5rem' : '2rem' }}>
                  <div className="flex flex-wrap gap-2" style={{ marginBottom: windowWidth < 768 ? '1rem' : '1.5rem' }}>
                    {selectedEvent.genre.map(g => (
                      <Badge key={g} className="bg-[#ED2800] text-white border-0" style={{ fontSize: windowWidth < 768 ? '0.75rem' : '0.875rem' }}>{g}</Badge>
                    ))}
                  </div>
                  
                  <h2 className="text-[#2E1510] lowercase"
                      style={{
                        fontSize: windowWidth < 640 ? '1.75rem' : windowWidth < 768 ? '2.25rem' : windowWidth < 1024 ? '3rem' : '3.75rem',
                        marginBottom: windowWidth < 768 ? '1rem' : '1.5rem',
                        lineHeight: '1.2'
                      }}>
                    {selectedEvent.title}
                  </h2>
                  
                  <div className="flex flex-wrap" style={{ gap: windowWidth < 640 ? '1rem' : windowWidth < 768 ? '1.5rem' : '1.5rem', marginBottom: windowWidth < 768 ? '1rem' : '1.5rem' }}>
                    <div>
                      <p className="text-[#2E1510]/60 uppercase tracking-wide" style={{ fontSize: windowWidth < 768 ? '0.75rem' : '0.875rem', marginBottom: '0.25rem' }}>Date</p>
                      <p className="text-[#2E1510]" style={{ fontSize: windowWidth < 768 ? '1rem' : '1.25rem' }}>{selectedEvent.date}</p>
                    </div>
                    <div>
                      <p className="text-[#2E1510]/60 uppercase tracking-wide" style={{ fontSize: windowWidth < 768 ? '0.75rem' : '0.875rem', marginBottom: '0.25rem' }}>Venue</p>
                      <p className="text-[#2E1510]" style={{ fontSize: windowWidth < 768 ? '1rem' : '1.25rem' }}>{selectedEvent.venue}</p>
                      <p className="text-[#2E1510]/60" style={{ fontSize: windowWidth < 768 ? '0.75rem' : '0.875rem' }}>{selectedEvent.venueAddress}</p>
                    </div>
                    <div>
                      <p className="text-[#2E1510]/60 uppercase tracking-wide" style={{ fontSize: windowWidth < 768 ? '0.75rem' : '0.875rem', marginBottom: '0.25rem' }}>Sets</p>
                      <p className="text-[#2E1510]" style={{ fontSize: windowWidth < 768 ? '1rem' : '1.25rem' }}>{countDJs(selectedEvent.djs)} DJ Sets</p>
                    </div>
                  </div>
                  
                  <p className="text-[#2E1510]/80 leading-relaxed max-w-3xl"
                     style={{
                       fontSize: windowWidth < 640 ? '0.875rem' : windowWidth < 768 ? '1rem' : '1.125rem',
                       marginBottom: windowWidth < 768 ? '1rem' : '1.5rem'
                     }}>
                    {selectedEvent.description}
                  </p>

                  <div>
                    <p className="text-[#2E1510]/60 uppercase tracking-wide" style={{ fontSize: windowWidth < 768 ? '0.75rem' : '0.875rem', marginBottom: windowWidth < 768 ? '0.75rem' : '1rem' }}>Featured Artists</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.djs.map(dj => (
                        <Badge key={dj} className="bg-[#2E1510] text-white border-0" style={{ fontSize: windowWidth < 768 ? '0.75rem' : '0.875rem' }}>{dj}</Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[#2E1510] lowercase"
                      style={{
                        fontSize: windowWidth < 640 ? '1.25rem' : windowWidth < 768 ? '1.5rem' : '1.5rem',
                        marginBottom: windowWidth < 768 ? '1rem' : '1.5rem'
                      }}>photo gallery</h3>
                  
                  {/* Gallery container */}
                  <div className="relative mx-auto rounded-lg overflow-hidden shadow-lg bg-[#2E1510]/20"
                       style={{
                         maxWidth: windowWidth < 640 ? '100%' : windowWidth < 768 ? '100%' : '650px',
                         width: 'fit-content',
                         marginBottom: windowWidth < 768 ? '1rem' : '1.5rem',
                         borderRadius: windowWidth < 768 ? '0.5rem' : '0.75rem'
                       }}>
                    <ImageWithFallback
                      src={selectedEvent.gallery[selectedGalleryIndex]}
                      alt={`${selectedEvent.title} gallery ${selectedGalleryIndex + 1}`}
                      className="object-contain block"
                      style={{ 
                        maxWidth: windowWidth < 640 ? '100%' : windowWidth < 768 ? '100%' : '650px',
                        maxHeight: windowWidth < 640 ? '300px' : windowWidth < 768 ? '400px' : '650px',
                        width: 'auto',
                        height: 'auto',
                        display: 'block'
                      }}
                    />
                    
                    {selectedEvent.gallery.length > 1 && (
                      <>
                        <button
                          onClick={() => setSelectedGalleryIndex((prev) => 
                            prev === 0 ? selectedEvent.gallery.length - 1 : prev - 1
                          )}
                          className="absolute top-1/2 -translate-y-1/2 rounded-full bg-[#2E1510]/80 text-white flex items-center justify-center hover:bg-[#2E1510] transition-colors z-10"
                          style={{
                            left: windowWidth < 768 ? '0.5rem' : '1rem',
                            width: windowWidth < 768 ? '2rem' : '2.5rem',
                            height: windowWidth < 768 ? '2rem' : '2.5rem'
                          }}
                        >
                          <ChevronLeft style={{ width: windowWidth < 768 ? '1rem' : '1.25rem', height: windowWidth < 768 ? '1rem' : '1.25rem' }} />
                        </button>
                        <button
                          onClick={() => setSelectedGalleryIndex((prev) => 
                            prev === selectedEvent.gallery.length - 1 ? 0 : prev + 1
                          )}
                          className="absolute top-1/2 -translate-y-1/2 rounded-full bg-[#2E1510]/80 text-white flex items-center justify-center hover:bg-[#2E1510] transition-colors z-10"
                          style={{
                            right: windowWidth < 768 ? '0.5rem' : '1rem',
                            width: windowWidth < 768 ? '2rem' : '2.5rem',
                            height: windowWidth < 768 ? '2rem' : '2.5rem'
                          }}
                        >
                          <ChevronRight style={{ width: windowWidth < 768 ? '1rem' : '1.25rem', height: windowWidth < 768 ? '1rem' : '1.25rem' }} />
                        </button>
                      </>
                    )}
                  </div>

                  <div className="flex overflow-x-auto pb-2"
                       style={{
                         gap: windowWidth < 768 ? '0.5rem' : '0.75rem'
                       }}>
                    {selectedEvent.gallery.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedGalleryIndex(idx)}
                        className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                          idx === selectedGalleryIndex
                            ? 'border-[#ED2800] scale-105'
                            : 'border-[#2E1510]/30 hover:border-[#2E1510]'
                        }`}
                        style={{
                          width: windowWidth < 640 ? '3.5rem' : windowWidth < 768 ? '4rem' : '6rem',
                          height: windowWidth < 640 ? '3.5rem' : windowWidth < 768 ? '4rem' : '6rem'
                        }}
                      >
                        <ImageWithFallback
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Screen Image Modal */}
      <AnimatePresence>
        {fullScreenImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/95 backdrop-blur-md"
            style={{ 
              zIndex: 99999,
              padding: windowWidth < 768 ? '0.5rem' : '1rem'
            }}
            onClick={() => setFullScreenImage(null)}
          >
            <button
              onClick={() => setFullScreenImage(null)}
              className="absolute z-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
              style={{
                top: windowWidth < 768 ? '0.75rem' : '1.5rem',
                right: windowWidth < 768 ? '0.75rem' : '1.5rem',
                width: windowWidth < 768 ? '2rem' : '3rem',
                height: windowWidth < 768 ? '2rem' : '3rem'
              }}
              aria-label="Close full screen"
            >
              <X style={{ width: windowWidth < 768 ? '1rem' : '1.5rem', height: windowWidth < 768 ? '1rem' : '1.5rem' }} />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                maxWidth: windowWidth < 768 ? '95vw' : '90vw',
                maxHeight: windowWidth < 768 ? '95vh' : '90vh'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {fullScreenImage.toLowerCase().endsWith('.mp4') || fullScreenImage.toLowerCase().endsWith('.webm') || fullScreenImage.toLowerCase().endsWith('.mov') ? (
                <video
                  src={fullScreenImage}
                  className="object-contain rounded-lg"
                  style={{
                    maxWidth: '100%',
                    maxHeight: windowWidth < 768 ? '95vh' : '90vh'
                  }}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                />
              ) : (
                <img
                  src={fullScreenImage}
                  alt="Full screen"
                  className="object-contain rounded-lg"
                  style={{
                    maxWidth: '100%',
                    maxHeight: windowWidth < 768 ? '95vh' : '90vh'
                  }}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
