'use client';

import { Button } from '@/components/ui/button';
import { CalendarIcon, Check, ChevronsUpDown, EyeIcon, TrashIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { ErrorDialog } from '../dialogs/dialog-error';
import { SearchDialogGeneric } from '../dialogs/search-dialog';
import { StationSearchItem } from '../station/item-station';
import { Trip, TRIP_STATUS, TRIP_STATUS_OPTIONS, TripResource, TripStatus } from '@/lib/models/trip';
import { fetchStationById, fetchVehicleById, searchStation, searchVehicle, searchVehicleModel } from '@/lib/actions';
import VehicleModelLayoutEditor, { VehicleModelLiveView } from '../vehicle-model/editor-vehicle-model-schema';
import { TableVehiclePassengers } from './table-passengers';
import { VehicleSearchItem } from '../vehicle/item-vehicle';

export function TripResourceInfoForm({
  id,
  resourceIndex,
  originalTrip,
  onSubmitCompleteAction,
  adminId,
  agencyId,
}: {
  id: string;
  resourceIndex: number
  originalTrip?: Trip;
  onSubmitCompleteAction: (newId: string, data: Trip) => void;
  adminId: string;
  agencyId: string;
}) {
  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, setIsPending] = useState<boolean>(false);
  const [tripResource, setTripResource] = useState<TripResource | undefined>(originalTrip?.resources.find(v => v.index === resourceIndex))

  const onSubmit = async () => {
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
          {tripResource
            ? "Manage the selected vehicle and passengers"
            : "Add a vehicle to the trip"}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {tripResource ? (
          <>
            {/* Vehicle Live View - Full width on small screens, 1/4 width on large screens */}
            <div className="flex flex-col p-2 md:p-4 lg:col-span-1">
              <VehicleModelLiveView
                tripResource={tripResource}
                setDriverChangeAction={d => { setTripResource({ ...tripResource, driver: d }) }}
                setSeatCountChangeAction={() => { }}
              />
            </div>

            {/* Passenger Table - Full width on small screens, 3/4 width on large screens */}
            <div className="flex flex-col p-2 md:p-4 lg:col-span-3">
              <TableVehiclePassengers tripResource={tripResource} />
            </div>

          </>
        ) : (
          <div className="col-span-1 lg:col-span-4 flex justify-center">
            <SearchDialogGeneric
              selectionMode="single"
              triggerText="Choose a vehicle"
              fetchItemsAction={searchVehicle}
              onSelectAction={(selectedItems) => {
                setTripResource({
                  passengers: [],
                  vehicle: selectedItems[0],
                  index: 0,
                  driver: "new",
                });
              }}
              renderItemAction={(item, isSelected, onCheckedChange) => (
                <VehicleSearchItem
                  key={item.id}
                  item={item}
                  isSelected={isSelected}
                  onCheckedChange={onCheckedChange}
                />
              )}
            />
          </div>
        )}

        {/* Action Buttons (Save and Delete) - Full width always */}
        {tripResource && (
          <div className="col-span-1 lg:col-span-4 flex justify-end gap-4 w-full">
       
            <Button type="submit" className='w-full' disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        )}

        {/* Error Dialog */}
        <ErrorDialog
          isOpen={errorMessage !== ""}
          onCloseAction={() => setErrorMessage("")}
          title="Error Occurred"
          description={errorMessage}
        />
      </CardContent>
    </Card>
  )
}
