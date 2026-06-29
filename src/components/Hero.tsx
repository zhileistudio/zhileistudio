import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, animate } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import { resumeData } from '../data/defaultProjects';
import VariableProximity from './VariableProximity';
import DotGridBackground from './DotGridBackground';
import TextPressure from './TextPressure';
import GlareHover from './GlareHover';
import ContactModal from './ContactModal';

interface HeroProps {
  onExploreClick: () => void;
}

// Exquisite hand-crafted monogram logomark representing the signature visual curves in Figure 1
function BrandMonogramLogo({ className = "text-[#ffb9b9]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.path 
        d="M 32 38 C 42 34, 48 44, 40 50 C 30 57, 28 62, 42 66 C 47 67, 51 64, 50 58 C 47 50, 52 32, 60 28 C 68 23, 74 32, 67 44 C 61 54, 52 64, 47 74 C 42 84, 30 84, 28 74 C 26 64, 38 54, 46 46 M 49 52 C 55 48, 66 44, 76 44 C 86 44, 88 52, 76 56 C 64 60, 52 54, 46 46"
        stroke="currentColor" 
        strokeWidth="6.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="none" 
      />
    </svg>
  );
}

function getPathString(offsetX: number, xVal: number, yVal: number, offVal: number) {
  const x0 = 160 + offsetX;
  const y0 = offVal;
  const x2 = 160 + xVal + offsetX;
  const y2 = 351 + yVal;
  
  const dx = x2 - x0;
  const dy = y2 - y0;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const restLen = 351 - offVal;
  
  // Calculate tension and slack for ultra-soft, cloth-like draping physics
  const isStretched = dist > restLen;
  const stretchAmount = isStretched ? dist - restLen : 0;
  
  // High-fidelity cloth drape sag when relaxed (substantial, loose, soft hanging weight,布感拉满)
  const slack = isStretched ? 0 : restLen - dist;
  const sag = slack * 2.3;
  
  // Cloth gets tighter under pulling force, but has slight lateral flex/bellying
  const tensionRigidity = 1 / (1 + stretchAmount * 0.04);
  const lateralFlex = (xVal * -0.42) * tensionRigidity;
  
  // Distinct secondary curving representing custom material soft-body bends
  const cx1 = x0 + dx * 0.25 + lateralFlex * 0.55;
  const cy1 = y0 + dy * 0.35 + sag * 0.6;
  
  const cx2 = x2 - dx * 0.2 + lateralFlex * 0.95;
  const cy2 = y2 - dy * 0.3 + sag * 1.1;
  
  return `M ${x0} ${y0} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
}

export default function Hero({ onExploreClick }: HeroProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showContactModal, setShowContactModal] = useState(false);
  const { personalInfo } = resumeData;
  const { scrollY } = useScroll();

  // Draggable PVC Badge values
  const badgeRef = useRef<HTMLDivElement>(null);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const proximityContainerRef = useRef<HTMLDivElement>(null);

  // Raw gesture drag motion values
  const badgeX = useMotionValue(0);
  const badgeY = useMotionValue(0);

  // Idle passive sway values for lifelike organic suspension
  const idleSwayX = useMotionValue(0);
  const idleSwayY = useMotionValue(0);
  const swayWeight = useMotionValue(1);

  // Lanyard dynamic offset to keep lanyard top 100px from hero top section dynamically
  const lanyardTopOffset = useMotionValue(-180);

  // Combined position: Sum of user drag position + (passive idle sway * weight)
  const combinedBadgeX = useTransform([badgeX, idleSwayX, swayWeight], ([bx, sx, w]) => {
    return Number(bx) + (Number(sx) * Number(w));
  });
  const combinedBadgeY = useTransform([badgeY, idleSwayY, swayWeight], ([by, sy, w]) => {
    return Number(by) + (Number(sy) * Number(w));
  });

  // Highly elastic, ultra-soft fabric ribbon follow spring with low tension and beautiful fluid ripples
  // Re-calibrated for exquisite cloth-like motion (low stiffness, matching low mass and smooth cushioning)
  const springX = useSpring(combinedBadgeX, { stiffness: 50, damping: 5.0, mass: 0.50 });
  const springY = useSpring(combinedBadgeY, { stiffness: 50, damping: 5.0, mass: 0.50 });

  // Drag blend value (0 = resting or passive sway, 1 = direct user drag coordinates for 100% responsive snapping without finger displacement)
  const dragBlend = useMotionValue(0);

  // Blend raw interactive cursor feedback with the elastic inertia follow spring to prevent physical grab cursor detachment
  const activeX = useTransform([combinedBadgeX, springX, dragBlend], ([raw, spring, blend]) => {
    return Number(spring) + (Number(raw) - Number(spring)) * Number(blend);
  });
  const activeY = useTransform([combinedBadgeY, springY, dragBlend], ([raw, spring, blend]) => {
    return Number(spring) + (Number(raw) - Number(spring)) * Number(blend);
  });

  // Woven Strap Length and Angle calculations computed in absolute, smooth sync with the visible card's active coordinates
  const strapLength = useTransform([activeX, activeY, lanyardTopOffset], ([x, y, offset]) => {
    const dx = Number(x);
    // Subtract offset (which is negative, e.g. -180px) to extend the strap's virtual pivot upward
    const dy = Number(y) + 351 - Number(offset); 
    return Math.sqrt(dx * dx + dy * dy);
  });

  const strapAngle = useTransform([activeX, activeY, lanyardTopOffset], ([x, y, offset]) => {
    const dx = Number(x);
    // Subtract offset to extend the strap's virtual pivot upward
    const dy = Number(y) + 351 - Number(offset);
    const dist = Math.sqrt(dx * dx + dy * dy);
    const restLen = 351 - Number(offset);
    
    const angleRad = Math.atan2(dx, dy);
    const rawAngle = -(angleRad * 180) / Math.PI;
    
    // Natural physics attenuation: when the lanyard is slack (dist < restLen), the badge is not pulled tightly.
    // Gravity pulls the badge straight down, aligning its 2D rotation back to 0 (completely upright).
    if (dist < restLen && restLen > 0) {
      const tensionRatio = Math.max(0, dist / restLen);
      // Soft-body cubic ease-in for elegant transition towards absolute vertical hang
      return rawAngle * Math.pow(tensionRatio, 3);
    }
    return rawAngle;
  });

  const mainStrapPath = useTransform([activeX, activeY, lanyardTopOffset], ([x, y, offset]) => {
    return getPathString(0, Number(x), Number(y), Number(offset));
  });

  const leftStitchPath = useTransform([activeX, activeY, lanyardTopOffset], ([x, y, offset]) => {
    return getPathString(-11, Number(x), Number(y), Number(offset));
  });

  const rightStitchPath = useTransform([activeX, activeY, lanyardTopOffset], ([x, y, offset]) => {
    return getPathString(11, Number(x), Number(y), Number(offset));
  });

  // 1. Basic dragging/swinging rotations: aligned with real-world physical drag tension rather than absolute screen coords
  const dragRotateX = useTransform([activeX, activeY, lanyardTopOffset], ([xVal, yVal, offsetVal]) => {
    const x = Number(xVal);
    const y = Number(yVal);
    const offset = Number(offsetVal);
    const dx = x;
    const dy = y + 351 - offset;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const restLen = 351 - offset;

    const basePitch = (y / 120) * -8; // subtle, realistic 3D pitch response to displacement
    
    if (dist < restLen && restLen > 0) {
      const tensionRatio = Math.max(0, dist / restLen);
      return basePitch * tensionRatio;
    }
    return basePitch;
  });

  const dragRotateY = useTransform([activeX, activeY, lanyardTopOffset], ([xVal, yVal, offsetVal]) => {
    const x = Number(xVal);
    const y = Number(yVal);
    const offset = Number(offsetVal);
    const dx = x;
    const dy = y + 351 - offset;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const restLen = 351 - offset;

    const baseYaw = (x / 120) * 6; // subtle, realistic 3D yaw response to displacement
    
    if (dist < restLen && restLen > 0) {
      const tensionRatio = Math.max(0, dist / restLen);
      return baseYaw * tensionRatio;
    }
    return baseYaw;
  });

  // 2. High-precision mouse local hover tilting
  const hoverX = useMotionValue(0);
  const hoverY = useMotionValue(0);
  const hoverTiltX = useSpring(useTransform(hoverY, [-120, 120], [10, -10]), { stiffness: 180, damping: 20 });
  const hoverTiltY = useSpring(useTransform(hoverX, [-120, 120], [-10, 10]), { stiffness: 180, damping: 20 });
  
  // Z depth lifting on hover and drag
  const hoverZ = useSpring(0, { stiffness: 150, damping: 20 });
  
  // High fidelity gloss reflections matching mouse coords + drag swing coords
  const hoverReflectX = useSpring(0, { stiffness: 150, damping: 20 });
  const hoverReflectY = useSpring(0, { stiffness: 150, damping: 20 });
  
  // Flip spin state for true 3D rotation flip with 50% extra bounciness, always returning home smoothly
  const flipSpinY = useSpring(0, { stiffness: 180, damping: 9, mass: 1.0 });

  // Combined final properties
  const rotateX = useTransform([dragRotateX, hoverTiltX], ([drag, hover]) => Number(drag) + Number(hover));
  const rotateY = useTransform([dragRotateY, hoverTiltY, flipSpinY], ([drag, hover, flip]) => Number(drag) + Number(hover) + Number(flip));
  const rotateZ = strapAngle; // Perfectly lock the card's 2D rotation to the strap's orientation angle!

  const reflectX = useTransform([activeX, hoverReflectX], ([sx, hx]) => {
    return (Number(sx) / 2.5) + (Number(hx) * 0.4);
  });
  const reflectY = useTransform([activeY, hoverReflectY], ([sy, hy]) => {
    return (Number(sy) / 2.5) + (Number(hy) * 0.4);
  });



  // Scroll parallax calculations
  const textY = useTransform(scrollY, [0, 800], [0, 200]);
  const bgY = useTransform(scrollY, [0, 800], [0, -100]);
  const opacity = useTransform(scrollY, [0, 600], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse positions to range [-0.5, 0.5]
      setMousePosition({
        x: (e.clientX / window.innerWidth) - 0.5,
        y: (e.clientY / window.innerHeight) - 0.5,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Listen to window size and compute offset dynamically so lanyard top is always exactly 100px from the top of the homepage section
  useEffect(() => {
    const updateOffset = () => {
      const heroElement = document.getElementById('hero');
      const containerElement = constraintsRef.current;
      if (heroElement && containerElement) {
        const heroRect = heroElement.getBoundingClientRect();
        const containerRect = containerElement.getBoundingClientRect();
        // Distance from the top of the hero section to the top of the badge constraint container
        const containerTopRelToHero = containerRect.top - heroRect.top;
        // We want the lanyard top to be exactly 100px from the hero top.
        // So lanyard top's local offset relative to the container's top is: 100px - containerTopRelToHero
        // Clamped to at least -200px relative to container top to preserve beautiful original strap length when container is shifted up
        const localOffset = Math.min(-200, 100 - containerTopRelToHero);
        lanyardTopOffset.set(localOffset);
      }
    };

    updateOffset();
    window.addEventListener('resize', updateOffset);
    const timer = setTimeout(updateOffset, 150);

    return () => {
      window.removeEventListener('resize', updateOffset);
      clearTimeout(timer);
    };
  }, []);

  // 1. Mount introduction drop-in & underdamped pendulum swing
  useEffect(() => {
    badgeX.set(130);
    badgeY.set(-45); // drop from high suspension side
    
    const animX = animate(badgeX, 0, {
      type: "spring",
      stiffness: 42,
      damping: 3.5,
      mass: 1.6,
      delay: 0.25
    });
    const animY = animate(badgeY, 0, {
      type: "spring",
      stiffness: 60,
      damping: 4.8,
      mass: 1.3,
      delay: 0.25
    });

    return () => {
      animX.stop();
      animY.stop();
    };
  }, []);

  // 2. Slow, luxurious infinite idle suspension sway representing an organic, breezy wind-blown motion
  useEffect(() => {
    let animationId: number;
    const startTime = Date.now();
    
    const tick = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      
      // Wind blowing function: combination of multiple wave components to mimic natural breeze turbulence
      const windForceX = Math.sin(elapsed * 0.95) * 15 + Math.sin(elapsed * 2.2) * 3;
      const windForceY = Math.cos(elapsed * 0.75) * 7 + Math.sin(elapsed * 1.6) * 2;
      
      idleSwayX.set(windForceX);
      idleSwayY.set(windForceY);
      
      animationId = requestAnimationFrame(tick);
    };
    
    tick();
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent py-20"
    >
      {/* Background set to solid pure black, decorative grid and glow orbs have been removed as requested */}
      <DotGridBackground 
        dotSize={3}
        gap={24}
        baseColor="#1A1A1A"
        activeColor="#5C5C5C"
        proximity={180}
        shockRadius={130}
        shockStrength={3}
        returnSpeed={0.08}
        damping={0.86}
      />




      {/* Front Content */}
      <div 
        style={{ fontFamily: 'Arial' }}
        className="relative max-w-7xl mx-auto px-6 z-10 w-full min-h-[calc(100vh-140px)] flex flex-col justify-between pt-12 pb-10 md:pt-20 md:pb-14"
      >
        
        {/* TOP ROW: 2 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start w-full">
          {/* Top Left: Visual Systems & Tags */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-left font-display"
          >
            <h2 className="text-2xl sm:text-3xl font-bold font-montserrat text-white tracking-widest uppercase leading-none cursor-default">
              Visual Systems
            </h2>
            <div className="mt-4 text-[11px] font-mono tracking-widest text-[#5c5c5c] space-y-1 uppercase leading-snug">
              <p>Brand Visual / E-commerce Creativity /</p>
              <p>Material Implementation / Font Design</p>
            </div>
          </motion.div>

          {/* Top Middle: Directed by & Wave Vector Animation */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center space-x-4 text-right justify-end relative"
          >
            {/* Elegant wavy smooth bezier vector graphic expanded by 200px */}
            <svg 
              className="w-[296px] h-[98px] select-none pointer-events-none stroke-dasharray animate-pulse text-white" 
              viewBox="0 0 120 40" 
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="wave-fade-gradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
                  <stop offset="50%" stopColor="currentColor" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0.25" />
                </linearGradient>
              </defs>
              <path 
                d="M 5 20 C 20 5, 30 35, 45 20 C 60 5, 70 35, 85 20 C 100 5, 110 35, 115 20" 
                stroke="url(#wave-fade-gradient)" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                fill="none" 
              />
            </svg>

            <div className="relative z-10 text-right">
              <span style={{ color: '#7d7d7d' }} className="text-[10px] font-mono tracking-widest block uppercase mb-1">Directed by</span>
              <span className="text-base font-bold text-white tracking-widest uppercase block">止泪 Studio</span>
              <span style={{ color: '#7d7d7d' }} className="text-[10px] font-mono tracking-widest block mt-1">Product Visual Designer</span>
            </div>
          </motion.div>
        </div>

        {/* MIDDLE ROW: Giant Typography "VISUAL REEL" Intersecting the Hanging Badge */}
        <div className="relative w-full my-8 md:my-14 flex flex-col md:flex-row items-center justify-between">
          <div className="overflow-visible w-full">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, cubicBezier: [0.16, 1, 0.3, 1] }}
              style={{ position: 'relative', left: '0px' }}
              className="w-full text-left flex flex-col space-y-4 md:space-y-6 pt-[120px] sm:pt-[160px] md:pt-[220px] lg:pt-[240px]"
            >
              <div className="relative h-[12vw] min-h-[70px] md:min-h-[100px] w-full">
                <TextPressure
                  text="VISUALREEL"
                  flex={false}
                  alpha={false}
                  stroke={false}
                  width={true}
                  weight={true}
                  italic={true}
                  textColor="#ffffff"
                  strokeColor="#ffffff"
                  minFontSize={48}
                  fontFamily="Roboto Flex"
                  letterSpacing="18px"
                  textAlign="left"
                />
              </div>
            </motion.div>
          </div>

          {/* Swinging Badge element positioned on the right side over the text */}
          <div className="absolute right-[-20px] md:right-0 lg:right-[4%] top-[-180px] md:top-[-260px] lg:top-[-280px] w-[320px] h-[720px] flex items-end justify-center pointer-events-auto select-none z-20">
            {/* The Badge Container Box */}
            <div 
              ref={constraintsRef} 
              className="relative w-full h-full flex items-end justify-center select-none" 
              style={{ perspective: 1200 }}
            >
              {/* Premium Physics-based Soft-Body Lanyard System with Horizontal Ribs and Custom Buckle */}
              <svg
                viewBox="0 0 320 720"
                className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
              >
                <defs>
                  {/* High-fidelity metallic gradient for the metal coupling clasp */}
                  <linearGradient id="silver-clasp-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3a3d40" />
                    <stop offset="25%" stopColor="#a1a8b0" />
                    <stop offset="50%" stopColor="#f1f4f8" />
                    <stop offset="75%" stopColor="#c5cbd3" />
                    <stop offset="100%" stopColor="#4d5156" />
                  </linearGradient>

                  {/* Elegant premium low-saturation light pink buckle gradient (#ffb9b9 base) -> Matte gray-pink ABS gradient */}
                  <linearGradient id="pink-buckle-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#dfbec2" />
                    <stop offset="45%" stopColor="#caa2a7" />
                    <stop offset="100%" stopColor="#aa8287" />
                  </linearGradient>

                  {/* Frosted transparent textured woven nylon ribbon style with faint pink/white shimmer -> Matte polyester woven stripe */}
                  <linearGradient id="fabric-weave-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#302628" />
                    <stop offset="12%" stopColor="#4a3b3d" />
                    <stop offset="24%" stopColor="#35292b" />
                    <stop offset="38%" stopColor="#544345" />
                    <stop offset="48%" stopColor="#382c2e" />
                    <stop offset="50%" stopColor="#5d4c4f" />
                    <stop offset="52%" stopColor="#382c2e" />
                    <stop offset="62%" stopColor="#544345" />
                    <stop offset="76%" stopColor="#35292b" />
                    <stop offset="88%" stopColor="#4a3b3d" />
                    <stop offset="100%" stopColor="#302628" />
                  </linearGradient>

                  {/* High-fidelity repeating horizontal-ribbed pattern for transparent ribbon texture -> Fine horizontal ribbing */}
                  <pattern id="rib-pattern" width="5" height="2" patternUnits="userSpaceOnUse">
                    <rect width="5" height="0.6" fill="rgba(255, 255, 255, 0.09)" />
                    <rect y="0.6" width="5" height="1.4" fill="rgba(0, 0, 0, 0.18)" />
                  </pattern>
                </defs>

                {/* 1. Dramatic Ambient Soft-Body Ribbon Drop Shadow */}
                <motion.path
                  d={mainStrapPath}
                  stroke="rgba(0,0,0,0.18)"
                  strokeWidth={32}
                  strokeLinecap="round"
                  fill="none"
                  className="blur-xl opacity-40"
                />
                
                {/* 2. Soft-Body Ribbon Inner Drop Shadow (Sharper Ambient Occlusion) */}
                <motion.path
                  d={mainStrapPath}
                  stroke="rgba(0,0,0,0.1)"
                  strokeWidth={29}
                  strokeLinecap="round"
                  fill="none"
                  className="blur-[5px]"
                />

                {/* 3. The Main Woven Ribbon Tape Body */}
                <motion.path
                  id="main-strap-path"
                  d={mainStrapPath}
                  stroke="url(#fabric-weave-grad)"
                  strokeWidth={28}
                  strokeLinecap="round"
                  fill="none"
                />

                {/* 3.1 Exquisite Repeating Horizontal-Ribbed Pattern Layer */}
                <motion.path
                  d={mainStrapPath}
                  stroke="url(#rib-pattern)"
                  strokeWidth={27}
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.9"
                />

                {/* 4. Fine-Dashed High-Contrast Textile Stitching (Left and Right Rails) */}
                <motion.path
                  d={leftStitchPath}
                  stroke="rgba(255, 255, 255, 0.4)"
                  strokeWidth={0.8}
                  strokeDasharray="4,5"
                  fill="none"
                />
                <motion.path
                  d={rightStitchPath}
                  stroke="rgba(255, 185, 185, 0.3)"
                  strokeWidth={0.8}
                  strokeDasharray="4,5"
                  fill="none"
                />

                {/* 5. repeated Monogram / Typography bending dynamically inside the ribbon -> Thermal Transfer ZHILEI print */}
                <text 
                  className="font-mono font-black text-[7.5px]" 
                  fill="#ffffff" 
                  letterSpacing="4" 
                  dy="2.5"
                  style={{ textShadow: "0 0.5px 1px rgba(0,0,0,0.3)" }}
                >
                  <textPath href="#main-strap-path" startOffset="5.5%">
                    ✦ ZHILEI ✦ VISUAL DESIGNER ✦ ID #SH923-26 ✦ STUDIO ZHILEI ✦ ACTIVE REEL ✦ ZHILEI ✦ VISUAL DESIGNER ✦ ID #SH923-26 ✦ STUDIO ZHILEI ✦ ACTIVE REEL 
                  </textPath>
                </text>

                {/* 6. Highly secure, rotating metallic clasp coupling assembly at the bottom grommet union */}
                <motion.g
                  style={{
                    x: useTransform(activeX, x => Number(x) + 160),
                    y: useTransform(activeY, y => Number(y) + 351),
                    rotate: strapAngle,
                    transformOrigin: "0px 0px",
                  }}
                >
                  {/* Metal link ring connecting clasp to badge grommet */}
                  <circle 
                    cx="0" 
                    cy="-6" 
                    r="8.5" 
                    fill="none" 
                    stroke="url(#silver-clasp-grad)" 
                    strokeWidth="2.5" 
                    className="drop-shadow-sm" 
                  />
                  
                  {/* Gray-pink ABS micro-rect buckle styled with rounded premium edges */}
                  <rect 
                    x="-20" 
                    y="-34" 
                    width="40" 
                    height="26" 
                    rx="6" 
                    fill="url(#pink-buckle-grad)" 
                    stroke="#bf9ca1" 
                    strokeWidth="1.5" 
                    className="drop-shadow-md"
                  />
                  {/* Inner inset outline for a high-end molded plastic vibe */}
                  <rect 
                    x="-17" 
                    y="-31" 
                    width="34" 
                    height="20" 
                    rx="4" 
                    fill="none" 
                    stroke="#937175" 
                    strokeWidth="1.2" 
                    opacity="0.45"
                  />
                  
                  {/* Exquisite side metal rivets - spherical nickel rivet design */}
                  {/* Left Rivet */}
                  <g transform="translate(-10, -21)">
                    <circle cx="0" cy="0" r="3.5" fill="url(#silver-clasp-grad)" stroke="#2d2f33" strokeWidth="0.5" />
                    <circle cx="-1" cy="-1" r="2.5" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.6" />
                    <circle cx="1" cy="-1" r="0.8" fill="#ffffff" opacity="0.9" />
                  </g>

                  {/* Right Rivet */}
                  <g transform="translate(10, -21)">
                    <circle cx="0" cy="0" r="3.5" fill="url(#silver-clasp-grad)" stroke="#2d2f33" strokeWidth="0.5" />
                    <circle cx="-1" cy="-1" r="2.5" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.6" />
                    <circle cx="1" cy="-1" r="0.8" fill="#ffffff" opacity="0.9" />
                  </g>

                  {/* Center Main Rivet Lock */}
                  <g transform="translate(0, -21)">
                    <circle cx="0" cy="0" r="5.5" fill="url(#silver-clasp-grad)" stroke="#1a1c1e" strokeWidth="0.8" />
                    <circle cx="-1.5" cy="-1.5" r="4.2" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
                    <circle cx="1.5" cy="-1.5" r="1.5" fill="#ffffff" opacity="0.95" />
                    <circle cx="0" cy="0" r="2.2" fill="#141517" />
                  </g>
                </motion.g>
              </svg>

              {/* Sister #2: Visible Cybernetic Brand Badge following fluid, smooth spring-damper physics -> shift by 200px vertical */}
              <motion.div
                style={{ 
                  x: activeX, 
                  y: activeY,
                }}
                className="absolute top-[325px] left-1/2 -ml-[120px] w-[240px] h-[370px] z-20 pointer-events-none select-none"
              >
                {/* Visual Draggable Cybernetic Brand Badge with thickened PVC & dark gray-pink edge banding */}
                <motion.div
                  style={{ 
                    rotateX,
                    rotateY,
                    rotateZ,
                    z: hoverZ, // Depth translation lift
                    transformStyle: "preserve-3d",
                    transformOrigin: "50% 26px"
                  }}
                  className="w-full h-full rounded-2xl border-[3.5px] border-[#524143] shadow-[0_35px_80px_rgba(0,0,0,0.85),inset_0_2px_4px_rgba(255,255,255,0.3),0_0_0_1.5px_rgba(255,255,255,0.08)] relative flex flex-col justify-between overflow-hidden select-none bg-white/[0.05] backdrop-blur-xl p-[14px]"
                >
                  {/* Polished 3D physical Weld and seam simulation representing anti-scratch PVC sleeve and deep gray-pink heat-seal boundaries */}
                  <div className="absolute inset-0 rounded-[12px] border border-[#705a5d]/40 pointer-events-none z-20" />
                  {/* Heat-sealed inner border seam line */}
                  <div className="absolute inset-[3px] rounded-[10px] border border-dashed border-[#524143]/20 pointer-events-none z-20" />
                  <div className="absolute inset-[4px] rounded-[9px] border border-white/5 pointer-events-none z-20" />

                  {/* Diagonal high-fidelity gloss sheen reflection inside the sub-millimeter acrylic block */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-white/[0.18] pointer-events-none z-30" />
                  <motion.div 
                    style={{ 
                      x: reflectX, 
                      y: reflectY 
                    }}
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.12] to-transparent rotate-12 -translate-y-full pointer-events-none skew-x-12 mix-blend-overlay z-30"
                  />

                  {/* Inner light-white card paper base inside placing reference/resume content */}
                  <div className="w-full h-full bg-gradient-to-b from-[#faf9f9] to-[#f5f1f1] shadow-[0_6px_18px_rgba(0,0,0,0.18),inset_0_1px_2.5px_rgba(0,0,0,0.05)] rounded-[10px] relative overflow-hidden">
                    
                    <img 
                      src="https://raw.githubusercontent.com/arlynevjpg027-crypto/picx-images-hosting/master/20260615/work-badge_480x740.b9k8dv9kq.webp" 
                      className="absolute inset-0 w-full h-full object-cover rounded-[10px]" 
                      alt="止泪 Work Badge" 
                      referrerPolicy="no-referrer"
                    />

                    {/* Metal core grommet ring hole for rope clip passage */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#f5f1f1] border-2 border-[#ffb9b9]/60 shadow-inner flex items-center justify-center z-10">
                      <div className="w-[6px] h-[6px] rounded-full bg-zinc-800" />
                    </div>

                  </div>
                </motion.div>
              </motion.div>

              {/* Sister #3: Outer Flat Interactive Draggable Envelope for 100% stable, jitter-free cursor tracking */}
              <motion.div
                ref={badgeRef}
                drag
                dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
                dragElastic={1.15}
                dragTransition={{ bounceStiffness: 50, bounceDamping: 5.0, timeConstant: 40 }}
                style={{ 
                  x: badgeX, 
                  y: badgeY,
                }}
                onDragStart={() => {
                  isDragging.current = true;
                  swayWeight.set(0); // instantly cancel idle sway to prevent phase misalignment during drag
                  dragBlend.set(1); // instantly bind the visual card's positions to the drag coordinates
                  hoverZ.set(15); // visual drag-lift feedback
                }}
                onDragEnd={(e, info) => {
                  isDragging.current = false;
                  animate(swayWeight, 1, { duration: 0.85, ease: "easeOut" }); // restore gentle idle sway smoothly
                  animate(dragBlend, 0, { duration: 0.85, ease: "easeOut" }); // smoothly transfer back to springy lanyard physics
                  hoverZ.set(0);
                  
                  // Flip physics based on horizontal drag velocity and edge grabbing
                  const currentHoverX = hoverX.get();
                  // If dragged outward from edges or thrown with some velocity
                  if (Math.abs(currentHoverX) > 40 || Math.abs(info.velocity.x) > 200) {
                    const direction = (info.velocity.x > 0 || (info.velocity.x === 0 && currentHoverX > 0)) ? 1 : -1;
                    // Apply a 360 degree flip so it always ends up facing the front side (多轨同向旋转并最终回归正面)
                    const flipCount = Math.max(1, Math.round(Math.abs(info.velocity.x) / 450));
                    flipSpinY.set(flipSpinY.get() + (360 * flipCount) * direction);
                  }
                }}
                onMouseMove={(e) => {
                  if (isDragging.current) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left - rect.width / 2;
                  const y = e.clientY - rect.top - rect.height / 2;
                  hoverX.set(x);
                  hoverY.set(y);
                  hoverReflectX.set(x);
                  hoverReflectY.set(y);
                }}
                onMouseEnter={() => {
                  if (isDragging.current) return;
                  hoverZ.set(40); // Lift-up forward in 3D perspective
                }}
                onMouseLeave={() => {
                  hoverX.set(0);
                  hoverY.set(0);
                  hoverZ.set(0);
                  hoverReflectX.set(0);
                  hoverReflectY.set(0);
                }}
                className="absolute top-[375px] left-1/2 -ml-[120px] w-[240px] h-[370px] z-30 cursor-grab active:cursor-grabbing select-none bg-transparent"
              />
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: Split Description/Buttons and List Indexes */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-end w-full border-t border-white/5 pt-8 md:pt-12">
          {/* Bottom Left: Cinematic Product Imagery Description and CTAs */}
          <div className="md:col-span-8 text-left flex flex-col items-start space-y-6 sm:space-y-8">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-[16px] text-[#5c5c5c] max-w-2xl font-light leading-relaxed tracking-wider font-sans"
            >
              Integrate Brand Visual, E-commerce Creativity, Material Implementation, <br />
              Font Design and rely on AIGC to build a full process brand visual chain.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex flex-row space-x-4 items-center"
            >
              <button
                id="hero-explore-btn"
                onClick={onExploreClick}
                className="group px-6 py-3.5 bg-white text-black font-semibold text-xs rounded-lg hover:bg-neutral-200 transition-all tracking-widest uppercase border border-white cursor-pointer h-[48px]"
              >
                View Works ↗
              </button>
              
              <div className="h-[48px] min-w-[130px]">
                <GlareHover>
                  <button
                    onClick={() => setShowContactModal(true)}
                    className="w-full h-full px-6 py-3 bg-zinc-950/50 backdrop-blur-md text-white font-semibold text-xs tracking-widest uppercase cursor-pointer hover:bg-zinc-900/40 transition-all font-sans whitespace-nowrap block text-center border border-white/5"
                  >
                    Contact ↗
                  </button>
                </GlareHover>
              </div>
            </motion.div>
          </div>

          {/* Bottom Right: Clean Numbered Indicator Index */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="md:col-span-4 flex flex-col space-y-3 font-mono text-[10px] sm:text-xs text-[#5c5c5c] w-full border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-8 text-left"
          >
            <div className="flex justify-between items-center w-full group hover:text-white transition-colors duration-300 py-1 border-b border-white/5">
              <span>01 品牌视觉 Brand Visual</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">✦</span>
            </div>
            <div className="flex justify-between items-center w-full group hover:text-white transition-colors duration-300 py-1 border-b border-white/5">
              <span>02 电商创意 E-commerce Creativity</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">✦</span>
            </div>
            <div className="flex justify-between items-center w-full group hover:text-white transition-colors duration-300 py-1">
              <span>03 物料落地 Material landing</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">✦</span>
            </div>
          </motion.div>
        </div>

      </div>

      {/* Embedded Parallax Indicator in Bottom Section Offset */}
      <motion.div
        style={{ opacity }}
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-1 z-10 cursor-pointer pointer-events-none"
      >
        <span className="text-[10px] font-mono tracking-widest text-zinc-600 uppercase">
          SCROLL DOWN
        </span>
        <div className="w-[1px] h-8 bg-zinc-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-white animate-[bounce_2s_infinite]" />
        </div>
      </motion.div>

      {/* Contact QR Code Pop-up Modal */}
      <ContactModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} />
    </section>
  );
}
