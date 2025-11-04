import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X, Grid3x3, List, Play, Pause, Calendar, Filter } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArchiveStats } from './ArchiveStats';
import { VenueMap } from './VenueMap';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

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

const events: Event[] = [
  {
    id: '1',
    title: 'Summer Solstice',
    month: 'June',
    year: 2025,
    date: 'June 21, 2025',
    sets: 12,
    poster: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
    venue: 'Miro Club',
    venueAddress: 'Via Andreas Hofer, Bolzano',
    description: 'An unforgettable night celebrating the longest day of the year with house music legends and rising stars.',
    gallery: [
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
      'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400'
    ],
    djs: ['Maya Luna', 'DJ Sisko', 'Deep Mark', 'Vinyl Viktor'],
    genre: ['Deep House', 'Tech House']
  },
  {
    id: '2',
    title: 'Midnight Groove',
    month: 'April',
    year: 2025,
    date: 'April 15, 2025',
    sets: 8,
    poster: 'https://images.unsplash.com/photo-1571266028243-d220c6e87a29?w=800',
    venue: 'Zoona',
    venueAddress: 'Via Duca d\'Aosta, Bolzano',
    description: 'Deep house and minimal techno took over the dance floor for an intimate night of pure rhythm.',
    gallery: [
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400',
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'
    ],
    djs: ['Nina Kraviz', 'Deep Mark', 'Acid Anna'],
    genre: ['Minimal', 'Deep House']
  },
  {
    id: '3',
    title: 'New Year Bass',
    month: 'January',
    year: 2025,
    date: 'January 1, 2025',
    sets: 15,
    poster: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
    venue: 'Goethe Haus',
    venueAddress: 'Via Goethe, Bolzano',
    description: 'We brought in the new year with heavy basslines and non-stop energy from midnight to sunrise.',
    gallery: [
      'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400',
      'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=400',
      'https://images.unsplash.com/photo-1571266028243-d220c6e87a29?w=400'
    ],
    djs: ['DJ Sisko', 'Bass Queen', 'Maya Luna', 'Techno Tom', 'Vinyl Viktor'],
    genre: ['Tech House', 'Techno']
  },
  {
    id: '4',
    title: 'Autumn Ritual',
    month: 'October',
    year: 2024,
    date: 'October 31, 2024',
    sets: 10,
    poster: 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=800',
    venue: 'Castel Roncolo',
    venueAddress: 'Castel Roncolo, Bolzano',
    description: 'A celebration of transition, blending organic sounds with electronic beats under the autumn sky.',
    gallery: [
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400',
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400'
    ],
    djs: ['Nina Kraviz', 'Deep Mark', 'Acid Anna', 'Maya Luna'],
    genre: ['Organic House', 'Deep House']
  },
  {
    id: '5',
    title: 'Spring Awakening',
    month: 'March',
    year: 2024,
    date: 'March 20, 2024',
    sets: 9,
    poster: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
    venue: 'Miro Club',
    venueAddress: 'Via Andreas Hofer, Bolzano',
    description: 'Fresh beats to welcome the new season with uplifting melodies and groovy basslines.',
    gallery: [
      'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400'
    ],
    djs: ['Techno Tom', 'Bass Queen', 'Vinyl Viktor'],
    genre: ['Progressive House', 'Melodic Techno']
  },
  {
    id: '6',
    title: 'Winter Warehouse',
    month: 'December',
    year: 2023,
    date: 'December 15, 2023',
    sets: 11,
    poster: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
    venue: 'Zoona',
    venueAddress: 'Via Duca d\'Aosta, Bolzano',
    description: 'Raw industrial sounds and heavy beats to warm up the coldest nights.',
    gallery: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
      'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400'
    ],
    djs: ['DJ Sisko', 'Acid Anna', 'Deep Mark', 'Nina Kraviz'],
    genre: ['Techno', 'Industrial']
  }
];

