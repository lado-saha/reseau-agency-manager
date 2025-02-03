/*
 * Definition file contains helper export classes and types
 */
// Location export class to represent the physical location of a Station

import { format } from 'date-fns';
import { Vehicle, VehicleModel } from './resource';

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
export type TabsVehicle = 'all' | 'incoming' | 'outgoing' | 'stationed';
export type TabsVehicleModel = 'all' | 'car' | 'bus';
export type TabsVehicleModelDetails = 'info' | 'schema' | 'stats';
export type TabsAgencyDetails = 'creator-info' | 'basic-info' | 'legal-info' | 'social-media';

export type StatusVehicle = 'incoming' | 'outgoing' | 'stationed';
export type TypeVehicleModel = 'car' | 'bus';

export type DetailViewMode = 'edit-mode' | 'creation-mode';

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

export function sortVehiclesModels(
  field: string, // field can now be any path as a string, e.g., 'auditInfo.createdOn'
  direction: SortingDirection,
  vehicles: VehicleModel[]
): VehicleModel[] {
  return vehicles.slice().sort((a, b) => {
    // Function to get a nested field value using a path string like 'auditInfo.createdOn'
    const getNestedValue = (obj: any, path: string) => {
      return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    const valueA = getNestedValue(a, field);
    const valueB = getNestedValue(b, field);

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
export function transposeMatrix(matrix: number[][]): number[][] {
  const rows = matrix.length;
  const cols = matrix[0].length;

  const transposedMatrix: number[][] = Array(cols)
    .fill(null)
    .map(() => Array(rows).fill(0)); // Prepare a matrix of transposed size

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      transposedMatrix[j][i] = matrix[i][j]; // Assign elements in transposed positions
    }
  }

  return transposedMatrix;
}
export function bitmaskToMatrix(
  bitmask: string,
  columns: number
): number[][] {
  const rows = Math.ceil(bitmask.length / columns); // Calculate the number of rows
  const matrix: number[][] = new Array(rows);

  let bitmaskIndex = 0;

  // Initialize the matrix and populate it directly
  for (let i = 0; i < rows; i++) {
    const row = new Array(columns);

    for (let j = 0; j < columns; j++) {
      if (bitmaskIndex < bitmask.length) {
        row[j] = +bitmask[bitmaskIndex++]; // Convert bit to number (either 0 or 1)
      } else {
        row[j] = 0; // Fill remaining spots with 0 if the bitmask is shorter than expected
      }
    }

    matrix[i] = row;
  }

  return matrix;
}

export function matrixToBitmask(matrix: number[][], columns: number): string {
  let bitmask = '';
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < columns; j++) {
      bitmask += matrix[i][j];
    }
  }
  return bitmask;
}
