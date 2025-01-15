import { cn } from '@/lib/utils';

interface SpinnerProps {
  className?: string;
}

export default function Spinner({ className }: SpinnerProps) {
  return (
    <svg
      className={cn('animate-spin text-muted-foreground', className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C3.582 0 0 3.582 0 8h4zm2 5.291V16c0 3.313 2.687 6 6 6v-4a2 2 0 01-2-2h-4z"
      />
    </svg>
  );
}
