import { SortingDirection, TabsEmployee } from '@/lib/models/helpers';
import { Suspense } from 'react';
import { Metadata } from 'next';
import { PAGE_OFFSET } from '@/lib/utils';
import { AgencyEmployeeRepository } from '@/lib/repo/employee-repo';
import EmployeeListView from '@/components/employee/list-employees';
import Loading from '../../loading';
import {
  AgencyEmployee,
  AgencyEmployeeRole,
} from '@/lib/models/employee';

export const metadata: Metadata = {
  title: 'Station | Employees'
};

export default async function Page(props: {
  searchParams: Promise<{
    query: string;
    page: string;
    sortBy: string;
    tabF: keyof AgencyEmployee;
    tabV: TabsEmployee<AgencyEmployeeRole>;
    direction: SortingDirection;
  }>;
}) {
  const repo = new AgencyEmployeeRepository();
  const urlParams = await props.searchParams;

  const search = urlParams?.query || '';
  const page = Math.max(Number(urlParams?.page || 1), 1); // Ensure page starts from 1 (not zero)
  const sortingDirection: SortingDirection = urlParams?.direction || 'asc';
  const sortingOption = urlParams?.sortBy || '';
  const offset = Math.max((page - 1) * PAGE_OFFSET, 0);

  // Fetch employees data from the repository
  const {
    items: employees,
    newOffset,
    totalCount
  } = await repo.getAll(search, offset, sortingOption, sortingDirection);
  // console.log(`Search Parameters: ${urlParams}`);
  return (
    <Suspense
      fallback={
        <Loading
          className="py-64"
          variant="card"
          message="Fetching employees..."
        />
      }
    >
      <EmployeeListView
        employees={employees}
        offset={newOffset}
        totalEmployees={totalCount}
        sortDirection={sortingDirection}
        sortOption={sortingOption}
        roles={['driver', 'manager', 'owner', 'station-chief', 'other']}
      />
    </Suspense>
  );
}
