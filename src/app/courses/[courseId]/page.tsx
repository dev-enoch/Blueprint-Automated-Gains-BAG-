import { getAuth } from '@/lib/auth';
import { getCourseById, getUserProgress } from '@/lib/data';
import { notFound, redirect } from 'next/navigation';
import { AppLayout } from '@/components/app/AppLayout';
import { CourseClientPage } from './_components/CourseClientPage';

type CoursePageProps = {
  params: {
    courseId: string;
  };
};

export default async function CoursePage({ params }: CoursePageProps) {
  const user = await getAuth();
  if (!user) {
    redirect('/login');
  }

  const course = await getCourseById(params.courseId);
  if (!course) {
    notFound();
  }

  const progress = await getUserProgress(user.id);

  const allTopicIds = course.modules.flatMap(m => m.topics.map(t => t.id));

  return (
    <AppLayout>
      <CourseClientPage 
        course={course} 
        initialProgress={progress} 
        userId={user.id} 
        allTopicIds={allTopicIds}
      />
    </AppLayout>
  );
}
