import { getAuth, signOut } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  Bell,
  Home,
  Users,
  BookOpenCheck,
  PanelLeft,
  Search,
  LogOut,
  Shield,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from '@/components/app/Logo';
import { NavLink } from './_components/NavLink';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuth();

  if (!user || user.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/admin" className="flex items-center gap-2 font-semibold">
              <Logo />
              <span className="">BAG Admin</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <NavLink href="/admin/users">
                <Users className="h-4 w-4" />
                User Management
              </NavLink>
              <NavLink href="/admin/courses">
                <BookOpenCheck className="h-4 w-4" />
                Course Editor
              </NavLink>
            </nav>
          </div>
          <div className="mt-auto p-4">
             <Button size="sm" className="w-full" asChild>
                <Link href="/">
                    <Shield className="mr-2 h-4 w-4" />
                    Exit Admin
                </Link>
             </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="/admin"
                  className="flex items-center gap-2 text-lg font-semibold mb-4"
                >
                  <Logo />
                  <span className="sr-only">BAG Admin</span>
                </Link>
                <NavLink href="/admin/users">
                  <Users className="h-5 w-5" />
                  User Management
                </NavLink>
                <NavLink href="/admin/courses">
                  <BookOpenCheck className="h-5 w-5" />
                  Course Editor
                </NavLink>
              </nav>
              <div className="mt-auto">
                <Button size="sm" className="w-full" asChild>
                    <Link href="/">
                        <Shield className="mr-2 h-4 w-4" />
                        Exit Admin
                    </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            {/* Can add search here if needed */}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Users className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <form action={signOut}>
                <DropdownMenuItem asChild>
                   <button type="submit" className="w-full">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </DropdownMenuItem>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
