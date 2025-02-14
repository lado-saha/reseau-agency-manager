'use client';

import { AppSidebar } from 'src/components/app-sidebar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from 'src/components/ui/sidebar';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from 'src/components/ui/breadcrumb';
import { Separator } from 'src/components/ui/separator';
import { NavActions } from 'src/components/app-topbar-actions';
import { usePathname } from 'next/navigation';
import { SearchInput } from '@/components/search-bar';
import { useSession } from 'next-auth/react';
import Loading from './loading';
import {
  dateFilterablePathAgency,
  flattenedPathsAgency,
  searchablePathsAgency,
  URL_PATHS_AGENCY,
} from '@/lib/paths';
import { AgencyRepository } from '@/lib/repo/agency-repo';
import { Agency } from '@/lib/models/agency';
import React, { useState, useEffect, Suspense } from 'react';
import { CompassIcon } from 'lucide-react';

// Async function to fetch agency profile
async function fetchAgencyProfile(agencyId: string) {
  const agencyRepo = new AgencyRepository();
  const profile = await agencyRepo.getById(agencyId);
  return profile;
}

export default function AgencyLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // Show loading state while the session is being fetched
  if (status === 'loading') {
    return Loading({ message: 'Getting User info', variant: 'inline' });
  }

  // Extract agency ID from the URL path (assuming the path is '/agency/[id]')
  const agencyId = pathname.split('/')[2] || '';
  if (!agencyId) {
    return <div>Invalid Agency ID</div>;
  }

  const [agencyProfile, setAgencyProfile] = useState<Agency | null>(
    null
  );
  const [userRole, setUserRole] = useState<string>('none');

  useEffect(() => {
    const fetchProfile = async () => {
      const profile = await fetchAgencyProfile(agencyId);
      setAgencyProfile(profile || null);

      if (profile && session?.user?.id) {
        const role =
          session.user.id === profile.ownerId
            ? 'owner'
            : profile.adminIds.includes(session.user.id)
              ? 'admin'
              : 'none';
        setUserRole(role);
      }
    };

    fetchProfile();
  }, [agencyId, session]);

  // If no agency profile is found, show loading state
  if (!agencyProfile) {
    return <Loading message="Fetching agency profile..." variant="card" />;
  }
  const user = {
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    role: userRole,
    passwordHash: '',
    id: session?.user?.id || '',
    photo: session?.user?.photo || ''
  };

  return (
    <SidebarProvider className={'bg-sidebar'}>
      {!flattenedPathsAgency.includes(pathname) && (
        <AppSidebar
          urlPaths={URL_PATHS_AGENCY}
          choices={[
            {
              logo: CompassIcon,
              name: 'General Voyage',
              plan: 'Construre un future'
            }
          ]}
          user={user}
          showCalendar={dateFilterablePathAgency.includes(
            pathname.split('?')[0].split('/').pop() || ''
          )}
        />
      )}

      <SidebarInset
        className={`flex flex-col ${flattenedPathsAgency.includes(pathname) ? '' : 'rounded-3xl m-6 p-2 shadow-lg'} sm:gap-4 sm:py-4`}
      >
        <header className="sticky top-0 z-30 flex h-14 items-center gap-5 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 ">
          <div className="flex items-center gap-2">
            {/* {flattenedPathsAgency.includes(pathname) && ( */}
            <>
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
            </>
            {/* )} */}
            <Breadcrumb>
              <BreadcrumbList>
                {pathname
                  .split('/').slice(2)
                  .filter((segment) => { segment })
                  .map((segment, index, arr) => {
                    const href = '/' + arr.slice(0, index + 1).join('/');
                    return (
                      <React.Fragment key={href}>
                        {index < arr.length - 1 ? (
                          <>
                            <BreadcrumbItem className="hidden md:block">
                              <BreadcrumbLink href={href}>
                                {segment.charAt(0).toUpperCase() +
                                  segment.slice(1)}
                              </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                          </>
                        ) : (
                          <BreadcrumbPage>
                            {segment.charAt(0).toUpperCase() + segment.slice(1)}
                          </BreadcrumbPage>
                        )}
                      </React.Fragment>
                    );
                  })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto flex">
            {/* {searchablePathsAgency.includes(pathname) && ( */}
            <div className="mb-2">
              <SearchInput />
            </div>
            {/* )} */}
            <NavActions />
          </div>
        </header>
        <div className="grid flex-1 items-start gap-2 px-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
