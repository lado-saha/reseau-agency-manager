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
import {
  EmployeeGridItem,
  EmployeeTableItem
} from '@/components/employee/item-employee';
import { TabsEmployee } from '@/lib/models/helpers';
import { PAGE_OFFSET } from '@/lib/utils';
import { Employee, EmployeeRole } from '@/lib/models/employee';

export interface PropsEmployees<T extends EmployeeRole> {
  employees: Employee<T>[];
  offset: number;
  totalEmployees: number;
  currentTab: TabsEmployee<T>;
  detailsAction: (id: string) => void;
  deleteAction: (id: string) => void;
}

export function employeeTableSortingOptions(currentTab: string) {
  // Default options for 'all' tab
  const defaultOptions = [
    { displayName: 'Name', fieldName: 'user.name' },
    { displayName: 'Role', fieldName: 'role' },
    { displayName: 'Sex', fieldName: 'user.sex' },
    { displayName: 'Email', fieldName: 'user.email' },
    { displayName: 'Phone', fieldName: 'user.phone' },
    { displayName: 'Recruited on', fieldName: 'addedOn' }
  ];

  // Additional options for specific tabs
  return defaultOptions;
}

function Pagination({
  offset,
  totalEmployees
}: {
  offset: number;
  totalEmployees: number;
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
  const end = Math.min(offset + PAGE_OFFSET, totalEmployees);

  // console.log(`Offset: ${offset}`);

  return (
    <CardFooter>
      <form className="flex items-center w-full justify-between">
        <div className="text-xs text-muted-foreground">
          Showing{' '}
          <strong>
            {start}-{end}
          </strong>{' '}
          of <strong>{totalEmployees}</strong> employees
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
            disabled={offset + PAGE_OFFSET >= totalEmployees} // Disable next button when on the last page
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </CardFooter>
  );
}

export function TableEmployees<T extends EmployeeRole>({
  employees,
  offset,
  totalEmployees,
  currentTab,
  detailsAction,
  deleteAction
}: PropsEmployees<T>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Employees</CardTitle>
        <CardDescription>
          Manage your fleet and monitor employee statuses.
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
              {currentTab === 'all' && <TableHead>Role</TableHead>}
              <TableHead>Sex</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Recruited On</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <EmployeeTableItem
                detailsAction={detailsAction}
                key={employee.id}
                item={employee}
                currentTab={currentTab}
                deleteAction={deleteAction}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <Pagination offset={offset} totalEmployees={totalEmployees} />
    </Card>
  );
}

export function GridEmployees<T extends EmployeeRole>({
  employees,
  offset,
  totalEmployees,
  currentTab,
  detailsAction,
  deleteAction
}: PropsEmployees<T>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Employees</CardTitle>
        <CardDescription>
          Manage your fleet and monitor employee statuses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {employees.map((employee) => (
            <EmployeeGridItem
              detailsAction={detailsAction}
              key={employee.id}
              item={employee}
              deleteAction={deleteAction}
              currentTab={currentTab}
            />
          ))}
        </div>
      </CardContent>
      <Pagination offset={offset} totalEmployees={totalEmployees} />
    </Card>
  );
}
