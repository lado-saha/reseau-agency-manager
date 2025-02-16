'use client';
import { useState } from 'react';
import { InfoIcon, MapPin, MapPinIcon, ScaleIcon, SlidersVerticalIcon } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabsContent } from '@radix-ui/react-tabs';
import { DeleteDialog } from '../dialogs/dialog-delete';
import { VehicleBasicInfoForm } from './form-basic-info';
import AddressSelection from '../geo-place/place-picker';
//import { saveVehicleGeoInfo } from '@/lib/actions';
import { PlaceAddress } from '@/lib/repo/osm-place-repo';
import { useRouter } from 'next/navigation';
import { Vehicle } from '@/lib/models/resource';

export function VehicleDetailView({
  originalVehicle,
  adminId,
  agencyId, 
  id
}: {
  originalVehicle: Vehicle | undefined;
  adminId: string;
  agencyId: string;
  id: string
}) {
  const mode: 'edit-mode' | 'creation-mode' =
    originalVehicle !== undefined ? 'edit-mode' : 'creation-mode';

  const [vehicle, setVehicle] = useState(originalVehicle);
  const [tab, setTab] = useState<'basic-info' | 'resource-info'>('basic-info');

  // Automatically show the second tab in edit mode
  const [showTab2, setShowTab2] = useState(mode === 'edit-mode');

  const handleDeleteClick = () => {
    // Placeholder for future delete logic (if needed)
  };
  const router = useRouter();

  return (
    <div className="p-4">
      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as 'basic-info' | 'resource-info')}
      >
        {/* Tabs for navigating between sections */}
        <div className="flex items-center mt-2 mb-2">
          <TabsList>
            <TabsTrigger value="basic-info" className="items-center">
              <InfoIcon className="mx-1 w-4 h-4" />
              <span className="hidden sm:inline">Basic Information</span>
            </TabsTrigger>

            {showTab2 && (
              <TabsTrigger value="resource-info" className="items-center">
                <SlidersVerticalIcon className="mx-1 w-4 h-4" />
                <span className="hidden sm:inline">Resource Information</span>
              </TabsTrigger>
            )}
          </TabsList>

          <div className="ml-auto flex items-center gap-2">
            {mode === 'edit-mode' && (
              <DeleteDialog
                title="Archive Vehicle"
                triggerText="Archive Vehicle"
                description={`Are you sure you want to archive this vehicle? All associated trips will be cancelled, and this action can be undone later.`}
                onDeleteAction={() => {
                  // Future delete action logic can be implemented here
                }}
                mode={'archive'} />
            )}
          </div>
        </div>

        <TabsContent value={tab} className="overflow-x-hidden">
          {tab === 'basic-info' ? (
            <VehicleBasicInfoForm
              id={vehicle?.id || 'new'}
              adminId={adminId}
              agencyId={agencyId}
              originalDriver={vehicle}
              onSubmitCompleteAction={(newId, data) => {
                //  if (!vehicle) {
                //    setVehicle({
                //      ...STATION_EMPTY,
                //      id: newId,
                //      ...data
                //    });
                //  } else {
                //    setVehicle({
                //      ...vehicle,
                //      ...data
                //    });
                //  }
                //
                //  // Automatically navigate to the next tab in creation mode
                //  if (mode === 'creation-mode') {
                //    setShowTab2(true);
                //    setTab('resource-info');
                //  }
                //
                //  console.log('Vehicle Data: ', JSON.stringify(data));
              }}
            />
          ) : (
            <></>)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
