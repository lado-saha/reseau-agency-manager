'use server';
import { AgencyRepository } from '@/lib/repo/agency-repo';
import { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import { AgencyDetailView } from '@/components/agency/details-agency';
import Loading from '../loading';
import { Agency, AgencyRoles } from '@/lib/models/agency';
import { auth } from '@/auth';

type Params = Promise<{ id: string }>;

export default async function Page({ params }: { params: Params }) {
  const { id } = await params;
  const repo = new AgencyRepository();
  // let original: Agency | undefined;
  const isNew = id === 'new';

  const session = await auth(); // Implement this function

  if (!session || !session?.user?.id) {
    redirect('/auth/login'); // Redirect unauthorized users
  }
  const userId = session.user?.id;

  if (isNew) {
    return (
      <AgencyDetailView
        originalAgency={undefined}
        adminId={userId}
        role={'owner'}
      />
    );
  }

  const original = await repo.getById(id);
  if (original === undefined) {
    return notFound();
  }

  // const role: AgencyRoles | undefined = 
  // userId === original.ownerId
  //   ? 'owner'
  //   : (original.adminIds && original.adminIds.includes(userId))
  //     ? 'admin'
  //     : undefined;

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
          message="Fetching Agency ..."
        />
      }
    >
      <AgencyDetailView
        originalAgency={original}
        adminId={userId}
        role={'owner'}
      />
    </Suspense>
  );
}
