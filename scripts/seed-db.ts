import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Initialize Firebase Admin SDK
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!serviceAccount) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. Please add it to your .env.local file.');
}

try {
    initializeApp({
        credential: require('firebase-admin').credential.cert(JSON.parse(serviceAccount)),
    });
} catch (error: any) {
    if (error.code !== 'app/duplicate-app') {
        throw error;
    }
}


const db = getFirestore();

const coursesData = [
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
            { id: 'c1-m2-t1', title: 'Setting Up Your Website', description: 'A step-by-step guide to getting your affiliate website online using modern, easy-to-use tools.', videoId: 'ERp02p3tX6I' },
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

async function seedDatabase() {
    console.log('Starting to seed database...');

    const batch = db.batch();

    for (const course of coursesData) {
        const courseRef = db.collection('courses').doc(course.id);
        batch.set(courseRef, {
            title: course.title,
            description: course.description
        });

        for (const module of course.modules) {
            const moduleRef = courseRef.collection('modules').doc(module.id);
            batch.set(moduleRef, {
                title: module.title
            });

            for (const topic of module.topics) {
                const topicRef = moduleRef.collection('topics').doc(topic.id);
                batch.set(topicRef, {
                    title: topic.title,
                    description: topic.description,
                    videoId: topic.videoId
                });
            }
        }
    }

    try {
        await batch.commit();
        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

seedDatabase();
