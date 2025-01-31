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
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VehicleModel } from '@/lib/models/resource';
import { TabsVehicleModel } from '@/lib/models/helpers';
import { PAGE_OFFSET } from '@/lib/utils';
import {
  VehicleModelGridItem,
  VehicleModelTableItem
} from '@/components/vehicles/item-vehicle-model';

export interface PropsVehicleModels {
  models: VehicleModel[];
  offset: number;
  totalModels: number;
  currentTab: TabsVehicleModel;
}

// export const columns: ColumnDef<Payment>[] = []

export function vehicleModelSortingOptions(currentTab: string) {
  // Default options for 'all' tab
  const defaultOptions = [
    { displayName: 'Name', fieldName: 'modelName' },
    { displayName: 'Seat Count', fieldName: 'numberSeats' },
    { display: 'Type', fieldname: 'type' },
    { displayName: 'Manufacturer', fieldName: 'manufacturer' },
    { displayName: 'Fuel Type', fieldName: 'fuelType' },
    { displayName: 'Added On', fieldName: 'auditInfo.addedOn' },
    { displayName: 'Updated On', fieldName: 'auditInfo.updatedOn' }
  ];

  // Additional options for specific tabs
  return defaultOptions;
}

function Pagination({
  offset,
  totalModels
}: {
  offset: number;
  totalModels: number;
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
  const end = Math.min(offset + PAGE_OFFSET, totalModels);

  return (
    <CardFooter>
      <form className="flex items-center w-full justify-between">
        <div className="text-xs text-muted-foreground">
          Showing{' '}
          <strong>
            {start}-{end}
          </strong>{' '}
          of <strong>{totalModels}</strong> vehicles
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
            disabled={offset + PAGE_OFFSET >= totalModels} // Disable next button when on the last page
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
export function TableVehicleModels({
  models,
  offset,
  totalModels,
  currentTab
}: PropsVehicleModels) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Models</CardTitle>
        <CardDescription>
          Add reusable models for your vehicles.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span>Image</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Seat Count</TableHead>
              {currentTab === 'all' && <TableHead>Type</TableHead>}
              <TableHead>Manufacturer</TableHead>
              <TableHead>Fuel Type</TableHead>
              <TableHead>
                <span className="italic">Added On</span>
              </TableHead>
              <TableHead>
                <span className="italic">Updated On</span>
              </TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {models.map((model) => (
              <VehicleModelTableItem
                key={model.id}
                model={model}
                currentTab={currentTab}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <Pagination offset={offset} totalModels={totalModels} />
    </Card>
  );
}

export function GridVehicleModels({
  models,
  offset,
  totalModels,
  currentTab
}: PropsVehicleModels) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Models</CardTitle>
        <CardDescription>
          Add reusable models for your vehicles.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {models.map((model) => (
            <VehicleModelGridItem
              key={model.id}
              model={model}
              currentTab={currentTab}
            />
          ))}
        </div>
      </CardContent>
      <Pagination offset={offset} totalModels={totalModels} />
    </Card>
  );
}
