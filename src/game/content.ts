import type { Ending, LootItem, StoryScene } from './types';

export const lootCatalog: LootItem[] = [
  {
    id: 'whispering-amulet',
    name: 'Whispering Amulet',
    type: 'Echo relic',
    rarity: 'rare',
    sigil: '◈',
    summary: 'It remembers every promise made in its presence.',
    lore:
      'The amulet was carved for the first keeper of the Hollow Archive. It warms near hidden paths and repeats the final honest sentence spoken by anyone who carried it.',
  },
  {
    id: 'sunstone-gauntlet',
    name: 'Sunstone Gauntlet',
    type: 'Warden relic',
    rarity: 'rare',
    sigil: '✦',
    summary: 'A patient heat gathers beneath its ancient plates.',
    lore:
      'Forged from a fallen fragment of the noon star, the gauntlet answers conviction rather than strength. It once sealed the eastern breach without drawing a single drop of blood.',
  },
  {
    id: 'glass-key',
    name: 'Glass Key',
    type: 'Threshold key',
    rarity: 'uncommon',
    sigil: '◇',
    summary: 'It opens a door only after its owner admits what lies beyond it.',
    lore:
      'The key was made for doors that should never be forced. Its teeth shift with every confession, searching for the one lock its bearer is finally ready to open.',
  },
  {
    id: 'ashen-compass',
    name: 'Ashen Compass',
    type: 'Pathfinder relic',
    rarity: 'uncommon',
    sigil: '✣',
    summary: 'Its needle points toward the choice most likely to be regretted.',
    lore:
      'No map agrees with the compass. Pilgrims used it to find difficult truths, while kings buried it whenever certainty became politically useful.',
  },
  {
    id: 'moon-thread',
    name: 'Moon Thread',
    type: 'Binding relic',
    rarity: 'legendary',
    sigil: '☾',
    summary: 'A silver strand that can bind a wound, a memory or an oath.',
    lore:
      'Spun during the long eclipse, the thread joins things that still wish to remain together. It breaks at once when used to imprison rather than mend.',
  },
  {
    id: 'crown-seed',
    name: 'Crown Seed',
    type: 'Living relic',
    rarity: 'legendary',
    sigil: '❖',
    summary: 'A black seed containing the memory of a forest not yet born.',
    lore:
      'The old crown was never made of metal. Each ruler planted this seed and accepted that their reign existed only to shelter what would outlive them.',
  },
];

export const endings: Ending[] = [
  {
    id: 'keeper',
    name: 'Keeper of the Last Light',
    description: 'You restore the Archive and accept the burden of guarding its truths.',
  },
  {
    id: 'wanderer',
    name: 'The Unwritten Road',
    description: 'You refuse the throne and carry the relics beyond the known map.',
  },
  {
    id: 'healer',
    name: 'The Mended Kingdom',
    description: 'You use the relics to reconcile the divided houses without claiming power.',
  },
  {
    id: 'crowned',
    name: 'The Ashen Crown',
    description: 'You seize the Archive and become the ruler it was built to resist.',
  },
];

