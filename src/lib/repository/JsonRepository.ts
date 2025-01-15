import path from 'path';
import { Agency, Station } from '../models/agency';
import { Vehicle, Driver } from '@/lib/models/resource';
import { Trip } from '@/lib/models/trip';
import { format } from 'date-fns';
import { SortingDirection, sortVehicles } from '@/lib/models/helpers';
import { PAGE_OFFSET } from '../utils';

// const vehicleJSON = [
//   {
//     resource: {
//       resourceId: 'vehicle1',
//       permanentOwnerId: 'agency1',
//       tempOwnerId: 'agency1',
//       tempOwnershipStartTime: '2024-12-15T06:00:00.000Z',
//       tempOwnershipEndTime: '2024-12-15T08:00:00.000Z',
//       isUnderMaintenance: false,
//       auditInfo: {
//         createdOn: '2024-12-10T12:50:09.170Z',
//         updatedOn: '2024-12-10T12:50:09.170Z',
//         createdBy: 'admin',
//         updatedBy: 'admin'
//       }
//     },
//     immatriculation: 'AB1234',
//     nbSeats: 40,
//     model: 'Bus Model X',
//     positionGps: {
//       latitude: 12.9716,
//       longitude: 77.5946
//     },
//     status: 'stationed',
//     health: 'normal',
//     occupiedSeats: 20,
//     arrivedOn: '2024-12-10T08:45:00.000Z',
//     arrivedFrom: 'Town A',
//     departureDetails: null,
//     auditInfo: {
//       createdOn: '2024-12-10T12:50:09.170Z',
//       updatedOn: '2024-12-10T12:50:09.170Z',
//       createdBy: 'admin',
//       updatedBy: 'admin'
//     }
//   },
//   {
//     resource: {
//       resourceId: 'vehicle2',
//       permanentOwnerId: 'agency1',
//       tempOwnerId: 'agency1',
//       tempOwnershipStartTime: '2024-12-15T08:00:00.000Z',
//       tempOwnershipEndTime: '2024-12-15T10:00:00.000Z',
//       isUnderMaintenance: false,
//       auditInfo: {
//         createdOn: '2024-12-10T12:50:09.170Z',
//         updatedOn: '2024-12-10T12:50:09.170Z',
//         createdBy: 'admin',
//         updatedBy: 'admin'
//       }
//     },
//     immatriculation: 'BC2345',
//     nbSeats: 45,
//     model: 'Bus Model Y',
//     positionGps: {
//       latitude: 12.9725,
//       longitude: 77.5955
//     },
//     status: 'incoming',
//     health: 'damaged',
//     occupiedSeats: 15,
//     arrivalDetails: null,
//     origin: 'Town B',
//     departureTime: '2024-12-10T09:30:00.000Z',
//     estimatedArrivalTime: '2024-12-10T10:30:00.000Z',
//     auditInfo: {
//       createdOn: '2024-12-10T12:50:09.170Z',
//       updatedOn: '2024-12-10T12:50:09.170Z',
//       createdBy: 'admin',
//       updatedBy: 'admin'
//     }
//   },
//   {
//     resource: {
//       resourceId: 'vehicle3',
//       permanentOwnerId: 'agency1',
//       tempOwnerId: 'agency1',
//       tempOwnershipStartTime: '2024-12-15T09:00:00.000Z',
//       tempOwnershipEndTime: '2024-12-15T11:00:00.000Z',
//       isUnderMaintenance: false,
//       auditInfo: {
//         createdOn: '2024-12-10T12:50:09.170Z',
//         updatedOn: '2024-12-10T12:50:09.170Z',
//         createdBy: 'admin',
//         updatedBy: 'admin'
//       }
//     },
//     immatriculation: 'CD3456',
//     nbSeats: 50,
//     model: 'Bus Model Z',
//     positionGps: {
//       latitude: 12.973,
//       longitude: 77.596
//     },
//     status: 'outgoing',
//     health: 'repairing',
//     occupiedSeats: 30,
//     destination: 'Town C',
//     departureTime: '2024-12-10T15:00:00.000Z',
//     estimatedArrivalTime: '2024-12-10T16:30:00.000Z',
//     auditInfo: {
//       createdOn: '2024-12-10T12:50:09.170Z',
//       updatedOn: '2024-12-10T12:50:09.170Z',
//       createdBy: 'admin',
//       updatedBy: 'admin'
//     }
//   },
//   {
//     resource: {
//       resourceId: 'vehicle7',
//       permanentOwnerId: 'agency2',
//       tempOwnerId: 'agency2',
//       tempOwnershipStartTime: '2024-12-15T10:00:00.000Z',
//       tempOwnershipEndTime: '2024-12-15T12:00:00.000Z',
//       isUnderMaintenance: false,
//       auditInfo: {
//         createdOn: '2024-12-11T09:00:00.000Z',
//         updatedOn: '2024-12-11T09:00:00.000Z',
//         createdBy: 'manager',
//         updatedBy: 'manager'
//       }
//     },
//     immatriculation: 'GH7890',
//     nbSeats: 60,
//     model: 'Bus Model D',
//     positionGps: {
//       latitude: 12.978,
//       longitude: 77.6
//     },
//     status: 'incoming',
//     health: 'normal',
//     occupiedSeats: 25,
//     arrivalDetails: null,
//     origin: 'City A',
//     departureTime: '2024-12-11T08:30:00.000Z',
//     estimatedArrivalTime: '2024-12-11T09:30:00.000Z',
//     auditInfo: {
//       createdOn: '2024-12-11T09:00:00.000Z',
//       updatedOn: '2024-12-11T09:00:00.000Z',
//       createdBy: 'manager',
//       updatedBy: 'manager'
//     }
//   },
//   {
//     resource: {
//       resourceId: 'vehicle8',
//       permanentOwnerId: 'agency2',
//       tempOwnerId: 'agency2',
//       tempOwnershipStartTime: '2024-12-15T12:00:00.000Z',
//       tempOwnershipEndTime: '2024-12-15T14:00:00.000Z',
//       isUnderMaintenance: false,
//       auditInfo: {
//         createdOn: '2024-12-11T09:30:00.000Z',
//         updatedOn: '2024-12-11T09:30:00.000Z',
//         createdBy: 'manager',
//         updatedBy: 'manager'
//       }
//     },
//     immatriculation: 'IJ8901',
//     nbSeats: 50,
//     model: 'Bus Model E',
//     positionGps: {
//       latitude: 12.979,
//       longitude: 77.601
//     },
//     status: 'outgoing',
//     health: 'normal',
//     occupiedSeats: 40,
//     arrivalDetails: null,
//     destination: 'City B',
//     departureTime: '2024-12-11T10:00:00.000Z',
//     estimatedArrivalTime: '2024-12-11T11:30:00.000Z',
//     auditInfo: {
//       createdOn: '2024-12-11T09:30:00.000Z',
//       updatedOn: '2024-12-11T09:30:00.000Z',
//       createdBy: 'manager',
//       updatedBy: 'manager'
//     }
//   },
//   {
//     resource: {
//       resourceId: 'vehicle9',
//       permanentOwnerId: 'agency3',
//       tempOwnerId: 'agency3',
//       tempOwnershipStartTime: '2024-12-16T06:00:00.000Z',
//       tempOwnershipEndTime: '2024-12-16T08:00:00.000Z',
//       isUnderMaintenance: true,
//       auditInfo: {
//         createdOn: '2024-12-11T10:00:00.000Z',
//         updatedOn: '2024-12-11T10:00:00.000Z',
//         createdBy: 'admin',
//         updatedBy: 'admin'
//       }
//     },
//     immatriculation: 'KL9012',
//     nbSeats: 55,
//     model: 'Bus Model F',
//     positionGps: {
//       latitude: 12.98,
//       longitude: 77.602
//     },
//     status: 'stationed',
//     health: 'repairing',
//     occupiedSeats: 0,
//     arrivedOn: '2024-12-11T06:30:00.000Z',
//     arrivedFrom: 'City C',
//     auditInfo: {
//       createdOn: '2024-12-11T10:00:00.000Z',
//       updatedOn: '2024-12-11T10:00:00.000Z',
//       createdBy: 'admin',
//       updatedBy: 'admin'
//     }
//   },
//   {
//     resource: {
//       resourceId: 'vehicle10',
//       permanentOwnerId: 'agency3',
//       isUnderMaintenance: false,
//       auditInfo: {
//         createdOn: '2024-12-11T10:30:00.000Z',
//         updatedOn: '2024-12-11T10:30:00.000Z',
//         createdBy: 'supervisor',
//         updatedBy: 'supervisor'
//       }
//     },
//     immatriculation: 'MN0123',
//     nbSeats: 45,
//     model: 'Bus Model G',
//     positionGps: {
//       latitude: 12.981,
//       longitude: 77.603
//     },
//     status: 'incoming',
//     health: 'normal',
//     occupiedSeats: 10,
//     origin: 'City D',
//     departureTime: '2024-12-11T11:00:00.000Z',
//     estimatedArrivalTime: '2024-12-11T12:30:00.000Z',
//     auditInfo: {
//       createdOn: '2024-12-11T10:30:00.000Z',
//       updatedOn: '2024-12-11T10:30:00.000Z',
//       createdBy: 'supervisor',
//       updatedBy: 'supervisor'
//     }
//   },
//   {
//     resource: {
//       resourceId: 'vehicle11',
//       permanentOwnerId: 'agency4',
//       isUnderMaintenance: false,
//       auditInfo: {
//         createdOn: '2024-12-11T11:00:00.000Z',
//         updatedOn: '2024-12-11T11:00:00.000Z',
//         createdBy: 'supervisor',
//         updatedBy: 'supervisor'
//       }
//     },
//     immatriculation: 'OP1234',
//     nbSeats: 70,
//     model: 'Bus Model H',
//     positionGps: {
//       latitude: 12.982,
//       longitude: 77.604
//     },
//     status: 'outgoing',
//     health: 'normal',
//     occupiedSeats: 60,
//     destination: 'City E',
//     departureTime: '2024-12-11T12:00:00.000Z',
//     estimatedArrivalTime: '2024-12-11T13:30:00.000Z',
//     auditInfo: {
//       createdOn: '2024-12-11T11:00:00.000Z',
//       updatedOn: '2024-12-11T11:00:00.000Z',
//       createdBy: 'supervisor',
//       updatedBy: 'supervisor'
//     }
//   },
//   // Existing vehicles...

