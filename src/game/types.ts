export type StatKey = 'resolve' | 'insight' | 'mercy';

export type GameStats = Record<StatKey, number>;

export type LootRarity = 'uncommon' | 'rare' | 'legendary';

export type LootItem = {
  id: string;
  name: string;
  type: string;
  rarity: LootRarity;
  sigil: string;
  summary: string;
  lore: string;
};

export type ChoiceRequirement = {
  stats?: Partial<GameStats>;
  itemId?: string;
  flag?: string;
  notFlag?: string;
  minRelics?: number;
};

export type ChoiceEffect = {
  stats?: Partial<GameStats>;
  itemId?: string;
  flags?: string[];
};

export type StoryChoice = {
  id: string;
  text: string;
  nextSceneId: string;
  hint?: string;
  requirement?: ChoiceRequirement;
  effect?: ChoiceEffect;
  hideWhenUnavailable?: boolean;
};

export type StoryScene = {
  id: string;
  chapter: string;
  title: string;
  text: string;
  choices: StoryChoice[];
  endingId?: string;
};

export type Ending = {
  id: string;
  name: string;
  description: string;
};

export type GameSave = {
  version: 2;
  hasStarted: boolean;
  currentSceneId: string;
  runInventoryIds: string[];
  collectionIds: string[];
  stats: GameStats;
  flags: string[];
  visitedSceneIds: string[];
  endingIds: string[];
  lastLootId: string | null;
};
