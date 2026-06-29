import { useState } from 'react';
import { motion } from 'motion/react';
import { resumeData } from '../data/defaultProjects';
import { Cpu, Palette, Sliders, Box, Award, ShieldAlert } from 'lucide-react';
import GlareHover from './GlareHover';

export default function Skills() {
  const { skills } = resumeData;
  const [hoveredSkillIndex, setHoveredSkillIndex] = useState<number | null>(null);

  const coreWorkflowTags = [
    { text: '电商视觉设计', desc: '主导大型店铺视觉升级、高转化率首页面板、产品主图与促销 Banner。', icon: Palette, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20', hoverColor: 'group-hover:text-rose-400' },
    { text: '产品精修与高级提色', desc: '硬核材质打路复原，精通反光、倒影、光影结构的三维图稿微修。', icon: Sliders, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20', hoverColor: 'group-hover:text-indigo-400' },
    { text: '品牌视觉统一', desc: '严格执行VI规范，确保海内外全系列设计符合品牌色彩、标识体系。', icon: Award, color: 'text-teal-400 bg-teal-500/10 border-teal-500/20', hoverColor: 'group-hover:text-teal-400' },
    { text: '线下物料设计', desc: '全面精通特种纸张、大版大画幅喷绘、Pantone专色及印刷工艺。', icon: Box, color: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20', hoverColor: 'group-hover:text-white' },
    { text: 'C4D + OC 渲染', desc: '搭建高真实度商用三维场景，结合Octane渲染器实现高端写实产品模型。', icon: Cpu, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20', hoverColor: 'group-hover:text-cyan-400' },
    { text: '行业合规与商业安全', desc: '深熟大健康大规则，规避极其高昂的虚假宣传、违规字，美学安全兼具。', icon: ShieldAlert, color: 'text-red-400 bg-red-500/10 border-red-500/20', hoverColor: 'group-hover:text-red-400' }
  ];

  return (
    <section id="skills" className="relative pt-8 pb-14 bg-transparent overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />
      <div className="absolute w-[250px] h-[250px] rounded-full bg-white/[0.01] glow-orb bottom-10 right-10" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Software Tools Grid (Circled badges reflecting physical resume) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {skills.map((skill, index) => {
            const isHovered = hoveredSkillIndex === index;
            return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredSkillIndex(index)}
                onMouseLeave={() => setHoveredSkillIndex(null)}
                className="group relative p-4 sm:p-5 bg-zinc-950/80 border border-white/5 rounded-2xl flex flex-col items-center hover:border-white/15 transition-all duration-300"
              >
                {/* Styled Professional Software Logo Emblem */}
                <div 
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-bold text-xl sm:text-2xl font-mono relative mb-3 transition-transform group-hover:scale-105 duration-300 shadow-md"
                  style={{
                    backgroundColor: `${skill.color}15`,
                    color: skill.color,
                    border: `1px solid ${skill.color}35`
                  }}
                >
                  <span className="relative z-10">{skill.iconName}</span>
                  {/* Background Soft Glow */}
                  <div 
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-40 transition-opacity blur-md"
                    style={{ backgroundColor: skill.color }}
                  />
                </div>

                {/* Software Name */}
                <h3 
                  className="text-xs sm:text-sm font-semibold tracking-wide mb-1 transition-colors duration-300"
                  style={{ color: isHovered ? skill.color : '#ffffff' }}
                >
                  {skill.name}
                </h3>

                {/* Progress bar info */}
                <div className="w-full mt-2">
                  <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 mb-1">
                    <span>MASTERY</span>
                    <span className="text-white/80">{skill.level}%</span>
                  </div>
                  {/* Bar */}
                  <div className="w-full h-[3px] bg-zinc-900 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: skill.color }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 2. Process / Specializations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreWorkflowTags.map((tag, index) => {
            const Icon = tag.icon;
            return (
              <motion.div
                key={tag.text}
                initial={{ opacity: 0, x: index % 2 === 0 ? -15 : 15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="w-full text-left"
              >
                <GlareHover>
                  <div className="p-6 bg-zinc-950 flex items-start space-x-4 group h-full w-full">
                    <div className={`p-3 rounded-xl border ${tag.color} shrink-0 transition-transform group-hover:scale-105`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h4 className={`font-semibold text-white ${tag.hoverColor} transition-colors text-sm sm:text-base mb-1.5`}>
                        {tag.text}
                      </h4>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {tag.desc}
                      </p>
                    </div>
                  </div>
                </GlareHover>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
