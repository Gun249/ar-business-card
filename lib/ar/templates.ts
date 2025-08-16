import { ARTemplate, CardData } from '../types/ar-templates';

// Template 1: Classic Business Card
const classicBusinessTemplate: ARTemplate = {
  id: 'classic-business',
  name: 'Classic Business',
  description: 'เทมเพลตธุรกิจคลาสสิค เหมาะสำหรับมืออาชีพ',
  category: 'business',
  preview: '/ar-templates/classic-preview.jpg',
  colors: {
    primary: '#007BFF',
    secondary: '#4A90E2',
    accent: '#50C878',
    background: '#FFFFFF',
    text: '#333333'
  },
  layout: {
    type: 'floating-panels',
    spacing: 0.7,
    scale: 1.0
  },
  scene: (cardData: CardData) => `
    <!-- Base Card (Center) -->
    <a-plane color="#FFFFFF" opacity="0.95" position="0 0 0" height="0.55" width="1" rotation="0 0 0">
      <a-plane color="none" geometry="primitive: plane; width: 1.05; height: 0.58" 
               position="0 0 -0.001" 
               material="shader: standard; transparent: true; opacity: 0.3; color: #007BFF">
      </a-plane>
    </a-plane>

    <!-- Profile Picture -->
    <a-entity position="-0.25 0 0.01">
      <a-circle src="#profilePic" radius="0.15" position="0 0 0">
        <a-ring color="#007BFF" radius-inner="0.16" radius-outer="0.17" position="0 0 -0.001" opacity="0.8"
                animation="property: rotation; to: 0 0 360; dur: 8000; loop: true"></a-ring>
      </a-circle>
    </a-entity>

    <!-- Name -->
    <a-text value="${cardData.username}" color="#333" align="left" width="3" position="0.05 0.1 0.01" 
            font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"></a-text>

    <!-- Job Title Panel -->
    <a-entity position="0 0.45 0.02" 
              animation="property: position; to: 0 0.5 0.02; dur: 2000; loop: true; dir: alternate; easing: easeInOutSine">
      <a-plane color="#4A90E2" opacity="0.9" position="0 0 0" height="0.12" width="0.6" rotation="0 0 0">
        <a-text value="ตำแหน่ง" color="#FFF" align="center" width="3" position="0 0.03 0.001" 
                font="https://cdn.aframe.io/fonts/Exo2SemiBold.fnt"></a-text>
        <a-text value="${cardData.title}" color="#FFF" align="center" width="2.5" position="0 -0.025 0.001" 
                font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"></a-text>
      </a-plane>
    </a-entity>

    <!-- Phone Panel -->
    <a-entity position="0.7 0.1 0.03" 
              animation="property: position; to: 0.75 0.1 0.03; dur: 2500; loop: true; dir: alternate; easing: easeInOutSine; delay: 500">
      <a-plane color="#50C878" opacity="0.9" position="0 0 0" height="0.15" width="0.45" rotation="0 0 0">
        <a-text value="โทรศัพท์" color="#FFF" align="center" width="3" position="0 0.04 0.001" 
                font="https://cdn.aframe.io/fonts/Exo2SemiBold.fnt"></a-text>
        <a-text value="${cardData.phone}" color="#FFF" align="center" width="2.2" position="0 -0.02 0.001" 
                font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"></a-text>
      </a-plane>
    </a-entity>

    <!-- Email Panel -->
    <a-entity position="-0.7 -0.1 0.04" 
              animation="property: position; to: -0.75 -0.1 0.04; dur: 2300; loop: true; dir: alternate; easing: easeInOutSine; delay: 1000">
      <a-plane color="#FF6B6B" opacity="0.9" position="0 0 0" height="0.15" width="0.5" rotation="0 0 0">
        <a-text value="อีเมล" color="#FFF" align="center" width="3" position="0 0.04 0.001" 
                font="https://cdn.aframe.io/fonts/Exo2SemiBold.fnt"></a-text>
        <a-text value="${cardData.email}" color="#FFF" align="center" width="2" position="0 -0.02 0.001" 
                font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"></a-text>
      </a-plane>
    </a-entity>
  `
};

