/*
 * Definition file contains helper export classes and types
 */
// Location export class to represent the physical location of a Station

import { Vehicle } from './resource';

interface GPSPosition {
  latitude: number;
  longitude: number;
}

export class GeoLocation {
  country: string;
  region: string;
  town: string;
  quarter: string;
  gpsPosition: GPSPosition;

  constructor(
    country: string,
    region: string,
    town: string,
    quarter: string,
    gpsPosition: GPSPosition
  ) {
    this.country = country;
    this.region = region;
    this.town = town;
    this.quarter = quarter;
    this.gpsPosition = gpsPosition;
  }
}

/**
 * This export class models Audit information and is a memeber of eac export class for tracking and versionning purposes
 */
export class AuditInfo {
  createdOn: Date; // Timestamp when the resource was created
  updatedOn: Date; // Timestamp when the resource was last updated
  createdBy: string; // User or system that created the resource
  updatedBy: string; // User or system that last updated the resource

  constructor(createdBy: string) {
    this.createdOn = new Date();
    this.updatedOn = new Date();
    this.createdBy = createdBy;
    this.updatedBy = createdBy;
  }

  // Method to update the audit info
  updateAuditInfo(updatedBy: string): void {
    this.updatedOn = new Date();
    this.updatedBy = updatedBy;
  }
}

/**
 * The different tabs under which we can view a  bus. The all tab shows everything
 */
export type TabsVehicles = 'all' | 'incoming' | 'outgoing' | 'stationed';
export type StatusVehicles = 'incoming' | 'outgoing' | 'stationed';
export type HealthVehicles = 'normal' | 'damaged' | 'repairing';
export type SortingDirection = 'asc' | 'desc';

export function sortVehicles(
  field: keyof Vehicle, // field is now restricted to the keys of the Vehicle class
  direction: SortingDirection,
  vehicles: Vehicle[]
): Vehicle[] {
  return vehicles.slice().sort((a, b) => {
    // Use .slice() to avoid mutating the original array
    const valueA = a[field];
    const valueB = b[field];

    // Handle string fields (e.g., model, status, origin)
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      if (valueA < valueB) return direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return direction === 'asc' ? 1 : -1;
      return 0;
    }

    // Handle number fields (e.g., nbSeats)
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return direction === 'asc' ? valueA - valueB : valueB - valueA;
    }

    // Handle Date fields (e.g., departureTime, estimatedArrivalTime, arrivedOn)
    if (valueA instanceof Date && valueB instanceof Date) {
      return direction === 'asc'
        ? valueA.getTime() - valueB.getTime()
        : valueB.getTime() - valueA.getTime();
    }

    // Handle cases where the field is not string, number, or date
    return 0;
  });
}
