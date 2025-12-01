import { getUsers } from "@/lib/data";
import { UserTable } from "./_components/UserTable";

export default async function AdminUsersPage() {
    const users = await getUsers();

    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">View, search, and manage user roles and status.</p>
            <div className="mt-6">
                <UserTable initialUsers={users} />
            </div>
        </div>
    );
}
