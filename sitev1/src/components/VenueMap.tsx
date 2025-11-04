import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Badge } from './ui/badge';

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
}

export function VenueMap({ venues, onVenueClick }: VenueMapProps) {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<VenueEvent | null>(null);
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState(0);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

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

  return (
    <div className="relative w-full h-[400px] rounded-2xl overflow-hidden border-2 border-[#2E1510] mb-8">
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
                          <p className="text-white/60 text-xs">{event.sets} Sets</p>
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
            className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-[#220b04]/95 backdrop-blur-md"
            onClick={() => {
              setSelectedEvent(null);
              setSelectedGalleryIndex(0);
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
                }}
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
