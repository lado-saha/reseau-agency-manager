// AuditInfo class to hold audit details
class AuditInfo {
  createdOn: Date; // Timestamp when the resource was created
  updatedOn: Date; // Timestamp when the resource was last updated
  createdBy: string; // User or system that created the resource
  updatedBy: string; // User or system that last updated the resource

  constructor(createdBy: string) {
    this.createdOn = new Date();
    this.updatedOn = new Date();
    this.createdBy = createdBy;
    this.updatedBy = createdBy;
  }

  // Method to update the audit info
  updateAuditInfo(updatedBy: string): void {
    this.updatedOn = new Date();
    this.updatedBy = updatedBy;
  }
}
