// Agency class with audit information
class Agency {
  agencyId: string; // Unique agency identifier
  name: string; // Agency name
  motto: string; // Agency motto
  auditInfo: AuditInfo; // Composition of AuditInfo for agency-level auditing
  logoUrl: string; // URL to agency's logo
  contactInfo: { phone: string; email?: string }; // Optional contact info for the agency

  constructor(
    agencyId: string,
    name: string,
    motto: string,
    logoUrl: string,
    contactInfo: { phone: string; email?: string },
    createdBy: string
  ) {
    this.agencyId = agencyId;
    this.name = name;
    this.motto = motto;
    this.auditInfo = new AuditInfo(createdBy);
    this.logoUrl = logoUrl;
    this.contactInfo = contactInfo;
  }

  // Method to update agency audit info
  updateAuditInfo(updatedBy: string): void {
    this.auditInfo.updateAuditInfo(updatedBy);
  }
}
