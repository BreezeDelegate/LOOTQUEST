'use server';
/**
 * @fileOverview A Genkit flow for generating descriptive lore for digital loot items.
 *
 * - generateLootLore - A function that handles the lore generation process.
 * - GenerateLootLoreInput - The input type for the generateLootLore function.
 * - GenerateLootLoreOutput - The return type for the generateLootLore function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLootLoreInputSchema = z.object({
  itemName: z.string().describe('The name of the digital loot item.'),
  itemType: z.string().describe('The type or category of the digital loot item (e.g., "ancient relic", "magical sword", "mysterious orb").'),
  context: z.string().optional().describe('Optional: Additional contextual information about the item or the world it belongs to.'),
});
export type GenerateLootLoreInput = z.infer<typeof GenerateLootLoreInputSchema>;

const GenerateLootLoreOutputSchema = z.object({
  lore: z.string().describe('The generated rich and descriptive lore for the loot item.'),
});
export type GenerateLootLoreOutput = z.infer<typeof GenerateLootLoreOutputSchema>;

export async function generateLootLore(input: GenerateLootLoreInput): Promise<GenerateLootLoreOutput> {
  return generateLootLoreFlow(input);
}

const generateLootLorePrompt = ai.definePrompt({
  name: 'generateLootLorePrompt',
  input: {schema: GenerateLootLoreInputSchema},
  output: {schema: GenerateLootLoreOutputSchema},
  prompt: `You are an ancient lore master, steeped in the history and mythology of a vast fantasy world. Your task is to craft unique, rich, and descriptive lore for a digital loot item.

Generate compelling lore for the following item, focusing on its history, origin, magical properties (if applicable), and significance within the world. Make it feel meaningful and enhance the game's world.

Item Name: {{{itemName}}}
Item Type: {{{itemType}}}
{{#if context}}
Additional Context: {{{context}}}
{{/if}}

The lore should be detailed, evocative, and immerse the player in the item's story.`,
});

const generateLootLoreFlow = ai.defineFlow(
  {
    name: 'generateLootLoreFlow',
    inputSchema: GenerateLootLoreInputSchema,
    outputSchema: GenerateLootLoreOutputSchema,
  },
  async input => {
    const {output} = await generateLootLorePrompt(input);
    return output!;
  }
);
