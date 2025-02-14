'use client';

import { useState, useTransition, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/icons';
import { Search, Filter } from 'lucide-react'; // Added Filter icon
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
import { VehicleModelRepository } from '@/lib/repo/vechicle-model-repo';
import { VehicleModel } from '@/lib/models/resource';
import { VehicleModelSearchItem } from './item-vehicle-model';

// Define the schema using zod
const searchFormSchema = z.object({
  query: z.string(),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;
const defaultFormValues = { query: '' };

interface SearchableDialogProps {
  triggerText: string;
  onSelectAction: (selectedItems: VehicleModel[]) => void; // Return full objects
  selectionMode?: 'single' | 'multiple'; // Prop for selection mode
}

export function SearchDialogVehicleModel({
  triggerText,
  onSelectAction,
  selectionMode = 'multiple', // Default to multiple selection
}: SearchableDialogProps) {
  const [selectedItems, setSelectedItems] = useState<VehicleModel[]>([]); // Store full objects
  const [filteredItems, setFilteredItems] = useState<VehicleModel[]>([]);
  const [showOnlySelected, setShowOnlySelected] = useState(false); // Toggle to show only selected items
  const [isPending, startTransition] = useTransition();
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: defaultFormValues,
  });

  const dialogCloseRef = useRef<HTMLButtonElement>(null);
  const repo = new VehicleModelRepository();

  // Fetch data based on search query
  const fetchData = async (searchQuery: string) => {
    const { items } = await repo.getAll(searchQuery, 0);
    setFilteredItems(items); // Store the full VehicleModel objects
  };

  // Perform initial search when the dialog is opened
  useEffect(() => {
    fetchData(''); // Fetch all items with an empty query
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

  const handleSelect = (model: VehicleModel, checked: boolean) => {
    if (selectionMode === 'single') {
      // For single selection, replace the selected item
      setSelectedItems(checked ? [model] : []);
    } else {
      // For multiple selection, toggle the item
      setSelectedItems((prev) =>
        checked
          ? [...prev, model] // Add if checked
          : prev.filter((item) => item.id !== model.id) // Remove if unchecked
      );
    }
  };

  // Toggle to show only selected items
  const toggleShowOnlySelected = () => {
    setShowOnlySelected((prev) => !prev);
  };

  // Determine which items to display based on the filter
  const itemsToDisplay = showOnlySelected
    ? filteredItems.filter((item) =>
        selectedItems.some((selected) => selected.id === item.id)
      )
    : filteredItems;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{triggerText}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] max-h-[90vh] w-full h-full flex flex-col">
        <DialogHeader>
          <DialogTitle>Search and Select Vehicle Models</DialogTitle>
        </DialogHeader>

        {/* Search Bar and Filter Button Row */}
        <div className="flex items-center gap-2 p-4">
          <Form {...form}>
            <form className="flex-1">
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Search</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Search className="absolute left-2.5 top-[.75rem] h-4 w-4 text-muted-foreground" />
                        <Input
                          {...field}
                          type="search"
                          placeholder="Search..."
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

        {/* Grid Layout for Search Results */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {itemsToDisplay.map((model) => (
              <VehicleModelSearchItem
                key={model.id}
                model={model}
                isSelected={selectedItems.some((item) => item.id === model.id)}
                onCheckedChange={(checked) => handleSelect(model, checked)}
              />
            ))}
          </div>
        </div>

        {/* Footer with Selected Items Count */}
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
                  onSelectAction(selectedItems); // Pass the full selected objects
                  dialogCloseRef.current?.click(); // Close the dialog
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
