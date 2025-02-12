'use server';

import { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import Loading from '@/app/agency/loading';
import { VehicleModelRepository } from '@/lib/repo/vechicle-model-repo';
import { VehicleModelDetailView } from '@/components/vehicle/details-vehicle-model';
import { VehicleModel } from '@/lib/models/resource';

type Params = Promise<{ modelId: string; id: string }>;

export default async function Page({ params }: { params: Params }) {
  const { id,  modelId } = await params;
  const repo = new VehicleModelRepository();
  let original: VehicleModel | undefined;
  const isNew = modelId === 'new';
  const session = await auth(); // Implement this function

  // session?.user?.id
  if (!session || !session?.user?.id) {
    redirect('/auth/login'); // Redirect unauthorized users
  }
  const userId = session.user?.id!!;

  if (isNew) {
    return (
      <VehicleModelDetailView
        originalModel={undefined}
        adminId={userId}
        agencyId={id}
        id = {modelId}
      />
    );
  }

  original = await repo.getById(modelId);
  
  if (original === undefined) {
    return notFound();
  }
  // Fetch vehicles data from the repository
  return (
  
    <Suspense
      fallback={
        <Loading
          // key={originalModel}
          className="flex flex-col items-center justify-center gap-2 h-fit"
          variant="inline"
          message="Fetching Vehicle Models ..."
        />
      }
    >
      <VehicleModelDetailView
        originalModel={original}
        agencyId={id}
        adminId={userId}
        id ={modelId}
      />
    </Suspense>
  );
}

