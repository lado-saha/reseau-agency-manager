'use client';

import * as React from 'react';
import { ChevronsUpDown, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from 'src/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from 'src/components/ui/sidebar';
import { SearchInput } from '@/components/search-bar';
import { usePathname } from 'next/navigation';
import { StationRepository } from '@/lib/repo/station-repo';
import { Station } from '@/lib/models/station';

export function StationSwitcher() {
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const agencyId = pathname.split('/')[2];

  const [stations, setStations] = React.useState<Station[] | undefined>(undefined);
  const [activeStation, setActiveStation] = React.useState<Station | undefined>();

  React.useEffect(() => {
    const getStations = async () => {
      try {
        const stationRepo = new StationRepository();
        const result = await stationRepo.getAll('');
        setStations(result.items);
        // Set the first station as active by default
        if (result.items.length > 0) {
          setActiveStation(result.items[0]);
        }
      } catch (e) {
        console.error((e as Error).message);
      }
    };

    getStations();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {activeStation ? (
                <>
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    {/* Replace with your station logo or icon */}
                    <span className="size-4">🚉</span>
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {activeStation.name}
                    </span>
                    <span className="truncate text-xs">Station</span>
                  </div>
                </>
              ) : (
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">No Station Selected</span>
                </div>
              )}
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-80 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Travel Station
            </DropdownMenuLabel>
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-bold text-muted-foreground">New</div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="overflow-y-auto max-h-64">
              {stations?.map((station, index) => (
                <DropdownMenuItem
                  key={station.id}
                  onClick={() => setActiveStation(station)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    {/* Replace with your station logo or icon */}
                    <span className="size-4">🚉</span>
                  </div>
                  {station.name}
                  <DropdownMenuShortcut>Ctrl+{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
