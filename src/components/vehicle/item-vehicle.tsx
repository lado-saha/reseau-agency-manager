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
  AlertTriangle,
  ArrowDown,
  ArrowDownCircle,
  ArrowUp,
  ArrowUpCircle,
  Check,
  CheckCircle2,
  CircleParkingIcon,
  Hammer,
  Home,
  HomeIcon,
  LucideMessageCircleWarning,
  MoreHorizontal,
  MoreVertical,
  MoveRight,
  ParkingCircle,
  PauseCircleIcon,
  Wrench,
  WrenchIcon
} from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { HealthStatus, Vehicle, VehicleModel } from '@/lib/models/resource';
import { TabsVehicle } from '@/lib/models/helpers';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { SearchItemProps } from '@/lib/utils';
import { ListBadges } from '../list-badges';

interface VehicleItemProps {
  vehicle: Vehicle;
  currentTab: TabsVehicle;
  viewOnMap: (lat: number, lon: number) => void;
}

function renderStatusBadge(vehicle: Vehicle) {
  switch (vehicle.status) {
    case 'outgoing':
      return (
        <Badge variant="destructive" className="items-center">
          <ArrowUpCircle className="mr-2 h-4 w-4" />
          <span className="text-sm">Outgoing</span>
        </Badge>
      );
    case 'incoming':
      return (
        <Badge
          variant="default"
          className="items-center bg-green-500 text-white"
        >
          <ArrowDownCircle className="mr-2 h-4 w-4" />
          <span className="text-sm">Incoming</span>
        </Badge>
      );
    case 'stationed':
      return (
        <Badge
          variant="default"
          className="items-center bg-gray-500 text-white"
        >
          <CircleParkingIcon className="mr-2 h-4 w-4" />
          <span className="text-sm">Stationed</span>
        </Badge>
      );
    default:
      return null;
  }
}

export function renderHealthBadge(healthStatus: HealthStatus) {
  switch (healthStatus) {
    case 'good':
      return (
        <Badge variant="outline" className="items-center ">
          <CheckCircle2 className="mr-2 h-4 w-4" />
          <span className="text-sm">Healthy</span>
        </Badge>
      );
    case 'bad':
      return (
        <Badge variant="outline" className="items-center ">
          <AlertCircle className="mr-2 h-4 w-4" />
          <span className="text-sm">Damaged</span>
        </Badge>
      );
    case 'maintenance':
      return (
        <Badge variant="outline" className="items-center">
          <WrenchIcon className="mr-2 w-4 h-4" />
          <span className="text-sm">Repairing</span>
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
      case 'stationed':
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
  viewOnMap: (latitude: number, longitude: number) => void
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


export function VehicleSearchItem({
  item,
  isSelected,
  onCheckedChange,
}: SearchItemProps<Vehicle>) {
  const model = item.model as VehicleModel; // Assuming item.model is already resolved to VehicleModel

  // Determine chip color and icon based on healthStatus
  return (
    <Card
      className={`relative overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 ${isSelected ? 'border-2 border-primary' : 'border'
        }`}
      onClick={() => onCheckedChange(!isSelected)} // Toggle selection on card click
    >
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 z-10 bg-primary rounded-full p-1">
          <Check className="h-4 w-4 text-white" /> {/* Checkmark icon */}
        </div>
      )}

      {/* Vehicle Image */}
      <div className="relative w-full h-32">
        <Image
          src={model.modelPhoto as string || '/placeholder.svg'}
          alt="Vehicle image"
          fill
          className="object-cover"
          onClick={(e) => {
            e.preventDefault();
            window.open(model.modelPhoto as string, '_blank');
          }}
        />
      </div>

      {/* Card Content */}
      <CardContent className="flex flex-col items-center space-y-2 text-center p-4">
        {/* Vehicle Manufacturr and Model Name */}
        {renderHealthBadge(item.healthStatus)}
        <CardTitle className="text-lg font-semibold">
          {item.manufacturer} {model.name}
        </CardTitle>

        {/* Registration Number */}
        <div className="text-md text-muted-foreground">
          <span className="font-semibold">{item.registrationNumber}</span>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-4 items-center text-sm mt-3 w-full">
          {/* Production Year */}
          <div>
            <span className="block text-muted-foreground">Year</span>
            <span>{item.productionYear}</span>
          </div>

          {/* Seat Count */}
          <div>
            <span className="block text-muted-foreground">Seats</span>
            <span>{model.seatCount}</span>
          </div>

          {/* Fuel Type */}
          <div>
            <span className="block text-muted-foreground">Fuel</span>
            <span>{model.fuelType}</span>
          </div>

          {/* Luggage Spaces */}
          <div>
            <span className="block text-muted-foreground">Luggage</span>
            <ListBadges items={model.luggageSpaces} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
} export function VehicleGridItem({
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
      <CardContent className="flex flex-col items-center space-y-1 text-center">
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
          {currentTab === 'stationed' && (
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

      {/* Footer Metadata */}
      <div className="border-t mt-1 py-1 text-xs  flex flex-col px-4 ">
        <div className="flex justify-between text-muted-foreground">
          <span>Added On</span>
          <span>Last Updated On</span>
        </div>
        <div className="flex justify-between">
          <span>{format(vehicle.auditInfo.createdOn, 'Pp')}</span>
          <span className="text-end">
            {format(vehicle.auditInfo.updatedOn, 'Pp')}
          </span>
        </div>
      </div>
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
