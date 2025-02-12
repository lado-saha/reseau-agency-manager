'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
  EyeIcon,
  SearchIcon,
  TrashIcon
} from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { User } from '@/lib/models/user';
import { Station } from '@/lib/models/station';
import { saveStationBasicInfo, searchEmployeeByEmail } from '@/lib/actions';
import { agencyEmplRoles } from '@/lib/models/employee';
import { ErrorDialog } from '../dialogs/dialog-error';

const schema = z.object({
  name: z
    .string()
    .min(1, { message: 'Please provide a common name for your station.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' })
});

type FormValues = z.infer<typeof schema>;

export function StationBasicInfoForm({
  id,
  oldStation,
  onSubmitCompleteAction,
  adminId,
  agencyId,
}: {
  id: string;
  oldStation?: Station;
  onSubmitCompleteAction: (newId: string, data: Partial<Station>) => void;
  adminId: string;
  agencyId: string;
}) {
  const [stationChief, setStationChief] = useState<User | undefined>(
    oldStation?.chief as User | undefined
  );
  const [entrancePhotoPreview, setEntrancePhotoPreview] = useState<string | null>(oldStation?.entrancePhoto || null);
  const [selectedEntrancePhoto, setSelectedEntrancePhoto] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, setIsPending] = useState<boolean>(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'all',
    defaultValues: {
      name: oldStation?.name || '',
      email: (oldStation?.chief as User | undefined)?.email || ''
    }
  });

  const searchChief = async () => {
    const isValid = await form.trigger('email');
    if (isValid) {
      setIsPending(true);
      const email = form.getValues('email');
      try {
        const employee = await searchEmployeeByEmail(
          agencyId,
          email,
          agencyEmplRoles
        );
        if (!employee) {
          setStationChief(undefined);
          setErrorMessage(`No employee was found with the email: ${email}.`);
        } else {
          if (employee.role === 'station-chief') {
            setStationChief(employee?.user as User);
            console.log("Conso:", employee?.user)
          } else {
            setErrorMessage(`The employee was found but is not a Station Chief. You can update their role in the Employee section.`);
          }
        }
      } catch (e) {
        setErrorMessage((e as Error).message);
      }
      setIsPending(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsPending(true);
    if (!selectedEntrancePhoto && !entrancePhotoPreview) {
      setErrorMessage('Please upload a photo of your station entrance to help with localization.');
      return;
    }
    try {
      if (stationChief) {
        const newStation = await saveStationBasicInfo(
          id,
          {
            name: data.name,
            chief: stationChief.id,
            agency: agencyId,
            entrancePhoto: selectedEntrancePhoto ? selectedEntrancePhoto : entrancePhotoPreview!!,
          },
          adminId,
        );
        onSubmitCompleteAction(id, newStation);
      }
    } catch (error) {
      setErrorMessage(`An error occurred: ${(error as Error).message}`);
    } finally {
      setIsPending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Disable the default form submission on Enter
    }
  };

  const handleEntrancePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedEntrancePhoto(file);
      const reader = new FileReader();
      reader.onload = () => setEntrancePhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveEntrancePhoto = () => {
    setEntrancePhotoPreview(null);
    setSelectedEntrancePhoto(null);
    const fileInput = document.getElementById('photo-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; // Clear the input value
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Station Basic Information</CardTitle>
        <CardDescription>
          Please provide details about the Station Chief, station name, and a photo of the entrance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onKeyDown={handleKeyDown}
            className="flex flex-col gap-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid gap-6">
              {/* Chief Section */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-32 h-32 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden">
                  {stationChief?.photo ? (
                    <Image
                      src={stationChief.photo as string}
                      alt="User Profile Photo"
                      layout="fill"
                      objectFit="cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm text-center">
                      No profile photo available
                    </span>
                  )}
                </div>

                {stationChief && (
                  <div className="text-center">
                    <p className="text-lg font-medium">{stationChief.name}</p>
                    <p className="text-sm text-gray-500">{stationChief.phone}</p>
                  </div>
                )}

                {stationChief?.photo && (
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(stationChief.photo as string, '_blank');
                    }}
                  >
                    <EyeIcon className="h-4 w-4" />
                    <span className="hidden md:inline">View Full Photo</span>
                  </Button>
                )}
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Station Chief's Email</FormLabel>
                    <FormControl>
                      <div className="flex w-full items-center space-x-2">
                        <Input
                          type="email"
                          placeholder="Enter employee's email"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={searchChief}
                        >
                          <SearchIcon className="h-4 w-4" />
                          <span className="hidden md:inline">Search</span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Enter a valid email address and click "Search" to find an existing employee who can be assigned as the Station Chief.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="border-t border-gray-300" />
              <div className="flex flex-col items-center gap-4">
                {/* Image Preview */}
                <FormLabel
                  htmlFor="photo-upload"
                  className="relative w-32 h-32 rounded-md border-2 border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer"
                >
                  {entrancePhotoPreview ? (
                    <Image
                      src={entrancePhotoPreview}
                      alt="Entrance Photo Preview"
                      layout="fill"
                      objectFit="cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm text-center">
                      Upload entrance photo
                    </span>
                  )}
                </FormLabel>

                {/* File Input */}
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleEntrancePhotoChange}
                />

                {entrancePhotoPreview && (
                  <div className="flex flex-row gap-2 items-center">
                    {/* View Button */}
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(entrancePhotoPreview, '_blank');
                      }}
                    >
                      <EyeIcon className="h-4 w-4" />
                      <span className="hidden md:inline">View Full Photo</span>
                    </Button>

                    {/* Delete Button */}
                    <Button
                      variant="destructive"
                      onClick={handleRemoveEntrancePhoto}
                    >
                      <TrashIcon className="h-4 w-4" />
                      <span className="hidden md:inline">Remove</span>
                    </Button>
                  </div>
                )}
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Station Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter the name of your station"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This name will be used to identify your station.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving...' : 'Save'}
              </Button>
              <ErrorDialog
                isOpen={errorMessage !== ''}
                onCloseAction={() => setErrorMessage('')}
                title="Error Occurred"
                description={errorMessage}
              />

            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
