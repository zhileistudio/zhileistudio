import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Mail, MapPin, GraduationCap, CheckCircle, X, ChevronRight, Award, MessageSquare, Phone
} from 'lucide-react';
import { resumeData } from '../data/defaultProjects';
import ContactModal from './ContactModal';

// 1. High-precision Bullet Capsule component for the Timeline Dates
function BulletCapsule({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 hover:border-white/30 transition-all duration-300 rounded-full px-4 py-1 text-[10px] sm:text-[11px] font-mono font-bold text-zinc-200 tracking-wider select-none shrink-0">
      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
      <span>{text}</span>
    </div>
  );
}

export default function About() {
  const [showContactModal, setShowContactModal] = useState(false);
  const { personalInfo, aboutMe, education, experience } = resumeData;

  // Manual mapping helper to inject typography highlights into core text sentences
  const highlightKeyPhrases = (text: string) => {
    const highlights = [
      '主导国内电商平台店铺全案视觉设计',
      '产品主图、详情页元素、活动海报及首页装修',
      'VI 标准',
      '产品包装设计',
      '展会海报、宣传单页、折页、画册、易拉宝及门店物料设计',
      '大健康行业特性',
      '规避违规风险',
      '品牌调性与商业安全性',
      'AmazingThing 亚马逊、独立站',
      '产品精修与 A+ 页面设计',
      'SOUL-CIAL 独立站潮流手机壳背板',
      '线下物料',
      '3 年亚马逊跨境电商设计实战经验',
      'Leader 统帅抖音店铺',
      '微动效',
      '抖音等社交媒体平台',
      '跨部门协作'
    ];

    let result = text;
    highlights.forEach(phrase => {
      if (result.includes(phrase)) {
        result = result.replace(
          new RegExp(phrase, 'g'),
          `<strong class="font-bold text-white border-b border-white/30 pb-0.5">${phrase}</strong>`
        );
      }
    });

    return <span dangerouslySetInnerHTML={{ __html: result }} />;
  };

  return (
    <section 
      id="about" 
      className="relative py-24 sm:py-28 bg-[#0C0C0C] text-white overflow-hidden border-t border-white/5 font-sans"
    >
      {/* Exquisite micro dust elements */}
      <div className="absolute inset-0 grid-bg opacity-[0.02] pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] rounded-full bg-[#D7E2EA]/[0.01] glow-orb -top-24 -left-24 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10 pt-8">
        
        {/* 1. UPPER HALF: Dynamic Split Layout (Intro Typography left vs Full-height Image Frame right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-stretch mb-24 text-left">
          
          {/* Left Column: Bold Titles & Bio text description (lg:col-span-7) */}
          <div className="lg:col-span-7 flex flex-col justify-between py-2">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <h2 className="text-[120px] font-black tracking-[-0.03em] leading-[0.9] text-white uppercase select-none mb-1 font-sans">
                  Hello, I'm
                </h2>
                <h2 className="text-[120px] leading-[150px] font-black tracking-[-0.03em] text-[#ffcfcf] uppercase select-none mb-8 font-sans">
                  {personalInfo.name.toUpperCase()}
                </h2>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-xs sm:text-sm text-[#aeaeae] leading-relaxed font-light text-justify max-w-xl select-none"
              >
                {aboutMe.fullDesc}
              </motion.p>
            </div>
            
            {/* Elegant visual line break */}
            <div className="hidden lg:block h-[1px] w-20 bg-white/10 mt-12" />
          </div>

          {/* Right Column: Stunning Full Frame Portrait Asset (lg:col-span-5) */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-md h-[400px] lg:h-[420px] rounded-[30px] overflow-hidden border border-white/10 bg-zinc-950 shadow-2xl relative group"
            >
              <img
                src={personalInfo.avatar}
                alt="Lay Avatar"
                className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-103"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              
              {/* Overlaid Info Footer */}
              <div className="absolute bottom-6 left-6 text-left select-none">
                <span className="text-[9px] font-mono tracking-widest text-[#D7E2EA] uppercase block mb-1">DESIGNER / FOUNDER</span>
                <h3 className="text-lg font-bold text-white tracking-widest">{personalInfo.title}</h3>
              </div>
            </motion.div>
          </div>
        </div>

        {/* 2. LOWER HALF: Modular Matrix Layout (Stacked cards left vs Timeline right) */}
        {/* Note the id="experience" anchor starts here so it scrolls directly to the professional journey timeline column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 border-t border-white/5 pt-20">
          
          {/* Lower Left Column: Three Stacked Block Cards (lg:col-span-12 on mobile, lg:col-span-5 on desktop) */}
          <div className="lg:col-span-5 space-y-6 text-left">
            
            {/* COMBINED CARD: Education & Specialties nested inside a single premium glowing dark card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-[#0C0C0C] border border-white/20 text-white p-6 sm:p-8 rounded-[25px] h-auto shadow-2xl shadow-white/5 hover:shadow-white/[0.08] hover:border-white/35 relative overflow-hidden group select-none hover:translate-y-[-2px] transition-all duration-300"
            >
              <div className="absolute w-40 h-40 rounded-full bg-white/[0.01] blur-xl -top-20 -right-20 pointer-events-none" />
              
              <div className="space-y-6">
                {/* Section A: Education Background */}
                <div className="pb-6 border-b border-white/5 space-y-3">
                  <div className="flex items-center space-x-2.5 text-[#c3c3c3]">
                    <GraduationCap className="w-4.5 h-4.5 shrink-0 text-[#a3a3a3]" />
                    <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-[#c3c3c3]">学历背景 / Education</h4>
                  </div>
                  <div className="flex justify-between items-center gap-4">
                    <div className="space-y-0.5">
                      <p className="text-[12px] leading-[18.75px] font-medium text-white select-all">
                        {education.school}
                      </p>
                      <p className="text-[10px] font-mono text-[#5c5c5c] uppercase tracking-wider select-all">
                        数字媒体艺术设计
                      </p>
                    </div>
                    <BulletCapsule text={education.period} />
                  </div>
                </div>

                {/* Section B: Specialties & Practice highlights */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2.5 text-[#c3c3c3]">
                    <Award className="w-4.5 h-4.5 shrink-0 text-[#a3a3a3]" />
                    <h4 className="font-sans font-extrabold text-xs uppercase tracking-wider text-[#c3c3c3]">专业成长与实践 / Specialties</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 pt-1">
                    {education.highlights.map((hlt, idx) => (
                      <div key={idx} className="flex items-center space-x-1.5 text-[#5c5c5c] hover:text-zinc-300 transition-colors">
                        <CheckCircle className="w-3.5 h-3.5 text-zinc-600 shrink-0 group-hover:text-zinc-500" />
                        <span className="text-xs font-semibold truncate select-all">{hlt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CARD 3: Rapid Interactive WeChat popup card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onClick={() => setShowContactModal(true)}
              className="bg-[#EAEAEA] text-[#0C0C0C] p-6 sm:p-8 rounded-[25px] flex flex-col justify-between h-auto shadow-lg relative overflow-hidden cursor-pointer group select-none hover:translate-y-[-2px] transition-all duration-300 active:scale-98"
            >
              <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-black/5 flex items-center justify-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ChevronRight className="w-4 h-4 text-black" />
              </div>

              <div>
                <div className="flex items-center space-x-2.5 mb-4 text-[#0C0C0C]">
                  <MessageSquare className="w-5 h-5 shrink-0" />
                  <h4 className="font-sans font-bold text-sm uppercase tracking-wider">极速联系 / Contact Lay</h4>
                </div>
                <p className="font-bold text-lg leading-tight mb-2 group-hover:text-zinc-700 transition-colors">
                  微信号: {personalInfo.wechat}
                </p>
                <p className="text-xs text-[#0C0C0C]/70 leading-relaxed font-semibold">
                  如果你对我的作品感兴趣，欢迎通过电话、微信、邮箱、小红书或者站酷联系我。
                </p>
                <div className="mt-5 pt-4 border-t border-black/10 grid grid-cols-2 gap-3 text-xs text-[#0C0C0C]/85 font-medium font-sans">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                    <span>电话: +86 {personalInfo.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                    <span>微信: {personalInfo.wechat}</span>
                  </div>
                  
                  <a 
                    href="https://www.xiaohongshu.com/user/profile/604bf5bf0000000001005fb2?xsec_token=ABCYWr8V2gtqn0d40rXwwKX0CQqsPyuV7TMnecxD_yFuU%3D&xsec_source=pc_search"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 hover:text-[#ff2741] transition-all group/link"
                  >
                    <span className="w-3.5 h-3.5 flex items-center justify-center bg-[#ff2741] text-white text-[9px] font-extrabold rounded-md shrink-0 select-none shadow-sm group-hover/link:scale-105 transition-transform">书</span>
                    <span className="underline decoration-black/10 group-hover/link:decoration-current">小红书: 止泪</span>
                  </a>

                  <a 
                    href="https://www.zcool.com.cn/u/24997899"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 hover:text-[#FFD100] transition-all group/link"
                  >
                    <span className="w-3.5 h-3.5 flex items-center justify-center bg-black text-[#FFD100] text-[9.5px] font-black rounded-md shrink-0 select-none shadow-sm group-hover/link:scale-105 transition-transform font-sans">酷</span>
                    <span className="underline decoration-black/10 group-hover/link:decoration-current">站酷: 止泪</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Lower Right Column: Premium Experience Timeline with Chevron indicators (lg:col-span-7) */}
          <div id="experience" className="lg:col-span-7 text-left space-y-12 scrolling-offset">
            <div className="mb-12">
              <span className="text-zinc-500 text-xs font-mono tracking-widest uppercase block mb-2 select-none">
                CAREER TIMELINE
              </span>
              <h3 className="text-[72px] leading-[72px] font-black font-sans text-white tracking-tight select-none">
                Professional<br />Journey.
              </h3>
            </div>

            {/* List Chronological Project Deliverables */}
            <div className="space-y-16">
              {experience.map((item, idx) => (
                <motion.div
                  key={item.company}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: idx * 0.1 }}
                  className="relative pb-10 border-b border-white/5 last:border-b-0 last:pb-0"
                >
                  {/* Company & Period and Job Role */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 gap-4">
                    <div className="space-y-1.5 text-left">
                      <h4 className="text-xl sm:text-2xl font-black text-white leading-tight">
                        {item.company}
                      </h4>
                      <p className="text-xs sm:text-sm font-mono text-[#5c5c5c] font-semibold flex items-center select-none">
                        <ChevronRight className="w-3.5 h-3.5 mr-1 text-zinc-500" />
                        {item.role}
                      </p>
                    </div>
                    
                    {/* High-fidelity circular Bullet Capsule */}
                    <BulletCapsule text={item.period} />
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-6 select-none">
                    {item.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-zinc-400 font-mono text-[9px] tracking-wider uppercase">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Standard clean layout for work bullet points */}
                  <div className="space-y-6">
                    {item.bullets.map((bullet, bidx) => (
                      <div key={bidx} className="space-y-2 text-left group/item">
                        {/* Elegant standard header */}
                        <div className="flex items-center gap-2 select-none">
                          <span className="w-1.5 h-1.5 rounded-full bg-white opacity-60 group-hover/item:opacity-100 transition-opacity" />
                          <h5 className="text-xs sm:text-sm font-bold text-zinc-200 group-hover/item:text-white transition-colors tracking-wide font-sans">
                            {bullet.title}
                          </h5>
                        </div>
                        
                        {/* Paragraph Details */}
                        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light pl-3.5 border-l border-zinc-800 group-hover/item:border-zinc-700 transition-colors prose-strong:font-semibold prose-strong:text-white">
                          {highlightKeyPhrases(bullet.content)}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* WeChat Modal details popup */}
      <ContactModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} />
    </section>
  );
}
