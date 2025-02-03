import { JsonRepository } from '@/lib/repository/JsonRepository';
import { VehicleModel } from '@/lib/models/resource';
import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AgencyDetailView } from '@/components/agency/details-agency';
import Loading from '../../loading';
import { AgencyProfile } from '@/lib/models/agency';
export const metadata: Metadata = {
  title: 'Station | Vehicle Models'
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const repo = new JsonRepository<VehicleModel>('agency.json');
  let originalModel: AgencyProfile | undefined;
  const isNew = params.id === 'new';

  if (!isNew) {
    originalModel = await repo.getAgencyById(params.id);
    if (originalModel === undefined) {
      return notFound();
    }
  } else {
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
