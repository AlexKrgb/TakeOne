import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { DynamicColorText } from './DynamicColorText';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Instagram } from 'lucide-react';

interface DJInfo {
  name: string;
  instagram: string;
  description: string;
}

export function ComingSoonSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedDJ, setSelectedDJ] = useState<DJInfo | null>(null);
  const comingSoonImageRef = useRef<HTMLDivElement>(null);
  const eventImageRef = useRef<HTMLDivElement>(null);

  const djDatabase: Record<string, DJInfo> = {
    "DJ AURORA": {
      name: "DJ AURORA",
      instagram: "@dj_aurora_official",
      description: "Pioneering techno artist known for ethereal soundscapes and deep bass lines. Aurora has been shaking dance floors across Europe for over a decade."
    },
    "TECHNO SOUL": {
      name: "TECHNO SOUL",
      instagram: "@techno_soul_beats",
      description: "Master of melodic techno, blending soulful elements with driving beats. Known for marathon sets that take listeners on emotional journeys."
    },
    "BASS HARMONY": {
      name: "BASS HARMONY",
      instagram: "@bassharmony_dj",
      description: "Underground legend specializing in heavy basslines and hypnotic grooves. A resident DJ at some of Europe's most prestigious clubs."
    }
  };

  const eventDetails = {
    name: "NIGHT PULSE",
    date: "15 NOV 2025",
    location: "MIRO CLUB",
    address: "Via Andreas Hofer, 11",
    city: "Bolzano, Italy",
    lineup: ["DJ AURORA", "TECHNO SOUL", "BASS HARMONY"]
  };

  return (
    <div className="relative min-h-screen flex items-center justify-end pr-0 overflow-hidden">
      {/* Coming Soon State */}
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.div 
            key="coming-soon"
            className="relative z-[2] mr-16 flex items-center gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {/* Plus Button */}
            <motion.button
              className="w-32 h-32 rounded-full border-4 border-[#2E1510] flex items-center justify-center flex-shrink-0 group relative overflow-hidden"
              onClick={() => setIsExpanded(true)}
              whileHover={{ 
                scale: 1.15, 
                backgroundColor: '#ED2800',
                borderColor: '#ED2800',
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <motion.span 
                className="text-8xl leading-none text-[#2E1510] flex items-center justify-center"
                style={{ marginTop: '-0.15em' }}
                animate={{ rotate: 0 }}
                whileHover={{ color: '#ffffff', rotate: 90 }}
                transition={{ duration: 0.3 }}
              >
                +
              </motion.span>
            </motion.button>

            {/* Coming Soon Text */}
            <DynamicColorText
              text={'coming\nsoon'}
              className="text-[12rem] leading-[0.85] lowercase"
              imageRef={comingSoonImageRef}
              defaultColor="#2E1510"
              overlapColor="white"
            />
          </motion.div>
        ) : (
          /* Event Details State */
          <motion.div 
            key="event-details"
            className="relative z-[2] mr-16 flex items-center gap-8"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {/* Minus Button */}
            <motion.button
              className="w-32 h-32 rounded-full border-4 border-[#2E1510] flex items-center justify-center flex-shrink-0 group relative overflow-hidden"
              onClick={() => setIsExpanded(false)}
              initial={{ rotate: 90 }}
              animate={{ rotate: 0 }}
              whileHover={{ 
                scale: 1.15, 
                backgroundColor: '#ED2800',
                borderColor: '#ED2800',
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <motion.span 
                className="text-8xl leading-none text-[#2E1510] flex items-center justify-center"
                style={{ marginTop: '-0.15em' }}
                whileHover={{ color: '#ffffff' }}
                transition={{ duration: 0.3 }}
              >
                −
              </motion.span>
            </motion.button>

            {/* Event Info */}
            <motion.div 
              className="flex flex-col gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <DynamicColorText
                text={eventDetails.name}
                className="text-8xl uppercase tracking-tight leading-none"
                imageRef={eventImageRef}
                defaultColor="#2E1510"
                overlapColor="white"
              />
              <div className="flex flex-col gap-2">
                <p className="text-3xl text-[#2E1510]">
                  {eventDetails.date}
                </p>
                <p className="text-2xl text-[#2E1510] opacity-80">
                  {eventDetails.location}
                </p>
                <p className="text-xl text-[#2E1510] opacity-70">
                  {eventDetails.address}
                </p>
                <p className="text-xl text-[#2E1510] opacity-70">
                  {eventDetails.city}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {eventDetails.lineup.map((dj, index) => (
                    <motion.button
                      key={dj}
                      className="px-4 py-2 bg-[#2E1510] text-[#FCD478] text-lg cursor-pointer hover:bg-[#ED2800] transition-colors"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                      onClick={() => setSelectedDJ(djDatabase[dj])}
                    >
                      {dj}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Container with Slide Animations */}
      <div className="relative w-[375px] h-[487px] -ml-64">
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            /* Coming Soon Poster */
            <motion.div 
              key="poster-coming-soon"
              ref={comingSoonImageRef}
              className="absolute inset-0"
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '200%', opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.43, 0.13, 0.23, 0.96] }}
            >
              <ImageWithFallback
                src="https://i.imgur.com/Z5vEbd9.jpg"
                alt="Coming Soon Event"
                className="w-full h-full object-cover"
              />
            </motion.div>
          ) : (
            /* Event Image */
            <motion.div 
              key="poster-event"
              ref={eventImageRef}
              className="absolute inset-0"
              initial={{ x: '-200%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.43, 0.13, 0.23, 0.96] }}
            >
              <ImageWithFallback
                src="https://i.imgur.com/8JggCoB.png"
                alt="Night Pulse Event Poster"
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* DJ Detail Dialog */}
      <Dialog open={selectedDJ !== null} onOpenChange={() => setSelectedDJ(null)}>
        <DialogContent className="bg-[#FCD478] border-4 border-[#2E1510] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-4xl text-[#2E1510] uppercase tracking-tight">
              {selectedDJ?.name}
            </DialogTitle>
            <DialogDescription className="sr-only">
              DJ information including Instagram handle and bio
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <a 
              href={`https://instagram.com/${selectedDJ?.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#2E1510] hover:text-[#ED2800] transition-colors"
            >
              <Instagram size={24} />
              <span className="text-xl">{selectedDJ?.instagram}</span>
            </a>
            <p className="text-[#2E1510] leading-relaxed">
              {selectedDJ?.description}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
