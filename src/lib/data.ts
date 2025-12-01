import 'server-only';
import type { Course, Module, Topic, User, UserProgress } from './types';

let mockUsers: User[] = [
  { id: 'user1', email: 'user@bag.com', password: '123456', role: 'user', lastLogin: '2024-07-29T10:00:00Z', active: true },
  { id: 'admin1', email: 'admin@bag.com', password: 'admin1234', role: 'admin', lastLogin: '2024-07-29T12:00:00Z', active: true },
  { id: 'user2', email: 'another.user@example.com', password: '123456', role: 'user', lastLogin: '2024-07-28T15:30:00Z', active: true },
  { id: 'user3', email: 'deactivated@example.com', password: '123456', role: 'user', lastLogin: '2024-07-27T18:00:00Z', active: false },
];

const course1_module1_topic1_content = `
<h3>What is Affiliate Marketing?</h3>
<p>Affiliate marketing is a performance-based marketing strategy where a business rewards one or more affiliates for each visitor or customer brought by the affiliate's own marketing efforts.</p>
<h3>How it Works</h3>
<ol>
  <li>An affiliate promotes a product or service on their website.</li>
  <li>A customer clicks the affiliate link.</li>
  <li>The customer purchases the product.</li>
  <li>The affiliate earns a commission.</li>
</ol>
<h3>Key Terminology</h3>
<ul>
  <li><strong>Affiliate:</strong> The publisher or blogger promoting the product.</li>
  <li><strong>Merchant:</strong> The company that creates the product.</li>
  <li><strong>Affiliate Link:</strong> A unique URL that tracks the traffic sent from the affiliate’s site to the merchant’s site.</li>
  <li><strong>Commission:</strong> The percentage of the sale paid to the affiliate.</li>
</ul>
`;

const course1_module1_topic2_content = `
<h3>What is a Niche?</h3>
<p>In affiliate marketing, a niche is a specific segment of a larger market. For example, instead of "fitness," you might focus on "yoga for beginners."</p>
<h3>Why is a Niche Important?</h3>
<p>Focusing on a niche allows you to target a specific audience with less competition. This makes it easier to rank in search engines and establish yourself as an authority.</p>
<h3>How to Find a Profitable Niche</h3>
<ul>
  <li><strong>Follow Your Passions:</strong> Choose a topic you are genuinely interested in.</li>
  <li><strong>Research Keywords:</strong> Use tools like Google Keyword Planner to find topics people are searching for.</li>
  <li><strong>Check for Profitability:</strong> Look for affiliate programs in your chosen niche to ensure you can monetize your content.</li>
</ul>
`;

const course1_module1_topic3_content = `
<h3>Popular Affiliate Networks</h3>
<ul>
  <li><strong>Amazon Associates:</strong> A great starting point with a vast range of physical products.</li>
  <li><strong>ClickBank:</strong> Specializes in digital products like e-books and online courses.</li>
  <li><strong>ShareASale:</strong> A large network with thousands of merchants across various industries.</li>
</ul>
<h3>What to Look For</h3>
<p>When choosing a program, consider the commission rate, cookie duration (how long you have to earn a commission after a click), and the quality of the products.</p>
`;

const course1_module2_topic1_content = `
<h3>Why WordPress?</h3>
<p>WordPress is a powerful and flexible platform that's perfect for affiliate marketing websites. It's easy to use, has thousands of themes and plugins, and is great for SEO.</p>
<h3>Step-by-Step Guide</h3>
<ol>
  <li><strong>Choose a Domain Name and Hosting:</strong> Your domain is your website's address (e.g., myawesomeblog.com). Hosting is where your website lives on the internet.</li>
  <li><strong>Install WordPress:</strong> Most hosting providers offer a one-click WordPress installation.</li>
  <li><strong>Select a Theme:</strong> Choose a clean, professional theme that fits your niche.</li>
  <li><strong>Install Essential Plugins:</strong> Plugins like Yoast SEO and a caching plugin are crucial for performance and optimization.</li>
</ol>
`;

const course1_module2_topic2_content = `
<h3>Understanding Your Audience</h3>
<p>Before you write, you need to know who you're writing for. What are their problems? What are their goals? Your content should provide solutions.</p>
<h3>Types of High-Converting Content</h3>
<ul>
  <li><strong>Product Reviews:</strong> In-depth, honest reviews of products in your niche.</li>
  <li><strong>"Best Of" Lists:</strong> Curated lists of the best products for a specific purpose (e.g., "The 5 Best Yoga Mats for Beginners").</li>
  <li><strong>How-To Guides:</strong> Tutorials that solve a specific problem for your audience.</li>
</ul>
<h3>Writing for SEO</h3>
<p>Integrate your target keywords naturally into your content. Use them in your title, headings, and throughout the body of your text. Write for humans first, and search engines second.</p>
`;

const course2_module1_topic1_content = `
<h3>The Three Pillars of SEO</h3>
<ol>
    <li><strong>On-Page SEO:</strong> Optimizing the content on your website. This includes keyword usage, title tags, and meta descriptions.</li>
    <li><strong>Off-Page SEO:</strong> Building authority and trust through backlinks from other websites.</li>
    <li><strong>Technical SEO:</strong> Ensuring your website is technically sound for search engine crawlers. This includes site speed, mobile-friendliness, and a clean site structure.</li>
</ol>
`;

const course2_module1_topic2_content = `
<h3>What are High-Intent Keywords?</h3>
<p>These are search terms that indicate a user is close to making a purchase. They often include words like "best," "review," "buy," or specific product names.</p>
<h3>Tools for Keyword Research</h3>
<ul>
  <li><strong>Google Keyword Planner:</strong> A free tool from Google.</li>
  <li><strong>Ahrefs & SEMrush:</strong> Paid tools that offer more advanced features and competitive analysis.</li>
</ul>
<h3>The Long-Tail Strategy</h3>
<p>Long-tail keywords are longer, more specific phrases (e.g., "best running shoes for flat feet"). They have lower search volume but much higher conversion rates because the user's intent is very clear.</p>
`;

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
            { id: 'c1-m1-t1', title: 'Introduction to Affiliate Marketing', content: course1_module1_topic1_content },
            { id: 'c1-m1-t2', title: 'Finding Your Niche', content: course1_module1_topic2_content },
            { id: 'c1-m1-t3', title: 'Choosing the Right Affiliate Programs', content: course1_module1_topic3_content },
          ],
        },
        {
          id: 'c1-m2',
          title: 'Module 2: Building Your Platform',
          topics: [
            { id: 'c1-m2-t1', title: 'Setting Up Your Website', content: course1_module2_topic1_content },
            { id: 'c1-m2-t2', title: 'Creating High-Converting Content', content: course1_module2_topic2_content },
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
            { id: 'c2-m1-t1', title: 'Understanding SEO', content: course2_module1_topic1_content },
            { id: 'c2-m1-t2', title: 'Keyword Research Mastery', content: course2_module1_topic2_content },
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
