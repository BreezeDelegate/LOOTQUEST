'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Compass, Gem, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useGameState } from '@/contexts/game-state-context';

const navItems = [
  { href: '/', label: 'Journey', icon: Compass },
  { href: '/inventory', label: 'Chronicle', icon: BookOpen },
];

export default function Header() {
  const pathname = usePathname();
  const { save, restartJourney } = useGameState();

  const startNewRun = () => {
    const confirmed =
      !save.hasStarted ||
      window.confirm('Start a new run? Your permanent relics and endings will be kept.');

    if (confirmed) {
      restartJourney();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/85 backdrop-blur-xl">
      <div className="container flex min-h-16 items-center gap-3 py-2">
        <Link href="/" className="mr-auto flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border bg-primary/10">
            <Gem className="h-5 w-5 text-primary" />
          </span>
          <span className="font-headline text-lg font-bold sm:text-xl">LootQuest</span>
        </Link>

        <nav className="flex items-center rounded-lg border bg-card p-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={startNewRun}
          title="Start a new run"
        >
          <RotateCcw className="h-4 w-4" />
          <span className="hidden lg:inline">New run</span>
        </Button>
      </div>
    </header>
  );
}
