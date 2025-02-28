/*
 *
 * Definition file contains helper export classes and types
 */
// Location export class to represent the physical location of a Station

import { Vehicle, VehicleModel } from './resource';
import { EmployeeRole } from './employee';
import { object } from 'zod';

export interface Audit {
  createdOn: Date; // Timestamp when the resource was created
  updatedOn: Date; // Timestamp when the resource was last updated
  createdBy: string; // User or system that created the resource
  updatedBy: string; // User or system that last updated the resource
}

export function auditUpdOrNew(adminId: string, obj?: Audit): Audit {
  return obj === undefined ? auditCreate(adminId) : { ...auditUpdate(adminId), createdBy: obj.createdBy, createdOn: obj.createdOn } satisfies Audit
}

export interface GPSPosition {
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



export const AUDIT_EMPTY: Audit = {
  createdBy: '', createdOn: new Date(), updatedBy: '', updatedOn: new Date()
}

export const auditCreate = (by: string) => ({
  createdOn: new Date(),
  updatedOn: new Date(),
  createdBy: by,
  updatedBy: by,
});

export const auditUpdate = (by: string) => ({
  updatedOn: new Date(),
  updatedBy: by,
});

/**
 * The different tabs under which we can view a  bus. The all tab shows everything
 */
export type TabsVehicle = 'all' | 'incoming' | 'outgoing' | 'stationed';
export type TabsDriver = 'all' | 'incoming' | 'outgoing' | 'stationed';
export type TabsVehicleModel = 'all' | 'car' | 'bus' | 'coaster';
export type TabsVehicleModelDetails = 'info' | 'layout' | 'stats';
export type TabsAgencyDetails = 'creator-info' | 'basic-info' | 'legal-info' | 'social-media';

export type TabsEmployee<T extends EmployeeRole> = 'all' | T;
// export type TabsEmployeesStation= 'janitor' | '' | 'station-chief' | 'other';

export type StatusVehicle = 'incoming' | 'outgoing' | 'stationed';
export type SubmissionStatus = 'pending' | 'success' | 'error';
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


// export function sortEntities<T>(
//   field: keyof T, // Restrict sorting to known keys of T
//   direction: SortingDirection,
//   entities: T[]
// ): T[] {
//   return entities.slice().sort((a, b) => {
//     const valueA = a[field];
//     const valueB = b[field];

//     // Handle string sorting
//     if (typeof valueA === 'string' && typeof valueB === 'string') {
//       return direction === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
//     }

//     // Handle number sorting
//     if (typeof valueA === 'number' && typeof valueB === 'number') {
//       return direction === 'asc' ? valueA - valueB : valueB - valueA;
//     }

//     // Handle Date fields
//     if (valueA instanceof Date && valueB instanceof Date) {
//       return direction === 'asc' ? valueA.getTime() - valueB.getTime() : valueB.getTime() - valueA.getTime();
//     }

//     // If we cannot compare the values, return 0 (meaning no change in order)
//     return 0;
//   });
// }

export function sortEntities<T>(
  field: keyof T | string, // Supports both nested and non-nested fields
  direction: SortingDirection,
  entities: T[]
): T[] {
  return entities.slice().sort((a, b) => {
    let valueA = getNestedValue(a, field);
    let valueB = getNestedValue(b, field);

    // If nested lookup fails, fall back to direct property lookup
    if (valueA === undefined || valueB === undefined) {
      valueA = (a as any)[field];
      valueB = (b as any)[field];
    }

    // Handle string sorting
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return direction === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    }

    // Handle number sorting
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return direction === 'asc' ? valueA - valueB : valueB - valueA;
    }

    // Handle Date fields
    if (valueA instanceof Date && valueB instanceof Date) {
      return direction === 'asc' ? valueA.getTime() - valueB.getTime() : valueB.getTime() - valueA.getTime();
    }

    // If values are not comparable, return 0 (no change in order)
    return 0;
  });
}

// Helper function to get nested value safely
export function getNestedValue(obj: any, fieldPath: string | keyof any): any {
  if (typeof fieldPath !== 'string' || !fieldPath.includes('.')) {
    return obj[fieldPath]; // Return direct property if not nested
  }

  return fieldPath.split('.').reduce((acc, key) => acc?.[key], obj);
}
