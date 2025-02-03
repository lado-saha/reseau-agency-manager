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
import { useState } from 'react';
import { createNewUser } from '@/lib/actions';
import { MessageSquareWarningIcon } from 'lucide-react';
import Link from 'next/link';

// Define the schema for the login form using zod
const signupFormSchema = z.object({
  name: z.string().nonempty('Please enter your names.'),
  email: z
    .string()
    .email({ message: 'Please enter a valid email address.' })
    .nonempty({ message: 'Email is required.' }),
  role: z.string().nonempty('Please enter the role assigned to you.'),
  password: z
    .string()
    .min(1, { message: 'Password must be at least 1 characters long.' })
    .nonempty({ message: 'Password is required.' })
});

type SignupFormValue = z.infer<typeof signupFormSchema>;

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'form'>) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/auth/login';
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  // Set up useForm with zod resolver for validation
  const form = useForm<SignupFormValue>({
    resolver: zodResolver(signupFormSchema)
  });

  const onSubmit = async (data: SignupFormValue) => {
    setIsPending(true);
    // setErrorMessage(null); // Clear any previous error message
    try {
      const result = await createNewUser(
        data.name,
        data.email,
        data.role,
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
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and role below to create your account
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
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Input
                    id="role"
                    type="text"
                    placeholder="Head of Statio"
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
            Signup
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
              Already have an account?
            </span>
          </div>
        </div>

        {/* Sign-up Button */}
        <Link href="/auth/login">
          <Button
            variant="outline"
            className="w-full"
            aria-disabled={isPending}
          >
            Login
          </Button>
        </Link>
      </form>
    </Form>
  );
}
