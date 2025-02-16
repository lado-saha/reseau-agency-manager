'use client';
import { useState } from 'react';
import { BusIcon, InfoIcon, MapPin, MapPinIcon, PlusIcon, ScaleIcon, Wallet2, Wallet2Icon } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabsContent } from '@radix-ui/react-tabs';
import { DeleteDialog } from '../dialogs/dialog-delete';
import { TripBasicInfoForm } from './form-basic-info';
import AddressSelection from '../geo-place/place-picker';
import { PlaceAddress } from '@/lib/repo/osm-place-repo';
import { useRouter } from 'next/navigation';
import { Trip } from '@/lib/models/trip';
import { TripResourceInfoForm } from './resource-info-form';
import { Button } from '../ui/button';

const NEW_TAB = "vehicle-new"
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
  const mode: 'edit-mode' | 'creation-mode' =
    originalTrip !== undefined ? 'edit-mode' : 'creation-mode';

  const [trip, setTrip] = useState(originalTrip);
  const [tab, setTab] = useState<string>('basic-info');
  const [isNewVehicle, setIsNewVehicle] = useState<boolean>(mode === 'edit-mode' && originalTrip?.resources.length === 0)

  // Automatically show the second tab in edit mode
  const [showVTabs, setShowVTabs] = useState(mode === 'edit-mode');

  const handleDeleteClick = () => {
    // Placeholder for future delete logic (if needed)
  };

  const router = useRouter();

  function handleNewClick(): void {
    throw new Error('Function not implemented.');
  }

  const getVehicleTab = (index: number) => `vehicle-${index}`

  return (
    <div className="p-4">
      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value)}
      >
        {/* Tabs for navigating between sections */}
        <div className="flex items-center mt-2 mb-2">
          <TabsList>
            <TabsTrigger value="basic-info" className="items-center">
              <InfoIcon className="mx-1 w-4 h-4" />
              <span className="hidden sm:inline">Basic Information</span>
            </TabsTrigger>

            {originalTrip?.resources?.toSorted((a, b) => a.index - b.index).map((res, index) => {
              return (
                <TabsTrigger key={res.index} value={getVehicleTab(index)} className="items-center">
                  <BusIcon className="mx-1 w-4 h-4" />
                  <span className="hidden sm:inline">Vehicle `${index}`</span>
                </TabsTrigger>
              )
            })}

            {isNewVehicle && (
              <TabsTrigger value='vehicle-new' className="items-center">
                <BusIcon className="mx-1 w-4 h-4" />
                <span className="hidden sm:inline">New Vehicle</span>
              </TabsTrigger>
            )}

          </TabsList>


          {mode === 'edit-mode' && (
            <div className="ml-auto flex items-center gap-2">

              {tab !== NEW_TAB && (
                <Button size="sm" className="gap-2" onClick={handleNewClick}>
                  <PlusIcon className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">Add Vehicle</span>
                </Button>
              )}
              <DeleteDialog
                title="Cancel Trip"
                triggerText="Cancel Trip"
                description="Are you sure you want to cancel this trip? This action is irreversible."
                onDeleteAction={() => {
                  // Future delete action logic can be implemented here
                }}
                mode="archive"
              />

            </div>
          )}

        </div>

        <TabsContent value={tab} className="overflow-x-hidden">
          {tab === 'basic-info' ? (
            <TripBasicInfoForm
              id={trip?.id || 'new'}
              fromStationId="db4c5fb1-7d4a-4ba9-92b2-b3bf6e570746"
              adminId={adminId}
              agencyId={agencyId}
              originalTrip={trip}
              onSubmitCompleteAction={(newId, data) => {
                setTrip(data);
                setIsNewVehicle(true)
                // Automatically navigate to the next tab in creation mode
                if (mode === 'creation-mode') {
                  setTab('vehicle-new');
                }

                console.log('Trip Data: ', JSON.stringify(data));
              }}
            />
          ) : tab === 'vehicle-new' ? (
            <TripResourceInfoForm id={trip?.id || ''} adminId={adminId} agencyId={agencyId} originalTrip={originalTrip} onSubmitCompleteAction={() => { }} />
          ) : (<></>)}

        </TabsContent>
      </Tabs >
    </div >
  );
}

