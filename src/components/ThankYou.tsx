import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, MapPin, MessageSquare, Phone } from 'lucide-react';

interface ContactItemProps {
  label: string;
  value: string;
  href?: string;
  icon: React.ReactNode;
}

function ContactItem({ label, value, href, icon }: ContactItemProps) {
  const [copied, setCopied] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (textRef.current) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(textRef.current);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const content = (
    <div 
      className="flex items-center gap-2 text-xs sm:text-sm text-zinc-300 hover:text-white transition-colors font-medium select-all cursor-pointer relative"
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
    >
      {icon}
      <span ref={textRef} className="font-sans py-0.5">{value}</span>
      
      {/* Floating high-fidelity tooltip */}
      <AnimatePresence>
        {copied && (
          <motion.span
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: -24 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 bg-white text-black text-[10px] font-mono font-bold px-2.5 py-1 rounded shadow-lg pointer-events-none z-50 border border-zinc-200"
          >
            Copied! / 已复制
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="space-y-1.5 group select-none relative">
      <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-[#5c5c5c] block">
        {label}
      </span>
      {href ? (
        <a href={href} className="block no-underline">
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
}

export default function ThankYou() {
  return (
    <section 
      id="thank-you" 
      className="relative min-h-screen bg-[#0C0C0C] text-white flex flex-col justify-between py-20 sm:py-24 md:py-28 overflow-hidden border-t border-white/5 font-sans"
    >
      {/* Decorative ultra-fine background grid */}
      <div className="absolute inset-0 grid-bg opacity-[0.02] pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] rounded-full bg-[#D7E2EA]/[0.01] glow-orb -bottom-48 -left-48 pointer-events-none" />

      {/* Wrapping content inside standard 7xl page grid layout */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full flex-grow flex flex-col justify-between relative z-10">
        
        {/* 1. Top Header Row */}
        <div className="flex justify-between items-center w-full pb-8 border-b border-white/5">
          <span className="text-[10px] md:text-xs font-mono text-zinc-500 uppercase tracking-[0.2em] font-medium animate-pulse">
            Creative Presentation
          </span>
          <span className="text-[10px] md:text-xs font-mono text-zinc-500 uppercase tracking-[0.2em] font-medium">
            2026.
          </span>
        </div>

        {/* 2. Middle Visual Focal Point: Ultra-Large Display Heading */}
        <div className="my-auto py-16 md:py-24 text-left relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-2 md:space-y-4"
          >
            <h2 className="text-[120px] font-bold tracking-[-0.03em] leading-[0.95] text-white select-none whitespace-nowrap">
              I Can't Thank
            </h2>
            <h2 className="text-[120px] font-bold tracking-[-0.03em] leading-[0.95] text-[#ffcfcf] select-none whitespace-nowrap">
              You Enough!
            </h2>
          </motion.div>
        </div>

        {/* 3. Lower Description / Text Blocks (Double columns side-by-side) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 lg:gap-24 text-left border-t border-white/5 pt-10 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-3"
          >
            <p className="text-xs sm:text-sm text-[#5c5c5c] leading-relaxed font-light max-w-xl">
              It has been an absolute honor to showcase my selected brand identities, visual works, and digital designs here. Every layout, color match, and alignment is driven by a deep love for graphic structure. I strive to design with authentic focus, merging aesthetics and business utility into custom, pristine visual products.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-3"
          >
            <p className="text-xs sm:text-sm text-[#5c5c5c] leading-relaxed font-light max-w-xl">
              这是我用心呈现的故事，也是我对设计追求完美的诚意写照。非常荣幸能与您分享这些在视觉探索、产品质感和电商落地层面的深耕成果。我们始于感知，臻于细部，致力于将美学与商业功能完美咬合，塑造可以被真切触摸的、持久的设计价值。
            </p>
          </motion.div>
        </div>

        {/* 4. Bottom Footer Contact Metadata (4 columns) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-left border-t border-white/5 pt-8 w-full">
          <ContactItem 
            label="Email Contact" 
            value="2455871750@qq.com" 
            icon={<Mail className="w-3.5 h-3.5 text-[#5c5c5c] shrink-0 group-hover:text-white transition-colors" />} 
          />
          <ContactItem 
            label="Base Office" 
            value="Shenzhen, China" 
            icon={<MapPin className="w-3.5 h-3.5 text-[#5c5c5c] shrink-0" />} 
          />
          <ContactItem 
            label="Wechat" 
            value="iszLay_" 
            icon={<MessageSquare className="w-3.5 h-3.5 text-[#5c5c5c] shrink-0" />} 
          />
          <ContactItem 
            label="Tel" 
            value="+86 139-639-07872" 
            icon={<Phone className="w-3.5 h-3.5 text-[#5c5c5c] shrink-0" />} 
          />
        </div>
      </div>
    </section>
  );
}
