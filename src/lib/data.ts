import 'server-only';
import { collection, getDocs, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db as adminDb, adminAuth as adminAuthInstance } from '@/firebase/admin';
import type { Course, Module, Topic, User, UserProfile, UserProgress } from './types';
import fs from 'fs/promises';
import path from 'path';

// Ensure db is not null before using
const db = adminDb!;
const adminAuth = adminAuthInstance!;

// Path to the JSON file
const coursesFilePath = path.join(process.cwd(), 'src', 'lib', 'courses.json');

// Helper function to read courses from JSON
async function readCoursesFile(): Promise<Course[]> {
  try {
    const fileContent = await fs.readFile(coursesFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading courses.json:', error);
    return [];
  }
}

export async function getCourses(): Promise<Course[]> {
  const courses = await readCoursesFile();
  // We need to return courses without modules and topics for the main listing
  return courses.map(({ id, title, description }) => ({ id, title, description, modules: [] }));
}

export async function getCourseById(id: string): Promise<Course | undefined> {
  const courses = await readCoursesFile();
  return courses.find(course => course.id === id);
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