//   // New vehicles
//   {
//     resource: {
//       resourceId: 'vehicle12',
//       permanentOwnerId: 'agency5',
//       tempOwnerId: 'agency5',
//       tempOwnershipStartTime: '2024-12-16T08:00:00.000Z',
//       tempOwnershipEndTime: '2024-12-16T10:00:00.000Z',
//       isUnderMaintenance: false,
//       auditInfo: {
//         createdOn: '2024-12-12T09:00:00.000Z',
//         updatedOn: '2024-12-12T09:00:00.000Z',
//         createdBy: 'supervisor',
//         updatedBy: 'supervisor'
//       }
//     },
//     immatriculation: 'QR2345',
//     nbSeats: 40,
//     model: 'Bus Model I',
//     positionGps: {
//       latitude: 12.983,
//       longitude: 77.605
//     },
//     status: 'stationed',
//     health: 'normal',
//     occupiedSeats: 0,
//     arrivedOn: '2024-12-12T07:30:00.000Z',
//     arrivedFrom: 'City F',
//     auditInfo: {
//       createdOn: '2024-12-12T09:00:00.000Z',
//       updatedOn: '2024-12-12T09:00:00.000Z',
//       createdBy: 'supervisor',
//       updatedBy: 'supervisor'
//     }
//   },
//   {
//     resource: {
//       resourceId: 'vehicle13',
//       permanentOwnerId: 'agency6',
//       tempOwnerId: 'agency6',
//       tempOwnershipStartTime: '2024-12-16T10:00:00.000Z',
//       tempOwnershipEndTime: '2024-12-16T12:00:00.000Z',
//       isUnderMaintenance: false,
//       auditInfo: {
//         createdOn: '2024-12-12T10:00:00.000Z',
//         updatedOn: '2024-12-12T10:00:00.000Z',
//         createdBy: 'manager',
//         updatedBy: 'manager'
//       }
//     },
//     immatriculation: 'ST3456',
//     nbSeats: 50,
//     model: 'Bus Model J',
//     positionGps: {
//       latitude: 12.984,
//       longitude: 77.606
//     },
//     status: 'incoming',
//     health: 'normal',
//     occupiedSeats: 20,
//     origin: 'City G',
//     departureTime: '2024-12-12T08:30:00.000Z',
//     estimatedArrivalTime: '2024-12-12T09:30:00.000Z',
//     auditInfo: {
//       createdOn: '2024-12-12T10:00:00.000Z',
//       updatedOn: '2024-12-12T10:00:00.000Z',
//       createdBy: 'manager',
//       updatedBy: 'manager'
//     }
//   },
//   {
//     resource: {
//       resourceId: 'vehicle14',
//       permanentOwnerId: 'agency7',
//       isUnderMaintenance: true,
//       auditInfo: {
//         createdOn: '2024-12-12T10:30:00.000Z',
//         updatedOn: '2024-12-12T10:30:00.000Z',
//         createdBy: 'admin',
//         updatedBy: 'admin'
//       }
//     },
//     immatriculation: 'UV4567',
//     nbSeats: 55,
//     model: 'Bus Model K',
//     positionGps: {
//       latitude: 12.985,
//       longitude: 77.607
//     },
//     status: 'repairing',
//     health: 'damaged',
//     occupiedSeats: 0,
//     arrivedOn: '2024-12-12T09:00:00.000Z',
//     arrivedFrom: 'City H',
//     auditInfo: {
//       createdOn: '2024-12-12T10:30:00.000Z',
//       updatedOn: '2024-12-12T10:30:00.000Z',
//       createdBy: 'admin',
//       updatedBy: 'admin'
//     }
//   },
//   {
//     resource: {
//       resourceId: 'vehicle15',
//       permanentOwnerId: 'agency7',
//       isUnderMaintenance: false,
//       auditInfo: {
//         createdOn: '2024-12-12T11:00:00.000Z',
//         updatedOn: '2024-12-12T11:00:00.000Z',
//         createdBy: 'admin',
//         updatedBy: 'admin'
//       }
//     },
//     immatriculation: 'WX5678',
//     nbSeats: 45,
//     model: 'Bus Model L',
//     positionGps: {
//       latitude: 12.986,
//       longitude: 77.608
//     },
//     status: 'outgoing',
//     health: 'normal',
//     occupiedSeats: 35,
//     destination: 'City I',
//     departureTime: '2024-12-12T10:00:00.000Z',
//     estimatedArrivalTime: '2024-12-12T11:30:00.000Z',
//     auditInfo: {
//       createdOn: '2024-12-12T11:00:00.000Z',
//       updatedOn: '2024-12-12T11:00:00.000Z',
//       createdBy: 'admin',
//       updatedBy: 'admin'
//     }
//   },
//   {
//     resource: {
//       resourceId: 'vehicle16',
//       permanentOwnerId: 'agency8',
//       isUnderMaintenance: false,
//       auditInfo: {
//         createdOn: '2024-12-12T11:30:00.000Z',
//         updatedOn: '2024-12-12T11:30:00.000Z',
//         createdBy: 'supervisor',
//         updatedBy: 'supervisor'
//       }
//     },
//     immatriculation: 'YZ6789',
//     nbSeats: 60,
//     model: 'Bus Model M',
//     positionGps: {
//       latitude: 12.987,
//       longitude: 77.609
//     },
//     status: 'incoming',
//     health: 'normal',
//     occupiedSeats: 50,
//     origin: 'City J',
//     departureTime: '2024-12-12T12:00:00.000Z',
//     estimatedArrivalTime: '2024-12-12T13:30:00.000Z',
//     auditInfo: {
//       createdOn: '2024-12-12T11:30:00.000Z',
//       updatedOn: '2024-12-12T11:30:00.000Z',
//       createdBy: 'supervisor',
//       updatedBy: 'supervisor'
//     }
//   },
//   {
//     resource: {
//       resourceId: 'vehicle17',
//       permanentOwnerId: 'agency8',
//       isUnderMaintenance: false,
//       auditInfo: {
//         createdOn: '2024-12-12T12:00:00.000Z',
//         updatedOn: '2024-12-12T12:00:00.000Z',
//         createdBy: 'supervisor',
//         updatedBy: 'supervisor'
//       }
//     },
//     immatriculation: 'AB7890',
//     nbSeats: 40,
//     model: 'Bus Model N',
//     positionGps: {
//       latitude: 12.988,
//       longitude: 77.61
//     },
//     status: 'outgoing',
//     health: 'normal',
//     occupiedSeats: 25,
//     destination: 'City K',
//     departureTime: '2024-12-12T14:00:00.000Z',
//     estimatedArrivalTime: '2024-12-12T15:30:00.000Z',
//     auditInfo: {
//       createdOn: '2024-12-12T12:00:00.000Z',
//       updatedOn: '2024-12-12T12:00:00.000Z',
//       createdBy: 'supervisor',
//       updatedBy: 'supervisor'
//     }
//   },
//   {
//     resource: {
//       resourceId: 'vehicle18',
//       permanentOwnerId: 'agency9',
//       isUnderMaintenance: true,
//       auditInfo: {
//         createdOn: '2024-12-12T12:30:00.000Z',
//         updatedOn: '2024-12-12T12:30:00.000Z',
//         createdBy: 'manager',
//         updatedBy: 'manager'
//       }
//     },
//     immatriculation: 'CD8901',
//     nbSeats: 50,
//     model: 'Bus Model O',
//     positionGps: {
//       latitude: 12.989,
//       longitude: 77.611
//     },
//     status: 'repairing',
//     health: 'damaged',
//     occupiedSeats: 0,
//     arrivedOn: '2024-12-12T11:30:00.000Z',
//     arrivedFrom: 'City L',
//     auditInfo: {
//       createdOn: '2024-12-12T12:30:00.000Z',
//       updatedOn: '2024-12-12T12:30:00.000Z',
//       createdBy: 'manager',
//       updatedBy: 'manager'
//     }
//   },
//   {
//     resource: {
//       resourceId: 'vehicle19',
//       permanentOwnerId: 'agency9',
//       isUnderMaintenance: false,
//       auditInfo: {
//         createdOn: '2024-12-12T13:00:00.000Z',
//         updatedOn: '2024-12-12T13:00:00.000Z',
//         createdBy: 'manager',
//         updatedBy: 'manager'
//       }
//     },
//     immatriculation: 'EF9012',
//     nbSeats: 70,
//     model: 'Bus Model P',
//     positionGps: {
//       latitude: 12.99,
//       longitude: 77.612
//     },
//     status: 'stationed',
//     health: 'normal',
//     occupiedSeats: 0,
//     arrivedOn: '2024-12-12T10:30:00.000Z',
//     arrivedFrom: 'City M',
//     auditInfo: {
//       createdOn: '2024-12-12T13:00:00.000Z',
//       updatedOn: '2024-12-12T13:00:00.000Z',
//       createdBy: 'manager',
//       updatedBy: 'manager'
//     }
//   }
// ];
const vehicleJSON = [
  {
    resource: {
      resourceId: 'vehicle1',
      permanentOwnerId: 'agency1',
      tempOwnerId: 'agency1',
      tempOwnershipStartTime: format(
        new Date('2024-12-15T06:00:00.000Z'),
        'Pp'
      ),
      tempOwnershipEndTime: format(new Date('2024-12-15T08:00:00.000Z'), 'Pp'),
      isUnderMaintenance: false,
      auditInfo: {
        createdOn: format(new Date('2024-12-10T12:50:09.170Z'), 'Pp'),
        updatedOn: format(new Date('2024-12-10T12:50:09.170Z'), 'Pp'),
        createdBy: 'admin',
        updatedBy: 'admin'
      }
    },
    immatriculation: 'AB1234',
    nbSeats: 40,
    model: 'Bus Model X',
    positionGps: {
      latitude: 12.9716,
      longitude: 77.5946
    },
    status: 'stationed',
    health: 'normal',
    occupiedSeats: 20,
    arrivedOn: format(new Date('2024-12-10T08:45:00.000Z'), 'Pp'),
    arrivedFrom: 'Town A',
    departureDetails: null,
    auditInfo: {
      createdOn: format(new Date('2024-12-10T12:50:09.170Z'), 'Pp'),
      updatedOn: format(new Date('2024-12-10T12:50:09.170Z'), 'Pp'),
      createdBy: 'admin',
      updatedBy: 'admin'
    }
  },
  {
    resource: {
      resourceId: 'vehicle2',
      permanentOwnerId: 'agency1',
      tempOwnerId: 'agency1',
      tempOwnershipStartTime: format(
        new Date('2024-12-15T08:00:00.000Z'),
        'Pp'
      ),
      tempOwnershipEndTime: format(new Date('2024-12-15T10:00:00.000Z'), 'Pp'),
      isUnderMaintenance: false,
      auditInfo: {
        createdOn: format(new Date('2024-12-10T12:50:09.170Z'), 'Pp'),
        updatedOn: format(new Date('2024-12-10T12:50:09.170Z'), 'Pp'),
        createdBy: 'admin',
        updatedBy: 'admin'
      }
    },
    immatriculation: 'BC2345',
    nbSeats: 45,
    model: 'Bus Model Y',
    positionGps: {
      latitude: 12.9725,
      longitude: 77.5955
    },
    status: 'incoming',
    health: 'damaged',
    occupiedSeats: 15,
    arrivalDetails: null,
    origin: 'Town B',
    departureTime: format(new Date('2024-12-10T09:30:00.000Z'), 'Pp'),
    estimatedArrivalTime: format(new Date('2024-12-10T10:30:00.000Z'), 'Pp'),
    auditInfo: {
      createdOn: format(new Date('2024-12-10T12:50:09.170Z'), 'Pp'),
      updatedOn: format(new Date('2024-12-10T12:50:09.170Z'), 'Pp'),
      createdBy: 'admin',
      updatedBy: 'admin'
    }
  },
  {
    resource: {
      resourceId: 'vehicle3',
      permanentOwnerId: 'agency1',
      tempOwnerId: 'agency1',
      tempOwnershipStartTime: format(
        new Date('2024-12-15T09:00:00.000Z'),
        'Pp'
      ),
      tempOwnershipEndTime: format(new Date('2024-12-15T11:00:00.000Z'), 'Pp'),
      isUnderMaintenance: false,
      auditInfo: {
        createdOn: format(new Date('2024-12-10T12:50:09.170Z'), 'Pp'),
        updatedOn: format(new Date('2024-12-10T12:50:09.170Z'), 'Pp'),
        createdBy: 'admin',
        updatedBy: 'admin'
      }
    },
    immatriculation: 'CD3456',
    nbSeats: 50,
    model: 'Bus Model Z',
    positionGps: {
      latitude: 12.973,
      longitude: 77.596
    },
    status: 'outgoing',
    health: 'repairing',
    occupiedSeats: 30,
    destination: 'Town C',
    departureTime: format(new Date('2024-12-10T15:00:00.000Z'), 'Pp'),
    estimatedArrivalTime: format(new Date('2024-12-10T16:30:00.000Z'), 'Pp'),
    auditInfo: {
      createdOn: format(new Date('2024-12-10T12:50:09.170Z'), 'Pp'),
      updatedOn: format(new Date('2024-12-10T12:50:09.170Z'), 'Pp'),
      createdBy: 'admin',
      updatedBy: 'admin'
    }
  },
  {
    resource: {
      resourceId: 'vehicle7',
      permanentOwnerId: 'agency2',
      tempOwnerId: 'agency2',
      tempOwnershipStartTime: format(
        new Date('2024-12-15T10:00:00.000Z'),
        'Pp'
      ),
      tempOwnershipEndTime: format(new Date('2024-12-15T12:00:00.000Z'), 'Pp'),
      isUnderMaintenance: false,
      auditInfo: {
        createdOn: format(new Date('2024-12-11T09:00:00.000Z'), 'Pp'),
        updatedOn: format(new Date('2024-12-11T09:00:00.000Z'), 'Pp'),
        createdBy: 'manager',
        updatedBy: 'manager'
      }
    },
    immatriculation: 'GH7890',
    nbSeats: 60,
    model: 'Bus Model D',
    positionGps: {
      latitude: 12.978,
      longitude: 77.6
    },
    status: 'incoming',
    health: 'normal',
    occupiedSeats: 25,
    arrivalDetails: null,
    origin: 'City A',
    departureTime: format(new Date('2024-12-11T08:30:00.000Z'), 'Pp'),
    estimatedArrivalTime: format(new Date('2024-12-11T09:30:00.000Z'), 'Pp'),
    auditInfo: {
      createdOn: format(new Date('2024-12-11T09:00:00.000Z'), 'Pp'),
      updatedOn: format(new Date('2024-12-11T09:00:00.000Z'), 'Pp'),
      createdBy: 'manager',
      updatedBy: 'manager'
    }
  },
  {
    resource: {
      resourceId: 'vehicle8',
      permanentOwnerId: 'agency2',
      tempOwnerId: 'agency2',
      tempOwnershipStartTime: format(
        new Date('2024-12-15T12:00:00.000Z'),
        'Pp'
      ),
      tempOwnershipEndTime: format(new Date('2024-12-15T14:00:00.000Z'), 'Pp'),
      isUnderMaintenance: false,
      auditInfo: {
        createdOn: format(new Date('2024-12-11T09:30:00.000Z'), 'Pp'),
        updatedOn: format(new Date('2024-12-11T09:30:00.000Z'), 'Pp'),
        createdBy: 'manager',
        updatedBy: 'manager'
      }
    },
    immatriculation: 'IJ8901',
    nbSeats: 50,
    model: 'Bus Model E',
    positionGps: {
      latitude: 12.979,
      longitude: 77.601
    },
    status: 'outgoing',
    health: 'normal',
    occupiedSeats: 40,
    arrivalDetails: null,
    destination: 'City B',
    departureTime: format(new Date('2024-12-11T10:00:00.000Z'), 'Pp'),
    estimatedArrivalTime: format(new Date('2024-12-11T11:30:00.000Z'), 'Pp'),
    auditInfo: {
      createdOn: format(new Date('2024-12-11T09:30:00.000Z'), 'Pp'),
      updatedOn: format(new Date('2024-12-11T09:30:00.000Z'), 'Pp'),
      createdBy: 'manager',
      updatedBy: 'manager'
    }
  },
  {
    resource: {
      resourceId: 'vehicle9',
      permanentOwnerId: 'agency3',
      tempOwnerId: 'agency3',
      tempOwnershipStartTime: format(
        new Date('2024-12-16T06:00:00.000Z'),
        'Pp'
      ),
      tempOwnershipEndTime: format(new Date('2024-12-16T08:00:00.000Z'), 'Pp'),
      isUnderMaintenance: true,
      auditInfo: {
        createdOn: format(new Date('2024-12-11T10:00:00.000Z'), 'Pp'),
        updatedOn: format(new Date('2024-12-11T10:00:00.000Z'), 'Pp'),
        createdBy: 'admin',
        updatedBy: 'admin'
      }
    },
    immatriculation: 'KL9012',
    nbSeats: 55,
    model: 'Bus Model F',
    positionGps: {
      latitude: 12.98,
      longitude: 77.602
    },
    status: 'stationed',
    health: 'repairing',
    occupiedSeats: 0,
    arrivedOn: format(new Date('2024-12-11T06:30:00.000Z'), 'Pp'),
    arrivedFrom: 'City C',
    auditInfo: {
      createdOn: format(new Date('2024-12-11T10:00:00.000Z'), 'Pp'),
      updatedOn: format(new Date('2024-12-11T10:00:00.000Z'), 'Pp'),
      createdBy: 'admin',
      updatedBy: 'admin'
    }
  },
  {
    resource: {
      resourceId: 'vehicle10',
      permanentOwnerId: 'agency3',
      isUnderMaintenance: false,
      auditInfo: {
        createdOn: format(new Date('2024-12-11T10:30:00.000Z'), 'Pp'),
        updatedOn: format(new Date('2024-12-11T10:30:00.000Z'), 'Pp'),
        createdBy: 'supervisor',
        updatedBy: 'supervisor'
      }
    },
    immatriculation: 'MN0123',
    nbSeats: 45,
    model: 'Bus Model G',
    positionGps: {
      latitude: 12.981,
      longitude: 77.603
    },
    status: 'incoming',
    health: 'normal',
    occupiedSeats: 10,
    origin: 'City D',
    departureTime: format(new Date('2024-12-11T11:00:00.000Z'), 'Pp'),
    estimatedArrivalTime: format(new Date('2024-12-11T12:30:00.000Z'), 'Pp'),
    auditInfo: {
      createdOn: format(new Date('2024-12-11T10:30:00.000Z'), 'Pp'),
      updatedOn: format(new Date('2024-12-11T10:30:00.000Z'), 'Pp'),
      createdBy: 'supervisor',
      updatedBy: 'supervisor'
    }
  },
  {
    resource: {
      resourceId: 'vehicle11',
      permanentOwnerId: 'agency4',
      isUnderMaintenance: false,
      auditInfo: {
        createdOn: format(new Date('2024-12-11T11:00:00.000Z'), 'Pp'),
        updatedOn: format(new Date('2024-12-11T11:00:00.000Z'), 'Pp'),
        createdBy: 'supervisor',
        updatedBy: 'supervisor'
      }
    },
    immatriculation: 'OP1234',
    nbSeats: 70,
    model: 'Bus Model H',
    positionGps: {
      latitude: 12.982,
      longitude: 77.604
    },
    status: 'outgoing',
    health: 'normal',
    occupiedSeats: 60,
    destination: 'City E',
    departureTime: format(new Date('2024-12-11T12:00:00.000Z'), 'Pp'),
    estimatedArrivalTime: format(new Date('2024-12-11T13:30:00.000Z'), 'Pp'),
    auditInfo: {
      createdOn: format(new Date('2024-12-11T11:00:00.000Z'), 'Pp'),
      updatedOn: format(new Date('2024-12-11T11:00:00.000Z'), 'Pp'),
      createdBy: 'supervisor',
      updatedBy: 'supervisor'
    }
  },
  {
    resource: {
      resourceId: 'vehicle12',
      permanentOwnerId: 'agency5',
      tempOwnerId: 'agency5',
      tempOwnershipStartTime: format(
        new Date('2024-12-16T08:00:00.000Z'),
        'Pp'
      ),
      tempOwnershipEndTime: format(new Date('2024-12-16T10:00:00.000Z'), 'Pp'),
      isUnderMaintenance: false,
      auditInfo: {
        createdOn: format(new Date('2024-12-12T09:00:00.000Z'), 'Pp'),
        updatedOn: format(new Date('2024-12-12T09:00:00.000Z'), 'Pp'),
        createdBy: 'supervisor',
        updatedBy: 'supervisor'
      }
    },
    immatriculation: 'QR2345',
    nbSeats: 40,
    model: 'Bus Model I',
    positionGps: {
      latitude: 12.983,
      longitude: 77.605
    },
    status: 'stationed',
    health: 'normal',
    occupiedSeats: 0,
    arrivedOn: format(new Date('2024-12-12T07:30:00.000Z'), 'Pp'),
    arrivedFrom: 'City F',
    auditInfo: {
      createdOn: format(new Date('2024-12-12T09:00:00.000Z'), 'Pp'),
      updatedOn: format(new Date('2024-12-12T09:00:00.000Z'), 'Pp'),
      createdBy: 'supervisor',
      updatedBy: 'supervisor'
    }
  },
  {
    resource: {
      resourceId: 'vehicle13',
      permanentOwnerId: 'agency6',
      tempOwnerId: 'agency6',
      tempOwnershipStartTime: format(
        new Date('2024-12-16T10:00:00.000Z'),
        'Pp'
      ),
      tempOwnershipEndTime: format(new Date('2024-12-16T12:00:00.000Z'), 'Pp'),
      isUnderMaintenance: false,
      auditInfo: {
        createdOn: format(new Date('2024-12-12T10:00:00.000Z'), 'Pp'),
        updatedOn: format(new Date('2024-12-12T10:00:00.000Z'), 'Pp'),
        createdBy: 'manager',
        updatedBy: 'manager'
      }
    },
    immatriculation: 'ST3456',
    nbSeats: 50,
    model: 'Bus Model J',
    positionGps: {
      latitude: 12.984,
      longitude: 77.606
    },
    status: 'incoming',
    health: 'normal',
    occupiedSeats: 20,
    origin: 'City G',
    departureTime: format(new Date('2024-12-12T08:30:00.000Z'), 'Pp'),
    estimatedArrivalTime: format(new Date('2024-12-12T09:30:00.000Z'), 'Pp'),
    auditInfo: {
      createdOn: format(new Date('2024-12-12T10:00:00.000Z'), 'Pp'),
      updatedOn: format(new Date('2024-12-12T10:00:00.000Z'), 'Pp'),
      createdBy: 'manager',
      updatedBy: 'manager'
    }
  },
  {
    resource: {
      resourceId: 'vehicle14',
      permanentOwnerId: 'agency7',
      isUnderMaintenance: true,
      auditInfo: {
        createdOn: format(new Date('2024-12-12T10:30:00.000Z'), 'Pp'),
        updatedOn: format(new Date('2024-12-12T10:30:00.000Z'), 'Pp'),
        createdBy: 'admin',
        updatedBy: 'admin'
      }
    },
    immatriculation: 'UV4567',
    nbSeats: 55,
    model: 'Bus Model K',
    positionGps: {
      latitude: 12.985,
      longitude: 77.607
    },
    status: 'repairing',
    health: 'damaged',
    occupiedSeats: 0,
    arrivedOn: format(new Date('2024-12-12T09:00:00.000Z'), 'Pp'),
    arrivedFrom: 'City H',
    auditInfo: {
      createdOn: format(new Date('2024-12-12T10:30:00.000Z'), 'Pp'),
      updatedOn: format(new Date('2024-12-12T10:30:00.000Z'), 'Pp'),
      createdBy: 'admin',
      updatedBy: 'admin'
    }
  },
  {
    resource: {
      resourceId: 'vehicle15',
      permanentOwnerId: 'agency7',
      isUnderMaintenance: false,
      auditInfo: {
        createdOn: format(new Date('2024-12-12T11:00:00.000Z'), 'Pp'),
        updatedOn: format(new Date('2024-12-12T11:00:00.000Z'), 'Pp'),
        createdBy: 'admin',
        updatedBy: 'admin'
      }
    },
    immatriculation: 'WX5678',
    nbSeats: 45,
    model: 'Bus Model L',
    positionGps: {
      latitude: 12.986,
      longitude: 77.608
    },
    status: 'outgoing',
    health: 'normal',
    occupiedSeats: 35,
    destination: 'City I',
    departureTime: format(new Date('2024-12-12T10:00:00.000Z'), 'Pp'),
    estimatedArrivalTime: format(new Date('2024-12-12T11:30:00.000Z'), 'Pp'),
    auditInfo: {
      createdOn: format(new Date('2024-12-12T11:00:00.000Z'), 'Pp'),
      updatedOn: format(new Date('2024-12-12T11:00:00.000Z'), 'Pp'),
      createdBy: 'admin',
      updatedBy: 'admin'
    }
  },
  {
    resource: {
      resourceId: 'vehicle16',
      permanentOwnerId: 'agency8',
      isUnderMaintenance: false,
      auditInfo: {
        createdOn: format(new Date('2024-12-12T11:30:00.000Z'), 'Pp'),
        updatedOn: format(new Date('2024-12-12T11:30:00.000Z'), 'Pp'),
        createdBy: 'supervisor',
        updatedBy: 'supervisor'
      }
    },
    immatriculation: 'YZ6789',
    nbSeats: 60,
    model: 'Bus Model M',
    positionGps: {
      latitude: 12.987,
      longitude: 77.609
    },
    status: 'incoming',
    health: 'normal',
    occupiedSeats: 50,
    origin: 'City J',
    departureTime: format(new Date('2024-12-12T12:00:00.000Z'), 'Pp'),
    estimatedArrivalTime: format(new Date('2024-12-12T13:30:00.000Z'), 'Pp'),
    auditInfo: {
      createdOn: format(new Date('2024-12-12T11:30:00.000Z'), 'Pp'),
      updatedOn: format(new Date('2024-12-12T11:30:00.000Z'), 'Pp'),
      createdBy: 'supervisor',
      updatedBy: 'supervisor'
    }
  },
  {
    resource: {
      resourceId: 'vehicle17',
      permanentOwnerId: 'agency8',
      isUnderMaintenance: false,
      auditInfo: {
        createdOn: format(new Date('2024-12-12T12:00:00.000Z'), 'Pp'),
        updatedOn: format(new Date('2024-12-12T12:00:00.000Z'), 'Pp'),
        createdBy: 'supervisor',
        updatedBy: 'supervisor'
      }
    },
    immatriculation: 'AB7890',
    nbSeats: 40,
    model: 'Bus Model N',
    positionGps: {
      latitude: 12.988,
      longitude: 77.61
    },
    status: 'outgoing',
    health: 'normal',
    occupiedSeats: 25,
    destination: 'City K',
    departureTime: format(new Date('2024-12-12T14:00:00.000Z'), 'Pp'),
    estimatedArrivalTime: format(new Date('2024-12-12T15:30:00.000Z'), 'Pp'),
    auditInfo: {
      createdOn: format(new Date('2024-12-12T12:00:00.000Z'), 'Pp'),
      updatedOn: format(new Date('2024-12-12T12:00:00.000Z'), 'Pp'),
      createdBy: 'supervisor',
      updatedBy: 'supervisor'
    }
  },
  {
    resource: {
      resourceId: 'vehicle18',
      permanentOwnerId: 'agency9',
      isUnderMaintenance: true,
      auditInfo: {
        createdOn: format(new Date('2024-12-12T12:30:00.000Z'), 'Pp'),
        updatedOn: format(new Date('2024-12-12T12:30:00.000Z'), 'Pp'),
        createdBy: 'manager',
        updatedBy: 'manager'
      }
    },
    immatriculation: 'CD8901',
    nbSeats: 50,
    model: 'Bus Model O',
    positionGps: {
      latitude: 12.989,
      longitude: 77.611
    },
    status: 'repairing',
    health: 'damaged',
    occupiedSeats: 0,
    arrivedOn: format(new Date('2024-12-12T11:30:00.000Z'), 'Pp'),
    arrivedFrom: 'City L',
    auditInfo: {
      createdOn: format(new Date('2024-12-12T12:30:00.000Z'), 'Pp'),
      updatedOn: format(new Date('2024-12-12T12:30:00.000Z'), 'Pp'),
      createdBy: 'manager',
      updatedBy: 'manager'
    }
  },
  {
    resource: {
      resourceId: 'vehicle19',
      permanentOwnerId: 'agency9',
      isUnderMaintenance: false,
      auditInfo: {
        createdOn: format(new Date('2024-12-12T13:00:00.000Z'), 'Pp'),
        updatedOn: format(new Date('2024-12-12T13:00:00.000Z'), 'Pp'),
        createdBy: 'manager',
        updatedBy: 'manager'
      }
    },
    immatriculation: 'EF9012',
    nbSeats: 70,
    model: 'Bus Model P',
    positionGps: {
      latitude: 12.99,
      longitude: 77.612
    },
    status: 'stationed',
    health: 'normal',
    occupiedSeats: 0,
    arrivedOn: format(new Date('2024-12-12T10:30:00.000Z'), 'Pp'),
    arrivedFrom: 'City M',
    auditInfo: {
      createdOn: format(new Date('2024-12-12T13:00:00.000Z'), 'Pp'),
      updatedOn: format(new Date('2024-12-12T13:00:00.000Z'), 'Pp'),
      createdBy: 'manager',
      updatedBy: 'manager'
    }
  }
];

