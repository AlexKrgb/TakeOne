import { useState } from 'react';
import { InteractiveArchiveMap, PastEvent } from './InteractiveArchiveMap';
import { ArchiveEventList } from './ArchiveEventList';

// Venue coordinates (updated with real positions)
const venues = {
  'goethe haus': { lat: 46.4982351952385, lng: 11.352331620903415 },
  'miro club': { lat: 46.49750405812552, lng: 11.352452835712338 },
  'castel roncolo': { lat: 46.517748493962706, lng: 11.359062009518354 },
  'zoona': { lat: 46.484823870426304, lng: 11.337192612674903 },
  'astra brixen': { lat: 46.716610972149525, lng: 11.652391936557878 },
};

// Using the 8 archive events: 1 Castel Roncolo, 1 Goethe Haus, 3 Zoona, 3 Mirò
// Event IDs mapped to folder names:
// 1 -> event-miro-2, 2 -> event-zoona-2, 3 -> event-goethe-haus-1, 4 -> event-castel-roncolo-1
// 5 -> event-miro-1, 6 -> event-zoona-1, 7 -> event-zoona-3, 8 -> event-miro-3
const mockEvents: PastEvent[] = [
  {
    id: '1',
    name: 'Summer Solstice',
    date: 'June 21, 2025',
    venue: 'Miro Club',
    position: venues['miro club'],
    poster: '/images/events/event-miro-2/poster.webp',
    color: 'magenta',
  },
  {
    id: '2',
    name: 'Midnight Groove',
    date: 'April 15, 2025',
    venue: 'Zoona',
    position: venues['zoona'],
    poster: '/images/events/event-zoona-2/poster.webp',
    color: 'cyan',
  },
  {
    id: '3',
    name: 'New Year Bass',
    date: 'January 1, 2025',
    venue: 'Goethe Haus',
    position: venues['goethe haus'],
    poster: '/images/events/event-goethe-haus-1/poster.webp',
    color: 'yellow',
  },
  {
    id: '4',
    name: 'Autumn Ritual',
    date: 'October 31, 2024',
    venue: 'Castel Roncolo',
    position: venues['castel roncolo'],
    poster: '/images/events/event-castel-roncolo-1/poster.webp',
    color: 'magenta',
  },
  {
    id: '5',
    name: 'Spring Awakening',
    date: 'March 20, 2024',
    venue: 'Miro Club',
    position: venues['miro club'],
    poster: '/images/events/event-miro-1/poster.webp',
    color: 'cyan',
  },
  {
    id: '6',
    name: 'Winter Warehouse',
    date: 'December 15, 2023',
    venue: 'Zoona',
    position: venues['zoona'],
    poster: '/images/events/event-zoona-1/poster.webp',
    color: 'yellow',
  },
  {
    id: '7',
    name: 'TakeONE X Unstructured',
    date: 'September 19, 2025',
    venue: 'Zoona',
    position: venues['zoona'],
    poster: '/images/events/event-zoona-3/poster.mp4',
    color: 'magenta',
  },
  {
    id: '8',
    name: 'Mirò Event 3',
    date: 'TBD',
    venue: 'Miro Club',
    position: venues['miro club'],
    poster: '/images/events/event-miro-3/poster.webp',
    color: 'cyan',
  },
  {
    id: '9',
    name: 'TakeONE X Astra TOOLBOX',
    date: 'January 17, 2025',
    venue: 'Astra Brixen',
    position: venues['astra brixen'],
    poster: '/images/events/event-astra-1/poster.webp',
    color: 'magenta',
  },
];

export function ArchiveMapSection() {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);

  const activeEventId = hoveredEventId || selectedEventId;

  return (
    <div className="relative w-full h-screen min-h-[600px] bg-[#220b04]">
      {/* Desktop/Tablet Layout */}
      <div className="hidden md:flex h-full">
        {/* Map - 70% width */}
        <div className="w-[70%] h-full">
          <InteractiveArchiveMap
            events={mockEvents}
            selectedEventId={activeEventId}
            onEventSelect={setSelectedEventId}
          />
        </div>

        {/* Event list sidebar */}
        <div className="w-80 lg:w-96 h-full bg-gradient-to-b from-[#2E1510] to-[#220b04] border-l border-white/10">
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl text-white mb-2">Past Events</h3>
              <p className="text-sm text-white/60">
                Click on a card to locate it on the map
              </p>
            </div>
            <ArchiveEventList
              events={mockEvents}
              selectedEventId={activeEventId}
              onEventHover={setHoveredEventId}
              onEventClick={setSelectedEventId}
            />
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col h-full">
        {/* Map on top - 60% height */}
        <div className="h-[60%]">
          <InteractiveArchiveMap
            events={mockEvents}
            selectedEventId={activeEventId}
            onEventSelect={setSelectedEventId}
          />
        </div>

        {/* Event list below - 40% height */}
        <div className="h-[40%] bg-gradient-to-b from-[#2E1510] to-[#220b04] border-t border-white/10">
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-white/10">
              <h3 className="text-lg text-white mb-1">Past Events</h3>
              <p className="text-xs text-white/60">
                Tap a card to see location
              </p>
            </div>
            <ArchiveEventList
              events={mockEvents}
              selectedEventId={activeEventId}
              onEventHover={() => {}} // No hover on mobile
              onEventClick={setSelectedEventId}
            />
          </div>
        </div>
      </div>

      {/* Bottom description text */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none hidden md:block">
        <p className="text-sm text-white/60 text-center px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full border border-white/10">
          Explore all our past parties and venues across the city
        </p>
      </div>
    </div>
  );
}
