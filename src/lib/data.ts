import 'server-only';
import type { Course, Module, Topic, User, UserProgress } from './types';
import { generateInitialContent } from '@/ai/flows/generate-initial-content';

let mockUsers: User[] = [
  { id: 'user1', email: 'user@bag.com', password: '123456', role: 'user', lastLogin: '2024-07-29T10:00:00Z', active: true },
  { id: 'admin1', email: 'admin@bag.com', password: 'admin1234', role: 'admin', lastLogin: '2024-07-29T12:00:00Z', active: true },
  { id: 'user2', email: 'another.user@example.com', password: '123456', role: 'user', lastLogin: '2024-07-28T15:30:00Z', active: true },
  { id: 'user3', email: 'deactivated@example.com', password: '123456', role: 'user', lastLogin: '2024-07-27T18:00:00Z', active: false },
];

let mockCourses: Course[] = [];
let mockProgress: Record<string, UserProgress> = {
  user1: { 'c1-m1-t1': true },
  admin1: { 'c1-m1-t1': true, 'c1-m1-t2': true },
};

async function generateCourseContent() {
  const course1_module1_topic1_content = await generateInitialContent({ description: 'An introduction to what affiliate marketing is, how it works, and key terminology.' });
  const course1_module1_topic2_content = await generateInitialContent({ description: 'Detailed explanation of finding and selecting profitable niches for affiliate marketing.' });
  const course1_module1_topic3_content = await generateInitialContent({ description: 'Guide on choosing the right affiliate programs and networks like Amazon Associates, ClickBank, and ShareASale.' });
  const course1_module2_topic1_content = await generateInitialContent({ description: 'Step-by-step guide to building a WordPress website for affiliate marketing.' });
  const course1_module2_topic2_content = await generateInitialContent({ description: 'Strategies for creating high-quality, SEO-friendly content that converts readers into buyers.' });
  const course2_module1_topic1_content = await generateInitialContent({ description: 'Basics of on-page, off-page, and technical SEO for affiliate websites.' });
  const course2_module1_topic2_content = await generateInitialContent({ description: 'How to conduct keyword research to find low-competition, high-intent keywords.' });

  mockCourses = [
    {
      id: 'course-1',
      title: 'Affiliate Marketing 101: The Blueprint',
      description: 'Your first step into the world of affiliate marketing.',
      modules: [
        {
          id: 'c1-m1',
          title: 'Module 1: The Basics',
          topics: [
            { id: 'c1-m1-t1', title: 'Introduction to Affiliate Marketing', content: course1_module1_topic1_content.content },
            { id: 'c1-m1-t2', title: 'Finding Your Niche', content: course1_module1_topic2_content.content },
            { id: 'c1-m1-t3', title: 'Choosing the Right Affiliate Programs', content: course1_module1_topic3_content.content },
          ],
        },
        {
          id: 'c1-m2',
          title: 'Module 2: Building Your Platform',
          topics: [
            { id: 'c1-m2-t1', title: 'Setting Up Your Website', content: course1_module2_topic1_content.content },
            { id: 'c1-m2-t2', title: 'Creating High-Converting Content', content: course1_module2_topic2_content.content },
          ],
        },
      ],
    },
    {
      id: 'course-2',
      title: 'Advanced SEO for Affiliates',
      description: 'Master SEO to drive organic traffic and boost your earnings.',
      modules: [
        {
          id: 'c2-m1',
          title: 'Module 1: SEO Fundamentals',
          topics: [
            { id: 'c2-m1-t1', title: 'Understanding SEO', content: course2_module1_topic1_content.content },
            { id: 'c2-m1-t2', title: 'Keyword Research Mastery', content: course2_module1_topic2_content.content },
          ],
        },
      ],
    },
  ];
}

let isGenerating = false;
let generationPromise: Promise<void> | null = null;

async function ensureCoursesGenerated() {
  if (mockCourses.length > 0) return;
  if (isGenerating && generationPromise) {
    await generationPromise;
    return;
  }
  isGenerating = true;
  generationPromise = generateCourseContent().finally(() => {
    isGenerating = false;
    generationPromise = null;
  });
  await generationPromise;
}


// Simulate network latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function authenticateUser(email: string, password: string):Promise<User | undefined> {
  await delay(100);
  const user = mockUsers.find(u => u.email === email && u.password === password);
  return user ? JSON.parse(JSON.stringify(user)) : undefined;
}

export async function getCourses(): Promise<Course[]> {
  await ensureCoursesGenerated();
  await delay(100);
  return JSON.parse(JSON.stringify(mockCourses));
}

export async function getCourseById(id: string): Promise<Course | undefined> {
  await ensureCoursesGenerated();
  await delay(100);
  return JSON.parse(JSON.stringify(mockCourses.find(c => c.id === id)));
}

export async function getUsers(): Promise<User[]> {
  await delay(100);
  return JSON.parse(JSON.stringify(mockUsers));
}

export async function getUserById(id: string): Promise<User | undefined> {
  await delay(100);
  return JSON.parse(JSON.stringify(mockUsers.find(u => u.id === id)));
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  await delay(100);
  return JSON.parse(JSON.stringify(mockUsers.find(u => u.email === email)));
}

export async function updateUser(updatedUser: User): Promise<User> {
  await delay(200);
  const index = mockUsers.findIndex(u => u.id === updatedUser.id);
  if (index !== -1) {
    mockUsers[index] = updatedUser;
    return JSON.parse(JSON.stringify(updatedUser));
  }
  throw new Error('User not found');
}

export async function getUserProgress(userId: string): Promise<UserProgress> {
  await delay(50);
  return JSON.parse(JSON.stringify(mockProgress[userId] || {}));
}

export async function updateUserProgress(userId: string, topicId: string, completed: boolean): Promise<UserProgress> {
  await delay(150);
  if (!mockProgress[userId]) {
    mockProgress[userId] = {};
  }
  mockProgress[userId][topicId] = completed;
  return JSON.parse(JSON.stringify(mockProgress[userId]));
}