// Template 2: Modern Creative
const modernCreativeTemplate: ARTemplate = {
  id: 'modern-creative',
  name: 'Modern Creative',
  description: 'เทมเพลตสร้างสรรค์สมัยใหม่ เหมาะสำหรับนักออกแบบและคนครีเอทีฟ',
  category: 'creative',
  preview: '/ar-templates/creative-preview.jpg',
  colors: {
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    accent: '#45B7D1',
    background: '#2C3E50',
    text: '#FFFFFF'
  },
  layout: {
    type: 'circular',
    spacing: 0.8,
    scale: 1.2
  },
  scene: (cardData: CardData) => `
    <!-- Central Profile Sphere -->
    <a-entity position="0 0 0">
      <a-sphere src="#profilePic" radius="0.2" position="0 0 0"
                animation="property: rotation; to: 0 360 0; dur: 10000; loop: true">
        <a-ring color="#FF6B6B" radius-inner="0.22" radius-outer="0.25" position="0 0 0" opacity="0.7"
                animation="property: rotation; to: 0 0 360; dur: 5000; loop: true"></a-ring>
      </a-sphere>
    </a-entity>

    <!-- Orbiting Information Cards -->
    <a-entity position="0 0 0" animation="property: rotation; to: 0 360 0; dur: 20000; loop: true">
      <!-- Name Card -->
      <a-entity position="0.6 0.3 0">
        <a-plane color="#4ECDC4" opacity="0.9" height="0.3" width="0.8" rotation="0 -30 0">
          <a-text value="${cardData.username}" color="#2C3E50" align="center" width="4" position="0 0.05 0.001" 
                  font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"></a-text>
          <a-text value="${cardData.title}" color="#2C3E50" align="center" width="3" position="0 -0.05 0.001" 
                  font="https://cdn.aframe.io/fonts/Exo2SemiBold.fnt"></a-text>
        </a-plane>
      </a-entity>

      <!-- Contact Card -->
      <a-entity position="-0.6 -0.3 0">
        <a-plane color="#45B7D1" opacity="0.9" height="0.3" width="0.8" rotation="0 30 0">
          <a-text value="${cardData.phone}" color="#FFFFFF" align="center" width="3" position="0 0.05 0.001" 
                  font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"></a-text>
          <a-text value="${cardData.email}" color="#FFFFFF" align="center" width="2.5" position="0 -0.05 0.001" 
                  font="https://cdn.aframe.io/fonts/Exo2SemiBold.fnt"></a-text>
        </a-plane>
      </a-entity>
    </a-entity>

    <!-- Floating Particles -->
    <a-entity position="0.8 0.5 0.2">
      <a-sphere color="#FF6B6B" radius="0.02" opacity="0.8"
                animation="property: position; to: -0.8 -0.5 -0.2; dur: 8000; loop: true; dir: alternate"></a-sphere>
    </a-entity>
    <a-entity position="-0.8 0.5 0.2">
      <a-sphere color="#4ECDC4" radius="0.015" opacity="0.6"
                animation="property: position; to: 0.8 -0.5 -0.2; dur: 12000; loop: true; dir: alternate; delay: 2000"></a-sphere>
    </a-entity>
  `
};

