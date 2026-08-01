'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Brain,
  Compass,
  Gem,
  Heart,
  LockKeyhole,
  PackageOpen,
  RotateCcw,
  Shield,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useGameState } from '@/contexts/game-state-context';
import { meetsRequirement } from '@/game/engine';
import type { ChoiceRequirement, StoryChoice } from '@/game/types';

function requirementText(requirement?: ChoiceRequirement) {
  if (!requirement) return null;
  if (requirement.itemId) return 'A specific relic is required.';
  if (requirement.flag) return 'A previous decision is required.';
  if (requirement.minRelics) return `Requires ${requirement.minRelics} relics.`;

  const stats = requirement.stats;
  if (stats?.resolve) return `Requires ${stats.resolve} Resolve.`;
  if (stats?.insight) return `Requires ${stats.insight} Insight.`;
  if (stats?.mercy) return `Requires ${stats.mercy} Mercy.`;

  return null;
}

function ChoiceButton({ choice }: { choice: StoryChoice }) {
  const { save, selectChoice } = useGameState();
  const available = meetsRequirement(save, choice.requirement);
  const hint = available ? choice.hint : requirementText(choice.requirement);

  return (
    <div className="space-y-1.5">
      <Button
        type="button"
        variant={available ? 'secondary' : 'outline'}
        disabled={!available}
        onClick={() => selectChoice(choice)}
        className="h-auto min-h-12 w-full justify-between gap-4 whitespace-normal px-4 py-3 text-left"
      >
        <span>{choice.text}</span>
        {available ? (
          <ArrowRight className="h-4 w-4 shrink-0" />
        ) : (
          <LockKeyhole className="h-4 w-4 shrink-0" />
        )}
      </Button>
      {hint && <p className="px-2 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Shield;
}) {
  return (
    <div className="rounded-lg border bg-background/50 p-3">
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon className="h-4 w-4" />
          {label}
        </span>
        <span className="font-headline text-xl font-semibold">{value}</span>
      </div>
    </div>
  );
}

function StartScreen() {
  const { save, startJourney } = useGameState();

  return (
    <div className="mx-auto max-w-5xl space-y-8 py-8 md:py-16">
      <section className="overflow-hidden rounded-2xl border bg-card shadow-2xl shadow-black/20">
        <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6 p-7 md:p-12">
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm text-muted-foreground">
              <Compass className="h-4 w-4" />
              A short branching fantasy adventure
            </div>
            <div className="space-y-4">
              <h1 className="font-headline text-5xl font-bold tracking-tight md:text-7xl">
                LootQuest
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                Cross a dying realm, recover forgotten relics and decide what the Hollow Archive should become. Every choice shapes your character and unlocks a different ending.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={startJourney}>
                <Sparkles className="h-4 w-4" />
                {save.visitedSceneIds.length > 1 ? 'Continue journey' : 'Begin journey'}
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/inventory">
                  <PackageOpen className="h-4 w-4" />
                  View collection
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid content-center gap-4 border-t bg-primary/5 p-7 lg:border-l lg:border-t-0 md:p-10">
            <div className="rounded-xl border bg-background/60 p-5">
              <BookOpen className="h-5 w-5 text-primary" />
              <p className="mt-3 font-semibold">A complete campaign</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Multiple routes, six relics and four endings in a 15–25 minute run.
              </p>
            </div>
            <div className="rounded-xl border bg-background/60 p-5">
              <Trophy className="h-5 w-5 text-primary" />
              <p className="mt-3 font-semibold">Built for replay</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Endings and discovered relics remain in your collection between runs.
              </p>
            </div>
            <div className="rounded-xl border bg-background/60 p-5">
              <Gem className="h-5 w-5 text-primary" />
              <p className="mt-3 font-semibold">No account required</p>
              <p className="mt-1 text-sm text-muted-foreground">
                The game works offline after installation and saves directly in the browser.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function JourneyPage() {
  const {
    save,
    ready,
    currentScene,
    choices,
    runInventory,
    discoveredLoot,
    currentEnding,
    progress,
    closeLoot,
    restartJourney,
  } = useGameState();

  if (!ready) {
    return (
      <div className="mx-auto max-w-5xl space-y-4 py-16">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-72 animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }

  if (!save.hasStarted) {
    return <StartScreen />;
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 py-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:py-10">
      <div className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
              {currentScene.chapter}
            </p>
            <h1 className="mt-1 font-headline text-3xl font-semibold md:text-4xl">
              {currentScene.title}
            </h1>
          </div>
          <span className="text-sm text-muted-foreground">{progress}% explored</span>
        </div>
        <Progress value={progress} className="h-2" />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <Card className="border-primary/20 bg-card/90 shadow-xl shadow-black/10">
              <CardHeader>
                <CardDescription>
                  {runInventory.length} relic{runInventory.length === 1 ? '' : 's'} carried this run
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <p className="whitespace-pre-wrap text-lg leading-8 text-foreground/90">
                  {currentScene.text}
                </p>

                {currentEnding ? (
                  <div className="space-y-4 rounded-xl border bg-primary/5 p-5">
                    <div className="flex items-center gap-2 text-primary">
                      <Trophy className="h-5 w-5" />
                      <span className="font-semibold">Ending discovered</span>
                    </div>
                    <div>
                      <h2 className="font-headline text-2xl font-semibold">
                        {currentEnding.name}
                      </h2>
                      <p className="mt-1 text-muted-foreground">
                        {currentEnding.description}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Button onClick={restartJourney}>
                        <RotateCcw className="h-4 w-4" />
                        Start another run
                      </Button>
                      <Button asChild variant="outline">
                        <Link href="/inventory">Open the chronicle</Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {choices.map((choice) => (
                      <ChoiceButton key={choice.id} choice={choice} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      <aside className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Your path</CardTitle>
            <CardDescription>Choices develop three traits.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <StatCard label="Resolve" value={save.stats.resolve} icon={Shield} />
            <StatCard label="Insight" value={save.stats.insight} icon={Brain} />
            <StatCard label="Mercy" value={save.stats.mercy} icon={Heart} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Relics carried</CardTitle>
          </CardHeader>
          <CardContent>
            {runInventory.length > 0 ? (
              <div className="space-y-2">
                {runInventory.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 rounded-lg border p-3">
                    <span className="text-2xl text-primary">{item.sigil}</span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{item.name}</p>
                      <p className="text-xs capitalize text-muted-foreground">{item.rarity}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                The first relic waits beyond the crossroads.
              </p>
            )}
          </CardContent>
        </Card>
      </aside>

      <Dialog open={!!discoveredLoot} onOpenChange={(open) => !open && closeLoot()}>
        <DialogContent className="sm:max-w-lg">
          {discoveredLoot && (
            <>
              <DialogHeader>
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border bg-primary/10 text-5xl text-primary">
                  {discoveredLoot.sigil}
                </div>
                <DialogTitle className="font-headline text-3xl">
                  {discoveredLoot.name}
                </DialogTitle>
                <DialogDescription className="capitalize">
                  {discoveredLoot.rarity} · {discoveredLoot.type}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <p className="font-medium">{discoveredLoot.summary}</p>
                <p className="leading-relaxed text-muted-foreground">
                  {discoveredLoot.lore}
                </p>
              </div>
              <DialogFooter>
                <Button onClick={closeLoot}>Add to collection</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
