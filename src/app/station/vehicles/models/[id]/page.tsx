import { VehicleModelRepository } from '@/lib/repo/json-repository';
import { VehicleModel } from '@/lib/models/resource';
import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { VehicleModelDetailView } from '@/components/vehicles/details-vehicle-model';
import Loading from '@/app/agency/loading';
export const metadata: Metadata = {
  title: 'Station | Vehicle Models'
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const repo = new VehicleModelRepository();
  let originalModel: VehicleModel | undefined;
  const isNew = params.id === 'new';

  if (!isNew) {
    originalModel = await repo.getById(params.id);
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