// Real venues in Bolzano with the 6 carousel events distributed across them
const realVenues = [
  { 
    name: 'Miro Club', 
    address: 'Via Andreas Hofer, Bolzano', 
    position: { lat: 46.4989, lng: 11.3547 },
    events: [
      {
        id: '1',
        title: 'Summer Solstice',
        date: 'June 21, 2025',
        poster: events[0].poster,
        sets: events[0].sets,
        djs: events[0].djs,
        genre: events[0].genre,
        description: events[0].description,
        gallery: events[0].gallery
      },
      {
        id: '5',
        title: 'Spring Awakening',
        date: 'March 20, 2024',
        poster: events[4].poster,
        sets: events[4].sets,
        djs: events[4].djs,
        genre: events[4].genre,
        description: events[4].description,
        gallery: events[4].gallery
      }
    ]
  },
  { 
    name: 'Zoona', 
    address: 'Via Duca d\'Aosta, Bolzano', 
    position: { lat: 46.4975, lng: 11.3565 },
    events: [
      {
        id: '2',
        title: 'Midnight Groove',
        date: 'April 15, 2025',
        poster: events[1].poster,
        sets: events[1].sets,
        djs: events[1].djs,
        genre: events[1].genre,
        description: events[1].description,
        gallery: events[1].gallery
      },
      {
        id: '6',
        title: 'Winter Warehouse',
        date: 'December 15, 2023',
        poster: events[5].poster,
        sets: events[5].sets,
        djs: events[5].djs,
        genre: events[5].genre,
        description: events[5].description,
        gallery: events[5].gallery
      }
    ]
  },
  { 
    name: 'Goethe Haus', 
    address: 'Via Goethe, Bolzano', 
    position: { lat: 46.5005, lng: 11.3520 },
    events: [
      {
        id: '3',
        title: 'New Year Bass',
        date: 'January 1, 2025',
        poster: events[2].poster,
        sets: events[2].sets,
        djs: events[2].djs,
        genre: events[2].genre,
        description: events[2].description,
        gallery: events[2].gallery
      }
    ]
  },
  { 
    name: 'Castel Roncolo', 
    address: 'Castel Roncolo, Bolzano', 
    position: { lat: 46.5100, lng: 11.3600 },
    events: [
      {
        id: '4',
        title: 'Autumn Ritual',
        date: 'October 31, 2024',
        poster: events[3].poster,
        sets: events[3].sets,
        djs: events[3].djs,
        genre: events[3].genre,
        description: events[3].description,
        gallery: events[3].gallery
      }
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

export function ArchiveCarousel() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('carousel');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedDJ, setSelectedDJ] = useState<string>('all');
  const [selectedVenue, setSelectedVenue] = useState<string>('all');
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoScrollIntervalRef = useRef<number | null>(null);

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

  // Calculate statistics
  const totalSets = events.reduce((sum, event) => sum + event.sets, 0);
  const uniqueDJs = new Set(events.flatMap(e => e.djs)).size;

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
      }, 3000); // Change slide every 3 seconds

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

  const EventCard = ({ event, index }: { event: Event; index: number }) => {
    const isCarousel = viewMode === 'carousel';
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        className={`${isCarousel ? 'flex-shrink-0 w-80' : 'w-full'} cursor-pointer`}
        onClick={() => {
          setSelectedEvent(event);
          setSelectedGalleryIndex(0);
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`bg-[#2E1510] rounded-2xl overflow-hidden shadow-lg transition-shadow duration-300 border-2 transition-colors ${
          isHovered ? 'shadow-2xl border-[#ED2800]' : 'border-[#2E1510]'
        }`}>
          <div className="relative h-64 overflow-hidden">
            <div className="w-full h-full overflow-hidden">
              <img
                src={event.poster}
                alt={event.title}
                loading="lazy"
                className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
                  isHovered ? 'scale-110' : 'scale-100'
                }`}
                style={{ pointerEvents: 'none' }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#2E1510] to-transparent opacity-60 pointer-events-none" />
            <div className="absolute top-4 right-4 flex flex-wrap gap-2 pointer-events-none">
              {event.genre.slice(0, 2).map(g => (
                <Badge key={g} className="bg-[#FCD478] text-[#2E1510] border-0">{g}</Badge>
              ))}
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-2xl text-white mb-2">{event.title}</h3>
            <p className="text-[#FCD478] mb-1">{event.date}</p>
            <p className="text-white/60 mb-3">{event.sets} Sets • {event.venue}</p>
            <div className="flex flex-wrap gap-2">
              {event.djs.slice(0, 3).map(dj => (
                <span key={dj} className="text-xs text-white/40">{dj}</span>
              ))}
              {event.djs.length > 3 && (
                <span className="text-xs text-white/40">+{event.djs.length - 3} more</span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Statistics Dashboard */}
      <ArchiveStats
        totalEvents={events.length}
        totalSets={totalSets}
        totalVenues={venues.length}
        totalDJs={uniqueDJs}
      />

      {/* Venue Map */}
      <VenueMap venues={venues} onVenueClick={handleVenueClick} />

      {/* Year Navigator */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
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
        <div className="relative w-full max-w-7xl mx-auto px-4">
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

          <div className="overflow-hidden px-12 py-8">
            <div 
              className="flex gap-6 transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(calc(-${currentIndex} * (20rem + 1.5rem)))`
              }}
            >
              {filteredEvents.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
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
            <EventCard key={event.id} event={event} index={index} />
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#220b04]/95 backdrop-blur-md"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-[#FCD478] rounded-3xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-[#2E1510] text-white flex items-center justify-center hover:bg-[#ED2800] transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="p-8 md:p-12">
                <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-8 shadow-xl">
                  <ImageWithFallback
                    src={selectedEvent.poster}
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="mb-8">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedEvent.genre.map(g => (
                      <Badge key={g} className="bg-[#ED2800] text-white border-0">{g}</Badge>
                    ))}
                  </div>
                  
                  <h2 className="text-5xl md:text-6xl text-[#2E1510] mb-4 lowercase">
                    {selectedEvent.title}
                  </h2>
                  
                  <div className="flex flex-wrap gap-6 mb-6">
                    <div>
                      <p className="text-sm text-[#2E1510]/60 uppercase tracking-wide mb-1">Date</p>
                      <p className="text-xl text-[#2E1510]">{selectedEvent.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#2E1510]/60 uppercase tracking-wide mb-1">Venue</p>
                      <p className="text-xl text-[#2E1510]">{selectedEvent.venue}</p>
                      <p className="text-sm text-[#2E1510]/60">{selectedEvent.venueAddress}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#2E1510]/60 uppercase tracking-wide mb-1">Sets</p>
                      <p className="text-xl text-[#2E1510]">{selectedEvent.sets} DJ Sets</p>
                    </div>
                  </div>
                  
                  <p className="text-lg text-[#2E1510]/80 leading-relaxed max-w-3xl mb-6">
                    {selectedEvent.description}
                  </p>

                  <div>
                    <p className="text-sm text-[#2E1510]/60 uppercase tracking-wide mb-3">Featured Artists</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.djs.map(dj => (
                        <Badge key={dj} className="bg-[#2E1510] text-white border-0">{dj}</Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl text-[#2E1510] mb-4 lowercase">photo gallery</h3>
                  
                  <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden mb-4 shadow-lg">
                    <ImageWithFallback
                      src={selectedEvent.gallery[selectedGalleryIndex]}
                      alt={`${selectedEvent.title} gallery ${selectedGalleryIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                    
                    {selectedEvent.gallery.length > 1 && (
                      <>
                        <button
                          onClick={() => setSelectedGalleryIndex((prev) => 
                            prev === 0 ? selectedEvent.gallery.length - 1 : prev - 1
                          )}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#2E1510]/80 text-white flex items-center justify-center hover:bg-[#2E1510] transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setSelectedGalleryIndex((prev) => 
                            prev === selectedEvent.gallery.length - 1 ? 0 : prev + 1
                          )}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#2E1510]/80 text-white flex items-center justify-center hover:bg-[#2E1510] transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>

                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {selectedEvent.gallery.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedGalleryIndex(idx)}
                        className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                          idx === selectedGalleryIndex
                            ? 'border-[#ED2800] scale-105'
                            : 'border-[#2E1510]/30 hover:border-[#2E1510]'
                        }`}
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
    </div>
  );
}
