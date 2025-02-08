import { User } from "next-auth";
import { Agency } from "./agency";
import { Audit, AUDIT_EMPTY, GeoLocation, GPSPosition,} from "./helpers";
import { PlaceAddress } from "../repo/osm-place-repo";

export interface Station extends Audit {
  id: string
  name: string;
  agency: Agency | string;
  chief: User | string
  admins: User[] | string[]
  address: PlaceAddress | string,
  entrancePhoto: File | string
}

export const STATION_EMPTY: Station = {
  id: '',
  name: '',
  agency: '',
  chief: '',
  admins: [],
  address: '',
  entrancePhoto: '',
  ...AUDIT_EMPTY
}