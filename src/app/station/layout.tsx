'use client';
import { AppSidebar } from 'src/components/app-sidebar';

import { Analytics } from '@vercel/analytics/react';
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
import { ThemeProvider } from 'src/components/theme-provider';
import { Separator } from 'src/components/ui/separator';
import { NavActions } from 'src/components/app-topbar-actions';
import { usePathname } from 'next/navigation';
import { AppCalenderSidebar } from '@/components/sidebar-station-vehicles';
import { SearchInput } from '@/components/search-bar';

export default function StationLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

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
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className=" flex flex-col sm:gap-4 sm:py-4">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
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
            <SearchInput />
            <NavActions />
          </div>
        </header>
        <div className="grid flex-1 items-start gap-2 p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
