import { auditCreate, auditUpdate } from "../models/helpers";
import { Vehicle } from "../models/resource";
import { API_URL } from "../utils";
import { JsonRepository } from "./json-repository";
import { VehicleModelRepository } from "./vechicle-model-repo";

export class VehicleRepository extends JsonRepository<Vehicle> {
  private modelRepo = new VehicleModelRepository()

  constructor() {
    super('vehicles.json');
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
