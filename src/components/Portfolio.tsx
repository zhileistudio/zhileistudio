import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project } from '../types';
import { 
  X, Calendar, Briefcase, Sparkles, Filter, ExternalLink, 
  ImagePlus, UploadCloud, Trash2, Plus, Check, Info, ArrowUpRight, Lock, Loader2 
} from 'lucide-react';
import { saveProject } from '../lib/projectService';
import SpotlightCard from './SpotlightCard';
import ScrollStack, { ScrollStackItem } from './ScrollStack';

interface StackingCardProps {
  key?: string | number;
  project: Project;
  index: number;
  totalCards: number;
  onClick: () => void;
}

function StackingCard({ project, index, totalCards, onClick }: StackingCardProps) {
  const tabPositions = [
    'left-[4%]',
    'left-[23%]',
    'left-[42%]',
    'left-[61%]',
    'left-[80%]',
  ];

  return (
    <div 
      className="relative w-full flex items-start justify-center pt-14 md:pt-16 px-0"
    >
      <div
        onClick={onClick}
        className="w-full rounded-[30px] sm:rounded-[40px] md:rounded-[50px] border border-white/12 bg-[#121212] p-0 flex flex-col md:flex-row h-auto md:h-[65vh] lg:h-[62vh] cursor-pointer overflow-visible relative group/card shadow-2xl transition-all hover:border-white/25"
      >
        {/* Tab Header representing Folder index tab with high-fidelity curved folder shoulders */}
        <div className={`absolute top-[-36px] h-[37px] rounded-t-xl bg-[#121212] border-t border-x border-white/10 px-4 sm:px-8 flex items-center justify-center text-[10px] sm:text-xs font-mono font-bold tracking-widest text-zinc-400 gap-1.5 group-hover/card:border-white/20 transition-all ${tabPositions[index]}`}>
          {/* Left concave corner curve */}
          <svg className="absolute bottom-0 -left-4 w-4 h-4 text-[#121212] pointer-events-none" viewBox="0 0 16 16" fill="currentColor">
            <path d="M16 16H0C4 16 8 12 12 8C14 4 16 0 16 0V16Z" />
            <path d="M0 16C4 16 8 12 12 8C14 4 16 0 16 0" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none" />
          </svg>

          <span className="hidden sm:inline text-zinc-500">PROGRAM</span>
          <span className="text-white">0{index + 1}</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover/card:text-white transition-colors" />

          {/* Right concave corner curve */}
          <svg className="absolute bottom-0 -right-4 w-4 h-4 text-[#121212] pointer-events-none" viewBox="0 0 16 16" fill="currentColor">
            <path d="M0 16H16C12 16 8 12 4 8C2 4 0 0 0 0V16Z" />
            <path d="M16 16C12 16 8 12 4 8C2 4 0 0 0 0" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none" />
          </svg>

          {/* Overlap block to seamlessly merge tab into main card top edge */}
          <div className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-[#121212]" />
        </div>

        {/* Decorative inner ambient glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.01] via-transparent to-transparent pointer-events-none rounded-[30px] sm:rounded-[40px] md:rounded-[50px]" />

        {/* Informative Content Block - aligned fully left, top and bottom */}
        <div className="w-full md:w-1/2 flex flex-col justify-between h-auto md:h-full text-left font-sans relative z-10 p-6 py-8 sm:p-10 sm:py-10 md:p-0 md:py-12 md:pl-12 md:pr-6 lg:py-16 lg:pl-16 lg:pr-8 xl:py-20 xl:pl-20 xl:pr-10">
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="px-3 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest bg-white/5 text-[#D7E2EA] border border-white/10 rounded-full">
                {project.categoryLabel}
              </span>
              <span className="text-xs font-mono text-zinc-500">
                {project.year}
              </span>
            </div>

            {/* Typography paired Title and Tagline */}
            <div className="flex items-start gap-4 mb-6 border-b border-white/5 pb-6">
              <span style={{ fontFamily: 'Inter' }} className="font-sans font-black text-5xl sm:text-6xl md:text-7xl text-white/15 leading-none select-none tracking-tighter">
                0{index + 1}
              </span>
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl md:text-2xl font-display font-extrabold text-white tracking-tight leading-tight group-hover/card:text-white transition-colors select-none whitespace-pre-line">
                  {project.title}
                </h3>
              </div>
            </div>

            {/* Staggered Circular Outline Indicators list mapped from tools - exactly as the reference catalogs */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-6">
              {project.tools?.map((tool, tIdx) => (
                <span key={tIdx} className="flex items-center gap-1.5 text-xs sm:text-sm text-[#5c5c5c] font-medium hover:text-white transition-colors">
                  <span className="w-2 h-2 rounded-full border-2 border-white/30" />
                  <span>{tool}</span>
                </span>
              ))}
            </div>

             <p className="text-xs sm:text-sm text-[#aeaeae] leading-relaxed font-light line-clamp-3 md:line-clamp-4 max-w-lg select-none">
              {project.description}
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/5 flex flex-row items-center justify-between gap-4 w-full">
            <div className="flex flex-col text-left items-start">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">CLIENT / 合作客户</span>
              <span className="text-xs font-semibold text-zinc-300 line-clamp-1 select-none mt-0.5 text-left">{project.client}</span>
            </div>
            
            <div className="flex items-center gap-1.5 text-xs text-white/90 font-medium group-hover/card:text-white transition-colors shrink-0" style={{ lineHeight: '27px' }}>
              <span className="text-[15px] font-bold">点击查看更多相关作品</span>
              <ArrowUpRight className="w-4 h-4 transform group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 transition-transform text-white/50" />
            </div>
          </div>
        </div>

        {/* Exquisite Device / Image frame on Right column - aligned fully right, top, and bottom with custom folder roundings */}
        <div className="w-full md:w-1/2 h-72 sm:h-96 md:h-full shrink-0 flex p-6 pt-0 pb-8 sm:p-10 sm:pt-0 sm:pb-10 md:p-0 md:py-12 md:pl-6 md:pr-12 lg:py-16 lg:pl-8 lg:pr-16 xl:py-20 xl:pl-10 xl:pr-20">
          <div className="w-full h-full rounded-[20px] sm:rounded-[24px] md:rounded-[32px] overflow-hidden relative group/img border border-white/12 bg-zinc-950 shadow-2xl">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/img:scale-103"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80 group-hover/img:opacity-40 transition-opacity" />
            
            {/* Accent high-fidelity tag */}
            <div className="absolute top-5 right-5 bg-[#0C0C0C]/90 backdrop-blur text-[10px] font-mono tracking-widest px-4 py-1.5 rounded-full border border-white/10 text-white uppercase shadow-lg select-none">
              CASE 0{index + 1}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface PortfolioProps {
  projects: Project[];
  onUpdateProjects?: React.Dispatch<React.SetStateAction<Project[]>>;
}

export default function Portfolio({ projects, onUpdateProjects }: PortfolioProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'brand' | 'ecommerce' | 'poster' | 'typography'>('all');
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(() => {
    return localStorage.getItem('lay_portfolio_auth') === 'true';
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  const handleToggleEdit = (targetValue: boolean) => {
    if (targetValue) {
      if (isAuthorized) {
        setIsEditing(true);
      } else {
        setShowAuthModal(true);
        setPasswordInput('');
        setAuthError('');
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '123456') {
      setIsAuthorized(true);
      localStorage.setItem('lay_portfolio_auth', 'true');
      setShowAuthModal(false);
      setIsEditing(true);
      setAuthError('');
    } else {
      setAuthError('密码错误，请重新输入');
    }
  };

  const [inputUrl, setInputUrl] = useState('');
  const [extraInputUrl, setExtraInputUrl] = useState('');
  const [isDragging, setIsDragging] = useState<'cover' | 'extra' | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const extraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeProject) {
        setActiveProject(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    if (activeProject) {
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
  }, [activeProject]);

  const categories = [
    { id: 'all', label: '全部项目' },
    { id: 'brand', label: '品牌设计' },
    { id: 'ecommerce', label: '电商设计' },
    { id: 'poster', label: '视觉海报' },
    { id: 'typography', label: '字体设计' },
  ];

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  const handleUpdateCurrentProject = async (updatedFields: Partial<Project>) => {
    if (!activeProject) return;
    
    // Merge updates safely
    const currentDetails = activeProject.details || {};
    const newDetails = updatedFields.details 
      ? { ...currentDetails, ...updatedFields.details }
      : currentDetails;

    const updated: Project = {
      ...activeProject,
      ...updatedFields,
      details: newDetails
    };
    
    setActiveProject(updated);

    if (onUpdateProjects) {
      onUpdateProjects(prev => prev.map(p => p.id === activeProject.id ? updated : p));
    }

    try {
      await saveProject(updated);
    } catch (e) {
      console.error("Failed to save project updates to Firestore:", e);
    }
  };

  const processFile = async (file: File, type: 'cover' | 'extra') => {
    if (!file.type.startsWith('image/')) return;
    setIsUploading(true);
    try {
      // 1. Perform high-performance client-side image compression
      const compressedBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // Restrict maximum dimension to 1000px to ensure the image is lightweight (~50-80KB) and fits easily in Firestore's 1MB document limit
            const maxDim = 1000;
            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              // Use highly-efficient JPEG encoding at 0.75 quality for beautiful web rendering at low bytes
              const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
              resolve(dataUrl);
            } else {
              resolve(event.target?.result as string);
            }
          };
          img.onerror = () => reject(new Error("Image loading failed"));
          img.src = event.target?.result as string;
        };
        reader.onerror = () => reject(new Error("File reading failed"));
        reader.readAsDataURL(file);
      });

      // 2. Synchronize to Firestore Cloud DB instantly
      if (type === 'cover') {
        await handleUpdateCurrentProject({ imageUrl: compressedBase64 });
      } else {
        const currentExtras = activeProject?.details?.extraImages || [];
        await handleUpdateCurrentProject({
          details: {
            ...activeProject?.details,
            extraImages: [...currentExtras, compressedBase64]
          }
        });
      }
    } catch (error) {
      console.error("Image processing or Cloud DB sync failed:", error);
      alert("图片处理或同步云端失败，请检查网络后再试。");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'extra') => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file, type);
    }
  };

  const handleDragOver = (e: React.DragEvent, type: 'cover' | 'extra') => {
    e.preventDefault();
    setIsDragging(type);
  };

  const handleDragLeave = () => {
    setIsDragging(null);
  };

  const handleDrop = (e: React.DragEvent, type: 'cover' | 'extra') => {
    e.preventDefault();
    setIsDragging(null);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file, type);
    }
  };

  const handleAddUrl = async (type: 'cover' | 'extra') => {
    if (type === 'cover') {
      if (!inputUrl.trim()) return;
      await handleUpdateCurrentProject({ imageUrl: inputUrl.trim() });
      setInputUrl('');
    } else {
      if (!extraInputUrl.trim()) return;
      const currentExtras = activeProject?.details?.extraImages || [];
      await handleUpdateCurrentProject({
        details: {
          ...activeProject?.details,
          extraImages: [...currentExtras, extraInputUrl.trim()]
        }
      });
      setExtraInputUrl('');
    }
  };

  const handleRemoveExtraImage = (indexToRemove: number) => {
    const currentExtras = activeProject?.details?.extraImages || [];
    const updatedExtras = currentExtras.filter((_, idx) => idx !== indexToRemove);
    handleUpdateCurrentProject({
      details: {
        ...activeProject?.details,
        extraImages: updatedExtras
      }
    });
  };

  return (
    <>
      <section id="works" className="relative pt-28 pb-0 bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 z-10 overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 grid-bg opacity-[0.03] pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-white/[0.01] glow-orb top-20 left-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header designed same as Professional Journey, left-aligned */}
        <div className="mb-12 text-left">
          <span className="text-zinc-500 text-xs font-mono tracking-widest uppercase block mb-2 select-none">
            production line of works
          </span>
          <h3 className="text-5xl sm:text-6xl md:text-[72px] leading-none sm:leading-[72px] font-black font-sans text-white tracking-tight select-none">
            Experience<br />Showcase.
          </h3>
        </div>
      </div>

      {/* 5 Interactive-Stacking Project Cards Container using ScrollStack with consistent blank space on both sides */}
      <div className="relative pb-0 w-full max-w-7xl mx-auto px-6 z-10">
        <ScrollStack
          useWindowScroll={true}
          itemDistance={100}
          itemScale={0}
          itemStackDistance={45}
          baseScale={1}
          stackPosition="15%"
          scaleEndPosition="8%"
        >
          {projects.slice(0, 5).map((project, idx) => (
            <ScrollStackItem key={project.id}>
              <StackingCard
                project={project}
                index={idx}
                totalCards={Math.min(projects.length, 5)}
                onClick={() => {
                  setActiveProject(project);
                  setIsEditing(false); // Reset to display mode when opening
                }}
              />
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {projects.length === 0 && (
          <div className="py-24 text-center">
            <span className="text-zinc-500 text-sm font-mono tracking-widest uppercase">
              NO PORTFOLIO WORKS FOUND IN THIS TAB
            </span>
          </div>
        )}
      </div>
    </section>

    {/* Case Study Full-Screen Interactive Detail Modal (二级页面) */}
    <AnimatePresence>
      {activeProject && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setActiveProject(null)}
          data-lenis-prevent="true"
          className="fixed inset-0 z-[999] overflow-y-auto overscroll-contain bg-black/95 backdrop-blur-md flex justify-center py-10 px-4 sm:px-6 md:px-10"
        >
            {/* Modal Content container */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 35, scale: 0.98 }}
              transition={{ duration: 0.5, cubicBezier: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-6xl bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden self-start"
            >
              
              {/* Floating Exit Button */}
              <button
                id="close-modal-btn"
                onClick={() => setActiveProject(null)}
                className="absolute top-6 right-6 z-10 p-2.5 rounded-full bg-black/70 hover:bg-zinc-900 text-white/70 hover:text-white border border-white/10 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Cover Showcase Banner */}
              <div className="relative aspect-[16/9] w-full bg-zinc-900 border-b border-white/5">
                <img
                  src={activeProject.imageUrl}
                  alt={activeProject.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black/35 pointer-events-none" />
                
                {/* Meta details overlay on banner */}
                <div className="absolute bottom-6 left-6 right-6 text-left">
                  <span className="px-2.5 py-1 bg-zinc-800 text-white font-mono font-bold text-[9px] tracking-widest uppercase rounded border border-white/5">
                    {activeProject.categoryLabel}
                  </span>
                  <h3 className="text-xl sm:text-3xl font-extrabold text-white mt-3 leading-tight font-display whitespace-pre-line">
                    {activeProject.title}
                  </h3>
                </div>

                {/* Edit Shortcut Overlay Badge */}
                <div className="absolute top-6 left-6">
                  <button
                    onClick={() => handleToggleEdit(!isEditing)}
                    className="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 bg-black/70 backdrop-blur border border-white/20 hover:border-white text-white hover:text-white shadow-lg"
                  >
                    <ImagePlus className="w-3.5 h-3.5" />
                    {isEditing ? '返回作品阅读 Mode' : '修改封面高精图/上传作品集'}
                  </button>
                </div>
              </div>

              {/* Toggleable view: Display Details Mode vs Editing Suite Mode */}
              {!isEditing ? (
                <>
                  {/* Body Content grids */}
                  <div className="p-6 sm:p-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    
                    {/* Left side details sidebar (1 column) */}
                    <div className="md:col-span-1 space-y-6 border-b md:border-b-0 md:border-r border-white/5 pb-6 md:pb-0 md:pr-8">
                      {activeProject.client && (
                        <div>
                          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block mb-1">合作客户 / Client</span>
                          <p className="text-sm font-semibold text-white/90 flex items-center">
                            <Briefcase className="w-3.5 h-3.5 mr-2 text-zinc-600 shrink-0" />
                            {activeProject.client}
                          </p>
                        </div>
                      )}

                      <div>
                        <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block mb-1">设计时间 / Period</span>
                        <p className="text-sm font-semibold text-white/90 flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-2 text-zinc-600 shrink-0" />
                          {activeProject.year}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block mb-2">应用工具 / Software</span>
                        <div className="flex flex-wrap gap-1.5">
                          {['Photoshop', 'Illustrator', 'AIGC(即梦/Chatgpt)', '视觉创意', '电商详情', '物料落地'].map((t) => (
                            <span key={t} className="px-2 py-0.5 rounded bg-zinc-900 border border-white/5 text-zinc-400 font-mono text-[9px] uppercase tracking-wider">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right side case description paragraphs (2 columns) */}
                    <div className="md:col-span-2 space-y-6">
                      <div>
                        <span className="inline-flex items-center px-2.5 py-1 bg-zinc-800 text-white font-mono font-bold text-[9px] tracking-widest uppercase rounded border border-white/5 mb-3">
                          <Sparkles className="w-3 h-3 mr-1.5 text-zinc-400" />
                          项目简介 / Overview
                        </span>
                        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-light">
                          {activeProject.description}
                        </p>
                      </div>

                      {/* Fully detailed Case Studies paragraphs */}
                      {activeProject.details && (
                        <div className="border-t border-white/5 pt-6 space-y-5">
                          {activeProject.details.challenge && (
                            <div>
                              <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-1.5">
                                【 痛点与挑战 / Challenge 】
                              </h4>
                              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
                                {activeProject.details.challenge}
                              </p>
                            </div>
                          )}

                          {activeProject.details.result && (
                            <div className="bg-zinc-900 p-4 rounded-xl border border-white/5 mt-4">
                              <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-1.5">
                                【 商业成效 / Result 】
                              </h4>
                              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
                                {activeProject.id === 'proj-3' ? '独立搭建整个SOUL-CIAL视觉体系，在全球独立站与社媒(INS/TikTok/Fackbook)引发晒单狂潮，受到众多潮流KOL的主动开箱安利。' : activeProject.details.result}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Portfolio Gallery / Showcase Details (二级页面高精大图展示) */}
                  <div className="border-t border-white/5 py-12 px-6 sm:px-10 bg-zinc-950">
                    <div className="max-w-5xl mx-auto space-y-8">
                      <div className="flex justify-between items-center border-b border-white/5 pb-4">
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
                          <Sparkles className="w-4 h-4 mr-2 text-zinc-400" />
                          作品详情页排版 / PROJECT DETAILED WORKS
                        </h4>
                        <span className="text-xs font-mono text-zinc-500">
                          {activeProject.details?.extraImages?.length || 0} 张高精展示图
                        </span>
                      </div>

                      {activeProject.details?.extraImages && activeProject.details.extraImages.length > 0 ? (
                        <div className="flex flex-col gap-8">
                          {activeProject.details.extraImages.map((img, idx) => (
                            <div key={idx} className="relative group rounded-xl overflow-hidden border border-white/10 bg-zinc-900/40">
                              <img
                                src={img}
                                alt={`Detail ${idx + 1}`}
                                referrerPolicy="no-referrer"
                                className="w-full h-auto object-contain"
                                loading="lazy"
                              />
                              <div className="absolute top-4 right-4 bg-black/70 backdrop-blur text-xs px-2.5 py-1 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                                No.{idx + 1} | HD 展示
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-16 text-center border border-dashed border-white/5 rounded-2xl bg-zinc-900/20 px-8">
                          <p className="text-sm text-zinc-400 mb-4 select-none">
                            当前二级页面暂无附加作品集底片或设计详图。
                          </p>
                          <button
                            onClick={() => handleToggleEdit(true)}
                            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white rounded text-xs transition-all tracking-wide flex items-center gap-1.5 mx-auto"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            立即上传上传您的首张高精切图页
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                /* Editing Workspace Suite with precise Size Guides & Guidelines */
                <div className="p-6 sm:p-10 text-left space-y-10 bg-zinc-950">
                  <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-white/10 gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <ImagePlus className="w-5 h-5 text-zinc-400 animate-pulse" />
                        作品集封面/详情多媒体管理中心
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1">
                        实时更新项目视觉，支持本地直接拖拽上传图片或直接黏贴网页高清连接，云端立刻渲染并缓存。
                      </p>
                    </div>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-white text-black font-semibold text-xs rounded-full hover:bg-zinc-200 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      保存并返回预览
                    </button>
                  </div>

                  {/* Uploading indicator overlay */}
                  {isUploading && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-center gap-3 text-white">
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                      <span className="text-xs font-mono font-medium tracking-wider">UPLOADING IMAGE TO FIREBASE STORAGE... 正在安全传输高精大图，并更新云端数据库</span>
                    </div>
                  )}

                  {/* Text Content Editor (修改文本内容) */}
                  <div className="space-y-4 pt-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                      【 文本内容更新 / Update Text Content 】
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-900/40 p-6 rounded-xl border border-white/5">
                      {/* Title */}
                      <div className="space-y-1.5 col-span-2">
                        <label className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase block">作品标题 / Title (换行可用\n表示)</label>
                        <input
                          type="text"
                          value={activeProject.title}
                          onChange={(e) => handleUpdateCurrentProject({ title: e.target.value })}
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white font-sans transition-all"
                        />
                      </div>

                      {/* Tagline */}
                      <div className="space-y-1.5 col-span-2">
                        <label className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase block">核心卖点与宣传语 / Tagline</label>
                        <input
                          type="text"
                          value={activeProject.tagline}
                          onChange={(e) => handleUpdateCurrentProject({ tagline: e.target.value })}
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white font-sans transition-all"
                        />
                      </div>

                      {/* Client */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase block">合作客户 / Client</label>
                        <input
                          type="text"
                          value={activeProject.client || ''}
                          onChange={(e) => handleUpdateCurrentProject({ client: e.target.value })}
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white font-sans transition-all"
                        />
                      </div>

                      {/* Period / Year */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase block">设计时间 / Period</label>
                        <input
                          type="text"
                          value={activeProject.year}
                          onChange={(e) => handleUpdateCurrentProject({ year: e.target.value })}
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white font-sans transition-all"
                        />
                      </div>

                      {/* Project Category */}
                      <div className="space-y-1.5 col-span-2">
                        <label className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase block">作品类型 / Category</label>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {[
                            { id: 'ecommerce', label: '电商设计' },
                            { id: 'brand', label: '品牌设计' },
                            { id: 'poster', label: '视觉海报' },
                            { id: 'typography', label: '字体设计' },
                          ].map((cat) => (
                            <button
                              key={cat.id}
                              onClick={() => handleUpdateCurrentProject({ 
                                category: cat.id as any,
                                categoryLabel: cat.label 
                              })}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                                activeProject.category === cat.id 
                                  ? 'bg-white text-black border-white' 
                                  : 'bg-black/50 text-zinc-400 border-white/10 hover:border-white/30'
                              }`}
                            >
                              {cat.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Description */}
                      <div className="space-y-1.5 col-span-2">
                        <label className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase block">详细描述 / Description</label>
                        <textarea
                          rows={3}
                          value={activeProject.description}
                          onChange={(e) => handleUpdateCurrentProject({ description: e.target.value })}
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white font-sans transition-all resize-none"
                        />
                      </div>

                      {/* Challenge */}
                      <div className="space-y-1.5 col-span-2">
                        <label className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase block">痛点与挑战 / Challenge</label>
                        <textarea
                          rows={2}
                          value={activeProject.details?.challenge || ''}
                          onChange={(e) => handleUpdateCurrentProject({ 
                            details: { ...activeProject.details, challenge: e.target.value } 
                          })}
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white font-sans transition-all resize-none"
                        />
                      </div>

                      {/* Concept */}
                      <div className="space-y-1.5 col-span-2">
                        <label className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase block">创意概念 / Concept</label>
                        <textarea
                          rows={2}
                          value={activeProject.details?.concept || ''}
                          onChange={(e) => handleUpdateCurrentProject({ 
                            details: { ...activeProject.details, concept: e.target.value } 
                          })}
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white font-sans transition-all resize-none"
                        />
                      </div>

                      {/* Result */}
                      <div className="space-y-1.5 col-span-2">
                        <label className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase block">商业成效 / Result</label>
                        <textarea
                          rows={2}
                          value={activeProject.details?.result || ''}
                          onChange={(e) => handleUpdateCurrentProject({ 
                            details: { ...activeProject.details, result: e.target.value } 
                          })}
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white font-sans transition-all resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 1. Size Guidelines Alert Card (尺寸规范和核心要求) */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-zinc-900/40 p-6 rounded-2xl border border-white/10">
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold font-mono tracking-wider text-zinc-300 uppercase flex items-center gap-1.5 border-b border-white/5 pb-2">
                        <Info className="w-3.5 h-3.5 text-zinc-400" />
                        1️⃣ 作品案例集封面图 (Card Cover)
                      </h4>
                      <ul className="text-[11px] text-zinc-400 space-y-1.5 pl-1 font-sans leading-relaxed">
                        <li>• <strong className="text-white">推荐分辨率：</strong>1200 × 900 像素 (4:3 比例)。</li>
                        <li>• <strong className="text-white">裁剪安全：</strong>外层卡片使用 4:3 容器展现，主体焦点务必保持在<span className="text-white">正中心 80% 安全区</span>内，防止边缘溢出被裁。</li>
                        <li>• <strong className="text-white">文件要求：</strong>推荐使用 WebP 格式保证页面秒开。</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold font-mono tracking-wider text-zinc-300 uppercase flex items-center gap-1.5 border-b border-white/5 pb-2">
                        <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
                        2️⃣ 卡片内头图 Banner (Inner Banner)
                      </h4>
                      <ul className="text-[11px] text-zinc-400 space-y-1.5 pl-1 font-sans leading-relaxed">
                        <li>• <strong className="text-white">推荐分辨率：</strong>1920 × 640 像素 (3:1 展卷宽高比)。</li>
                        <li>• <strong className="text-white">设计建议：</strong>用于进入二级作品详情时的顶部宽幅大 Banner，建议选取视觉冲击感强的全景图或合成视觉。</li>
                        <li>• <strong className="text-white">主体构图：</strong>焦点尽量偏中心略微靠下。</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold font-mono tracking-wider text-zinc-300 uppercase flex items-center gap-1.5 border-b border-white/5 pb-2">
                        <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                        3️⃣ 二级详情作品集长图 (Extra Sheets)
                      </h4>
                      <ul className="text-[11px] text-zinc-400 space-y-1.5 pl-1 font-sans leading-relaxed">
                        <li>• <strong className="text-white">推荐宽度：</strong>固定为 1200 像素 至 1600 像素。</li>
                        <li>• <strong className="text-white">高度规范：</strong><span className="text-white">高度不限，自适应纵向流延伸</span>。适合垂直无限长图或全案多页无缝拼版。</li>
                        <li>• <strong className="text-white">色彩管理：</strong>印刷品包装设计等推荐使用标准 sRGB 色域。</li>
                      </ul>
                    </div>
                  </div>

                  {/* 2. Interactive Cover Upload Panel (编辑主封面) */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      【 第一步：更新主封面图片 / Update Cover Image 】
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                      {/* Left: Drag Drop Area */}
                      <div 
                        onDragOver={(e) => handleDragOver(e, 'cover')}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, 'cover')}
                        className={`md:col-span-2 border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center transition-all ${
                          isDragging === 'cover' 
                            ? 'border-white bg-white/5 scale-[0.99]' 
                            : 'border-white/10 bg-zinc-950 hover:border-white/20'
                        }`}
                      >
                        <UploadCloud className="w-10 h-10 text-zinc-500 mb-3" />
                        <p className="text-xs text-zinc-400 font-medium mb-1">
                          拖拽您的新封面图片到此处，或点击本地上传
                        </p>
                        <p className="text-[10px] text-zinc-500 mb-4">
                          支持 JPG, PNG, WEBP, GIF | 最佳尺寸 1200x900px
                        </p>
                        
                        <input 
                          type="file" 
                          ref={coverInputRef}
                          onChange={(e) => handleFileChange(e, 'cover')}
                          className="hidden" 
                          accept="image/*"
                        />
                        <button
                          onClick={() => coverInputRef.current?.click()}
                          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-white/15 text-white text-xs rounded transition-all cursor-pointer"
                        >
                          选择本地图片
                        </button>
                      </div>

                      {/* Right: URL Input & Mini Preview */}
                      <div className="bg-zinc-900 border border-white/5 p-4 rounded-xl flex flex-col justify-between h-full space-y-4">
                        <div>
                          <label className="text-[10px] text-zinc-400 block mb-2 font-mono">或者直接填写网络高清图片连接：</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={inputUrl}
                              onChange={(e) => setInputUrl(e.target.value)}
                              placeholder="https://images.unsplash.com/..."
                              className="bg-black border border-white/10 rounded px-2.5 py-1.5 text-xs text-white flex-1 focus:outline-none focus:border-white text-ellipsis"
                            />
                            <button
                              onClick={() => handleAddUrl('cover')}
                              className="bg-white hover:bg-zinc-200 text-black font-semibold text-xs px-3 rounded transition-colors cursor-pointer"
                            >
                              载入
                            </button>
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] text-zinc-500 block mb-1">当前主图缩略及长图比例预览：</span>
                          <div className="aspect-[4/3] w-full rounded border border-white/10 overflow-hidden bg-zinc-950 relative">
                            <img 
                              src={activeProject.imageUrl} 
                              alt="Cover Preview" 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-x-0 bottom-0 py-1 bg-black/80 border-t border-white/5 select-none text-[8px] text-zinc-400 text-center font-mono uppercase tracking-wider">
                              裁剪显示 4:3 视窗效果
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. Interactive Gallery uploads (上传详情页作品集) */}
                  <div className="space-y-4 pt-6 border-t border-white/5">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      【 第二步：上传二级详情作品集长图 / Upload Portfolio Sheets 】
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                      {/* Dropzone for extra details */}
                      <div 
                        onDragOver={(e) => handleDragOver(e, 'extra')}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, 'extra')}
                        className={`md:col-span-2 border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center transition-all ${
                          isDragging === 'extra' 
                            ? 'border-white bg-white/5 scale-[0.99]' 
                            : 'border-white/10 bg-zinc-950 hover:border-white/20'
                        }`}
                      >
                        <ImagePlus className="w-10 h-10 text-zinc-500 mb-3" />
                        <p className="text-xs text-zinc-400 font-medium mb-1">
                          拖拽高清电商详情、大长图、包装展开原画等素材至此追加
                        </p>
                        <p className="text-[10px] text-zinc-500 mb-4">
                          支持多页面连续上传 | 黄金宽度 1200 ~ 1600px | 高度不限
                        </p>
                        
                        <input 
                          type="file" 
                          ref={extraInputRef}
                          onChange={(e) => handleFileChange(e, 'extra')}
                          className="hidden" 
                          accept="image/*"
                        />
                        <button
                          onClick={() => extraInputRef.current?.click()}
                          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-white/15 text-white text-xs rounded transition-all cursor-pointer"
                        >
                          选择并载入首幅
                        </button>
                      </div>

                      {/* Paste detail image link */}
                      <div className="bg-zinc-900 border border-white/5 p-4 rounded-xl space-y-4">
                        <div>
                          <label className="text-[10px] text-zinc-400 block mb-2 font-mono">黏贴长网页图片连接手动追加：</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={extraInputUrl}
                              onChange={(e) => setExtraInputUrl(e.target.value)}
                              placeholder="https://..."
                              className="bg-black border border-white/10 rounded px-2.5 py-1.5 text-xs text-white flex-1 focus:outline-none focus:border-white select-all text-ellipsis"
                            />
                            <button
                              onClick={() => handleAddUrl('extra')}
                              className="bg-zinc-800 hover:bg-zinc-700 hover:text-white border border-white/10 text-zinc-400 font-semibold text-xs px-3 rounded transition-colors cursor-pointer animate-pulse"
                            >
                              追加
                            </button>
                          </div>
                        </div>

                        <div className="bg-zinc-950 border border-white/5 p-3 rounded text-[11px] text-zinc-400 space-y-1">
                          <p className="font-semibold text-zinc-400">💡 提示 (Designer Advice):</p>
                          <p>您可以自由上传多张大图，项目会以高端的纵向折展方式流畅地排布、渲染在二级展示抽屉里。</p>
                        </div>
                      </div>
                    </div>

                    {/* Previews / Delete Panel */}
                    <div className="space-y-4 mt-6">
                      <span className="text-[10px] text-zinc-400 font-mono block">管理当前项目已挂载的作品（共计 {activeProject.details?.extraImages?.length || 0} 个切片）：</span>
                      
                      {activeProject.details?.extraImages && activeProject.details.extraImages.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {activeProject.details.extraImages.map((img, idx) => (
                            <div key={idx} className="relative group aspect-[3/4] rounded-lg border border-white/10 bg-zinc-900 overflow-hidden">
                              <img 
                                src={img} 
                                alt="Detail Preview" 
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                  onClick={() => handleRemoveExtraImage(idx)}
                                  className="p-2 bg-red-600/90 rounded-full hover:bg-red-700 text-white hover:scale-105 transition-transform shadow-lg cursor-pointer"
                                  title="移出此张详情页"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <span className="absolute bottom-2 left-2 bg-black/75 px-1.5 py-0.5 rounded text-[9px] font-mono border border-white/5 select-none">
                                #{idx + 1}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-8 text-center text-xs text-zinc-600 select-none border border-zinc-900 rounded-xl">
                          （暂没有额外的作品大图归档）
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom footer button bar */}
              <div className="bg-zinc-900/30 border-t border-white/5 py-4 px-6 sm:px-10 flex justify-between items-center text-xs gap-4">
                <span className="text-zinc-500 font-mono hidden sm:inline">Copyright @2022-2026 Designed by  止泪 Lay.</span>
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => handleToggleEdit(!isEditing)}
                    className="px-4 py-2 bg-zinc-900 border border-white/10 text-white rounded text-xs transition-all tracking-wide hover:bg-zinc-800 flex items-center gap-1.5"
                  >
                    <ImagePlus className="w-3.5 h-3.5 text-zinc-400" />
                    {isEditing ? '回到作品阅读 Mode' : '管理素材 & 上传文件'}
                  </button>
                  <button 
                    onClick={() => setActiveProject(null)}
                    className="px-4 py-2 bg-white text-black font-bold border border-white rounded text-xs hover:bg-zinc-200 transition-colors"
                  >
                    关闭详情页
                  </button>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔐 Admin Passcode Lock Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-[380px] bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400">
                  <Lock className="w-5 h-5" />
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white tracking-wide">请输入独立密码锁</h4>
                  <p className="text-[11px] text-zinc-400">管理后台仅限设计师本人更新与维护素材</p>
                </div>

                <form onSubmit={handleAuthSubmit} className="w-full space-y-3 pt-2">
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="输入 6 位数独立锁密码..."
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 hover:border-white/20 focus:border-white text-white rounded-lg px-3 py-2 text-xs text-center font-mono tracking-widest focus:outline-none transition-all"
                      autoFocus
                    />
                  </div>

                  {authError && (
                    <p className="text-[10px] text-red-500 font-medium font-sans animate-bounce">{authError}</p>
                  )}

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAuthModal(false)}
                      className="flex-1 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 border border-white/5 rounded-lg text-white/70 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-3 py-2 bg-white hover:bg-zinc-200 text-black rounded-lg text-xs font-bold transition-all cursor-pointer"
                    >
                      解锁进入
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
