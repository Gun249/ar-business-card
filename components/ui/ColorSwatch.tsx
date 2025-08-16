import React from 'react';

interface ColorSwatchProps {
  color: string;
  title: string;
  size?: 'sm' | 'md' | 'lg';
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ color, title, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  };

  // Convert hex color to Tailwind background classes if possible
  const getBackgroundClass = (hexColor: string): string => {
    const colorMap: { [key: string]: string } = {
      '#007BFF': 'bg-blue-500',
      '#4A90E2': 'bg-blue-400',
      '#50C878': 'bg-green-500',
      '#FF6B6B': 'bg-red-400',
      '#4ECDC4': 'bg-teal-400',
      '#45B7D1': 'bg-sky-400',
      '#2C3E50': 'bg-slate-700',
      '#34495E': 'bg-slate-600',
      '#3498DB': 'bg-blue-500',
      '#8E44AD': 'bg-purple-600',
      '#9B59B6': 'bg-purple-500',
      '#E74C3C': 'bg-red-500',
      '#1A1A2E': 'bg-gray-900',
      '#FFFFFF': 'bg-white',
      '#ECF0F1': 'bg-gray-100',
    };

    return colorMap[hexColor] || 'bg-gray-400';
  };

  const backgroundClass = getBackgroundClass(color);

  return (
    <div 
      className={`${sizeClasses[size]} rounded-full border border-gray-300 ${backgroundClass} shadow-sm`}
      title={title}
    />
  );
};

export default ColorSwatch;
