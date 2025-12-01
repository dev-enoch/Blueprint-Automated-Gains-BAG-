import type { Course, User, UserProgress } from './types';

let mockUsers: User[] = [
  { id: 'user1', email: 'user@bag.com', password: '123456', role: 'user', lastLogin: '2024-07-29T10:00:00Z', active: true },
  { id: 'admin1', email: 'admin@bag.com', password: 'admin1234', role: 'admin', lastLogin: '2024-07-29T12:00:00Z', active: true },
  { id: 'user2', email: 'another.user@example.com', password: '123456', role: 'user', lastLogin: '2024-07-28T15:30:00Z', active: true },
  { id: 'user3', email: 'deactivated@example.com', password: '123456', role: 'user', lastLogin: '2024-07-27T18:00:00Z', active: false },
];

let mockCourses: Course[] = [
    {
      id: 'course-1',
      title: 'Affiliate Marketing 101: The Blueprint',
      description: 'Your first step into the world of affiliate marketing.',
      modules: [
        {
          id: 'c1-m1',
          title: 'Module 1: The Basics',
          topics: [
            { id: 'c1-m1-t1', title: 'Introduction to Affiliate Marketing', description: 'Learn the fundamentals of what affiliate marketing is and how it works. We cover the key players and the flow of value.', videoId: 'u-g_N4s4p2s' },
            { id: 'c1-m1-t2', title: 'Finding Your Niche', description: 'Discover how to identify and validate a profitable niche that aligns with your passions and has market demand.', videoId: 'bT_32G-8a3g' },
            { id: 'c1-m1-t3', title: 'Choosing the Right Affiliate Programs', description: 'Not all affiliate programs are created equal. Learn what to look for, from commission structures to merchant support.', videoId: 'P_4nK7aJ21E' },
          ],
        },
        {
          id: 'c1-m2',
          title: 'Module 2: Building Your Platform',
          topics: [
            { id: 'c1-m2-t1', title: 'Setting Up Your Website', description: 'A step-by-step guide to getting your affiliate website online using modern, easy-to-use tools.', videoId: 'https://www.youtube.com/watch?v=ERp02p3tX6I' },
            { id: 'c1-m2-t2', title: 'Creating High-Converting Content', description: 'Learn the art and science behind content that not only ranks but also persuades your audience to take action.', videoId: '5nER-z22a2I' },
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
            { id: 'c2-m1-t1', title: 'Understanding SEO', description: 'A deep dive into the three pillars of SEO: On-Page, Off-Page, and Technical SEO.', videoId: 'PYE_y9pB6lE' },
            { id: 'c2-m1-t2', title: 'Keyword Research Mastery', description: 'Move beyond basic keyword research to uncover high-intent, low-competition keywords that drive sales.', videoId: 'GWoVz_nE2ZE' },
          ],
        },
      ],
    },
  ];

let mockProgress: Record<string, UserProgress> = {
  user1: { 'c1-m1-t1': true },
  admin1: { 'c1-m1-t1': true, 'c1-m1-t2': true },
};

// Simulate network latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function authenticateUser(email: string, password: string):Promise<User | undefined> {
  await delay(100);
  const user = mockUsers.find(u => u.email === email && u.password === password);
  return user ? JSON.parse(JSON.stringify(user)) : undefined;
}

export async function getCourses(): Promise<Course[]> {
  await delay(100);
  return JSON.parse(JSON.stringify(mockCourses));
}

export async function getCourseById(id: string): Promise<Course | undefined> {
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
