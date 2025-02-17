'use client';

import { UrlPath } from '@/lib/paths';
import { ChevronRight, type LucideIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import path from 'path';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from 'src/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from 'src/components/ui/sidebar';

export function NavMain({ items }: { items: UrlPath[] }) {
  const pathname = usePathname(); // Get the current pathname

  const agencyId = () => {
    const index = pathname.split('/').findIndex(v => v === 'agency')
   
    return pathname.split('/')[index + 1]
  }

  const updateItems = items.map(i => {
    const url = i.url.replace(':agencyId', agencyId())
    const items = i.items?.map(it => it.url.replace(":agencyId", agencyId()))
    return {...i, url, items: items} as UrlPath
  })

  // Function to determine if the item URL is active
  const isParentActive = (url: string) => {
    return pathname.split('?')[0].startsWith(url);
  };

  const isChildActive = (url: string) => {
    return true // Match exact or prefix URL
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Station's Platform</SidebarGroupLabel>
      <SidebarMenu>
        {updateItems.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={isParentActive(item.url)}
          >
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={item.title}>
                <a href={item.url.replace(':agencyId', agencyId())}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <a
                              href={subItem.url}
                              className={'font-bold bg-sidebar-accent'}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
