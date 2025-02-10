import { Audit } from "./helpers"; // Importing Audit interface for tracking creation, updates, etc.
/**
 * Represents a general resource that can be owned, transferred, andmaintained.
 * Extends the Audit interface to include auditing details (created/pdated timestamps, etc.).
 */
interface IResource extends Audit {
  id: string; // Unique identifier for the resource (UUID or similar
  permanentOwnerId: string; // The original and permanent owner of the resource
  tempOwnerId?: string; // Optional: If the resource is temporarily assigned, this stores the temporary owner's ID
  tempOwnershipStartTime?: Date; // Optional: Start time when temporary ownership began
  tempOwnershipEndTime?: Date; // Optional: End time when temporary ownership expires
  isUnderMaintenance: boolean; // Indicates whether the resource is currently under maintenance
  maintenanceStartTime?: Date; // Optional: Timestamp when maintenance started
  maintenanceEndTime?: Date; // Optional: Timestamp when maintenance is expected to or has ended
}
/**
 * Defines the structural model of a vehicle, specifying its layout,fuel type, and seating details.
 * This acts as a template that multiple vehicle instances can referto.
 */
interface IVehicleModel extends Audit {
  id: string; // Unique identifier for the vehicle mode
  name: string; // Model name (e.g., "Luxury Coach 50-seater", "Electric Van")
  fuelType: FuelType; // Type of fuel used (e.g., "Diesel", "Electric", "Petrol")
  seatLayout: string | number[][]; // Represents seat arrangement: 
  // - Can be a string (e.g., "2-2" for rows with 2 seats on each sie)
  // - Can be a 2D matrix (e.g., [[1, 1, 0], [1, 1, 1]] for seating ayout)
  columns: number; // Number of seat columns per row
  seatCount: number; // Total number of seats in the vehicle
  luggageSpace: boolean; // Indicates whether the model includes dedicated luggage space
}
/**
 * Represents a specific vehicle instance that belongs to an organiztion or person.
 * Extends IResource to include ownership, maintenance, and audit trcking.
 */
interface IVehicle extends IResource {
  manufacturer: string; // Name of the vehicle's manufacturer (e.g.,"Mercedes-Benz", "Toyota")
  model: IVehicleModel; // Reference to the vehicle model, which defines seating and fuel type
  registrationNumber: string; // Official vehicle registration number (license plate)
  productionYear: number; // Year the vehicle was manufactured
}

/**
 * Defines the possible fuel types for a vehicle.
 */
export type FuelType =
  | "Petrol"
  | "Diesel"
  | "Electric"
  | "Hybrid";
