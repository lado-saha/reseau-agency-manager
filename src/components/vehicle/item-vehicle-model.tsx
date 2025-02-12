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
  BusIcon,
  CarTaxiFront,
  MoreHorizontal,
  MoreVertical
} from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { TabsVehicleModel } from '@/lib/models/helpers';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { VehicleModel } from '@/lib/models/resource';
import { DeleteDialog } from '../dialogs/dialog-delete';

interface VehicleModelItemProps {
  model: VehicleModel;
  tab: TabsVehicleModel;
  archiveAction: (id: string) => void;
  detailsAction: (id: string) => void,
}

/** Bus or Car */
function renderTypeBadge(model: VehicleModel) {
  return (
    <Badge variant="default" className="items-center bg-gray-500 text-white">
      {model.seatCount < 8 ? (
        <>
          <CarTaxiFront className="mr-2 h-4 w-4" />
          <span className="text-sm">Car</span>
        </>
      ) : model.seatCount < 50 ? (
        <>
          <BusFrontIcon className="mr-2 h-4 w-4" />
          <span className="text-sm">Coaster</span>
        </>
      ) : (
        <>
          <BusIcon className="mr-2 h-4 w-4" />
          <span className="text-sm">Bus</span>
        </>
      )}
    </Badge>
  );
}

export function VehicleModelTableItem({
  model,
  tab,
  archiveAction, detailsAction
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
      <TableCell className="font-medium">{model.name}</TableCell>
      <TableCell>{model.seatCount}</TableCell>
      {tab === 'all' && <TableCell>{renderTypeBadge(model)}</TableCell>}
      <TableCell>{model.fuelType}</TableCell>
      <TableCell>{model.luggageSpace}</TableCell>
      <TableCell>{format(model.createdOn, 'PP')}</TableCell>

      {/* Action Menu */}
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          {DropdownMenuVehicleModel({model, detailsAction, tab, archiveAction})}
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

function DropdownMenuVehicleModel({ model, detailsAction, tab, archiveAction }: VehicleModelItemProps) {
  return (
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem className='cursor-pointer h-8 my-1' onClick={() =>
        detailsAction(model.id)
      }>
        <span className='w-full h-full text-start my-2'>View Details</span>
      </DropdownMenuItem>

      <DeleteDialog
        title="DANGER!!!! Archive Vehicle Model"
        triggerText='Archive'
        description={`Are you sure you want to archive the vehicle model: ${model.name}? This action can be undone later, yet all vehicles of this model will be archived too and no booking will be possible on them`}
        onDeleteAction={() => {
          archiveAction(model.id);
        }} mode='archive'
      />

    </DropdownMenuContent>
  );
}

export function VehicleModelGridItem({
  model,
  tab, detailsAction, archiveAction
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
        {DropdownMenuVehicleModel({model, detailsAction, tab, archiveAction})}
      </DropdownMenu>

      {/* Vehicle Image */}
      <div className="relative w-full h-32">
        <Image
          src={'' || '/placeholder.svg'}
          alt="Vehicle Model image"
          fill
          className="object-cover"
        />
      </div>

      {/* Card Content */}
      <CardContent className="flex flex-col items-center space-y-0 text-center">
        <div className="py-2">
          {tab === 'all' ? renderTypeBadge(model) : null}
        </div>

        {/* Vehicle Details */}
        <CardTitle>{model.name}</CardTitle>
        <div className="text-md text-muted-foreground py-1">
          <span className="font-semibold ml-1">{model.seatCount} Seats</span>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-4 items-center text-sm mt-3 w-full">
          <div>
            <span className="block text-muted-foreground">Luggage</span>
            <span>{model.luggageSpace}</span>
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
          <span>Created On</span>
          <span>Last Updated On</span>
        </div>
        <div className="flex justify-between">
          <span>{format(model.createdOn, 'PP')}</span>
          <span className="text-end">
            {format(model.updatedOn, 'Pp')}
          </span>
        </div>
      </div>
    </Card>
  );
}
