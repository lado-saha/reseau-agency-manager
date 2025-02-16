'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { signOut } from '@/auth';
import { User } from './models/user';
import { UserRepository } from '@/lib/repo/json-repository';
import { AgencyRepository } from './repo/agency-repo';
import { AgencyBasicInfo, AgencyLegalDocuments, AgencySocialMediaInfo } from './models/agency';
import { AgencyEmployee, AgencyEmployeeRole, agencyEmplRoles, Employee, EmployeeRole, StationEmployeeRole } from './models/employee';
import { AgencyEmployeeRepository, StationEmployeeRepository } from './repo/employee-repo';
import { areArraysEqual } from './utils';
import { Station } from './models/station';
import { StationRepository } from './repo/station-repo';
import { PlaceAddress } from './repo/osm-place-repo';
import { VehicleModelRepository } from './repo/vechicle-model-repo';
import { Driver, Vehicle, VehicleModel } from './models/resource';
import { VehicleRepository } from './repo/vehicle-repo';
import { Trip } from './models/trip';
import { TripRepository } from './repo/trip-repo';
import { DriverRepository } from './repo/driver-repo';

const agencyRepo = new AgencyRepository()
const stationRepo = new StationRepository()
const userRepo = new UserRepository()
const agencyEmpRepo = new AgencyEmployeeRepository()
const stationEmpRepo = new StationEmployeeRepository()
const vehicleModelRepo = new VehicleModelRepository()
const vehicleRepo = new VehicleRepository()
const tripRepo = new TripRepository()
const driverRepo = new DriverRepository()

// Agency actions
export async function saveAgencyBasicInfo(agencyId: string, basicInfo: AgencyBasicInfo, ownerId?: string,): Promise<{ id: string, basicInfo: AgencyBasicInfo }> {
  return await agencyRepo.saveAgencyBasicInfo(agencyId, basicInfo, ownerId,)
}

export async function saveAgencyLegalDocuments(agencyId: string, legalDocs: AgencyLegalDocuments): Promise<AgencyLegalDocuments> {
  return await agencyRepo.saveAgencyLegalDocuments(agencyId, legalDocs)
}

export async function searchUserByEmail(email: string): Promise<User | undefined> {
  return await userRepo.getByEmail(email)
}

export async function saveAgencySocialInfo(agencyId: string, socialInfo: AgencySocialMediaInfo): Promise<AgencySocialMediaInfo> {
  return await agencyRepo.saveAgencySocialInfo(agencyId, socialInfo)
}

//stations action
export async function saveStationBasicInfo(stationId: string, station: Partial<Station>, adminId: string,): Promise<Partial<Station>> {
  return await stationRepo.saveStationBasicInfo(stationId, station, adminId)
}

export async function saveStationGeoInfo(stationId: string, place: PlaceAddress, adminId: string,): Promise<Station> {
  return await stationRepo.saveStationGeoInfo(stationId, place, adminId)
}

// User actions
export async function authenticateUser(
  redirect: boolean,
  email: string, password: string,
): Promise<string | void> {
  try {
    await signIn('credentials', {
      redirect: redirect, // Avoid automatic redirection
      email: email,
      password: password
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          // console.log("sd" + error.cause)
          return error.cause?.err?.message;
      }
    }
    throw error;
  }
}

export async function createUserAction(user: User): Promise<User> {
  return await userRepo.createUser(user)
}

export async function signOutUser() {
  'use server'
  await signOut();
}

/// Employee
// Add Employee
export async function saveEmployee<T extends EmployeeRole>(
  employee: Employee<T>,
  roles: T[], // Added roles as parameter
  currentUserId: string
): Promise<Employee<T>> {
  // Check if the roles list includes any Agency roles or Station roles
  if (areArraysEqual(roles, agencyEmplRoles)) {
    // If the role is an Agency role, call the appropriate repository
    return await agencyEmpRepo.addEmployee(
      employee as Employee<AgencyEmployeeRole>,
      currentUserId
    );
  } else {
    return await stationEmpRepo.addEmployee(
      employee as Employee<StationEmployeeRole>,
      currentUserId
    );
  }

}

export async function saveVehicleModel(
  model: VehicleModel,
  adminId: string
): Promise<VehicleModel> {
  return vehicleModelRepo.addVehicleModel(model, adminId)
}

export async function searchEmployeeByEmail<T extends EmployeeRole>(orgId: string, email: string, roles: T[]): Promise<Employee<T>> {
  if (areArraysEqual(roles, agencyEmplRoles)) {
    // If the role is an Agency role, call the appropriate repository
    return await agencyEmpRepo.getByUserEmail<AgencyEmployeeRole>(
      email, orgId
    );
  } else {
    return await stationEmpRepo.getByUserEmail<StationEmployeeRole>(
      email, orgId
    );
  }
}

export async function deleteEmployee<T extends EmployeeRole>(
  id: string,
  roles: T[], // Added roles as parameter
): Promise<boolean> {
  // Check if the roles list includes any Agency roles or Station roles
  if (areArraysEqual(roles, agencyEmplRoles)) {
    // If the role is an Agency role, call the appropriate repository
    return await agencyEmpRepo.deleteEmployee(id);
  } else {
    return await stationEmpRepo.deleteEmployee(id);
  }
}

export async function saveVehicleBasicInfo(id: string, vehicle: Partial<Vehicle>, adminId: string,): Promise<Partial<Vehicle>> {
  return await vehicleRepo.saveVehicleBasicInfo(id, vehicle, adminId)
}
export async function saveDriverInfo(adminId: string, driver: Driver | AgencyEmployee): Promise<Driver> {
  return await driverRepo.saveDriverInfo(driver, adminId)
}

export async function saveTripBasicInfo(id: string, agencyId: string, trip: Trip, adminId: string,): Promise<Trip> {
  return await tripRepo.saveTripBasicInfo(id, agencyId, trip, adminId)
}

export async function searchVehicleModel(query: string) {
  return (await vehicleModelRepo.getAll(query, 0)).items;
}

export async function searchVehicle(query: string) {
  return (await vehicleRepo.getAll(query, 0)).items;
}

export async function searchStation(query: string) {
  return (await stationRepo.getAll(query, 0)).items;
}

export async function searchDriver(query: string) {
  return (await driverRepo.getAll(query, 0)).items;
}


export async function fetchStationById(id: string) {
  return stationRepo.getById(id)
}

export async function fetchVehicleById(id: string) {
  return vehicleRepo.getById(id)
}

export async function fetchEmplById(id: string) {
  return agencyEmpRepo.getById(id)
}



