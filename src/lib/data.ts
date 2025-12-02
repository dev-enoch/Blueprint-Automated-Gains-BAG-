import 'server-only';
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, writeBatch } from 'firebase/firestore';
import { db as adminDb, adminAuth as adminAuthInstance } from '@/firebase/admin';
import type { Course, Module, Topic, User, UserProfile, UserProgress } from './types';

// Ensure db is not null before using
const db = adminDb!;
const adminAuth = adminAuthInstance!;


export async function getCourses(): Promise<Course[]> {
  const coursesSnapshot = await getDocs(collection(db, 'courses'));
  const courses: Course[] = [];
  for (const courseDoc of coursesSnapshot.docs) {
    const courseData = courseDoc.data();
    const modulesSnapshot = await getDocs(collection(db, `courses/${courseDoc.id}/modules`));
    const modules: Module[] = [];
    for (const moduleDoc of modulesSnapshot.docs) {
      const moduleData = moduleDoc.data();
      const topicsSnapshot = await getDocs(collection(db, `courses/${courseDoc.id}/modules/${moduleDoc.id}/topics`));
      const topics: Topic[] = topicsSnapshot.docs.map(topicDoc => ({
        id: topicDoc.id,
        ...topicDoc.data()
      } as Topic));
      modules.push({ id: moduleDoc.id, ...moduleData, topics } as Module);
    }
    courses.push({ id: courseDoc.id, ...courseData, modules } as Course);
  }
  return courses;
}

export async function getCourseById(id: string): Promise<Course | undefined> {
  const courseDoc = await getDoc(doc(db, 'courses', id));
  if (!courseDoc.exists()) {
    return undefined;
  }
  const courseData = courseDoc.data();
  const modulesSnapshot = await getDocs(collection(db, `courses/${id}/modules`));
  const modules: Module[] = [];
  for (const moduleDoc of modulesSnapshot.docs) {
    const moduleData = moduleDoc.data();
    const topicsSnapshot = await getDocs(collection(db, `courses/${id}/modules/${moduleDoc.id}/topics`));
    const topics: Topic[] = topicsSnapshot.docs.map(topicDoc => ({
      id: topicDoc.id,
      ...topicDoc.data()
    } as Topic));
    modules.push({ id: moduleDoc.id, ...moduleData, topics } as Module);
  }
  return { id: courseDoc.id, ...courseData, modules } as Course;
}

export async function getUsers(): Promise<User[]> {
    if (!adminAuth) {
        console.warn('Firebase Admin Auth not initialized. Cannot get users.');
        return [];
    }
    const listUsersResult = await adminAuth.listUsers();
    const users: User[] = await Promise.all(listUsersResult.users.map(async (userRecord) => {
        const userDoc = await getDoc(doc(db, 'users', userRecord.uid));
        const userProfile = userDoc.data() as UserProfile | undefined;
        return {
            id: userRecord.uid,
            email: userRecord.email || null,
            role: userProfile?.role || 'user',
            lastLogin: userRecord.metadata.lastSignInTime,
            active: !userRecord.disabled,
        };
    }));
    return users;
}

export async function updateUser(userId: string, updates: Partial<{ role: 'user' | 'admin', active: boolean }>): Promise<User> {
    if (!adminAuth) {
        throw new Error('Firebase Admin Auth not initialized. Cannot update user.');
    }
    const userRecord = await adminAuth.getUser(userId);
    
    if (updates.role) {
        await adminAuth.setCustomUserClaims(userId, { role: updates.role });
        const userDocRef = doc(db, 'users', userId);
        await updateDoc(userDocRef, { role: updates.role });
    }
    
    if (updates.active !== undefined) {
        await adminAuth.updateUser(userId, { disabled: !updates.active });
    }

    const updatedUserRecord = await adminAuth.getUser(userId);
    const updatedUserDoc = await getDoc(doc(db, 'users', userId));
    const userProfile = updatedUserDoc.data() as UserProfile | undefined;

    return {
        id: updatedUserRecord.uid,
        email: updatedUserRecord.email || null,
        role: userProfile?.role || 'user',
        lastLogin: updatedUserRecord.metadata.lastSignInTime,
        active: !updatedUserRecord.disabled,
    };
}


export async function getUserProgress(userId: string): Promise<UserProgress> {
    const progressSnapshot = await getDocs(collection(db, 'users', userId, 'progress'));
    const progress: UserProgress = {};
    progressSnapshot.forEach(doc => {
        progress[doc.id] = doc.data().completed;
    });
    return progress;
}

export async function updateUserProgress(userId: string, topicId: string, completed: boolean): Promise<UserProgress> {
    const progressRef = doc(db, 'users', userId, 'progress', topicId);
    await setDoc(progressRef, { completed });
    return getUserProgress(userId);
}
