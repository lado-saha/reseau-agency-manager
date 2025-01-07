/**
 * This definition file will contains all definitions related to resources
 */

import {
  AuditInfo,
  HealthVehicles,
  StatusVehicles
} from '@/lib/models/helpers';
import { randomInt } from 'crypto';
import { format } from 'date-fns';

// Resource export class now includes AuditInfo
export class Resource {
  resourceId: string; // Unique identifier (UUID or similar)
  permanentOwnerId: string; // Permanent owner of the resource
  tempOwnerId?: string; // Temporary owner of the resource
  tempOwnershipStartTime?: Date; // Start time of temporary ownership
  tempOwnershipEndTime?: Date; // End time of temporary ownership
  isUnderMaintenance: boolean; // Indicates if the resource is under maintenance
  maintenanceStartTime?: Date; // Start time of maintenance (if applicable)
  maintenanceEndTime?: Date; // End time of maintenance (if applicable)
  auditInfo: AuditInfo; // Composition of AuditInfo for resource-level auditing

  constructor(
    resourceId: string,
    permanentOwnerId: string,
    isUnderMaintenance: boolean,
    createdBy: string
  ) {
    this.resourceId = resourceId;
    this.permanentOwnerId = permanentOwnerId;
    this.isUnderMaintenance = isUnderMaintenance;
    this.auditInfo = new AuditInfo(createdBy);
  }
}

// Vehicle export class using Resource via composition and including its own audit info
export class Vehicle {
  resource: Resource; // Composed Resource object
  immatriculation: string; // Vehicle registration number
  nbSeats: number; // Number of seats in the vehicle
  model: string; // Vehicle model name
  positionGps: { latitude: number; longitude: number }; // GPS coordinates
  auditInfo: AuditInfo; // Vehicle-specific audit information
  imageUrl: string;
  // Dummy fields
  health: HealthVehicles = ['damaged', 'normal', 'repairing'][
    randomInt(3)
  ] as HealthVehicles;
  origin: string;
  status: StatusVehicles = ['stationed', 'incoming', 'outgoing'][
    randomInt(3)
  ] as StatusVehicles;

  departureTime: string = format(Date(), ' Pp');
  estimatedArrivalTime = format(Date(), ' Pp');
  destination: string = ['Dschang', 'Yaounde', 'Maroua', 'Douala'][
    randomInt(4)
  ];
  arrivedFrom = ['Dschang', 'Yaounde', 'Maroua', 'Douala'][randomInt(4)];
  arrivedOn = format(Date(), ' Pp');

  constructor(
    resourceId: string,
    permanentOwnerId: string,
    immatriculation: string,
    nbSeats: number,
    model: string,
    positionGps: { latitude: number; longitude: number },
    createdBy: string,
    imageUrl: string
    // status: StatusVehicles
    // health: HealthVehicles = HealthVehicles,
  ) {
    this.imageUrl = imageUrl;
    this.resource = new Resource(
      resourceId,
      permanentOwnerId,
      false,
      createdBy
    );
    this.immatriculation = immatriculation;
    this.nbSeats = nbSeats;
    this.model = model;
    this.positionGps = positionGps;
    this.auditInfo = new AuditInfo(createdBy); // Initialize vehicle-specific audit info

    // this.health = health;
    this.health = ['damaged', 'normal', 'repairing'][
      randomInt(3)
    ] as HealthVehicles;
    this.origin = ['Dschang', 'Yaounde', 'Maroua', 'Douala'][randomInt(4)];
    this.status = ['stationed', 'incoming', 'outgoing'][
      randomInt(3)
    ] as StatusVehicles;
    this.departureTime = format(Date(), ' Pp');
    this.estimatedArrivalTime = format(Date(), ' Pp');
    this.destination = ['Dschang', 'Yaounde', 'Maroua', 'Douala'][randomInt(4)];
    this.arrivedFrom = ['Dschang', 'Yaounde', 'Maroua', 'Douala'][randomInt(4)];
    this.arrivedOn = format(Date(), ' Pp');
  }

  init() {
    return this;
  }


}

/**
 * Represents a vehicle model with seat layout and associated bitmask.
 */
