import { Agency } from "../models/agency";
import { API_URL } from "../utils";
import { JsonRepository, UserRepository } from "./json-repository";
import { PlaceAddress } from "./osm-place-repo";

export class PlaceRepository extends JsonRepository<PlaceAddress> {
  constructor() {
    super('agencies.json');
  }
  async savePlace(
    id: string = "new",
    place: PlaceAddress,
  ): Promise<PlaceAddress> {
    const places = await this.fetchData();

    if (id === "new") {
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
      const index = places.findIndex((agency) => agency.id === id);

      if (index === -1) {
        throw new Error(`Place with id ${id} not found.`);
      }

      const newPlace = { ...places[index], place };

      await fetch(`${API_URL}/api/data/agencies`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPlace)

      });

      return place
    }
  }


}