// console.log(JSON.stringify(vehicleJSON, null, 2));

/**
 * Temporary repository for storing classes in json
 */
export class JsonRepository<T> {
  private filePath: string;

  constructor(fileName: string) {
    const dirPath = path.resolve('/home/sih/project/tripbook/src/lib/db/json');
    this.filePath = path.join(dirPath, fileName);

    // Create db file if not exist
    // if (!fs.existsSync(this.filePath)) {
    //   fs.writeFileSync(this.filePath, JSON.stringify([]));
    // }
  }
  // get(
  //   search = '',
  //   offset = 0,

  //   sortBy: keyof Vehicle,
  //   direction: SortingDirection,
  //   dateSingle: number,
  //   dateRange: { from: Number; to?: Number } | undefined,
  // ): {
  //   vehicles: Vehicle[];
  //   newOffset: number;
  //   totalProducts: number;
  // } {
  //   // Parse and clone the JSON to avoid mutating the original data
  //   const vehicles = JSON.parse(JSON.stringify(vehicleJSON)) as Vehicle[];

  //   // Step 1: Filter records based on the search query (case-insensitive)
  //   const filteredVehicles = search
  //     ? vehicles.filter((vehicle) =>
  //         Object.values(vehicle).some((value) =>
  //           value?.toString().toLowerCase().includes(search.toLowerCase())
  //         )
  //       )
  //     : vehicles;

