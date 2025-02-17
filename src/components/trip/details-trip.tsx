'use client';
import { useState } from 'react';
import { BusIcon, InfoIcon, PlusIcon } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabsContent } from '@radix-ui/react-tabs';
import { DeleteDialog } from '../dialogs/dialog-delete';
import { TripBasicInfoForm } from './form-basic-info';
import { useRouter } from 'next/navigation';
import { Trip } from '@/lib/models/trip';
import { TripResourceInfoForm } from './resource-info-form';
import { Button } from '../ui/button';

const NEW_VEHICLE = "new-vehicle";
export function TripDetailView({
  id,
  originalTrip,
  adminId,
  agencyId
}: {
  id: string;
  originalTrip: Trip | undefined;
  adminId: string;
  agencyId: string;
}) {
  const [mode, setMode] = useState<'edit-mode' | 'creation-mode'>(
    originalTrip !== undefined ? 'edit-mode' : 'creation-mode');
  const [trip, setTrip] = useState(originalTrip);
  const [tab, setTab] = useState<string>('basic-info');
  const [isNewVehicle, setIsNewVehicle] = useState<boolean>(mode === 'edit-mode' && trip?.resources.length === 0);

  const router = useRouter();

  function handleNewClick(): void {
    setIsNewVehicle(true);
    setTab(NEW_VEHICLE);
  }

  return (
    <div className="p-4">
      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value)}
      >
        <div className="flex items-center mt-2 mb-2">
          <TabsList>
            <TabsTrigger value="basic-info" className="items-center">
              <InfoIcon className="mx-1 w-4 h-4" />
              <span className="hidden sm:inline">Basic Information</span>
            </TabsTrigger>

            {trip?.resources?.sort((a, b) => a.index - b.index).map((res, index) => (
              <TabsTrigger key={res.index} value={`resource-${index}`} className="items-center">
                <BusIcon className="mx-1 w-4 h-4" />
                <span className="hidden sm:inline">{`Vehicle #${index + 1}`}</span>
              </TabsTrigger>
            ))}

            {isNewVehicle && (
              <TabsTrigger value={NEW_VEHICLE} className="items-center">
                <BusIcon className="mx-1 w-4 h-4" />
                <span className="hidden sm:inline">New Vehicle</span>
              </TabsTrigger>
            )}
          </TabsList>

          {mode === 'edit-mode' && (
            <div className="ml-auto flex items-center gap-2">
              {tab !== NEW_VEHICLE && (
                <Button size="sm" className="gap-2" onClick={handleNewClick}>
                  <PlusIcon className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">Add Vehicle</span>
                </Button>
              )}
              <DeleteDialog
                title="Cancel Trip"
                triggerText="Cancel Trip"
                description="Are you sure you want to cancel this trip? This action is irreversible."
                onDeleteAction={() => { }}
                mode="archive"
              />
            </div>
          )}
        </div>

        <TabsContent value={tab} className="overflow-x-hidden">
          {tab === 'basic-info' ? (
            <TripBasicInfoForm
              id={trip?.id || 'new'}
              key={tab}
              fromStationId="db4c5fb1-7d4a-4ba9-92b2-b3bf6e570746"
              adminId={adminId}
              agencyId={agencyId}
              originalTrip={trip}
              onSubmitCompleteAction={(newId, data) => {
                setTrip(data);
                setIsNewVehicle(true);
                if (mode === 'creation-mode') {
                  setMode('edit-mode');
                  setTab(NEW_VEHICLE);
                }
              }}
            />
          ) : tab === NEW_VEHICLE ? (
            <TripResourceInfoForm
              id={trip?.id!!}
              adminId={adminId}
              key={tab}
              agencyId={agencyId}
              originalTrip={trip!!}
              onSubmitCompleteAction={(_, data) => {
                setTrip(data);
                setIsNewVehicle(false);
                setTab('basic-info');
              }}
              resourceIndex={trip?.resources?.length!!}
            />
          ) : tab.startsWith('resource-') ? (
            <TripResourceInfoForm
              id={trip?.id!!}
              adminId={adminId}
              key={tab}
              agencyId={agencyId}
              originalTrip={trip!!}
              onSubmitCompleteAction={(_, data) => {
                setTrip(data);
                setTab('basic-info');
              }}
              resourceIndex={Number(tab.split('-')[1])}
            />
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  );
}