// Template 3: Minimal Professional
const minimalProfessionalTemplate: ARTemplate = {
  id: 'minimal-professional',
  name: 'Minimal Professional',
  description: 'เทมเพลตมินิมอลสำหรับมืออาชีพ สะอาดตาและเรียบง่าย',
  category: 'minimal',
  preview: '/ar-templates/minimal-preview.jpg',
  colors: {
    primary: '#2C3E50',
    secondary: '#34495E',
    accent: '#3498DB',
    background: '#ECF0F1',
    text: '#2C3E50'
  },
  layout: {
    type: 'vertical-stack',
    spacing: 0.3,
    scale: 0.8
  },
  scene: (cardData: CardData) => `
    <!-- Clean Base Card -->
    <a-plane color="#ECF0F1" opacity="0.95" position="0 0 0" height="0.8" width="1.2" rotation="0 0 0">
      <a-plane color="#34495E" geometry="primitive: plane; width: 1.22; height: 0.82" 
               position="0 0 -0.001" 
               material="shader: standard; transparent: true; opacity: 0.1">
      </a-plane>
    </a-plane>

    <!-- Minimal Profile -->
    <a-entity position="0 0.25 0.01">
      <a-circle src="#profilePic" radius="0.12" position="0 0 0">
        <a-ring color="#3498DB" radius-inner="0.13" radius-outer="0.14" position="0 0 -0.001" opacity="0.5"></a-ring>
      </a-circle>
    </a-entity>

    <!-- Name -->
    <a-text value="${cardData.username}" color="#2C3E50" align="center" width="4" position="0 0.05 0.01" 
            font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"></a-text>

    <!-- Title -->
    <a-text value="${cardData.title}" color="#34495E" align="center" width="3" position="0 -0.05 0.01" 
            font="https://cdn.aframe.io/fonts/Exo2SemiBold.fnt"></a-text>

    <!-- Contact Info -->
    <a-text value="${cardData.phone}" color="#3498DB" align="center" width="2.5" position="0 -0.15 0.01" 
            font="https://cdn.aframe.io/fonts/Exo2SemiBold.fnt"></a-text>
    
    <a-text value="${cardData.email}" color="#3498DB" align="center" width="2.2" position="0 -0.25 0.01" 
            font="https://cdn.aframe.io/fonts/Exo2SemiBold.fnt"></a-text>

    <!-- Subtle Animation -->
    <a-entity position="0 0 0.005">
      <a-ring color="#3498DB" radius-inner="0.6" radius-outer="0.61" position="0 0 0" opacity="0.2"
              animation="property: rotation; to: 0 0 360; dur: 30000; loop: true"></a-ring>
    </a-entity>
  `
};

