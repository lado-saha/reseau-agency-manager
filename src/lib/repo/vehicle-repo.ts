import { stat } from "fs";
import { auditCreate, auditUpdate, SortingDirection } from "../models/helpers";
import { RESOURCE_STATUS, Vehicle, VehicleModel } from "../models/resource";
import { Station } from "../models/station";
import { API_URL } from "../utils";
import { JsonRepository, UserRepository } from "./json-repository";
import { PlaceAddress } from "./osm-place-repo";
import { StationRepository } from "./station-repo";
import { VehicleModelRepository } from "./vechicle-model-repo";

export class VehicleRepository extends JsonRepository<Vehicle> {
  private modelRepo = new VehicleModelRepository()
  private stationRepo = new StationRepository()
  private userRepo = new UserRepository()

  constructor() {
    super('vehicles.json');
  }

  private async enrichVehicles(vehicles: Vehicle[]): Promise<Vehicle[]> {
    // Extract model IDs from the vehicles
    const modelMap = new Map((await this.modelRepo.getByIds(vehicles.map(v => v.model as string))).map(m => [m.id, m]))
    const fromTenant = new Map((await this.stationRepo.getByIds(vehicles.map(v => v.tenant as string))).map(m => [m.id, m]))
    const toTenant = new Map((await this.stationRepo.getByIds(vehicles.filter(s => s.nextTenant).map(v => v.tenant as string))).map(m => [m.id, m]))

    // Map vehicles to include full model details
    return vehicles.map(vehicle => ({
      ...vehicle,
      model: modelMap.get(vehicle.model as string) ?? (() => {
        throw new Error(`Unknown model found for vehicle ${vehicle.registrationNumber}`);
      })(),
      tenant: fromTenant.get(vehicle.tenant as string) ?? (() => {
        throw new Error(`Unknown tenant found for vehicle ${vehicle.registrationNumber}`);
      })(),
      nextTenant: toTenant.get(vehicle.nextTenant as string | '') ?? undefined
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
  }

  async getById(id: string): Promise<Vehicle | undefined> {
    const vehicle = (await super.getById(id))!
    const newVehicle = (await this.enrichVehicles([vehicle]))[0]
    return { ...newVehicle }
  }


  async saveVehicleBasicInfo(
    id: string = "new",
    vehicle: Partial<Vehicle>,
    tenant: Station,
    adminId: string,
    agencyId: string
  ): Promise<Partial<Vehicle>> {
    const vehicles = await this.fetchData();

    if (id === "new") {
      if (
        vehicles.some(
          (st) => st.registrationNumber === vehicle.registrationNumber && vehicle.ownerId === st.ownerId
        )
      ) {
        throw new Error("Vehicle with similar registration number already exists.");
      }
      const addresss = tenant.address as PlaceAddress
      const newVehicle = {
        ...vehicle,
        ...auditCreate(adminId),
        id: crypto.randomUUID(),
        ownerId: agencyId, status: 'free', latitude: addresss.latitude, longitude: addresss.longitude, tenant: tenant.id, tenancyStartedTime: new Date()
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
      const vehicleIndex = vehicles.findIndex((vehicle) => vehicle.id === id);

      if (vehicleIndex === -1) {
        throw new Error(`Vehicle with id ${id} not found.`);
      }

      const newVehicle = { ...vehicles[vehicleIndex], ...vehicle, tenant: tenant.id, ...auditUpdate(adminId) };

      await fetch(`${API_URL}/api/data/vehicles`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVehicle satisfies Partial<Vehicle>),
      });

      return newVehicle
    }
  }

}
