// Driver class using Resource via composition and including its own audit info
class Driver {
  resource: Resource; // Composed Resource object
  name: string; // Driver's name
  licenseNumber: string; // Driver's license number
  contactInfo: { phone: string; email?: string }; // Driver's contact information
  auditInfo: AuditInfo; // Driver-specific audit information

  constructor(
    resourceId: string,
    permanentOwnerId: string,
    name: string,
    licenseNumber: string,
    contactInfo: { phone: string; email?: string },
    createdBy: string
  ) {
    this.resource = new Resource(
      resourceId,
      permanentOwnerId,
      false,
      createdBy
    );
    this.name = name;
    this.licenseNumber = licenseNumber;
    this.contactInfo = contactInfo;
    this.auditInfo = new AuditInfo(createdBy); // Initialize driver-specific audit info
  }

  // Method to update contact information
  updateContactInfo(phone: string, email?: string): void {
    this.contactInfo = { phone, email };
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

  // Method to update driver audit info
  updateAuditInfo(updatedBy: string): void {
    this.auditInfo.updateAuditInfo(updatedBy);
  }
}
