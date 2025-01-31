import {
  Command,
  LifeBuoy,
  Send,
  Settings2,
  AudioWaveform,
  GalleryVerticalEnd,
  LayoutDashboard,
  ShipWheel,
  DiamondPercent,
  BusIcon,
  Wallet2Icon,
  Mail,
  Users,
  TrendingUp,
  Backpack,
  CalendarRangeIcon,
  ChevronRight,
  UsersIcon
} from 'lucide-react';

export const URL_PATHS = {
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
      title: 'Trips',
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
      title: 'Fleet',
      url: '/station/vehicles',
      icon: BusIcon,

      items: [
        {
          title: 'Vehicles',
          url: '/station/vehicles',
          searchable: true
        },
        {
          title: 'Models',
          url: '/station/vehicles/models',
          searchable: true
        }
      ]
    },
    {
      title: 'Employees',
      url: '/station/employees',
      icon: UsersIcon,

      items: [
        {
          title: 'Employees',
          url: '/station/employees',
          searchable: true
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
          url: '#',
          searchable: true
        },
        {
          title: 'Revenue Reports',
          url: '#',
          searchable: true
        },
        {
          title: 'Financial Projection',
          url: '#',
          searchable: true
        },
        {
          title: 'Settings',
          url: '#',
          searchable: true
        }
      ]
    },
    {
      title: 'Drivers',
      url: '#',
      icon: Users,
      items: [
        {
          title: 'Directory',
          url: '#',
          searchable: true
        },
        {
          title: 'Add/Edit Employee',
          url: '#',
          searchable: true
        },
        {
          title: 'Roles & Permission',
          url: '#',
          searchable: true
        }
      ]
    },
    {
      title: 'Settings',
      url: '/station/settings',
      icon: Settings2,
      items: [
        {
          title: 'Station Info',
          url: '#',
          searchable: true
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

export const flattenedPaths = [
  ...URL_PATHS.navMain.flatMap((item) => [
    item.url,
    ...(item.items?.map((subItem) => subItem.url) || [])
  ]),
  ...URL_PATHS.navSecondary.map((item) => item.url),
  ...URL_PATHS.customerRelations.map((item) => item.url)
];
export const mainPaths = flattenedPaths.filter((url) => url && url !== '#'); // Filter out empty or placeholder URLs

export const searchablePaths = flattenedPaths.filter(
  (url) => url && url !== '#'
); // Filter out empty or placeholder URLs
