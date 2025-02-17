import { Audit } from '@/lib/models/helpers';
import { Driver, Vehicle } from './resource';
import { User } from './user';
import { Station } from './station';

export interface TripResource {
  index: number,
  vehicle: Vehicle | string;
  driver: Driver | string;
  passengers: Passenger[]
}

export interface Passenger {
  user: User | string,
  seatNumber: number
}

export interface Trip extends Audit {
  id: string; // Unique identifier for the trip
  fromStation: Station | string; // Origin station
  toStation: Station | string; // Destination station
  resources: TripResource[]; // List of vehicles and drivers assigned to the trip
  departureTime: Date; // Scheduled departure date and time
  expectedArrivalTime: Date; // Scheduled departure date and time
  arrivalTime?: Date; // Optional: Expected arrival date and time
  status: TripStatus,
  seatPrice: number,
  isVip: boolean,
  notes?: string,
}

export type TripStatus =
  | 'scheduled'
  | 'in-progress'
  | 'completed'
  | 'canceled'; // Trip status

export const TRIP_STATUS = [
  'scheduled'
  , 'in-progress'
  , 'completed'
  , 'canceled'
] as const


export const TRIP_STATUS_OPTIONS = TRIP_STATUS.map((status) => ({
  value: status,
  label: status
    .replace(/-/g, ' ') // Replace dashes with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()), // Capitalize first letter of each word
}));

