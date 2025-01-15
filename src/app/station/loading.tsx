import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Spinner from '@/components/ui/spinner'; // Assuming you have a spinner component
import { cn } from '@/lib/utils'; // Utility function for conditional class names

interface LoadingProps {
  message?: string; // Optional loading message
  size?: 'sm' | 'md' | 'lg'; // Size of the spinner
  className?: string; // Additional classes for customization
  variant?: 'card' | 'inline' | 'full-screen'; // Different loading styles
}

export default function Loading({
  message = 'Loading...',
  size = 'md',
  className = '',
  variant = 'inline'
}: LoadingProps) {
  const spinnerSizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  if (variant === 'card') {
    return (
      <Card
        className={cn('flex flex-col items-center justify-center', className)}
      >
        <CardHeader>
          <CardTitle>{message}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Spinner className={spinnerSizeClasses[size]} />
        </CardContent>
      </Card>
    );
  }

  if (variant === 'full-screen') {
    return (
      <div
        className={cn(
          'fixed inset-0 flex items-center justify-center bg-background/50 z-50',
          className
        )}
      >
        <div className="text-center">
          <Spinner className={spinnerSizeClasses[size]} />
          {message && <p className="mt-4 text-muted-foreground">{message}</p>}
        </div>
      </div>
    );
  }

  // Default: Inline loader
  return (
    <div className={cn('flex flex-col items-center', className)}>
      <Spinner className={spinnerSizeClasses[size]} />
      {message && (
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  );
}
