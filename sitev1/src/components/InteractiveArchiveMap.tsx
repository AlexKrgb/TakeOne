import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export interface PastEvent {
  id: string;
  name: string;
  date: string;
  venue: string;
  position: { lat: number; lng: number };
  poster: string;
  color: 'magenta' | 'cyan' | 'yellow';
}

interface InteractiveArchiveMapProps {
  events: PastEvent[];
  selectedEventId?: string | null;
  onEventSelect: (eventId: string) => void;
}

const colorMap = {
  magenta: '#FF00FF',
  cyan: '#00FFFF',
  yellow: '#FCD478',
};

export function InteractiveArchiveMap({
  events,
  selectedEventId,
  onEventSelect,
}: InteractiveArchiveMapProps) {
  const [selectedEvent, setSelectedEvent] = useState<PastEvent | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: maplibregl.Marker }>({});

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Use a small delay to ensure container is rendered
    const initTimeout = setTimeout(() => {
      if (!mapContainerRef.current) return;

      // Check if container has dimensions
      const container = mapContainerRef.current;
      if (container.offsetWidth === 0 || container.offsetHeight === 0) {
        console.warn('Map container has no dimensions, attempting to initialize anyway...');
      }

      try {
      // Use OpenStreetMap raster tiles ONLY - explicit inline style to avoid any external style loading
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: {
          version: 8,
          sources: {
            'osm-tiles': {
              type: 'raster',
              tiles: [
                'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
              ],
              tileSize: 256,
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            },
          },
          layers: [
            {
              id: 'osm-layer',
              type: 'raster',
              source: 'osm-tiles',
              minzoom: 0,
              maxzoom: 19,
            },
          ],
          // No glyphs - we don't need text labels for raster tiles
          glyphs: '',
        },
        center: [11.332423975045913, 46.48926284644784], // [lng, lat] format
        zoom: 13,
        maxPitch: 0,
        pitch: 0,
        bearing: 0,
      });
      
      console.log('Map initialized with OSM tiles configuration');

      // Handle map errors - completely ignore Stadiamaps errors and tile loading errors
      map.on('error', (e: any) => {
        if (e.error) {
          const errorMsg = (e.error.message || '').toLowerCase();
          const errorUrl = (e.error.url || '').toLowerCase();
          
          // Completely ignore Stadiamaps errors (they're from VenueMap component)
          if (errorUrl.includes('stadiamaps') || errorMsg.includes('stadiamaps')) {
            return; // Silently ignore
          }
          
          // Only show critical WebGL errors
          if (errorMsg.includes('webgl context') || errorMsg.includes('webgl not supported')) {
            console.error('Critical WebGL error:', e.error.message);
            setMapError(`WebGL not supported: ${e.error.message}`);
          }
          // All other errors are ignored - map will retry automatically
        }
      });

      // Wait for map to load
      map.on('load', () => {
        console.log('Map loaded successfully');
        setMapLoaded(true);
        setMapError(null);
        
        // Force OSM tiles to load by checking if they're actually loading
        const style = map.getStyle();
        console.log('Map style sources:', Object.keys(style?.sources || {}));
        
        // Check if OSM tiles source exists
        if (style?.sources && style.sources['osm-tiles']) {
          console.log('OSM tiles source found, tiles should load');
        } else {
          console.error('OSM tiles source NOT found in style!');
        }
        
        // Apply dark filter to OSM tiles using CSS
        const mapCanvas = map.getCanvasContainer();
        if (mapCanvas) {
          mapCanvas.style.filter = 'invert(1) hue-rotate(180deg) brightness(0.7) contrast(1.2)';
        }
        
        // Resize map to ensure it renders correctly after a short delay
        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.resize();
            console.log('Map resized');
          }
        }, 100);
      });

      // Listen for source data loading - track OSM tile loading specifically
      map.on('sourcedata', (e: any) => {
        if (e.sourceId === 'osm-tiles') {
          console.log('OSM tiles source event:', {
            sourceId: e.sourceId,
            isSourceLoaded: e.isSourceLoaded,
            dataType: e.dataType,
            tile: e.tile ? { x: e.tile.x, y: e.tile.y, z: e.tile.z } : null
          });
        }
      });
      
      // Also listen for data events to see what tiles are being requested
      map.on('data', (e: any) => {
        if (e.dataType === 'source' && e.sourceId === 'osm-tiles') {
          console.log('OSM source data loaded:', e.isSourceLoaded);
        }
      });

      // Handle style loading - don't set error immediately, styles can load asynchronously
      map.on('styledata', () => {
        // Style data is loading, this is normal during initialization
        // Only log if there's an actual error after a delay
      });

      // Remove the aggressive canvas check - it was causing false positives
      // The map will show errors naturally through the error handlers above

      // Add zoom and rotation controls
      map.addControl(new maplibregl.NavigationControl(), 'bottom-right');

      mapRef.current = map;

      } catch (error) {
        console.error('Error initializing map:', error);
        // Don't set error state - let the map try to load anyway
        // Most errors are recoverable or non-critical
        if (error instanceof Error) {
          console.error('Map init error details:', error.message, error.stack);
          // Only set error for truly fatal errors
          const errorMsg = error.message.toLowerCase();
          if (errorMsg.includes('webgl context') || errorMsg.includes('webgl not supported')) {
            setMapError(`WebGL not supported: ${error.message}`);
          }
          // For all other errors, just log and continue
        }
      }
    }, 100); // Small delay to ensure container is ready

    // Clean up on unmount
    return () => {
      clearTimeout(initTimeout);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Handle window resize
  useEffect(() => {
    if (!mapLoaded) return;

    const handleResize = () => {
      if (mapRef.current) {
        mapRef.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [mapLoaded]);

  // Add/update markers when events change
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    const map = mapRef.current;

    try {
      // Remove existing markers
      Object.values(markersRef.current).forEach(marker => {
        try {
          marker.remove();
        } catch (e) {
          // Ignore errors when removing markers
        }
      });
      markersRef.current = {};

      // Add new markers
      events.forEach((event) => {
      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.cursor = 'pointer';
      el.style.position = 'relative';

      // Glow layer
      const glow = document.createElement('div');
      glow.className = 'marker-glow';
      glow.style.position = 'absolute';
      glow.style.width = '40px';
      glow.style.height = '40px';
      glow.style.borderRadius = '50%';
      glow.style.backgroundColor = colorMap[event.color];
      glow.style.opacity = '0.6';
      glow.style.filter = 'blur(12px)';
      glow.style.left = '50%';
      glow.style.top = '50%';
      glow.style.transform = 'translate(-50%, -50%)';
      glow.style.pointerEvents = 'none';

      // Marker circle
      const circle = document.createElement('div');
      circle.className = 'marker-circle';
      circle.style.width = '18px';
      circle.style.height = '18px';
      circle.style.borderRadius = '50%';
      circle.style.backgroundColor = colorMap[event.color];
      circle.style.border = '2px solid white';
      circle.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      circle.style.position = 'relative';
      circle.style.left = '50%';
      circle.style.top = '50%';
      circle.style.transform = 'translate(-50%, -50%)';
      circle.style.transition = 'all 0.3s ease';

      el.appendChild(glow);
      el.appendChild(circle);

      // Create marker
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([event.position.lng, event.position.lat])
        .addTo(map);

      // Add click handler
      el.addEventListener('click', () => {
        handleEventClick(event);
      });

      // Add hover effect
      el.addEventListener('mouseenter', () => {
        circle.style.width = '24px';
        circle.style.height = '24px';
        glow.style.width = '48px';
        glow.style.height = '48px';
        glow.style.opacity = '0.8';
      });

      el.addEventListener('mouseleave', () => {
        const isSelected = selectedEventId === event.id || selectedEvent?.id === event.id;
        if (!isSelected) {
          circle.style.width = '18px';
          circle.style.height = '18px';
          glow.style.width = '40px';
          glow.style.height = '40px';
          glow.style.opacity = '0.6';
        }
      });

        markersRef.current[event.id] = marker;
      });
    } catch (error) {
      console.error('Error adding markers:', error);
    }
  }, [events, mapLoaded, selectedEventId, selectedEvent]);

  // Update marker styles when selection changes
  useEffect(() => {
    try {
      Object.entries(markersRef.current).forEach(([eventId, marker]) => {
        try {
          const el = marker.getElement();
          const circle = el.querySelector('.marker-circle') as HTMLElement;
          const glow = el.querySelector('.marker-glow') as HTMLElement;
          
          if (circle && glow) {
            const isSelected = selectedEventId === eventId || selectedEvent?.id === eventId;
            if (isSelected) {
              circle.style.width = '24px';
              circle.style.height = '24px';
              glow.style.width = '48px';
              glow.style.height = '48px';
              glow.style.opacity = '0.8';
            } else {
              circle.style.width = '18px';
              circle.style.height = '18px';
              glow.style.width = '40px';
              glow.style.height = '40px';
              glow.style.opacity = '0.6';
            }
          }
        } catch (e) {
          // Ignore errors for individual markers
        }
      });
    } catch (error) {
      console.error('Error updating marker styles:', error);
    }
  }, [selectedEventId, selectedEvent]);

  // Pan to event when externally selected
  useEffect(() => {
    if (selectedEventId && mapRef.current && mapLoaded) {
      try {
        const event = events.find((e) => e.id === selectedEventId);
        if (event) {
          setSelectedEvent(event);
          mapRef.current.flyTo({
            center: [event.position.lng, event.position.lat],
            zoom: 15,
            duration: 1000,
          });
        }
      } catch (error) {
        console.error('Error flying to event:', error);
      }
    }
  }, [selectedEventId, events, mapLoaded]);

  // Handle event click
  const handleEventClick = (event: PastEvent) => {
    setSelectedEvent(event);
    onEventSelect(event.id);

    // Fly to the event location
    if (mapRef.current && mapLoaded) {
      try {
        mapRef.current.flyTo({
          center: [event.position.lng, event.position.lat],
          zoom: 15,
          duration: 1000,
        });
      } catch (error) {
        console.error('Error flying to event:', error);
      }
    }
  };

  return (
    <div className="relative w-full h-full bg-black">
      {/* Title overlay */}
      <div className="absolute top-6 left-6 z-20 pointer-events-none">
        <h2 className="text-3xl md:text-4xl tracking-wide text-white drop-shadow-lg uppercase">
          Past Events Map
        </h2>
      </div>

      {/* Loading indicator */}
      {!mapLoaded && !mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#FCD478] border-t-transparent rounded-full animate-spin"></div>
            <div className="text-white text-xl">Loading map...</div>
          </div>
        </div>
      )}

      {/* Error indicator */}
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
          <div className="flex flex-col items-center gap-4 px-4">
            <div className="text-red-400 text-xl text-center">Map failed to load</div>
            <div className="text-white/60 text-sm text-center max-w-md">{mapError}</div>
            <button
              onClick={() => {
                setMapError(null);
                setMapLoaded(false);
                if (mapRef.current) {
                  mapRef.current.remove();
                  mapRef.current = null;
                }
                // Force re-render to retry initialization
                window.location.reload();
              }}
              className="px-4 py-2 bg-[#FCD478] text-black rounded-lg hover:bg-[#FCD478]/80 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Map container */}
      <div
        ref={mapContainerRef}
        className="absolute inset-0 w-full h-full"
        style={{ minHeight: '400px' }}
      />

      {/* Event popup overlay */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute top-24 left-6 z-30 pointer-events-auto"
          >
            <div className="bg-black/90 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-2xl w-64">
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex gap-3">
                <img
                  src={selectedEvent.poster}
                  alt={selectedEvent.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1 pr-6">
                  <h4 className="text-white mb-1">{selectedEvent.name}</h4>
                  <p className="text-sm text-white/60 mb-1">{selectedEvent.date}</p>
                  <p className="text-xs text-white/50">{selectedEvent.venue}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attribution */}
      <div className="absolute bottom-2 left-2 text-xs text-white/40 bg-black/50 px-2 py-1 rounded z-10">
        © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="hover:text-white/60">OpenStreetMap</a>
        {' · '}
        © <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer" className="hover:text-white/60">CartoDB</a>
      </div>
    </div>
  );
}
