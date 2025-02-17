import { SortingDirection } from '@/lib/models/helpers';
import { Suspense } from 'react';
import { Metadata } from 'next';
import { PAGE_OFFSET } from '@/lib/utils';
import Loading from '../../loading';
import { StationRepository } from '@/lib/repo/station-repo';
import StationListView from '@/components/station/list-station';
import { VehicleRepository } from '@/lib/repo/vehicle-repo';
import VehicleListView from '@/components/vehicle/list-vehicles';

export const metadata: Metadata = {
  title: 'Agency | Vehicles'
};

export default async function Page(props: {
  searchParams: Promise<{
    query: string;
    page: string;
    sortBy: string;
    direction: SortingDirection;
  }>;
}) {
  const repo = new VehicleRepository();
  const urlParams = await props.searchParams;

  const search = urlParams?.query || '';
  const page = Math.max(Number(urlParams?.page || 1), 1); // Ensure page starts from 1 (not zero)
  const sortingDirection: SortingDirection = urlParams?.direction || 'asc';
  const sortingOption = urlParams?.sortBy || '';
  const offset = Math.max((page - 1) * PAGE_OFFSET, 0);

  // Fetch employees data from the repository
  const {
    items: vehicles,
    newOffset,
    totalCount
  } = await repo.getAll(search, offset, sortingOption, sortingDirection);
  // console.log(`Search Parameters: ${JSON.stringify(stations[0])}`);
  return (
    <Suspense
      fallback={
        <Loading
          className="py-64"
          variant="card"
          message="Fetching vehicles..."
        />
      }
    >
      {/* <VehicleListView
        stations={vehicles}
        offset={newOffset}
        totalStations={totalCount}
        sortDirection={sortingDirection}
        sortOption={sortingOption}
      /> */}
    </Suspense>
  );
}
