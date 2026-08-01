# LootQuest

LootQuest is a short branching fantasy adventure about forgotten relics and difficult choices. Explore three routes, shape your character through Resolve, Insight and Mercy, then decide the fate of the Hollow Archive. A run takes roughly 15–25 minutes, while discovered relics and endings stay in your Chronicle for later runs.

## Play locally

You need Node.js 20 or newer. LootQuest does not require an account, API key or database.

### Windows

1. Download the repository as a ZIP and extract it.
2. Double-click `start-lootquest.cmd`.
3. Keep the terminal window open while playing.

The first launch installs the required packages. Later launches start the game directly and open `http://localhost:3000` in the browser.

### macOS and Linux

Open a terminal in the project folder and run:

```bash
sh start-lootquest.sh
```

The universal manual method is:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## How the game works

- Each decision can increase Resolve, Insight or Mercy.
- Some choices require a trait level, a previous decision or a specific relic.
- Relics found during a run are added permanently to the Chronicle.
- Four endings can be unlocked through different routes and character builds.
- Progress is saved automatically in the browser.
- Starting a new run keeps the permanent collection and discovered endings.

Use **Journey** to play and **Chronicle** to inspect relics, endings and overall completion.

## Current content

- one complete campaign
- three explorable routes
- six collectible relics
- four endings
- persistent local saves
- migration for relics collected in the original prototype
- responsive desktop and mobile layout
- no network dependency after installation

## Project structure

```text
src/
├── app/
│   ├── page.tsx                 # Journey screen
│   ├── inventory/page.tsx       # Chronicle
│   └── layout.tsx               # Application shell
├── components/
│   ├── header.tsx
│   └── ui/                      # Reusable interface primitives
├── contexts/
│   └── game-state-context.tsx   # Persistent player state
├── game/
│   ├── content.ts               # Campaign, relics and endings
│   ├── engine.ts                # Rules, choices and progression
│   ├── types.ts                 # Game domain types
│   └── validate-content.ts      # Broken-link and duplicate checks
└── hooks/
    └── use-local-storage.ts      # Browser save adapter
```

The campaign is data-driven. New scenes belong in `src/game/content.ts`; gameplay rules should stay in `src/game/engine.ts` rather than being embedded in page components.

## Development

```bash
npm install
npm run dev
```

Useful checks:

```bash
npm run typecheck
npm run build
npm run check
```

The production server can be tested with:

```bash
npm run build
npm run start
```

## Save data

LootQuest stores one versioned save under `lootquest_save_v2` in browser local storage. The Chronicle includes a button to delete the active run, collection and endings.

No player data is sent to a server.

## Deployment

LootQuest is a standard Next.js application and can be deployed on any platform that supports Node.js. No environment variables or external services are required.
