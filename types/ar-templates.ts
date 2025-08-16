// AR Template Types
export interface ARTemplate {
  id: string;
  name: string;
  description: string;
  category: 'business' | 'creative' | 'modern' | 'minimal' | 'interactive';
  preview: string; // Preview image URL
  scene: (cardData: any) => string; // Function that generates A-Frame scene HTML
  animations?: ARAnimation[];
  colors?: ARColorScheme;
  layout?: ARLayout;
}

export interface ARAnimation {
  type: 'float' | 'rotate' | 'pulse' | 'slide' | 'bounce';
  duration: number;
  delay?: number;
  loop?: boolean;
}

export interface ARColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface ARLayout {
  type: 'card-centric' | 'floating-panels' | 'circular' | 'vertical-stack' | 'grid';
  spacing: number;
  scale: number;
}

export interface CardData {
  username: string;
  title: string;
  profilePicture: string;
  phone: string;
  email: string;
  company?: string;
  website?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
  targetIndex?: number;
  cardId?: string | number;
  templateId?: string; // AR Template ID
}
