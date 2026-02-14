'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Gem, Map, Package, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { useGameState } from '@/contexts/game-state-context';

export default function Header() {
  const pathname = usePathname();
  const { resetJourney } = useGameState();

  const navItems = [
    { href: '/', label: 'Journey', icon: Map },
    { href: '/inventory', label: 'Inventory', icon: Package },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Gem className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-lg">LootQuest</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'transition-colors hover:text-foreground/80 flex items-center gap-2',
                pathname === item.href ? 'text-foreground' : 'text-foreground/60'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end">
            <Button variant="ghost" size="sm" onClick={resetJourney}>
                <RotateCcw className="h-4 w-4 mr-2"/>
                Reset Journey
            </Button>
        </div>
      </div>
    </header>
  );
}
