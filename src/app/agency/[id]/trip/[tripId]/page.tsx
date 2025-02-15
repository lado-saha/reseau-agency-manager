'use server';

import { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import { TripRepository } from '@/lib/repo/trip-repo';
import { Trip } from '@/lib/models/trip';
import { TripDetailView } from '@/components/trip/details-trip';
import Loading from '@/app/agency/loading';

type Params = Promise<{ tripId: string; id: string }>;

export default async function Page({ params }: { params: Params }) {
  const { id, tripId } = await params;
  const repo = new TripRepository();
  let original: Trip | undefined;
  const isNew = tripId === 'new';
  const session = await auth(); // Implement this function

  // session?.user?.id
  if (!session || !session?.user?.id) {
    redirect('/auth/login'); // Redirect unauthorized users
  }
  const userId = session.user?.id!!;

  if (isNew) {
    return (
      <TripDetailView
        originalTrip={undefined}
        adminId={userId}
        agencyId={id}
      />
    );
  }

  original = await repo.getById(tripId);
  
  if (original === undefined) {
    return notFound();
  }
  // const role: AgencyRoles | undefined =
  //   userId === original.
  //     ? 'owner'
  //     : (original.adminIds && original.adminIds.includes(userId))
  //       ? 'admin'
  //       : undefined;

  // if (!role) {
  //   redirect('/403');
  // }

  // Fetch vehicles data from the repository
  return (
  
    <Suspense
      fallback={
        <Loading
          // key={originalModel}
          className="flex flex-col items-center justify-center gap-2 h-fit"
          variant="inline"
          message="Fetching Trip ..."
        />
      }
    >
      <TripDetailView
        originalTrip={original}
        agencyId={id}
        adminId={userId}
      />
    </Suspense>
  );
}

