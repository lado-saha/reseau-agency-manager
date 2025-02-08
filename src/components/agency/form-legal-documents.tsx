'use client';

import { useInsertionEffect, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EyeIcon, MessageSquareWarningIcon, TrashIcon } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { getBlobURL, MAX_FILE_SIZE } from '@/lib/utils';
import { AgencyLegalDocuments } from '@/lib/models/agency';
import { saveAgencyLegalDocuments } from '@/lib/actions';
const isClient = typeof window !== 'undefined'; // Check if we are in the client

// Define the schema with proper file validation
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

const fileSchema = isClient
  ? z
      .instanceof(File, { message: 'A valid file is required.' })
      .refine((file) => file.size > 0, { message: 'File cannot be empty.' })
      .refine((file) => file.size <= MAX_FILE_SIZE, {
        message: 'File size must be 2MB or less.'
      })
      .refine((file) => ALLOWED_FILE_TYPES.includes(file.type), {
        message: 'Only JPEG, PNG, and PDF files are allowed.'
      })
      .refine((file) => !!file.name && file.name.trim().length > 0, {
        message: 'File must have a valid name.'
      })
  : z.any();

const legalDocumentsSchema = z.object({
  nationalIDFront: z.optional(fileSchema),
  nationalIDBack: z.optional(fileSchema),
  businessRegistration: z.optional(fileSchema),
  taxClearance: z.optional(fileSchema),
  travelLicense: z.optional(fileSchema),
  insuranceCertificate: z.optional(fileSchema)
});

export type LegalDocumentsFormValue = z.infer<typeof legalDocumentsSchema>;

export function LegalDocumentsForm({
  id,
  oldLegalInfo,
  onSubmitCompleteAction
}: {
  id: string;
  oldLegalInfo?: AgencyLegalDocuments;
  onSubmitCompleteAction: (data: AgencyLegalDocuments) => void;
}) {
  const [filePreviews, setFilePreviews] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, setIsPending] = useState(false);

  const form = useForm<LegalDocumentsFormValue>({
    resolver: zodResolver(legalDocumentsSchema),
    mode: 'onSubmit', // Ensures validation triggers on form submission
    defaultValues: {
      nationalIDFront: undefined,
      nationalIDBack: undefined,
      businessRegistration: undefined,
      taxClearance: undefined,
      travelLicense: undefined,
      insuranceCertificate: undefined
    }
  });

  const onSubmit = async (data: LegalDocumentsFormValue) => {
    // if()
    try {
      const newData = await saveAgencyLegalDocuments(id, {
        businessRegistration: data.businessRegistration,
        nationalIDBack: data.nationalIDBack,
        nationalIDFront: data.nationalIDFront,
        taxClearance: data.taxClearance,
        travelLicense: data.travelLicense,
        insuranceCertificate: data.insuranceCertificate
      });
      onSubmitCompleteAction(newData);
    } catch (error) {
      setErrorMessage(`Error! ${(error as Error).message}`);
    } finally {
      setIsPending(false);
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Disable the default form submission on Enter
    }
  };
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    name: keyof LegalDocumentsFormValue
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setFilePreviews((prev) => ({ ...prev, [name]: fileURL }));
      form.setValue(name, file, { shouldValidate: true }); // Ensure validation runs on change
    }
  };
  const renderFileInput = (
    name: keyof LegalDocumentsFormValue,
    label: string,
    description: string,
    accept: string
  ) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null); // Reference to input

    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <p className="text-sm text-gray-500">{description}</p>
            <FormControl>
              <div className="flex w-full items-center space-x-2">
                <Input
                  ref={(ref) => (fileInputRef.current = ref)} // Attach ref
                  type="file"
                  accept={accept}
                  onChange={(e) => {
                    field.onChange(e.target.files?.[0]);
                    handleFileChange(e, name);
                  }}
                />
                {filePreviews[name] && (
                  <>
                    {/* View File */}
                    <Button
                      variant="outline"
                      onClick={async (e) => {
                        e.preventDefault();
                        const url = await getBlobURL(filePreviews[name]);
                        url && window.open(url, '_blank');
                      }}
                    >
                      <EyeIcon className="h-3.5 w-3.5" />
                      <span className="hidden md:inline">View Doc</span>
                    </Button>

                    {/* Delete File */}
                    <Button
                      variant="destructive"
                      onClick={() => {
                        field.onChange(null); // Clear React Hook Form field
                        setFilePreviews((prev) => {
                          const updated = { ...prev };
                          delete updated[name]; // Remove preview
                          return updated;
                        });
                        if (fileInputRef.current) {
                          fileInputRef.current.value = ''; // Reset file input
                        }
                      }}
                    >
                      <TrashIcon className="h-3.5 w-3.5" />
                      <span className="hidden md:inline">Delete</span>
                    </Button>
                  </>
                )}
              </div>
            </FormControl>
            <FormMessage>{fieldState.error?.message}</FormMessage>
          </FormItem>
        )}
      />
    );
  };

  useEffect(() => {
    // Load previews if files exist in public storage
    if (oldLegalInfo) {
      const previewUrls = {
        nationalIDFront: oldLegalInfo.nationalIDFront
          ? oldLegalInfo.nationalIDFront
          : '',
        nationalIDBack: oldLegalInfo.nationalIDBack
          ? oldLegalInfo.nationalIDBack
          : '',
        businessRegistration: oldLegalInfo.businessRegistration
          ? oldLegalInfo.businessRegistration
          : '',
        taxClearance: oldLegalInfo.taxClearance
          ? oldLegalInfo.taxClearance
          : '',
        travelLicense: oldLegalInfo.travelLicense
          ? oldLegalInfo.travelLicense
          : '',
        insuranceCertificate: oldLegalInfo.insuranceCertificate
          ? oldLegalInfo.insuranceCertificate
          : ''
      };
      setFilePreviews(previewUrls);
    }
  }, [oldLegalInfo]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Upload for Verification</CardTitle>
        <CardDescription>
          Please upload the necessary documents to complete your verification.
          Ensure each file is in the correct format and does not exceed 2MB.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-6"
            onSubmit={form.handleSubmit(onSubmit)}
            // onKeyDown={(key) => {key.}}
            onKeyDown={handleKeyDown}
          >
            <div className="grid gap-6">
              {renderFileInput(
                'nationalIDFront',
                'National ID Front',
                'Upload a clear image of the front side of your national ID.',
                'image/*'
              )}
              {renderFileInput(
                'nationalIDBack',
                'National ID Back',
                'Upload a clear image of the back side of your national ID.',
                'image/*'
              )}
              {renderFileInput(
                'businessRegistration',
                'Business Registration',
                'Upload a scanned copy of your business registration document.',
                'application/pdf, image/*'
              )}
              {renderFileInput(
                'taxClearance',
                'Tax Clearance',
                'Provide a recent tax clearance certificate.',
                'application/pdf, image/*'
              )}
              {renderFileInput(
                'travelLicense',
                'Travel License',
                'Upload a copy of your valid travel license.',
                'application/pdf, image/*'
              )}
              {renderFileInput(
                'insuranceCertificate',
                'Insurance Certificate (Optional)',
                'Provide an insurance certificate if applicable.',
                'application/pdf, image/*'
              )}
              {/* Submit Button */}
              <Button
                className="mt-4 w-full"
                type="submit"
                disabled={isPending}
              >
                Save
              </Button>
              {/* Error Message */}
              {errorMessage && (
                <div className="flex items-center gap-2 text-sm text-red-500 w-full">
                  <MessageSquareWarningIcon className="h-5 w-5" />
                  <p>{errorMessage}</p>
                </div>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
