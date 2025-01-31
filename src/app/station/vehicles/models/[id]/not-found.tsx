import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, FrownIcon } from 'lucide-react';
import Link from 'next/link';

// This is automatically called by the notFound()
export default function NotFound() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <FrownIcon className="w-40 h-40 text-grey-500 p-8" />
      <h2 className="text-2xl font-semibold">404 Not Found</h2>
      <p>Could not find Associated Vehicle Model.</p>
      <Link href="/station/vehicles/models">
        <Button className="mt-4 rounded-md px-4 py-2">
          <ArrowLeftIcon />
          Go Back
        </Button>
      </Link>
    </main>
  );
}
