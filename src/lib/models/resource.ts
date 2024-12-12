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
  status: StatusVehicles = ['idle', 'incoming', 'outgoing'][
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
    imageUrl: string,
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
    this.status = ['idle', 'incoming', 'outgoing'][
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
