import { initialSceneId, lootCatalog, story } from './content';
import type {
  ChoiceEffect,
  ChoiceRequirement,
  GameSave,
  GameStats,
  LootItem,
  StoryChoice,
  StoryScene,
} from './types';
import { validateCampaign } from './validate-content';

validateCampaign();

const emptyStats: GameStats = {
  resolve: 0,
  insight: 0,
  mercy: 0,
};

export function createNewSave(collectionIds: string[] = [], endingIds: string[] = []): GameSave {
  return {
    version: 2,
    hasStarted: false,
    currentSceneId: initialSceneId,
    runInventoryIds: [],
    collectionIds,
    stats: { ...emptyStats },
    flags: [],
    visitedSceneIds: [initialSceneId],
    endingIds,
    lastLootId: null,
  };
}

export function normalizeSave(value: unknown): GameSave {
  if (!value || typeof value !== 'object') {
    return createNewSave();
  }

  const candidate = value as Partial<GameSave>;
  if (candidate.version !== 2 || typeof candidate.currentSceneId !== 'string') {
    return createNewSave();
  }

  const sceneExists = story.some((scene) => scene.id === candidate.currentSceneId);

  return {
    version: 2,
    hasStarted: candidate.hasStarted === true,
    currentSceneId: sceneExists ? candidate.currentSceneId : initialSceneId,
    runInventoryIds: uniqueStrings(candidate.runInventoryIds),
    collectionIds: uniqueStrings(candidate.collectionIds),
    stats: {
      resolve: safeScore(candidate.stats?.resolve),
      insight: safeScore(candidate.stats?.insight),
      mercy: safeScore(candidate.stats?.mercy),
    },
    flags: uniqueStrings(candidate.flags),
    visitedSceneIds: uniqueStrings(candidate.visitedSceneIds),
    endingIds: uniqueStrings(candidate.endingIds),
    lastLootId: typeof candidate.lastLootId === 'string' ? candidate.lastLootId : null,
  };
}

function uniqueStrings(value: unknown): string[] {
  return Array.isArray(value)
    ? [...new Set(value.filter((item): item is string => typeof item === 'string'))]
    : [];
}

function safeScore(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.max(0, Math.floor(value))
    : 0;
}

export function getScene(sceneId: string): StoryScene {
  return story.find((scene) => scene.id === sceneId) ?? story[0];
}

export function getLoot(itemId: string | null | undefined): LootItem | null {
  if (!itemId) {
    return null;
  }

  return lootCatalog.find((item) => item.id === itemId) ?? null;
}

export function getRunInventory(save: GameSave): LootItem[] {
  return save.runInventoryIds.map((id) => getLoot(id)).filter((item): item is LootItem => !!item);
}

export function getCollection(save: GameSave): LootItem[] {
  return save.collectionIds.map((id) => getLoot(id)).filter((item): item is LootItem => !!item);
}

export function meetsRequirement(save: GameSave, requirement?: ChoiceRequirement): boolean {
  if (!requirement) {
    return true;
  }

  if (requirement.itemId && !save.runInventoryIds.includes(requirement.itemId)) {
    return false;
  }

  if (requirement.flag && !save.flags.includes(requirement.flag)) {
    return false;
  }

  if (requirement.notFlag && save.flags.includes(requirement.notFlag)) {
    return false;
  }

  if (requirement.minRelics && save.runInventoryIds.length < requirement.minRelics) {
    return false;
  }

  if (requirement.stats) {
    const statEntries = Object.entries(requirement.stats) as Array<
      [keyof GameStats, number | undefined]
    >;

    if (statEntries.some(([key, target]) => target !== undefined && save.stats[key] < target)) {
      return false;
    }
  }

  return true;
}

export function availableChoices(save: GameSave, scene: StoryScene): StoryChoice[] {
  const visible = scene.choices.filter(
    (choice) => !choice.hideWhenUnavailable || meetsRequirement(save, choice.requirement)
  );

  if (scene.endingId || visible.some((choice) => meetsRequirement(save, choice.requirement))) {
    return visible;
  }

  return [
    {
      id: `leave-${scene.id}`,
      text: 'Return to the lantern and reconsider the remaining paths.',
      nextSceneId: 'road-check',
    },
  ];
}

function applyEffect(save: GameSave, effect?: ChoiceEffect): GameSave {
  if (!effect) {
    return { ...save, lastLootId: null };
  }

  const nextStats = { ...save.stats };
  if (effect.stats) {
    for (const [key, amount] of Object.entries(effect.stats) as Array<
      [keyof GameStats, number | undefined]
    >) {
      if (amount) {
        nextStats[key] = Math.max(0, nextStats[key] + amount);
      }
    }
  }

  const runInventoryIds = effect.itemId
    ? [...new Set([...save.runInventoryIds, effect.itemId])]
    : save.runInventoryIds;
  const collectionIds = effect.itemId
    ? [...new Set([...save.collectionIds, effect.itemId])]
    : save.collectionIds;
  const flags = effect.flags
    ? [...new Set([...save.flags, ...effect.flags])]
    : save.flags;

  return {
    ...save,
    stats: nextStats,
    runInventoryIds,
    collectionIds,
    flags,
    lastLootId: effect.itemId ?? null,
  };
}

export function choose(save: GameSave, choice: StoryChoice): GameSave {
  if (!meetsRequirement(save, choice.requirement)) {
    return save;
  }

  const nextScene = getScene(choice.nextSceneId);
  const withEffect = applyEffect(save, choice.effect);
  const endingIds = nextScene.endingId
    ? [...new Set([...withEffect.endingIds, nextScene.endingId])]
    : withEffect.endingIds;

  return {
    ...withEffect,
    hasStarted: true,
    currentSceneId: nextScene.id,
    visitedSceneIds: [...new Set([...withEffect.visitedSceneIds, nextScene.id])],
    endingIds,
  };
}

export function clearLastLoot(save: GameSave): GameSave {
  return save.lastLootId ? { ...save, lastLootId: null } : save;
}

export function restartRun(save: GameSave): GameSave {
  return createNewSave(save.collectionIds, save.endingIds);
}

export function resetEverything(): GameSave {
  return createNewSave();
}

export function runProgress(save: GameSave): number {
  const storyScenes = story.filter((scene) => !scene.endingId).length;
  const visited = save.visitedSceneIds.filter((id) =>
    story.some((scene) => scene.id === id && !scene.endingId)
  ).length;

  return Math.min(100, Math.round((visited / storyScenes) * 100));
}
