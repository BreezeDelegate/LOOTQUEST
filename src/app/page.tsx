'use client';

import { useState, useEffect, useMemo } from 'react';
import { useGameState } from '@/contexts/game-state-context';
import { story as storyData } from '@/lib/story';
import type { StoryScene, LootItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LootDetailModal from '@/components/loot-detail-modal';
import { AnimatePresence, motion } from 'framer-motion';

export default function JourneyPage() {
  const { currentSceneId, advanceStory, hasLoot, addLootToInventory } = useGameState();
  const [discoveredLoot, setDiscoveredLoot] = useState<{name: string, type: string, imageId: string} | null>(null);
  const [generatedLoot, setGeneratedLoot] = useState<LootItem | null>(null);

  const currentScene = useMemo(() => storyData.find((s) => s.id === currentSceneId), [currentSceneId]);

  useEffect(() => {
    if (currentScene?.loot && !hasLoot(currentScene.loot.name)) {
      setDiscoveredLoot(currentScene.loot);
    }
  }, [currentScene, hasLoot]);

  const handleChoice = (nextSceneId: string) => {
    advanceStory(nextSceneId);
  };

  const handleLootAdded = (item: LootItem) => {
    addLootToInventory(item);
    setGeneratedLoot(item);
  };
  
  const handleCloseModal = () => {
    setDiscoveredLoot(null);
    setGeneratedLoot(null);
  }

  if (!currentScene) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Story not found. The path is lost...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start pt-10">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/10">
            <CardHeader>
              <CardTitle className="font-headline text-3xl">A Fictive Journey</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed text-foreground/80 whitespace-pre-wrap">{currentScene.text}</p>
              <div className="mt-8 space-y-4">
                {currentScene.choices.map((choice, index) => (
                  <Button
                    key={index}
                    onClick={() => handleChoice(choice.nextSceneId)}
                    className="w-full justify-start"
                    variant="ghost"
                  >
                    {choice.text}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {(discoveredLoot || generatedLoot) && (
        <LootDetailModal
          isOpen={true}
          onClose={handleCloseModal}
          lootDiscovery={discoveredLoot}
          initialLootItem={generatedLoot}
          onLootAdded={handleLootAdded}
        />
      )}
    </div>
  );
}
