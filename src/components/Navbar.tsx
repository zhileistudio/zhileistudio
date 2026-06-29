import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
  syncStatus: 'syncing' | 'synced' | 'local';
}

export default function Navbar({ onNavigate, activeSection, syncStatus }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'Experience' },
    { id: 'works', label: 'Works' },
    { id: 'skills', label: 'Skills' },
  ];

  const handleMobileNavigate = (id: string) => {
    setIsOpen(false);
    onNavigate(id);
  };

  return (
    <nav
      id="main-nav"
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${
        isScrolled || isOpen
          ? 'bg-black/90 backdrop-blur-md border-b border-white/5 py-4' 
          : 'bg-black/35 backdrop-blur-sm border-b border-white/5 py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative">
        {/* Logo */}
        <div 
          onClick={() => { setIsOpen(false); onNavigate('hero'); }} 
          className="cursor-pointer group flex items-center space-x-2"
        >
          <span className="font-display font-bold tracking-widest text-lg sm:text-xl text-white group-hover:text-zinc-300 transition-colors">
            LAY
          </span>
          <span className="text-white/30 text-xs sm:text-sm font-light">
            / 止泪
          </span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono tracking-wider bg-white/10 text-white/70 uppercase">
            STUDIO
          </span>
          
          {/* Cloud Sync Status Indicator */}
          {syncStatus === 'syncing' && (
            <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 text-[8px] font-mono tracking-wider bg-zinc-800 text-zinc-400 uppercase rounded">
              <span className="w-1 h-1 rounded-full bg-zinc-400 animate-pulse" />
              <span className="hidden xs:inline">SYNCING</span>
            </span>
          )}
          {syncStatus === 'synced' && (
            <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 text-[8px] font-mono tracking-wider bg-emerald-500/10 text-emerald-400 uppercase rounded">
              <span className="w-1 h-1 rounded-full bg-emerald-400" />
              <span className="hidden xs:inline">CLOUD LIVE</span>
            </span>
          )}
          {syncStatus === 'local' && (
            <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 text-[8px] font-mono tracking-wider bg-amber-500/10 text-amber-400 uppercase rounded" title="Connected to ultra-fast local backup database">
              <span className="w-1 h-1 rounded-full bg-amber-400 animate-pulse" />
              <span className="hidden xs:inline">LOCAL LIVE</span>
            </span>
          )}
        </div>

        {/* Navigation Menu (Absolutely centered horizontally) */}
        <div className="hidden md:flex items-center space-x-8 absolute left-1/2 -translate-x-1/2">
          {menuItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="relative group py-2 text-sm transition-colors text-white/60 hover:text-white flex items-center"
              >
                <span className="tracking-wide">{item.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="activeUnderline"
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-white"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-white/80 hover:text-white transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Collapsible Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-white/5 bg-black/95 backdrop-blur-lg overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col space-y-4">
              {menuItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMobileNavigate(item.id)}
                    className={`py-2 text-left text-sm font-medium tracking-wide transition-colors ${
                      isActive ? 'text-white font-semibold pl-2 border-l-2 border-white' : 'text-white/60 pl-2'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
