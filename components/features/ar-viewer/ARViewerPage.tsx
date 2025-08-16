"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorIcon from '@/components/icons/ErrorIcon';
import CheckIcon from '@/components/icons/CheckIcon';
import { api } from '@/lib/api';
import { generateARScene, getARTemplate } from '@/lib/ar/templates';
import { generateARDisplayScene, getARDisplayTemplate } from '@/lib/ar/display-templates';
import { CardData as ARCardData } from '@/types/ar-templates';

/**
 * ARViewerPage component for displaying a dynamic AR experience using A-Frame and MindAR.
 * It now accepts a `cardData` prop to dynamically configure the AR scene.
 * A default mock data object for a personal business card is used.
 */

// Types for A-Frame elements
interface AFrameScene extends Element {
  hasLoaded?: boolean;
  systems?: {
    'mindar-image'?: {
      running?: boolean;
      stop?: () => void;
    };
  };
}

// Types
interface CardData {
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
  targetIndex?: number; // Add targetIndex for AR marker
  cardId?: string | number; // Add cardId for database lookup
  templateId?: string; // AR Template ID
}

interface ARViewerPageProps {
  cardData?: CardData;
  cardId?: string | number; // Allow passing cardId to fetch from database
  templateId?: string; // Allow overriding template
}

type ARStatus = 'loading' | 'ready' | 'error';

let arScriptsLoaded: boolean = false;

