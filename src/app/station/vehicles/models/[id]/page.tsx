import { JsonRepository } from '@/lib/repository/JsonRepository';
import { VehicleModel } from '@/lib/models/resource';
import { SortingDirection } from '@/lib/models/helpers';
import { Suspense } from 'react';
import { Metadata } from 'next';
import { PAGE_OFFSET } from '@/lib/utils';
import Loading from '../../../loading';
import VehicleModelList from '@/components/vehicles/vehicle-model-list';
import { notFound } from 'next/navigation';
import { VehicleModelDetailView } from '@/components/vehicles/details-vehicle-model';
export const metadata: Metadata = {
  title: 'Station | Vehicle Models'
};

export default async function Page({ params }: { params: { id: string } }) {
  const repo = new JsonRepository<VehicleModel>('vehicles-model.json');
  let originalModel: VehicleModel | undefined;
  const isNew = params.id === 'new';

  if (!isNew) {
    originalModel = await repo.getVehicleModelById(params.id);
    if (originalModel === undefined) {
      return notFound();
    }
  } else {
    return <VehicleModelDetailView originalModel={originalModel} />;
  }

  // Fetch vehicles data from the repository
  return (
    <Suspense
      fallback={
        <Loading
          className="flex h-full flex-col items-center justify-center gap-2"
          variant="card"
          message="Fetching vehicle Model..."
        />
      }
    >
      <VehicleModelDetailView originalModel={originalModel} />
    </Suspense>
  );
}
