import { useState } from 'react';
import { InteractiveArchiveMap, PastEvent } from './InteractiveArchiveMap';
import { ArchiveEventList } from './ArchiveEventList';

// Venue coordinates
const venues = {
  'goethe haus': { lat: 46.5005, lng: 11.3520 },
  'miro club': { lat: 46.4989, lng: 11.3547 },
  'castel roncolo': { lat: 46.5100, lng: 11.3600 },
  'zoona': { lat: 46.4975, lng: 11.3565 },
};

// Using the 6 existing archive events mapped to the 4 venues
const mockEvents: PastEvent[] = [
  {
    id: '1',
    name: 'Summer Solstice',
    date: 'June 21, 2025',
    venue: 'Miro Club',
    position: venues['miro club'],
    poster: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=400&fit=crop',
    color: 'magenta',
  },
  {
    id: '2',
    name: 'Midnight Groove',
    date: 'April 15, 2025',
    venue: 'Zoona',
    position: venues['zoona'],
    poster: 'https://images.unsplash.com/photo-1571266028243-d220c6e87a29?w=400&h=400&fit=crop',
    color: 'cyan',
  },
  {
    id: '3',
    name: 'New Year Bass',
    date: 'January 1, 2025',
    venue: 'Goethe Haus',
    position: venues['goethe haus'],
    poster: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=400&fit=crop',
    color: 'yellow',
  },
  {
    id: '4',
    name: 'Autumn Ritual',
    date: 'October 31, 2024',
    venue: 'Castel Roncolo',
    position: venues['castel roncolo'],
    poster: 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=400&h=400&fit=crop',
    color: 'magenta',
  },
  {
    id: '5',
    name: 'Spring Awakening',
    date: 'March 20, 2024',
    venue: 'Miro Club',
    position: venues['miro club'],
    poster: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop',
    color: 'cyan',
  },
  {
    id: '6',
    name: 'Winter Warehouse',
    date: 'December 15, 2023',
    venue: 'Zoona',
    position: venues['zoona'],
    poster: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=400&fit=crop',
    color: 'yellow',
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
        {/* Map - takes most of the width */}
        <div className="flex-1 h-full">
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
