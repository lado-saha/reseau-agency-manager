'use server';

import { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import Loading from '@/app/agency/loading';
import { Vehicle } from '@/lib/models/resource';
import { VehicleDetailView } from '@/components/vehicle/details-vehicle';
import { VehicleRepository } from '@/lib/repo/vehicle-repo';

type Params = Promise<{ vehicleId: string; id: string }>;

export default async function Page({ params }: { params: Params }) {
  const { id,  vehicleId } = await params;
  const repo = new VehicleRepository();
  // let original: Vehicle | undefined;
  const isNew = vehicleId === 'new';
  const session = await auth(); // Implement this function

  // session?.user?.id
  if (!session || !session?.user?.id) {
    redirect('/auth/login'); // Redirect unauthorized users
  }
  const userId = session.user?.id!;

  if (isNew) {
    return (
      <VehicleDetailView
        originalVehicle={undefined}
        adminId={userId}
        agencyId={id}
        id = {vehicleId}
      />
    );
  }

  const original = await repo.getById(vehicleId);
  
  if (original === undefined) {
    return notFound();
  }
  // Fetch vehicles data from the repository
  return (
  
    <Suspense
      fallback={
        <Loading
          className="flex flex-col items-center justify-center gap-2 h-fit"
          variant="inline"
          message="Fetching Vehicle  ..."
        />
      }
    >
      <VehicleDetailView
        originalVehicle={original}
        agencyId={id}
        adminId={userId}
        id ={vehicleId}
      />
    </Suspense>
  );
}

