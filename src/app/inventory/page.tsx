'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Check, Gem, LockKeyhole, RotateCcw, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { endings, lootCatalog } from '@/game/content';
import { useGameState } from '@/contexts/game-state-context';

export default function ChroniclePage() {
  const { save, ready, collection, restartJourney, clearSave } = useGameState();
  const relicProgress = Math.round((collection.length / lootCatalog.length) * 100);
  const endingProgress = Math.round((save.endingIds.length / endings.length) * 100);

  const resetAll = () => {
    const confirmed = window.confirm(
      'Delete every discovered relic, ending and active journey? This cannot be undone.'
    );

    if (confirmed) {
      clearSave();
    }
  };

  if (!ready) {
    return <div className="mx-auto h-72 max-w-6xl animate-pulse rounded-2xl bg-muted" />;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-10 py-6 md:py-10">
      <section className="flex flex-col gap-5 rounded-2xl border bg-card p-6 md:flex-row md:items-end md:justify-between md:p-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
            Persistent progress
          </p>
          <h1 className="mt-2 font-headline text-4xl font-semibold md:text-5xl">
            The Chronicle
          </h1>
          <p className="mt-3 text-muted-foreground">
            Relics and endings remain here after every run. Complete the collection by taking different routes and building different traits.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild>
            <Link href="/">
              <BookOpen className="h-4 w-4" />
              {save.hasStarted ? 'Continue journey' : 'Return to journey'}
            </Link>
          </Button>
          <Button variant="outline" onClick={restartJourney}>
            <RotateCcw className="h-4 w-4" />
            New run
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2">
                <Gem className="h-5 w-5 text-primary" />
                Relics
              </span>
              <span>{collection.length}/{lootCatalog.length}</span>
            </CardTitle>
            <CardDescription>Permanent discoveries across all runs.</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={relicProgress} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Endings
              </span>
              <span>{save.endingIds.length}/{endings.length}</span>
            </CardTitle>
            <CardDescription>Each ending requires a different path or trait.</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={endingProgress} className="h-2" />
          </CardContent>
        </Card>
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="font-headline text-3xl font-semibold">Relic collection</h2>
          <p className="mt-1 text-muted-foreground">
            Undiscovered entries reveal only the shape of what remains.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {lootCatalog.map((item, index) => {
            const unlocked = save.collectionIds.includes(item.id);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                <Card className={unlocked ? 'h-full border-primary/30' : 'h-full opacity-65'}>
                  <CardHeader>
                    <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border bg-primary/10 text-4xl text-primary">
                      {unlocked ? item.sigil : '·'}
                    </div>
                    <CardTitle className="flex items-start justify-between gap-3">
                      <span>{unlocked ? item.name : 'Undiscovered relic'}</span>
                      {unlocked ? (
                        <Check className="h-5 w-5 shrink-0 text-primary" />
                      ) : (
                        <LockKeyhole className="h-5 w-5 shrink-0 text-muted-foreground" />
                      )}
                    </CardTitle>
                    <CardDescription className="capitalize">
                      {unlocked ? `${item.rarity} · ${item.type}` : 'Hidden somewhere in the campaign'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="font-medium">
                      {unlocked ? item.summary : 'Choose a different road to reveal this entry.'}
                    </p>
                    {unlocked && (
                      <p className="text-sm leading-relaxed text-muted-foreground">{item.lore}</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="font-headline text-3xl font-semibold">Endings</h2>
          <p className="mt-1 text-muted-foreground">
            The final choice reflects the character built during the run.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {endings.map((ending) => {
            const unlocked = save.endingIds.includes(ending.id);

            return (
              <Card key={ending.id} className={unlocked ? 'border-primary/30' : 'opacity-65'}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-4">
                    <span>{unlocked ? ending.name : 'Unknown ending'}</span>
                    {unlocked ? (
                      <Trophy className="h-5 w-5 text-primary" />
                    ) : (
                      <LockKeyhole className="h-5 w-5 text-muted-foreground" />
                    )}
                  </CardTitle>
                  <CardDescription>
                    {unlocked
                      ? ending.description
                      : 'A different balance of Resolve, Insight or Mercy may lead here.'}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl border border-destructive/30 p-5">
        <h2 className="font-semibold">Save data</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          LootQuest stores progress only in this browser. Clearing it removes the active run, collection and endings.
        </p>
        <Button className="mt-4" variant="destructive" onClick={resetAll}>
          Delete all progress
        </Button>
      </section>
    </div>
  );
}
