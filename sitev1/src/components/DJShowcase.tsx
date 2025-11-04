import { motion } from 'motion/react';
import { Music } from 'lucide-react';

interface DJ {
  name: string;
  genre: string;
  appearances: number;
  image: string;
}

interface DJShowcaseProps {
  djs: DJ[];
  onDJClick: (djName: string) => void;
}

export function DJShowcase({ djs, onDJClick }: DJShowcaseProps) {
  return (
    <div className="mb-8">
      <h3 className="text-3xl text-[#2E1510] mb-6 lowercase">featured artists</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {djs.map((dj, index) => (
          <motion.button
            key={dj.name}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            onClick={() => onDJClick(dj.name)}
            className="group bg-[#2E1510] rounded-xl p-4 border-2 border-[#2E1510] hover:border-[#ED2800] transition-all text-left"
          >
            <div className="aspect-square rounded-lg bg-[#FCD478]/10 mb-3 flex items-center justify-center overflow-hidden">
              {dj.image ? (
                <img src={dj.image} alt={dj.name} className="w-full h-full object-cover" />
              ) : (
                <Music className="w-8 h-8 text-[#FCD478]" />
              )}
            </div>
            <h4 className="text-white mb-1 truncate">{dj.name}</h4>
            <p className="text-xs text-[#FCD478] mb-1">{dj.genre}</p>
            <p className="text-xs text-white/50">{dj.appearances} sets</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
