'use server';
import { AgencyRepository } from '@/lib/repo/agency-repo';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { AgencyDetailView } from '@/components/agency/details-agency';
import Loading from '../../loading';
import { AgencyProfile } from '@/lib/models/agency';

type Params = Promise<{ id: string }>;

export default async function Page({ params }: { params: Params }) {
  const { id } = await params;
  const repo = new AgencyRepository();
  let originalModel: AgencyProfile | undefined;
  const isNew = id === 'new';

  if (!isNew) {
    if (originalModel === undefined) {
      return notFound();
    }
  } else {
    originalModel = await repo.getById(id);

    return <AgencyDetailView originalAgency={originalModel} />;
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
      <AgencyDetailView originalAgency={originalModel} />
    </Suspense>
  );
}
