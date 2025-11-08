import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

// Helper function to count DJs (handles both array of strings and comma-separated strings)
const countDJs = (djs: string[] | undefined): number => {
  if (!djs || !Array.isArray(djs)) return 0;
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

interface Venue {
  name: string;
  address: string;
  eventCount: number;
  position: { lat: number; lng: number };
  events?: VenueEvent[];
}

interface VenueEvent {
  id: string;
  title: string;
  date: string;
  poster: string;
  sets: number;
  djs: string[];
  genre: string[];
  description: string;
  gallery: string[];
}

interface VenueMapProps {
  venues: Venue[];
  onVenueClick: (venueName: string) => void;
  resetTrigger?: string;
  closeOnCarouselView?: boolean;
}

export function VenueMap({ venues, onVenueClick, resetTrigger, closeOnCarouselView }: VenueMapProps) {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<VenueEvent | null>(null);
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState(0);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  
  // Close venue panel when leaving the archive section
  useEffect(() => {
    if (resetTrigger && resetTrigger !== 'archive') {
      setSelectedVenue(null);
      setSelectedEvent(null);
      setSelectedGalleryIndex(0);
      setSelectedEventId('');
      setFullScreenImage(null);
    }
  }, [resetTrigger]);
  
  // Close venue panel when carousel comes into view
  useEffect(() => {
    if (closeOnCarouselView) {
      setSelectedVenue(null);
      setSelectedEvent(null);
      setSelectedGalleryIndex(0);
      setSelectedEventId('');
    }
  }, [closeOnCarouselView]);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  // Collect all events from all venues
  const allEvents = venues.flatMap(venue => 
    (venue.events || []).map(event => ({
      ...event,
      venueName: venue.name,
      venuePosition: venue.position
    }))
  );

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    let isMounted = true;

    try {
      // Initialize map
      const mapInstance = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://tiles.stadiamaps.com/styles/stamen_toner.json',
        center: [11.341471746454317, 46.49041070203111],
        zoom: 13,
      });

      map.current = mapInstance;

      // Add navigation controls
      mapInstance.addControl(new maplibregl.NavigationControl());

      // Wait for map to load
      mapInstance.on('load', () => {
        if (!isMounted) return;
        setMapLoaded(true);

        // Add markers
        venues.forEach((venue) => {
          if (!map.current) return;

          // Create custom marker element
          const el = document.createElement('div');
          el.className = 'custom-marker';
          el.style.width = '40px';
          el.style.height = '40px';
          el.style.cursor = 'pointer';
          el.style.position = 'absolute';
          el.style.left = '0';
          el.style.top = '0';
          el.style.transform = 'none';
          el.style.margin = '0';
          el.style.padding = '0';
          el.innerHTML = `
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#ED2800"
              stroke="white"
              stroke-width="2"
              style="width: 100%; height: 100%; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3" fill="white"></circle>
            </svg>
          `;

          const marker = new maplibregl.Marker({ 
            element: el,
            anchor: 'bottom',
            offset: [0, 0]
          })
            .setLngLat([venue.position.lng, venue.position.lat])
            .addTo(mapInstance);

          el.addEventListener('click', () => {
            if (isMounted) {
              setSelectedVenue(venue);
              onVenueClick(venue.name);
            }
          });

          markers.current.push(marker);
        });
      });

      // Handle errors
      mapInstance.on('error', (e) => {
        // Only show critical errors, ignore sprite/style loading issues
        if (e.error && !e.error.message?.includes('sprite') && !e.error.message?.includes('glyphs')) {
          console.warn('Map error:', e.error);
        }
      });

    } catch (error) {
      console.error('Failed to initialize map:', error);
      setMapError(true);
    }

    return () => {
      isMounted = false;
      markers.current.forEach(marker => {
        try {
          marker.remove();
        } catch (e) {
          // Ignore cleanup errors
        }
      });
      markers.current = [];
      if (map.current) {
        try {
          map.current.remove();
        } catch (e) {
          // Ignore cleanup errors
        }
        map.current = null;
      }
    };
  }, []);

  // Add markers when venues change
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add new markers
    venues.forEach((venue) => {
      if (!map.current) return;

      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '40px';
      el.style.height = '40px';
      el.style.cursor = 'pointer';
      el.style.position = 'absolute';
      el.style.left = '0';
      el.style.top = '0';
      el.style.transform = 'none';
      el.style.margin = '0';
      el.style.padding = '0';
      el.innerHTML = `
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="#ED2800"
          stroke="white"
          stroke-width="2"
          style="width: 100%; height: 100%; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3" fill="white"></circle>
        </svg>
      `;

      const marker = new maplibregl.Marker({ 
        element: el,
        anchor: 'bottom',
        offset: [0, 0]
      })
        .setLngLat([venue.position.lng, venue.position.lat])
        .addTo(map.current);

      el.addEventListener('click', () => {
        setSelectedVenue(venue);
        onVenueClick(venue.name);
      });

      markers.current.push(marker);
    });
  }, [venues, onVenueClick, mapLoaded]);

  // Handle event selection from dropdown
  const handleEventSelect = (eventId: string) => {
    const eventWithVenue = allEvents.find(e => e.id === eventId);
    if (!eventWithVenue || !map.current) return;

    // Find the venue that contains this event
    const venue = venues.find(v => v.events?.some(e => e.id === eventId));
    if (!venue) return;

    // Center map on venue position
    map.current.flyTo({
      center: [venue.position.lng, venue.position.lat],
      zoom: 15,
      duration: 1000,
      essential: true
    });

    // Open venue panel (not the event modal directly)
    setSelectedVenue(venue);
    setSelectedEvent(null);
    setSelectedGalleryIndex(0);
    setSelectedEventId('');
  };

  return (
    <div className="relative mx-auto rounded-2xl overflow-hidden border-2 border-[#2E1510] mb-8" style={{ width: '70%', maxWidth: '70%', height: '600px', minHeight: '600px' }}>
      {/* Event Dropdown - positioned on the right */}
      {!selectedEvent && (
        <div className="absolute top-4 right-4" style={{ zIndex: 50 }}>
          <Select 
            value={selectedEventId} 
            onValueChange={handleEventSelect}
            onOpenChange={(open) => {
              // Close venue panel when dropdown opens
              if (open) {
                setSelectedVenue(null);
                setSelectedEvent(null);
              }
            }}
          >
            <SelectTrigger className="w-[250px] bg-white/95 backdrop-blur-sm border-2 border-[#2E1510] text-[#2E1510] hover:bg-white">
              <SelectValue placeholder="Select an event..." />
            </SelectTrigger>
            <SelectContent className="max-h-[400px] overflow-y-auto" style={{ zIndex: 50 }}>
            {allEvents.map((event) => (
              <SelectItem key={event.id} value={event.id}>
                <div className="flex flex-col">
                  <span className="font-medium">{event.title}</span>
                  <span className="text-xs text-gray-500">{event.venueName} - {event.date}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      )}

      {/* Map container */}
      <div ref={mapContainer} className="w-full h-full bg-gray-100" />

      {/* Loading state */}
      {!mapLoaded && !mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-[#2E1510]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#2E1510] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p>Loading map...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-[#2E1510]">
          <div className="text-center">
            <p>Map unavailable</p>
          </div>
        </div>
      )}

      {/* Selected venue info panel - Shows events list */}
      <AnimatePresence>
        {selectedVenue && !selectedEvent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-4 right-4 bg-[#FCD478] rounded-xl p-4 shadow-2xl z-[1000] max-h-[80%] overflow-y-auto"
          >
            <button
              onClick={() => setSelectedVenue(null)}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#2E1510] text-white flex items-center justify-center hover:bg-[#ED2800] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="pr-8">
              <h4 className="text-xl text-[#2E1510] mb-1">{selectedVenue.name}</h4>
              <p className="text-sm text-[#2E1510]/70 mb-4">{selectedVenue.address}</p>
              
              {selectedVenue.events && selectedVenue.events.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-[#2E1510] mb-2">
                    <span className="font-medium">{selectedVenue.eventCount}</span> events hosted
                  </p>
                  {selectedVenue.events.map((event) => (
                    <motion.div
                      key={event.id}
                      className="bg-[#2E1510] rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => {
                        setSelectedEvent(event);
                        setSelectedGalleryIndex(0);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex gap-3 p-3">
                        <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0">
                          <img
                            src={event.poster}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-white truncate mb-1">{event.title}</h5>
                          <p className="text-[#FCD478] text-xs mb-1">{event.date}</p>
                          <p className="text-white/60 text-xs">{countDJs(event.djs)} Sets</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#2E1510]">
                  <span className="font-medium">{selectedVenue.eventCount}</span> events hosted
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#220b04]/95 backdrop-blur-md"
            onClick={() => {
              setSelectedEvent(null);
              setSelectedGalleryIndex(0);
              setSelectedEventId('');
            }}
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
                onClick={() => {
                  setSelectedEvent(null);
                  setSelectedGalleryIndex(0);
                  setSelectedEventId('');
                }}
                className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-[#2E1510] text-white flex items-center justify-center hover:bg-[#ED2800] transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="p-8 md:p-12">
                {/* Poster container - 650px max width */}
                <div 
                  className="relative mx-auto rounded-2xl overflow-hidden mb-8 shadow-xl bg-[#2E1510]/20 transition-all duration-300 ease-out cursor-pointer" 
                  style={{ 
                    maxWidth: '650px', 
                    width: 'fit-content'
                  }}
                  onClick={() => setFullScreenImage(selectedEvent.poster)}
                >
                  <ImageWithFallback
                    src={selectedEvent.poster}
                    alt={selectedEvent.title}
                    className="object-contain block"
                    style={{ 
                      maxWidth: '650px',
                      maxHeight: '650px',
                      width: 'auto',
                      height: 'auto',
                      display: 'block',
                      pointerEvents: 'none'
                    }}
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
                      <p className="text-sm text-[#2E1510]/60 uppercase tracking-wide mb-1">Sets</p>
                      <p className="text-xl text-[#2E1510]">{countDJs(selectedEvent.djs)} DJ Sets</p>
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
                  
                  {/* Gallery container - 650px max width */}
                  <div className="relative mx-auto rounded-xl overflow-hidden mb-4 shadow-lg bg-[#2E1510]/20" style={{ maxWidth: '650px', width: 'fit-content' }}>
                    <ImageWithFallback
                      src={selectedEvent.gallery[selectedGalleryIndex]}
                      alt={`${selectedEvent.title} gallery ${selectedGalleryIndex + 1}`}
                      className="object-contain block"
                      style={{ 
                        maxWidth: '650px',
                        maxHeight: '650px',
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
                          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#2E1510]/80 text-white flex items-center justify-center hover:bg-[#2E1510] transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setSelectedGalleryIndex((prev) => 
                            prev === selectedEvent.gallery.length - 1 ? 0 : prev + 1
                          )}
                          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#2E1510]/80 text-white flex items-center justify-center hover:bg-[#2E1510] transition-colors"
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

      {/* Full Screen Image Modal */}
      <AnimatePresence>
        {fullScreenImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
            style={{ zIndex: 99999 }}
            onClick={() => setFullScreenImage(null)}
          >
            <button
              onClick={() => setFullScreenImage(null)}
              className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
              aria-label="Close full screen"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-[90vw] max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {fullScreenImage.toLowerCase().endsWith('.mp4') || fullScreenImage.toLowerCase().endsWith('.webm') || fullScreenImage.toLowerCase().endsWith('.mov') ? (
                <video
                  src={fullScreenImage}
                  className="max-w-full max-h-[90vh] object-contain rounded-lg"
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
                  className="max-w-full max-h-[90vh] object-contain rounded-lg"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
