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
import { ArchiveIcon, Trash2Icon } from 'lucide-react';
import { useRef } from 'react';

export type DeletionMode = 'archive' | 'delete';

interface DeleteDialogProps {
  onDeleteAction: () => void;
  title: string;
  description: string;
  triggerText: string;
  mode: DeletionMode;
}

export function DeleteDialog({
  onDeleteAction,
  title,
  description,
  triggerText,
  mode = 'archive'
}: DeleteDialogProps) {
  const dialogCloseRef = useRef<HTMLButtonElement>(null);

  const getButtonVariant = () => {
    return 'destructive'
  };

  const getIcon = () => {
    return mode === 'delete' ? (
      <Trash2Icon className="h-3.5 w-3.5" />
    ) : (
      <ArchiveIcon className="h-3.5 w-3.5" />
    );
  };

  const getActionButtonText = () => {
    return mode === 'delete' ? 'Yes, Delete' : 'Yes, Archive';
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={getButtonVariant()}>
          <span className="hidden md:inline">{triggerText}</span>
          {getIcon()}
        </Button>
      </DialogTrigger>
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
              onDeleteAction();
            }}
          >
            {getActionButtonText()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}