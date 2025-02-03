/**
 * This definition file will contain all definitions relative to an agency
 */

import { AuditInfo, GeoLocation } from '@/lib/models/helpers';

// Agency export class with audit information
export class Agency {
  agencyId: string; // Unique agency identifier
  name: string; // Agency name
  motto: string; // Agency motto
  auditInfo: AuditInfo; // Composition of AuditInfo for agency-level auditing
  logoUrl: string; // URL to agency's logo
  contactInfo: { phone: string; email?: string }; // Optional contact info for the agency
  settings: { [key: string]: any }; // Additional customizable settings for the Agency(e.g., operating hours, etc.)

  constructor(
    agencyId: string,
    name: string,
    motto: string,
    logoUrl: string,
    contactInfo: { phone: string; email?: string },
    createdBy: string,
    settings: { [key: string]: any } // Additional customizable settings for the station (e.g., operating hours, etc.)
  ) {
    this.agencyId = agencyId;
    this.name = name;
    this.motto = motto;
    this.auditInfo = new AuditInfo(createdBy);
    this.logoUrl = logoUrl;
    this.contactInfo = contactInfo;
    this.settings = settings;
  }

  // Method to update agency audit info
  updateAuditInfo(updatedBy: string): void {
    this.auditInfo.updateAuditInfo(updatedBy);
  }
}

export class Station {
  name: string; // Station name
  agency: AgencyInfo; // Associated agency
  auditInfo: AuditInfo; // Station-specific audit information
  location: GeoLocation; // Station's physical location
  photosUrls: string[]; // URLs to photos related to the station
  settings: { [key: string]: any }; // Additional customizable settings for the station (e.g., operating hours, etc.)

  constructor(
    name: string,
    agency: AgencyInfo,
    location: GeoLocation,
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
// Interface for the creator's personal details
export interface CreatorInfo {
  name: string;

  nationalIDFront: File; // Image file for CNI front
  nationalIDBack: File;  // Image file for CNI back
  passportPhoto: File;   // 4x4 photo
  sex: "Male" | "Female";
}

// Interface for agency details
interface AgencyInfo {
  businessName: string;
  logo: string;
  slogan?: string;  // Optional field
  headquartersAddress: string;
  legalStructure: "LLC" | "LTD" | "Sole Proprietorship" | "Corporation";
  contactNumber: string;
  email: string;
}

// Interface for legal documents
export interface LegalDocuments {
  businessRegistration: File; // Registration certificate
  taxClearance: File;         // Tax clearance document
  travelLicense: File;        // Travel agency license
  insuranceCertificate?: File; // Optional travel insurance
}

// Interface for social media presence
export interface SocialMedia {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedIn?: string;
  whatsapp?: string;
  tiktok?: string;
  youtube?: string;
  telegram?: string;
}

// Combined interface for agency creation
export interface AgencyProfile {
  id: string
  creator: CreatorInfo;
  agency: AgencyInfo;
  legalDocs: LegalDocuments;
  socialMedia: SocialMedia;
}
