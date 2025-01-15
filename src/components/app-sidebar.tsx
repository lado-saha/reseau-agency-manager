'use client';

import * as React from 'react';
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  AudioWaveform,
  GalleryVerticalEnd,
  DiamondPercentIcon,
  LayoutDashboard,
  SquareDashedKanbanIcon,
  LucideLayoutDashboard,
  LucideShipWheel,
  ShipWheel,
  DiamondPercent,
  BusIcon,
  Wallet2Icon,
  GroupIcon,
  Mail,
  Users,
  TrendingUp,
  Backpack,
  Icon,
  CalendarRangeIcon,
  ChevronRight
} from 'lucide-react';

import { StationSwitcher } from '@/components/switcher-stations';
import { usePathname } from 'next/navigation';

import { NavMain } from '@/components/nav-main';
import { NavCustomerRel } from '@/components/nav-projects';
import { NavSecondary } from '@/components/nav-secondary';
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

const data = {
  user: {
    name: 'Paul Atangana',
    email: 'paul-atang@general.com',
    role: 'Logistics Manager',
    avatar: '/avatars/shadcn.jpg'
  },
  stations: [
    {
      name: 'Foreke, Dschang',
      logo: GalleryVerticalEnd,
      plan: 'BP 206, Rondeau'
    },
    {
      name: 'Biyemassi, Yaounde',
      logo: AudioWaveform,
      plan: 'BP 123, Car. Biyemassi'
    },
    {
      name: 'Plaisir, Ebolowa',
      logo: DiamondPercent,
      plan: 'BP 303, Rue Ekiza'
    },
    {
      name: 'Terminus, Yaounde',
      logo: Command,
      plan: 'BP 405, Coline rouge'
    },
    {
      name: 'Foreke, Dschang',
      logo: GalleryVerticalEnd,
      plan: 'BP 206, Rondeau'
    },
    {
      name: 'Biyemassi, Yaounde',
      logo: AudioWaveform,
      plan: 'BP 123, Car. Biyemassi'
    },
    {
      name: 'Plaisir, Ebolowa',
      logo: DiamondPercent,
      plan: 'BP 303, Rue Ekiza'
    },
    {
      name: 'Terminus, Yaounde',
      logo: Command,
      plan: 'BP 405, Coline rouge'
    },
    {
      name: 'Foreke, Dschang',
      logo: GalleryVerticalEnd,
      plan: 'BP 206, Rondeau'
    },
    {
      name: 'Biyemassi, Yaounde',
      logo: AudioWaveform,
      plan: 'BP 123, Car. Biyemassi'
    },
    {
      name: 'Plaisir, Ebolowa',
      logo: DiamondPercent,
      plan: 'BP 303, Rue Ekiza'
    },
    {
      name: 'Terminus, Yaounde',
      logo: Command,
      plan: 'BP 405, Coline rouge'
    },
    {
      name: 'Foreke, Dschang',
      logo: GalleryVerticalEnd,
      plan: 'BP 206, Rondeau'
    },
    {
      name: 'Biyemassi, Yaounde',
      logo: AudioWaveform,
      plan: 'BP 123, Car. Biyemassi'
    },
    {
      name: 'Plaisir, Ebolowa',
      logo: DiamondPercent,
      plan: 'BP 303, Rue Ekiza'
    },
    {
      name: 'Terminus, Yaounde',
      logo: Command,
      plan: 'BP 405, Coline rouge'
    },
    {
      name: 'Foreke, Dschang',
      logo: GalleryVerticalEnd,
      plan: 'BP 206, Rondeau'
    },
    {
      name: 'Biyemassi, Yaounde',
      logo: AudioWaveform,
      plan: 'BP 123, Car. Biyemassi'
    },
    {
      name: 'Plaisir, Ebolowa',
      logo: DiamondPercent,
      plan: 'BP 303, Rue Ekiza'
    },
    {
      name: 'Terminus, Yaounde',
      logo: Command,
      plan: 'BP 405, Coline rouge'
    }
  ],
  navMain: [
    {
      title: 'Dashboard',
      url: '#',
      icon: LayoutDashboard
    },

    {
      title: 'Trips Management',
      url: '#',
      icon: ShipWheel,
      items: [
        {
          title: 'View Trips',
          url: '#'
        },
        {
          title: 'Schedule Trips',
          url: '#'
        },
        {
          title: 'Calendar View',
          url: '#'
        }
      ]
    },
    {
      title: 'Fleet Management',
      url: '/station/vehicles',
      icon: BusIcon,
      isActive: true,

      items: [
        {
          title: 'Vehicles',
          url: '',
          isActive: true
        },
        {
          title: 'Models',
          url: 'models'
        }
      ]
    },
    {
      title: 'Finances',
      url: '#',
      icon: Wallet2Icon,
      items: [
        {
          title: 'Income/Expenses Tracking',
          url: '#'
        },
        {
          title: 'Revenue Reports',
          url: '#'
        },
        {
          title: 'Financial Projection',
          url: '#'
        },
        {
          title: 'Settings',
          url: '#'
        }
      ]
    },
    {
      title: 'Employees',
      url: '#',
      icon: Users,
      items: [
        {
          title: 'Employee Directory',
          url: '#'
        },
        {
          title: 'Add/Edit Employee',
          url: '#'
        },
        {
          title: 'Roles & Permission',
          url: '#'
        }
      ]
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'Station Info',
          url: '#'
        },
        {
          title: 'General Settings',
          url: '#'
        },
        {
          title: 'Price Settings',
          url: '#'
        },
        {
          title: 'VIP Settings',
          url: '#'
        },
        {
          title: 'Term of Services',
          url: '#'
        }
      ]
    }
  ],
  navSecondary: [
    {
      title: 'Support & Help',
      url: '#',
      icon: LifeBuoy
    },
    {
      title: 'Feedback',
      url: '#',
      icon: Send
    }
  ],
  customerRelations: [
    {
      name: 'Inbox',
      url: '#',
      icon: Mail
    },
    {
      name: 'Customers',
      url: '#',
      icon: Backpack
    },
    {
      name: 'Trends',
      url: '#',
      icon: TrendingUp
    }
  ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarHeader>
          <StationSwitcher teams={data.stations} />
        </SidebarHeader>
      </SidebarHeader>
      <SidebarContent className="overflow-x-hidden">
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
                    {/* <div className='border p-1'> */}
                    <DatePicker />
                    {/* </div> */}
                  </CollapsibleContent>
                </>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarSeparator />
        <NavMain items={data.navMain} />
        {/* <NavCustomerRel projects={data.customerRelations} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
