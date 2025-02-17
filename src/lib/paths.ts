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


export const URL_PATHS_AGENCY = [
  {
    title: 'Dashboard',
    url: '/agency/:agencyId/dashboard',
    icon: LayoutDashboard
  },
  {
    title: 'Employees',
    url: '/agency/:agencyId/employees',
    icon: UsersIcon,
    searchable: true, // ✅ Searchable root
    items: []
  },
  {
    title: 'Stations',
    url: '/agency/:agencyId/station',
    icon: Building2Icon,
    searchable: true, // ✅ Searchable root
    items: []
  },
  {
    title: 'Trips',
    url: '/agency/:agencyId/trip',
    icon: BusIcon,
    searchable: true, // ✅ Searchable root
    items: [
      //{
      //  title: 'Trip Details',
      //  url: '/agency/:agencyId/trip/:tripId'
      //}
    ]
  },
  {
    title: 'Vehicles',
    url: '/agency/:agencyId/vehicle',
    icon: BusIcon,
    searchable: true, // ✅ Searchable root
    items: [
      {
        title: 'Vehicle Models',
        url: '/agency/:agencyId/vehicle/model',
        searchable: true // ✅ Searchable root
      },
    ]
  }
];

export function getAgencyPaths(agencyId: string): string[] {
  return URL_PATHS_AGENCY.flatMap((item) => [
    item.url.replace(':agencyId', agencyId), // ✅ Replace agencyId
    ...(item.items?.map((subItem) => subItem.url.replace(':agencyId', agencyId)) || [])
  ]);
}

export function getSearchablePaths(agencyId: string): string[] {
  return getAgencyPaths(agencyId).filter((url) =>
    URL_PATHS_AGENCY.some((section) =>
      section.searchable && section.url.replace(':agencyId', agencyId) === url
    )
  );
}
export function getDateFilterablePaths(agencyId: string): string[] {
  return getAgencyPaths(agencyId).filter(
    (url) =>
      URL_PATHS_AGENCY.some((section) =>
        section.items?.some(
          (subItem) => subItem.url.replace(':agencyId', agencyId) === url && false
        )
      )
  );
}


