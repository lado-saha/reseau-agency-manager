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
  Backpack
} from 'lucide-react';

// import {
//   BookOpen,
//   Bot,
//   Command,
//   Frame,
//   Map,
//   PieChart,
//   Settings2,
//   SquareTerminal,
// } from "lucide-react"
import { StationSwitcher } from 'src/components/switcher-stations';

import { NavMain } from 'src/components/nav-main';
import { NavCustomerRel } from 'src/components/nav-projects';
import { NavSecondary } from 'src/components/nav-secondary';
import { NavUser } from 'src/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from 'src/components/ui/sidebar';

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
    },  {
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
      icon: LayoutDashboard,
      isActive: true
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
      title: 'Vehicle Management',
      url: '#',
      icon: BusIcon,
      items: [
        {
          title: 'View Vehicles',
          url: '#'
        },
        {
          title: 'Add New Vehicle',
          url: '#'
        },
        {
          title: 'Maintainance Schedule',
          url: '#'
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
    <Sidebar variant="inset"  {...props}>
      <SidebarHeader>
        <SidebarHeader>
          <StationSwitcher teams={data.stations} />
        </SidebarHeader>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavCustomerRel projects={data.customerRelations} />

        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
