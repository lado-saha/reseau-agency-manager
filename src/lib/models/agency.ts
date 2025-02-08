/**
 * This definition file will contain all definitions relative to an agency
 */
import { AuditInfo, GeoLocation } from '@/lib/models/helpers';
import { LucideFastForward } from 'lucide-react';

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

  // Image file for CNI back
  passportPhoto: File;   // 4x4 photo
  sex: "Male" | "Female";
}

// Interface for agency details
export interface AgencyBasicInfo {
  businessName: string;
  logo: File | string;
  slogan?: string;  // Optional field
  headquartersAddress: string;
  legalStructure: "llc" | "ltd" | "sole-proprietor" | "corp";
  phones: string[];
  emails: string[];
  physicalCreationDate: Date
}

// Interface for legal documents
export interface AgencyLegalDocuments {
  nationalIDFront: File | string;
  nationalIDBack: File | string;
  businessRegistration: File | string;
  taxClearance: File | string;
  travelLicense: File | string;
  insuranceCertificate?: File | string;
}


// Interface for social media presence
export interface AgencySocialMediaInfo {
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
  basicInfo: AgencyBasicInfo;
  legalDocs: AgencyLegalDocuments;
  socialMedia: AgencySocialMediaInfo;
  ownerId: string; // Instead of embedding the entire user object
  adminIds: string[]; // Only store user IDs
}


export const AGENCY_EMPTY: AgencyProfile = {
  id: "",
  ownerId: "",
  adminIds: [""],
  basicInfo: {
    businessName: "",
    logo: "", // Empty string since File cannot be instantiated without user input
    slogan: undefined,
    headquartersAddress: "",
    legalStructure: "llc", // Defaulting to one of the options
    phones: [],
    emails: [],
    physicalCreationDate: new Date(0), // Epoch time as a placeholder
  },
  legalDocs: {
    nationalIDFront: "",
    nationalIDBack: "",
    businessRegistration: "",
    taxClearance: "",
    travelLicense: "",
    insuranceCertificate: undefined,
  },
  socialMedia: {
    facebook: undefined,
    twitter: undefined,
    instagram: undefined,
    linkedIn: undefined,
    whatsapp: undefined,
    tiktok: undefined,
    youtube: undefined,
    telegram: undefined,
  }
};

export type AgencyRoles = 'admin' | 'owner'