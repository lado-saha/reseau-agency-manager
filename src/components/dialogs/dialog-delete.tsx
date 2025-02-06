'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useRef } from 'react';

interface DeleteDialogProps {
  onDeleteAction: () => void;
  title: string;
  description: string;
}

export function DeleteDialog({
  onDeleteAction,
  title,
  description
}: DeleteDialogProps) {
  const dialogCloseRef = useRef<HTMLButtonElement>(null); // Ref to close the dialog

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="destructive">Fire Employee</Button>
      </DialogTrigger>
      {/* DialogTrigger button will now open the dialog */}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose ref={dialogCloseRef} asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={() => {
              dialogCloseRef.current?.click();
              onDeleteAction()
            }}
          >
            Yes, Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
