
export enum ThinkingTrap {
  FortuneTelling = 'قراءة الغيب',
  Catastrophizing = 'التهويل',
  Personalization = 'الشخصنة',
  BlackAndWhite = 'التفكير الأبيض والأسود',
  MindReading = 'قراءة الأفكار',
  EmotionalReasoning = 'التفكير العاطفي'
}

export interface MoodEntry {
  id: string;
  timestamp: number;
  moodLevel: number; // 1-10
  traps: ThinkingTrap[];
  originalThought: string;
  reframe: string;
}

export interface AudioTrack {
  id: string;
  title: string;
  category: 'RELAX' | 'CHALLENGE' | 'SLEEP' | 'DARE' | 'SITUATIONAL' | 'BODILY';
  duration: string;
  isPremium: boolean;
  arabicLabel: string;
  description?: string;
  icon?: string;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export type Screen = 'HOME' | 'DARE_FLOW' | 'JOURNAL' | 'RELAX' | 'CHALLENGES' | 'PAYWALL' | 'PROFILE';
