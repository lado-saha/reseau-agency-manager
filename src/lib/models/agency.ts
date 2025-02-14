/**
 * This definition file will contain all definitions relative to an agency
 */
import { Audit, GeoLocation } from '@/lib/models/helpers';
import { LucideFastForward } from 'lucide-react';

// Agency export class with audit information

// Interface for the creator's personal details
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
export interface Agency {
  id: string
  basicInfo: AgencyBasicInfo;
  legalDocs: AgencyLegalDocuments;
  socialMedia: AgencySocialMediaInfo;
  ownerId: string; // Instead of embedding the entire user object
  adminIds: string[]; // Only store user IDs
}


export const AGENCY_EMPTY: Agency = {
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
