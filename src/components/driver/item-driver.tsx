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
import { getResourceTenantStatus, HealthStatus, Resource, ResourceStatus, ResourceStatusToTenant, Driver } from '@/lib/models/resource';
import { TabsDriver } from '@/lib/models/helpers';
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
import { AgencyEmployee } from '@/lib/models/employee';
import { User } from '@/lib/models/user';

interface DriverItemProps {
  tab: TabsDriver;
  driver: Driver,
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
          <span className="text-sm">Sick</span>
        </Badge>
      );
    case 'maintenance':
      return (
        <Badge variant="outline" className="items-center">
          <WrenchIcon className="mr-2 w-4 h-4" />
          <span className="text-sm">Hospitalized</span>
        </Badge>
      );
    default:
      return null;
  }
}

export function DriverTableItem({
  driver,
  tab,
  currentId,
  detailsAction,
  viewOnMapAction
}: DriverItemProps) {

  //const fromCity = ((driver.tenant as Station).address as PlaceAddress).city
  const fromCity =  driver.tenant ? ((driver.tenant as Station).address as PlaceAddress).city : undefined
  const toCity = driver.nextTenant ? ((driver.nextTenant as Station).address as PlaceAddress).city : undefined

  const renderAdditionalFields = () => {
    switch (tab) {
      case 'incoming': // Next Tenant == Me (currentId)
        return (
          <>
            <TableCell>{fromCity}</TableCell> {/*From*/}
            <TableCell>{format(driver.tenancyEndTime as Date, 'PP')}</TableCell> {/*Will arrived at*/}
          </>
        );
      case 'outgoing': // Tenant === Me (currentId)
        return (
          <>
            <TableCell>{toCity ?? 'None'}</TableCell> {/*To town*/}
            <TableCell>{format(driver?.lastStatusSwitchTime as Date ?? new Date(), 'PP')}</TableCell> {/*Departure time*/}
          </>
        );
      case 'stationed': // Tenant === Me ()
        return (
          <>
            <TableCell>{format(driver?.tenancyStartedTime as Date ?? new Date(), 'PP')}</TableCell> {/*Arrived on*/}
          </>
        );
      default:
        return null;
    }
  };

  const employee = driver.employee as AgencyEmployee
  const user = employee.user as User
  return (
    <TableRow>
      {/* Driver Image */}
      <TableCell className="hidden sm:table-cell">
        <Image
          alt="Driver image"
          className="aspect-square rounded-md object-cover"
          height="64"
          src={user.photo as string || '/placeholder.svg'}
          width="64"
        />
      </TableCell>

      {/* Driver Details */}
      <TableCell className="font-medium">{user.name}</TableCell>
      <TableCell>{driver.license}</TableCell>
      {tab === 'all' ? (
        <TableCell>{renderStatusBadge(driver, currentId)}</TableCell>
      ) : (
        <></>
      )}
      <TableCell>{user.sex}</TableCell>
      <TableCell>{user.phone}</TableCell>
      <TableCell>{user.email}</TableCell >
      <TableCell>{renderHealthBadge(driver.healthStatus)}</TableCell>
      <TableCell>{employee.salary} FCFA</TableCell>
      {renderAdditionalFields()}
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          {DropdownMenuDriver({ driver, viewOnMapAction, detailsAction, currentId, tab })}
        </DropdownMenu>
      </TableCell>
    </TableRow >
  );
}
function DropdownMenuDriver({
  driver,
  viewOnMapAction,
  detailsAction,
  currentId,
  tab
}: DriverItemProps
) {
  return (
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem className="cursor-pointer h-8 my-1" onClick={() =>
        viewOnMapAction(
          driver.latitude,
          driver.longitude,
        )
      }>
        <span className='w-full h-full text-start my-2'>See on Map</span>
      </DropdownMenuItem>

      <DropdownMenuItem className='cursor-pointer h-8 my-1' onClick={() =>
        detailsAction(driver.id)
      }>
        <span className='w-full h-full text-start my-2'>Details</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}


export function DriverSearchItem({
  item,
  isSelected,
  onCheckedChange,
}: SearchItemProps<Driver>) {
  // Determine chip color and icon based on healthStatus
  const employee = item.employee as AgencyEmployee
  const user = employee.user as User

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

      {/* Driver Image */}
      <div className="relative w-full h-32">
        <Image
          src={user.photo as string}
          alt="Driver image"
          fill
          className="object-cover"
          onClick={(e) => {
            e.preventDefault();
            window.open(user.photo as string, '_blank');
          }}
        />
      </div>

      {/* Card Content */}
      <CardContent className="flex flex-col items-center space-y-2 text-center p-4">
        {/* Driver Manufacturr and employee Name */}
        {renderHealthBadge(item.healthStatus)}
        <CardTitle className="text-lg font-semibold">
          {user.name}
        </CardTitle>

        {/* Registration Number */}
        <div className="text-md text-muted-foreground">
          <span className="font-semibold">{item.license}</span>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-4 items-center text-sm mt-3 w-full">
          {/* Production Year */}
          <div>
            <span className="block text-muted-foreground">Sex</span>
            <span>{user.sex}</span>
          </div>

          <div>
            <span className="block text-muted-foreground">Email</span>
            <span>{user.email}</span>
          </div>

          <div>
            <span className="block text-muted-foreground">Phone</span>
            <span>{user.phone}</span>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}

export function DriverGridItem({
  driver,
  tab,
  viewOnMapAction, detailsAction, currentId
}: DriverItemProps) {
  const employee = (driver.employee as AgencyEmployee)
  const user = employee.user as User

  const fromCity =  driver.tenant ? ((driver.tenant as Station).address as PlaceAddress).city : undefined
  const toCity = driver.nextTenant ? ((driver.nextTenant as Station).address as PlaceAddress).city : undefined

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
              <span>{format(driver.tenancyEndTime as Date, 'PP')}</span>
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
              <span>{format(driver.lastStatusSwitchTime as Date, 'PP')}</span>
            </div>
          </>
        );
      case 'stationed': // Tenant === Me
        return (
          <>
            <div>
              <span className="block text-muted-foreground">Arrived on</span>
              <span>{format(driver.tenancyStartedTime as Date, 'PP')}</span>
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
        {DropdownMenuDriver({ driver, viewOnMapAction, detailsAction, currentId, tab })}
      </DropdownMenu>

      {/* Driver Image */}

      <div className="relative w-full h-32">
        <Image
          src={user.photo as string || '/placeholder.svg'}
          alt="Driver image"
          fill
          className="object-cover"
          onClick={(e) => {
            e.preventDefault();
            window.open(user.photo as string, '_blank');
          }}
        />
      </div>

      {/* Card Content */}
      <CardContent className="flex flex-col items-center space-y-1 text-center">
        {/* Status Badge */}
        <div className="py-2">
          {tab === 'all' ? renderStatusBadge(driver, currentId) : null}
        </div>

        {/* Driver Details */}
        <CardTitle>{driver.license}</CardTitle>
        <div className="text-md text-muted-foreground">{user.name}</div>

        {/* Health Badge */}
        <div>{renderHealthBadge(driver.healthStatus)}</div>

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-4 items-center text-sm mt-3 w-full">
          <div>
            <span className="block text-muted-foreground">Sex</span>
            <span>{user.sex}</span>
          </div>

          {/* Seat Count */}
          <div>
            <span className="block text-muted-foreground">Email</span>
            <span>{user.email}</span>
          </div>

          {/* Fuel Type */}
          <div>
            <span className="block text-muted-foreground">Phone</span>
            <span>{user.phone}</span>
          </div>

          {/* Luggage Spaces */}
          <div>
            <span className="block text-muted-foreground items-center">salary</span>

            <span>{user.phone}</span>
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
          <span>{format(driver.createdOn, 'Pp')}</span>
          <span className="text-end">
            {format(driver.updatedOn, 'Pp')}
          </span>
        </div>
      </div>
    </Card>
  );
}

export function DriverMapTooltip({ driver, tab, detailsAction, currentId, viewOnMapAction }: DriverItemProps) {
  const employee = (driver.employee as AgencyEmployee)
  const user = employee.user as User
  return (
    <Card className="flex flex-col items-center text-center stroke-none border-none p-1">
      {/* Status Badge */}
      <div>{tab === 'all' ? renderStatusBadge(driver, currentId) : null}</div>
      {/* Driver Details */}
      <span className="text-sm">{driver.license}</span>
      <div className="text-sm text-muted-foreground">{user.name}</div>
      <span>{user.email}</span>
      {renderHealthBadge(driver.healthStatus)}
    </Card>
  );
}
