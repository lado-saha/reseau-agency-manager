import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  AlertCircle,
  ArrowDown,
  ArrowDownCircle,
  ArrowUp,
  ArrowUpCircle,
  Check,
  CheckCircle2,
  Hammer,
  Home,
  HomeIcon,
  LucideMessageCircleWarning,
  MoreHorizontal,
  MoreVertical,
  MoveRight,
  ParkingCircle
} from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Vehicle } from '@/lib/models/resource';
import { TabsVehicles } from '@/lib/models/helpers';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

interface VehicleItemProps {
  vehicle: Vehicle;
  currentTab: TabsVehicles;
  viewOnMap: (lat: number, lon: number) => void;
}

function renderStatusBadge(vehicle: Vehicle) {
  switch (vehicle.status) {
    case 'incoming':
      return (
        <Badge variant="default" className="items-center">
          <ArrowDownCircle className="mr-2 " />
          <span className="text-sm">Incoming</span>
        </Badge>
      );
    case 'outgoing':
      return (
        <Badge variant="default" className="items-center">
          <ArrowUpCircle className="mr-2 " />
          <span className="text-sm">Outgoing</span>
        </Badge>
      );
    case 'idle':
      return (
        <Badge variant="default" className="items-center ">
          <ParkingCircle className="mr-2  " />
          <span className="text-sm">Idle</span>
        </Badge>
      );
    default:
      return null;
  }
}

function renderHealthBadge(vehicle: Vehicle) {
  switch (vehicle.health) {
    case 'normal':
      return (
        <Badge variant="outline" className="items-center border-green-500">
          <CheckCircle2 className="mr-2 text-green-500" />
          Normal
        </Badge>
      );
    case 'damaged':
      return (
        <Badge variant="outline" className="items-center border-red-500">
          <AlertCircle className="mr-2  text-red-500" />
          Damaged
        </Badge>
      );
    case 'repairing':
      return (
        <Badge variant="outline" className="items-center border-blue-500">
          <Hammer className="mr-2  text-blue-500" />
          Repairing
        </Badge>
      );
    default:
      return null;
  }
}

export function VehicleTableItem({
  vehicle,
  currentTab,
  viewOnMap
}: VehicleItemProps) {
  const renderAdditionalFields = () => {
    switch (currentTab) {
      case 'incoming':
        return (
          <>
            <TableCell>{vehicle.origin}</TableCell>
            <TableCell>{vehicle.departureTime}</TableCell>
            <TableCell>{vehicle.estimatedArrivalTime}</TableCell>
          </>
        );
      case 'outgoing':
        return (
          <>
            <TableCell>{vehicle.destination}</TableCell>
            <TableCell>{vehicle.departureTime}</TableCell>
            <TableCell>{vehicle.estimatedArrivalTime}</TableCell>
          </>
        );
      case 'idle':
        return (
          <>
            <TableCell>{vehicle.arrivedOn}</TableCell>
            <TableCell>{vehicle.arrivedFrom}</TableCell>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <TableRow>
      {/* Vehicle Image */}
      <TableCell className="hidden sm:table-cell">
        <Image
          alt="Vehicle image"
          className="aspect-square rounded-md object-cover"
          height="64"
          src={vehicle.imageUrl || '/placeholder.svg'}
          width="64"
        />
      </TableCell>

      {/* Vehicle Details */}
      <TableCell className="font-medium">{vehicle.model}</TableCell>
      <TableCell>{vehicle.immatriculation}</TableCell>
      {currentTab === 'all' ? (
        <TableCell>{renderStatusBadge(vehicle)}</TableCell>
      ) : (
        <></>
      )}
      <TableCell>{`${12}/${vehicle.nbSeats}`}</TableCell>
      <TableCell>{renderHealthBadge(vehicle)}</TableCell>

      {/* Additional Info */}
      {renderAdditionalFields()}

      {/* Action Menu */}
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          {DropdownMenuVehicle(vehicle, viewOnMap)}
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

function DropdownMenuVehicle(
  vehicle: Vehicle,
  viewOnMap: (latittude: number, longitude: number) => void
) {
  return (
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem>
        <button
          type="submit"
          onClick={() =>
            viewOnMap(
              vehicle.positionGps.latitude,
              vehicle.positionGps.longitude
            )
          }
        >
          See on Map
        </button>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}

export function VehicleGridItem({
  vehicle,
  currentTab,
  viewOnMap
}: VehicleItemProps) {
  return (
    <Card className="relative overflow-hidden shadow-md">
      {/* More Button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-2 right-2 z-10 p-1 rounded-full shadow-md"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        {DropdownMenuVehicle(vehicle, viewOnMap)}
      </DropdownMenu>

      {/* Vehicle Image */}
      <div className="relative w-full h-32">
        <Image
          src={vehicle.imageUrl || '/placeholder.svg'}
          alt="Vehicle image"
          fill
          className="object-cover"
        />
      </div>

      {/* Card Content */}
      <CardContent className="flex flex-col items-center space-y-3 text-center">
        {/* Status Badge */}
        <div className="py-2">
          {currentTab === 'all' ? renderStatusBadge(vehicle) : null}
        </div>

        {/* Vehicle Details */}
        <CardTitle>{vehicle.immatriculation}</CardTitle>
        <div className="text-md text-muted-foreground">{vehicle.model}</div>

        {/* Health Badge */}
        <div>{renderHealthBadge(vehicle)}</div>

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-4 items-center text-sm mt-3 w-full">
          <div>
            <span className="block text-muted-foreground">Seats</span>
            <span>{`${12}/${vehicle.nbSeats}`}</span>
          </div>
          {currentTab === 'incoming' && (
            <>
              <div>
                <span className="block text-muted-foreground">Origin</span>
                <span>{vehicle.origin}</span>
              </div>
              <div>
                <span className="block text-muted-foreground">Departure</span>
                <span>{vehicle.departureTime}</span>
              </div>
              <div>
                <span className="block text-muted-foreground">Arrival</span>
                <span>{vehicle.estimatedArrivalTime}</span>
              </div>
            </>
          )}
          {currentTab === 'outgoing' && (
            <>
              <div>
                <span className="block text-muted-foreground">Destination</span>
                <span>{vehicle.destination}</span>
              </div>
              <div>
                <span className="block text-muted-foreground">Departure</span>
                <span>{vehicle.departureTime}</span>
              </div>
              <div>
                <span className="block text-muted-foreground">Arrival</span>
                <span>{vehicle.estimatedArrivalTime}</span>
              </div>
            </>
          )}
          {currentTab === 'idle' && (
            <>
              <div>
                <span className="block text-muted-foreground">Arrived On</span>
                <span>{vehicle.arrivedOn}</span>
              </div>
              <div>
                <span className="block text-muted-foreground">
                  Arrived From
                </span>
                <span>{vehicle.arrivedFrom}</span>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function VehicleMapTooltip({ vehicle, currentTab }: VehicleItemProps) {
  return (
    <Card className="flex flex-col items-center text-center stroke-none border-none p-1">
      {/* Status Badge */}
      <div>{currentTab === 'all' ? renderStatusBadge(vehicle) : null}</div>
      {/* Vehicle Details */}
      <span className="text-sm">{vehicle.immatriculation}</span>
      <div className="text-sm text-muted-foreground">{vehicle.model}</div>
      <span>{`${12}/${vehicle.nbSeats}`}</span>
      {renderHealthBadge(vehicle)}
    </Card>
  );
}
