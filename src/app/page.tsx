import Link from 'next/link';
import { AppLayout } from '@/components/app/AppLayout';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Course } from '@/lib/types';

const englishCourses: Omit<Course, 'modules'>[] = [
    {
        id: 'en-affiliate-marketing',
        title: 'Affiliate Marketing',
        description: 'Learn the fundamentals of affiliate marketing and how to succeed.',
    },
    {
        id: 'en-graphics-design',
        title: 'Graphics Design',
        description: 'Master the art of graphics design with modern tools and techniques.',
    },
    {
        id: 'en-fb-tiktok-ads',
        title: 'Facebook & Tiktok Advertising',
        description: 'Drive growth with powerful advertising strategies on social media.',
    }
];

const hausaCourses: Omit<Course, 'modules'>[] = [
    {
        id: 'ha-affiliate-marketing',
        title: 'Affiliate Marketing (Hausa)',
        description: 'Koyi tushen tallan haɗin gwiwa da yadda ake samun nasara.',
    },
    {
        id: 'ha-graphics-design',
        title: 'Graphics Design (Hausa)',
        description: 'Kware a fasahar zane-zane na zamani da dabaru.',
    },
    {
        id: 'ha-fb-tiktok-ads',
        title: 'Facebook & Tiktok Advertising (Hausa)',
        description: 'Samu ci gaba da manyan dabarun talla a shafukan sada zumunta.',
    }
];

export default async function HomePage() {
  return (
    <AppLayout>
      <div className="flex-1 flex flex-col">
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
                
                {/* Hausa Courses */}
                <div className="mt-12">
                    <h3 className="text-2xl font-bold tracking-tighter sm:text-3xl text-center mb-8">Hausa Courses</h3>
                     <div className="mx-auto grid max-w-5xl items-start gap-6 lg:grid-cols-3 lg:gap-12">
                       {hausaCourses.map((course) => (
                         <Card key={course.id} className="h-full flex flex-col">
                            <CardHeader>
                                <CardTitle>{course.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col">
                               <p className="text-muted-foreground mb-4">{course.description}</p>
                               <div className="flex-grow"/>
                                <Button asChild className="mt-auto w-full">
                                    <Link href={`/courses/${course.id}`}>
                                        View Course <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                         </Card>
                       ))}
                    </div>
                </div>

                {/* English Courses */}
                <div className="mt-20">
                    <h3 className="text-2xl font-bold tracking-tighter sm:text-3xl text-center mb-8">English Courses</h3>
                    <div className="mx-auto grid max-w-5xl items-start gap-6 lg:grid-cols-3 lg:gap-12">
                       {englishCourses.map((course) => (
                         <Card key={course.id} className="h-full flex flex-col">
                            <CardHeader>
                                <CardTitle>{course.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col">
                               <p className="text-muted-foreground mb-4">{course.description}</p>
                               <div className="flex-grow"/>
                                <Button asChild className="mt-auto w-full">
                                    <Link href={`/courses/${course.id}`}>
                                        View Course <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                         </Card>
                       ))}
                    </div>
                </div>
            </div>
        </section>
      </div>
    </AppLayout>
  );
}
