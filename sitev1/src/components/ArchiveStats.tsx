import { motion } from 'motion/react';
import { Calendar, Users, MapPin, Music } from 'lucide-react';

interface ArchiveStatsProps {
  totalEvents: number;
  totalSets: number;
  totalVenues: number;
  totalDJs: number;
}

export function ArchiveStats({ totalEvents, totalSets, totalVenues, totalDJs }: ArchiveStatsProps) {
  const stats = [
    { icon: Calendar, label: 'Events', value: totalEvents },
    { icon: Music, label: 'DJ Sets', value: totalSets },
    { icon: MapPin, label: 'Venues', value: totalVenues },
    { icon: Users, label: 'Artists', value: totalDJs }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-[#2E1510] rounded-xl p-6 text-center border-2 border-[#2E1510] hover:border-[#ED2800] transition-colors"
          >
            <Icon className="w-8 h-8 mx-auto mb-3 text-[#FCD478]" />
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.2, type: "spring" }}
              viewport={{ once: true }}
              className="text-4xl text-white mb-1"
            >
              {stat.value}
            </motion.div>
            <div className="text-sm text-white/60 uppercase tracking-wide">{stat.label}</div>
          </motion.div>
        );
      })}
    </div>
  );
}
