// Location class to represent the physical location of a Station
class GeoLocation {
  country: string;
  region: string;
  town: string;
  quarter: string;
  gpsPosition: { latitude: number; longitude: number };

  constructor(
    country: string,
    region: string,
    town: string,
    quarter: string,
    gpsPosition: { latitude: number; longitude: number }
  ) {
    this.country = country;
    this.region = region;
    this.town = town;
    this.quarter = quarter;
    this.gpsPosition = gpsPosition;
  }
}


