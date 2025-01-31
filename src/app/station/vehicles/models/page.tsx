import { JsonRepository } from '@/lib/repository/JsonRepository';
import { VehicleModel } from '@/lib/models/resource';
import { SortingDirection } from '@/lib/models/helpers';
import { Suspense } from 'react';
import { Metadata } from 'next';
import { PAGE_OFFSET } from '@/lib/utils';
import Loading from '../../loading';
import VehicleModelList from '@/components/vehicles/vehicle-model-list';
export const metadata: Metadata = {
  title: 'Station | Vehicle Models'
};

export default async function Page(props: {
  searchParams: Promise<{
    query: string;
    page: string;
    sortBy: string;
    direction: SortingDirection;
  }>;
}) {
  const repo = new JsonRepository<VehicleModel>('vehicles-model.json');
  const urlParams = await props.searchParams;

  const search = urlParams?.query || '';
  const page = Math.max(Number(urlParams?.page || 1), 1); // Ensure page starts from 1 (not zero)
  const sortingDirection: SortingDirection = urlParams?.direction || 'asc';
  const sortingOption = urlParams?.sortBy || '';
  // Calculate the offset for pagination
  const offset = Math.max((page - 1) * PAGE_OFFSET, 0);

  // Improved date range parser
  function parseDateRange(
    dateRangeStr?: string
  ): { from: number; to?: number } | undefined {
    if (!dateRangeStr) return undefined;

    const parts = dateRangeStr.split('-');
    if (parts.length === 2) {
      return {
        from: Number(parts[0]),
        to: Number(parts[1])
      };
    } else if (parts.length === 1) {
      return {
        from: Number(parts[0]),
        to: undefined
      };
    }

    return undefined;
  }

  // Fetch vehicles data from the repository
  const { models, newOffset, totalProducts } = repo.getVehicleModels(
    search,
    offset,
    sortingOption as keyof VehicleModel,
    sortingDirection
  );

  return (
    <Suspense
      fallback={
        <Loading
          className="py-64"
          variant="card"
          message="Fetching vehicle models..."
        />
      }
    >
      <VehicleModelList
        models={models}
        offset={newOffset}
        totalModels={totalProducts}
        sortDirection={sortingDirection}
        sortOption={sortingOption}
      />
    </Suspense>
  );
}
