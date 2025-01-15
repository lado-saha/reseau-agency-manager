'use client';

import { useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/icons';
import { Search } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Define the schema using zod
const searchFormSchema = z.object({
  query: z.string()
});

type SearchFormValues = z.infer<typeof searchFormSchema>;
const defaultFormValues = { query: '' };

export function SearchInput() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const onSubmit = (data: SearchFormValues) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set('page', '1');

      data.query !== ''
        ? params.set('query', data.query)
        : params.delete('query');

      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const [isPending, startTransition] = useTransition();
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: defaultFormValues
  });

  // Handle form submission
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative ml-auto flex-1 md:grow-0"
      >
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem>
              {/* Label (optional, can be removed if not needed) */}
              <FormLabel className="sr-only">Search</FormLabel>
              <FormControl>
                <div className="relative">
                  {/* Icon */}
                  <Search className="absolute left-2.5 top-[.75rem] h-4 w-4 text-muted-foreground" />
                  {/* Input Field */}
                  <Input
                    {...field}
                    type="search"
                    placeholder="Search..."
                    className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                  />
                </div>
              </FormControl>
              <FormMessage /> {/* Displays validation error messages */}
            </FormItem>
          )}
        />
        {isPending && <Spinner className="absolute right-2.5 top-[.75rem]" />}
      </form>
    </Form>
  );
}
