// Station class using Agency and Location, with additional settings and photos
class Station {
  name: string; // Station name
  agency: Agency; // Associated agency
  auditInfo: AuditInfo; // Station-specific audit information
  location: Location; // Station's physical location
  photosUrls: string[]; // URLs to photos related to the station
  settings: { [key: string]: any }; // Additional customizable settings for the station (e.g., operating hours, etc.)

  constructor(
    name: string,
    agency: Agency,
    location: Location,
    photosUrls: string[],
    settings: { [key: string]: any },
    createdBy: string
  ) {
    this.name = name;
    this.agency = agency;
    this.auditInfo = new AuditInfo(createdBy);
    this.location = location;
    this.photosUrls = photosUrls;
    this.settings = settings;
  }

  // Method to update station audit info
  updateAuditInfo(updatedBy: string): void {
    this.auditInfo.updateAuditInfo(updatedBy);
  }
}
