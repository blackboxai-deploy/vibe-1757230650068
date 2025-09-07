"use client";

import { useState, useEffect, useCallback } from 'react';

export type PetMood = 'happy' | 'neutral' | 'hungry' | 'sad' | 'excited';

export interface PetState {
  name: string;
  hunger: number; // 0-100, 0 = starving, 100 = full
  mood: PetMood;
  lastFed: number; // timestamp
  feedCooldown: number; // seconds remaining
}

const HUNGER_DECAY_RATE = 1; // hunger points lost per minute
const FEED_AMOUNT = 30; // hunger points gained when feeding
const FEED_COOLDOWN_DURATION = 5; // seconds
const EXCITEMENT_DURATION = 10; // seconds

export function usePetGame() {
  const [petState, setPetState] = useState<PetState>({
    name: 'Pixel',
    hunger: 50,
    mood: 'neutral',
    lastFed: Date.now(),
    feedCooldown: 0,
  });

  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Load pet data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('pixelPetData');
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        setPetState(parsedData);
      } catch (error) {
        console.error('Failed to load pet data:', error);
      }
    }
  }, []);

  // Save pet data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pixelPetData', JSON.stringify(petState));
  }, [petState]);

  // Calculate mood based on hunger level
  const calculateMood = useCallback((hunger: number, isExcited: boolean): PetMood => {
    if (isExcited) return 'excited';
    if (hunger <= 10) return 'sad';
    if (hunger <= 30) return 'hungry';
    if (hunger >= 80) return 'happy';
    return 'neutral';
  }, []);

  // Update pet state every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const timeDiff = now - lastUpdate;
      
      setPetState(prev => {
        // Calculate hunger decay (1 point per minute)
        const minutesPassed = timeDiff / (1000 * 60);
        const hungerLoss = minutesPassed * HUNGER_DECAY_RATE;
        const newHunger = Math.max(0, prev.hunger - hungerLoss);
        
        // Reduce feed cooldown
        const newCooldown = Math.max(0, prev.feedCooldown - 1);
        
        // Check if still excited (within excitement duration after feeding)
        const secondsSinceFed = (now - prev.lastFed) / 1000;
        const isExcited = secondsSinceFed < EXCITEMENT_DURATION;
        
        const newMood = calculateMood(newHunger, isExcited);
        
        return {
          ...prev,
          hunger: newHunger,
          mood: newMood,
          feedCooldown: newCooldown,
        };
      });
      
      setLastUpdate(now);
    }, 1000);

    return () => clearInterval(interval);
  }, [lastUpdate, calculateMood]);

  // Feed the pet
  const feedPet = useCallback(() => {
    if (petState.feedCooldown > 0) return false;

    setPetState(prev => {
      const newHunger = Math.min(100, prev.hunger + FEED_AMOUNT);
      const now = Date.now();
      
      return {
        ...prev,
        hunger: newHunger,
        lastFed: now,
        feedCooldown: FEED_COOLDOWN_DURATION,
        mood: 'excited', // Immediately become excited when fed
      };
    });
    
    return true;
  }, [petState.feedCooldown]);

  // Change pet name
  const changeName = useCallback((newName: string) => {
    if (newName.trim().length === 0) return false;
    
    setPetState(prev => ({
      ...prev,
      name: newName.trim(),
    }));
    
    return true;
  }, []);

  // Get hunger level as percentage
  const getHungerPercentage = () => Math.round(petState.hunger);

  // Get mood description
  const getMoodDescription = () => {
    switch (petState.mood) {
      case 'happy': return '😊 Happy';
      case 'excited': return '🤩 Excited';
      case 'neutral': return '😐 Neutral';
      case 'hungry': return '😋 Hungry';
      case 'sad': return '😢 Sad';
      default: return '😐 Neutral';
    }
  };

  return {
    petState,
    feedPet,
    changeName,
    getHungerPercentage,
    getMoodDescription,
    canFeed: petState.feedCooldown === 0,
    feedCooldownTime: petState.feedCooldown,
  };
}