import {
  Settings2,
  LayoutDashboard,
  ShipWheel,
  BusIcon,
  Wallet2Icon,
  Users,
  UsersIcon,
  Building2Icon,
  LucideIcon
} from 'lucide-react';
type UrlPathItem = {
  title: string;
  url: string;
  isActive?: boolean;
  searchable?: boolean; // Optional
  dateFilterable?: boolean; // Optional
};

// Define type for the main structure
export type UrlPath = {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: UrlPathItem[]; // Nested items can also have searchable and dateFilterable

};
export type Choice = {
  name: string;
  logo: LucideIcon;
  plan: string;
}

// STATIOn======================

export const URL_PATHS_STATION: UrlPath[] = [
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
]

// Define type for items that can have searchable and dateFilterable properties
export const flattenedPaths = URL_PATHS_STATION.flatMap((item) => [
  item.url,
  ...(item.items?.map((subItem) => subItem.url) || [])
])
export const mainPaths = flattenedPaths.filter((url) => url && url !== '#'); // Filter out empty or placeholder URLs

export const searchablePathsStation = flattenedPaths.filter(
  (url) => url && url !== '#'
); // Filter out empty or placeholder URLs


export const URL_PATHS_AGENCY: UrlPath[] = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard
  },
  {
    title: 'Live View',
    url: '/live-view',
    icon: LayoutDashboard
  },
  {
    title: 'Stations',
    url: '/stations',
    icon: Building2Icon,
    items: [
      {
        title: 'Stations Overview',
        url: '/stations'
      },
      {
        title: 'Station Settings',
        url: '/stations/settings'
      }
    ]
  },
  {
    title: 'Fleet',
    url: '/vehicles',
    icon: BusIcon,
    items: [
      {
        title: 'Vehicles Overview',
        url: '/vehicles',
        searchable: true,
        dateFilterable: true
      },
      {
        title: 'Vehicle Models',
        url: '/vehicles/models',
        searchable: true
      }
    ]
  },
  {
    title: 'Drivers',
    url: '/drivers',
    icon: Users,
    items: [
      {
        title: 'Driver Directory',
        url: '/drivers',
        searchable: true
      },
      {
        title: 'Driver Settings',
        url: '/drivers/settings'
      }
    ]
  },
  {
    title: 'Employees',
    url: 'employees',
    icon: UsersIcon,
    items: [
      {
        title: 'Employee Directory',
        url: 'employees',
        searchable: true
      },
      {
        title: 'Employee Settings',
        url: '/employees/settings'
      }
    ]
  },
  {
    title: 'Finances',
    url: '/finances',
    icon: Wallet2Icon,
    items: [
      {
        title: 'Finance Overview',
        url: '/finances',
        searchable: true,
        dateFilterable: true
      },
      {
        title: 'Finance Settings',
        url: '/finances/settings'
      }
    ]
  },
  {
    title: 'Profile',
    url: '/profile',
    icon: Settings2,
    items: [
      {
        title: 'Profile Settings',
        url: '/profile/settings'
      }
    ]
  }
];
// Flatten paths for easy access
export const flattenedPathsAgency: string[] = [
  ...URL_PATHS_AGENCY.flatMap((item) => [
    item.url,  // Parent path
    ...(item.items?.map((subItem) => subItem.url) || []) // Nested item paths
  ]),
];

// Filter paths based on searchability
export const searchablePathsAgency = flattenedPathsAgency.filter(
  (url) =>
    URL_PATHS_AGENCY.some((section) =>
      section.items?.some(
        (subItem) => subItem.url === url && subItem.searchable
      )
    )
);

// Filter paths based on date filterability
export const dateFilterablePathAgency = flattenedPathsAgency.filter(
  (url) =>
    URL_PATHS_AGENCY.some((section) =>
      section.items?.some(
        (subItem) => subItem.url === url && subItem.dateFilterable
      )
    )
);

