"use client";
import React, { useState, useEffect, useRef } from 'react';
import { toast } from "sonner";
import CheckIcon from '../icons/CheckIcon';

/**
 * ARViewerPage component for displaying AR business card
 */

let arScriptsLoaded = false;

const ARViewerPage = ({ cardData: initialCardData }) => {
  const [status, setStatus] = useState(arScriptsLoaded ? 'ready' : 'loading');
  const [isScanning, setIsScanning] = useState(true);
  const containerRef = useRef(null);

  // ข้อมูลนามบัตร
  const defaultCardData = {
    username: "Kawnruthai Kunircharoen",
    title: "Associate Dean school of information technology",
    profilePicture: "https://placehold.co/256x256/EFEFEF/000000?text=Kawnruthai",
    phone: "062-407-1234",
    email: "Kawnruthai.k@bu.ac.th"
  };

  const cardData = initialCardData || defaultCardData;

  // โหลด AR Scripts
  useEffect(() => {
    if (arScriptsLoaded) {
      setStatus('ready');
      return;
    }

    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    const initAR = async () => {
      try {
        await loadScript("https://aframe.io/releases/1.6.0/aframe.min.js");
        await loadScript("https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js");
        arScriptsLoaded = true;
        setStatus('ready');
      } catch (error) {
        console.error('Error loading AR scripts:', error);
        setStatus('error');
      }
    };

    initAR();
  }, []);

  // สร้าง AR Scene
  useEffect(() => {
    if (status !== 'ready') return;

    // เพิ่ม CSS
    const style = document.createElement('style');
    style.innerHTML = `
      html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; }
      a-scene { 
        width: 100% !important; 
        height: 100% !important; 
        position: relative !important;
        z-index: 1 !important;
      }
      a-scene canvas {
        position: relative !important;
        z-index: 1 !important;
      }
      .a-enter-vr, .a-enter-ar, .a-exit-vr, .a-orientation-modal { display: none !important; }
      
      .scanner-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.3);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 5;
        pointer-events: none;
      }
      
      .scanner-frame {
        width: 250px;
        height: 250px;
        border: 2px solid #00ff00;
        position: relative;
        border-radius: 10px;
      }
      
      .scanner-corners {
        position: absolute;
        width: 100%;
        height: 100%;
      }
      
      .corner {
        position: absolute;
        width: 25px;
        height: 25px;
        border: 3px solid #00ff00;
      }
      
      .corner.tl { top: -3px; left: -3px; border-right: none; border-bottom: none; }
      .corner.tr { top: -3px; right: -3px; border-left: none; border-bottom: none; }
      .corner.bl { bottom: -3px; left: -3px; border-right: none; border-top: none; }
      .corner.br { bottom: -3px; right: -3px; border-left: none; border-top: none; }
      
      .scan-line {
        position: absolute;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, transparent, #00ff00, transparent);
        animation: scan 2s ease-in-out infinite alternate;
      }
      
      @keyframes scan {
        0% { top: 0; }
        100% { top: calc(100% - 2px); }
      }
      
      .scan-text {
        position: absolute;
        bottom: -40px;
        left: 50%;
        transform: translateX(-50%);
        color: #00ff00;
        font-size: 14px;
        text-align: center;
        font-weight: bold;
        text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
      }
    `;
    document.head.appendChild(style);

    const container = containerRef.current;
    if (!container) return;

    // สร้าง AR Scene
    container.innerHTML = `
      <a-scene 
        mindar-image="imageTargetSrc: mind/targets.mind; autoStart: true; uiLoading: no; uiScanning: no; uiError: no;" 
        vr-mode-ui="enabled: false" 
        device-orientation-permission-ui="enabled: false"
        embedded>
        
        <a-assets>
          <img id="profilePic" src="${cardData.profilePicture}" crossorigin="anonymous" />
        </a-assets>
        
        <a-camera position="0 0 0" look-controls="enabled: false" wasd-controls="enabled: false"></a-camera>
        
        <a-entity mindar-image-target="targetIndex: 0">
          <a-entity id="card" visible="false" scale="0 0 0">
            
            <!-- พื้นหลังนามบัตร -->
            <a-plane color="#ffffff" position="0 0 0" height="0.6" width="1.0" 
                     material="shader: standard; roughness: 0.1"></a-plane>
            
            <!-- แถบหัว -->
            <a-plane color="#2563eb" position="0 0.25 0.001" height="0.1" width="1.0"></a-plane>
            
            <!-- รูปโปรไฟล์ -->
            <a-entity position="-0.3 0.05 0.01">
              <a-circle color="#2563eb" radius="0.15"></a-circle>
              <a-circle src="#profilePic" radius="0.13" position="0 0 0.001"></a-circle>
            </a-entity>
            
            <!-- ข้อมูลข้อความ -->
            <a-text value="${cardData.username}" color="#1f2937" align="left" 
                    width="3" position="-0.05 0.15 0.01" 
                    font="roboto"></a-text>
            
            <a-text value="${cardData.title}" color="#2563eb" align="left" 
                    width="2.5" position="-0.05 0.08 0.01" 
                    font="roboto"></a-text>
            
            <!-- ข้อมูลติดต่อ -->
            <a-text value="📞 ${cardData.phone}" color="#374151" align="left" 
                    width="2.5" position="-0.05 -0.05 0.01" 
                    font="roboto"></a-text>
            
            <a-text value="📧 ${cardData.email}" color="#374151" align="left" 
                    width="2.2" position="-0.05 -0.15 0.01" 
                    font="roboto"></a-text>
            
            <!-- เอฟเฟกต์ -->
            <a-sphere color="#2563eb" opacity="0.3" radius="0.02" 
                      position="0.4 0.2 0.02" 
                      animation="property: position; to: 0.4 -0.2 0.02; dur: 3000; loop: true; dir: alternate"></a-sphere>
            
          </a-entity>
        </a-entity>
      </a-scene>
    `;

    const scene = container.querySelector('a-scene');
    
    scene.addEventListener('loaded', () => {
      console.log('A-Frame scene loaded');
      
      // ตรวจสอบ MindAR system
      setTimeout(() => {
        const mindARSystem = scene.systems['mindar-image'];
        console.log('MindAR system:', mindARSystem);
        
        if (mindARSystem) {
          console.log('MindAR status:', {
            running: mindARSystem.running,
            video: mindARSystem.video
          });
        }
        
        // ตรวจสอบ video element
        const video = document.querySelector('video');
        console.log('Video element:', video);
        if (video) {
          console.log('Video properties:', {
            videoWidth: video.videoWidth,
            videoHeight: video.videoHeight,
            readyState: video.readyState
          });
        }
      }, 2000);
      
      // ขออนุญาตใช้กล้อง
      navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      })
        .then((stream) => {
          console.log('Camera permission granted', stream);
          // ปิด stream เพราะ MindAR จะจัดการเอง
          stream.getTracks().forEach(track => track.stop());
        })
        .catch((err) => {
          console.error('Camera permission denied:', err);
          toast("กรุณาอนุญาตให้ใช้กล้อง");
        });
      
      const target = scene.querySelector('[mindar-image-target]');
      console.log('Target entity:', target);
      
      target.addEventListener('targetFound', () => {
        console.log('Target found!');
        setIsScanning(false);
        const card = scene.querySelector('#card');
        card.setAttribute('visible', 'true');
        card.setAttribute('animation', 'property: scale; from: 0 0 0; to: 1 1 1; dur: 800; easing: easeOutElastic');
        toast("พบมาร์กเกอร์! แสดงนามบัตร AR", { icon: <CheckIcon /> });
      });

      target.addEventListener('targetLost', () => {
        console.log('Target lost!');
        setIsScanning(true);
        const card = scene.querySelector('#card');
        card.setAttribute('animation', 'property: scale; from: 1 1 1; to: 0 0 0; dur: 400');
        setTimeout(() => card.setAttribute('visible', 'false'), 400);
      });
    });

    return () => {
      style.remove();
      if (container.querySelector('a-scene')) {
        container.innerHTML = '';
      }
    };
  }, [status, cardData]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      
      {/* AR Container - ต้องอยู่ด้านบนสุด */}
      <div ref={containerRef} style={{ 
        width: '100%', 
        height: '100%',
        position: 'relative',
        zIndex: 1
      }} />

      {/* Loading */}
      {status === 'loading' && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: '#1f2937',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          zIndex: 100
        }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '3px solid #374151',
            borderTop: '3px solid #60a5fa',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ marginTop: '16px' }}>กำลังโหลด AR...</p>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Scanner Overlay */}
      {status === 'ready' && isScanning && (
        <div className="scanner-overlay">
          <div className="scanner-frame">
            <div className="scanner-corners">
              <div className="corner tl"></div>
              <div className="corner tr"></div>
              <div className="corner bl"></div>
              <div className="corner br"></div>
            </div>
            <div className="scan-line"></div>
            <div className="scan-text">
              วางมาร์กเกอร์ในกรอบ<br/>
              เพื่อดูนามบัตร AR
            </div>
          </div>
          
          {/* Manual Camera Start Button */}
          <button
            onClick={() => {
              const scene = containerRef.current?.querySelector('a-scene');
              if (scene && scene.systems['mindar-image']) {
                console.log('Starting MindAR manually...');
                scene.systems['mindar-image'].start();
              }
            }}
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#00ff00',
              color: '#000',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              pointerEvents: 'auto'
            }}
          >
            เปิดกล้อง AR
          </button>
        </div>
      )}

      {/* Debug Info */}
      {status === 'ready' && (
        <div style={{
          position: 'absolute',
          top: 10,
          left: 10,
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '8px',
          fontSize: '11px',
          borderRadius: '4px',
          zIndex: 20,
          maxWidth: '200px'
        }}>
          AR Status: {status}<br/>
          Scanning: {isScanning ? 'Yes' : 'No'}<br/>
          Camera: {navigator.mediaDevices ? 'Available' : 'Not Available'}<br/>
          Scene: {containerRef.current?.querySelector('a-scene') ? 'Loaded' : 'Loading'}<br/>
          Video: {typeof document !== 'undefined' && document.querySelector('video') ? 'Found' : 'Not Found'}
        </div>
      )}

      {/* Error */}
      {status === 'error' && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: '#1f2937',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          zIndex: 100
        }}>
          <p style={{ color: '#ef4444', fontSize: '18px' }}>เกิดข้อผิดพลาดในการโหลด AR</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '16px',
              padding: '8px 16px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ลองใหม่
          </button>
        </div>
      )}

    </div>
  );
};

export default ARViewerPage;
