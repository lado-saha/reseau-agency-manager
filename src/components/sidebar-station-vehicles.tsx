import * as React from 'react';

import { Calendars } from '@/components/calendars';
import { DatePicker } from '@/components/date-picker';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator
} from '@/components/ui/sidebar';

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg'
  },
  calendars: [
    {
      name: 'My Calendars',
      items: ['Personal', 'Work', 'Family']
    },
    {
      name: 'Favorites',
      items: ['Holidays', 'Birthdays']
    },
    {
      name: 'Other',
      items: ['Travel', 'Reminders', 'Deadlines']
    }
  ]
};

export function AppCalenderSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      {...props}
      // collapsible="offcanvas"
      variant="inset"
      side="left"
    >
      <SidebarContent className="inset-x-full">
        <DatePicker />
        <SidebarSeparator className="mx-0" />
        <Calendars calendars={data.calendars} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
