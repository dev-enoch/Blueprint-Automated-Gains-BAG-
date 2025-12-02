import { getAuth } from '@/lib/auth';
import { getCourseById, getUserProgress } from '@/lib/data';
import { notFound } from 'next/navigation';
import { AppLayout } from '@/components/app/AppLayout';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { CheckCircle2, Circle } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type CourseLandingPageProps = {
  params: {
    courseId: string;
  };
};

export default async function CourseLandingPage({ params }: CourseLandingPageProps) {
  const user = await getAuth();
  if (!user) {
    // This should not be reached if middleware is configured correctly.
    return null;
  }

  const course = await getCourseById(params.courseId);
  if (!course) {
    notFound();
  }
  
  const progress = await getUserProgress(user.id);
  const firstTopicId = course.modules[0]?.topics[0]?.id;

  if (!firstTopicId) {
    // Handle case where course has no topics
    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold tracking-tight">{course.title}</h1>
                <p className="mt-4 text-lg text-muted-foreground">{course.description}</p>
                <p className="mt-8 text-center text-muted-foreground">This course does not have any topics yet.</p>
            </div>
        </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold tracking-tight">{course.title}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{course.description}</p>
            
            <Button asChild size="lg" className="mt-8">
              <Link href={`/courses/${course.id}/${firstTopicId}`}>
                Start Course
              </Link>
            </Button>
          </div>
          <div className="md:col-span-1">
             <Card>
                <CardHeader>
                    <CardTitle>Course Content</CardTitle>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full" defaultValue={course.modules[0]?.id}>
                    {course.modules.map(module => (
                        <AccordionItem value={module.id} key={module.id}>
                        <AccordionTrigger>{module.title}</AccordionTrigger>
                        <AccordionContent>
                            <div className="flex flex-col gap-2">
                            {module.topics.map(topic => {
                                const isCompleted = !!progress[topic.id];
                                return (
                                <div key={topic.id} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all">
                                    {isCompleted ? (
                                        <CheckCircle2 className="h-5 w-5 text-primary" />
                                    ) : (
                                        <Circle className="h-5 w-5" />
                                    )}
                                    <span>{topic.title}</span>
                                </div>
                                );
                            })}
                            </div>
                        </AccordionContent>
                        </AccordionItem>
                    ))}
                    </Accordion>
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
