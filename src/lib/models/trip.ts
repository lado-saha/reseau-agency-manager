import { Audit } from '@/lib/models/helpers';
import { Station } from './station';
import { Driver, Vehicle } from './resource';
import { User } from './user';

export interface TripResource {
  vehicle: Vehicle | string;
  driver: Driver | string;
  passengers: Passenger[] 
}

export interface Passenger {
  user: User | string,
  seatNumber: number
}
export interface Trip extends Audit {
  tripId: string; // Unique identifier for the trip
  fromStation: Station | string; // Origin station
  toStation: Station | string; // Destination station
  resources: TripResource[]; // List of vehicles and drivers assigned to the trip
  departureDateTime: Date; // Scheduled departure date and time
  expectedDateTime: Date; // Scheduled departure date and time
  arrivalDateTime?: Date; // Optional: Expected arrival date and time
  status: TripStatus,
  seatPrice: number,
  isVip: boolean,
  notes?:string,
}

 export type TripStatus= 'scheduled' | 'in-progress' | 'completed' | 'canceled'; // Trip status
