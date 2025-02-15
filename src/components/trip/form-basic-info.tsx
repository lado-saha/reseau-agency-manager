'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { CalendarIcon, Check, ChevronsUpDown, EyeIcon, TrashIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Switch } from "@/components/ui/switch";
import { ErrorDialog } from '../dialogs/dialog-error';
import { auditUpdOrNew } from '@/lib/models/helpers';
import { SearchDialogGeneric } from '../dialogs/search-dialog';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { StationSearchItem } from '../station/item-station';
import { Trip, TRIP_STATUS, TRIP_STATUS_OPTIONS, TripStatus } from '@/lib/models/trip';
import { Station } from '@/lib/models/station';
import { fetchStationById, searchStation } from '@/lib/actions';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { Textarea } from '../ui/textarea'; // Added for the notes field

// Define the form schema using zod
const schema = z.object({
  departureDate: z.date({
    required_error: 'Departure date is required.',
    invalid_type_error: 'Invalid date format.',
  }),
  departureTime: z.string().regex(/^\d{2}:\d{2}$/, {
    message: 'Time must be in the format HH:mm.',
  }),
  arrivalDate: z.date({
    required_error: 'Arrival date is required.',
    invalid_type_error: 'Invalid date format.',
  }),
  arrivalTime: z.string().regex(/^\d{2}:\d{2}$/, {
    message: 'Time must be in the format HH:mm.',
  }),
  tripStatus: z.enum(TRIP_STATUS, {
    message: 'Please select a valid trip status.',
  }),
  price: z.coerce.number().min(1, "Price must be greater than 1 FCFA"),
  isVip: z.boolean().default(false),
  notes: z.string().optional(), // Optional notes field
});

type FormValues = z.infer<typeof schema>;

