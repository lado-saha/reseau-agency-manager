// Resource class now includes AuditInfo
class Resource {
  resourceId: string; // Unique identifier (UUID or similar)
  permanentOwnerId: string; // Permanent owner of the resource
  tempOwnerId?: string; // Temporary owner of the resource
  tempOwnershipStartTime?: Date; // Start time of temporary ownership
  tempOwnershipEndTime?: Date; // End time of temporary ownership
  isUnderMaintenance: boolean; // Indicates if the resource is under maintenance
  maintenanceStartTime?: Date; // Start time of maintenance (if applicable)
  maintenanceEndTime?: Date; // End time of maintenance (if applicable)
  auditInfo: AuditInfo; // Composition of AuditInfo for resource-level auditing

  constructor(
    resourceId: string,
    permanentOwnerId: string,
    isUnderMaintenance: boolean,
    createdBy: string
  ) {
    this.resourceId = resourceId;
    this.permanentOwnerId = permanentOwnerId;
    this.isUnderMaintenance = isUnderMaintenance;
    this.auditInfo = new AuditInfo(createdBy);
  }

  // Method to update the maintenance status
  setMaintenanceStatus(
    isUnderMaintenance: boolean,
    startTime?: Date,
    endTime?: Date
  ): void {
    this.isUnderMaintenance = isUnderMaintenance;
    this.maintenanceStartTime = startTime || undefined;
    this.maintenanceEndTime = endTime || undefined;
  }

  // Method to update audit info
  updateAuditInfo(updatedBy: string): void {
    this.auditInfo.updateAuditInfo(updatedBy);
  }
}
