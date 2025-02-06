'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { signOut } from '@/auth';
import { User } from './models/user';
import { UserRepository } from '@/lib/repo/json-repository';
import { AgencyRepository } from './repo/agency-repo';
import { AgencyBasicInfo, AgencyLegalDocuments, AgencySocialMediaInfo } from './models/agency';
import { AgencyEmployee, AgencyEmployeeRole, agencyEmplRoles, Employee, EmployeeRole, isAgencyEmployeeRole, isStationEmployeeRole, StationEmployee, StationEmployeeRole, stationEmplRoles } from './models/employee';
import { AgencyEmployeeRepository, StationEmployeeRepository } from './repo/employee-repo';
import { areArraysEqual } from './utils';

const agencyRepo = new AgencyRepository()
const userRepo = new UserRepository()
const agencyEmpRepo = new AgencyEmployeeRepository()
const stationEmpRepo = new StationEmployeeRepository()

// Agency actions
export async function saveAgencyBasicInfoAction(agencyId: string, basicInfo: AgencyBasicInfo, ownerId?: string,): Promise<{ id: string, basicInfo: AgencyBasicInfo }> {
  return await agencyRepo.saveAgencyBasicInfo(agencyId, basicInfo, ownerId,)
}
export async function saveAgencyLegalDocumentsAction(agencyId: string, legalDocs: AgencyLegalDocuments): Promise<AgencyLegalDocuments> {
  return await agencyRepo.saveAgencyLegalDocuments(agencyId, legalDocs)
}

export async function searchUserByEmail(email: string): Promise<User | undefined> {
  return await userRepo.getByEmail(email)
}

export async function saveAgencySocialInfoAction(agencyId: string, socialInfo: AgencySocialMediaInfo): Promise<AgencySocialMediaInfo> {
  return await agencyRepo.saveAgencySocialInfo(agencyId, socialInfo)
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
