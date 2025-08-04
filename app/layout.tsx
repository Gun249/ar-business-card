import "./globals.css"
import Script from 'next/script';
import { ReactNode } from 'react';

export const metadata = {
  title: "AR Business Card",
  description: "สร้างและจัดการนามบัตร AR ของคุณ"
}

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="th" className="h-full overflow-hidden">
      <head>
        <Script src="https://aframe.io/releases/1.5.0/aframe.min.js" strategy="beforeInteractive"></Script>
        <Script src="https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-aframe.prod.js" strategy="beforeInteractive"></Script>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#000000" />
        <style dangerouslySetInnerHTML={{
          __html: `
            * { box-sizing: border-box; margin: 0; padding: 0; }
            html, body, #__next, main { 
              width: 100% !important; 
              height: 100% !important; 
              overflow: hidden !important;
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              right: 0 !important;
              bottom: 0 !important;
            }
            
            /* Force all video elements to be fullscreen */
            video {
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              right: 0 !important;
              bottom: 0 !important;
              width: 100vw !important;
              height: 100vh !important;
              object-fit: cover !important;
              z-index: 1 !important;
            }
            
            /* Force A-Frame canvas to be fullscreen */
            a-scene, a-scene canvas {
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              right: 0 !important;
              bottom: 0 !important;
              width: 100vw !important;
              height: 100vh !important;
              z-index: 10000 !important;
            }
            
            @media screen and (max-width: 768px) {
              html, body, #__next, main {
                height: -webkit-fill-available !important;
                height: 100vh !important;
                width: 100vw !important;
              }
              
              video {
                height: -webkit-fill-available !important;
                height: 100vh !important;
              }
              
              a-scene, a-scene canvas {
                height: -webkit-fill-available !important;
                height: 100vh !important;
              }
            }
          `
        }} />
      </head>
      <body className="antialiased h-full overflow-hidden fixed inset-0">{children}</body>
    </html>
  )
}
