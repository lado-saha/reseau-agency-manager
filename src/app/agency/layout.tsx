
'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { CompassIcon } from 'lucide-react';

import { AppSidebar } from 'src/components/app-sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from 'src/components/ui/sidebar';
import { Separator } from 'src/components/ui/separator';
import { NavActions } from 'src/components/app-topbar-actions';
import { SearchInput } from '@/components/search-bar';
import Loading from './loading';

import { getAgencyPaths, getDateFilterablePaths, URL_PATHS_AGENCY } from '@/lib/paths';
import { User } from '@/lib/models/user';
import BreadcrumbComponent from '@/components/layout-breadcrumb';

export default function AgencyLayout({ children }: { children: React.ReactNode }) {

  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const segments = pathname.split('/');
  const agencyId = segments[1];

  // Hide sidebar when any dynamic ID is "new"
  const hideSidebar = segments.some((segment) => segment === 'new');

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setUser({
        name: session.user.name || '',
        email: session.user.email || '',
        passwordHash: '',
        id: session.user.id || '',
        photo: (session.user as User)?.photo || '',
        phone: '',
        recruitable: false,
        sex: 'male',
        signupComplete: false,
      });
    }
  }, [status, session]);

  if (!user) return <Loading message="Fetching user data..." variant="full-screen" />;

  const showSidebar = !hideSidebar;
  const showCalendar = getDateFilterablePaths(agencyId).includes(pathname.split('?')[0].split('/').pop() || '');

  return (
    <SidebarProvider className="bg-sidebar">
      {!hideSidebar && user ? (
        <AppSidebar
          urlPaths={URL_PATHS_AGENCY}
          user={user}
          showCalendar={showCalendar}
        />
      ) : !user ? (<Loading message="Fetching user data..." variant="inline" />) : (<></>)}

      <SidebarInset className={`flex flex-col ${showSidebar ? 'rounded-3xl m-6 p-2 shadow-lg' : ''} sm:gap-4 sm:py-4`}>
        <header className="sticky top-0 z-30 flex h-14 items-center gap-5 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <div className="flex items-center gap-2">
            <>
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
            </>
            <BreadcrumbComponent /> {/* ✅ Uses updated BreadcrumbComponent */}
          </div>
          <div className="ml-auto flex">
            <div className="mb-2">
              <SearchInput />
            </div>
            <NavActions />
          </div>
        </header>
        <div className="grid flex-1 items-start gap-2 px-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

