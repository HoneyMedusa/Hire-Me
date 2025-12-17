export interface Experience {
  id: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  year: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Expert';
}

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    portfolio: string;
    summary: string;
  };
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  targetJobDescription: string;
}

export type TemplateType = 'modern' | 'classic' | 'minimal';

export interface AIAnalysisResult {
  score: number;
  atsCompatibility: string;
  keywordMatches: string[];
  missingKeywords: string[];
  suggestions: string;
}