import { SortingDirection } from '@/lib/models/helpers';
import { Suspense } from 'react';
import { Metadata } from 'next';
import { PAGE_OFFSET } from '@/lib/utils';
import { VehicleModelRepository } from '@/lib/repo/vechicle-model-repo';
import Loading from '@/app/agency/loading';
import VehicleModelList from '@/components/vehicle/list-vehicle-models';

export const metadata: Metadata = {
  title: 'Agency | Vehicle Models'
};

export default async function Page(props: {
  searchParams: Promise<{
    query: string;
    page: string;
    sortBy: string;
    direction: SortingDirection;
  }>;
}) {
  const repo = new VehicleModelRepository();
  const urlParams = await props.searchParams;

  const search = urlParams?.query || '';
  const page = Math.max(Number(urlParams?.page || 1), 1); // Ensure page starts from 1 (not zero)
  const sortingDirection: SortingDirection = urlParams?.direction || 'asc';
  const sortingOption = urlParams?.sortBy || '';
  const offset = Math.max((page - 1) * PAGE_OFFSET, 0);

  // Fetch employees data from the repository
  const {
    items: models,
    newOffset,
    totalCount
  } = await repo.getAll(search, offset, sortingOption, sortingDirection);
  return (
    <Suspense
      fallback={
        <Loading
          className="py-64"
          variant="card"
          message="Fetching models..."
        />
      }
    >
      <VehicleModelList
        models={models}
        offset={newOffset}
        totalModels={totalCount}
        sortDirection={sortingDirection}
        sortOption={sortingOption}
      />
    </Suspense>
  );
}


