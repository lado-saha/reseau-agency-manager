
'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbLink, BreadcrumbPage } from '@/components/ui/breadcrumb';

// Define a mapping for known paths
const LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  employees: 'Employees',
  station: 'Stations',
  trip: 'Trips',
  vehicle: 'Vehicles',
  profile: 'Profile',
  model: 'Vehicle Models',
  agency: 'Agencies'
};

// Utility function to determine if a segment is a UUID
const isUUID = (segment: string) => /^[0-9a-fA-F-]{6,}$/.test(segment);

// Shorten UUIDs to first 4 characters
const getSegmentLabel = (segment: string) => {
  if (LABELS[segment]) return LABELS[segment];
  if (isUUID(segment)) return segment.slice(0, 4); // Show first 4 chars of UUID
  return segment;
};

export default function BreadcrumbComponent() {
  const pathname = usePathname();
  const segments = pathname.split('/').slice(1); // Ignore `/agency`
  const [isMobile, setIsMobile] = useState(false);

  // Check screen width
  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Handle breadcrumb shortening for small screens
  const displayedSegments = isMobile
    ? segments.length > 2
      ? ['...', ...segments.slice(-2)] // Show last 2 segments with "..."
      : segments
    : segments;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {displayedSegments.map((segment, index, arr) => {
          const href = '/'+ segments.slice(0, segments.length - arr.length + index + 1).join('/');
          const label = getSegmentLabel(segment);

          return (
            <BreadcrumbItem key={href}>
              {index < arr.length - 1 ? (
                <>
                  <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                  <BreadcrumbSeparator />
                </>
              ) : (
                <BreadcrumbPage>{label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

