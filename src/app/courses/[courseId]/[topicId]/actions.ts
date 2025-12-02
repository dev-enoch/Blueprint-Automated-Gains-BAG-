'use server';

import { getAuth } from "@/lib/auth";
import { updateUserProgress } from "@/lib/data";
import { revalidatePath } from "next/cache";

export async function updateUserProgressOnServer(userId: string, topicId: string, completed: boolean) {
    const user = await getAuth();
    // Basic validation to ensure the user making the request is the one whose progress is being updated
    if (!user || user.id !== userId) {
        throw new Error('Permission denied.');
    }
    
    try {
        const updatedProgress = await updateUserProgress(userId, topicId, completed);
        // Revalidate the path for the specific course to update the UI
        const courseId = topicId.split('-')[0]; // simple way to derive courseId from topicId like 'c1-m1-t1'
        revalidatePath(`/courses/${courseId}`);
        revalidatePath(`/courses/${courseId}/${topicId}`);
        return { success: true, progress: updatedProgress };
    } catch (e: any) {
        return { error: e.message || 'An unknown error occurred.' };
    }
}
