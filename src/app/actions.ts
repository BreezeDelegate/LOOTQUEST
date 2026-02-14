'use server';

import { generateLootLore as generateLootLoreFlow, GenerateLootLoreInput } from '@/ai/flows/generate-loot-lore-flow';

export async function generateLootLore(input: GenerateLootLoreInput): Promise<string> {
  try {
    const result = await generateLootLoreFlow(input);
    return result.lore;
  } catch (error) {
    console.error("Error generating loot lore:", error);
    // Provide a graceful fallback message
    return "The archives are silent on this artifact. Its story is yet to be written, a mystery waiting to be unraveled by a worthy hero.";
  }
}
