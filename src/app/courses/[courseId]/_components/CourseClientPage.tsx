'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Course, Topic, UserProgress } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { updateUserProgress } from '@/lib/data';
import { TopicItem } from './TopicItem';
import { useToast } from '@/hooks/use-toast';

interface CourseClientPageProps {
  course: Course;
  initialProgress: UserProgress;
  userId: string;
  allTopicIds: string[];
}

export function CourseClientPage({ course, initialProgress, userId, allTopicIds }: CourseClientPageProps) {
  const [progress, setProgress] = useState(initialProgress);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(() => {
    // Find the first uncompleted topic to start with
    for (const mod of course.modules) {
      for (const top of mod.topics) {
        if (!initialProgress[top.id]) {
          return top;
        }
      }
    }
    // If all are completed, show the first topic
    return course.modules[0]?.topics[0] || null;
  });

  const { toast } = useToast();

  const progressPercentage = useMemo(() => {
    const completedCount = Object.keys(progress).filter(id => progress[id] && allTopicIds.includes(id)).length;
    return allTopicIds.length > 0 ? (completedCount / allTopicIds.length) * 100 : 0;
  }, [progress, allTopicIds]);

  const handleTopicSelect = async (topic: Topic) => {
    setSelectedTopic(topic);
    if (!progress[topic.id]) {
      try {
        // Optimistic update
        setProgress(prev => ({ ...prev, [topic.id]: true }));
        await updateUserProgress(userId, topic.id, true);
      } catch (error) {
        // Revert on failure
        setProgress(prev => ({ ...prev, [topic.id]: false }));
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not save progress. Please try again.',
        });
      }
    }
  };

  // Determine which accordion item to open by default
  const defaultAccordionValue = useMemo(() => {
    return selectedTopic ? course.modules.find(m => m.topics.some(t => t.id === selectedTopic.id))?.id : undefined;
  }, [selectedTopic, course.modules]);

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 sm:p-6">
      <div className="lg:col-span-1 xl:col-span-1 flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{course.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Overall Progress</p>
              <Progress value={progressPercentage} />
              <p className="text-right text-sm font-medium text-primary">
                {Math.round(progressPercentage)}%
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle>Modules</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0 pb-4">
            <ScrollArea className="flex-1">
              <Accordion
                type="single"
                collapsible
                defaultValue={defaultAccordionValue}
                className="w-full px-4"
              >
                {course.modules.map(module => (
                  <AccordionItem value={module.id} key={module.id}>
                    <AccordionTrigger>{module.title}</AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-1">
                        {module.topics.map(topic => (
                          <TopicItem
                            key={topic.id}
                            topic={topic}
                            isCompleted={!!progress[topic.id]}
                            isSelected={selectedTopic?.id === topic.id}
                            onSelect={handleTopicSelect}
                          />
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2 xl:col-span-3">
        <Card className="h-full">
            <ScrollArea className="h-full">
                <CardHeader>
                    <CardTitle className="text-3xl">{selectedTopic?.title || 'Select a topic'}</CardTitle>
                </CardHeader>
                <CardContent>
                    {selectedTopic ? (
                    <div
                        className="prose prose-lg dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: selectedTopic.content }}
                    />
                    ) : (
                    <p className="text-muted-foreground">Select a topic from the list to view its content.</p>
                    )}
                </CardContent>
            </ScrollArea>
        </Card>
      </div>
    </div>
  );
}
