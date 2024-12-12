'use client';
import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  File,
  MapPinIcon,
  TableIcon,
  LayoutGrid,
  Badge,
  ArrowUpCircle,
  Home,
  ArrowDownCircle,
  MapPinned
} from 'lucide-react';
import { TableVehicles, GridVehicles } from '@/components/table-vehicles';
import { JsonRepository } from '@/lib/repository/JsonRepository';
import { Vehicle } from '@/lib/models/resource';
import { TabsVehicles } from '@/lib/models/helpers';
import MapVehicles from '@/components/map';
import { LatLngExpression, LatLngTuple } from 'leaflet';

export default function VehicleDashboardPage(props: {
  searchParams: { q: string; offset: string };
}) {
  /**
   * We disable server-side rendering since, leaflets need to have direct access to the DOM. And thus we import them directly.
   * Also, we had to disable reactStrictMode: false in next.config.ts for it to work.
   */
  const Map = useMemo(
    () =>
      dynamic(() => import('@/components/map'), {
        loading: () => <p>A map is loading</p>,
        ssr: false
      }),
    []
  );

  const [currentView, setCurrentView] = useState<
    'mapview' | 'tableview' | 'gridview'
  >('mapview');
  const [tab, setTab] = useState<TabsVehicles>('all');

  const repo = new JsonRepository<Vehicle>('vehicles.json');
  const searchParams = props.searchParams;
  const search = searchParams.q ?? '';
  const offset = searchParams.offset ?? 0;
  const { vehicles, newOffset, totalProducts } = repo.get(
    search,
    Number(offset)
  );
  const [mapCenter, setMapCenter] = useState<LatLngExpression | LatLngTuple>([
    // Temporary
    vehicles[1].positionGps.latitude,
    vehicles[1].positionGps.longitude
  ]);
  const [mapZoom, setMapZoom] = useState<number>(15);
  return (
    <Tabs
      defaultValue={tab}
      onValueChange={(value) => {
        setTab(value as TabsVehicles);
      }}
    >
      {/* Tabs for filtering */}
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all" className="items-center">
            <span>All</span>
          </TabsTrigger>

          <TabsTrigger value="idle" className="items-center">
            <Home className="mx-1 " />
            <span>Idle</span>
          </TabsTrigger>

          <TabsTrigger value="incoming" className="items-center">
            <ArrowDownCircle className="mx-1 " />
            <span>Incoming</span>
          </TabsTrigger>

          <TabsTrigger value="outgoing" className="items-center">
            <ArrowUpCircle className="mx-1 " />
            <span>Outgoing</span>
          </TabsTrigger>
        </TabsList>

        {/* View Selection and Export */}
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>

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

      {/* Content Rendering Based on View */}
      <TabsContent value={tab}>
        {currentView === 'mapview' ? (
          <div className="my-5 h-[780px]">
            {/* <MapVehicles posix={[4.79029, -75.69003]} /> */}
            <MapVehicles
              viewOnMap={() => {}}
              posix={mapCenter}
              zoom={mapZoom}
              vehicles={vehicles}
              offset={0}
              totalVehicles={2}
              currentTab={tab}
              onCenterChange={(lat, lon) => {
                setMapCenter([lat, lon]);
              }}
              onZoomChange={(zoom) => {
                setMapZoom(zoom);
              }}
            />
          </div>
        ) : currentView === 'tableview' ? (
          <TableVehicles
            viewOnMap={(lat, lon) => {
              viewVehicleOnMap(lat, lon);
            }}
            vehicles={vehicles}
            offset={newOffset ?? 0}
            totalVehicles={totalProducts}
            currentTab={tab}
          />
        ) : (
          <GridVehicles
            viewOnMap={(lat, lon) => {
              viewVehicleOnMap(lat, lon);
            }}
            vehicles={vehicles}
            offset={newOffset ?? 0}
            totalVehicles={totalProducts}
            currentTab={tab}
          />
        )}
      </TabsContent>
    </Tabs>
  );

  function viewVehicleOnMap(lat: number, lon: number) {
    setMapCenter([lat, lon]);
    setCurrentView('mapview');
    setMapZoom(18);
  }
}
