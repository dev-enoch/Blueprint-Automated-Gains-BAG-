import { getAuth } from '@/lib/auth';
import { getCourseById, getUserProgress } from '@/lib/data';
import { notFound, redirect } from 'next/navigation';
import { AppLayout } from '@/components/app/AppLayout';
import { CourseClientPage } from './_components/CourseClientPage';

type CoursePlayerPageProps = {
  params: {
    courseId: string;
    topicId: string;
  };
};

export default async function CoursePlayerPage({ params }: CoursePlayerPageProps) {
  const user = await getAuth();
  if (!user) {
    // This case should be handled by middleware, but as a fallback:
    redirect('/login');
  }

  const course = await getCourseById(params.courseId);
  if (!course) {
    notFound();
  }

  const progress = await getUserProgress(user.id);

  const allTopicIds = course.modules.flatMap(m => m.topics.map(t => t.id));
  const currentTopicExists = allTopicIds.includes(params.topicId);

  if(!currentTopicExists) {
    notFound();
  }

  return (
    <AppLayout>
      <CourseClientPage 
        course={course} 
        initialProgress={progress} 
        userId={user.id} 
        allTopicIds={allTopicIds}
        currentTopicId={params.topicId}
      />
    </AppLayout>
  );
}
