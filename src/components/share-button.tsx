'use client';

import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { type LootItem } from '@/lib/types';

type ShareButtonProps = {
  item: LootItem | null;
};

export default function ShareButton({ item }: ShareButtonProps) {
  const { toast } = useToast();

  const handleShare = async () => {
    if (!item) return;

    const shareData = {
      title: `LootQuest: ${item.name}`,
      text: `I discovered the "${item.name}" in LootQuest! Here's its story:\n\n${item.lore}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.text);
        toast({
          title: 'Copied to clipboard!',
          description: 'You can now share the story of your discovery.',
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Failed to copy',
          description: 'Could not copy loot details to clipboard.',
        });
      }
    }
  };

  return (
    <Button onClick={handleShare} variant="secondary">
      <Share2 className="mr-2 h-4 w-4" />
      Share
    </Button>
  );
}
