import type { Metadata, Viewport } from 'next';
import './globals.css';
import { GameStateProvider } from '@/contexts/game-state-context';
import Header from '@/components/header';

export const metadata: Metadata = {
  title: {
    default: 'LootQuest',
    template: '%s · LootQuest',
  },
  description:
    'A short branching fantasy adventure about forgotten relics, difficult choices and four possible endings.',
  applicationName: 'LootQuest',
};

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#111018',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-body text-foreground antialiased">
        <GameStateProvider>
          <div className="relative flex min-h-screen flex-col overflow-hidden">
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.10),transparent_32%),radial-gradient(circle_at_bottom_right,hsl(var(--accent)/0.08),transparent_28%)]" />
            <Header />
            <main className="container relative flex-1 px-4 pb-12 sm:px-6">
              {children}
            </main>
          </div>
        </GameStateProvider>
      </body>
    </html>
  );
}
