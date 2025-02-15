import { VehicleModel } from "@/lib/models/resource";
import { JsonRepository } from "./json-repository";
import { auditCreate, auditUpdate, SortingDirection } from "../models/helpers";
import { API_URL } from "../utils";

export class VehicleModelRepository extends JsonRepository<VehicleModel> {
  constructor() {
    super("vehicle-models.json");
  }


  async getByIds(ids: string[]): Promise<VehicleModel[]> {
    const models = await this.fetchData();
    return models.filter((a) => ids.includes(a.id))
  }


  async addVehicleModel(model: VehicleModel, adminId: string): Promise<VehicleModel> {
    const models = await this.fetchData();

    if (model.id === 'new') {
      if (
        models.some(
          (mod) => mod.seatLayout === model.seatLayout && mod.agencyId == model.agencyId 
        )
      ) {
        throw new Error("A vehicle model with a similar seat layout already exists.");
      }
           if (
        models.some(
          (mod) => mod.seatLayout === model.seatLayout && mod.agencyId == model.agencyId 
        )
      ) {
        throw new Error("A vehicle model with as similar name already exists.");
      }

      if (typeof model.modelPhoto !== 'string') {
        const formData = new FormData();
        formData.append('file', model?.modelPhoto as File);
        const uploadResponse = await fetch(`${API_URL}/api/upload`, { method: 'POST', body: formData });
        const { fileUrl } = await uploadResponse.json();
        model.modelPhoto = fileUrl
      }


      const newModel: VehicleModel = { ...model, id: crypto.randomUUID(), ...auditCreate(adminId) };

      // Assuming you will post it to the API endpoint
      await fetch(`${API_URL}/api/data/vehicle-models`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newModel),
      });
      return newModel;
    } else {
      const index = models.findIndex((mod) => mod.id === model.id);

      if (index === -1) {
        throw new Error(`Employee with id ${model.id} not found.`);
      }

      if (typeof model.modelPhoto !== 'string') {
        const formData = new FormData();
        formData.append('file', model?.modelPhoto as File);
        const uploadResponse = await fetch(`${API_URL}/api/upload`, { method: 'POST', body: formData });
        const { fileUrl } = await uploadResponse.json();
        model.modelPhoto = fileUrl
      }

      const newModel = { ...models[index], ...model, ...auditUpdate(adminId) }

      await fetch(`${API_URL}/api/data/vehicle-models`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newModel),
      });
      return newModel;
    }

  }


  // Update Employee
  async updateVehicleModel(
    adminId: string,
    model: VehicleModel,
  ): Promise<VehicleModel> {
    const models = await this.fetchData();
    const index = models.findIndex((mod) => mod.id === model.id);
    if (index === -1) {
      throw new Error("Vehicle model not found.");
    }

    const newModel = { ...models[index], ...model, ...auditUpdate(adminId) };
    await fetch(`${API_URL}/api/data/vehicle-models`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newModel)
    });

    return newModel;
  }

  // Delete Employee
  async deleteVehicleModel(id: string): Promise<boolean> {
    const res = await fetch(`${API_URL}/api/data/vehicle-models?id=${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || `Failed to delete Vehicle model with id=${id}`);
    }
    return true;
  }
}
