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
import { Trip, TRIP_STATUS, TRIP_STATUS_OPTIONS, TripResource, TripStatus } from '@/lib/models/trip';
import { Station } from '@/lib/models/station';
import { fetchStationById, fetchVehicleById, searchStation } from '@/lib/actions';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { Textarea } from '../ui/textarea'; // Added for the notes field
import InteractiveSeatLayout from '../vehicle/interactive-vehicles';
import { convertBitmaskToMatrix, VehicleModel } from '@/lib/models/resource';
import VehicleModelLayoutEditor, { VehicleModelLiveView } from '../vehicle-model/editor-vehicle-model-schema';

export function TripResourceInfoForm({
  id,
  originalTrip,
  onSubmitCompleteAction,
  adminId,
  agencyId,
}: {
  id: string;
  originalTrip?: Trip;
  onSubmitCompleteAction: (newId: string, data: Partial<Trip>) => void;
  adminId: string;
  agencyId: string;
}) {
  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, setIsPending] = useState<boolean>(false);

  const [tripResources, setTripResources] = useState<TripResource[] | undefined>()
  const [model, setModel] = useState<VehicleModel | undefined>()
  useEffect(() => {
    const seed = async () => {
      setModel((await fetchVehicleById('123'))?.model as VehicleModel)
    }
    seed()
  }, [])
  const onSubmit = async (data: FormValues) => {
    setIsPending(true);
    try {
      // Create the new trip object
      //const newTrip: Partial<Trip> = {
      //  id: id,
      //  fromStation: fromStation?.id || '',
      //  toStation: toStation?.id || '',
      //  status: data.tripStatus,
      //  departureDateTime,
      //  expectedDateTime: arrivalDateTime, // If needed
      //  seatPrice: data.price,
      //  isVip: data.isVip,
      //  notes: data.notes || '',
      //  ...auditUpdOrNew(adminId, originalTrip),
      //};
      //// TODO: Save
      //
      // Trigger the onSubmitCompleteAction to handle the save
      //onSubmitCompleteAction(id, newTrip);
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      setIsPending(false);
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trip Resource Information</CardTitle>
        <CardDescription>
          Add the vehicles
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* To Station */}
        <div className="flex flex-col items-center gap-4 relative w-full sm:w-auto flex-grow">
          {model && <VehicleModelLiveView matrix={convertBitmaskToMatrix(model)} setMatrixChangeAction={() => { }} setSeatCountChangeAction={() => { }} />}
          {model && <VehicleModelLayoutEditor editable={false} matrix={convertBitmaskToMatrix(model)} setMatrixChangeAction={() => { }} setSeatCountChangeAction={() => { }} />}

          <SearchDialogGeneric
            triggerText="Select Destination Station"
            fetchItemsAction={searchStation}
            onSelectAction={(selectedItems) => { }}
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
          <Button
            variant="destructive"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <TrashIcon className="h-4 w-4" />
            <span className="hidden md:inline">Remove</span>
          </Button>
        </div>
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
      </CardContent>

    </Card >
  )
}
