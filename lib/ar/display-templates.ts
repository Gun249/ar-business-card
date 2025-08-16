import { CardData } from '@/types/ar-templates';

// AR Display Templates - Templates สำหรับการแสดงผล AR เวลาสแกน
export interface ARDisplayTemplate {
  id: string;
  name: string;
  description: string;
  category: 'floating' | 'spread' | 'hologram' | 'interactive' | 'minimal';
  preview: {
    type: 'floating-card' | 'info-spread' | 'hologram-effect' | 'interactive-ui' | 'clean-layout';
    animation: 'fade-in' | 'slide-up' | 'rotate-in' | 'scale-bounce' | 'particle-effect';
    layout: 'vertical' | 'horizontal' | 'circular' | 'grid' | 'stack';
  };
  arScene: {
    backgroundColor: string;
    lighting: 'ambient' | 'directional' | 'point' | 'mixed';
    animations: string[];
    interactions: string[];
  };
}

export const arDisplayTemplates: ARDisplayTemplate[] = [
  {
    id: 'floating-card-3d',
    name: '3D Floating Card',
    description: 'นามบัตรลอยขึ้นมาเป็น 3D พร้อมแอนิเมชันหมุน',
    category: 'floating',
    preview: {
      type: 'floating-card',
      animation: 'rotate-in',
      layout: 'vertical'
    },
    arScene: {
      backgroundColor: 'transparent',
      lighting: 'mixed',
      animations: ['rotation', 'floating', 'glow'],
      interactions: ['click-to-rotate', 'pinch-to-scale']
    }
  },
  {
    id: 'info-spread-radial',
    name: 'Radial Info Spread',
    description: 'ข้อมูลกระจายออกเป็นวงกลมรอบๆ รูปโปรไฟล์',
    category: 'spread',
    preview: {
      type: 'info-spread',
      animation: 'fade-in',
      layout: 'circular'
    },
    arScene: {
      backgroundColor: 'rgba(0,0,0,0.1)',
      lighting: 'ambient',
      animations: ['radial-expand', 'pulse', 'orbit'],
      interactions: ['tap-info-cards', 'swipe-to-rotate']
    }
  },
  {
    id: 'hologram-effect',
    name: 'Hologram Display',
    description: 'เอฟเฟค hologram สีฟ้าเขียวแบบไซไฟ',
    category: 'hologram',
    preview: {
      type: 'hologram-effect',
      animation: 'particle-effect',
      layout: 'vertical'
    },
    arScene: {
      backgroundColor: 'rgba(0,20,40,0.8)',
      lighting: 'point',
      animations: ['hologram-flicker', 'scan-lines', 'particle-flow'],
      interactions: ['gesture-control', 'voice-activation']
    }
  },
  {
    id: 'interactive-dashboard',
    name: 'Interactive Dashboard',
    description: 'แดชบอร์ดโต้ตอบได้ กดปุ่มต่างๆ ได้',
    category: 'interactive',
    preview: {
      type: 'interactive-ui',
      animation: 'slide-up',
      layout: 'grid'
    },
    arScene: {
      backgroundColor: 'rgba(255,255,255,0.9)',
      lighting: 'directional',
      animations: ['button-hover', 'panel-slide', 'highlight'],
      interactions: ['button-press', 'swipe-panels', 'long-press-actions']
    }
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    description: 'การแสดงผลแบบเรียบง่าย สะอาดตา',
    category: 'minimal',
    preview: {
      type: 'clean-layout',
      animation: 'scale-bounce',
      layout: 'stack'
    },
    arScene: {
      backgroundColor: 'transparent',
      lighting: 'ambient',
      animations: ['gentle-float', 'soft-glow'],
      interactions: ['simple-tap']
    }
  }
];

// Function to get all AR display templates
export const getAllARDisplayTemplates = (): ARDisplayTemplate[] => {
  return arDisplayTemplates;
};

// Function to get template by ID
export const getARDisplayTemplate = (templateId: string): ARDisplayTemplate | undefined => {
  return arDisplayTemplates.find(template => template.id === templateId);
};

// Function to get templates by category
export const getARDisplayTemplatesByCategory = (category: string): ARDisplayTemplate[] => {
  return arDisplayTemplates.filter(template => template.category === category);
};

