'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import { endings } from '@/game/content';
import {
  availableChoices,
  choose,
  clearLastLoot,
  createNewSave,
  getCollection,
  getLoot,
  getRunInventory,
  getScene,
  normalizeSave,
  resetEverything,
  restartRun,
  runProgress,
} from '@/game/engine';
import type { Ending, GameSave, LootItem, StoryChoice, StoryScene } from '@/game/types';
import { useLocalStorage } from '@/hooks/use-local-storage';

const SAVE_KEY = 'lootquest_save_v2';

interface GameStateContextType {
  save: GameSave;
  ready: boolean;
  currentScene: StoryScene;
  choices: StoryChoice[];
  runInventory: LootItem[];
  collection: LootItem[];
  discoveredLoot: LootItem | null;
  currentEnding: Ending | null;
  progress: number;
  startJourney: () => void;
  selectChoice: (choice: StoryChoice) => void;
  closeLoot: () => void;
  restartJourney: () => void;
  clearSave: () => void;
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export function GameStateProvider({ children }: { children: ReactNode }) {
  const [save, setSave, ready] = useLocalStorage<GameSave>(
    SAVE_KEY,
    createNewSave,
    normalizeSave
  );
  const migrated = useRef(false);

  useEffect(() => {
    if (!ready || migrated.current || save.collectionIds.length > 0) {
      return;
    }

    migrated.current = true;

    try {
      const legacyInventory = JSON.parse(
        window.localStorage.getItem('lootquest_inventory') ?? '[]'
      ) as Array<{ name?: string }>;
      const legacyIds = legacyInventory
        .map((item) => {
          if (item.name === 'Whispering Amulet') return 'whispering-amulet';
          if (item.name === 'Sunstone Gauntlet') return 'sunstone-gauntlet';
          return null;
        })
        .filter((id): id is string => !!id);

      if (legacyIds.length > 0) {
        setSave((current) => ({
          ...current,
          collectionIds: [...new Set([...current.collectionIds, ...legacyIds])],
        }));
      }
    } catch {
      // Invalid legacy data is ignored.
    }
  }, [ready, save.collectionIds.length, setSave]);

  const currentScene = useMemo(() => getScene(save.currentSceneId), [save.currentSceneId]);
  const choices = useMemo(
    () => availableChoices(save, currentScene),
    [currentScene, save]
  );
  const runInventory = useMemo(() => getRunInventory(save), [save]);
  const collection = useMemo(() => getCollection(save), [save]);
  const discoveredLoot = useMemo(() => getLoot(save.lastLootId), [save.lastLootId]);
  const currentEnding = useMemo(
    () => endings.find((ending) => ending.id === currentScene.endingId) ?? null,
    [currentScene.endingId]
  );
  const progress = useMemo(() => runProgress(save), [save]);

  const startJourney = useCallback(() => {
    setSave((current) => ({ ...current, hasStarted: true }));
  }, [setSave]);

  const selectChoice = useCallback(
    (choice: StoryChoice) => {
      setSave((current) => choose(current, choice));
    },
    [setSave]
  );

  const closeLoot = useCallback(() => {
    setSave((current) => clearLastLoot(current));
  }, [setSave]);

  const restartJourney = useCallback(() => {
    setSave((current) => restartRun(current));
  }, [setSave]);

  const clearSave = useCallback(() => {
    setSave(resetEverything());
  }, [setSave]);

  const value = useMemo(
    () => ({
      save,
      ready,
      currentScene,
      choices,
      runInventory,
      collection,
      discoveredLoot,
      currentEnding,
      progress,
      startJourney,
      selectChoice,
      closeLoot,
      restartJourney,
      clearSave,
    }),
    [
      save,
      ready,
      currentScene,
      choices,
      runInventory,
      collection,
      discoveredLoot,
      currentEnding,
      progress,
      startJourney,
      selectChoice,
      closeLoot,
      restartJourney,
      clearSave,
    ]
  );

  return <GameStateContext.Provider value={value}>{children}</GameStateContext.Provider>;
}

export function useGameState() {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within GameStateProvider');
  }

  return context;
}
