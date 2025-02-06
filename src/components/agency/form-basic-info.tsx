'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from '@/components/ui/command';
import {
  Check,
  ChevronsUpDown,
  EyeIcon,
  MessageSquareWarningIcon,
  PlusIcon,
  TrashIcon
} from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '../ui/card';
import { AgencyBasicInfo, AgencyRoles } from '@/lib/models/agency';
import { saveAgencyBasicInfoAction } from '@/lib/actions';

// Define the schema for the Agency Info form using Zod
const agencyInfoSchema = z.object({
  businessName: z.string().nonempty('Business name is required.'),
  slogan: z.string().optional(),
  headquartersAddress: z.string().nonempty('Headquarters address is required.'),
  legalStructure: z.enum(['llc', 'ltd', 'sole-proprietor', 'corp'], {
    message: 'Please select a legal structure.'
  }),
  phones: z.array(
    z.object({
      value: z
        .string()
        .regex(/^\+?[1-9]\d{1,14}$/, {
          message: 'Please enter a valid phone number with country code.'
        })
        .refine((value) => value.length > 0, {
          message: 'Contact number is required.'
        })
    })
  ),
  emails: z.array(
    z.object({
      value: z.string().email('Please enter a valid email address.')
    })
  ),
  // Modify this part to handle a date string
  physicalCreationDate: z.string().refine(
    (value) => {
      const parsedDate = Date.parse(value);
      return !isNaN(parsedDate); // Check if it's a valid date string
    },
    {
      message: 'Please select a valid establishment date.'
    }
  )
});

export type BasicInfoFormValue = z.infer<typeof agencyInfoSchema>;

const legalStructures = [
  { value: 'llc', label: 'LLC' },
  { value: 'ltd', label: 'LTD' },
  { value: 'sole-proprietor', label: 'Sole Proprietorship' },
  { value: 'corp', label: 'Corporation' }
];

