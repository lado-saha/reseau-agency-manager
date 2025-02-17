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
  ArrowDownCircle,
  ArrowUpCircle,
  Check,
  CheckCircle2,
  CircleParkingIcon,
  MoreHorizontal,
  MoreVertical,
  WrenchIcon
} from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { getResourceTenantStatus, HealthStatus, Resource, ResourceStatus, ResourceStatusToTenant, Vehicle, VehicleModel } from '@/lib/models/resource';
import { TabsVehicle } from '@/lib/models/helpers';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardTitle
} from '@/components/ui/card';
import { SearchItemProps } from '@/lib/utils';
import { ListBadges } from '../list-badges';
import { Station } from '@/lib/models/station';
import { PlaceAddress } from '@/lib/repo/osm-place-repo';

interface VehicleItemProps {
  tab: TabsVehicle;
  vehicle: Vehicle,
  currentId: string,
  viewOnMapAction: (latitude: number, longitude: number) => void
  detailsAction: (id: string) => void
}

function renderStatusBadge(resource: Resource, currentId: string) {
  const tenantStatus = getResourceTenantStatus(resource, currentId);

  switch (tenantStatus) {
    case 'stationed':
      return (
        <Badge variant="default" className="items-center bg-gray-500 text-white">
          <CircleParkingIcon className="mr-2 h-4 w-4" />
          <span className="text-sm">Stationed</span>
        </Badge>
      );
    case 'outgoing':
      return (
        <Badge variant="destructive" className="items-center">
          <ArrowUpCircle className="mr-2 h-4 w-4" />
          <span className="text-sm">Outgoing</span>
        </Badge>
      );
    case 'incoming':
      return (
        <Badge variant="default" className="items-center bg-green-500 text-white">
          <ArrowDownCircle className="mr-2 h-4 w-4" />
          <span className="text-sm">Incoming</span>
        </Badge>
      );
    default:
      return null; // Fallback for unexpected cases
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
  tab,
  currentId,
  detailsAction,
  viewOnMapAction
}: VehicleItemProps) {

  const fromCity = ((vehicle.tenant as Station).address as PlaceAddress).city
  const toCity = vehicle.nextTenant ? ((vehicle.nextTenant as Station).address as PlaceAddress).city : undefined

  const renderAdditionalFields = () => {
    switch (tab) {
      case 'incoming': // Next Tenant == Me (currentId)
        return (
          <>
            <TableCell>{fromCity}</TableCell> {/*From*/}
            <TableCell>{format(vehicle.tenancyEndTime as Date, 'PP')}</TableCell> {/*Will arrived at*/}
          </>
        );
      case 'outgoing': // Tenant === Me (currentId)
        return (
          <>
            <TableCell>{toCity ?? 'None'}</TableCell> {/*To town*/}
            <TableCell>{format(vehicle.lastStatusSwitchTime as Date, 'PP')}</TableCell> {/*Departure time*/}
          </>
        );
      case 'stationed': // Tenant === Me ()
        return (
          <>
            <TableCell>{format(vehicle.tenancyStartedTime as Date, 'PP')}</TableCell> {/*Arrived on*/}
          </>
        );
      default:
        return null;
    }
  };

  const model = vehicle.model as VehicleModel; // Assuming item.model is already resolved to VehicleModel
  return (
    <TableRow>
      {/* Vehicle Image */}
      <TableCell className="hidden sm:table-cell">
        <Image
          alt="Vehicle image"
          className="aspect-square rounded-md object-cover"
          height="64"
          src={(vehicle.model as VehicleModel).modelPhoto as string || '/placeholder.svg'}
          width="64"
        />
      </TableCell>

      {/* Vehicle Details */}
      <TableCell className="font-medium">{(vehicle.model as VehicleModel).name}</TableCell>
      <TableCell>{vehicle.registrationNumber}</TableCell>
      {tab === 'all' ? (
        <TableCell>{renderStatusBadge(vehicle, currentId)}</TableCell>
      ) : (
        <></>
      )}
      <TableCell>{`${(vehicle.model as VehicleModel).seatCount}`}</TableCell>
      <TableCell>{vehicle.productionYear}</TableCell>
      <TableCell>{renderHealthBadge(vehicle.healthStatus)}</TableCell>
      <TableCell>{model.fuelType}</TableCell >
      <TableCell>
        {ListBadges({ items: model.luggageSpaces })}
      </TableCell>
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
          {DropdownMenuVehicle({ vehicle, viewOnMapAction, detailsAction, currentId, tab })}
        </DropdownMenu>
      </TableCell>
    </TableRow >
  );
}
function DropdownMenuVehicle({
  vehicle,
  viewOnMapAction,
  detailsAction,
  currentId,
  tab
}: VehicleItemProps
) {
  return (
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem className="cursor-pointer h-8 my-1" onClick={() =>
        viewOnMapAction(
          vehicle.latitude,
          vehicle.longitude,
        )
      }>
        <span className='w-full h-full text-start my-2'>See on Map</span>
      </DropdownMenuItem>

      <DropdownMenuItem className='cursor-pointer h-8 my-1' onClick={() =>
        detailsAction(vehicle.id)
      }>
        <span className='w-full h-full text-start my-2'>Details</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
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
}

export function VehicleGridItem({
  vehicle,
  tab,
  viewOnMapAction, detailsAction, currentId
}: VehicleItemProps) {
  const model = (vehicle.model as VehicleModel)

  const fromCity = ((vehicle.tenant as Station).address as PlaceAddress).city
  const toCity = vehicle.nextTenant ? ((vehicle.nextTenant as Station).address as PlaceAddress).city : undefined

  const renderAdditionalFields = () => {
    switch (tab) {
      case 'incoming': // Next Tenant == Me (currentId)
        return (
          <>
            <div>
              <span className="block text-muted-foreground">Origin</span>
              <span>{fromCity}</span>
            </div>
            <div>
              <span className="block text-muted-foreground">Arrival Time</span>
              <span>{format(vehicle.tenancyEndTime as Date, 'PP')}</span>
            </div>
          </>
        );
      case 'outgoing': // Tenant === Me (currentId)
        return (
          <>
            <div>
              <span className="block text-muted-foreground">Destination</span>
              <span>{toCity ?? 'None'}</span>
            </div>
            <div>
              <span className="block text-muted-foreground">Departure time</span>
              <span>{format(vehicle.lastStatusSwitchTime as Date, 'PP')}</span>
            </div>
          </>
        );
      case 'stationed': // Tenant === Me
        return (
          <>
            <div>
              <span className="block text-muted-foreground">Arrived on</span>
              <span>{format(vehicle.tenancyStartedTime as Date, 'PP')}</span>
            </div>
          </>
        );
      default:
        return null;
    }
  };

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
        {DropdownMenuVehicle({ vehicle, viewOnMapAction, detailsAction, currentId, tab })}
      </DropdownMenu>

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
      <CardContent className="flex flex-col items-center space-y-1 text-center">
        {/* Status Badge */}
        <div className="py-2">
          {tab === 'all' ? renderStatusBadge(vehicle, currentId) : null}
        </div>

        {/* Vehicle Details */}
        <CardTitle>{vehicle.registrationNumber}</CardTitle>
        <div className="text-md text-muted-foreground">{model.name}</div>

        {/* Health Badge */}
        <div>{renderHealthBadge(vehicle.healthStatus)}</div>

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-4 items-center text-sm mt-3 w-full">
          <div>
            <span className="block text-muted-foreground">Year</span>
            <span>{vehicle.productionYear}</span>
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
            <span className="block text-muted-foreground items-center">Luggage</span>
            <ListBadges items={model.luggageSpaces} />
          </div>

          {renderAdditionalFields()}
        </div>
      </CardContent>

      {/* Footer Metadata */}
      <div className="border-t mt-1 py-1 text-xs  flex flex-col px-4 ">
        <div className="flex justify-between text-muted-foreground">
          <span>Added On</span>
          <span>Last Updated On</span>
        </div>
        <div className="flex justify-between">
          <span>{format(vehicle.createdOn, 'Pp')}</span>
          <span className="text-end">
            {format(vehicle.updatedOn, 'Pp')}
          </span>
        </div>
      </div>
    </Card>
  );
}

export function VehicleMapTooltip({ vehicle, tab, detailsAction, currentId, viewOnMapAction }: VehicleItemProps) {

  const model = (vehicle.model as VehicleModel)
  return (
    <Card className="flex flex-col items-center text-center stroke-none border-none p-1">
      {/* Status Badge */}
      <div>{tab === 'all' ? renderStatusBadge(vehicle, currentId) : null}</div>
      {/* Vehicle Details */}
      <span className="text-sm">{vehicle.registrationNumber}</span>
      <div className="text-sm text-muted-foreground">{model.name}</div>
      <span>{`${model.seatCount}`}</span>
      {renderHealthBadge(vehicle.healthStatus)}
    </Card>
  );
}
