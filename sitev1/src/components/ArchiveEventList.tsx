import { motion } from 'motion/react';
import { PastEvent } from './InteractiveArchiveMap';

interface ArchiveEventListProps {
  events: PastEvent[];
  selectedEventId?: string | null;
  onEventHover: (eventId: string | null) => void;
  onEventClick: (eventId: string) => void;
}

const colorMap = {
  magenta: '#FF00FF',
  cyan: '#00FFFF',
  yellow: '#FCD478',
};

export function ArchiveEventList({
  events,
  selectedEventId,
  onEventHover,
  onEventClick,
}: ArchiveEventListProps) {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      <div className="p-4 space-y-3">
        {events.map((event) => {
          const isSelected = selectedEventId === event.id;
          
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`group cursor-pointer transition-all duration-300 ${
                isSelected ? 'scale-105' : 'hover:scale-102'
              }`}
              onMouseEnter={() => onEventHover(event.id)}
              onMouseLeave={() => onEventHover(null)}
              onClick={() => onEventClick(event.id)}
            >
              <div
                className={`relative overflow-hidden rounded-lg border-2 transition-all duration-300 ${
                  isSelected
                    ? 'border-white shadow-lg shadow-white/20'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                {/* Color accent strip */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300"
                  style={{
                    backgroundColor: colorMap[event.color],
                    width: isSelected ? '4px' : '2px',
                  }}
                />

                <div className="flex gap-3 p-3 pl-5 bg-gradient-to-r from-black/40 to-transparent">
                  {/* Event poster thumbnail */}
                  <div className="flex-shrink-0">
                    <div
                      className="w-16 h-16 rounded-md overflow-hidden border border-white/20"
                      style={{
                        boxShadow: isSelected
                          ? `0 0 12px ${colorMap[event.color]}40`
                          : 'none',
                      }}
                    >
                      <img
                        src={event.poster}
                        alt={event.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Event details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white mb-1 truncate">
                      {event.name}
                    </h4>
                    <p className="text-xs text-white/60 mb-1">
                      {event.date}
                    </p>
                    <p className="text-xs text-white/50 truncate">
                      {event.venue}
                    </p>
                  </div>

                  {/* Color indicator dot */}
                  <div className="flex-shrink-0 flex items-center">
                    <div
                      className="w-3 h-3 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: colorMap[event.color],
                        boxShadow: isSelected
                          ? `0 0 8px ${colorMap[event.color]}`
                          : 'none',
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}
