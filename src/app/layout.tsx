import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { GameStateProvider } from '@/contexts/game-state-context';
import Header from '@/components/header';

export const metadata: Metadata = {
  title: 'LootQuest',
  description: 'Embark on a fictive journey to discover unique digital artifacts with AI-powered lore.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet" />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased'
        )}
      >
        <GameStateProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container py-8">{children}</main>
          </div>
        </GameStateProvider>
        <Toaster />
      </body>
    </html>
  );
}
