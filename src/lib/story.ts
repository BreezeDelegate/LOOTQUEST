import { type StoryScene } from './types';

export const story: StoryScene[] = [
  {
    id: 'start',
    text: 'You stand at a crossroads under a twilight sky. A moss-covered signpost points in two directions.\n\nTo the left, a path descends into a whispering cave, a cool breeze carrying the scent of damp earth and forgotten secrets.\n\nTo the right, a trail winds up a sun-drenched peak, promising a breathtaking view but a strenuous climb.',
    choices: [
      { text: 'Venture into the whispering cave.', nextSceneId: 'cave' },
      { text: 'Ascend the sun-drenched peak.', nextSceneId: 'peak' },
    ],
  },
  {
    id: 'cave',
    text: 'The cave is deeper than you imagined. Your footsteps echo in the vast darkness. In the heart of the cavern, you find a small, luminescent pool. A faint light pulses from its center, revealing an object resting on a stone pedestal.',
    choices: [
      { text: 'Reach for the object.', nextSceneId: 'get_amulet' },
    ],
  },
  {
    id: 'peak',
    text: 'The climb is arduous, but you reach the summit as the last rays of sun paint the sky in hues of orange and purple. At the very top, embedded in a stone altar, is a single, metallic gauntlet. It hums with a warm, gentle energy.',
    choices: [
      { text: 'Take the gauntlet.', nextSceneId: 'get_gauntlet' },
    ],
  },
  {
    id: 'get_amulet',
    text: 'You have discovered the Whispering Amulet. Its surface is cool to the touch, and you feel a sense of ancient knowledge pass through you.',
    loot: {
      name: 'Whispering Amulet',
      type: 'Mysterious Orb',
      imageId: 'amulet'
    },
    choices: [
      { text: 'Your journey continues...', nextSceneId: 'end_journey' },
    ],
  },
  {
    id: 'get_gauntlet',
    text: 'You have discovered the Sunstone Gauntlet. It fits your hand perfectly, warm and strangely comforting.',
    loot: {
      name: 'Sunstone Gauntlet',
      type: 'Ancient Relic',
      imageId: 'gauntlet'
    },
    choices: [
      { text: 'Your journey continues...', nextSceneId: 'end_journey' },
    ],
  },
  {
    id: 'end_journey',
    text: 'With your newfound artifact, the world feels larger, filled with more possibilities and untold stories waiting to be uncovered.\n\nThis chapter of your journey is over, but many more await.',
    choices: [
      { text: 'Begin a new journey.', nextSceneId: 'start' },
    ],
  },
];
