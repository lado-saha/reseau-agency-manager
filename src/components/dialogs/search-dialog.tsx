
'use client';

import { useState, useTransition, useEffect, useRef, JSX } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

// Define the schema using zod
const searchFormSchema = z.object({
  query: z.string(),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;
const defaultFormValues = { query: '' };

interface SearchableDialogProps<T> {
  triggerText: string;
  onSelectAction: (selectedItems: T[]) => void; // Returns selected objects
  fetchItemsAction: (query: string) => Promise<T[]>; // Generic fetch function
  selectionMode?: 'single' | 'multiple';
  searchLabel?: string;
  dialogTitle?: string;
  renderItemAction: (item: T, isSelected: boolean, onCheckedChange: (checked: boolean) => void) => JSX.Element;
}

export function SearchDialogGeneric<T>({
  triggerText,
  onSelectAction,
  fetchItemsAction,
  selectionMode = 'multiple',
  searchLabel = 'Search...',
  dialogTitle = 'Search and Select',
  renderItemAction,
}: SearchableDialogProps<T>) {
  const [selectedItems, setSelectedItems] = useState<T[]>([]);
  const [filteredItems, setFilteredItems] = useState<T[]>([]);
  const [showOnlySelected, setShowOnlySelected] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: defaultFormValues,
  });

  const dialogCloseRef = useRef<HTMLButtonElement>(null);

  // Fetch data based on search query
  const fetchData = async (searchQuery: string) => {
    const items = await fetchItemsAction(searchQuery);
    setFilteredItems(items);
  };

  // Perform initial search when the dialog is opened
  useEffect(() => {
    fetchData('');
  }, []);

  // Handle search input change with debouncing
  useEffect(() => {
    const subscription = form.watch((value) => {
      startTransition(() => {
        fetchData(value.query || '');
      });
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleSelect = (item: T, checked: boolean) => {
    if (selectionMode === 'single') {
      setSelectedItems(checked ? [item] : []);
    } else {
      setSelectedItems((prev) =>
        checked ? [...prev, item] : prev.filter((i) => i !== item)
      );
    }
  };

  // Toggle to show only selected items
  const toggleShowOnlySelected = () => {
    setShowOnlySelected((prev) => !prev);
  };

  // Determine which items to display based on the filter
  const itemsToDisplay = showOnlySelected
    ? selectedItems
    : filteredItems;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{triggerText}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] max-h-[90vh] w-full h-full flex flex-col">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>

        {/* Search Bar and Filter Button */}
        <div className="flex items-center gap-2 p-4">
          <Form {...form}>
            <form className="flex-1">
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">{searchLabel}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Search className="absolute left-2.5 top-[.75rem] h-4 w-4 text-muted-foreground" />
                        <Input
                          {...field}
                          type="search"
                          placeholder={searchLabel}
                          className="w-full rounded-lg bg-background pl-8"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          {/* Filter Button */}
          <Button
            variant={showOnlySelected ? 'default' : 'outline'}
            onClick={toggleShowOnlySelected}
            className="flex items-center gap-2 mt-2"
          >
            <Filter />
            <span>{showOnlySelected ? 'Show All' : 'Show Selected'}</span>
          </Button>
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {itemsToDisplay.map((item) =>
              renderItemAction(
                item,
                selectedItems.includes(item),
                (checked) => handleSelect(item, checked)
              )
            )}
          </div>
        </div>

        {/* Footer */}
        <DialogFooter>
          <div className="flex items-center justify-between w-full">
            <span className="text-sm text-muted-foreground">
              {selectedItems.length} item(s) selected
            </span>
            <div className="flex gap-2">
              <DialogClose ref={dialogCloseRef} asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Button
                disabled={selectedItems.length === 0}
                onClick={() => {
                  onSelectAction(selectedItems);
                  dialogCloseRef.current?.click();
                }}
              >
                Select
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
