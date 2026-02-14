'use client';

import { createContext, useContext, ReactNode, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { type LootItem } from '@/lib/types';
import { story } from '@/lib/story';

const initialSceneId = story[0]?.id || 'start';

interface GameStateContextType {
  currentSceneId: string;
  inventory: LootItem[];
  advanceStory: (sceneId: string) => void;
  addLootToInventory: (item: LootItem) => void;
  hasLoot: (itemName: string) => boolean;
  resetJourney: () => void;
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export function GameStateProvider({ children }: { children: ReactNode }) {
  const [currentSceneId, setCurrentSceneId] = useLocalStorage<string>('lootquest_sceneId', initialSceneId);
  const [inventory, setInventory] = useLocalStorage<LootItem[]>('lootquest_inventory', []);

  const advanceStory = (sceneId: string) => {
    setCurrentSceneId(sceneId);
  };

  const addLootToInventory = useCallback((item: LootItem) => {
    setInventory((prevInventory) => {
      if (prevInventory.some(i => i.name === item.name)) {
        return prevInventory;
      }
      return [...prevInventory, item];
    });
  }, [setInventory]);
  
  const hasLoot = useCallback((itemName: string) => {
    return inventory.some(item => item.name === itemName);
  }, [inventory]);

  const resetJourney = () => {
    setCurrentSceneId(initialSceneId);
    setInventory([]);
  };

  const value = {
    currentSceneId,
    inventory,
    advanceStory,
    addLootToInventory,
    hasLoot,
    resetJourney,
  };

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
}
