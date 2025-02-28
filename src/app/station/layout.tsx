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
import { mainPaths, searchablePathsStation } from '@/lib/paths';
import { useSession } from 'next-auth/react';
import Loading from '../agency/loading';
import { PersonStandingIcon } from 'lucide-react';

export default function StationLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  console.log(session);

  if (status === 'loading') {
    return Loading({ message: 'Getting User info', variant: 'card' }); // You can replace this with a spinner
  }

  // Remove search params (everything after ?)
  const currentPage = pathname.split('?')[0].split('/').pop() || '';

  // Define all valid paths by flattening navMain, navSecondary, and customerRelations
  // Check if the current path is in the valid paths
  const showSidebar = mainPaths.includes(pathname);
  const showSearchbar = searchablePathsStation.includes(pathname);

  const breadcrumbItems = pathname
    .split('/')
    .filter((segement) => segement)
    .map((segment, index, arr) => {
      const href = '/' + arr.slice(0, index + 1).join('/');
      return {
        key: index,
        label: segment.charAt(0).toUpperCase() + segment.slice(1),
        href
      };
    });

  return (
    <SidebarProvider className={'bg-sidebar'}>
      {showSidebar && (
        <AppSidebar
          user={{
            name: session?.user?.name ?? '',
            email: session?.user?.email??'',
            passwordHash: '',
            id: session?.user?.id ?? '',phone:'', photo: '',recruitable: false, sex:'male',signupComplete:false
          }}

          showCalendar={['vehicles'].includes(currentPage)}
          urlPaths={[]}
        />
      )}

      {/* <AppCalenderSidebar /> */}
      <SidebarInset
        className={`flex flex-col ${showSidebar ? '' : 'rounded-3xl m-6 p-2 shadow-lg'} sm:gap-4 sm:py-4 `}
      >
        <header className="sticky top-0 z-30 flex h-14 items-center gap-5 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 ">
          <div className="flex items-center gap-2">
            {showSidebar && (
              <>
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
              </>
            )}
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbItems.map((item, idx) => (
                  <>
                    {idx < breadcrumbItems.length - 1 ? (
                      <>
                        <BreadcrumbItem
                          key={item.key}
                          className="hidden md:block"
                        >
                          <BreadcrumbLink href={item.href}>
                            {item.label}
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                      </>
                    ) : (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    )}
                  </>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          {/* This div ensures NavActions is at the far right */}
          <div className="ml-auto flex">
            {showSearchbar && (
              <div className="mb-2">
                <SearchInput />
              </div>
            )}
            <NavActions />
          </div>
        </header>
        {/* <SidebarSeparator /> */}
        <div className="grid flex-1 items-start gap-2 px-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
