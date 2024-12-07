// Vehicle class using Resource via composition and including its own audit info
class Vehicle {
  resource: Resource; // Composed Resource object
  immatriculation: string; // Vehicle registration number
  nbSeats: number; // Number of seats in the vehicle
  model: string; // Vehicle model name
  positionGps: { latitude: number; longitude: number }; // GPS coordinates
  auditInfo: AuditInfo ; // Vehicle-specific audit information

  constructor(
    resourceId: string,
    permanentOwnerId: string,
    immatriculation: string,
    nbSeats: number,
    model: string,
    positionGps: { latitude: number; longitude: number },
    createdBy: string
  ) {
    this.resource = new Resource(resourceId, permanentOwnerId, false, createdBy);
    this.immatriculation = immatriculation;
    this.nbSeats = nbSeats;
    this.model = model;
    this.positionGps = positionGps;
    this.auditInfo = new AuditInfo(createdBy); // Initialize vehicle-specific audit info
  }

  // Method to update GPS position
  updatePosition(latitude: number, longitude: number): void {
    this.positionGps = { latitude, longitude };
    this.resource.auditInfo.updatedOn = new Date(); // Update resource-level updatedOn
  }

  // Method to update maintenance status
  setMaintenanceStatus(
    isUnderMaintenance: boolean,
    startTime?: Date,
    endTime?: Date
  ): void {
    this.resource.setMaintenanceStatus(isUnderMaintenance, startTime, endTime);
  }

  // Method to update vehicle audit info
  updateAuditInfo(updatedBy: string): void {
    this.auditInfo.updateAuditInfo(updatedBy);
  }
}
