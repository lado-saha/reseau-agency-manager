/*
 * Definition file contains helper export classes and types
 */
// Location export class to represent the physical location of a Station

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
export type TabsVehicles = 'all' | 'incoming' | 'outgoing' | 'idle';
export type StatusVehicles = 'incoming' | 'outgoing' | 'idle';
export type HealthVehicles = 'normal' | 'damaged' | 'repairing';