export function BasicInfoForm({
  id,
  oldBasicInfo,
  onSubmitCompleteAction,
  adminId
}: {
  id: string;
  oldBasicInfo?: AgencyBasicInfo;
  onSubmitCompleteAction: (newId: string, data: AgencyBasicInfo) => void;
  adminId: string;
}) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    oldBasicInfo?.logo
  );
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);

  // Set up useForm with zod resolver for validation
  const form = useForm<BasicInfoFormValue>({
    resolver: zodResolver(agencyInfoSchema),
    defaultValues: {
      phones: oldBasicInfo?.phones?.map((v) => ({ value: v })) ?? [
        { value: '' }
      ],
      emails: oldBasicInfo?.emails?.map((v) => ({ value: v })) ?? [
        { value: '' }
      ],
      businessName: oldBasicInfo?.businessName ?? '',
      headquartersAddress: oldBasicInfo?.headquartersAddress ?? '',
      slogan: oldBasicInfo?.slogan ?? '',
      legalStructure: oldBasicInfo?.legalStructure ?? 'ltd',
      physicalCreationDate: oldBasicInfo?.physicalCreationDate
        ? new Date(oldBasicInfo.physicalCreationDate)
            .toISOString()
            .split('T')[0] // Format as YYYY-MM-DD
        : ''
    }
  });

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedLogo(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Reset file input when removing logo
  const handleRemoveLogo = () => {
    setImagePreview(null);
    setSelectedLogo(null);
    const fileInput = document.getElementById(
      'logo-upload'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; // Clear the input value
    }
  };

  // Set up field arrays for dynamic inputs
  const {
    fields: phoneFields,
    append: appendPhone,
    remove: removePhone
  } = useFieldArray({
    control: form.control,
    name: 'phones'
  });

  const {
    fields: emailFields,
    append: appendEmail,
    remove: removeEmail
  } = useFieldArray({
    control: form.control,
    name: 'emails'
  });

  const onSubmit = async (data: BasicInfoFormValue) => {
    try {
      // If selected logo is null, then the image preview must not be
      if (!selectedLogo && !imagePreview) {
        throw new Error('Please select a profile picture.');
      }

      const newData = await saveAgencyBasicInfoAction(
        id,
        {
          businessName: data.businessName,
          emails: data.emails.flatMap((email) => email.value),
          phones: data.phones.flatMap((phone) => phone.value),
          headquartersAddress: data.headquartersAddress,
          legalStructure: data.legalStructure,
          logo: selectedLogo ? selectedLogo : imagePreview!!,
          physicalCreationDate: new Date(data.physicalCreationDate),
          slogan: data.slogan
        },
        adminId // The current user owns the agency and used only if we're creating
      );
      onSubmitCompleteAction(newData.id, newData.basicInfo);
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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agency Basic Information</CardTitle>
        <CardDescription>
          Please provide the necessary details about your agency to complete the
          registration. Donot put any @ at the start
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-6"
            onSubmit={form.handleSubmit(onSubmit)}
            onKeyDown={handleKeyDown}
          >
            <div className="grid gap-6">
              {/* Logo Picker */}
              <div className="flex flex-col items-center gap-4">
                {/* Image Preview */}
                <FormLabel
                  htmlFor="logo-upload"
                  className="relative w-32 h-32 rounded-md border-2 border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer"
                >
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Logo Preview"
                      layout="fill"
                      objectFit="cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">Pick Logo</span>
                  )}
                </FormLabel>

                {/* Logo File Input */}
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoChange}
                />

                {imagePreview && (
                  <div className="flex flex-row gap-2 items-center">
                    {/* View Button */}
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(imagePreview, '_blank');
                      }}
                    >
                      <EyeIcon className="h-4 w-4" />
                      <span className="hidden md:inline">Preview</span>
                    </Button>

                    {/* Delete Button */}
                    <Button
                      variant="destructive"
                      onClick={(e) => {
                        // e.preventDefault();
                        handleRemoveLogo();
                      }}
                    >
                      <TrashIcon className="h-4 w-4 " />
                      <span className="hidden md:inline">Remove</span>
                    </Button>
                  </div>
                )}
              </div>

              {/* Business Name */}
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input
                        id="businessName"
                        type="text"
                        placeholder="Business Name"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the official name of your business.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Slogan */}
              <FormField
                control={form.control}
                name="slogan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slogan</FormLabel>
                    <FormControl>
                      <Input
                        id="slogan"
                        type="text"
                        placeholder="Enter your slogan"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A catchy phrase that represents your agency.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Headquarters Address */}
              <FormField
                control={form.control}
                name="headquartersAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Headquarters Address</FormLabel>
                    <FormControl>
                      <Input
                        id="headquartersAddress"
                        type="text"
                        placeholder="Address"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The primary address of your agency's headquarters.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Legal Structure */}
              <FormField
                control={form.control}
                name="legalStructure"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Legal Structure</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              'w-full justify-between',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value
                              ? legalStructures.find(
                                  (ls) => ls.value === field.value
                                )?.label
                              : 'Select Legal Structure'}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0 ">
                        <Command>
                          <CommandInput
                            placeholder="Search legal structure..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>
                              No legal structure found.
                            </CommandEmpty>
                            <CommandGroup>
                              {legalStructures.map((ls) => (
                                <CommandItem
                                  key={ls.value}
                                  onSelect={() =>
                                    form.setValue('legalStructure', ls.value)
                                  }
                                >
                                  {ls.label}
                                  <Check
                                    className={cn(
                                      'ml-auto',
                                      ls.value === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Select the legal structure of your agency.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Contact Number */}
              <div>
                <FormLabel>Contact Number</FormLabel>
                <FormDescription>
                  Provide at least one contact number for your agency.
                </FormDescription>
                {phoneFields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`phones.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex gap-2 items-center">
                          <FormControl>
                            <Input
                              {...field}
                              id={`phones-${index}`}
                              placeholder={`Phone number ${index + 1}`}
                              className="m-0.5 mx-1"
                            />
                          </FormControl>
                          {/* Only allow deletion if there are more than 1 field and it's not the first */}
                          {index > 0 && (
                            <Button
                              variant="destructive"
                              onClick={() => removePhone(index)}
                            >
                              <TrashIcon className="h-3.5 w-3.5" />
                              <span className="hidden md:inline">Remove</span>
                            </Button>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                {/* Limit to 4 fields */}
                {phoneFields.length < 4 && (
                  <Button
                    type="button"
                    onClick={() => appendPhone({ value: '' })}
                    className="mt-2"
                  >
                    <PlusIcon className="h-3.5 w-3.5" />
                    <span className="hidden md:inline">Add Phone</span>
                  </Button>
                )}
              </div>

              {/* Email (Dynamic Fields) */}
              <div>
                <FormLabel>Email</FormLabel>
                <FormDescription>
                  Provide at least one email address for your agency.
                </FormDescription>
                {emailFields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`emails.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex gap-2 items-center">
                          <FormControl>
                            <Input
                              {...field}
                              id={`email-${index}`}
                              placeholder={`Email address ${index + 1}`}
                              className="m-0.5 mx-1"
                            />
                          </FormControl>
                          {/* Only allow deletion if there are more than 1 field and it's not the first */}
                          {index > 0 && (
                            <Button
                              variant="destructive"
                              onClick={() => removeEmail(index)}
                            >
                              <TrashIcon className="h-3.5 w-3.5" />
                              <span className="hidden md:inline">Remove</span>
                            </Button>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                {/* Limit to 4 fields */}
                {emailFields.length < 4 && (
                  <Button
                    type="button"
                    onClick={() => appendEmail({ value: '' })}
                    className="mt-2"
                  >
                    <PlusIcon className="h-3.5 w-3.5" />
                    <span className="hidden md:inline">Add Email</span>
                  </Button>
                )}
              </div>

              {/* Physical Creation Date */}
              <FormField
                control={form.control}
                name="physicalCreationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Physical Creation Date</FormLabel>
                    <FormControl>
                      <Input id="physicalCreationDate" type="date" {...field} />
                    </FormControl>
                    <FormDescription>
                      The date your agency was officially established.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
