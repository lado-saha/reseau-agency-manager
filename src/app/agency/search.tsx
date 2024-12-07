'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from 'src/components/ui/input';
import { Spinner } from 'src/components/icons';
import { Search } from 'lucide-react';
import { cn } from 'src/lib/utils';
import clsx from 'clsx';

interface SearchInputProps {
  className?: string;
}

export function SearchInput({ className = '' }: SearchInputProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function searchAction(formData: FormData) {
    let value = formData.get('q') as string;
    let params = new URLSearchParams({ q: value });
    startTransition(() => {
      router.replace(`/?${params.toString()}`);
    });
  }

  return (
    <form
      action={searchAction}
      className={clsx('relative ml-auto flex-1 md:grow-0', className)}
    >
      <Search className="absolute left-2.5 top-[.75rem] h-4 w-4 text-muted-foreground" />
      <Input
        name="q"
        type="search"
        placeholder="Search..."
        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
      />
      {isPending && <Spinner />}
    </form>
  );
}