  //   // Step 2: Sort vehicles if `sortBy` and `direction` are provided
  //   const sortedVehicles =
  //     sortBy && direction
  //       ? sortVehicles(sortBy, direction, filteredVehicles)
  //       : filteredVehicles;

  //   // Step 3: Paginate the records
  //   const paginatedVehicles = sortedVehicles.slice(
  //     offset,
  //     offset + PAGE_OFFSET
  //   );

  //   // Step 4: Calculate the new offset
  //   const newOffset = offset + paginatedVehicles.length;

  //   // Step 5: Return the processed data
  //   return {
  //     vehicles: paginatedVehicles,
  //     newOffset,
  //     totalProducts: filteredVehicles.length // Total matches after filtering (not paginated)
  //   };
  // }

  //Find a record by a specific field
  // findBy(field: keyof T, value: any): T | undefined {
  //   const records = this.getAll();
  //   return records.find((record) => record[field] === value);
  // }

  // save(record: T): void {
  //   const records = this.getAll();
  //   records.push(record);
  //   this.writeToFile(records);
  // }

  // Update a record by ID
  // update(field: keyof T, value: any, updatedRecord: Partial<T>): void {
  //   const records = this.getAll();
  //   const recordIndex = records.findIndex((record) => record[field] === value);

  //   if (recordIndex !== -1) {
  //     records[recordIndex] = { ...records[recordIndex], ...updatedRecord };
  //     this.writeToFile(records);
  //   } else {
  //     throw new Error(`Record with ${field.toString()}=${value} not found.`);
  //   }
  // }

