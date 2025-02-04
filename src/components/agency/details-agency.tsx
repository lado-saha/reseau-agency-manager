'use client';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  InfoIcon,
  SaveIcon,
  Trash2Icon,
  Check,
  ScaleIcon,
  GlobeIcon,
  ArrowRight,
  SkullIcon
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabsContent } from '@radix-ui/react-tabs';
import { AgencyProfile } from '@/lib/models/agency';
import { LegalDocumentsForm } from './form-legal-documents';
import { BasicInfoForm } from './form-basic-info';
import { SocialMediaForm } from './form-social-media';

export function AgencyDetailView({
  originalAgency
}: {
  originalAgency: AgencyProfile | undefined;
}) {
  const mode: 'edit-mode' | 'creation-mode' =
    originalAgency !== undefined ? 'edit-mode' : 'creation-mode';

  originalAgency = {
    id: 'new',
    basicInfo: {
      businessName: 'Example Travel Agency',
      logo: '/storage/1738591589237-what-I-wanter.png', // Replace with an actual image URL
      slogan: 'Your gateway to the world!',
      headquartersAddress: '123 Main Street, Cityville, Country',
      legalStructure: 'llc',
      phones: ['+1234567890', '+1987654321'],
      emails: ['info@exampletravel.com', 'support@exampletravel.com'],
      physicalCreationDate: new Date('2015-06-15')
    },
    legalDocs: {
      businessRegistration: '/storage/1738591589237-what-I-wanter.png',
      nationalIDBack: '/storage/1738591589237-what-I-wanter.png',
      taxClearance: '/storage/data-mining.pdf',
      nationalIDFront: '/storage/rec.pdf',
      travelLicense: '/storage/1738591589237-what-I-wanter.png',
      insuranceCertificate: '/storage/rec.pdf'
    },
    socialMedia: {
      facebook: 'facebook ',
      twitter: 'twitter ',
      instagram: 'instagram ',
      linkedIn: 'linkedIn ',
      whatsapp: 'whatsapp ',
      tiktok: 'tiktok ',
      youtube: 'youtube ',
      telegram: 'telegram'
    }
  };

  const [tab, setTab] = useState<'basic-info' | 'legal-info' | 'social-media'>(
    'basic-info'
  );

  const handleNextClick = () => {
    if (tab === 'basic-info') {
      setTab('legal-info');
    } else if (tab === 'legal-info') {
      setTab('social-media');
    }
  };

  const handleCreateClick = () => {};

  const handleDeleteClick = () => {
    // Handle the agency deletion here
  };

  return (
    <div>
      <Tabs
        value={tab}
        onValueChange={(value) =>
          setTab(value as 'basic-info' | 'legal-info' | 'social-media')
        }
      >
        {/* Tabs for filtering */}
        <div className="flex items-center mt-2 mb-2">
          <TabsList>
            <TabsTrigger value="basic-info" className="items-center">
              <InfoIcon className="mx-1 w-4 h-4" />
              <span className="hidden sm:inline">Basic Info</span>
            </TabsTrigger>

            <TabsTrigger value="legal-info" className="items-center">
              <ScaleIcon className="mx-1 w-4 h-4" />
              <span className="hidden sm:inline">Legal Info</span>
            </TabsTrigger>

            <TabsTrigger value="social-media" className="items-center">
              <GlobeIcon className="mx-1 w-4 h-4" />
              <span className="hidden sm:inline">Social Media</span>
            </TabsTrigger>
          </TabsList>

          <div className="ml-auto flex items-center gap-2">
            {mode === 'creation-mode' ? (
              <>
                {tab !== 'social-media' && (
                  <Button
                    size="sm"
                    className="h-8 gap-1"
                    onClick={handleNextClick}
                  >
                    <span className="hidden md:inline">Next</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                )}

                {tab === 'social-media' && (
                  <Button
                    size="sm"
                    className="h-8 gap-1"
                    onClick={handleCreateClick}
                  >
                    <SaveIcon className="h-3.5 w-3.5" />
                    <span className="hidden md:inline">Create Agency</span>
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button size="sm" type="button">
                  <Check className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">Update Agency</span>
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleDeleteClick}
                >
                  <Trash2Icon className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">Delete Agency</span>
                  <SkullIcon className="h-3.5 w-3.5" />
                </Button>
              </>
            )}
          </div>
        </div>

        <TabsContent value={tab} className="overflow-x-hidden">
          {tab === 'legal-info' ? (
            <LegalDocumentsForm
              oldLegalInfo={originalAgency.legalDocs}
              onSubmitCompleteAction={(data) => {
                console.log(JSON.stringify(data));
              }}
            />
          ) : tab === 'basic-info' ? (
            <BasicInfoForm
              oldBasicInfo={originalAgency.basicInfo}
              onSubmitCompleteAction={(data) => {
                console.log(JSON.stringify(data));
              }}
            />
          ) : (
            <SocialMediaForm
              oldSocialInfo={originalAgency.socialMedia}
              onSubmitCompleteAction={(data) => {
                console.log(JSON.stringify(data));
              }}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
