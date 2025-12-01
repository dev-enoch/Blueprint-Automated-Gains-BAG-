import { getAuth, signOut } from '@/lib/auth';
import { Logo } from './Logo';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { User, Shield, LogOut } from 'lucide-react';
import Link from 'next/link';

export async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuth();

  // The middleware now handles redirection, so we can assume user exists here.
  // A check is still good for type safety and as a fallback.
  if (!user) {
    // This state should ideally not be reached if the middleware is working.
    // You could render a loading spinner or a fallback UI here.
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 flex items-center h-16 px-4 border-b bg-background/80 backdrop-blur-sm sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Logo />
          <span className="text-lg">BAG</span>
        </Link>
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {user.role === 'admin' && (
                <DropdownMenuItem asChild>
                  <Link href="/admin">
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Admin Panel</span>
                  </Link>
                </DropdownMenuItem>
              )}
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
        </div>
      </header>
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
