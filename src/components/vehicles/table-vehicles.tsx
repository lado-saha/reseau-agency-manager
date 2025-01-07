import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Vehicle } from '@/lib/models/resource';
import {
  VehicleGridItem,
  VehicleTableItem
} from '@/components/vehicles/item-vehicle';
import { SortingDirection, TabsVehicles } from '@/lib/models/helpers';
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';

export interface PropsVehicles {
  vehicles: Vehicle[];
  offset: number;
  totalVehicles: number;
  currentTab: TabsVehicles;
  viewOnMap: (lat: number, lon: number) => void;
}

export function vehicleTableSortingOptions(currentTab: string) {
  // Default options for 'all' tab
  const defaultOptions = [
    { displayName: 'Model', fieldName: 'model' },
    { displayName: 'Immatriculation', fieldName: 'immatriculation' },
    { displayName: 'Seats', fieldName: 'nbSeats' },
    { displayName: 'Status', fieldName: 'status' },
    { displayName: 'Health', fieldName: 'health' }
  ];

  // Additional options for specific tabs
  let additionalOptions: { displayName: string; fieldName: string }[] = [];

  switch (currentTab) {
    case 'incoming':
      additionalOptions = [
        { displayName: 'Origin', fieldName: 'origin' },
        { displayName: 'Departure Time', fieldName: 'departureTime' },
        { displayName: 'Estimated Arrival', fieldName: 'estimatedArrivalTime' }
      ];
      break;
    case 'outgoing':
      additionalOptions = [
        { displayName: 'Destination', fieldName: 'destination' },
        { displayName: 'Departure Time', fieldName: 'departureTime' },
        { displayName: 'Estimated Arrival', fieldName: 'estimatedArrivalTime' }
      ];
      break;
    case 'stationed':
      additionalOptions = [
        { displayName: 'Arrived On', fieldName: 'arrivedOn' },
        { displayName: 'Arrived From', fieldName: 'arrivedFrom' }
      ];
      break;
    default:
      additionalOptions = [];
  }

  // Combine the default options with the additional ones
  return [...defaultOptions, ...additionalOptions];
}

// Reusable function to render pagination buttons
function Pagination({
  offset,
  totalVehicles,
  onPrevPage,
  onNextPage
}: {
  offset: number;
  totalVehicles: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}) {
  return (
    <CardFooter>
      <form className="flex items-center w-full justify-between">
        <div className="text-xs text-muted-foreground">
          Showing{' '}
          <strong>
            {Math.max(0, Math.min(offset - 5, totalVehicles) + 1)}-{offset}
          </strong>{' '}
          of <strong>{totalVehicles}</strong> vehicles
        </div>
        <div className="flex">
          <Button
            formAction={onPrevPage}
            variant="ghost"
            size="sm"
            type="submit"
            disabled={offset === 5}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Prev
          </Button>
          <Button
            formAction={onNextPage}
            variant="ghost"
            size="sm"
            type="submit"
            disabled={offset + 5 > totalVehicles}
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </CardFooter>
  );
}

// Reusable function to render headers
function RenderTableHeaders(currentTab: TabsVehicles) {
  switch (currentTab) {
    case 'incoming':
      return (
        <>
          <TableHead>Origin</TableHead>
          <TableHead>Departure Time</TableHead>
          <TableHead>Estimated Arrival</TableHead>
        </>
      );
    case 'outgoing':
      return (
        <>
          <TableHead>Destination</TableHead>
          <TableHead>Departure Time</TableHead>
          <TableHead>Estimated Arrival</TableHead>
        </>
      );
    case 'stationed':
      return (
        <>
          <TableHead>Arrived On</TableHead>
          <TableHead>Arrived From</TableHead>
        </>
      );
    default:
      return null;
  }
}

export function TableVehicles({
  vehicles,
  offset,
  totalVehicles,
  currentTab,
  viewOnMap
}: PropsVehicles) {
  const router = useRouter();

  const prevPage = () => router.back();
  const nextPage = () => router.push(`/?offset=${offset}`, { scroll: false });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicles</CardTitle>
        <CardDescription>
          Manage your fleet and monitor vehicle statuses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span>Image</span>
              </TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Immatriculation</TableHead>
              {currentTab === 'all' && <TableHead>Status</TableHead>}
              <TableHead>Seats</TableHead>
              <TableHead>Health</TableHead>
              {RenderTableHeaders(currentTab)}
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle) => (
              <VehicleTableItem
                viewOnMap={viewOnMap}
                key={vehicle.immatriculation}
                vehicle={vehicle}
                currentTab={currentTab}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <Pagination
        offset={offset}
        totalVehicles={totalVehicles}
        onPrevPage={prevPage}
        onNextPage={nextPage}
      />
    </Card>
  );
}

export function GridVehicles({
  vehicles,
  offset,
  totalVehicles,
  currentTab,
  viewOnMap
}: PropsVehicles) {
  const router = useRouter();

  const prevPage = () => router.back();
  const nextPage = () => router.push(`/?offset=${offset}`, { scroll: false });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicles</CardTitle>
        <CardDescription>
          Manage your fleet and monitor vehicle statuses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {vehicles.map((vehicle) => (
            <VehicleGridItem
              viewOnMap={viewOnMap}
              key={vehicle.immatriculation}
              vehicle={vehicle}
              currentTab={currentTab}
            />
          ))}
        </div>
      </CardContent>
      <Pagination
        offset={offset}
        totalVehicles={totalVehicles}
        onPrevPage={prevPage}
        onNextPage={nextPage}
      />
    </Card>
  );
}
