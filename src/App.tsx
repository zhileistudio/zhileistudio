import { useState, useEffect } from 'react';
import { defaultProjects, resumeData } from './data/defaultProjects';
import { Project } from './types';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MarqueeSection from './components/MarqueeSection';
import About from './components/About';
import Skills from './components/Skills';
import Portfolio from './components/Portfolio';
import ThankYou from './components/ThankYou';
import ClickSpark from './components/ClickSpark';
import { ArrowUp, BookOpen, Calendar, HelpCircle, MessageSquare, Terminal, CloudLightning } from 'lucide-react';
import { getProjects } from './lib/projectService';

const sanitizeProjects = (list: Project[]): Project[] => {
  return list.map(p => {
    let year = p.year;
    if (year === '2025 - 至今' || year === '2025-至今' || p.id === 'proj-1') {
      year = '2025-2026';
    }
    return { ...p, year };
  });
};

export default function App() {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('lay_portfolio_projects');
      if (saved) {
        return sanitizeProjects(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to parse saved projects:', e);
    }
    return sanitizeProjects(defaultProjects);
  });
  const [syncStatus, setSyncStatus] = useState<'syncing' | 'synced' | 'local'>('syncing');
  const [activeSection, setActiveSection] = useState('hero');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Load from Firebase Firestore on Mount with a 4-second timeout safety guard
  useEffect(() => {
    let active = true;

    // Timeout promise to guard against GFW / Firestore network hanging issues on mobile devices
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Firebase connection timed out')), 4000)
    );

    Promise.race([getProjects(), timeoutPromise])
      .then((data) => {
        if (!active) return;
        setProjects(sanitizeProjects(data));
        setSyncStatus('synced');
      })
      .catch((err) => {
        if (!active) return;
        console.warn('Using local offline backup database. Reason:', err?.message || err);
        setSyncStatus('local');
        // If we don't have projects loaded (e.g. empty storage), fallback to defaults
        if (projects.length === 0) {
          setProjects(sanitizeProjects(defaultProjects));
        }
      });

    return () => {
      active = false;
    };
  }, []);

  // Sync to LocalStorage for offline performance fallback
  useEffect(() => {
    if (projects.length > 0) {
      try {
        localStorage.setItem('lay_portfolio_projects', JSON.stringify(projects));
      } catch (error) {
        console.warn('LocalStorage limit exceeded:', error);
      }
    }
  }, [projects]);

  // Handle document scroll listeners (detect active section & show slide-to-top buttons)
  useEffect(() => {
    const handleScroll = () => {
      // 1. Scroll-to-top visibility check
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }

      // 2. Active Section Spy for Navbar Indicators
      const sections = ['hero', 'about', 'works', 'skills'];
      const scrollPosition = window.scrollY + 250; // offset for triggers

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Force document scroll back to specified anchor targets
  const handleNavigate = (sectionId: string) => {
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  // Safe database resets
  const handleResetDatabase = () => {
    setProjects(defaultProjects);
  };

  return (
    <ClickSpark
      sparkColor="#ffffff"
      sparkSize={10}
      sparkRadius={20}
      sparkCount={10}
      duration={500}
      className="bg-transparent text-zinc-100 min-h-screen flex flex-col selection:bg-white selection:text-black font-sans relative"
    >
      
      {/* 1. Header Navigation Bar */}
      <Navbar 
        onNavigate={handleNavigate} 
        activeSection={activeSection} 
        syncStatus={syncStatus}
      />

      {/* 2. Main Body Grid */}
      <main className="flex-grow">
        {/* Interactive Hero Intro Screen */}
        <Hero onExploreClick={() => handleNavigate('works')} />

        {/* Seamless, High-performance Scrolling Marquee Showcase of Websites */}
        <MarqueeSection />

        {/* Complete Personal Biography & School background */}
        <About />

        {/* Dynamic Portfolio Filtering Work Showcase (Sub-pages / details inside it) */}
        <Portfolio projects={projects} onUpdateProjects={setProjects} />

        {/* Core Competencies Specializations & Tools circular gauges */}
        <Skills />

        {/* Aesthetic High-Contrast Slide Closeout Section */}
        <ThankYou />
      </main>

      {/* 4. Elegant Minimal Footer Container */}
      <footer className="bg-black border-t border-white/5 py-12 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-6 flex justify-center items-center">
          <p className="font-semibold text-zinc-400">
            Copyright ©2022-2026 Designed by 止泪 Lay. All rights reserved.
          </p>
        </div>
      </footer>

      {/* 5. Fluid back-to-top hover utility button */}
      {showScrollTop && (
        <button
          id="scroll-to-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-zinc-950 border border-white/10 hover:border-white hover:text-white text-white/70 transition-all shadow-xl hover:scale-105 cursor-pointer"
          title="回滚到顶部"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

    </ClickSpark>
  );
}
