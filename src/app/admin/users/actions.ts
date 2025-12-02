'use server';

import { getAuth } from "@/lib/auth";
import { updateUser } from "@/lib/data";
import { revalidatePath } from "next/cache";

export async function updateUserOnServer(userId: string, updates: Partial<{ role: 'user' | 'admin', active: boolean }>) {
    const adminUser = await getAuth();
    if (!adminUser || adminUser.role !== 'admin') {
        return { error: 'Permission denied.' };
    }
    
    try {
        const updatedUser = await updateUser(userId, updates);
        revalidatePath('/admin/users');
        return { success: true, user: updatedUser };
    } catch (e: any) {
        return { error: e.message || 'An unknown error occurred.' };
    }
}
