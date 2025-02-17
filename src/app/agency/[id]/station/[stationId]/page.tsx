'use server';

import { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import { StationRepository } from '@/lib/repo/station-repo';
import { Station } from '@/lib/models/station';
import { StationDetailView } from '@/components/station/details-station';
import Loading from '@/app/agency/loading';

type Params = Promise<{ stationId: string; id: string }>;

export default async function Page({ params }: { params: Params }) {
  const { id, stationId } = await params;
  const repo = new StationRepository();
  const isNew = stationId === 'new';
  const session = await auth(); // Implement this function

  // session?.user?.id
  if (!session || !session?.user?.id) {
    redirect('/auth/login'); // Redirect unauthorized users
  }
  const userId = session.user?.id

  if (isNew) {
    return (
      <StationDetailView
        originalStation={undefined}
        adminId={userId}
        agencyId={id}
      />
    );
  }

  const original = await repo.getById(stationId);
  
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
          message="Fetching Station ..."
        />
      }
    >
      <StationDetailView
        originalStation={original}
        agencyId={id}
        adminId={userId}
      />
    </Suspense>
  );
}

