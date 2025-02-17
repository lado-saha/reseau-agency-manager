// export default ListView()
'use client';

import { useState, useMemo, SetStateAction, ComponentType } from 'react';
import dynamic from 'next/dynamic';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  TableIcon,
  MapPinIcon,
  LayoutGrid,
  ParkingCircleIcon,
  ArrowDownCircle,
  ArrowUpCircle,
  SortAscIcon,
  SortDescIcon,
  MapPinned,
  PlusIcon
} from 'lucide-react';
import { getResourceTenantStatus, ResourceStatus, Driver } from '@/lib/models/resource';
import {
  SortingDirection,
  TabsDriver
} from '@/lib/models/helpers';
import Loading from '@/app/agency/loading';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { driverTableSortingOptions, GridDrivers, TableDrivers } from './table-drivers';

export default function DriverListView({
  drivers,
  offset,
  totalDrivers,
  sortDirection,
  sortOption,
  currentId,
  isSuperAdmin
}: {
  isSuperAdmin: boolean
  currentId: string,
  drivers: Driver[];
  offset: number;
  totalDrivers: number;
  sortDirection: SortingDirection;
  sortOption: string;
}) {
  const MyMapDrivers = useMemo(
    () =>
      dynamic(() => import('@/components/map-driver'), {
        loading: () => (
          <Loading
            // className="py-32"
            className="py-64"
            variant="inline"
            message="Loading Map ..."
          />
        ),
        ssr: false
      }),
    []
  );

  const [currentView, setCurrentView] = useState<
    'mapview' | 'tableview' | 'gridview'
  >('tableview');
  const [tab, setTab] = useState<TabsDriver>('all');
  const [mapCenter, setMapCenter] = useState([
    drivers.length >= 1 ? drivers[0].latitude : 0,
    drivers.length >= 1 ? drivers[0].longitude : 0
  ]);
  const [mapZoom, setMapZoom] = useState(10);
  // Sorting
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSortDirectionChange = (
    sortingDirection: SortingDirection = sortDirection
  ) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    params.set('direction', sortingDirection);
    router.replace(`${pathname}?${params.toString()}`, { scroll: true });
  };

  const handleSortOptionChange = (sortingOption: string = sortOption) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    params.set('sortBy', sortingOption);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const filteredDrivers = () => drivers = tab !== 'all' ? drivers.filter(v => getResourceTenantStatus(v, currentId) === (tab as ResourceStatus | undefined)) : drivers

  function navToDetailView(id: string): void {
    //router.push(`/agency/${agenc}${id}`);
  }

  function viewDriverOnMap(lat: number, lon: number) {
    setMapCenter([lat, lon]);
    setCurrentView('mapview');
    setMapZoom(18);
  }

  return (
    <Tabs
      defaultValue={tab}
      onValueChange={(value) => setTab(value as TabsDriver)}
    >
      {/* Tabs for filtering */}
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all" className="items-center ">
            <span>All</span>
          </TabsTrigger>

          <TabsTrigger value="stationed" className="items-center">
            <ParkingCircleIcon className="mx-1 w-4 h-4" />
            {/* Set the width and height to match the text size */}
            <span>Stationed</span>
          </TabsTrigger>

          <TabsTrigger value="incoming" className="items-center">
            <ArrowDownCircle className="mx-1 w-4 h-4" />
            <span>Incoming</span>
          </TabsTrigger>

          <TabsTrigger value="outgoing" className="items-center">
            <ArrowUpCircle className="mx-1 w-4 h-4" />
            <span>Outgoing</span>
          </TabsTrigger>
        </TabsList>

        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="h-8 gap-1">
                {sortDirection == 'asc' ? (
                  <SortAscIcon className="h-3.5 w-3.5" />
                ) : (
                  <SortDescIcon className="h-3.5 w-3.5" />
                )}
                <span className="hidden md:inline">Sort</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* Sorting Options */}
              <DropdownMenuItem
                onClick={() => {
                  handleSortDirectionChange('asc');
                }}
                className={
                  sortDirection === 'asc' ? 'font-bold  bg-accent' : ''
                }
              >
                <SortAscIcon className="mr-2 h-4 w-4" />
                Ascending
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  handleSortDirectionChange('desc');
                }}
                className={
                  sortDirection === 'desc' ? 'font-bold bg-accent' : ''
                }
              >
                <SortDescIcon className="mr-2 h-4 w-4" />
                Descending
              </DropdownMenuItem>

              <DropdownMenuSeparator className="mx-1" />
              {/* View Options */}
              {driverTableSortingOptions(tab).map((option) => (
                <DropdownMenuItem
                  key={option.fieldName}
                  onClick={() => {
                    // setSortingOption(option.fieldName);
                    handleSortOptionChange(option.fieldName);
                  }}
                  className={
                    sortOption === option.fieldName ? 'font-bold bg-accent' : ''
                  }
                >
                  {option.displayName}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="h-8 gap-1">
                {currentView === 'tableview' && (
                  <>
                    <TableIcon className="h-3.5 w-3.5" />
                    <span className="hidden md:inline">Table View</span>
                  </>
                )}
                {currentView === 'mapview' && (
                  <>
                    <MapPinIcon className="h-3.5 w-3.5" />
                    <span className="hidden md:inline">Map View</span>
                  </>
                )}
                {currentView === 'gridview' && (
                  <>
                    <LayoutGrid className="h-3.5 w-3.5" />
                    <span className="hidden md:inline">Grid View</span>
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setCurrentView('mapview')}>
                <MapPinned className="mr-2 h-4 w-4" />
                Map View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentView('tableview')}>
                <TableIcon className="mr-2 h-4 w-4" />
                Table View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentView('gridview')}>
                <LayoutGrid className="mr-2 h-4 w-4" />
                Grid View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <TabsContent value={tab}>
        {currentView === 'mapview' ? (
          <MyMapDrivers
            currentId={currentId}
            viewOnMapAction={() => { }}
            posix={[mapCenter[0], mapCenter[1]]}
            zoom={mapZoom}
            drivers={filteredDrivers()}
            offset={0}
            totalDrivers={totalDrivers}
            detailsAction={navToDetailView}
            tab={tab}
            onCenterChangeAction={(lat: number, lon: number) => {
              setMapCenter([lat, lon]);
            }}
            onZoomChangeAction={(zoom: SetStateAction<number>) => {
              setMapZoom(zoom);
            }}
          />
        ) : currentView === 'tableview' ? (
          <TableDrivers
            drivers={filteredDrivers()}
            totalDrivers={totalDrivers}
            offset={offset}
            tab={tab}
            viewOnMapAction={viewDriverOnMap}
            detailsAction={navToDetailView}
            currentId={currentId}
          />
        ) : (
          <GridDrivers
            drivers={filteredDrivers()}
            totalDrivers={totalDrivers}
            offset={offset}
            tab={tab}
            viewOnMapAction={viewDriverOnMap}
            detailsAction={navToDetailView}
            currentId={currentId}
          />
        )}
      </TabsContent>
    </Tabs>
  );
}
