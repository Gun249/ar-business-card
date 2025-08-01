"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorIcon from '../icons/ErrorIcon';
import CheckIcon from '../icons/CheckIcon';

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
}

interface ARViewerPageProps {
  cardData?: CardData;
}

type ARStatus = 'loading' | 'ready' | 'error';

let arScriptsLoaded: boolean = false;

const ARViewerPage: React.FC<ARViewerPageProps> = ({ cardData: initialCardData }) => {
  const [status, setStatus] = useState<ARStatus>(arScriptsLoaded ? 'ready' : 'loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  // ข้อมูลจำลองสำหรับนามบัตรส่วนตัว
  const defaultMockData: CardData = {
    // User-facing content for the business card
    username: "Gunnapat",
    title: "Full-Stack Developer",
    profilePicture: "https://placehold.co/256x256/EFEFEF/000000?text=G",
    phone: "081-234-5678",
    email: "gun.dev@example.com"
  };

  const cardData = initialCardData || defaultMockData;

  // Effect to load external scripts ONCE.
  useEffect(() => {
    if (arScriptsLoaded) {
      setStatus('ready');
      return;
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
  }, []);

  // Effect to build the A-Frame scene and manage page styles.
  useEffect(() => {
    if (status !== 'ready') {
      return;
    }
    
    const styleId = "ar-viewer-style-override";
    const styleElement = document.createElement('style');
    styleElement.id = styleId;
    styleElement.innerHTML = `
      html, body {
        background: transparent !important;
        background-color: transparent !important;
      }
    `;
    document.head.appendChild(styleElement);

    const container = containerRef.current;
    if (!container) return;

    // Build the scene HTML string using the business card data.
    const sceneHTML = `
      <a-scene mindar-image="imageTargetSrc: mind/targets.mind; autoStart: true; uiLoading: yes; uiScanning: yes; uiError: yes;" color-space="sRGB" renderer="colorManagement: true, physicallyCorrectLights" vr-mode-ui="enabled: false" device-orientation-permission-ui="enabled: false" embedded>
          <a-assets>
              <img id="profilePic" src="${cardData.profilePicture}" crossorigin="anonymous" />
          </a-assets>
          <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>
          <a-entity mindar-image-target="targetIndex: 0">
              
              <!-- Business Card Background -->
              <a-plane color="#FFF" opacity="0.9" position="0 0 0" height="0.552" width="1" rotation="0 0 0"></a-plane>

              <!-- Profile Picture (as a circle) -->
              <a-circle src="#profilePic" radius="0.15" position="-0.3 0 0.01"></a-circle>

              <!-- Text Information -->
              <a-text value="${cardData.username}" color="#000" align="left" width="2" position="-0.05 0.18 0.01" font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"></a-text>
              <a-text value="${cardData.title}" color="#555" align="left" width="1.5" position="-0.05 0.10 0.01" font="https://cdn.aframe.io/fonts/Exo2SemiBold.fnt"></a-text>
              
              <!-- Line Separator -->
              <a-plane color="#BBB" height="0.01" width="0.45" position="0.175 0.04 0.01"></a-plane>

              <a-text value="Tel: ${cardData.phone}" color="#007BFF" align="left" width="1.5" position="-0.05 -0.05 0.01"></a-text>
              <a-text value="${cardData.email}" color="#007BFF" align="left" width="1.5" position="-0.05 -0.15 0.01"></a-text>

          </a-entity>
      </a-scene>
    `;

    container.innerHTML = sceneHTML;
    const sceneEl = container.querySelector('a-scene') as AFrameScene | null;

    const onReady = (): void => {
        toast("AR พร้อมใช้งานแล้ว! กรุณาเล็งกล้องไปที่ Marker", {
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
      const styleTag = document.getElementById(styleId);
      if (styleTag) {
        styleTag.remove();
      }
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
  }, [status, cardData]); // Re-run effect if status or cardData changes.


  // Render UI based on the current status
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999 }}>
      {status === 'loading' && (
        <div className="flex flex-col justify-center items-center h-full bg-gray-900 bg-opacity-80">
          <LoadingSpinner />
          <p className="mt-4 text-lg text-white">กำลังโหลดไลบรารี AR...</p>
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
      <div ref={containerRef} style={{ width: '100%', height: '100%', display: status === 'ready' ? 'block' : 'none' }} />
    </div>
  );
};

export default ARViewerPage;
