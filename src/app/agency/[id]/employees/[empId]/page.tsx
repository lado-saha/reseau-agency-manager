'use server';

import Loading from '@/app/agency/loading';
import { auth } from '@/auth';
import { EmployeeDetailView } from '@/components/employee/details-employee';
import {
  AgencyEmployeeRole,
  agencyEmplRoles,
  Employee
} from '@/lib/models/employee';
import { AgencyEmployeeRepository } from '@/lib/repo/employee-repo';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';

type Params = Promise<{ empId: string; id: string; email?: string }>;
type SearchParams = Promise<{ email?: string }>


export default async function Page({ params, searchParams }: { params: Params, searchParams: SearchParams }) {
  console.log(await params)
  const { empId: id, id: agencyId } = await params;
  const { email } = await searchParams;

  const repo = new AgencyEmployeeRepository();
  let originalModel: Employee<AgencyEmployeeRole> | undefined;
  const isNew = id === 'new';
  const session = await auth();

  if (!session || !session?.user?.id) {
    redirect('/auth/login'); // Redirect unauthorized users
  }

  const userId = session.user?.id!!;

  if (isNew) {
    return (
      <EmployeeDetailView
        roles={agencyEmplRoles}
        orgId={agencyId}
        originalEmployee={undefined}
        adminId={userId}
        emailParam={email}
      />
    );
  }

  originalModel = await repo.getById(id);
  if (originalModel === undefined) {
    return notFound();
  }

  // Fetch vehicles data from the repository
  return (
    <Suspense
      fallback={
        <Loading
          className="flex flex-col items-center justify-center gap-2 h-fit"
          variant="card"
          message="Fetching Agency ..."
        />
      }
    >
      <EmployeeDetailView
        roles={agencyEmplRoles}
        originalEmployee={originalModel}
        adminId={userId}
        orgId={agencyId}
        emailParam={email}
      />
    </Suspense>
  );
}
