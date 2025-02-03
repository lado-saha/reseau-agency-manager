'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { useActionState, useState } from 'react';
import { authenticateUser } from '@/lib/actions';
import { MessageSquareWarningIcon } from 'lucide-react';
import Link from 'next/link';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

// Define the schema for the login form using zod
const loginFormSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please enter a valid email address.' })
    .nonempty({ message: 'Email is required.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long.' })
    .nonempty({ message: 'Password is required.' })
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'form'>) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/station/vehicles';
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  // Set up useForm with zod resolver for validation
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema)
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsPending(true);
    setErrorMessage(null); // Clear any previous error message
    try {
      const result = await authenticateUser(
        false, // Avoid automatic redirection
        data.email,
        data.password
      );

      if (result) {
        // Handle error message from authenticate
        setErrorMessage(result);
      } else {
        // Successful login, redirect to the callback URL
        window.location.href = callbackUrl;
      }
    } catch (error) {
      setErrorMessage(`Something went wrong.${(error as Error).message}`);
    } finally {
      setIsPending(false); // Reset the loading state
    }
  };
  return (
    <Form {...form}>
      <form
        className={cn('flex flex-col gap-6', className)}
        onSubmit={form.handleSubmit(onSubmit)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>

        <div className="grid gap-6">
          {/* Email field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    {...field}
                    className="border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    id="password"
                    type="password"
                    {...field}
                    className="border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button className="w-full" aria-disabled={isPending}>
            Login
          </Button>

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-center gap-2 text-sm text-red-500">
              <MessageSquareWarningIcon className="h-5 w-5" />
              <p>{errorMessage}</p>
            </div>
          )}

          {/* No account message */}
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Don't have an account?
            </span>
          </div>
        </div>

        {/* Sign-up Button */}
        <Link href="/auth/signup">
          <Button
            variant="outline"
            className="w-full"
            aria-disabled={isPending}
          >
            Sign Up
          </Button>
        </Link>
      </form>
    </Form>
  );
}
