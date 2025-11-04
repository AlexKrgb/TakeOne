import { useEffect, useState } from 'react';

function getBrightness(r: number, g: number, b: number) {
  // Perceived brightness formula (weighted RGB)
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

interface DynamicTextColorProps {
  imageSrc: string;
  children: React.ReactNode;
  className?: string;
  sampleRegion?: { x: number; y: number; width: number; height: number };
}

export function DynamicTextColor({ 
  imageSrc, 
  children, 
  className = "",
  sampleRegion
}: DynamicTextColorProps) {
  const [textColor, setTextColor] = useState('#2E1510'); // default color

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageSrc;

    img.onload = () => {
      try {
        // Create off-screen canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Sample region - default to center or use custom region
        let region;
        if (sampleRegion) {
          region = ctx.getImageData(
            sampleRegion.x, 
            sampleRegion.y, 
            sampleRegion.width, 
            sampleRegion.height
          ).data;
        } else {
          // Sample the top-left area where the title typically appears
          const sampleWidth = Math.min(200, img.width);
          const sampleHeight = Math.min(150, img.height);
          region = ctx.getImageData(0, 0, sampleWidth, sampleHeight).data;
        }

        // Compute average brightness
        let total = 0;
        for (let i = 0; i < region.length; i += 4) {
          total += getBrightness(region[i], region[i + 1], region[i + 2]);
        }
        const avgBrightness = total / (region.length / 4);

        // Decide color based on brightness
        // If background is bright (>128), use dark text, otherwise use light text
        setTextColor(avgBrightness > 128 ? '#2E1510' : '#FCD478');
      } catch (error) {
        console.error('Error analyzing image:', error);
        // Fallback to default color
        setTextColor('#2E1510');
      }
    };

    img.onerror = () => {
      console.error('Failed to load image for color analysis');
      setTextColor('#2E1510');
    };
  }, [imageSrc, sampleRegion]);

  return (
    <span 
      className={className} 
      style={{ 
        color: textColor,
        transition: 'color 0.5s ease'
      }}
    >
      {children}
    </span>
  );
}