const ARViewerPage: React.FC<ARViewerPageProps> = ({ cardData: initialCardData, cardId, templateId }) => {
  const [status, setStatus] = useState<ARStatus>(arScriptsLoaded ? 'ready' : 'loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [currentTemplateId, setCurrentTemplateId] = useState<string>('classic-business');
  const containerRef = useRef<HTMLDivElement>(null);

  // ข้อมูลจำลองสำหรับนามบัตรส่วนตัว
  const defaultMockData: CardData = {
    // User-facing content for the business card
    username: "Gunnapat",
    title: "Full-Stack Developer",
    profilePicture: "https://placehold.co/256x256/EFEFEF/000000?text=G",
    phone: "081-234-5678",
    email: "gun.dev@example.com",
    targetIndex: 0, // Default target index
    templateId: 'classic-business' // Default template
  };

  // Effect to load card data from database if cardId is provided
  useEffect(() => {
    const loadCardData = async () => {
      if (cardId && !initialCardData) {
        try {
          setStatus('loading');
          const arContent = await api.getARContent(cardId);
          const loadedCardData: CardData = {
            username: arContent.cardData.name || "ไม่ระบุชื่อ",
            title: arContent.cardData.title || "ไม่ระบุตำแหน่ง",
            profilePicture: arContent.cardData.profilePicture || defaultMockData.profilePicture,
            phone: arContent.cardData.phone || "ไม่ระบุเบอร์โทร",
            email: arContent.cardData.email || "ไม่ระบุอีเมล",
            company: arContent.cardData.company,
            website: arContent.cardData.website,
            targetIndex: arContent.cardData.targetIndex || 0, // Use targetIndex from database
            templateId: arContent.cardData.templateId || templateId || 'classic-business', // Use template from DB or prop
            cardId: cardId
          };
          setCardData(loadedCardData);
          setCurrentTemplateId(loadedCardData.templateId || 'classic-business');
          if (arScriptsLoaded) {
            setStatus('ready');
          }
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'ไม่สามารถโหลดข้อมูลนามบัตรได้';
          setErrorMessage(errorMsg);
          setStatus('error');
        }
      } else {
        // Use provided cardData or default mock data
        const finalCardData = initialCardData || defaultMockData;
        setCardData(finalCardData);
        setCurrentTemplateId(finalCardData.templateId || templateId || 'classic-business');
        if (arScriptsLoaded) {
          setStatus('ready');
        }
      }
    };

    loadCardData();
  }, [cardId, initialCardData, templateId]); // Load data when cardId, initialCardData, or templateId changes

  // Effect to load external scripts ONCE.
  useEffect(() => {
    if (arScriptsLoaded) {
      setStatus('ready');
      return;
    }

    // Hide address bar on mobile devices
    const hideAddressBar = () => {
      if (window.innerHeight < window.outerHeight) {
        window.scrollTo(0, 1);
      }
    };

    // Mobile specific initialization
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      // Basic mobile setup without forcing fullscreen
      const hideAddressBar = () => {
        if (window.innerHeight < window.outerHeight) {
          window.scrollTo(0, 1);
        }
      };
      
      setTimeout(hideAddressBar, 1000);
      window.addEventListener('orientationchange', hideAddressBar);
    }

    const loadScript = (src: string, id: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.id = id;
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`ไม่สามารถโหลดสคริปต์ได้จาก: ${src}`));
        document.body.appendChild(script);
      });
    };

    const initializeAR = async (): Promise<void> => {
      try {
        await loadScript("https://aframe.io/releases/1.6.0/aframe.min.js", "aframe-script");
        await loadScript("https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js", "mindar-script");
        arScriptsLoaded = true;
        setStatus('ready');
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ';
        setErrorMessage(errorMsg);
        setStatus('error');
      }
    };

    initializeAR();

    // Cleanup function
    return () => {
      if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        const hideAddressBar = () => {
          if (window.innerHeight < window.outerHeight) {
            window.scrollTo(0, 1);
          }
        };
        window.removeEventListener('orientationchange', hideAddressBar);
      }
    };
  }, []);

  // Effect to build the A-Frame scene.
  useEffect(() => {
    if (status !== 'ready' || !cardData) {
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // Use the targetIndex from cardData (either from database or default)
    const targetIndex = cardData.targetIndex || 0;

    // Get AR Template and generate scene
    const arTemplate = getARTemplate(currentTemplateId);
    let sceneContent: string;
    
    if (arTemplate) {
      // Use AR Template to generate scene
      sceneContent = generateARScene(currentTemplateId, cardData as ARCardData) || '';
      
      // Show template name in toast
      toast(`กำลังใช้ Template: ${arTemplate.name}`, {
        icon: <CheckIcon />,
        duration: 3000,
      });
    } else {
      // Fallback to default scene if template not found
      sceneContent = generateDefaultScene(cardData);
      toast(`ใช้ Template เริ่มต้น (ไม่พบ Template: ${currentTemplateId})`, {
        duration: 3000,
      });
    }

    // Build the scene HTML string using the business card data.
    const sceneHTML = `
      <a-scene 
        mindar-image="imageTargetSrc: mind/targets.mind; autoStart: true; uiLoading: yes; uiScanning: yes; uiError: yes;" 
        color-space="sRGB" 
        renderer="colorManagement: true, physicallyCorrectLights, antialias: true, alpha: true, preserveDrawingBuffer: true" 
        vr-mode-ui="enabled: false" 
        device-orientation-permission-ui="enabled: false" 
        embedded>
          <a-assets>
              <img id="profilePic" src="${cardData.profilePicture}" crossorigin="anonymous" />
          </a-assets>
          <a-camera 
            position="0 0 0" 
            look-controls="enabled: false"
            camera="fov: 60; aspect: ${window.innerWidth / window.innerHeight}; near: 0.1; far: 1000">
          </a-camera>
          <a-entity mindar-image-target="targetIndex: ${targetIndex}">
            ${sceneContent}
          </a-entity>
      </a-scene>
    `;

    container.innerHTML = sceneHTML;
    const sceneEl = container.querySelector('a-scene') as AFrameScene | null;

    const onReady = (): void => {
        toast(`AR พร้อมใช้งานแล้ว! กรุณาเล็งกล้องไปที่ Marker (Target ${targetIndex})`, {
            icon: <CheckIcon />,
            duration: 5000,
        });
    };

    if (sceneEl?.hasLoaded) {
      onReady();
    } else if (sceneEl) {
      sceneEl.addEventListener('loaded', onReady, { once: true });
    }

    // Cleanup function
    return () => {
      const currentSceneEl = containerRef.current?.querySelector('a-scene') as AFrameScene | null;
      if (currentSceneEl) {
        currentSceneEl.removeEventListener('loaded', onReady);
        const mindarSystem = currentSceneEl.systems?.['mindar-image'];
        if (mindarSystem?.running) {
          mindarSystem.stop?.();
        }
        currentSceneEl.remove();
      }
    };
  }, [status, cardData, currentTemplateId]); // Re-run effect if status, cardData, or template changes.

  // Generate default scene if no template is found
  const generateDefaultScene = (cardData: CardData): string => {
    return `
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

      <!-- Title -->
      <a-text value="${cardData.title}" color="#333" align="left" width="2.5" position="0.05 0.0 0.01" 
              font="https://cdn.aframe.io/fonts/Exo2SemiBold.fnt"></a-text>

      <!-- Phone -->
      <a-text value="${cardData.phone}" color="#007BFF" align="left" width="2" position="0.05 -0.1 0.01" 
              font="https://cdn.aframe.io/fonts/Exo2SemiBold.fnt"></a-text>

      <!-- Email -->
      <a-text value="${cardData.email}" color="#007BFF" align="left" width="1.8" position="0.05 -0.2 0.01" 
              font="https://cdn.aframe.io/fonts/Exo2SemiBold.fnt"></a-text>
    `;
  };


  // Render UI based on the current status
  return (
    <div className="fixed inset-0 w-screen h-screen z-[9999] overflow-hidden">
      {status === 'loading' && (
        <div className="flex flex-col justify-center items-center h-full bg-gray-900 bg-opacity-80">
          <LoadingSpinner />
          <p className="mt-4 text-lg text-white">
            {cardId ? 'กำลังโหลดข้อมูลจากฐานข้อมูลและไลบรารี AR...' : 'กำลังโหลดไลบรารี AR...'}
          </p>
        </div>
      )}
      {status === 'error' && (
        <div className="flex flex-col justify-center items-center h-full bg-gray-900 bg-opacity-80 text-red-500 p-4 text-center">
          <ErrorIcon className="w-16 h-16 mb-4" />
          <h2 className="text-2xl font-bold text-white">เกิดข้อผิดพลาด</h2>
          <p>{errorMessage}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            ลองอีกครั้ง
          </Button>
        </div>
      )}
      {cardData && (
        <div 
          ref={containerRef} 
          className={`w-full h-full ${status === 'ready' ? 'block' : 'hidden'}`}
        />
      )}
    </div>
  );
};

export default ARViewerPage;