import { JsonRepository } from '@/lib/repository/JsonRepository';
import { Agency, Station } from '@/lib/models/agency';
import { GeoLocation } from '@/lib/models/helpers';
import { Vehicle } from '@/lib/models/resource';
import { Trip } from '@/lib/models/trip';

export async function runSeed() {
  // Initialize the repository
  const repositories = JsonRepository.initRepositories();

  // Create Mock Agency
  const agency = new Agency(
    'agency1',
    'MetroTransport',
    'Connecting Cities with Care',
    'https://metrotransport.com/logo.png',
    { phone: '123-456-7890', email: 'contact@metrotransport.com' },
    'admin',
    { operatingHours: '9 AM - 9 PM' }
  );

  // Save agency to JSON repository
  repositories.agencies.save(agency);

  // Create Mock Stations
  const station1 = new Station(
    'Downtown Station',
    agency,
    new GeoLocation('Country A', 'Region 1', 'City X', 'Downtown', {
      latitude: 12.9716,
      longitude: 77.5946
    }),
    [
      'https://station1-photo.com/image1.png',
      'https://station1-photo.com/image2.png'
    ],
    { operatingHours: '9 AM - 9 PM' },
    'admin'
  );

  const station2 = new Station(
    'Central Park Station',
    agency,
    new GeoLocation('Country A', 'Region 1', 'City Y', 'Central Park', {
      latitude: 12.9716,
      longitude: 77.595
    }),
    [
      'https://station2-photo.com/image1.png',
      'https://station2-photo.com/image2.png'
    ],
    { operatingHours: '9 AM - 9 PM' },
    'admin'
  );

  const station3 = new Station(
    'East End Station',
    agency,
    new GeoLocation('Country A', 'Region 3', 'City Z', 'East End', {
      latitude: 12.973,
      longitude: 77.598
    }),
    [
      'https://station3-photo.com/image1.png',
      'https://station3-photo.com/image2.png'
    ],
    { operatingHours: '9 AM - 9 PM' },
    'admin'
  );

  // Save stations to JSON repository
  repositories.stations.save(station1);
  repositories.stations.save(station2);
  repositories.stations.save(station3);

  // Create Mock Vehicles (Buses)
  const bus1 = new Vehicle(
    'vehicle1',
    agency.agencyId,
    'AB1234',
    40,
    'Bus Model X',
    { latitude: 12.9716, longitude: 77.5946 },
    'admin'
  );

  const bus2 = new Vehicle(
    'vehicle2',
    agency.agencyId,
    'BC2345',
    45,
    'Bus Model Y',
    { latitude: 12.9725, longitude: 77.5955 },
    'admin'
  );

  const bus3 = new Vehicle(
    'vehicle3',
    agency.agencyId,
    'CD3456',
    50,
    'Bus Model Z',
    { latitude: 12.973, longitude: 77.596 },
    'admin'
  );

  const bus4 = new Vehicle(
    'vehicle4',
    agency.agencyId,
    'DE4567',
    40,
    'Bus Model A',
    { latitude: 12.974, longitude: 77.597 },
    'admin'
  );

  const bus5 = new Vehicle(
    'vehicle5',
    agency.agencyId,
    'EF5678',
    40,
    'Bus Model B',
    { latitude: 12.975, longitude: 77.5985 },
    'admin'
  );

  const bus6 = new Vehicle(
    'vehicle6',
    agency.agencyId,
    'FG6789',
    50,
    'Bus Model C',
    { latitude: 12.976, longitude: 77.599 },
    'admin'
  );

  // Save vehicles to JSON repository
  repositories.vehicles.save(bus1);
  repositories.vehicles.save(bus2);
  repositories.vehicles.save(bus3);
  repositories.vehicles.save(bus4);
  repositories.vehicles.save(bus5);
  repositories.vehicles.save(bus6);

  // Create Mock Trips
  const trip1 = new Trip(
    'trip1',
    station1,
    station2,
    [bus1.resource.resourceId, bus2.resource.resourceId],
    new Date('2024-12-15T08:00:00'),
    'admin',
    100
  );

  const trip2 = new Trip(
    'trip2',
    station2,
    station3,
    [bus3.resource.resourceId, bus4.resource.resourceId],
    new Date('2024-12-15T10:00:00'),
    'admin',
    120
  );

  const trip3 = new Trip(
    'trip3',
    station1,
    station3,
    [bus5.resource.resourceId, bus6.resource.resourceId],
    new Date('2024-12-15T12:00:00'),
    'admin',
    80
  );

  const trip4 = new Trip(
    'trip4',
    station2,
    station1,
    [bus1.resource.resourceId, bus5.resource.resourceId],
    new Date('2024-12-16T08:00:00'),
    'admin',
    110
  );

  const trip5 = new Trip(
    'trip5',
    station3,
    station2,
    [bus2.resource.resourceId, bus6.resource.resourceId],
    new Date('2024-12-16T09:00:00'),
    'admin',
    90
  );

  // Save trips to JSON repository
  repositories.trips.save(trip1);
  repositories.trips.save(trip2);
  repositories.trips.save(trip3);
  repositories.trips.save(trip4);
  repositories.trips.save(trip5);

  // Temporary Ownership Assignment (between stations and vehicles)
  bus1.resource.tempOwnerId = station1.agency.agencyId;
  bus1.resource.tempOwnershipStartTime = new Date('2024-12-15T07:00:00');
  bus1.resource.tempOwnershipEndTime = new Date('2024-12-15T09:00:00');
  repositories.vehicles.update('immatriculation', bus1.immatriculation, bus1);

  bus2.resource.tempOwnerId = station2.agency.agencyId;
  bus2.resource.tempOwnershipStartTime = new Date('2024-12-15T09:00:00');
  bus2.resource.tempOwnershipEndTime = new Date('2024-12-15T11:00:00');
  repositories.vehicles.update('immatriculation', bus2.immatriculation, bus2);

  bus3.resource.tempOwnerId = station3.agency.agencyId;
  bus3.resource.tempOwnershipStartTime = new Date('2024-12-15T10:00:00');
  bus3.resource.tempOwnershipEndTime = new Date('2024-12-15T12:00:00');
  repositories.vehicles.update('immatriculation', bus3.immatriculation, bus3);

  console.log('Mock data successfully written to the JSON repository.');
}
