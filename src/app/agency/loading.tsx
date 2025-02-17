import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Spinner from '@/components/ui/spinner'; // Assuming you have a spinner component
import { cn } from '@/lib/utils'; // Utility function for conditional class names
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog'; // Import dialog components

interface LoadingProps {
  message?: string; // Optional loading message
  size?: 'sm' | 'md' | 'lg'; // Size of the spinner
  className?: string; // Additional classes for customization
  variant?: 'card' | 'inline' | 'full-screen' | 'dialog'; // Add 'dialog' variant
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
        <div className="flex flex-col items-center justify-center text-center">
          <Spinner className={spinnerSizeClasses[size]} />
          {message && <p className="mt-4 text-muted-foreground">{message}</p>}
        </div>
      </div>
    );
  } if (variant === 'dialog') {
    return (
      <Dialog open={true} onOpenChange={() => { }}>
        <DialogOverlay className="fixed inset-0 bg-background/50 z-50" />
        <DialogContent className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col items-center justify-center p-6">
            <Spinner className={spinnerSizeClasses[size]} />
            {message && (
              <p className="mt-4 text-muted-foreground">{message}</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
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
