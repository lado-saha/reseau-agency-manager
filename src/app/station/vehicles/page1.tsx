// //  import { VehicleRepository } from '@/lib/repo/json-repository';
//  import { Vehicle } from '@/lib/models/resource';
//  import { SortingDirection } from '@/lib/models/helpers';
//  import { Suspense } from 'react';
//  import Loading from '../../agency/loading';
//  import { Metadata } from 'next';
//  import VehicleListView from '@/components/vehicle/list-vehicles';
//  import { PAGE_OFFSET } from '@/lib/utils';
//  export const metadata: Metadata = {
//    title: 'Station | Fleet'
//  };

//  export default async function Page(props: {
//    searchParams: Promise<{
//      query: string;
//      page: string;
//      dateRange: string;
//      dateSingle: string;
//      sortBy: string;
//      direction: SortingDirection;
//    }>;
//  }) {
//    const repo = new VehicleRepository();
//    const urlParams = await props.searchParams;

//    const search = urlParams?.query || '';
//    const page = Math.max(Number(urlParams?.page || 1), 1); // Ensure page starts from 1 (not zero)
//    const sortingDirection: SortingDirection = urlParams?.direction || 'asc';
//    const sortingOption = urlParams?.sortBy || '';
//    const dateSingle = Number(urlParams?.dateSingle ?? 0);
//    const dateRange = parseDateRange(urlParams?.dateRange);
//    // Calculate the offset for pagination
//    const offset = Math.max((page - 1) * PAGE_OFFSET, 0);

//    // console.log('Search Parameters:', {
//    //   search: `search=${search}`,
//    //   page: `page=${page}`,
//    //   sortingDirection: `sortingDirection=${sortingDirection}`,
//    //   sortingOption: `sortingOption=${sortingOption}`,
//    //   dateSingle: `dateSingle=${dateSingle}`,
//    //   dateRange: `dateRange=${JSON.stringify(dateRange)}`,
//    //   offset: `offset=${offset}`
//    // });

//    // console.log(`Search Parameters: ${..urlParams}`);
//    // Improved date range parser
//    function parseDateRange(
//      dateRangeStr?: string
//    ): { from: number; to?: number } | undefined {
//      if (!dateRangeStr) return undefined;

//      const parts = dateRangeStr.split('-');
//      if (parts.length === 2) {
//        return {
//          from: Number(parts[0]),
//          to: Number(parts[1])
//        };
//      } else if (parts.length === 1) {
//        return {
//          from: Number(parts[0]),
//          to: undefined
//        };
//      }

//      return undefined;
//    }

//    // Fetch vehicles data from the repository
//    const {
//      items: vehicles,
//      newOffset,
//      totalCount
//    } = await repo.getAll(
//      search,
//      offset,
//      sortingOption as keyof Vehicle,
//      sortingDirection
//      // dateSingle,
//      // dateRange
//    );
//    // console.log(`Search Parameters: ${urlParams}`);
//    return (
//      <Suspense
//        fallback={
//          <Loading
//            className="py-64"
//            variant="card"
//            message="Fetching vehicles..."
//          />
//        }
//      >
//        <VehicleListView
//          vehicles={vehicles}
//          offset={newOffset}
//          totalVehicles={totalCount}
//          sortDirection={sortingDirection}
//          sortOption={sortingOption}
//        />
//      </Suspense>
//    );
//  }
