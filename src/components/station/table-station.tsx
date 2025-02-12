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
  usePathname,
  useRouter,
  useSearchParams
} from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { PAGE_OFFSET } from '@/lib/utils';
import { Station } from '@/lib/models/station';
import { StationGridItem, StationTableItem } from './item-station';

export interface PropsStations {
  stations: Station[];
  offset: number;
  totalStations: number;
  viewOnMapAction: (lat: number, lon: number) => void;
  deleteAction: (id: string) => void;
  detailsAction: (id: string) => void,
}

export function stationTableSortingOptions() {
  // Default options for 'all' tab
  const defaultOptions = [
    { displayName: 'Statio Name', fieldName: 'name' },
    { displayName: 'Chief Name', fieldName: 'chief.name' },
    { displayName: 'Chief Email', fieldName: 'chief.email' },
    { displayName: 'Address', fieldName: 'address' },
    { displayName: 'Created On', fieldName: 'createdOn' }
  ];

  // Combine the default options with the additional ones
  return defaultOptions
}

function Pagination({
  offset,
  totalStations
}: {
  offset: number;
  totalStations: number;
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
  const end = Math.min(offset + PAGE_OFFSET, totalStations);

  // console.log(`Offset: ${offset}`);

  return (
    <CardFooter>
      <form className="flex items-center w-full justify-between">
        <div className="text-xs text-muted-foreground">
          Showing{' '}
          <strong>
            {start}-{end}
          </strong>{' '}
          of <strong>{totalStations}</strong> stations
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
            disabled={offset + PAGE_OFFSET >= totalStations} // Disable next button when on the last page
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </CardFooter>
  );
}

export function TableStations({
  stations,
  offset,
  totalStations,
  viewOnMapAction: viewOnMap, deleteAction, detailsAction: detailsAction
}: PropsStations) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stations</CardTitle>
        <CardDescription>
          Physical component of your agency.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span>Entrance Photo</span>
              </TableHead>
              <TableHead>Station Name</TableHead>
              <TableHead>Chief's Name</TableHead>
              <TableHead>Chief's Email</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Created On</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stations.map((station) => (
              <StationTableItem
                viewOnMap={viewOnMap}
                key={station.id}
                station={station} deleteAction={deleteAction} detailsAction={detailsAction} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <Pagination offset={offset} totalStations={totalStations} />
    </Card>
  );
}

export function GridStations({
  stations,
  offset,
  totalStations,
  viewOnMapAction: viewOnMap, deleteAction, detailsAction: detailsAction
}: PropsStations) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stations</CardTitle>
        <CardDescription>
          Physical component of your agency.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {stations.map((station) => (
            <StationGridItem
              viewOnMap={viewOnMap}
              key={station.id}
              station={station}
              deleteAction={deleteAction} detailsAction={detailsAction}
            />
          ))}
        </div>
      </CardContent>
      <Pagination offset={offset} totalStations={totalStations} />
    </Card>
  );
}
