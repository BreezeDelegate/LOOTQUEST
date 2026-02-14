export type LootItem = {
  id: string;
  name: string;
  type: string;
  lore: string;
  imageUrl: string;
  imageHint: string;
};

export type Choice = {
  text: string;
  nextSceneId: string;
};

export type StoryScene = {
  id: string;
  text: string;
  choices: Choice[];
  loot?: {
    name: string;
    type: string;
    imageId: string;
  };
};
