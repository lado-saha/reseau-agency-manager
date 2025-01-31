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
  BusFrontIcon,
  CarTaxiFront,
  MoreHorizontal,
  MoreVertical
} from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { VehicleModel } from '@/lib/models/resource';
import { TabsVehicleModel } from '@/lib/models/helpers';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface VehicleModelItemProps {
  model: VehicleModel;
  currentTab: TabsVehicleModel;
}

/** Bus or Car */
function renderTypeBadge(model: VehicleModel) {
  return (
    <Badge variant="default" className="items-center bg-gray-500 text-white">
      {model.numberSeats < 8 ? (
        <>
          <CarTaxiFront className="mr-2 h-4 w-4" />
          <span className="text-sm">Car</span>
        </>
      ) : (
        <>
          <BusFrontIcon className="mr-2 h-4 w-4" />
          <span className="text-sm">Bus</span>
        </>
      )}
    </Badge>
  );
}

export function VehicleModelTableItem({
  model,
  currentTab
}: VehicleModelItemProps) {
  return (
    <TableRow>
      {/* Vehicle Image */}
      <TableCell className="hidden sm:table-cell">
        <Image
          alt="Vehicle image"
          className="aspect-square rounded-md object-cover"
          height="64"
          src={'' || '/placeholder.svg'}
          width="64"
        />
      </TableCell>

      {/* Vehicle Details */}
      <TableCell className="font-medium">{model.modelName}</TableCell>
      <TableCell>{model.numberSeats}</TableCell>
      {currentTab === 'all' && <TableCell>{renderTypeBadge(model)}</TableCell>}

      <TableCell>{model.manufacturer}</TableCell>
      <TableCell>{model.fuelType}</TableCell>
      <TableCell>{format(model.auditInfo.createdOn, 'Pp')}</TableCell>
      <TableCell>{format(model.auditInfo.updatedOn, 'Pp')}</TableCell>

      {/* Action Menu */}
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          {DropdownMenuVehicleModel(model)}
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

function DropdownMenuVehicleModel(model: VehicleModel) {
  return (
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem>
        <button
          type="submit"
          onClick={
            () => {}
            // viewOnMap(
            //   vehicle.positionGps.latitude,
            //   vehicle.positionGps.longitude
            // )
          }
        >
          View Details
        </button>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}

export function VehicleModelGridItem({
  model,
  currentTab
}: VehicleModelItemProps) {
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
        {DropdownMenuVehicleModel(model)}
      </DropdownMenu>

      {/* Vehicle Image */}
      <div className="relative w-full h-32">
        <Image
          src={'' || '/placeholder.svg'}
          alt="Vehicle image"
          fill
          className="object-cover"
        />
      </div>

      {/* Card Content */}
      <CardContent className="flex flex-col items-center space-y-0 text-center">
        <div className="py-2">
          {currentTab === 'all' ? renderTypeBadge(model) : null}
        </div>

        {/* Vehicle Details */}
        <CardTitle>{model.modelName}</CardTitle>
        <div className="text-md text-muted-foreground py-1">
          <span>By</span>
          <span className="font-semibold ml-1">{model.manufacturer}</span>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-4 items-center text-sm mt-3 w-full">
          <div>
            <span className="block text-muted-foreground">Seats</span>
            <span>{model.numberSeats}</span>
          </div>

          <div>
            <span className="block text-muted-foreground">Fuel</span>
            <span>{model.fuelType}</span>
          </div>
        </div>
      </CardContent>

      {/* Footer Metadata */}
      <div className="border-t mt-1 py-2 text-xs  flex flex-col px-4 ">
        <div className="flex justify-between text-muted-foreground">
          <span>Added On</span>
          <span>Last Updated On</span>
        </div>
        <div className="flex justify-between">
          <span>{format(model.auditInfo.createdOn, 'Pp')}</span>
          <span className="text-end">
            {format(model.auditInfo.updatedOn, 'Pp')}
          </span>
        </div>
      </div>
    </Card>
  );
}
