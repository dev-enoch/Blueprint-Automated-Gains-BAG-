'use server';

import { getAuth } from "@/lib/auth";
import { updateUserProgress } from "@/lib/data";
import { revalidatePath } from "next/cache";

export async function updateUserProgressOnServer(userId: string, topicId: string, completed: boolean) {
    const user = await getAuth();
    if (!user || user.id !== userId) {
        throw new Error('Permission denied.');
    }
    
    try {
        const updatedProgress = await updateUserProgress(userId, topicId, completed);
        const courseId = topicId.split('-')[0];
        revalidatePath(`/courses/${courseId}`);
        revalidatePath(`/courses/${courseId}/${topicId}`);
        return { success: true, progress: updatedProgress };
    } catch (e: any) {
        return { error: e.message || 'An unknown error occurred.' };
    }
}
