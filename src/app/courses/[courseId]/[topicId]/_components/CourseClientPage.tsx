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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { updateUserProgressOnServer } from '../actions';
import { TopicItem } from '../../_components/TopicItem';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface CourseClientPageProps {
  course: Course;
  initialProgress: UserProgress;
  userId: string;
  allTopicIds: string[];
  currentTopicId: string;
}

export function CourseClientPage({ course, initialProgress, userId, allTopicIds, currentTopicId }: CourseClientPageProps) {
  const [progress, setProgress] = useState(initialProgress);
  const router = useRouter();

  const selectedTopic = useMemo(() => {
     for (const mod of course.modules) {
      for (const top of mod.topics) {
        if (top.id === currentTopicId) {
          return top;
        }
      }
    }
    return null;
  }, [course, currentTopicId])


  const { toast } = useToast();

  const progressPercentage = useMemo(() => {
    const completedCount = Object.keys(progress).filter(id => progress[id] && allTopicIds.includes(id)).length;
    return allTopicIds.length > 0 ? (completedCount / allTopicIds.length) * 100 : 0;
  }, [progress, allTopicIds]);

  
  useEffect(() => {
    // Mark the current topic as complete when the page loads
    if (selectedTopic && !progress[selectedTopic.id]) {
      const markAsComplete = async () => {
        try {
          setProgress(prev => ({ ...prev, [selectedTopic.id]: true }));
          await updateUserProgressOnServer(userId, selectedTopic.id, true);
          toast({
            title: "Progress Saved",
            description: `You've completed "${selectedTopic.title}".`
          });
        } catch (error) {
          setProgress(prev => ({ ...prev, [selectedTopic.id]: false }));
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not save progress. Please try again.',
          });
        }
      };
      markAsComplete();
    }
  }, [selectedTopic, progress, userId, toast]);
  

  const defaultAccordionValue = useMemo(() => {
    return selectedTopic ? course.modules.find(m => m.topics.some(t => t.id === selectedTopic.id))?.id : undefined;
  }, [selectedTopic, course.modules]);

  const handleNextTopic = () => {
    if (!selectedTopic) return;

    let foundCurrent = false;
    for (const mod of course.modules) {
      for (const top of mod.topics) {
        if (foundCurrent) {
          router.push(`/courses/${course.id}/${top.id}`);
          return;
        }
        if (top.id === selectedTopic.id) {
          foundCurrent = true;
        }
      }
    }
    toast({
        title: "Congratulations!",
        description: "You've completed the entire course!"
    });
    // Redirect back to the main course landing page after completion
    router.push(`/courses/${course.id}`);
  };
  
  const isLastTopic = useMemo(() => {
    if (!selectedTopic) return true;
    const lastModule = course.modules[course.modules.length - 1];
    const lastTopicInCourse = lastModule.topics[lastModule.topics.length - 1];
    return selectedTopic.id === lastTopicInCourse.id;
  }, [selectedTopic, course.modules]);

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 sm:p-6">
      <div className="lg:col-span-1 xl:col-span-1 flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              <Link href={`/courses/${course.id}`} className="hover:underline">{course.title}</Link>
            </CardTitle>
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
                            courseId={course.id}
                            isCompleted={!!progress[topic.id]}
                            isSelected={selectedTopic?.id === topic.id}
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
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle className="text-3xl">{selectedTopic?.title || 'Select a topic'}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
                {selectedTopic ? (
                <>
                    <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden">
                         <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${selectedTopic.videoId}`}
                            title={selectedTopic.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                    <CardDescription>{selectedTopic.description}</CardDescription>
                    <div className="flex-grow" />
                    <div className="flex justify-end gap-2 mt-auto pt-4 border-t">
                        {isLastTopic ? (
                           <Button asChild>
                             <Link href={`/courses/${course.id}`}>Back to Course Overview</Link>
                           </Button>
                        ) : (
                           <Button onClick={handleNextTopic}>
                            Mark as Complete & Next
                           </Button>
                        )}
                    </div>
                </>
                ) : (
                <div className="flex flex-col items-center justify-center text-center h-full">
                    <p className="text-muted-foreground">Select a topic from the list to start learning.</p>
                </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
