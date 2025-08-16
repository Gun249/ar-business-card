"use client";
import React from 'react';
import { getARDisplayTemplate } from '@/lib/ar/display-templates';
import { CardData } from '@/types/ar-templates';

interface ARDisplayPreviewProps {
  templateId: string;
  cardData: CardData;
  className?: string;
}

const ARDisplayPreview: React.FC<ARDisplayPreviewProps> = ({ 
  templateId, 
  cardData, 
  className = ""
}) => {
  // Debug logs
  console.log('🎭 ARDisplayPreview rendering:', {
    templateId,
    cardData: cardData?.username,
    className
  });

  const template = getARDisplayTemplate(templateId);
  
  console.log('📋 AR Display Template found:', template?.name || 'NOT FOUND');
  
  if (!template) {
    console.log('❌ AR Display Template not found for ID:', templateId);
    return (
      <div className={`w-full h-48 bg-red-200 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-red-500">AR Display Template "{templateId}" not found</span>
      </div>
    );
  }

  // Create visual preview based on AR display template
  const renderPreview = () => {
    console.log('🎨 Rendering AR display preview for template:', templateId);
    
    switch (templateId) {
      case 'floating-card-3d':
        console.log('✅ Rendering floating-card-3d template');
        return (
          <div className="relative w-full h-full bg-gradient-to-br from-blue-50 via-blue-100 to-purple-100 overflow-hidden rounded-lg">
            {/* Debug indicator */}
            <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-1 rounded z-20">
              3D FLOATING
            </div>
            
            {/* Base Business Card (ที่จะสแกน) - ใหญ่ขึ้น */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-20 bg-white rounded shadow-lg border border-gray-300">
              <div className="p-2 text-sm text-gray-700">
                <div className="font-bold truncate">{cardData.username}</div>
                <div className="text-xs text-gray-500 truncate">{cardData.title || 'Professional'}</div>
                <div className="text-xs text-gray-600 truncate mt-1">{cardData.company || 'Company'}</div>
              </div>
            </div>
            
            {/* AR Effect - Floating Card Above - เล็กลง */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-24 h-16">
              <div className="w-full h-full bg-white rounded-lg shadow-2xl border-2 border-blue-200 transform rotate-3 animate-bounce">
                {/* Profile */}
                <div className="absolute left-2 top-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                    {cardData.username.charAt(0)}
                  </div>
                </div>
                
                {/* Info */}
                <div className="absolute left-8 top-2">
                  <div className="text-xs font-bold text-gray-800 truncate">{cardData.username}</div>
                  <div className="text-xs text-gray-600 truncate">{cardData.title || 'Pro'}</div>
                </div>
                
                {/* Contact */}
                <div className="absolute bottom-1 left-2 text-xs text-gray-700">
                  <div className="truncate">📱 {cardData.phone}</div>
                </div>
                
                {/* 3D Effect Lines */}
                <div className="absolute inset-0 border-2 border-blue-300 rounded-lg transform translate-x-0.5 translate-y-0.5 opacity-30"></div>
              </div>
            </div>
            
            {/* Scanner Animation */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-36 h-24 border-2 border-blue-400 rounded animate-pulse opacity-60"></div>
          </div>
        );

      case 'info-spread-radial':
        console.log('✅ Rendering info-spread-radial template');
        return (
          <div className="relative w-full h-full bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden rounded-lg">
            {/* Debug indicator */}
            <div className="absolute top-1 right-1 bg-purple-500 text-white text-xs px-1 rounded z-20">
              RADIAL SPREAD
            </div>
            
            {/* Base Business Card (ที่จะสแกน) - ใหญ่ขึ้น */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-20 bg-white rounded shadow-lg border border-gray-300">
              <div className="p-2 text-sm text-gray-700">
                <div className="font-bold truncate">{cardData.username}</div>
                <div className="text-xs text-gray-500 truncate">{cardData.title || 'Professional'}</div>
                <div className="text-xs text-gray-600 truncate mt-1">{cardData.company || 'Company'}</div>
              </div>
            </div>
            
            {/* AR Effect - Center Profile - เล็กลง */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold animate-spin-slow">
                {cardData.username.charAt(0)}
              </div>
            </div>
            
            {/* Orbiting Info Cards - เล็กลง */}
            <div className="absolute top-8 right-8 w-12 h-6 bg-green-400 rounded text-xs text-white flex items-center justify-center animate-pulse">
              📱
            </div>
            <div className="absolute top-8 left-8 w-12 h-6 bg-red-400 rounded text-xs text-white flex items-center justify-center animate-pulse">
              ✉️
            </div>
            <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-16 h-6 bg-teal-400 rounded text-xs text-white flex items-center justify-center animate-pulse">
              🏢
            </div>
            
            {/* Connection Lines */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
              <div className="w-12 h-0.5 bg-purple-300 absolute -top-4 -left-6 rotate-45 animate-pulse"></div>
              <div className="w-12 h-0.5 bg-purple-300 absolute -top-4 left-6 -rotate-45 animate-pulse"></div>
              <div className="w-12 h-0.5 bg-purple-300 absolute top-6 left-0 animate-pulse"></div>
            </div>
          </div>
        );

      case 'hologram-effect':
        console.log('✅ Rendering hologram-effect template');
        return (
          <div className="relative w-full h-full bg-gradient-to-br from-gray-900 via-blue-900 to-black overflow-hidden rounded-lg">
            {/* Debug indicator */}
            <div className="absolute top-1 right-1 bg-cyan-500 text-white text-xs px-1 rounded z-20">
              HOLOGRAM
            </div>
            
            {/* Base Business Card (ที่จะสแกน) - ใหญ่ขึ้น */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-20 bg-gray-800 rounded shadow-lg border border-cyan-400">
              <div className="p-2 text-sm text-cyan-300">
                <div className="font-bold truncate">{cardData.username}</div>
                <div className="text-xs text-cyan-500 truncate">{cardData.title || 'Professional'}</div>
                <div className="text-xs text-cyan-400 truncate mt-1">{cardData.company || 'Company'}</div>
              </div>
            </div>
            
            {/* Hologram Base */}
            <div className="absolute bottom-22 left-1/2 transform -translate-x-1/2 w-36 h-2 bg-cyan-400 rounded-full opacity-30 animate-pulse"></div>
            
            {/* AR Effect - Hologram Panel - เล็กลง */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-28 h-20 bg-cyan-400 bg-opacity-20 rounded border border-cyan-400 animate-pulse">
              <div className="p-1 text-center text-cyan-300 text-xs">
                <div className="font-bold truncate">{cardData.username}</div>
                <div className="mt-1 truncate">{cardData.title || 'Pro'}</div>
                <div className="mt-1 truncate">📱 {cardData.phone}</div>
                <div className="truncate">✉️ {cardData.email}</div>
              </div>
              
              {/* Scan Lines */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-20 animate-bounce"></div>
            </div>
            
            {/* Particle Effect - เล็กลง */}
            <div className="absolute inset-0">
              <div className="absolute top-4 left-4 w-0.5 h-0.5 bg-cyan-400 rounded-full animate-ping"></div>
              <div className="absolute top-8 right-6 w-0.5 h-0.5 bg-cyan-400 rounded-full animate-ping delay-500"></div>
              <div className="absolute top-12 left-8 w-0.5 h-0.5 bg-cyan-400 rounded-full animate-ping delay-1000"></div>
            </div>
            
            {/* Hologram Projection Lines */}
            <div className="absolute bottom-22 left-1/2 transform -translate-x-1/2">
              <div className="w-0.5 h-16 bg-cyan-400 opacity-50 animate-pulse"></div>
              <div className="w-0.5 h-16 bg-cyan-400 opacity-30 animate-pulse absolute -left-2"></div>
              <div className="w-0.5 h-16 bg-cyan-400 opacity-30 animate-pulse absolute left-2"></div>
            </div>
          </div>
        );

      case 'interactive-dashboard':
        console.log('✅ Rendering interactive-dashboard template');
        return (
          <div className="relative w-full h-full bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden rounded-lg">
            {/* Debug indicator */}
            <div className="absolute top-1 right-1 bg-blue-600 text-white text-xs px-1 rounded z-20">
              INTERACTIVE
            </div>
            
            {/* Base Business Card (ที่จะสแกน) - ใหญ่ขึ้น */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-20 bg-white rounded shadow-lg border border-gray-300">
              <div className="p-2 text-sm text-gray-700">
                <div className="font-bold truncate">{cardData.username}</div>
                <div className="text-xs text-gray-500 truncate">{cardData.title || 'Professional'}</div>
                <div className="text-xs text-gray-600 truncate mt-1">{cardData.company || 'Company'}</div>
              </div>
            </div>
            
            {/* AR Effect - Dashboard Panel - เล็กลง */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-28 h-20 bg-white rounded-lg shadow-lg border border-gray-200">
              {/* Header */}
              <div className="text-center py-1 border-b border-gray-200">
                <div className="text-xs font-bold text-gray-800 truncate">{cardData.username}</div>
              </div>
              
              {/* Interactive Buttons */}
              <div className="flex justify-center space-x-1 mt-1">
                <button className="w-6 h-4 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors">
                  📱
                </button>
                <button className="w-6 h-4 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors">
                  ✉️
                </button>
                <button className="w-6 h-4 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600 transition-colors">
                  🌐
                </button>
              </div>
              
              {/* Info Display */}
              <div className="p-1 text-xs text-gray-600 text-center">
                <div className="truncate">{cardData.phone}</div>
                <div className="truncate">{cardData.email}</div>
              </div>
            </div>
            
            {/* Connection Lines to Card */}
            <div className="absolute bottom-22 left-1/2 transform -translate-x-1/2">
              <div className="w-0.5 h-8 bg-blue-400 opacity-50 animate-pulse"></div>
            </div>
          </div>
        );

      case 'minimal-clean':
        console.log('✅ Rendering minimal-clean template');
        return (
          <div className="relative w-full h-full bg-gradient-to-br from-gray-50 to-white overflow-hidden rounded-lg">
            {/* Debug indicator */}
            <div className="absolute top-1 right-1 bg-gray-500 text-white text-xs px-1 rounded z-20">
              MINIMAL
            </div>
            
            {/* Base Business Card (ที่จะสแกน) - ใหญ่ขึ้น */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-20 bg-white rounded shadow-lg border border-gray-300">
              <div className="p-2 text-sm text-gray-700">
                <div className="font-bold truncate">{cardData.username}</div>
                <div className="text-xs text-gray-500 truncate">{cardData.title || 'Professional'}</div>
                <div className="text-xs text-gray-600 truncate mt-1">{cardData.company || 'Company'}</div>
              </div>
            </div>
            
            {/* AR Effect - Clean Layout - เล็กลง */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-28 h-20 bg-white rounded-lg shadow-md border border-gray-100 flex flex-col justify-center items-center p-2">
              <div className="text-center space-y-1">
                <div className="text-xs font-bold text-gray-800 truncate">{cardData.username}</div>
                <div className="text-xs text-gray-600 truncate">{cardData.title || 'Professional'}</div>
                <div className="text-xs text-gray-700 truncate">{cardData.phone}</div>
                <div className="text-xs text-gray-700 truncate">{cardData.email}</div>
              </div>
            </div>
            
            {/* Gentle Animation Effect */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-28 h-20 border border-gray-200 rounded-lg animate-pulse opacity-50"></div>
            
            {/* Subtle Connection Line */}
            <div className="absolute bottom-22 left-1/2 transform -translate-x-1/2">
              <div className="w-0.5 h-8 bg-gray-300 opacity-50 animate-pulse"></div>
            </div>
          </div>
        );

      default:
        return (
          <div className={`w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center`}>
            <div className="text-center">
              <div className="text-2xl mb-2">🎭</div>
              <span className="text-gray-600 text-sm">{template.name}</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`ar-display-preview ${className}`}>
      {renderPreview()}
      {/* Template Label */}
      <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
        {template.name}
      </div>
    </div>
  );
};

export default ARDisplayPreview;
