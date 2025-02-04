import { AgencyProfile, AgencyLegalDocuments, AgencyBasicInfo, AgencySocialMediaInfo } from "@/lib/models/agency";
import { JsonRepository } from "@/lib/repo/json-repository";
import { API_URL } from "@/lib/utils";

export class AgencyRepository extends JsonRepository<AgencyProfile> {
  constructor() {
    super('vehicles.json');
  }

  async uploadLegalDocuments(docs: AgencyLegalDocuments): Promise<AgencyLegalDocuments> {
    
    const uploadedDocs: Partial<AgencyLegalDocuments> = {};

    for (const key in docs) {
      const fileOrUrl = docs[key as keyof AgencyLegalDocuments];

      if (fileOrUrl instanceof File) {
        const formData = new FormData();
        formData.append('file', fileOrUrl);

        const uploadResponse = await fetch(`${API_URL}/api/upload`, { method: 'POST', body: formData });
        const { fileUrl } = await uploadResponse.json();

        uploadedDocs[key as keyof AgencyLegalDocuments] = fileUrl; // Convert File to URL
      } else {
        uploadedDocs[key as keyof AgencyLegalDocuments] = fileOrUrl; // Already a URL
      }
    }

    return uploadedDocs as AgencyLegalDocuments;
  }

  async saveAgencyBasicInfo(
    agencyId: string = "new",
    newBasicInfo: AgencyBasicInfo
  ): Promise<AgencyBasicInfo> {
    const agencies = await this.fetchData();

    if (agencyId === "new") {
      // We are creating a new agency
      if (
        agencies.some(
          (agency) => agency.basicInfo.businessName === newBasicInfo.businessName
        )
      ) {
        throw new Error("Agency with similar name already exists.");
      }

      const newAgency = {
        id: crypto.randomUUID(),
        basicInfo: newBasicInfo,
      };

      await fetch(`${API_URL}/api/agency`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAgency),
      });

      return newAgency.basicInfo;
    } else {
      // We are updating an existing agency
      const agencyIndex = agencies.findIndex((agency) => agency.id === agencyId);

      if (agencyIndex === -1) {
        throw new Error(`Agency with id ${agencyId} not found.`);
      }

      agencies[agencyIndex].basicInfo = newBasicInfo;

      await fetch("api/agency", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: agencyId, basicInfo: newBasicInfo } satisfies Partial<AgencyProfile>),
      });

      return newBasicInfo;
    }
  }

  async saveAgencyLegalDocuments(
    agencyId: string = 'new',
    newLegalDocs: AgencyLegalDocuments,

  ): Promise<AgencyLegalDocuments> {
    const agencies = await this.fetchData();
    const agencyIndex = agencies.findIndex((agency) => agency.id === agencyId);
    if (agencyIndex === -1) {
      throw new Error(`Agency with id ${agencyId} not found.`);
    }

    const newDocs = await this.uploadLegalDocuments(newLegalDocs)
    agencies[agencyIndex].legalDocs = newDocs;

    await fetch("api/agency", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: agencyId, 'legalDocs': newDocs } satisfies Partial<AgencyProfile>),
    });

    return newLegalDocs
  }


  async saveAgencyLegalSocial(
    agencyId: string = 'new',
    newSocialInfo: AgencySocialMediaInfo,
  ): Promise<AgencySocialMediaInfo> {
    const agencies = await this.fetchData();
    const agencyIndex = agencies.findIndex((agency) => agency.id === agencyId);
    if (agencyIndex === -1) {
      throw new Error(`Agency with id ${agencyId} not found.`);
    }

    agencies[agencyIndex].socialMedia = newSocialInfo;

    await fetch(`${API_URL}/api/agency`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: agencyId, socialMedia: newSocialInfo } satisfies Partial<AgencyProfile>),
    });

    return newSocialInfo
  }
}

