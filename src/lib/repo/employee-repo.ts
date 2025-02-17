import { AgencyEmployee, Employee, StationEmployee, EmployeeRole } from "@/lib/models/employee";
import { JsonRepository, UserRepository } from "@/lib/repo/json-repository";
import { API_URL } from "@/lib/utils";
import { auditCreate, auditUpdate, SortingDirection } from "../models/helpers";
import { DriverRepository } from "./driver-repo";
import { Driver } from "../models/resource";

// Generalized Base Employee Repository
export class EmployeeRepository<T extends Employee<EmployeeRole>> extends JsonRepository<T> {
  private entityName: string
  private userRepo = new UserRepository();
  //private driverRepo = new DriverRepository();
  constructor(fileName: string) {
    super(fileName);
    this.entityName = fileName.split('.')[0]
  }


  async getAll(search?: string, offset?: number, sortBy?: string | keyof T | undefined, direction?: SortingDirection): Promise<{ items: T[]; newOffset: number; totalCount: number; }> {
    // Fetch employees using the base method
    const employees = await super.getAll(search, offset, sortBy, direction);

    // Extract the user IDs from the employees
    const userIds = employees.items.map((empl) => empl.user as string);

    // Fetch users by their IDs
    const users = await this.userRepo.getByIds(userIds);

    // Map over employees and add the corresponding user object
    const itemsWithUsers = employees.items.map((employee) => {
      // Find the user corresponding to the employee
      const user = users.find((u) => u.id === (employee.user as string));
      if (!user) {
        throw Error(`Unkown user with found for ${employee}`)
      }
      // Return the employee with the attached user object
      return {
        ...employee,
        user: user // Add the user object (or null if not found)
      };
    });

    // Return the items with users, the new offset, and the total count
    return {
      items: itemsWithUsers,
      newOffset: employees.newOffset,
      totalCount: employees.totalCount,
    };

  }

  async getByUserId<T extends EmployeeRole>(
    userId: string, orgId: string
  ): Promise<Employee<T>> {
    const employees = await this.fetchData();

    const employee = employees.find((empl) => empl.user == userId && empl.orgId == orgId)
    if (!employee) {
      throw new Error('This user is not currently employed')
    }
    return employee as unknown as Employee<T>;
  }

  async getByUserIdOnly<T extends EmployeeRole>(
    userId: string
  ): Promise<Employee<T>> {
    const employees = await this.fetchData();

    const employee = employees.find((empl) => empl.user == userId)
    if (!employee) {
      throw new Error('This user is not currently employed')
    }
    return employee as unknown as Employee<T>;
  }


  async getByUserEmail<T extends EmployeeRole>(
    email: string,
    orgId: string
  ): Promise<Employee<T>> {
    const user = await this.userRepo.getByEmail(email)
    if (!user) {
      throw new Error('No user found with this email')
    }
    const employees = await this.fetchData();

    const empl = employees.find((empl) => empl.user == user?.id && empl.orgId == orgId)
    if (!empl) {
      throw new Error('This user is not currently employed')
    }
    empl.user = user
    return empl as unknown as Employee<T>
  }


  // Add Employee
  async addEmployee(
    employee: T,
    adminId: string,
  ): Promise<T> {
    const employees = await this.fetchData();
    const empId = employee.id || 'new'

    if (empId=== 'new') {
      if (
        employees.some(
          (empl) => empl.orgId === employee.orgId && empl.user === employee.user
        )
      ) {
        throw new Error("You cannot employ the same person twice.");
      }
      const newEmpl: T = { ...employee, id: crypto.randomUUID(), ...auditCreate(adminId) };

      // Assuming you will post it to the API endpoint
      await fetch(`${API_URL}/api/data/${this.entityName}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmpl),
      });

      //if (employee.role === 'driver') {
      //  await this.driverRepo.saveDriverInfo(employee as AgencyEmployee, adminId);
      //}
      return newEmpl;
    } else {
      const index = employees.findIndex((empl) => empl.id === employee.id);

      if (index === -1) {
        throw new Error(`Employee with id ${employee.id} not found.`);
      }

      const newEmpl = { ...employees[index], ...employee, ...auditUpdate(adminId) }

      await fetch(`${API_URL}/api/data/${this.entityName}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmpl),
      });
      return newEmpl;
    }

  }
  async getById(id: string): Promise<T | undefined> {
    const empl = await super.getById(id)
    const user = await this.userRepo.getById(empl?.user as string)
    return { ...empl!, user }
  }
  // Update Employee
  //
  //
  async getByIds(ids: string[]): Promise<T[]> {
    const empls = (await this.fetchData()).filter(v => ids.includes(v.id));

    const userMap = new Map((await this.userRepo.getByIds(empls.map(v => v.user as string))).map(m => [m.id, m]));
    return empls.map(v => ({
      ...v,
      user: userMap.get(v.user as string) ?? (() => { throw new Error(`Unknown user for employee${v.id}`) })(),
    }));
  }

  async updateEmployee(
    currentUserId: string,
    newEmployee: T
  ): Promise<T> {
    const employees = await this.fetchData();
    const employeeIndex = employees.findIndex((empl) => empl.id === newEmployee.id);
    if (employeeIndex === -1) {
      throw new Error("Employee not found.");
    }

    const newEmpl = { ...employees[employeeIndex], ...newEmployee, ...auditUpdate(currentUserId) };
    await fetch(`${API_URL}/api/data/${this.entityName}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEmpl)
    });

    return newEmpl;
  }

  // Delete Employee
  async deleteEmployee(id: string): Promise<boolean> {
    const res = await fetch(`${API_URL}/api/data/${this.entityName}?id=${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || `Failed to delete Employee with id=${id}`);
    }
    return true;
  }
}
// Agency Employee Repository
export class AgencyEmployeeRepository extends EmployeeRepository<AgencyEmployee> {
  constructor() {
    super('employees-agency.json');
  }

  // Additional specific methods can be added here if necessary
}

// Station Employee Repository
export class StationEmployeeRepository extends EmployeeRepository<StationEmployee> {
  constructor() {
    super('employees-station.json');
  }

  // Additional specific methods can be added here if necessary
}
