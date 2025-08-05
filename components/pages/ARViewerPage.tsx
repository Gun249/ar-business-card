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
    if (status !== 'ready') {
      return;
    }

    const container = containerRef.current;
    if (!container) return;

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
          <a-entity mindar-image-target="targetIndex: 0">
              
              <!-- Base Card (Center) -->
              <a-plane color="#FFFFFF" opacity="0.95" position="0 0 0" height="0.55" width="1" rotation="0 0 0">
                <!-- Card Border -->
                <a-plane color="none" geometry="primitive: plane; width: 1.05; height: 0.58" 
                         position="0 0 -0.001" 
                         material="shader: standard; transparent: true; opacity: 0.3; color: #007BFF">
                </a-plane>
              </a-plane>

              <!-- Profile Picture (Center Left of Card) -->
              <a-entity position="-0.25 0 0.01">
                <a-circle src="#profilePic" radius="0.15" position="0 0 0">
                  <!-- Profile Border Animation -->
                  <a-ring color="#007BFF" radius-inner="0.16" radius-outer="0.17" position="0 0 -0.001" opacity="0.8"
                          animation="property: rotation; to: 0 0 360; dur: 8000; loop: true"></a-ring>
                </a-circle>
              </a-entity>

              <!-- Name on Card (Right of Profile) -->
              <a-text value="${cardData.username}" color="#333" align="left" width="3" position="0.05 0.1 0.01" 
                      font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"></a-text>

              <!-- Floating Information Panels Around Card -->
              
              <!-- Job Title Panel (Above Card) -->
              <a-entity position="0 0.45 0.02" 
                        animation="property: position; to: 0 0.5 0.02; dur: 2000; loop: true; dir: alternate; easing: easeInOutSine">
                <a-plane color="#4A90E2" opacity="0.9" position="0 0 0" height="0.12" width="0.6" rotation="0 0 0">
                  <a-text value="ตำแหน่ง" color="#FFF" align="center" width="3" position="0 0.03 0.001" 
                          font="https://cdn.aframe.io/fonts/Exo2SemiBold.fnt"></a-text>
                  <a-text value="${cardData.title}" color="#FFF" align="center" width="2.5" position="0 -0.025 0.001" 
                          font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"></a-text>
                </a-plane>
                <!-- Title Icon -->
                <a-circle color="#FFF" radius="0.04" position="0 0.08 0.001">
                  <a-text value="💼" color="#4A90E2" align="center" width="6" position="0 0 0.001"></a-text>
                </a-circle>
              </a-entity>

              <!-- Phone Panel (Right Side) -->
              <a-entity position="0.7 0.1 0.03" 
                        animation="property: position; to: 0.75 0.1 0.03; dur: 2500; loop: true; dir: alternate; easing: easeInOutSine; delay: 500">
                <a-plane color="#50C878" opacity="0.9" position="0 0 0" height="0.15" width="0.45" rotation="0 0 0">
                  <a-text value="โทรศัพท์" color="#FFF" align="center" width="3" position="0 0.04 0.001" 
                          font="https://cdn.aframe.io/fonts/Exo2SemiBold.fnt"></a-text>
                  <a-text value="${cardData.phone}" color="#FFF" align="center" width="2.2" position="0 -0.02 0.001" 
                          font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"></a-text>
                </a-plane>
                <!-- Phone Icon with animation -->
                <a-circle color="#FFF" radius="0.04" position="0 0.1 0.001"
                          animation="property: rotation; to: 0 0 360; dur: 3000; loop: true">
                  <a-text value="📞" color="#50C878" align="center" width="6" position="0 0 0.001"></a-text>
                </a-circle>
                <!-- Connecting line to card -->
                <a-cylinder color="#50C878" radius="0.003" height="0.35" position="-0.15 0 0.01" 
                           rotation="0 0 -20" opacity="0.6"
                           animation="property: material.opacity; to: 1; dur: 1500; loop: true; dir: alternate"></a-cylinder>
              </a-entity>

              <!-- Email Panel (Left Side) -->
              <a-entity position="-0.7 -0.1 0.04" 
                        animation="property: position; to: -0.75 -0.1 0.04; dur: 2300; loop: true; dir: alternate; easing: easeInOutSine; delay: 1000">
                <a-plane color="#FF6B6B" opacity="0.9" position="0 0 0" height="0.15" width="0.5" rotation="0 0 0">
                  <a-text value="อีเมล" color="#FFF" align="center" width="3" position="0 0.04 0.001" 
                          font="https://cdn.aframe.io/fonts/Exo2SemiBold.fnt"></a-text>
                  <a-text value="${cardData.email}" color="#FFF" align="center" width="2" position="0 -0.02 0.001" 
                          font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"></a-text>
                </a-plane>
                <!-- Email Icon with pulse animation -->
                <a-circle color="#FFF" radius="0.04" position="0 0.1 0.001"
                          animation="property: scale; to: 1.2 1.2 1.2; dur: 1500; loop: true; dir: alternate">
                  <a-text value="✉️" color="#FF6B6B" align="center" width="6" position="0 0 0.001"></a-text>
                </a-circle>
                <!-- Connecting line to card -->
                <a-cylinder color="#FF6B6B" radius="0.003" height="0.4" position="0.15 0.05 0.01" 
                           rotation="0 0 25" opacity="0.6"
                           animation="property: material.opacity; to: 1; dur: 1800; loop: true; dir: alternate; delay: 300"></a-cylinder>
              </a-entity>

              <!-- Contact Info Panel (Bottom) -->
              <a-entity position="0 -0.45 0.05" 
                        animation="property: position; to: 0 -0.5 0.05; dur: 2800; loop: true; dir: alternate; easing: easeInOutSine; delay: 1500">
                <a-plane color="#9B59B6" opacity="0.9" position="0 0 0" height="0.12" width="0.8" rotation="0 0 0">
                  <a-text value="ติดต่อเพิ่มเติม" color="#FFF" align="center" width="3" position="0 0.03 0.001" 
                          font="https://cdn.aframe.io/fonts/Exo2SemiBold.fnt"></a-text>
                  <a-text value="สแกน QR Code หรือแตะเพื่อบันทึก" color="#FFF" align="center" width="2.5" position="0 -0.025 0.001" 
                          font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"></a-text>
                </a-plane>
                <!-- QR Icon -->
                <a-circle color="#FFF" radius="0.04" position="0 0.08 0.001">
                  <a-text value="📱" color="#9B59B6" align="center" width="6" position="0 0 0.001"></a-text>
                </a-circle>
              </a-entity>

              <!-- Decorative Floating Elements -->
              
              <!-- Animated Particles around the card -->
              <a-entity position="0.5 0.3 0.1">
                <a-sphere color="#4A90E2" radius="0.008" opacity="0.7"
                          animation="property: position; to: 0.6 0.4 0.15; dur: 4000; loop: true; dir: alternate; easing: easeInOutSine"></a-sphere>
              </a-entity>
              <a-entity position="-0.5 0.3 0.1">
                <a-sphere color="#50C878" radius="0.006" opacity="0.6"
                          animation="property: position; to: -0.6 0.4 0.12; dur: 3500; loop: true; dir: alternate; easing: easeInOutSine; delay: 1000"></a-sphere>
              </a-entity>
              <a-entity position="0.4 -0.3 0.08">
                <a-sphere color="#FF6B6B" radius="0.007" opacity="0.5"
                          animation="property: position; to: 0.5 -0.4 0.13; dur: 3800; loop: true; dir: alternate; easing: easeInOutSine; delay: 500"></a-sphere>
              </a-entity>
              <a-entity position="-0.4 -0.3 0.09">
                <a-sphere color="#9B59B6" radius="0.005" opacity="0.4"
                          animation="property: position; to: -0.5 -0.4 0.14; dur: 4200; loop: true; dir: alternate; easing: easeInOutSine; delay: 1200"></a-sphere>
              </a-entity>

              <!-- Orbit Ring Animation -->
              <a-entity position="0 0 0.01">
                <a-ring color="#007BFF" radius-inner="0.6" radius-outer="0.61" position="0 0 0" opacity="0.3"
                        animation="property: rotation; to: 0 0 360; dur: 15000; loop: true"></a-ring>
                <a-ring color="#4A90E2" radius-inner="0.65" radius-outer="0.66" position="0 0 0.001" opacity="0.2"
                        animation="property: rotation; to: 0 0 -360; dur: 20000; loop: true"></a-ring>
              </a-entity>

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
    <div className="fixed inset-0 w-screen h-screen z-[9999] overflow-hidden">
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
      <div 
        ref={containerRef} 
        className={`w-full h-full ${status === 'ready' ? 'block' : 'hidden'}`}
      />
    </div>
  );
};

export default ARViewerPage;