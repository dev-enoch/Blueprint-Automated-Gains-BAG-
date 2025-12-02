import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import * as admin from 'firebase-admin';

dotenv.config({ path: '.env.local' });

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!serviceAccount) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. Please add it to your .env.local file.');
}

try {
    initializeApp({
        credential: admin.credential.cert(JSON.parse(serviceAccount)),
    });
} catch (error: any) {
    if (error.code !== 'app/duplicate-app') {
        throw error;
    }
}


const db = getFirestore();

const coursesData = [
    // English Courses
    {
      id: 'en-affiliate-marketing',
      title: 'Affiliate Marketing',
      description: 'Learn the fundamentals of affiliate marketing and how to succeed.',
      language: 'en',
      modules: [
        {
          id: 'en-am-m1',
          title: 'Module 1: Introduction',
          topics: [
            { id: 'en-am-m1-t1', title: 'What is Affiliate Marketing?', description: 'An overview of the affiliate marketing ecosystem.', videoId: 'u-g_N4s4p2s' },
            { id: 'en-am-m1-t2', title: 'Choosing Your Niche', description: 'How to find a profitable niche that you are passionate about.', videoId: 'bT_32G-8a3g' },
          ],
        },
      ],
    },
    {
      id: 'en-graphics-design',
      title: 'Graphics Design',
      description: 'Master the art of graphics design with modern tools and techniques.',
      language: 'en',
      modules: [
        {
          id: 'en-gd-m1',
          title: 'Module 1: The Basics',
          topics: [
            { id: 'en-gd-m1-t1', title: 'Introduction to Design Principles', description: 'Learn about the core principles of great design.', videoId: 'YqQx75OPRa0' },
          ],
        },
      ],
    },
    {
      id: 'en-fb-tiktok-ads',
      title: 'Facebook & Tiktok Advertising',
      description: 'Drive growth with powerful advertising strategies on social media.',
      language: 'en',
      modules: [
        {
          id: 'en-fta-m1',
          title: 'Module 1: Getting Started',
          topics: [
            { id: 'en-fta-m1-t1', title: 'Setting up Your Ad Accounts', description: 'A step-by-step guide to creating your advertising accounts.', videoId: 's-g2I_b2aFU' },
          ],
        },
      ],
    },
    // Hausa Courses
    {
      id: 'ha-affiliate-marketing',
      title: 'Affiliate Marketing (Hausa)',
      description: 'Koyi tushen tallan haɗin gwiwa da yadda ake samun nasara.',
      language: 'ha',
      modules: [
        {
          id: 'ha-am-m1',
          title: 'Babi na 1: Gabatarwa',
          topics: [
            { id: 'ha-am-m1-t1', title: 'Menene Affiliate Marketing?', description: 'Cikakken bayani akan tsarin affiliate marketing.', videoId: 'x4q-o1f12I' },
            { id: 'ha-am-m1-t2', title: 'Zaben Fannin Ka', description: 'Yadda zaka nemo fannin da zai kawo riba wanda kake sha\'awa.', videoId: 'v8sXkGq33c' },
          ],
        },
      ],
    },
    {
      id: 'ha-graphics-design',
      title: 'Graphics Design (Hausa)',
      description: 'Kware a fasahar zane-zane na zamani da dabaru.',
      language: 'ha',
       modules: [
        {
          id: 'ha-gd-m1',
          title: 'Babi na 1: Tushe',
          topics: [
            { id: 'ha-gd-m1-t1', title: 'Gabatarwa ga Ka\'idojin Zane', description: 'Koyi game da muhimman ka\'idojin zane mai kyau.', videoId: 'a_hOpYiiX' },
          ],
        },
      ],
    },
    {
      id: 'ha-fb-tiktok-ads',
      title: 'Facebook & Tiktok Advertising (Hausa)',
      description: 'Samu ci gaba da manyan dabarun talla a shafukan sada zumunta.',
      language: 'ha',
       modules: [
        {
          id: 'ha-fta-m1',
          title: 'Babi na 1: Farawa',
          topics: [
            { id: 'ha-fta-m1-t1', title: 'Kafa Asusun Tallan Ka', description: 'Jagora mataki-mataki don ƙirƙirar asusun tallan ka.', videoId: '5Z1b_V_mX' },
          ],
        },
      ],
    },
];

async function seedDatabase() {
    console.log('Starting to seed database...');

    const batch = db.batch();

    for (const course of coursesData) {
        const { modules, ...courseData } = course;
        const courseRef = db.collection('courses').doc(course.id);
        batch.set(courseRef, courseData);

        for (const module of course.modules) {
            const { topics, ...moduleData } = module;
            const moduleRef = courseRef.collection('modules').doc(module.id);
            batch.set(moduleRef, moduleData);

            for (const topic of module.topics) {
                const topicRef = moduleRef.collection('topics').doc(topic.id);
                batch.set(topicRef, topic);
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