export function TripBasicInfoForm({
  id,
  fromStationId = "db4c5fb1-7d4a-4ba9-92b2-b3bf6e570746",
  originalTrip,
  onSubmitCompleteAction,
  adminId,
  agencyId,
}: {
  id: string;
  fromStationId: string,
  originalTrip?: Trip;
  onSubmitCompleteAction: (newId: string, data: Partial<Trip>) => void;
  adminId: string;
  agencyId: string;
}) {
  const [fromStation, setFromStation] = useState<Station | undefined>(undefined)
  const [toStation, setToStation] = useState(originalTrip?.toStation as Station | undefined);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, setIsPending] = useState<boolean>(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'all',
    defaultValues: {
      departureDate: originalTrip?.departureDateTime || new Date(),
      departureTime: originalTrip?.departureDateTime ? format(originalTrip.departureDateTime, 'HH:mm') : '08:00',
      arrivalDate: originalTrip?.arrivalDateTime || new Date(),
      arrivalTime: originalTrip?.arrivalDateTime ? format(originalTrip.arrivalDateTime, 'HH:mm') : '10:00',
      tripStatus: originalTrip?.status || 'scheduled',
      isVip: originalTrip?.isVip || false,
      notes: originalTrip?.notes || '',
    },
  });

  // Load the from Station
  useEffect(() => {
    const getStation = async () => {
      try {
        const station = await fetchStationById(fromStationId);
        setFromStation(station);
      } catch (error) {
        setErrorMessage('Failed to fetch station:');
      }
    }

    getStation()
  }, []); // Empty dependency array means this effect will run only once when the component is first mounted


  const onSubmit = async (data: FormValues) => {
    setIsPending(true);
    try {
      // Parsing date and time
      const departureDateTime = new Date(
        `${data.departureDate.toISOString().split('T')[0]}T${data.departureTime}:00`
      );
      const arrivalDateTime = new Date(
        `${data.arrivalDate.toISOString().split('T')[0]}T${data.arrivalTime}:00`
      );

      // Create the new trip object
      const newTrip: Trip = {
        id: id,
        fromStation: fromStation?.id || '',
        toStation: toStation?.id || '',
        status: data.tripStatus,
        departureDateTime,
        expectedDateTime: arrivalDateTime, // If needed
        seatPrice: data.price,
        isVip: data.isVip,
        notes: data.notes || '',
        resources: originalTrip?.resources || [],
        ...auditUpdOrNew(adminId, originalTrip),
      };
      // TODO: Save
       

      // Trigger the onSubmitCompleteAction to handle the save
      onSubmitCompleteAction(id, newTrip);
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      setIsPending(false);
    }
  };


  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Disable the default form submission on Enter
    }
  };

  const isDepartureDateTimeInvalid = () => {
    const departureDateState = form.getFieldState('departureDate');
    const departureTimeState = form.getFieldState('departureTime');
    return departureDateState.invalid || departureTimeState.invalid;
  };

  const isAfterDeparture = (date: Date) => {
    const departureDate = form.watch('departureDate');
    const departureTime = form.watch('departureTime');
    const arrivalTime = form.watch('arrivalTime');

    if (!departureDate || !departureTime || !arrivalTime) {
      return false; // If any field is empty, don't disable dates
    }

    // Parse departure and arrival times
    const [departureHours, departureMinutes] = departureTime.split(':').map(Number);
    const [arrivalHours, arrivalMinutes] = arrivalTime.split(':').map(Number);

    // Create Date objects for comparison
    const departureDateTime = new Date(departureDate);
    departureDateTime.setHours(departureHours, departureMinutes);

    const arrivalDateTime = new Date(date);
    arrivalDateTime.setHours(arrivalHours, arrivalMinutes);

    // Check if arrival date/time is after departure date/time
    return arrivalDateTime > departureDateTime;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trip Basic Information</CardTitle>
        <CardDescription>
          Please provide details about the trip and its model.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onKeyDown={handleKeyDown}
            className="flex flex-col gap-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >

            {/* From and To Stations */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:flex-nowrap">
              {/* From Station */}
              <div className="flex flex-col items-center gap-4 relative w-full sm:w-auto flex-grow">
                <span className="text-sm text-muted-foreground">Departure</span>
                {fromStation && (
                  <StationSearchItem
                    isPhotoVisible={false}
                    item={fromStation}
                    onCheckedChange={() => { }}
                    isSelected={false}
                  />
                )}
              </div>

              {/* Arrow with Animation */}
            <div className="flex items-center justify-center text-xl text-primary font-bold relative w-24">
              <div className="relative flex items-center justify-center w-full">
                <div className="mr-2 text-2xl animate-move-arrow">➝</div>
                <div className="w-16 h-1 bg-primary rounded-full relative overflow-hidden">
                  <div className="absolute left-0 h-full bg-white opacity-80 w-4 animate-slide" />
                </div>
                <div className="ml-2 text-2xl animate-move-arrow">➝</div>
              </div>
            </div>

            {/* To Station */}
            <div className="flex flex-col items-center gap-4 relative w-full sm:w-auto flex-grow">
              <span className="text-sm text-muted-foreground">Destination</span>
              {toStation ? (
                <StationSearchItem
                  isPhotoVisible={false}
                  item={toStation}
                  onCheckedChange={() => { }}
                  isSelected={true}
                />
              ) : (
                <SearchDialogGeneric
                  triggerText="Select Destination Station"
                  fetchItemsAction={searchStation}
                  onSelectAction={(selectedItems) => setToStation(selectedItems[0])}
                  renderItemAction={(item, isSelected, onCheckedChange) => (
                    <StationSearchItem
                      isPhotoVisible={true}
                      key={item.id}
                      item={item}
                      isSelected={isSelected}
                      onCheckedChange={onCheckedChange}
                    />
                  )}
                />
              )}
              {toStation && (
                <Button
                  variant="destructive"
                  onClick={(e) => {
                    e.preventDefault();
                    setToStation(undefined);
                  }}
                >
                  <TrashIcon className="h-4 w-4" />
                  <span className="hidden md:inline">Remove</span>
                </Button>
              )}
            </div>
          </div>
          {/* Departure and Arrival Date/Time */}
          <div className="grid w-full gap-2 sm:grid-cols-5">
            {/* Departure Date */}
            <FormField
              control={form.control}
              name="departureDate"
              render={({ field }) => (
                <FormItem className="sm:col-span-3">
                  <FormLabel>Departure Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>Select the date of departure.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Departure Time */}
            <FormField
              control={form.control}
              name="departureTime"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Departure Time</FormLabel>
                  <FormControl>
                    <Input type="time" placeholder="HH:mm" {...field} />
                  </FormControl>
                  <FormDescription>Enter the time of departure in HH:mm format.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Expected Arrival Date */}
            <FormField
              control={form.control}
              name="arrivalDate"
              disabled={isDepartureDateTimeInvalid()}
              render={({ field }) => (
                <FormItem className="sm:col-span-3">
                  <FormLabel>Expected Arrival Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => !isAfterDeparture(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>Select the expected date of arrival.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Expected Arrival Time */}
            <FormField
              control={form.control}
              name="arrivalTime"
              disabled={isDepartureDateTimeInvalid()}
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Expected Arrival Time</FormLabel>
                  <FormControl>
                    <Input type="time" placeholder="HH:mm" {...field} />
                  </FormControl>
                  <FormDescription>Enter the expected time of arrival in HH:mm format.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Trip Status */}
          <FormField
            control={form.control}
            name="tripStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trip Status</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                      >
                        {field.value
                          ? TRIP_STATUS_OPTIONS.find((ls) => ls.value === field.value)?.label
                          : 'Pick your trip status'}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search for a status..." className="h-9" />
                      <CommandList>
                        <CommandEmpty>Nothing found.</CommandEmpty>
                        <CommandGroup>
                          {TRIP_STATUS_OPTIONS.map((ls) => (
                            <CommandItem
                              key={ls.value}
                              onSelect={() => form.setValue('tripStatus', ls.value as TripStatus)}
                            >
                              {ls.label}
                              <Check
                                className={cn(
                                  'ml-auto',
                                  ls.value === field.value ? 'opacity-100' : 'opacity-0'
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>Select the status of the trip.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter price"
                    {...field}
                    onChange={field.onChange}
                  />
                </FormControl>

                <FormDescription>All prices in FCFA paid by the bookers.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isVip"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between border rounded-lg p-3">
                <FormLabel className="text-base">VIP Trip</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          {/* Notes */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter additional notes about the trip..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Add any comments or remarks about the trip.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save'}
          </Button>

          {/* Error Dialog */}
          <ErrorDialog
            isOpen={errorMessage !== ''}
            onCloseAction={() => setErrorMessage('')}
            title="Error Occurred"
            description={errorMessage}
          />
        </form>
      </Form>
    </CardContent>
    </Card >
  );
}
