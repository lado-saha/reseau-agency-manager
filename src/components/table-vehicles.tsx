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
import { VehicleGridItem, VehicleTableItem } from '@/components/item-vehicle';
import { TabsVehicles } from '@/lib/models/helpers';

export interface PropsVehicles {
  vehicles: Vehicle[];
  offset: number;
  totalVehicles: number;
  currentTab: TabsVehicles;
  viewOnMap: (lat: number, lon: number) => void;
}

export function TableVehicles({
  vehicles,
  offset,
  totalVehicles,
  currentTab,
  viewOnMap
}: PropsVehicles) {
  const router = useRouter();
  const vehiclesPerPage = 5;

  function prevPage() {
    router.back();
  }

  function nextPage() {
    router.push(`/?offset=${offset}`, { scroll: false });
  }

  const renderTableHeaders = () => {
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
      case 'idle':
        return (
          <>
            <TableHead>Arrived On</TableHead>
            <TableHead>Arrived From</TableHead>
          </>
        );
      default:
        return null;
    }
  };

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
              {/* Show status only in all tab */}
              {currentTab === 'all' ? <TableHead>Status</TableHead> : <></>}
              <TableHead>Seats</TableHead>
              <TableHead>Health</TableHead>
              {renderTableHeaders()}
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
      <CardFooter>
        <form className="flex items-center w-full justify-between">
          <div className="text-xs text-muted-foreground">
            Showing{' '}
            <strong>
              {Math.max(
                0,
                Math.min(offset - vehiclesPerPage, totalVehicles) + 1
              )}
              -{offset}
            </strong>{' '}
            of <strong>{totalVehicles}</strong> vehicles
          </div>
          <div className="flex">
            <Button
              formAction={prevPage}
              variant="ghost"
              size="sm"
              type="submit"
              disabled={offset === vehiclesPerPage}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Prev
            </Button>
            <Button
              formAction={nextPage}
              variant="ghost"
              size="sm"
              type="submit"
              disabled={offset + vehiclesPerPage > totalVehicles}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardFooter>
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
  const vehiclesPerPage = 5;

  function prevPage() {
    router.back();
  }

  function nextPage() {
    router.push(`/?offset=${offset}`, { scroll: false });
  }

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
      <CardFooter>
        <form className="flex items-center w-full justify-between">
          <div className="text-xs text-muted-foreground">
            Showing{' '}
            <strong>
              {Math.max(
                0,
                Math.min(offset - vehiclesPerPage, totalVehicles) + 1
              )}
              -{offset}
            </strong>{' '}
            of <strong>{totalVehicles}</strong> vehicles
          </div>
          <div className="flex">
            <Button
              formAction={prevPage}
              variant="ghost"
              size="sm"
              type="submit"
              disabled={offset === vehiclesPerPage}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Prev
            </Button>
            <Button
              formAction={nextPage}
              variant="ghost"
              size="sm"
              type="submit"
              disabled={offset + vehiclesPerPage > totalVehicles}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardFooter>
    </Card>
  );
}
