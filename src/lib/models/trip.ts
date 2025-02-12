import { Station } from '@/lib/models/agency';
import { Audit } from '@/lib/models/helpers';

export class Trip {
  tripId: string; // Unique identifier for the trip
  fromStation: Station; // Origin station
  toStation: Station; // Destination station
  auditInfo: Audit; // Trip-specific audit information
  vehicles: string[]; // List of vehicles assigned to the trip
  departureDateTime: Date; // Scheduled departure date and time
  arrivalDateTime?: Date; // Optional: Expected arrival date and time
  passengersCount: number; // Number of passengers on the trip

  constructor(
    tripId: string,
    fromStation: Station,
    toStation: Station,
    vehicles: string[],
    departureDateTime: Date,
    createdBy: string,
    passengersCount: number = 0 // Default to zero passengers
  ) {
    if (fromStation === toStation) {
      throw new Error(
        'The origin and destination stations cannot be the same.'
      );
    }

    this.tripId = tripId;
    this.fromStation = fromStation;
    this.toStation = toStation;
    this.auditInfo = new Audit(createdBy);
    this.vehicles = vehicles;
    this.departureDateTime = departureDateTime;
    this.passengersCount = passengersCount;
  }

  // Method to update audit info
  updateAuditInfo(updatedBy: string): void {
    this.auditInfo.updateAuditInfo(updatedBy);
  }

  // // Method to add a vehicle to the trip
  // addVehicle(vehicle: Vehicle): void {
  //   this.vehicles.push(vehicle);
  //   this.updateAuditInfo('System'); // Update audit info
  // }

  // // Method to remove a vehicle from the trip
  // removeVehicle(vehicleId: string): void {
  //   this.vehicles = this.vehicles.filter(
  //     (v) => v.resource.resourceId !== vehicleId
  //   );
  //   this.updateAuditInfo('System'); // Update audit info
  // }

  // // Method to update the departure date and time
  // updateDepartureDateTime(newDateTime: Date): void {
  //   if (newDateTime < new Date()) {
  //     throw new Error('Departure date and time cannot be in the past.');
  //   }
  //   this.departureDateTime = newDateTime;
  //   this.updateAuditInfo('System');
  // }

  // // Method to update the expected arrival date and time
  // updateArrivalDateTime(newDateTime: Date): void {
  //   if (newDateTime <= this.departureDateTime) {
  //     throw new Error(
  //       'Arrival date and time must be after the departure date and time.'
  //     );
  //   }
  //   this.arrivalDateTime = newDateTime;
  //   this.updateAuditInfo('System');
  // }

  // // Method to update the passenger count
  // updatePassengerCount(newCount: number): void {
  //   if (newCount < 0) {
  //     throw new Error('Passenger count cannot be negative.');
  //   }
  //   this.passengersCount = newCount;
  //   this.updateAuditInfo('System');
  // }
}
