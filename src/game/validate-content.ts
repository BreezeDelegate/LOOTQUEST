import { endings, lootCatalog, story } from './content';

export function validateCampaign() {
  const sceneIds = new Set<string>();
  const choiceIds = new Set<string>();
  const lootIds = new Set(lootCatalog.map((item) => item.id));
  const endingIds = new Set(endings.map((ending) => ending.id));

  for (const scene of story) {
    if (sceneIds.has(scene.id)) {
      throw new Error(`Duplicate scene id: ${scene.id}`);
    }
    sceneIds.add(scene.id);

    if (scene.endingId && !endingIds.has(scene.endingId)) {
      throw new Error(`Unknown ending id on scene ${scene.id}: ${scene.endingId}`);
    }

    for (const choice of scene.choices) {
      if (choiceIds.has(choice.id)) {
        throw new Error(`Duplicate choice id: ${choice.id}`);
      }
      choiceIds.add(choice.id);

      if (choice.effect?.itemId && !lootIds.has(choice.effect.itemId)) {
        throw new Error(`Unknown loot id on choice ${choice.id}: ${choice.effect.itemId}`);
      }

      if (choice.requirement?.itemId && !lootIds.has(choice.requirement.itemId)) {
        throw new Error(`Unknown required loot on choice ${choice.id}: ${choice.requirement.itemId}`);
      }
    }
  }

  for (const scene of story) {
    for (const choice of scene.choices) {
      if (!sceneIds.has(choice.nextSceneId)) {
        throw new Error(`Choice ${choice.id} points to missing scene ${choice.nextSceneId}`);
      }
    }
  }
}