// Generate A-Frame scene for AR display template
export const generateARDisplayScene = (templateId: string, cardData: CardData): string => {
  const template = getARDisplayTemplate(templateId);
  if (!template) return '';

  switch (templateId) {
    case 'floating-card-3d':
      return generateFloatingCardScene(cardData, template);
    case 'info-spread-radial':
      return generateRadialSpreadScene(cardData, template);
    case 'hologram-effect':
      return generateHologramScene(cardData, template);
    case 'interactive-dashboard':
      return generateInteractiveDashboardScene(cardData, template);
    case 'minimal-clean':
      return generateMinimalCleanScene(cardData, template);
    default:
      return generateFloatingCardScene(cardData, template);
  }
};

// Scene generators for each template
const generateFloatingCardScene = (cardData: CardData, template: ARDisplayTemplate): string => {
  return `
    <!-- 3D Floating Card Template -->
    <a-entity id="floating-card" position="0 0 0" rotation="0 0 0">
      <!-- Main Card -->
      <a-box
        id="main-card"
        position="0 0 0"
        width="2"
        height="1.2"
        depth="0.1"
        material="color: white; opacity: 0.95"
        animation="property: rotation; to: 0 360 0; loop: true; dur: 10000"
        geometry="primitive: box"
      >
        <!-- Profile Picture -->
        <a-circle
          position="-0.6 0.3 0.06"
          radius="0.2"
          material="color: #4A90E2"
          text="value: ${cardData.username.charAt(0)}; align: center; color: white; width: 8"
        ></a-circle>
        
        <!-- Name -->
        <a-text
          position="-0.2 0.3 0.06"
          value="${cardData.username}"
          color="#333"
          width="6"
          align="left"
        ></a-text>
        
        <!-- Title -->
        <a-text
          position="-0.2 0.1 0.06"
          value="${cardData.title || 'Professional'}"
          color="#666"
          width="4"
          align="left"
        ></a-text>
        
        <!-- Phone -->
        <a-text
          position="-0.8 -0.1 0.06"
          value="📱 ${cardData.phone}"
          color="#333"
          width="3"
          align="left"
        ></a-text>
        
        <!-- Email -->
        <a-text
          position="-0.8 -0.3 0.06"
          value="✉️ ${cardData.email}"
          color="#333"
          width="3"
          align="left"
        ></a-text>
      </a-box>
      
      <!-- Floating Animation -->
      <a-animation
        attribute="position"
        to="0 0.1 0"
        direction="alternate"
        repeat="indefinite"
        dur="2000"
      ></a-animation>
    </a-entity>
  `;
};

const generateRadialSpreadScene = (cardData: CardData, template: ARDisplayTemplate): string => {
  return `
    <!-- Radial Info Spread Template -->
    <a-entity id="radial-spread" position="0 0 0">
      <!-- Center Profile -->
      <a-sphere
        position="0 0 0"
        radius="0.3"
        material="color: #4A90E2"
        text="value: ${cardData.username.charAt(0)}; align: center; color: white; width: 12"
        animation="property: rotation; to: 0 360 0; loop: true; dur: 8000"
      ></a-sphere>
      
      <!-- Info Cards around center -->
      <!-- Phone Card -->
      <a-box
        position="0.8 0.5 0"
        width="0.6"
        height="0.3"
        depth="0.05"
        material="color: #50C878; opacity: 0.9"
        text="value: 📱\\n${cardData.phone}; align: center; color: white; width: 8"
        animation="property: position; from: 0 0 0; to: 0.8 0.5 0; dur: 1000; delay: 500"
      ></a-box>
      
      <!-- Email Card -->
      <a-box
        position="-0.8 0.5 0"
        width="0.6"
        height="0.3"
        depth="0.05"
        material="color: #FF6B6B; opacity: 0.9"
        text="value: ✉️\\n${cardData.email}; align: center; color: white; width: 6"
        animation="property: position; from: 0 0 0; to: -0.8 0.5 0; dur: 1000; delay: 700"
      ></a-box>
      
      <!-- Company Card -->
      <a-box
        position="0 -0.8 0"
        width="0.8"
        height="0.3"
        depth="0.05"
        material="color: #4ECDC4; opacity: 0.9"
        text="value: 🏢\\n${cardData.company || 'Company'}; align: center; color: white; width: 6"
        animation="property: position; from: 0 0 0; to: 0 -0.8 0; dur: 1000; delay: 900"
      ></a-box>
    </a-entity>
  `;
};

