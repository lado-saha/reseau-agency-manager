import Image from 'next/image';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Check,
  MoreHorizontal,
  MoreVertical
} from 'lucide-react'; import { TableCell, TableRow } from '@/components/ui/table'; import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardTitle
} from '@/components/ui/card';
import { Station } from '@/lib/models/station';
import { User } from '@/lib/models/user';
import { formatAddress, PlaceAddress } from '@/lib/repo/osm-place-repo';
import { DeleteDialog } from '../dialogs/dialog-delete';
import { SearchItemProps } from '@/lib/utils';

interface StationItemProps {
  station: Station;
  viewOnMap: (lat: number, lon: number) => void;
  deleteAction: (id: string) => void;
  detailsAction: (id: string) => void,
}

export function StationTableItem({
  station,
  viewOnMap, deleteAction, detailsAction
}: StationItemProps) {
  return (
    <TableRow>
      {/* Station Image */}
      <TableCell className="hidden sm:table-cell">
        <Image
          alt="Station image"
          className="aspect-square rounded-md object-cover cursor-pointer"
          height="64"
          src={station.entrancePhoto as string || '/placeholder.svg'}
          width="64"
          onClick={(e) => {
            e.preventDefault();
            window.open(station.entrancePhoto as string, '_blank');
          }}
        />
      </TableCell>

      {/* Station Details */}
      <TableCell className="font-medium">{station.name}</TableCell>
      <TableCell>{(station.chief as User).name}</TableCell>
      <TableCell>{(station.chief as User).email}</TableCell>
      <TableCell>{(formatAddress(station.address as PlaceAddress))}</TableCell>
      <TableCell>{format(station.createdOn, 'PP')}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          {DropdownMenuStation({ station, viewOnMap, deleteAction, detailsAction })}
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

function DropdownMenuStation({
  station,
  viewOnMap,
  deleteAction,
  detailsAction
}: StationItemProps
) {
  return (
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem className="cursor-pointer h-8 my-1" onClick={() =>
        viewOnMap(
          (station.address as PlaceAddress).latitude,
          (station.address as PlaceAddress).longitude
        )
      }>
        <span className='w-full h-full text-start my-2'>See on Map</span>
      </DropdownMenuItem>
      <DropdownMenuItem className='cursor-pointer h-8 my-1' onClick={() =>
        detailsAction(station.id)
      }>

        <span className='w-full h-full text-start my-2'>Details</span>
      </DropdownMenuItem>
      <DeleteDialog
        title="DANGER!!!! Archive Station"
        triggerText='Archive'
        description={`Are you sure you want to station the station ${station.name}? This action can be undone later.`}
        onDeleteAction={() => {
          deleteAction(station.id);
        }} mode='archive'
      />
    </DropdownMenuContent>
  )
}

export function StationGridItem({
  station,
  viewOnMap,
  deleteAction,
  detailsAction
}: StationItemProps) {
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
        {DropdownMenuStation({ station, viewOnMap, deleteAction, detailsAction })}
      </DropdownMenu>

      {/* Station Image */}
      <div className="relative w-full h-48">
        <Image
          src={station.entrancePhoto as string || '/placeholder.svg'}
          alt="Station Entrance photo"
          fill
          className="object-cover cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            window.open(station.entrancePhoto as string, '_blank');
          }}
        />
      </div>

      {/* Card Content */}
      <CardContent className="flex flex-col items-center space-y-1 text-center">
        <CardTitle className='py-2'>{station.name}</CardTitle>
        <div className="text-md text-muted-foreground py-2">{formatAddress(station.address as PlaceAddress)}</div>

        <div className="grid grid-cols-2 gap-4 items-center text-sm mt-3 w-full">
          <div>
            <span className="block text-muted-foreground">Chief Name</span>
            <span>{(station.chief as User).name}</span>
          </div>
          <div>
            <span className="block text-muted-foreground">Chief Email</span>
            <span>{(station.chief as User).email}</span>
          </div>
        </div>
      </CardContent>

      {/* Footer Metadata */}
      <div className="border-t mt-1 py-1 text-xs  flex flex-col px-4 ">
        <div className="flex justify-between text-muted-foreground">
          <span>Created On</span>
          <span>Last Updated On</span>
        </div>
        <div className="flex justify-between">
          <span>{format(station.createdOn, 'PP')}</span>
          <span className="text-end">
            {format(station.updatedOn, 'Pp')}
          </span>
        </div>
      </div>
    </Card>
  );
}



export function StationSearchItem({
  item,
  isPhotoVisible = true,
  isSelected,
  onCheckedChange,
}: { isPhotoVisible: boolean } & SearchItemProps<Station>) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 border",
        isSelected && "border-2 border-primary"
      )}
      onClick={() => onCheckedChange(!isSelected)}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 z-10 bg-primary rounded-full p-1">
          <Check className="h-5 w-5 text-white" />
        </div>
      )}

      {/* Station Image */}

      {isPhotoVisible && (
        <div className="relative w-full h-48">
          <Image
            src={item.entrancePhoto?.toString() ?? "/placeholder.svg"}
            alt="Station Entrance photo"
            fill
            className="object-cover cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              if (item.entrancePhoto) {
                window.open(item.entrancePhoto.toString(), "_blank");
              }
            }}
          />
        </div>
      )}

      {/* Card Content */}
      <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
        <CardTitle className="text-lg font-semibold">{item.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{item.address ? formatAddress(item.address as PlaceAddress):'None'}</p>

        <div className="grid grid-cols-2 gap-4 text-sm w-full border-t pt-3">
          <span className="text-muted-foreground">Chief Name</span>
          <span className="font-medium">{(item.chief as User).name}</span>
        </div>
      </CardContent>
    </Card>
  );
}
export function StationMapTooltip({ station, deleteAction, detailsAction }: StationItemProps) {
  return (
    <Card className="flex flex-col items-center text-center stroke-none border-none p-1">
      <span className="text-sm">{station.name}</span>
      <div className="text-sm text-muted-foreground">{(station.chief as User).name}</div>
      {/* <div className="text-sm text-muted-foreground">{formatAddress(station.address as PlaceAddress)}</div> */}
    </Card>
  );
}
