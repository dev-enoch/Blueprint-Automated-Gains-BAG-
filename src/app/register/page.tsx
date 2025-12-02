import { Logo } from '@/components/app/Logo';
import { RegisterForm } from './_components/register-form';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="flex min-h-full flex-col justify-center items-center px-6 py-12 lg:px-8 bg-background">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Logo className="h-12 w-auto mx-auto" />
        <h1 className="mt-6 text-center text-3xl font-bold leading-9 tracking-tight text-foreground">
          Create your account
        </h1>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <RegisterForm />
        <p className="mt-10 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold leading-6 text-primary hover:text-primary/80">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
