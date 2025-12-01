import Link from 'next/link';
import { getCourses } from '@/lib/data';
import { AppLayout } from '@/components/app/AppLayout';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default async function HomePage() {
  const courses = await getCourses();

  return (
    <AppLayout>
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-2xl text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            Available Courses
          </h1>
          <p className="mt-2 text-base sm:text-lg text-muted-foreground">
            Select a course to begin your journey to automated gains.
          </p>
          <div className="mt-8 flex flex-col gap-4">
            {courses.map((course) => (
              <Button
                key={course.id}
                asChild
                size="lg"
                className="h-auto py-4 text-lg justify-between"
              >
                <Link href={`/courses/${course.id}`}>
                  {course.title}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
