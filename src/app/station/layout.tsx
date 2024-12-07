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
// import { SearchInput } from './dashboard/search';

export const metadata = {
  title: 'Next.js App Router + NextAuth + Tailwind CSS',
  description:
    'A user admin dashboard configured with Next.js, Postgres, NextAuth, Tailwind CSS, TypeScript, and Prettier.'
};

export default function StationLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className=" ">
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Trips Management</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">View Trips</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Trips 2024</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          {/* This div ensures NavActions is at the far right */}
          <div className="ml-auto flex">
            <NavActions />
          </div>
        </header>
        <div className="space-y-6 pt-4 p-4 pl-12 pr-12 ">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