export const story: StoryScene[] = [
  {
    id: 'crossroads',
    chapter: 'I · The Crossroads',
    title: 'Where the roads remember',
    text:
      'At dusk, three roads meet beneath a dead lantern. The northern stones hum with buried voices. The eastern ridge burns gold beneath a sun that should already have set. A narrow western trail disappears into rain. An ash-black compass hangs from the signpost.\n\nA note pinned to the lantern bears your name: “Bring three relics to the Hollow Archive before midnight. Decide what deserves to survive.”',
    choices: [
      {
        id: 'north-first',
        text: 'Follow the voices into the northern hollow.',
        nextSceneId: 'hollow-gate',
        effect: { stats: { insight: 1 }, flags: ['chose-north'] },
      },
      {
        id: 'east-first',
        text: 'Climb toward the impossible sunset.',
        nextSceneId: 'sun-ridge',
        effect: { stats: { resolve: 1 }, flags: ['chose-east'] },
      },
      {
        id: 'west-first',
        text: 'Take the Ashen Compass and follow the flooded road.',
        nextSceneId: 'rain-village',
        effect: {
          stats: { mercy: 1 },
          itemId: 'ashen-compass',
          flags: ['chose-west'],
        },
      },
    ],
  },
  {
    id: 'hollow-gate',
    chapter: 'II · The Hollow',
    title: 'The door beneath the roots',
    text:
      'The northern road ends at a stone door swallowed by an ancient tree. A blind archivist waits beside it. She asks what you fear the Archive might remember about you.',
    choices: [
      {
        id: 'answer-honestly',
        text: 'Answer honestly, though the words cost you.',
        nextSceneId: 'hollow-pool',
        effect: {
          stats: { insight: 2 },
          itemId: 'glass-key',
          flags: ['spoke-truth'],
        },
      },
      {
        id: 'force-door',
        text: 'Refuse the ritual and force the roots apart.',
        nextSceneId: 'hollow-pool',
        effect: { stats: { resolve: 2 }, flags: ['broke-hollow-gate'] },
      },
    ],
  },
  {
    id: 'hollow-pool',
    chapter: 'II · The Hollow',
    title: 'The whispering pool',
    text:
      'Beneath the roots, a pale pool repeats fragments of every choice you nearly made. At its centre rests an amulet. The water asks whether memory is a prison or a promise.',
    choices: [
      {
        id: 'take-amulet',
        text: 'Take the amulet and promise to remember without obeying.',
        nextSceneId: 'road-check',
        effect: { itemId: 'whispering-amulet', stats: { insight: 1 } },
      },
    ],
  },
  {
    id: 'sun-ridge',
    chapter: 'II · The Sun Ridge',
    title: 'A fire that refuses night',
    text:
      'The ridge is held beneath a permanent sunset. At the summit, a wounded guardian still protects an empty altar. He mistakes you for the thief who took its crown.',
    choices: [
      {
        id: 'stand-ground',
        text: 'Stand your ground and disarm him without retreating.',
        nextSceneId: 'sun-altar',
        effect: {
          stats: { resolve: 2 },
          flags: ['visited-east', 'spared-guardian'],
        },
      },
      {
        id: 'hear-guardian',
        text: 'Lower your weapon and ask what was stolen.',
        nextSceneId: 'sun-altar',
        effect: {
          stats: { mercy: 1, insight: 1 },
          flags: ['visited-east', 'spared-guardian'],
        },
      },
    ],
  },
  {
    id: 'sun-altar',
    chapter: 'II · The Sun Ridge',
    title: 'The patient flame',
    text:
      'The guardian reveals a gauntlet hidden beneath the altar. It was never the crown, only a test: power that burns no hotter than its bearer can control.',
    choices: [
      {
        id: 'take-gauntlet',
        text: 'Accept the gauntlet and its restraint.',
        nextSceneId: 'road-check',
        effect: { itemId: 'sunstone-gauntlet', stats: { resolve: 1 } },
      },
    ],
  },
  {
    id: 'rain-village',
    chapter: 'II · The Drowned Road',
    title: 'The village that waits',
    text:
      'Rain has filled the western village to its windows. The last ferryman can carry either you or a trapped family across before the river breaks its banks.',
    choices: [
      {
        id: 'save-family',
        text: 'Give the boat to the family and cross through the flood alone.',
        nextSceneId: 'moon-shrine',
        effect: {
          stats: { mercy: 2, resolve: 1 },
          flags: ['visited-west', 'saved-family'],
        },
      },
      {
        id: 'take-boat',
        text: 'Take the boat. The Archive cannot wait.',
        nextSceneId: 'moon-shrine',
        effect: {
          stats: { resolve: 2 },
          flags: ['visited-west', 'abandoned-family'],
        },
      },
    ],
  },
  {
    id: 'moon-shrine',
    chapter: 'II · The Drowned Road',
    title: 'Thread beneath the water',
    text:
      'Beyond the village, a moon shrine lies half-submerged. Silver thread grows from its cracked bell, stitching the riverbank together one root at a time.',
    choices: [
      {
        id: 'take-thread',
        text: 'Cut one strand and leave the rest to hold the village.',
        nextSceneId: 'road-check',
        effect: { itemId: 'moon-thread', stats: { mercy: 1 } },
      },
    ],
  },
  {
    id: 'road-check',
    chapter: 'III · The Remaining Roads',
    title: 'The lantern counts',
    text:
      'The lantern brightens as your collection grows. Midnight approaches. You may still seek what the remaining roads conceal, or enter the Archive with what you have.',
    choices: [
      {
        id: 'go-north',
        text: 'Search the northern hollow.',
        nextSceneId: 'hollow-gate',
        requirement: { notFlag: 'chose-north' },
        effect: { flags: ['chose-north'] },
      },
      {
        id: 'go-east',
        text: 'Return to the eastern ridge.',
        nextSceneId: 'sun-ridge',
        requirement: { notFlag: 'visited-east' },
      },
      {
        id: 'go-west',
        text: 'Follow the western flood.',
        nextSceneId: 'rain-village',
        requirement: { notFlag: 'visited-west' },
      },
      {
        id: 'enter-archive',
        text: 'Enter the Hollow Archive.',
        nextSceneId: 'archive-door',
        requirement: { minRelics: 2 },
        hint: 'Requires at least two relics.',
      },
    ],
  },
  {
    id: 'archive-door',
    chapter: 'IV · The Hollow Archive',
    title: 'The final threshold',
    text:
      'The Archive rises from the earth like the ribs of a buried giant. Its door has no handle, only three hollows shaped for truth, strength and compassion. Behind it, something old asks who should inherit the stories of the dead.',
    choices: [
      {
        id: 'open-with-key',
        text: 'Use the Glass Key and name the truth you came to hide.',
        nextSceneId: 'archive-heart',
        requirement: { itemId: 'glass-key' },
        effect: { stats: { insight: 1 }, flags: ['opened-gently'] },
      },
      {
        id: 'open-with-gauntlet',
        text: 'Hold the Sunstone Gauntlet against the seal.',
        nextSceneId: 'archive-heart',
        requirement: { itemId: 'sunstone-gauntlet' },
        effect: { stats: { resolve: 1 }, flags: ['opened-by-force'] },
      },
      {
        id: 'open-with-thread',
        text: 'Stitch the broken inscriptions with Moon Thread.',
        nextSceneId: 'archive-heart',
        requirement: { itemId: 'moon-thread' },
        effect: { stats: { mercy: 1 }, flags: ['opened-gently'] },
      },
    ],
  },
  {
    id: 'archive-heart',
    chapter: 'V · The Choice',
    title: 'What deserves to survive',
    text:
      'At the centre of the Archive grows a black tree bearing a single Crown Seed. Every shelf is burning, but the flames give no heat. You can preserve the Archive, carry its knowledge away, use its relics to mend the divided realm, or claim the stories as instruments of rule.',
    choices: [
      {
        id: 'become-keeper',
        text: 'Remain and become the Archive’s next keeper.',
        nextSceneId: 'ending-keeper',
        requirement: { stats: { insight: 4 }, minRelics: 3 },
        effect: { itemId: 'crown-seed' },
      },
      {
        id: 'heal-realm',
        text: 'Carry the Crown Seed to the divided houses and make them rebuild together.',
        nextSceneId: 'ending-healer',
        requirement: { stats: { mercy: 4 }, flag: 'saved-family' },
        effect: { itemId: 'crown-seed' },
      },
      {
        id: 'walk-away',
        text: 'Take only what you earned and leave the throne empty.',
        nextSceneId: 'ending-wanderer',
        requirement: { minRelics: 2 },
      },
      {
        id: 'claim-archive',
        text: 'Bind the Archive to your will and take the Ashen Crown.',
        nextSceneId: 'ending-crowned',
        requirement: { stats: { resolve: 4 } },
        effect: { itemId: 'crown-seed' },
      },
    ],
  },
  {
    id: 'ending-keeper',
    chapter: 'Ending',
    title: 'Keeper of the Last Light',
    text:
      'You plant the Crown Seed beneath the dying lantern. The shelves stop burning. Travellers will come seeking answers, and you will make them pay in honesty rather than gold. The Archive survives, changed by the one who chose to remain.',
    choices: [],
    endingId: 'keeper',
  },
  {
    id: 'ending-healer',
    chapter: 'Ending',
    title: 'The Mended Kingdom',
    text:
      'You bring the seed to the river valley. The rival houses must water the same tree or watch it die. Years later, children play beneath branches grown from a decision no king could command.',
    choices: [],
    endingId: 'healer',
  },
  {
    id: 'ending-wanderer',
    chapter: 'Ending',
    title: 'The Unwritten Road',
    text:
      'You leave before the Archive can name you. Its doors close, but the relics at your side begin pointing toward lands omitted from every map. Some stories are preserved by refusing to let them end.',
    choices: [],
    endingId: 'wanderer',
  },
  {
    id: 'ending-crowned',
    chapter: 'Ending',
    title: 'The Ashen Crown',
    text:
      'The Archive kneels. Every secret becomes a weapon, every memory a chain. The realm unites quickly beneath your rule, and no chronicler survives long enough to call the peace by another name.',
    choices: [],
    endingId: 'crowned',
  },
];

export const initialSceneId = 'crossroads';
