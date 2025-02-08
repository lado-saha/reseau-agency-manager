import { API_URL } from "../utils";
import { JsonRepository, UserRepository } from "./json-repository";


export interface GPSPosition {
  latitude: number;
  longitude: number;
}

export interface PlaceAddress extends GPSPosition {
  id: string;
  road?: string;
  suburb?: string;
  city?: string;
  state?: string;
  country?: string;
}
export function formatAddress(address: PlaceAddress): string {
  const { road, suburb, city, state } = address;

  return [road, suburb, city, state]
    .filter(Boolean) // Remove undefined or empty values
    .join(", ");
}


export class PlaceRepository extends JsonRepository<PlaceAddress> {
  constructor() {
    super('places.json');
  }

  async getByIds(ids: string[]): Promise<PlaceAddress[]> {
    const users = await this.fetchData();
    return users.filter((a) => ids.includes(a.id))
  }


  async savePlace(
    place: PlaceAddress,
  ): Promise<PlaceAddress> {
    const places = await this.fetchData();

    if (place.id === "new") {
      // Notice that logo is a File when we have changed else it remains a string
      let newPlace = {
        ...place,
        id: crypto.randomUUID(),
      } satisfies PlaceAddress;

      await fetch(`${API_URL}/api/data/places`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPlace),
      });

      // return [newAgency.id, newAgency.basicInfo]
      return newPlace
    } else {
      // We are updating an existing agency
      const index = places.findIndex((pl) => pl.id === place.id);

      if (index === -1) {
        throw new Error(`Place with id ${place.id} not found.`);
      }

      const newPlace = { ...places[index], ...place };

      await fetch(`${API_URL}/api/data/agencies`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPlace)
      });

      return place
    }
  }


  static async fetchPlaceRemote({ latitude, longitude }: GPSPosition): Promise<PlaceAddress | null> {
    const url = `${process.env.OSM_BASE_URL}&lat=${latitude}&lon=${longitude}`;
    const response = await fetch(url, { headers: { "User-Agent": "NextApp" } });

    if (!response.ok) return null;
    const data = await response.json();

    return {
      id: crypto.randomUUID(),
      latitude,
      longitude,
      road: data.address?.road,
      suburb: data.address?.suburb,
      city: data.address?.city,
      state: data.address?.state,
      country: data.address?.country,
    };
  }

  static async fetchNearbyPlaces(position: GPSPosition): Promise<PlaceAddress[]> {
    const deltas = [0, 0.0005, -0.0005, 0.0007, -0.0007, 0.0009]; // Offsets for nearby positions
    const requests = deltas.map((delta) =>
      this.fetchPlaceRemote({
        latitude: position.latitude + delta,
        longitude: position.longitude + delta,
      })
    );

    const places = (await Promise.all(requests)).filter((place): place is PlaceAddress => place !== null);
    return places;
  }
}
