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
    <html lang="th">
      <head>
        <Script src="https://aframe.io/releases/1.5.0/aframe.min.js" strategy="beforeInteractive"></Script>
        <Script src="https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-aframe.prod.js" strategy="beforeInteractive"></Script>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
