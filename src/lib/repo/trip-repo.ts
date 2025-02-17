import { Trip, TripResource } from "@/lib/models/trip";
import { JsonRepository, UserRepository } from "./json-repository";
import { API_URL } from "../utils";
import { auditUpdate, SortingDirection } from "../models/helpers";
import { AgencyRepository } from "./agency-repo";
import { StationRepository } from "./station-repo";
import { VehicleRepository } from "./vehicle-repo";
import { DriverRepository } from "./driver-repo";
import { Driver, Vehicle } from "../models/resource";
import { User } from "../models/user";
import { throws } from "assert";

export class TripRepository extends JsonRepository<Trip> {
  private userRepo = new UserRepository();
  private agencyRepo = new AgencyRepository();
  private vehicleRepo = new VehicleRepository();
  private stationRepo = new StationRepository();
  private driverRepo = new DriverRepository();

  constructor() {
    super('trips.json');
  }
  private async enrichTrips(trips: Trip[]): Promise<Trip[]> {
    // Extract unique IDs for fromStations, toStations, vehicles, drivers, and passenger users
    const stationIds = [...new Set([...trips.map(trip => trip.fromStation as string, ...trips.map(trip => trip.toStation as string))])];
    const vehicleIds = [...new Set(trips.flatMap(trip => trip.resources.map(res => res.vehicle as string)))];
    const driverIds = [...new Set(trips.flatMap(trip => trip.resources.map(res => res.driver as string)))];
    const passengerUserIds = [...new Set(trips.flatMap(trip => trip.resources.flatMap(res => res.passengers.map(p => p.user as string))))];

    // Fetch all required data in parallel
    const [stations, vehicles, drivers, users] = await Promise.all([
      this.stationRepo.getByIds(stationIds).then(data => new Map(data.map(s => [s.id, s]))),
      this.vehicleRepo.getByIds(vehicleIds).then(data => new Map(data.map(v => [v.id, v]))),
      this.driverRepo.getByIds(driverIds).then(data => new Map(data.map(d => [d.id, d]))),
      this.userRepo.getByIds(passengerUserIds).then(data => new Map(data.map(u => [u.id, u]))),
    ]);

    // Map trips to include enriched data
    return trips.map(trip => ({
      ...trip,
      fromStation: stations.get(trip.fromStation as string)!,
      toStation: stations.get(trip.toStation as string)!,
      resources: trip.resources.map(res => ({
        ...res,
        vehicle: vehicles.get(res.vehicle as string)!,
        driver: drivers.get(res.driver as string)!,
        passengers: res.passengers.map(p => ({
          ...p,
          user: users.get(p.user as string)!,
        })),
      })),
    }));
  }

  async getById(id: string): Promise<Trip | undefined> {
    const trip = (await super.getById(id))
    if (!trip) throw new Error("Trip not found")

    // Fetch fromStation and toStation in parallel
    const [fromStation, toStation] = await Promise.all([
      this.stationRepo.getById(trip.fromStation as string),
      this.stationRepo.getById(trip.toStation as string),
    ]);

    // Fetch vehicles, drivers, and users in parallel + O(1) lookup map
    const [vehicleMap, driverMap, userMap] = await Promise.all([
      this.vehicleRepo.getByIds(trip.resources.map(res => res.vehicle as string)).then(v => new Map(v.map(v => [v.id, v]))),
      this.driverRepo.getByIds(trip.resources.map(res => res.driver as string)).then(d => new Map(d.map(d => [d.id, d]))),
      this.userRepo.getByIds(trip.resources.flatMap(res => res.passengers.map(p => p.user as string))).then(u => new Map(u.map(u => [u.id, u]))),
    ]);

    // Map resources to include enriched data
    return {
      ...trip,
      fromStation: fromStation!,
      toStation: toStation!,
      resources: trip.resources.map(res => ({
        ...res,
        vehicle: vehicleMap.get(res.vehicle as string)!,
        driver: driverMap.get(res.driver as string)!,
        passengers: res.passengers.map(p => ({
          ...p,
          user: userMap.get(p.user as string)!,
        })),
      }))
    };
  }

  async getByIds(ids: string[]): Promise<Trip[]> {
    const trips = (await this.fetchData()).filter(d => ids.includes(d.id));
    return this.enrichTrips(trips);
  }

