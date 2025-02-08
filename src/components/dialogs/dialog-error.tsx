'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { AlertTriangleIcon } from 'lucide-react';

interface ErrorDialogProps {
  isOpen: boolean;
  onCloseAction: () => void;
  title: string;
  description: string;
}

export function ErrorDialog({ isOpen, onCloseAction, title, description }: ErrorDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onCloseAction}>
      <DialogContent className="sm:max-w-md bg-red-50">
        <DialogHeader className="text-red-700">
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <AlertTriangleIcon className="h-6 w-6 text-red-600" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-red-800 font-medium">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button variant="outline" onClick={onCloseAction}>
              Understood
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
