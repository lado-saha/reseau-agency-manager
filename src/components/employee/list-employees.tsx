// export default ListView()
'use client';

import { useState, useMemo, SetStateAction, ComponentType } from 'react';
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
  MapPinIcon,
  LayoutGrid,
  ParkingCircleIcon,
  ArrowDownCircle,
  ArrowUpCircle,
  SortAscIcon,
  SortDescIcon,
  MapPinned,
  PlusIcon
} from 'lucide-react';
import {
  TableEmployees,
  GridEmployees,
  employeeTableSortingOptions,
  PropsEmployees
} from '@/components/employee/table-employees';
import { Employee, EmployeeRole, getRoleLabel } from '@/lib/models/employee';
import {
  SortingDirection,
  TabsEmployee as TabsEmployee
} from '@/lib/models/helpers';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { roleIcons } from './item-employee';
import { deleteEmployee } from '@/lib/actions';

export default function EmployeeListView<T extends EmployeeRole>({
  employees,
  offset,
  totalEmployees,
  sortDirection,
  sortOption,
  roles
}: {
  employees: Employee<T>[];
  offset: number;
  totalEmployees: number;
  sortDirection: SortingDirection;
  sortOption: string;
  roles: T[];
}) {
  const [currentView, setCurrentView] = useState<'tableview' | 'gridview'>(
    'tableview'
  );
  const [tab, setTab] = useState<TabsEmployee<T>>('all');
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

  function navToDetailView(id: string): void {
    router.push(`${pathname}/${id}`);
  }

  function handleNewClick(): void {
    navToDetailView('new')
  }

  return (
    <Tabs
      defaultValue={tab}
      orientation='vertical'
      onValueChange={(value) => setTab(value as TabsEmployee<T>)}
    >
      {/* Tabs for filtering */}
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all" className="items-center ">
            <span>All</span>
          </TabsTrigger>
          {roles.map((role) => (
            <TabsTrigger key={role} value={role} className="items-center ">
              {roleIcons[role] && (
                <span className="mr-0">{roleIcons[role]}</span>
              )}
              <span className='hidden md:inline'>{getRoleLabel(role)}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" className="h-8 gap-1" onClick={handleNewClick}>
            <PlusIcon className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Add Employee</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="h-8 gap-1">
                {sortDirection == 'asc' ? (
                  <SortAscIcon className="h-3.5 w-3.5" />
                ) : (
                  <SortDescIcon className="h-3.5 w-3.5" />
                )}
                <span className="hidden md:inline">Sort</span>
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
              {employeeTableSortingOptions(tab).map((option) => (
                <DropdownMenuItem
                  key={option.fieldName}
                  onClick={() => {
                    // setSortingOption(option.fieldName);
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
                    <span className="hidden md:inline">Table View</span>
                  </>
                )}
                {currentView === 'gridview' && (
                  <>
                    <LayoutGrid className="h-3.5 w-3.5" />
                    <span className="hidden md:inline">Grid View</span>
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
          <TableEmployees
            employees={
              tab !== 'all'
                ? employees.filter((emp) => emp.role === tab)
                : employees
            }
            totalEmployees={totalEmployees}
            offset={offset}
            currentTab={tab}
            navToDetails={navToDetailView}
            deleteAction={() => { }}
          />
        ) : (
          <GridEmployees
            employees={
              tab !== 'all'
                ? employees.filter((emp) => emp.role === tab)
                : employees
            }
            totalEmployees={totalEmployees}
            offset={offset}
            currentTab={tab}
            navToDetails={navToDetailView}
            deleteAction={() => { }}
          />
        )}
      </TabsContent>
    </Tabs >
  );
}
