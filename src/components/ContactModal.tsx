import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { resumeData } from '../data/defaultProjects';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const { personalInfo } = resumeData;
  const wechat = personalInfo?.wechat || 'iszLay_';
  const phone = personalInfo?.phone || '139-6390-7872';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      if ((window as any).lenis) {
        (window as any).lenis.stop();
      }
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if ((window as any).lenis) {
        (window as any).lenis.start();
      }
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if ((window as any).lenis) {
        (window as any).lenis.start();
      }
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div data-lenis-prevent="true" className="fixed inset-0 z-[100] overscroll-contain flex items-center justify-center p-4">
          {/* Backdrop Blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Card content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-[360px] bg-zinc-950 border border-white/20 rounded-2xl overflow-hidden p-6 text-center shadow-2xl shadow-white/5 z-10"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white hover:border-white/10 transition-colors cursor-pointer animate-none"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Title */}
            <h3 className="text-lg font-bold text-white tracking-wide mb-1 select-none">
              微信扫描二维码
            </h3>
            <p className="text-xs text-zinc-400 mb-6 select-none">
              Scan the QR code to contact me instantly
            </p>

            {/* QR Code Container */}
            <div className="mx-auto w-48 h-48 bg-white rounded-xl p-3 flex items-center justify-center shadow-lg mb-6 relative group overflow-hidden select-none">
              <img 
                src="https://raw.githubusercontent.com/arlynevjpg027-crypto/picx-images-hosting/master/20260615/QRCODE_600X600.4n8dfxz5we.jpg" 
                className="w-full h-full object-cover rounded-lg" 
                alt="WeChat QR Code" 
                referrerPolicy="no-referrer"
              />
              {/* Subtle design styling inner glow */}
              <div className="absolute inset-0 border border-black/5 rounded-xl pointer-events-none" />
            </div>

            {/* WeChat details block info */}
            <div className="bg-zinc-900/50 rounded-xl p-3 border border-white/5 text-left text-xs space-y-2 font-mono">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-zinc-500">WeChat</span>
                <span className="text-white font-medium bg-zinc-800 px-1.5 py-0.5 rounded select-all font-mono">
                  {wechat}
                </span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-zinc-500">Tel</span>
                <span className="text-white font-medium bg-zinc-800 px-1.5 py-0.5 rounded select-all font-mono">
                  +86 {phone}
                </span>
              </div>
            </div>

            {/* Close helper status footer bar */}
            <p className="text-[10px] text-zinc-500 font-mono tracking-wide mt-4 uppercase select-none">
              * Looking forward to cooperating with you *
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;