const generateHologramScene = (cardData: CardData, template: ARDisplayTemplate): string => {
  return `
    <!-- Hologram Effect Template -->
    <a-entity id="hologram-display" position="0 0 0">
      <!-- Hologram Base -->
      <a-cylinder
        position="0 -0.5 0"
        radius="1"
        height="0.1"
        material="color: #00FFFF; opacity: 0.3; transparent: true"
        animation="property: material.opacity; to: 0.1; direction: alternate; repeat: indefinite; dur: 1000"
      ></a-cylinder>
      
      <!-- Main Hologram Panel -->
      <a-plane
        position="0 0 0"
        width="2"
        height="1.5"
        material="color: #00FFFF; opacity: 0.7; transparent: true"
        text="value: ${cardData.username}\\n${cardData.title || ''}\\n\\n📱 ${cardData.phone}\\n✉️ ${cardData.email}; align: center; color: #00FFFF; width: 8"
      >
        <!-- Scan Lines Effect -->
        <a-animation
          attribute="material.opacity"
          to="0.3"
          direction="alternate"
          repeat="indefinite"
          dur="800"
        ></a-animation>
      </a-plane>
      
      <!-- Particle Effects -->
      <a-entity
        position="0 0 0"
        particle-system="preset: snow; particleCount: 50; color: #00FFFF,#0080FF"
      ></a-entity>
    </a-entity>
  `;
};

const generateInteractiveDashboardScene = (cardData: CardData, template: ARDisplayTemplate): string => {
  return `
    <!-- Interactive Dashboard Template -->
    <a-entity id="interactive-dashboard" position="0 0 0">
      <!-- Main Panel -->
      <a-box
        position="0 0 0"
        width="2.5"
        height="1.8"
        depth="0.1"
        material="color: #F8F9FA; opacity: 0.95"
      >
        <!-- Header -->
        <a-text
          position="0 0.7 0.06"
          value="${cardData.username}"
          color="#333"
          width="8"
          align="center"
        ></a-text>
        
        <!-- Interactive Buttons -->
        <a-box
          id="phone-btn"
          position="-0.6 0.2 0.06"
          width="0.4"
          height="0.2"
          depth="0.05"
          material="color: #007BFF"
          text="value: 📱; align: center; color: white; width: 12"
          class="interactive"
        ></a-box>
        
        <a-box
          id="email-btn"
          position="0 0.2 0.06"
          width="0.4"
          height="0.2"
          depth="0.05"
          material="color: #28A745"
          text="value: ✉️; align: center; color: white; width: 12"
          class="interactive"
        ></a-box>
        
        <a-box
          id="web-btn"
          position="0.6 0.2 0.06"
          width="0.4"
          height="0.2"
          depth="0.05"
          material="color: #FFC107"
          text="value: 🌐; align: center; color: white; width: 12"
          class="interactive"
        ></a-box>
        
        <!-- Info Display -->
        <a-text
          position="0 -0.2 0.06"
          value="Phone: ${cardData.phone}\\nEmail: ${cardData.email}\\nCompany: ${cardData.company || 'N/A'}"
          color="#666"
          width="4"
          align="center"
        ></a-text>
      </a-box>
    </a-entity>
  `;
};

const generateMinimalCleanScene = (cardData: CardData, template: ARDisplayTemplate): string => {
  return `
    <!-- Minimal Clean Template -->
    <a-entity id="minimal-clean" position="0 0 0">
      <!-- Clean Card -->
      <a-plane
        position="0 0 0"
        width="2"
        height="1.2"
        material="color: white; opacity: 0.95"
        geometry="primitive: plane"
      >
        <!-- Simple Text Layout -->
        <a-text
          position="0 0.4 0.01"
          value="${cardData.username}"
          color="#333"
          width="8"
          align="center"
        ></a-text>
        
        <a-text
          position="0 0.1 0.01"
          value="${cardData.title || 'Professional'}"
          color="#666"
          width="6"
          align="center"
        ></a-text>
        
        <a-text
          position="0 -0.1 0.01"
          value="${cardData.phone}"
          color="#333"
          width="5"
          align="center"
        ></a-text>
        
        <a-text
          position="0 -0.3 0.01"
          value="${cardData.email}"
          color="#333"
          width="4"
          align="center"
        ></a-text>
      </a-plane>
      
      <!-- Gentle Float Animation -->
      <a-animation
        attribute="position"
        to="0 0.05 0"
        direction="alternate"
        repeat="indefinite"
        dur="3000"
      ></a-animation>
    </a-entity>
  `;
};
