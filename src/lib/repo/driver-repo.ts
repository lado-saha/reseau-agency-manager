import { monitorEventLoopDelay } from "perf_hooks";
import { auditCreate, auditUpdate, SortingDirection } from "../models/helpers";
import { API_URL } from "../utils";
import { JsonRepository } from "./json-repository";
import { AgencyEmployeeRepository } from "./employee-repo";
import { Driver } from "../models/resource";
import { AgencyEmployee } from "../models/employee";

export class DriverRepository extends JsonRepository<Driver> {
  private emplRepo = new AgencyEmployeeRepository()

  constructor() {
    super('drivers.json');
  }

  private async enrichDrivers(drivers: Driver[]): Promise<Driver[]> {
    const emplMap = new Map((await this.emplRepo.getByIds(drivers.map(d => d.employee as string))).map(e => [e.id, e]));
    return drivers.map(driver => ({
      ...driver,
      employee: emplMap.get(driver.employee as string) ?? (() => {
        throw new Error(`Unknown employee found for driver ${driver.id}`);
      })(),
    }));
  }

  async getByIds(ids: string[]): Promise<Driver[]> {
    const drivers = (await this.fetchData()).filter(d => ids.includes(d.id));
    return this.enrichDrivers(drivers);
  }

  async getAll(
    search?: string,
    offset?: number,
    sortBy?: string,
    direction?: SortingDirection
  ): Promise<{ items: Driver[]; newOffset: number; totalCount: number }> {
    const drivers = await super.getAll(search, offset, sortBy, direction);
    const fullDrivers = await this.enrichDrivers(drivers.items);
    return {
      ...drivers,
      items: fullDrivers,
    };
  } async getById(id: string): Promise<Driver | undefined> {
    const driver = (await super.getById(id))!!
    const empl = await this.emplRepo.getById(driver?.employee as string)
    return { ...driver, employee: empl as AgencyEmployee }
  }


  async saveDriverBasicInfo(
    driverId: string = "new",
    driver: Partial<Driver>,
    adminId: string
  ): Promise<Partial<Driver>> {
    const drivers = await this.fetchData();

    if (driverId === "new") {
      if (
        drivers.some(
          (st) => st.name === driver.name
        )
      ) {
        throw new Error("Driver with similar name already exists.");
      }
      let newDriver = {
        id: crypto.randomUUID(),
        ...driver,
        ...auditCreate(adminId)
      } satisfies Partial<Driver>;

      await fetch(`${API_URL}/api/data/drivers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDriver),
      });

      // return [newDriver.id, newdriver.basicInfo]
      return newDriver;
    } else {
      // We are updating an existing driver
      const driverIndex = vehicles.findIndex((vehicle) => vehicle.id === vehicleId);

      if (driverIndex === -1) {
        throw new Error(`Driver with id ${driverId} not found.`);
      }

      const newDriver = { ...drivers[vehicleIndex], ...vehicle, ...auditUpdate(adminId) };

      await fetch(`${API_URL}/api/data/drivers`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDriver satisfies Partial<Vehicle>),
      });

      return newDriver
    }
  }

}