export class VehicleModel {
  id: string;
  manufacturer: string;
  modelName: string;
  seatBitmask: string; // The bitmask representation of the seat grid
  numberSeats: number; // The number of seats (calculated dynamically)
  matrix: number[][] | null; // Nullable matrix, calculated at runtime
  columns: number; // Number of columns per row in the matrix

  /**
   * Creates a VehicleModel instance.
   * @param id The unique ID of the vehicle model.
   * @param manufacturer The manufacturer of the vehicle.
   * @param modelName The name of the vehicle model.
   * @param seatData Either a seat matrix (2D array) or a seat bitmask string.
   * @param cellsPerRow The number of columns per row (required for bitmask conversion).
   */
  constructor(
    id: string,
    manufacturer: string,
    modelName: string,
    seatData: string | number[][],
    columns: number
  ) {
    this.id = id;
    this.manufacturer = manufacturer;
    this.modelName = modelName;
    this.seatBitmask = '';
    this.numberSeats = 0;
    this.matrix = null;
    this.columns = columns;

    // Determine if we are provided a bitmask or matrix
    if (typeof seatData === 'string') {
      this.seatBitmask = seatData;
      this.matrix = this.convertBitmaskToMatrix();
      this.numberSeats = this.calculateNumberOfSeats(this.matrix);
    } else {
      this.matrix = seatData;
      this.seatBitmask = this.convertMatrixToBitmask(seatData);
      this.numberSeats = this.calculateNumberOfSeats(seatData);
    }
  }

  /**
   * Converts a 2D seat matrix into a bitmask string.
   * @param matrix The 2D seat matrix where 1 represents a seat and 0 represents empty space.
   * @returns A bitmask string representing the seat matrix.
   */
  convertMatrixToBitmask(matrix: number[][]): string {
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
  convertBitmaskToMatrix(): number[][] {
    if (!this.seatBitmask) return [];

    const totalCells = this.seatBitmask.length;
    const rows = Math.ceil(totalCells / this.columns); // Calculate the number of rows
    const matrix: number[][] = [];

    // Slice the bitmask into rows
    for (let i = 0; i < rows; i++) {
      const row = this.seatBitmask
        .slice(i * this.columns, (i + 1) * this.columns)
        .split('')
        .map(Number);
      matrix.push(row);
    }

    return matrix;
  }

  /**
   * Calculates the number of seats (1s) in the matrix.
   * @param matrix The 2D seat matrix to count the seats from.
   * @returns The number of seats in the matrix.
   */
  calculateNumberOfSeats(matrix: number[][]): number {
    let count = 0;
    for (const row of matrix) {
      count += row.filter((cell) => cell === 1).length;
    }
    return count;
  }

  /**
   * Updates the seat matrix and recalculates the bitmask and seat count.
   * @param newMatrix The new 2D seat matrix to update the bus model with.
   */
  updateSeatMatrix(newMatrix: number[][]): void {
    this.matrix = newMatrix;
    this.seatBitmask = this.convertMatrixToBitmask(newMatrix);
    this.numberSeats = this.calculateNumberOfSeats(newMatrix);
  }

  /**
   * Returns the matrix of seats. If the matrix is not already calculated, it will be generated.
   * @returns The current 2D seat matrix.
   */
  getMatrix(): number[][] {
    if (this.matrix === null) {
      this.matrix = this.convertBitmaskToMatrix();
    }
    return this.matrix;
  }
}

// Driver export class using Resource via composition and including its own audit info
export class Driver {
  resource: Resource; // Composed Resource object
  name: string; // Driver's name
  licenseNumber: string; // Driver's license number
  contactInfo: { phone: string; email?: string }; // Driver's contact information
  auditInfo: AuditInfo; // Driver-specific audit information

  constructor(
    resourceId: string,
    permanentOwnerId: string,
    name: string,
    licenseNumber: string,
    contactInfo: { phone: string; email?: string },
    createdBy: string
  ) {
    this.resource = new Resource(
      resourceId,
      permanentOwnerId,
      false,
      createdBy
    );
    this.name = name;
    this.licenseNumber = licenseNumber;
    this.contactInfo = contactInfo;
    this.auditInfo = new AuditInfo(createdBy); // Initialize driver-specific audit info
  }
}
