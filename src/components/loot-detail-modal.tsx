'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { generateLootLore } from '@/app/actions';
import { type LootItem } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import ShareButton from './share-button';
import { AnimatePresence, motion } from 'framer-motion';

type LootDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  lootDiscovery?: { name: string; type: string; imageId: string; } | null;
  initialLootItem?: LootItem | null;
  onLootAdded?: (item: LootItem) => void;
};

export default function LootDetailModal({ isOpen, onClose, lootDiscovery, initialLootItem, onLootAdded }: LootDetailModalProps) {
  const [lootItem, setLootItem] = useState<LootItem | null>(initialLootItem || null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (lootDiscovery && !initialLootItem) {
      const fetchLore = async () => {
        setIsLoading(true);
        const lore = await generateLootLore({ itemName: lootDiscovery.name, itemType: lootDiscovery.type });
        const placeholderImage = PlaceHolderImages.find(p => p.id === lootDiscovery.imageId);
        const newItem: LootItem = {
          id: Date.now().toString(),
          name: lootDiscovery.name,
          type: lootDiscovery.type,
          lore,
          imageUrl: placeholderImage?.imageUrl || '',
          imageHint: placeholderImage?.imageHint || '',
        };
        setLootItem(newItem);
        if (onLootAdded) {
          onLootAdded(newItem);
        }
        setIsLoading(false);
      };
      fetchLore();
    }
  }, [lootDiscovery, onLootAdded, initialLootItem]);
  
  const item = initialLootItem || lootItem;

  const handleClose = () => {
    // Prevent closing while generating lore for a new item
    if (lootDiscovery && isLoading) return;
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
            <AnimatePresence>
            {item && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative aspect-square md:aspect-auto">
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-cover"
                data-ai-hint={item.imageHint}
              />
               {lootDiscovery && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="text-white font-headline text-2xl bg-black/50 px-4 py-2 rounded-lg"
                    >
                        Artifact Discovered!
                    </motion.div>
                </div>
               )}
            </div>
            <div className="flex flex-col">
              <DialogHeader className="p-6 pb-2 text-left">
                <DialogTitle className="font-headline text-3xl">{item.name}</DialogTitle>
                <DialogDescription className="text-accent">{item.type}</DialogDescription>
              </DialogHeader>
              <ScrollArea className="flex-1 px-6">
                <div className="text-foreground/80 leading-relaxed pr-4 max-h-[300px]">
                  {isLoading ? (
                    <div className="space-y-2 pt-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-[80%]" />
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{item.lore}</p>
                  )}
                </div>
              </ScrollArea>
              <DialogFooter className="p-6 pt-4 flex-row justify-end space-x-2">
                <ShareButton item={item} />
                <Button onClick={handleClose} variant="outline">
                    {lootDiscovery ? "Continue Journey" : "Close"}
                </Button>
              </DialogFooter>
            </div>
          </div>
          </motion.div>
          )}
          </AnimatePresence>
        </DialogContent>
    </Dialog>
  );
}
