'use client';

import { useState, useMemo } from 'react';
import type { User } from '@/lib/types';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Loader2 } from 'lucide-react';
import { updateUserOnServer } from '../actions';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';


export function UserTable({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const searchMatch = user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
      const statusMatch = statusFilter === 'all' || (statusFilter === 'active' && user.active) || (statusFilter === 'inactive' && !user.active);
      const roleMatch = roleFilter === 'all' || user.role === roleFilter;
      return searchMatch && statusMatch && roleMatch;
    });
  }, [users, searchTerm, statusFilter, roleFilter]);
  
  const handleUpdateUser = async (user: User, updates: Partial<{role: 'user' | 'admin', active: boolean}>) => {
    setLoadingStates(prev => ({...prev, [user.id]: true}));
    
    const result = await updateUserOnServer(user.id, updates);
    
    if (result.success && result.user) {
        setUsers(prevUsers => prevUsers.map(u => u.id === result.user!.id ? result.user! : u));
        toast({
            title: "Success",
            description: "User updated successfully."
        })
    } else {
        toast({
            variant: "destructive",
            title: "Error",
            description: result.error || "Failed to update user."
        })
    }
    setLoadingStates(prev => ({...prev, [user.id]: false}));
  };

  return (
    <div className="space-y-4">
        <div className="flex items-center gap-4">
            <Input 
                placeholder="Search by email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
            </Select>
        </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.email}</TableCell>
                <TableCell>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role}
                    </Badge>
                </TableCell>
                <TableCell>
                    <Badge variant={user.active ? 'outline' : 'destructive'} className={cn(user.active && 'border-green-500 text-green-500')}>
                        {user.active ? 'Active' : 'Inactive'}
                    </Badge>
                </TableCell>
                <TableCell>{user.lastLogin ? format(new Date(user.lastLogin), 'PPp') : 'Never'}</TableCell>
                <TableCell>
                  {loadingStates[user.id] ? (
                    <Loader2 className="h-4 w-4 animate-spin"/>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => handleUpdateUser(user, { role: user.role === 'admin' ? 'user' : 'admin' })}>
                          {user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleUpdateUser(user, { active: !user.active })}>
                          {user.active ? 'Deactivate' : 'Activate'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))
            ) : (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        No users found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
