import { monitorEventLoopDelay } from "perf_hooks";
import { auditCreate, auditUpdate, SortingDirection } from "../models/helpers";
import { Vehicle, VehicleModel } from "../models/resource";
import { API_URL } from "../utils";
import { JsonRepository } from "./json-repository";
import { VehicleModelRepository } from "./vechicle-model-repo";

export class VehicleRepository extends JsonRepository<Vehicle> {
  private modelRepo = new VehicleModelRepository()

  constructor() {
    super('vehicles.json');
  }


  private async enrichVehicles(vehicles: Vehicle[]): Promise<Vehicle[]> {
    // Extract model IDs from the vehicles
    const modelMap = new Map((await this.modelRepo.getByIds(vehicles.map(v => v.model as string))).map(m => [m.id, m]))

    // Map vehicles to include full model details
    return vehicles.map(vehicle => ({
      ...vehicle,
      model: modelMap.get(vehicle.model as string) ?? (() => {
        throw new Error(`Unknown model found for vehicle ${vehicle.registrationNumber}`);
      })(),
    }));
  }

  async getByIds(vehicleIds: string[]): Promise<Vehicle[]> {
    const vehicles = (await this.fetchData()).filter(vehicle => vehicleIds.includes(vehicle.id));
    return this.enrichVehicles(vehicles);
  }

  async getAll(
    search?: string,
    offset?: number,
    sortBy?: string,
    direction?: SortingDirection
  ): Promise<{ items: Vehicle[]; newOffset: number; totalCount: number }> {
    const vehicles = await super.getAll(search, offset, sortBy, direction);
    const fullVehicles = await this.enrichVehicles(vehicles.items);
    return {
      ...vehicles,
      items: fullVehicles,
    };
  } async getById(id: string): Promise<Vehicle | undefined> {
    const vehicle = (await super.getById(id))!!
    const model = await this.modelRepo.getById(vehicle?.model as string)
    return { ...vehicle, model: model as VehicleModel }
  }


  async saveVehicleBasicInfo(
    vehicleId: string = "new",
    vehicle: Partial<Vehicle>,
    adminId: string
  ): Promise<Partial<Vehicle>> {
    const vehicles = await this.fetchData();

    if (vehicleId === "new") {
      if (
        vehicles.some(
          (st) => st.name === vehicle.name
        )
      ) {
        throw new Error("Vehicle with similar name already exists.");
      }
      let newVehicle = {
        id: crypto.randomUUID(),
        ...vehicle,
        ...auditCreate(adminId)
      } satisfies Partial<Vehicle>;

      await fetch(`${API_URL}/api/data/vehicles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVehicle),
      });

      // return [newVehicle.id, newvehicle.basicInfo]
      return newVehicle;
    } else {
      // We are updating an existing vehicle
      const vehicleIndex = vehicles.findIndex((vehicle) => vehicle.id === vehicleId);

      if (vehicleIndex === -1) {
        throw new Error(`Vehicle with id ${vehicleId} not found.`);
      }

      const newVehicle = { ...vehicles[vehicleIndex], ...vehicle, ...auditUpdate(adminId) };

      await fetch(`${API_URL}/api/data/vehicles`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVehicle satisfies Partial<Vehicle>),
      });

      return newVehicle
    }
  }

}
