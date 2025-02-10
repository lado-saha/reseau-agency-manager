'use client';
import { useState } from 'react';
import { InfoIcon, MapPin, MapPinIcon, ScaleIcon } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabsContent } from '@radix-ui/react-tabs';
import { STATION_EMPTY, Station } from '@/lib/models/station';
import { DeleteDialog } from '../dialogs/dialog-delete';
import { StationBasicInfoForm } from './form-basic-info';
import AddressSelection from '../geo-place/place-picker';
import { saveStationGeoInfo } from '@/lib/actions';
import { PlaceAddress } from '@/lib/repo/osm-place-repo';
import { useRouter } from 'next/navigation';

export function StationDetailView({
  originalStation,
  adminId,
  agencyId
}: {
  originalStation: Station | undefined;
  adminId: string;
  agencyId: string;
}) {
  const mode: 'edit-mode' | 'creation-mode' =
    originalStation !== undefined ? 'edit-mode' : 'creation-mode';

  const [station, setStation] = useState(originalStation);
  const [tab, setTab] = useState<'basic-info' | 'geo-info'>('basic-info');

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
        onValueChange={(value) => setTab(value as 'basic-info' | 'geo-info')}
      >
        {/* Tabs for navigating between sections */}
        <div className="flex items-center mt-2 mb-2">
          <TabsList>
            <TabsTrigger value="basic-info" className="items-center">
              <InfoIcon className="mx-1 w-4 h-4" />
              <span className="hidden sm:inline">Basic Information</span>
            </TabsTrigger>

            {showTab2 && (
              <TabsTrigger value="geo-info" className="items-center">
                <MapPinIcon className="mx-1 w-4 h-4" />
                <span className="hidden sm:inline">Geographical Information</span>
              </TabsTrigger>
            )}
          </TabsList>

          <div className="ml-auto flex items-center gap-2">
            {mode === 'edit-mode' && (
              <DeleteDialog
                title="Archive Station"
                triggerText="Archive Station"
                description={`Are you sure you want to archive this station? All associated trips will be cancelled, and this action can be undone later.`}
                onDeleteAction={() => {
                  // Future delete action logic can be implemented here
                }}
                mode={'archive'} />
            )}
          </div>
        </div>

        <TabsContent value={tab} className="overflow-x-hidden">
          {tab === 'basic-info' ? (
            <StationBasicInfoForm
              id={station?.id || 'new'}
              adminId={adminId}
              agencyId={agencyId}
              oldStation={station}
              onSubmitCompleteAction={(newId, data) => {
                if (!station) {
                  setStation({
                    ...STATION_EMPTY,
                    id: newId,
                    ...data
                  });
                } else {
                  setStation({
                    ...station,
                    ...data
                  });
                }

                // Automatically navigate to the next tab in creation mode
                if (mode === 'creation-mode') {
                  setShowTab2(true);
                  setTab('geo-info');
                }

                console.log('Station Data: ', JSON.stringify(data));
              }}
            />
          ) : (
            <AddressSelection
              title="Select Geographical Location"
              oldPlace={originalStation?.address as PlaceAddress}
              description="Pick a location for this station on the map to associate it with geographical data."
              onSaveAction={async (place) => {
                if (station) {
                  if (mode === 'creation-mode') {
                    place.id = 'new'
                  }
                  const newStation = await saveStationGeoInfo(station.id, place, adminId);
                  setStation(newStation);
                }
                router.back(); // Navigates back to the previous page
                setTimeout(() => {
                  router.refresh();
                }, 1000); // Give some time for navigation before refreshing

              }}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