  async getAll(
    search?: string,
    offset?: number,
    sortBy?: string | undefined,
    direction?: SortingDirection
  ): Promise<{ items: Trip[]; newOffset: number; totalCount: number }> {
    const trips = await super.getAll(search, offset, sortBy, direction);
    const enrichedItems = await this.enrichTrips(trips.items);
    return {
      ...trips,
      items: enrichedItems,
    };
  }
  async deleteTripResourceInfo(
    id: string,
    agencyId: string,
    index: number,
    adminId: string
  ): Promise<Trip> {
    const trips = await this.fetchData();

    // Find the trip to update
    const tripIndex = trips.findIndex((t) => t.id === id);
    if (tripIndex === -1) {
      throw new Error(`Trip with id ${id} not found.`);
    }

    // Find the resource index to delete
    const resIndex = trips[tripIndex].resources.findIndex((t) => t.index === index);
    if (resIndex === -1) {
      throw new Error(`Resource #${index} not found.`);
    }

    // Remove the resource from the trip
    trips[tripIndex].resources.splice(resIndex, 1);

    // Create the updated trip object
    const updatedTrip: Trip = {
      ...trips[tripIndex],
      ...auditUpdate(adminId),
    };

    // Save the updated trip to the server
    await fetch(`${API_URL}/api/data/trips`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTrip),
    });

    // Return the updated trip
    return (await this.getById(id))!!;
  }

  async saveTripResourceInfo(
    id: string,
    agencyId: string,
    tripResource: TripResource,
    adminId: string
  ): Promise<Trip> {
    const trips = await this.fetchData();

    // Find the trip to update
    const tripIndex = trips.findIndex((t) => t.id === id);
    if (tripIndex === -1) {
      throw new Error(`Trip with id ${id} not found.`);
    }

    // Create a light version of the tripResource
    const lightTripResource: TripResource = {
      index: tripResource.index,
      vehicle: (tripResource.vehicle as Vehicle).id,
      driver: (tripResource.driver as Driver).id,
      passengers: tripResource.passengers.map((passenger) => ({
        user: (passenger.user as User).id,
        seatNumber: passenger.seatNumber,
      })),
    };

    // Find the resource index to update
    const resIndex = trips[tripIndex].resources.findIndex(
      (t) => t.index === tripResource.index
    );

    if (resIndex !== -1) {
      // Update the existing resource
      const oldVehicleId = trips[tripIndex].resources[resIndex].vehicle as string;
      const newVehicleId = lightTripResource.vehicle as string;

      const oldDriverId = trips[tripIndex].resources[resIndex].driver as string;
      const newDriverId = lightTripResource.driver as string;

      // Handle vehicle changes
      if (oldVehicleId !== newVehicleId) {
        // Release the old vehicle
        const oldVehicle = (await this.vehicleRepo.getById(oldVehicleId))!!;
        await this.vehicleRepo.saveVehicleBasicInfo(oldVehicleId, {
          ...oldVehicle,
          tenancyEndTime: undefined,
          status: "free",
        }, adminId);

        // Assign the new vehicle
        const newVehicle = (await this.vehicleRepo.getById(newVehicleId))!!;
        await this.vehicleRepo.saveVehicleBasicInfo(newVehicleId, {
          ...newVehicle,
          tenancyEndTime: trips[tripIndex].expectedArrivalTime,
          status: "scheduled",
        }, adminId);
      }

      // Handle driver changes
      if (oldDriverId !== newDriverId) {
        // Release the old driver
        const oldDriver = (await this.driverRepo.getById(oldDriverId))!!;
        await this.driverRepo.saveDriverInfo({
          ...oldDriver,
          tenancyEndTime: undefined,
          status: "free",
        }, adminId);

        // Assign the new driver
        const newDriver = (await this.driverRepo.getById(newDriverId))!!;
        await this.driverRepo.saveDriverInfo({
          ...newDriver,
          tenancyEndTime: trips[tripIndex].expectedArrivalTime,
          status: "scheduled",
        }, adminId);
      }

      // Update the resource
      trips[tripIndex].resources[resIndex] = lightTripResource;
    } else {
      // Assign the new vehicle
      const newVehicleId = lightTripResource.vehicle as string;
      const newVehicle = (await this.vehicleRepo.getById(newVehicleId))!!;
      await this.vehicleRepo.saveVehicleBasicInfo(newVehicleId, {
        ...newVehicle,
        tenancyEndTime: trips[tripIndex].expectedArrivalTime,
        status: "scheduled",
      }, adminId);

      // Assign the new driver
      const newDriverId = lightTripResource.driver as string;
      const newDriver = (await this.driverRepo.getById(newDriverId))!!;
      await this.driverRepo.saveDriverInfo({
        ...newDriver,
        tenancyEndTime: trips[tripIndex].expectedArrivalTime,
        status: "scheduled",
      }, adminId);

      // Add the new resource
      trips[tripIndex].resources.push(lightTripResource);
    }

    // Create the updated trip object
    const updatedTrip: Trip = {
      ...trips[tripIndex],
      ...auditUpdate(adminId),
    };

    // Save the updated trip to the server
    await fetch(`${API_URL}/api/data/trips`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTrip),
    });

    return (await this.getById(id))!!; // Return the updated trip directly
  }

  async saveTripInfo(
    id: string,
    agencyId: string,
    trip: Trip,
    adminId: string
  ): Promise<Trip> {
    const trips = await this.fetchData();
    if (id === "new") {
      const newTrip = {
        ...trip,
        id: crypto.randomUUID(),
      } satisfies Trip;

      await fetch(`${API_URL}/api/data/trips`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTrip),
      });

      return newTrip
    } else {
      // We are updating an existing trip
      const tripIndex = trips.findIndex((t) => t.id === id);

      if (tripIndex === -1) {
        throw new Error(`Trip with id ${id} not found.`);
      }

      const newTrip = { ...trips[tripIndex], ...trip, ...auditUpdate(adminId) };

      await fetch(`${API_URL}/api/data/trips`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTrip as Trip),
      });

      return newTrip
    }
  }
}


