import { Audit, AuditInfo } from '@/lib/models/helpers'
import { User } from '@/lib/models/user';

export const roleLabels: Record<AgencyEmployeeRole | StationEmployeeRole, string> = {
  // Agency Employee Roles
  owner: 'Agency Owner',
  manager: 'Manager',
  driver: 'Driver',
  'station-chief': 'Station Chief',
  other: 'Other',
  // Station Employee Roles
  chief: 'Station Chief',
  scanner: 'Scanner',
};
export function getRoleLabel(role: EmployeeRole): string {
  return roleLabels[role]; // Default to the role itself if no label is found
}
export interface Employee<T extends EmployeeRole> extends Audit {
  id: string;
  user: User | string;
  orgId: string; // Generalized from agencyId
  role: T; // Role is now a generic type
  salary: number;
}

export type AgencyEmployeeRole = 'owner' | 'manager' | 'driver' | 'station-chief' | 'other';
export type StationEmployeeRole = 'chief' | 'manager' | 'scanner' | 'other';
export type EmployeeRole = AgencyEmployeeRole | StationEmployeeRole

export const agencyEmplRoles: AgencyEmployeeRole[] = ['driver', 'manager', 'station-chief', 'owner', 'other']
export const stationEmplRoles: StationEmployeeRole[] = ['manager', 'scanner', 'chief', 'other']


// Agency Employee
export interface AgencyEmployee extends Employee<AgencyEmployeeRole> { }

// Station Employee
export interface StationEmployee extends Employee<StationEmployeeRole> { }