  // // Delete a record by ID
  // delete(field: keyof T, value: any): void {
  //   const records = this.getAll();
  //   const filteredRecords = records.filter((record) => record[field] !== value);
  //   this.writeToFile(filteredRecords);
  // }

  // // Helper to write data to the JSON file
  // private writeToFile(data: T[]): void {
  //   fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
  // }

  // static initRepositories() {
  //   const repositories = {
  //     agencies: new JsonRepository<Agency>('agencies.json'),
  //     stations: new JsonRepository<Station>('stations.json'),
  //     vehicles: new JsonRepository<Vehicle>('vehicles.json'),
  //     drivers: new JsonRepository<Driver>('drivers.json'),
  //     trips: new JsonRepository<Trip>('trips.json')
  //   };

  //   console.log('Repositories initialized and JSON files created:');
  //   Object.keys(repositories).forEach((repo) => console.log(`- ${repo}`));

  //   return repositories;
  // }

  get(
    search = '',
    offset = 0,
    sortBy: keyof Vehicle,
    direction: SortingDirection, // asc or desc
    dateSingle: number, // Gotten from Date.getTime()
    dateRange: { from: number; to?: number } | undefined // Same thing here Date.getTime() and exclusive to dateSingle
  ): {
    vehicles: Vehicle[];
    newOffset: number;
    totalProducts: number;
  } {
    // Parse and clone the JSON to avoid mutating the original data
    const vehicles = JSON.parse(JSON.stringify(vehicleJSON)) as Vehicle[];

    // Step 1: Filter records based on the search query (case-insensitive)
    const filteredVehicles = search
      ? vehicles.filter((vehicle) =>
          Object.values(vehicle).some((value) =>
            value?.toString().toLowerCase().includes(search.toLowerCase())
          )
        )
      : vehicles;

    // Step 2: Filter based on dateSingle or dateRange
    const filteredByDate = filteredVehicles;
    // .filter((vehicle) => {
    //   const tempStartTime =  vehicle.resource.tempOwnershipStartTime ?  || vehicle.resource.tempOwnershipStartTime?.getTime();

    //   if (dateSingle) {
    //     // If a single date is provided, filter based on it
    //     return tempStartTime === dateSingle;
    //   }

    //   if (dateRange) {
    //     const { from, to } = dateRange;
    //     // If a date range is provided, filter based on the range
    //     return (
    //       tempStartTime !== undefined &&
    //       tempStartTime >= from &&
    //       (to ? tempStartTime <= to : true)
    //     );
    //   }

    //   return true; // If no date filtering is needed
    // });

    // // Step 3: Sort vehicles if `sortBy` and `direction` are provided
    const sortedVehicles =
      sortBy && direction
        ? sortVehicles(sortBy, direction, filteredByDate as Vehicle[])
        : filteredByDate;

    // Step 4: Paginate the records
    const paginatedVehicles = sortedVehicles.slice(
      offset,
      offset + PAGE_OFFSET
    );

    // Step 5: Calculate the new offset
    const newOffset = offset;

    // Step 6: Return the processed data
    return {
      vehicles: paginatedVehicles,
      newOffset,
      totalProducts: filteredByDate.length // Total matches after filtering (not paginated)
    };
  }
}
