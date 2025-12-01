'use client';

import { CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Topic } from '@/lib/types';

interface TopicItemProps {
  topic: Topic;
  isCompleted: boolean;
  isSelected: boolean;
  onSelect: (topic: Topic) => void;
}

export function TopicItem({ topic, isCompleted, isSelected, onSelect }: TopicItemProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        'w-full justify-start pl-2 h-auto py-2',
        isSelected && 'bg-primary/10'
      )}
      onClick={() => onSelect(topic)}
    >
      {isCompleted ? (
        <CheckCircle2 className="h-5 w-5 mr-2 text-primary fill-primary/20" />
      ) : (
        <Circle className="h-5 w-5 mr-2 text-muted-foreground" />
      )}
      <span className="flex-1 text-left text-sm">{topic.title}</span>
    </Button>
  );
}
