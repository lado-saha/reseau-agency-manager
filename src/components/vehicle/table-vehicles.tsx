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
import {
  ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams
} from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Vehicle } from '@/lib/models/resource';
// import {
//   VehicleGridItem,
//   VehicleTableItem
// } from '@/components/vehicle/item-vehicle';
import { TabsVehicle } from '@/lib/models/helpers';
import { PAGE_OFFSET } from '@/lib/utils';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { VehicleGridItem, VehicleTableItem } from './item-vehicle';

export interface PropsVehicles {
  vehicles: Vehicle[];
  offset: number;
  currentId: string;
  totalVehicles: number;
  tab: TabsVehicle;
  viewOnMapAction: (lat: number, lon: number) => void;
  detailsAction: (id: string) => void
}

export function vehicleTableSortingOptions(tab: string) {
  // Default options for 'all' tab
  const defaultOptions = [
    { displayName: 'Image', fieldName: 'photo' },
    { displayName: 'Model', fieldName: 'model' },
    { displayName: 'Registration Number', fieldName: 'registrationNumber' },
    { displayName: 'Status', fieldName: 'status' },
    { displayName: 'Production Year', fieldName: 'productionYear' },
    { displayName: 'Health Status', fieldName: 'healthStatus' },
    { displayName: 'Seat Count', fieldName: 'model.seatCount' },
    { displayName: 'Fuel Type', fieldName: 'model.fuelType' },
    { displayName: 'Luggage Spaces', fieldName: 'model.luggageSpaces' },
  ];

  // Additional options for specific tabs
  let additionalOptions: { displayName: string; fieldName: string }[] = [];

  switch (tab) {
    case 'incoming':
      additionalOptions = [
        { displayName: 'Origin', fieldName: 'tenant.address.city' },
        { displayName: 'Arrival Time', fieldName: 'tenancyEndTime' },
      ];
      break;
    case 'outgoing':
      additionalOptions = [
        { displayName: 'Destination', fieldName: 'nextTenant.address.city' },
        { displayName: 'Arrival Time', fieldName: 'lastStatusSwitchTime' },
      ];
      break;
    case 'stationed':
      additionalOptions = [
        { displayName: 'Arrived On', fieldName: 'tenancyStartedTime' },
      ];
      break;
    default:
      additionalOptions = [];
  }

  // Combine the default options with the additional ones
  return [...defaultOptions, ...additionalOptions];
}

function Pagination({
  offset,
  totalVehicles
}: {
  offset: number;
  totalVehicles: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page > 1) {
      params.set('page', `${page}`);
    } else {
      params.delete('page');
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const onPrevPage = () => {
    // Go to the previous page by subtracting PAGE_OFFSET
    const newOffset = Math.max(0, offset - PAGE_OFFSET); // Ensure offset doesn't go below 0
    const page = Math.floor(newOffset / PAGE_OFFSET) + 1; // Calculate the page number (1-based index)
    handlePageChange(page);
  };

  const onNextPage = () => {
    // Go to the next page by adding PAGE_OFFSET
    const newOffset = offset + PAGE_OFFSET;
    const page = Math.floor(newOffset / PAGE_OFFSET) + 1; // Calculate the page number (1-based index)
    handlePageChange(page);
  };

  const start = offset + 1;
  const end = Math.min(offset + PAGE_OFFSET, totalVehicles);

  // console.log(`Offset: ${offset}`);

  return (
    <CardFooter>
      <form className="flex items-center w-full justify-between">
        <div className="text-xs text-muted-foreground">
          Showing{' '}
          <strong>
            {start}-{end}
          </strong>{' '}
          of <strong>{totalVehicles}</strong> vehicles
        </div>
        <div className="flex">
          <Button
            formAction={onPrevPage}
            variant="ghost"
            size="sm"
            type="submit"
            disabled={offset === 0} // Disable prev button when on the first page
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Prev
          </Button>
          <Button
            formAction={onNextPage}
            variant="ghost"
            size="sm"
            type="submit"
            disabled={offset + PAGE_OFFSET >= totalVehicles} // Disable next button when on the last page
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

function RenderTableHeaders(tab: TabsVehicle) {
  switch (tab) {
    case 'incoming':
      return (
        <>
          <TableHead>Origin</TableHead>
          <TableHead>Arrival Time</TableHead>
        </>
      );
    case 'outgoing':
      return (
        <>
          <TableHead>Destination</TableHead>
          <TableHead>Arrival Time</TableHead>
        </>
      );
    case 'stationed':
      return (
        <>
          <TableHead>Arrived On</TableHead>
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
  tab,
  viewOnMapAction, detailsAction, currentId
}: PropsVehicles) {
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
              <TableHead>Registration Number</TableHead>
              {tab === 'all' && <TableHead>Status</TableHead>}
              <TableHead>Seat Count</TableHead>
              <TableHead>Production Year</TableHead>
              <TableHead>Health Status</TableHead>
              <TableHead>Fuel Type</TableHead>
              <TableHead>Luggage Spaces</TableHead>
              {RenderTableHeaders(tab)}
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle) => (
              <VehicleTableItem
                viewOnMapAction={viewOnMapAction}
                key={vehicle.registrationNumber}
                vehicle={vehicle}
                tab={tab}
                currentId={currentId}
                detailsAction={detailsAction}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <Pagination offset={offset} totalVehicles={totalVehicles} />
    </Card>
  );
}

export function GridVehicles({
  vehicles,
  offset,
  totalVehicles,
  tab,
  viewOnMapAction, detailsAction, currentId
}: PropsVehicles) {
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
              viewOnMapAction={viewOnMapAction}
              key={vehicle.registrationNumber}
              vehicle={vehicle}
              tab={tab}
              currentId={currentId}
              detailsAction={detailsAction}
            />
          ))}
        </div>
      </CardContent>
      <Pagination offset={offset} totalVehicles={totalVehicles} />
    </Card>
  );
}
