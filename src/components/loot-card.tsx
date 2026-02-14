'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type LootItem } from '@/lib/types';
import LootDetailModal from './loot-detail-modal';
import { motion } from 'framer-motion';

type LootCardProps = {
  item: LootItem;
};

export default function LootCard({ item }: LootCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div whileHover={{ y: -5, scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
        <Card
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer overflow-hidden h-full group bg-card/50 hover:border-primary/50 transition-all duration-300"
        >
          <CardHeader className="p-0">
            <div className="aspect-square relative">
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                data-ai-hint={item.imageHint}
              />
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <CardTitle className="font-headline text-lg truncate">{item.name}</CardTitle>
          </CardContent>
        </Card>
      </motion.div>
      
      {isModalOpen && (
        <LootDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialLootItem={item}
        />
      )}
    </>
  );
}
