import { Station } from "@/lib/models/station";
import { JsonRepository, UserRepository } from "./json-repository";
import { API_URL } from "../utils";
import { auditCreate, auditUpdate, SortingDirection } from "../models/helpers";
import { PlaceAddress, PlaceRepository } from "./osm-place-repo";
import { User } from "../models/user";

export class StationRepository extends JsonRepository<Station> {
  private placeRepo = new PlaceRepository();
  private userRepo = new UserRepository();
  constructor() {
    super('stations.json');
  }

  async saveStationGeoInfo(
    stationId: string,
    place: PlaceAddress,
    adminId: string
  ): Promise<Station> {
    if (stationId === 'new') {
      throw Error("You must save the Basic Info first.")
    }
    console.log(place)
    const station = await this.fetchData();
    const index = station.findIndex((station) => station.id === stationId);
    if (index === -1) {
      throw new Error(`Station with id ${stationId} not found.`);
    }

    const newPlace = await this.placeRepo.savePlace(place)
    console.log(newPlace)
    const newStation = { ...station[index], address: newPlace?.id, ...auditUpdate(adminId) } satisfies Station

    await fetch(`${API_URL}/api/data/stations`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStation)
    });

    return newStation
  }

  async getById(id: string): Promise<Station | undefined> {
    const station = (await super.getById(id))!!
    const chief = await this.userRepo.getById(station?.chief as string)
    const address = await this.placeRepo.getById(station?.address as string)
    return { ...station, chief: chief as User, address: address as PlaceAddress }
  }

  async getByIds(ids: string[]): Promise<Station[]> {
    const stations = (await this.fetchData()).filter(v => ids.includes(v.id));

    // Fetch chiefs and addresses in parallel
    const [chiefs, addresses] = await Promise.all([
      this.userRepo.getByIds(stations.map(station => station.chief as string)),
      this.placeRepo.getByIds(stations.map(station => station.address as string)),
    ]);

    // Create Maps for quick lookups
    const chiefMap = new Map(chiefs.map(chief => [chief.id, chief]));
    const addressMap = new Map(addresses.map(address => [address.id, address]));

    // Map stations to include chiefs and addresses
    return stations.map(station => ({
      ...station,
      chief: chiefMap.get(station.chief as string) as User,
      address: addressMap.get(station.address as string) as PlaceAddress,
    }));
  }

  async getAll(
    search?: string,
    offset?: number,
    sortBy?: string | undefined,
    direction?: SortingDirection
  ): Promise<{ items: Station[]; newOffset: number; totalCount: number }> {
    const stations = await super.getAll(search, offset, sortBy, direction);

    // Extract chief and address IDs
    const chiefIds = stations.items.map(st => st.chief as string);
    const placeIds = stations.items.map(st => st.address as string);

    // Fetch chiefs and addresses in parallel
    const [chiefs, addresses] = await Promise.all([
      this.userRepo.getByIds(chiefIds),
      this.placeRepo.getByIds(placeIds),
    ]);

    // Create Maps for quick lookups
    const chiefMap = new Map(chiefs.map(chief => [chief.id, chief]));
    const addressMap = new Map(addresses.map(address => [address.id, address]));

    // Map stations to include chiefs and addresses
    const itemsWithChiefs = stations.items.map(station => {
      const chief = chiefMap.get(station.chief as string)!!;
      const address = addressMap.get(station.address as string)!!;

      return {
        ...station,
        chief: chief as User,
        address: address as PlaceAddress,
      };
    });

    return {
      ...stations,
      items: itemsWithChiefs,
    };
  }

  async saveStationBasicInfo(
    stationId: string = "new",
    station: Partial<Station>,
    adminId: string
  ): Promise<Partial<Station>> {
    const stations = await this.fetchData();

    if (stationId === "new") {
      if (
        stations.some(
          (st) => st.name === station.name

        )
      ) {
        throw new Error("Station with similar name already exists.");
      }
      // Notice that logo is a File when we have changed else it remains a string
      if (typeof station.entrancePhoto !== 'string') {
        const formData = new FormData();
        formData.append('file', station?.entrancePhoto as File);
        const uploadResponse = await fetch(`${API_URL}/api/upload`, { method: 'POST', body: formData });
        const { fileUrl } = await uploadResponse.json();
        station.entrancePhoto = fileUrl
      }

      let newStation = {
        id: crypto.randomUUID(),
        ...station,
        ...auditCreate(adminId)
      } satisfies Partial<Station>;

      await fetch(`${API_URL}/api/data/stations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStation),
      });

      // return [newStation.id, newStation.basicInfo]
      return newStation;
    } else {
      // We are updating an existing station
      const stationIndex = stations.findIndex((station) => station.id === stationId);

      if (stationIndex === -1) {
        throw new Error(`Station with id ${stationId} not found.`);
      }

      const newStation = { ...stations[stationIndex], ...station, ...auditUpdate(adminId) };

      await fetch(`${API_URL}/api/data/stations`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStation satisfies Partial<Station>),
      });

      return newStation
    }
  }
  // ============= Employee ==================
}