// Template 4: Interactive Modern
const interactiveModernTemplate: ARTemplate = {
  id: 'interactive-modern',
  name: 'Interactive Modern',
  description: 'เทมเพลตโต้ตอบได้สมัยใหม่ มีปุ่มกดและเอฟเฟกต์พิเศษ',
  category: 'interactive',
  preview: '/ar-templates/interactive-preview.jpg',
  colors: {
    primary: '#8E44AD',
    secondary: '#9B59B6',
    accent: '#E74C3C',
    background: '#1A1A2E',
    text: '#FFFFFF'
  },
  layout: {
    type: 'grid',
    spacing: 0.4,
    scale: 1.1
  },
  scene: (cardData: CardData) => `
    <!-- Holographic Base -->
    <a-plane color="#1A1A2E" opacity="0.8" position="0 0 0" height="0.6" width="1.2" rotation="0 0 0"
             material="shader: standard; transparent: true; emissive: #8E44AD; emissiveIntensity: 0.2">
      <a-plane color="#8E44AD" geometry="primitive: plane; width: 1.25; height: 0.65" 
               position="0 0 -0.001" opacity="0.3"
               animation="property: material.emissiveIntensity; to: 0.5; dur: 2000; loop: true; dir: alternate">
      </a-plane>
    </a-plane>

    <!-- Floating Profile with Glow -->
    <a-entity position="-0.35 0.1 0.02">
      <a-circle src="#profilePic" radius="0.15" position="0 0 0"
                material="shader: standard; emissive: #9B59B6; emissiveIntensity: 0.3">
        <a-ring color="#E74C3C" radius-inner="0.16" radius-outer="0.18" position="0 0 -0.001" opacity="0.8"
                animation="property: rotation; to: 0 0 360; dur: 6000; loop: true"
                material="shader: standard; emissive: #E74C3C; emissiveIntensity: 0.5">
        </a-ring>
      </a-circle>
    </a-entity>

    <!-- Interactive Info Cards -->
    <a-entity position="0.25 0.15 0.02">
      <a-text value="${cardData.username}" color="#FFFFFF" align="left" width="3.5" position="0 0 0" 
              font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
              material="shader: standard; emissive: #FFFFFF; emissiveIntensity: 0.2"></a-text>
      <a-text value="${cardData.title}" color="#9B59B6" align="left" width="2.8" position="0 -0.08 0" 
              font="https://cdn.aframe.io/fonts/Exo2SemiBold.fnt"
              material="shader: standard; emissive: #9B59B6; emissiveIntensity: 0.3"></a-text>
    </a-entity>

    <!-- Interactive Buttons -->
    <a-entity position="0.25 -0.05 0.03">
      <!-- Phone Button -->
      <a-entity position="0 0 0" 
                animation="property: scale; to: 1.1 1.1 1.1; dur: 1000; loop: true; dir: alternate"
                class="clickable">
        <a-plane color="#E74C3C" opacity="0.9" height="0.08" width="0.25" rotation="0 0 0"
                 material="shader: standard; emissive: #E74C3C; emissiveIntensity: 0.3">
          <a-text value="📞" color="#FFFFFF" align="center" width="8" position="0 0 0.001"></a-text>
        </a-plane>
        <a-text value="${cardData.phone}" color="#FFFFFF" align="center" width="1.8" position="0 -0.06 0" 
                font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"></a-text>
      </a-entity>

      <!-- Email Button -->
      <a-entity position="0 -0.15 0" 
                animation="property: scale; to: 1.1 1.1 1.1; dur: 1200; loop: true; dir: alternate; delay: 500"
                class="clickable">
        <a-plane color="#8E44AD" opacity="0.9" height="0.08" width="0.25" rotation="0 0 0"
                 material="shader: standard; emissive: #8E44AD; emissiveIntensity: 0.3">
          <a-text value="✉️" color="#FFFFFF" align="center" width="8" position="0 0 0.001"></a-text>
        </a-plane>
        <a-text value="${cardData.email}" color="#FFFFFF" align="center" width="1.6" position="0 -0.06 0" 
                font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"></a-text>
      </a-entity>
    </a-entity>

    <!-- Particle System -->
    <a-entity position="0 0 0.1">
      <a-sphere color="#8E44AD" radius="0.005" opacity="0.8" position="0.5 0.3 0"
                animation="property: position; to: -0.5 -0.3 0.2; dur: 5000; loop: true; dir: alternate"
                material="shader: standard; emissive: #8E44AD; emissiveIntensity: 0.8"></a-sphere>
      <a-sphere color="#E74C3C" radius="0.008" opacity="0.6" position="-0.4 0.2 0"
                animation="property: position; to: 0.4 -0.2 0.15; dur: 7000; loop: true; dir: alternate; delay: 1000"
                material="shader: standard; emissive: #E74C3C; emissiveIntensity: 0.6"></a-sphere>
    </a-entity>
  `
};

// AR Template Registry
export const AR_TEMPLATES: { [key: string]: ARTemplate } = {
  'classic-business': classicBusinessTemplate,
  'modern-creative': modernCreativeTemplate,
  'minimal-professional': minimalProfessionalTemplate,
  'interactive-modern': interactiveModernTemplate,
};

// Helper functions
export const getARTemplate = (templateId: string): ARTemplate | null => {
  return AR_TEMPLATES[templateId] || null;
};

export const getAllARTemplates = (): ARTemplate[] => {
  return Object.values(AR_TEMPLATES);
};

export const getARTemplatesByCategory = (category: string): ARTemplate[] => {
  return Object.values(AR_TEMPLATES).filter(template => template.category === category);
};

export const generateARScene = (templateId: string, cardData: CardData): string | null => {
  const template = getARTemplate(templateId);
  if (!template) return null;
  
  return template.scene(cardData);
};
