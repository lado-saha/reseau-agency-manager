import { AgencyProfile, AgencyLegalDocuments, AgencyBasicInfo, AgencySocialMediaInfo } from "@/lib/models/agency";
import { JsonRepository } from "@/lib/repo/json-repository";
import { API_URL } from "@/lib/utils";

export class AgencyRepository extends JsonRepository<AgencyProfile> {
  constructor() {
    super('agencies.json');
  }

  async uploadLegalDocuments(docs: AgencyLegalDocuments): Promise<AgencyLegalDocuments> {

    const uploadedDocs: Partial<AgencyLegalDocuments> = {};

    for (const key in docs) {
      const fileOrUrl = docs[key as keyof AgencyLegalDocuments];

      if (typeof fileOrUrl !== 'string') {
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
    newBasicInfo: AgencyBasicInfo,
    adminId?: string
  ): Promise<{ id: string, basicInfo: AgencyBasicInfo }> {
    const agencies = await this.fetchData();

    if (agencyId === "new") {
      if (
        agencies.some(
          (agency) => agency.basicInfo.businessName === newBasicInfo.businessName
        )
      ) {
        throw new Error("Agency with similar name already exists.");
      }
      // Notice that logo is a File when we have changed else it remains a string
      if (typeof newBasicInfo.logo !== 'string') {
        const formData = new FormData();
        formData.append('file', newBasicInfo.logo);
        const uploadResponse = await fetch(`${API_URL}/api/upload`, { method: 'POST', body: formData });
        const { fileUrl } = await uploadResponse.json();
        newBasicInfo.logo = fileUrl
      }

      let newAgency = {
        id: crypto.randomUUID(),
        ownerId: adminId,
        basicInfo: newBasicInfo,
      } satisfies Partial<AgencyProfile>;

      await fetch(`${API_URL}/api/data/agencies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAgency),
      });

      // return [newAgency.id, newAgency.basicInfo]
      return { id: newAgency.id, basicInfo: newAgency.basicInfo };
    } else {
      // We are updating an existing agency
      const agencyIndex = agencies.findIndex((agency) => agency.id === agencyId);

      if (agencyIndex === -1) {
        throw new Error(`Agency with id ${agencyId} not found.`);
      }

      agencies[agencyIndex].basicInfo = newBasicInfo;

      await fetch(`${API_URL}/api/data/agencies`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: agencyId, basicInfo: newBasicInfo } satisfies Partial<AgencyProfile>),
      });

      return { id: agencyId, basicInfo: newBasicInfo };
    }
  }

  async saveAgencyLegalDocuments(
    agencyId: string,
    newLegalDocs: AgencyLegalDocuments,
  ): Promise<AgencyLegalDocuments> {
    if (agencyId === 'new') {
      throw Error("You must save the Basic Info first")
    }
    const agencies = await this.fetchData();
    const agencyIndex = agencies.findIndex((agency) => agency.id === agencyId);
    if (agencyIndex === -1) {
      throw new Error(`Agency with id ${agencyId} not found.`);
    }

    const newDocs = await this.uploadLegalDocuments(newLegalDocs)
    agencies[agencyIndex].legalDocs = newDocs;

    await fetch(`${API_URL}/api/data/agencies`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: agencyId, 'legalDocs': newDocs } satisfies Partial<AgencyProfile>),
    });

    return newLegalDocs
  }

  async saveAgencySocialInfo(
    agencyId: string,
    newSocialInfo: AgencySocialMediaInfo,
  ): Promise<AgencySocialMediaInfo> {

    if (agencyId === 'new') {
      throw Error("You must save the Basic Info first.")
    }
    const agencies = await this.fetchData();
    const agencyIndex = agencies.findIndex((agency) => agency.id === agencyId);
    if (agencyIndex === -1) {
      throw new Error(`Agency with id ${agencyId} not found.`);
    }

    agencies[agencyIndex].socialMedia = newSocialInfo;

    await fetch(`${API_URL}/api/data/agencies`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: agencyId, socialMedia: newSocialInfo } satisfies Partial<AgencyProfile>),
    });

    return newSocialInfo
  }
}

