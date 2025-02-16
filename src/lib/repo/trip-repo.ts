import { Trip, TripResource } from "@/lib/models/trip";
import { JsonRepository, UserRepository } from "./json-repository";
import { API_URL } from "../utils";
import { auditCreate, auditUpdate, SortingDirection } from "../models/helpers";
import { PlaceAddress, PlaceRepository } from "./osm-place-repo";
import { User } from "../models/user";
import { AgencyRepository } from "./agency-repo";
import { tripModelRepository } from "./vechicle-model-repo";
import { tripRepository } from "./trip-repo";
import { StationRepository } from "./station-repo";
import { AgencyEmployeeRepository, StationEmployeeRepository } from "./employee-repo";
import { VehicleRepository } from "./vehicle-repo";
import { DriverRepository } from "./driver-repo";

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
    const trip = (await super.getById(id))!!

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

  async saveTripBasicInfo(
    id: string,
    agencyId: string,
    trip: Trip,
    adminId: string
  ): Promise<Trip> {
    const trips = await this.fetchData();
    if (id === "new") {
      //if (
      //  trips.some(
      //    (st) => st.=== trip.name
      //  )
      //) {
      //  throw new Error("Trip with similar name already exists.");
      //}
      // Notice that logo is a File when we have changed else it remains a string
      let newTrip = {
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


