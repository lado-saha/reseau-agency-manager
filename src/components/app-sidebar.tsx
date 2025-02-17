import * as React from 'react';
import { CalendarRangeIcon, ChevronRight } from 'lucide-react';

import { StationSwitcher } from '@/components/switcher-stations';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator
} from '@/components/ui/sidebar';
import { DatePicker } from './date-picker';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import { User } from '@/lib/models/user';
import { Choice, UrlPath } from '@/lib/paths';

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  showCalendar: boolean;
  user: User;
  urlPaths: UrlPath[];
}

export function AppSidebar({
  showCalendar,
  user,
  urlPaths,
  ...props
}: AppSidebarProps) {
  // const user = (await auth())?.user!!;
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <StationSwitcher />
      </SidebarHeader>
      <SidebarContent className="overflow-x-hidden">
        {showCalendar && (
          <>
            <SidebarGroup>
              <SidebarGroupLabel>Tools</SidebarGroupLabel>
              <SidebarMenu>
                <Collapsible key={'Calendar'} defaultOpen={true}>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip={'Calendar'}>
                      <a href="#">
                        <CalendarRangeIcon />
                        <span>Calendar</span>
                      </a>
                    </SidebarMenuButton>
                    <>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuAction className="data-[state=open]:rotate-90">
                          <ChevronRight />
                          <span className="sr-only">Toggle</span>
                        </SidebarMenuAction>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <DatePicker />
                      </CollapsibleContent>
                    </>
                  </SidebarMenuItem>
                </Collapsible>
              </SidebarMenu>
            </SidebarGroup>
            <SidebarSeparator />
          </>
        )}
        <NavMain items={urlPaths} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
