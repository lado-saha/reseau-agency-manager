// export default ListView()
'use client';

import { useState, SetStateAction } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  TableIcon,
  LayoutGrid,
  ParkingCircleIcon,
  ArrowDownCircle,
  SortAscIcon,
  SortDescIcon,
  CarTaxiFront,
  BusFront,
  PlusIcon
} from 'lucide-react';
import {
  GridVehicleModels,
  TableVehicleModels,
  vehicleModelSortingOptions
} from '@/components/vehicles/table-vehicle-models';
import { VehicleModel } from '@/lib/models/resource';
import { SortingDirection, TabsVehicleModel } from '@/lib/models/helpers';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function VehicleModelList({
  models,
  offset,
  totalModels,
  sortDirection,
  sortOption
}: {
  models: VehicleModel[];
  offset: number;
  totalModels: number;
  sortDirection: SortingDirection;
  sortOption: string;
}) {
  const [currentView, setCurrentView] = useState<'tableview' | 'gridview'>(
    'tableview'
  );
  const [tab, setTab] = useState<TabsVehicleModel>('all');
  // Sorting
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSortDirectionChange = (
    sortingDirection: SortingDirection = sortDirection
  ) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    // params.set('sortBy', sortingOption);
    params.set('direction', sortingDirection);
    // params.set(paramKey, value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: true });
  };

  const handleSortOptionChange = (sortingOption: string = sortOption) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    params.set('sortBy', sortingOption);
    // params.set('direction', sortingDirection);
    // params.set(paramKey, value);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleNewClick = () => {
    router.replace(`${pathname}/new`);
  };

  return (
    <Tabs
      defaultValue={tab}
      onValueChange={(value) => setTab(value as TabsVehicleModel)}
    >
      {/* Tabs for filtering */}
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all" className="items-center ">
            <span>All</span>
          </TabsTrigger>

          <TabsTrigger value="car" className="items-center">
            <CarTaxiFront className="mx-1 w-4 h-4" />
            <span>Car</span>
          </TabsTrigger>

          <TabsTrigger value="bus" className="items-center">
            <BusFront className="mx-1 w-4 h-4" />
            <span>Bus</span>
          </TabsTrigger>
        </TabsList>

        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" className="h-8 gap-1" onClick={handleNewClick}>
            <PlusIcon className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only">New Model</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="h-8 gap-1">
                {sortDirection == 'asc' ? (
                  <SortAscIcon className="h-3.5 w-3.5" />
                ) : (
                  <SortDescIcon className="h-3.5 w-3.5" />
                )}
                <span className="sr-only sm:not-sr-only">Sort</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* Sorting Options */}
              <DropdownMenuItem
                onClick={() => {
                  handleSortDirectionChange('asc');
                }}
                className={
                  sortDirection === 'asc' ? 'font-bold  bg-accent' : ''
                }
              >
                <SortAscIcon className="mr-2 h-4 w-4" />
                Ascending
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  handleSortDirectionChange('desc');
                }}
                className={
                  sortDirection === 'desc' ? 'font-bold bg-accent' : ''
                }
              >
                <SortDescIcon className="mr-2 h-4 w-4" />
                Descending
              </DropdownMenuItem>

              <DropdownMenuSeparator className="mx-1" />
              {/* View Options */}
              {vehicleModelSortingOptions(tab).map((option) => (
                <DropdownMenuItem
                  key={option.fieldName}
                  onClick={() => {
                    handleSortOptionChange(option.fieldName);
                  }}
                  className={
                    sortOption === option.fieldName ? 'font-bold bg-accent' : ''
                  }
                >
                  {option.displayName}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="h-8 gap-1">
                {currentView === 'tableview' && (
                  <>
                    <TableIcon className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only">Table View</span>
                  </>
                )}

                {currentView === 'gridview' && (
                  <>
                    <LayoutGrid className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only">Grid View</span>
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setCurrentView('tableview')}>
                <TableIcon className="mr-2 h-4 w-4" />
                Table View
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setCurrentView('gridview')}>
                <LayoutGrid className="mr-2 h-4 w-4" />
                Grid View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <TabsContent value={tab}>
        {currentView === 'tableview' ? (
          <TableVehicleModels
            models={models}
            totalModels={totalModels}
            offset={offset}
            currentTab={tab}
          />
        ) : (
          <GridVehicleModels
            models={models}
            totalModels={totalModels}
            offset={offset}
            currentTab={tab}
          />
        )}
      </TabsContent>
    </Tabs>
  );
}
