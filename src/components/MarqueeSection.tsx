import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

const IMAGES = [
  "https://raw.githubusercontent.com/arlynevjpg027-crypto/picx-images-hosting/master/video/2602.mp4",
  "https://raw.githubusercontent.com/arlynevjpg027-crypto/picx-images-hosting/master/video/at01.mp4",
  "https://raw.githubusercontent.com/arlynevjpg027-crypto/picx-images-hosting/master/video/lay.mp4",
  "https://raw.githubusercontent.com/arlynevjpg027-crypto/picx-images-hosting/master/video/soulcial.mp4",
  "https://raw.githubusercontent.com/arlynevjpg027-crypto/picx-images-hosting/master/video/top20.mp4",
  "https://raw.githubusercontent.com/arlynevjpg027-crypto/picx-images-hosting/master/video/top100.mp4",
  "https://raw.githubusercontent.com/arlynevjpg027-crypto/picx-images-hosting/master/video/9.9.mp4",
  "https://raw.githubusercontent.com/arlynevjpg027-crypto/picx-images-hosting/master/video/11jydb.mp4",
  "https://raw.githubusercontent.com/arlynevjpg027-crypto/picx-images-hosting/master/video/97oil.mp4",
  "https://raw.githubusercontent.com/arlynevjpg027-crypto/picx-images-hosting/master/video/600ca.mp4",
  "https://raw.githubusercontent.com/arlynevjpg027-crypto/picx-images-hosting/master/video/2511.mp4"
];

const ROW_1_IMAGES = IMAGES.slice(0, 6);
const ROW_2_IMAGES = IMAGES.slice(6);

// Tripled lists for seamless wrap around
const ROW_1_TRIPLED = [...ROW_1_IMAGES, ...ROW_1_IMAGES, ...ROW_1_IMAGES];
const ROW_2_TRIPLED = [...ROW_2_IMAGES, ...ROW_2_IMAGES, ...ROW_2_IMAGES];

interface MarqueeImageTileProps {
  url: string;
  index: number;
  row: number;
  key?: string;
}

function MarqueeImageTile({ url, index, row }: MarqueeImageTileProps) {
  const isVideo = url.toLowerCase().match(/\.(mp4|webm|ogg|mov)($|\?)/) || url.includes('video') || url.includes('/mp4');

  return (
    <motion.div
      whileHover={{ scale: 1.025, zIndex: 10 }}
      id={`marquee-tile-${row}-${index}`}
      style={{
        transform: "translateZ(0)",
        WebkitMaskImage: "-webkit-radial-gradient(white, black)",
        maskImage: "radial-gradient(white, black)"
      }}
      className="relative w-[480px] h-[270px] rounded-2xl flex-shrink-0 overflow-hidden cursor-pointer group select-none shadow-xl bg-neutral-900 transition-shadow duration-500 hover:shadow-black/60 will-change-transform"
    >
      {/* Background/Foreground image or video layer - transitions directly on hover */}
      {isVideo ? (
        <video
          src={url}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover filter grayscale opacity-80 transition-all duration-500 ease-out pointer-events-none group-hover:filter-none group-hover:opacity-100"
        />
      ) : (
        <img
          src={url}
          alt={`Preview ${row}-${index}`}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover filter grayscale opacity-80 transition-all duration-500 ease-out pointer-events-none group-hover:filter-none group-hover:opacity-100"
        />
      )}

      {/* Subtle glowing border on hover */}
      <div className="absolute inset-0 rounded-2xl border border-white/0 group-hover:border-white/10 transition-colors duration-500 pointer-events-none" />
    </motion.div>
  );
}

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      // sectionTop in coordinates relative to the top of the body
      const sectionTop = rect.top + window.scrollY;
      const currentOffset = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      setOffset(currentOffset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger initial calculation to prevent jump
    handleScroll();

    // Re-trigger calculation on window load or resize
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <section 
      id="marquee-section" 
      ref={sectionRef} 
      className="bg-transparent pt-[50px] pb-[50px] overflow-hidden w-full flex flex-col gap-3"
    >
      {/* Row 1: moves RIGHT on scroll (translateX(offset - 200)) */}
      <div 
        id="marquee-row-wrapper-1" 
        className="overflow-hidden w-full flex justify-start"
      >
        <div 
          id="marquee-row-list-1"
          className="flex flex-nowrap gap-3 -ml-[2500px]"
          style={{
            transform: `translate3d(${offset - 200}px, 0px, 0px)`,
            willChange: 'transform',
          }}
        >
          {ROW_1_TRIPLED.map((url, index) => (
            <MarqueeImageTile
              key={`row-1-img-${index}`}
              url={url}
              index={index}
              row={1}
            />
          ))}
        </div>
      </div>

      {/* Row 2: moves LEFT on scroll (translateX(-(offset - 200))) */}
      <div 
        id="marquee-row-wrapper-2" 
        className="overflow-hidden w-full flex justify-start"
      >
        <div 
          id="marquee-row-list-2"
          className="flex flex-nowrap gap-3 -ml-[2500px]"
          style={{
            transform: `translate3d(${-(offset - 200)}px, 0px, 0px)`,
            willChange: 'transform',
          }}
        >
          {ROW_2_TRIPLED.map((url, index) => (
            <MarqueeImageTile
              key={`row-2-img-${index}`}
              url={url}
              index={index}
              row={2}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
