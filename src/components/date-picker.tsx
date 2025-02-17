'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { date, z } from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import React from 'react';
import { SidebarSeparator } from '@/components/ui/sidebar';
import {
  DateRange,
  DayPickerSingleProps,
  DayPickerRangeProps
} from 'react-day-picker';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const modes = [
  { label: 'Single Date', value: 'single' },
  { label: 'Date Range', value: 'range' }
] as const;

const FormSchema = z.object({
  mode: z.string({
    required_error: 'Please select a mode.'
  })
});

export function DatePicker() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { mode: 'single' }
  });

  const { watch, setValue } = form;
  const selectedMode = watch('mode');

  const [selected, setSelected] = React.useState<Date | DateRange | undefined>(
    new Date()
  );

  const handleSelect = (value: Date | DateRange | undefined) => {
    setSelected(value);
  };

  const calendarProps =
    selectedMode === 'single'
      ? ({
          mode: 'single',
          selected: selected as Date,
          onSelect: handleSelect
        } as DayPickerSingleProps)
      : ({
          mode: 'range',
          selected: selected as DateRange,
          onSelect: handleSelect
        } as DayPickerRangeProps);

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);

  const formatRange = (range: DateRange) =>
    range.to
      ? `${formatDate(range.from!)} - ${formatDate(range.to)}`
      : `${formatDate(range.from!)} - ...`;

  const title =
    selectedMode === 'single'
      ? selected
        ? formatDate(selected as Date)
        : 'Select a date'
      : selected
        ? formatRange(selected as { from: Date; to?: Date })
        : 'Select a date range';

  //Navigations and url management
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleDateChange = () => {
    const params = new URLSearchParams(searchParams);
    // Reset page number
    params.set('page', '1');
    if (selectedMode === 'single' && selected instanceof Date) {
      params.set('dateSingle', `${selected.getTime()}`);
      params.delete('dateRange');
    } else if (selectedMode === 'range' && (selected as DateRange)?.from) {
      const dateRange = selected as DateRange;
      params.set(
        'dateRange',
        `${dateRange.from?.getTime()}-${dateRange.to?.getTime() ?? ''}`
      );
      params.delete('dateSingle');
    } else {
      params.delete('dateSingle');
      params.delete('dateRange');
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-1 p-1">
      {/* Title displaying selected date(s) */}
      <h2 className="text font-extrabold text-center py-1">{title}</h2>

      {/* Calendar Component */}
      {/* <div className="pb-2">
        <Calendar ISOWeek footer {...calendarProps} />
      </div> */}
      <div className="flex justify-center pb-2">
        <Calendar ISOWeek {...calendarProps} />
      </div>
      {/* Form for Selection Mode */}
      <Form {...form}>
        <form
          className="flex flex-col gap-4 px-2 pb-2"
          onSubmit={() => handleDateChange()}
        >
          <FormField
            control={form.control}
            name="mode"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="mb-2">Selection Mode</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'w-full max-w-md justify-between',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value
                          ? modes.find((mode) => mode.value === field.value)
                              ?.label
                          : 'Select mode'}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full max-w-md p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search mode..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>No mode found.</CommandEmpty>
                        <CommandGroup>
                          {modes.map((mode) => (
                            <CommandItem
                              value={mode.label}
                              key={mode.value}
                              onSelect={() => {
                                if (selectedMode === 'range' && selected) {
                                  setSelected((selected as DateRange).from);
                                }
                                setValue('mode', mode.value);
                              }}
                            >
                              {mode.label}
                              <Check
                                className={cn(
                                  'ml-auto',
                                  mode.value === field.value
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Apply Button */}
          {/* <Button className="w-full max-w-md mx-auto">Apply</Button> */}
          <Button
            className="w-full max-w-md mx-auto"
            disabled={
              !selected ||
              (selectedMode === 'range' && !(selected as DateRange)?.from)
            }
          >
            Apply Date
          </Button>
        </form>
      </Form>
    </div>
  );
}
