export interface Project {
  id: string;
  title: string;
  category: 'brand' | 'ecommerce' | 'poster' | 'typography';
  categoryLabel: string;
  tagline: string;
  description: string;
  imageUrl: string;
  client?: string;
  year: string;
  tools: string[];
  details?: {
    challenge?: string;
    concept?: string;
    result?: string;
    extraImages?: string[];
  };
}

export interface ExperienceItem {
  period: string;
  company: string;
  role: string;
  tags?: string[];
  bullets: {
    title: string;
    content: string;
    highlightWords?: string[];
  }[];
}

export interface SkillItem {
  name: string;
  level: number; // 0-100
  color: string;
  iconName: string;
}
