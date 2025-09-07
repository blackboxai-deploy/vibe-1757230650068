"use client";

import { PetMood } from '@/hooks/usePetGame';
import { useEffect, useState } from 'react';

interface PixelPetProps {
  mood: PetMood;
  name: string;
  hunger: number;
}

export default function PixelPet({ mood, name, hunger }: PixelPetProps) {
  const [animationKey, setAnimationKey] = useState(0);

  // Trigger re-animation when mood changes
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [mood]);

  // Get pet colors based on mood and hunger
  const getPetColors = () => {
    switch (mood) {
      case 'happy':
        return {
          body: 'bg-gradient-to-br from-yellow-400 to-orange-400',
          eyes: 'bg-black',
          accent: 'bg-pink-400',
        };
      case 'excited':
        return {
          body: 'bg-gradient-to-br from-pink-400 to-purple-400',
          eyes: 'bg-black',
          accent: 'bg-yellow-300',
        };
      case 'neutral':
        return {
          body: 'bg-gradient-to-br from-blue-400 to-cyan-400',
          eyes: 'bg-black',
          accent: 'bg-white',
        };
      case 'hungry':
        return {
          body: 'bg-gradient-to-br from-orange-300 to-yellow-300',
          eyes: 'bg-black',
          accent: 'bg-red-300',
        };
      case 'sad':
        return {
          body: 'bg-gradient-to-br from-gray-400 to-blue-400',
          eyes: 'bg-black',
          accent: 'bg-blue-200',
        };
      default:
        return {
          body: 'bg-gradient-to-br from-blue-400 to-cyan-400',
          eyes: 'bg-black',
          accent: 'bg-white',
        };
    }
  };

  // Get animation class based on mood
  const getAnimationClass = () => {
    switch (mood) {
      case 'happy':
        return 'animate-bounce';
      case 'excited':
        return 'animate-pulse animate-bounce';
      case 'neutral':
        return 'animate-pulse';
      case 'hungry':
        return 'animate-ping';
      case 'sad':
        return 'animate-pulse opacity-75';
      default:
        return 'animate-pulse';
    }
  };

  const colors = getPetColors();
  const animationClass = getAnimationClass();

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Pet Name */}
      <div className="text-2xl font-bold text-white text-center">
        {name}
      </div>

      {/* Pet Container */}
      <div className="relative">
        {/* Particle effects for excited mood */}
        {mood === 'excited' && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={`particle-${animationKey}-${i}`}
                className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-ping"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1.5s',
                }}
              />
            ))}
          </div>
        )}

        {/* Main Pet Body */}
        <div className={`
          relative w-32 h-32 rounded-2xl ${colors.body} ${animationClass}
          shadow-2xl transform transition-all duration-300
          ${mood === 'excited' ? 'scale-110' : 'scale-100'}
          ${mood === 'sad' ? 'transform rotate-1' : ''}
        `}>
          
          {/* Pet Eyes */}
          <div className="absolute top-6 left-6 w-4 h-4 rounded-full bg-black">
            <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full"></div>
          </div>
          <div className="absolute top-6 right-6 w-4 h-4 rounded-full bg-black">
            <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full"></div>
          </div>

          {/* Pet Mouth/Nose */}
          <div className={`absolute top-14 left-1/2 transform -translate-x-1/2 w-3 h-2 rounded-full ${colors.accent}`}></div>

          {/* Pet Cheeks */}
          <div className={`absolute top-12 left-2 w-3 h-3 rounded-full ${colors.accent} opacity-60`}></div>
          <div className={`absolute top-12 right-2 w-3 h-3 rounded-full ${colors.accent} opacity-60`}></div>

          {/* Pet Arms */}
          <div className={`absolute top-20 -left-2 w-6 h-4 rounded-full ${colors.body} ${animationClass}`}></div>
          <div className={`absolute top-20 -right-2 w-6 h-4 rounded-full ${colors.body} ${animationClass}`}></div>

          {/* Pet Feet */}
          <div className={`absolute -bottom-2 left-4 w-4 h-6 rounded-full ${colors.body}`}></div>
          <div className={`absolute -bottom-2 right-4 w-4 h-6 rounded-full ${colors.body}`}></div>

          {/* Mood-specific decorations */}
          {mood === 'hungry' && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="text-2xl animate-bounce">🍎</div>
            </div>
          )}

          {mood === 'sad' && (
            <div className="absolute top-8 left-8">
              <div className="w-1 h-6 bg-blue-300 rounded-full opacity-70 animate-pulse"></div>
            </div>
          )}

          {mood === 'happy' && (
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <div className="text-xl animate-bounce">✨</div>
            </div>
          )}
        </div>
      </div>

      {/* Mood Display */}
      <div className="text-center">
        <div className="text-xl font-semibold text-white mb-2">
          Mood: <span className="text-yellow-300">{mood.charAt(0).toUpperCase() + mood.slice(1)}</span>
        </div>
        
        {/* Hunger Bar */}
        <div className="w-48 bg-gray-700 rounded-full h-4 mb-2">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              hunger > 60 ? 'bg-green-500' : 
              hunger > 30 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${hunger}%` }}
          ></div>
        </div>
        <div className="text-sm text-purple-200">
          Hunger: {Math.round(hunger)}%
        </div>
      </div>
    </div>
  );
}