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

import Loading from '@/app/agency/loading';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Station } from '@/lib/models/station';
import { SortingDirection } from '@/lib/models/helpers';
import { GridStations, stationTableSortingOptions, TableStations } from './table-station';
import { PlaceAddress } from '@/lib/repo/osm-place-repo';

export default function StationListView({
  stations,
  offset,
  totalStations,
  sortDirection,
  sortOption
}: {
  stations: Station[];
  offset: number;
  totalStations: number;
  sortDirection: SortingDirection;
  sortOption: string;
}) {
  const MyMapStations = useMemo(
    () =>
      dynamic(() => import('@/components/maps-station'), {
        loading: () => (
          <Loading
            className="py-64"
            variant="inline"
            message="Loading Map..."
          />
        ),
        ssr: false
      }),
    []
  );
  const [currentView, setCurrentView] = useState<
    'mapview' | 'tableview' | 'gridview'
  >('tableview');
  const [mapCenter, setMapCenter] = useState([
    stations.length > 1 ? (stations[0].address as PlaceAddress)?.latitude : 0,
    stations.length > 1 ? (stations[0].address as PlaceAddress)?.longitude : 0
  ]);
  const [mapZoom, setMapZoom] = useState(15);
  // Sorting
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSortDirectionChange = (
    sortingDirection: SortingDirection = sortDirection
  ) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    // params.set('sortBy', sortingOption);
    params.set('direction', sortingDirection);
    // params.set(paramKey, value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: true });
  };

  const handleSortOptionChange = (sortingOption: string = sortOption) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    params.set('sortBy', sortingOption);
    router.replace(`${pathname}?${params.toString()}`);
  };

  function viewStationOnMap(lat: number, lon: number) {
    setMapCenter([lat, lon]);
    setCurrentView('mapview');
    setMapZoom(18);
  }

  function deleteAction(id: string): void {
  }

  function navToDetails(id: string): void {
    router.push(`${pathname}/${id}`);
  }

  function handleNewClick(): void {
    navToDetails('new')
  }

  return (
    <div>
      <div className="flex items-center">
        <div className="pb-2 ml-auto flex items-center gap-2">
          <Button size="sm" className="h-8 gap-1" onClick={handleNewClick}>
            <PlusIcon className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only">Add Station</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="h-8 gap-1">
                {sortDirection == 'asc' ? (
                  <SortAscIcon className="h-3.5 w-3.5" />
                ) : (
                  <SortDescIcon className="h-3.5 w-3.5" />
                )}
                <span className="sr-only sm:not-sr-only">Sort</span>
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
              {stationTableSortingOptions().map((option) => (
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
                    <span className="sr-only sm:not-sr-only">Table View</span>
                  </>
                )}
                {currentView === 'mapview' && (
                  <>
                    <MapPinIcon className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only">Map View</span>
                  </>
                )}
                {currentView === 'gridview' && (
                  <>
                    <LayoutGrid className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only">Grid View</span>
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
      <div>
        {currentView === 'mapview' ? (
          <MyMapStations
            posix={[mapCenter[0], mapCenter[1]]}
            zoom={mapZoom}
            stations={stations}
            offset={0}
            totalStations={totalStations}
            onCenterChangeAction={(lat: number, lon: number) => {
              setMapCenter([lat, lon]);
            }}
            onZoomChangeAction={(zoom: SetStateAction<number>) => {
              setMapZoom(zoom);
            }}
            deleteAction={deleteAction} navToDetailsAction={navToDetails}
            viewOnMapAction={() => { }}
          />
        ) : currentView === 'tableview' ? (
          <TableStations
            stations={stations}
            totalStations={totalStations}
            offset={offset}
            viewOnMapAction={viewStationOnMap} deleteAction={deleteAction} navToDetailsAction={navToDetails}
          />
        ) : (
          <GridStations
            stations={stations}
            totalStations={totalStations}
            offset={offset}
            viewOnMapAction={viewStationOnMap} deleteAction={deleteAction} navToDetailsAction={navToDetails}
          />
        )}
      </div>
    </div>
  );
}
