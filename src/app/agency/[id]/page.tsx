'use server';
import { AgencyRepository } from '@/lib/repo/agency-repo';
import { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import { AgencyDetailView } from '@/components/agency/details-agency';
import Loading from '../loading';
import { AgencyProfile, AgencyRoles } from '@/lib/models/agency';
import { auth } from '@/auth';

type Params = Promise<{ id: string }>;

export default async function Page({ params }: { params: Params }) {
  const { id } = await params;
  const repo = new AgencyRepository();
  let originalModel: AgencyProfile | undefined;
  const isNew = id === 'new';

  const session = await auth(); // Implement this function

  // session?.user?.id
  console.log(session);

  if (!session || !session?.user?.id) {
    redirect('/auth/login'); // Redirect unauthorized users
  }
  const userId = session.user?.id!!;

  if (isNew) {
    return (
      <AgencyDetailView
        originalAgency={undefined}
        adminId={userId}
        role={'owner'}
      />
    );
  }

  originalModel = await repo.getById(id);
  if (originalModel === undefined) {
    return notFound();
  }
  const role: AgencyRoles | undefined =
    userId === originalModel.ownerId
      ? 'owner'
      : (originalModel.adminIds && originalModel.adminIds.includes(userId))
        ? 'admin'
        : undefined;

  if (!role) {
    redirect('/403');
  }

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
        originalAgency={originalModel}
        adminId={userId}
        role={role}
      />
    </Suspense>
  );
}
