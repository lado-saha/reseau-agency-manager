import { Audit } from "@/lib/models/helpers";
import { GPSPosition } from "../repo/osm-place-repo";
import { AgencyEmployee } from "./employee";

/**
 * Represents a general resource that can be owned, transferred, andmaintained.
 * Extends the Audit interface to include auditing details (created/pdated timestamps, etc.).
 */
export interface Resource extends Audit, GPSPosition {
  id: string; // Unique identifier for the resource (UUID or similar)
  healthStatus: HealthStatus; // Current status of the resource
  ownerId: string; // The original and permanent owner of the resource
  tenantId?: string; // Optional: Temporary owner's ID (if rented or borrowed)
  tenancyStartTime?: Date | string; // Optional: Start time of temporary ownership
  tenancyEndTime?: Date | string; // Optional: End time of temporary ownership
  usageCount: number; // Total number of times the resource has been used (lifetime or resettable?)
  status: ResourceStatus
}

export type HealthStatus = 'good' | 'bad' | 'maintenance';
export const HEALTH_STATUS = ['good', 'bad', 'maintenance'] as const;
export const HEALTH_STATUS_OPTIONS = HEALTH_STATUS.map((status) => ({
  value: status,
  label: status.replace(/\b\w/g, (char) => char.toUpperCase()), // Capitalize first letter
}));

export type ResourceStatus = 'scheduled' | 'in-progress' | 'free';
export const RESOURCE_STATUS = ['scheduled', 'in-progress', 'free'] as const;
export const RESOURCE_STATUS_OPTIONS = RESOURCE_STATUS.map((status) => ({
  value: status,
  label: status
    .replace(/-/g, ' ') // Replace dashes with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()), // Capitalize first letter of each word
}));
/**
 * Defines the structural model of a vehicle, specifying its layout,fuel type, and seating details.
 * This acts as a template that multiple vehicle instances can referto.
 */
export interface VehicleModel extends Audit {
  id: string; // Unique identifier for the vehicle mode
  name: string; // Model name (e.g., "Luxury Coach 50-seater", "Electric Van")
  agencyId: string,
  fuelType: FuelType; // Type of fuel used (e.g., "Diesel", "Electric", "Petrol")
  seatLayout: string; // Represents seat arrangement: 
  columns: number; // Number of seat columns per row
  seatCount: number; // Total number of seats in the vehicle
  luggageSpaces: LuggageSpace[]; // Indicates whether the model includes dedicated luggage space
  modelPhoto: File | string
}

/**
 * Represents a specific vehicle instance that belongs to an organiztion or person.
 * Extends IResource to include ownership, maintenance, and audit trcking.
 */
export interface Vehicle extends Resource {
  manufacturer: string; // Name of the vehicle's manufacturer (e.g.,"Mercedes-Benz", "Toyota")
  model: VehicleModel | string; // Reference to the vehicle model, which defines seating and fuel type
  registrationNumber: string; // Official vehicle registration number (license plate)
  productionYear: number; // Year the vehicle was manufactured
}

export interface Driver extends Resource {
  id: string,
  employee: AgencyEmployee | string,
  license: string
}

/**
 * Defines the possible fuel types for a vehicle.
 */
export type FuelType =
  | "petrol"
  | "diesel"
  | "electric"
  | "hybrid";
export type LuggageSpace = 'top' | 'bottom' | 'inside'
export const FUEL_TYPES = ['petrol', 'diesel', "electric", "hybrid"] as const
export const LUGGAGE_SPACES = ['top', 'bottom', "inside"] as const

/**
   * Converts a 2D seat matrix into a bitmask string.
   * @param matrix The 2D seat matrix where 1 represents a seat and 0 represents empty space.
   * @returns A bitmask string representing the seat matrix.
   */
export function convertMatrixToBitmask(matrix: number[][]): string {
  let bitmask = '';
  for (const row of matrix) {
    // Convert each row of the matrix into a string of 0s and 1s
    bitmask += row.join('');
  }
  return bitmask;
}

/**
 * Converts a bitmask string into a 2D seat matrix.
 * @returns A 2D seat matrix where 1 represents a seat and 0 represents empty space.
 */
export function vehicleModelRowCount(model: VehicleModel): number {
  const totalCells = model.seatLayout.length;
  return Math.ceil(totalCells / model.columns); // Calculate the number of rows
}
export function convertBitmaskToMatrix(model: VehicleModel): number[][] {
  if (typeof model.seatLayout === 'string') {
    const totalCells = model.seatLayout.length;
    const rows = Math.ceil(totalCells / model.columns); // Calculate the number of rows
    const matrix: number[][] = []

    for (let i = 0; i < rows; i++) {
      const row = model.seatLayout
        .slice(i * model.columns, (i + 1) * model.columns)
        .split('')
        .map(Number);
      matrix.push(row);
    }

    return matrix;
  }
  return []
}

/**
 * Calculates the number of seats (1s) in the matrix.
 * @param matrix The 2D seat matrix to count the seats from.
 * @returns The number of seats in the matrix.
 */
export function calculateNumberOfSeats(matrix: number[][]): number {
  let count = 0;
  for (const row of matrix) {
    count += row.filter((cell) => cell === 1).length;
  }
  return count;
}


//// Driver export class using Resource via composition and including its own audit info
//export class Driver {
//  resource?: Resource; // Composed Resource object
//  name: string; // Driver's name
//  licenseNumber: string; // Driver's license number
//  contactInfo: { phone: string; email?: string }; // Driver's contact information
//  auditInfo: Audit; // Driver-specific audit information
//
//  constructor(
//    resourceId: string,
//    permanentOwnerId: string,
//    name: string,
//    licenseNumber: string,
//    contactInfo: { phone: string; email?: string },
//    createdBy: string
//  ) {
//    this.resource = {}
//    //   resourceId,
//    //   permanentOwnerId,
//    //   false,
//    //   createdBy
//    // );
//    this.name = name;
//    this.licenseNumber = licenseNumber;
//    this.contactInfo = contactInfo;
//    this.auditInfo = new Audit(createdBy); // Initialize driver-specific audit info
//  }
//}
