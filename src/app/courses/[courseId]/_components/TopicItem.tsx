'use client';

import { CheckCircle2, Circle, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Topic } from '@/lib/types';
import Link from 'next/link';

interface TopicItemProps {
  topic: Topic;
  isCompleted: boolean;
  isSelected: boolean;
  courseId: string;
}

export function TopicItem({ topic, isCompleted, isSelected, courseId }: TopicItemProps) {
  const Icon = isCompleted ? CheckCircle2 : isSelected ? PlayCircle : Circle;

  return (
    <Button
      variant="ghost"
      asChild
      className={cn(
        'w-full justify-start pl-2 h-auto py-2',
        isSelected && 'bg-primary/10'
      )}
    >
      <Link href={`/courses/${courseId}/${topic.id}`}>
        <Icon className={cn(
          "h-5 w-5 mr-2 text-muted-foreground",
          isCompleted && "text-primary fill-primary/20",
          isSelected && "text-primary",
        )} />
        <span className="flex-1 text-left text-sm">{topic.title}</span>
      </Link>
    </Button>
  );
}
