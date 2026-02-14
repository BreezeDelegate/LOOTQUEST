'use client';

import { useGameState } from '@/contexts/game-state-context';
import LootCard from '@/components/loot-card';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

export default function InventoryPage() {
  const { inventory, resetJourney } = useGameState();

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-headline mb-8 text-center"
      >
        Loot Inventory
      </motion.h1>

      {inventory.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {inventory.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <LootCard item={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mt-20 flex flex-col items-center"
        >
          <p className="text-muted-foreground text-lg mb-4">Your inventory is empty.</p>
          <p className="text-xl mb-6">Embark on a <Link href="/" className="text-accent hover:underline">journey</Link> to discover new artifacts.</p>
          <Button onClick={resetJourney} variant="outline">Reset Journey and Start Anew</Button>
        </motion.div>
      )}
    </div>
  );
}
