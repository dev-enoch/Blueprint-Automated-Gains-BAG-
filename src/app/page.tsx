import Link from 'next/link';
import Image from 'next/image';
import { getCourses } from '@/lib/data';
import { AppLayout } from '@/components/app/AppLayout';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default async function HomePage() {
  const courses = await getCourses();

  return (
    <AppLayout>
      <div className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/5">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Unlock Financial Freedom with Coach Adams
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Join thousands of students who are building profitable online businesses through expert-led courses on affiliate marketing, SEO, and more.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="#courses">
                      Browse Courses
                    </Link>
                  </Button>
                </div>
              </div>
              <Image
                src="https://picsum.photos/seed/coach-adams/600/600"
                alt="Coach Adams"
                width={600}
                height={600}
                data-ai-hint="professional headshot"
                className="mx-auto aspect-square overflow-hidden rounded-full object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>

        {/* Courses Section */}
        <section id="courses" className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
                 <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <Badge>Our Courses</Badge>
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Start Your Journey</h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Our courses are designed to be practical and action-oriented, giving you the blueprint for success.
                        </p>
                    </div>
                </div>
                <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-2 lg:gap-12">
                   {courses.map((course) => (
                     <Card key={course.id} className="h-full flex flex-col">
                        <CardHeader>
                            <CardTitle>{course.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col">
                           <p className="text-muted-foreground mb-4">{course.description}</p>
                           <div className="flex-grow"/>
                            <Button asChild className="mt-auto w-full">
                                <Link href={`/courses/${course.id}`}>
                                    Start Course <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                     </Card>
                   ))}
                </div>
            </div>
        </section>

      </div>
    </AppLayout>
  );
}
