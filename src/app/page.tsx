"use client";

import { useState } from 'react';
import PixelPet from '@/components/PixelPet';
import { usePetGame } from '@/hooks/usePetGame';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PetGamePage() {
  const {
    petState,
    feedPet,
    changeName,
    getHungerPercentage,
    getMoodDescription,
    canFeed,
    feedCooldownTime,
  } = usePetGame();

  const [nameInput, setNameInput] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);

  const handleFeed = () => {
    if (feedPet()) {
      // Success feedback could go here
      console.log('Pet fed successfully!');
    }
  };

  const handleNameChange = () => {
    if (nameInput.trim() && changeName(nameInput)) {
      setIsEditingName(false);
      setNameInput('');
    }
  };

  const handleNameEdit = () => {
    setIsEditingName(true);
    setNameInput(petState.name);
  };

  const formatLastFed = () => {
    const timeDiff = Date.now() - petState.lastFed;
    const minutes = Math.floor(timeDiff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Welcome Message */}
      <div className="text-center text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome to your Pixel Pet!</h2>
        <p className="text-purple-200">
          Take care of your virtual companion by feeding it regularly and watch its mood change!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Pet Display - Center Column */}
        <div className="lg:col-span-2 order-1 lg:order-1">
          <Card className="bg-black/30 border-purple-500/30 backdrop-blur-sm">
            <CardContent className="pt-8">
              <PixelPet 
                mood={petState.mood}
                name={petState.name}
                hunger={getHungerPercentage()}
              />
            </CardContent>
          </Card>
        </div>

        {/* Controls Panel */}
        <div className="order-2 lg:order-2 space-y-6">
          
          {/* Pet Name Card */}
          <Card className="bg-black/30 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-center">Pet Name</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isEditingName ? (
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-300 mb-2">{petState.name}</p>
                  <Button 
                    onClick={handleNameEdit}
                    variant="outline" 
                    className="bg-purple-600/20 border-purple-400 text-purple-200 hover:bg-purple-600/40"
                  >
                    Rename Pet
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Input
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Enter new name"
                    className="bg-black/30 border-purple-400 text-white placeholder:text-purple-300"
                    maxLength={15}
                  />
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleNameChange}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      disabled={!nameInput.trim()}
                    >
                      Save
                    </Button>
                    <Button 
                      onClick={() => setIsEditingName(false)}
                      variant="outline"
                      className="flex-1 bg-gray-600/20 border-gray-400 text-gray-200 hover:bg-gray-600/40"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Feed Button Card */}
          <Card className="bg-black/30 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-center">Feed Your Pet</CardTitle>
              <CardDescription className="text-center text-purple-200">
                Keep your pet happy and well-fed!
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Button
                onClick={handleFeed}
                disabled={!canFeed}
                className={`w-full text-xl py-6 transition-all duration-300 ${
                  canFeed 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transform hover:scale-105 shadow-lg' 
                    : 'bg-gray-600 cursor-not-allowed opacity-50'
                }`}
              >
                {canFeed ? (
                  <>🍎 Feed Pet 🍎</>
                ) : (
                  <>⏰ Wait {feedCooldownTime}s</>
                )}
              </Button>
              
              {!canFeed && (
                <p className="text-sm text-orange-200">
                  Your pet is still digesting! Wait a moment before feeding again.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Pet Stats Card */}
          <Card className="bg-black/30 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-center">Pet Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-purple-200">Mood:</span>
                <span className="text-yellow-300 font-semibold">{getMoodDescription()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-purple-200">Hunger:</span>
                <span className={`font-semibold ${
                  getHungerPercentage() > 60 ? 'text-green-400' :
                  getHungerPercentage() > 30 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {getHungerPercentage()}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-purple-200">Last Fed:</span>
                <span className="text-blue-300">{formatLastFed()}</span>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Game Instructions */}
      <Card className="bg-black/20 border-purple-500/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white text-center">How to Play</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <div className="text-3xl">🎮</div>
              <h3 className="text-white font-semibold">Name Your Pet</h3>
              <p className="text-purple-200 text-sm">
                Give your pixel companion a unique name by clicking the "Rename Pet" button.
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">🍎</div>
              <h3 className="text-white font-semibold">Feed Regularly</h3>
              <p className="text-purple-200 text-sm">
                Keep your pet happy by feeding it regularly. Watch out for the cooldown timer!
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">😊</div>
              <h3 className="text-white font-semibold">Watch Moods</h3>
              <p className="text-purple-200 text-sm">
                Your pet's mood changes based on hunger level, with different animations for each state.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}