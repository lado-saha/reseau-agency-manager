import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { convertBitmaskToMatrix, convertMatrixToBitmask, FUEL_TYPES, FuelType, LUGGAGE_SPACES, LuggageSpace, VehicleModel } from '@/lib/models/resource';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown, EyeIcon, TrashIcon } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { ErrorDialog } from '../dialogs/dialog-error';
import VehicleModelLayoutEditor from './editor-vehicle-model-schema';
import { Badge } from '../ui/badge';
import { auditUpdOrNew } from '@/lib/models/helpers';
import { saveVehicleModel } from '@/lib/actions';
import Image from 'next/image';

// Define the validation schema using Zod
const schema = z.object({
  name: z
    .string()
    .min(2, { message: 'Model name must be at least 2 characters.' }),
  fuelType: z.enum(FUEL_TYPES, {
    message: 'Please select a valid fuel type.',
  }),
  luggageSpaces: z.array(z.enum(LUGGAGE_SPACES)),
  seatCount: z.coerce
    .number()
    .min(1, { message: 'Number of seats must be at least 1.' }),
});

// Define fuel types for the dropdown
const fuelTypes = [
  { value: 'petrol', label: 'Petrol (Super)' },
  { value: 'diesel', label: 'Diesel (Gazoil)' },
  { value: 'electric', label: 'Electric' },
  { value: 'hybrid', label: 'Hybrid' },
];
const luggageSpaces = [
  { value: 'top', label: 'Top (Above vehicle)' },
  { value: 'bottom', label: 'Bottom (Below seats)' },
  { value: 'inside', label: 'Inside (Inside vehicle)' },
];
// Infer the form values type from the schema
type FormValues = z.infer<typeof schema>;

export function VehicleModelForm({
  id,
  agencyId,
  originalModel,
  adminId,
  onSubmitCompleteAction,
}: {
  id: string,
  agencyId: string;
  originalModel?: VehicleModel;
  adminId: string;
  onSubmitCompleteAction: (newId: string, data: VehicleModel) => void;
}) {
  const [modelPhotoPreview, setModelPhotoPreview] = useState<string | null>(originalModel?.modelPhoto as string | undefined || null);
  const [selectedModelPhoto, setSelectedModelPhoto] = useState<File | null>(null);

  const [matrix, setMatrix] = useState<number[][]>(originalModel ? convertBitmaskToMatrix(originalModel) : [[1]]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, setIsPending] = useState<boolean>(false);

  // Initialize the form with react-hook-form and Zod resolver
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'all',
    defaultValues: {
      name: originalModel?.name || '',
      fuelType: originalModel?.fuelType || 'diesel',
      seatCount: originalModel?.seatCount || 1,
      luggageSpaces: originalModel?.luggageSpaces || []
    },
  });

  // Prevent form submission on Enter key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };
  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedModelPhoto(file);
      const reader = new FileReader();
      reader.onload = () => setModelPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setModelPhotoPreview(null);
    setSelectedModelPhoto(null);
    const fileInput = document.getElementById('photo-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; // Clear the input value
    }
  };


  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsPending(true);
    if (!selectedModelPhoto && !modelPhotoPreview) {
      setErrorMessage('Please upload a photo of your vehicle model to ease recognition.');
      return;
    }

    try {
      const newModel = await saveVehicleModel(
        {
          id: id,
          seatCount: data.seatCount,
          name: data.name, seatLayout: convertMatrixToBitmask(matrix),
          agencyId: agencyId, columns: matrix[0].length, fuelType: data.fuelType,
          luggageSpaces: data.luggageSpaces,
          modelPhoto: selectedModelPhoto ? selectedModelPhoto : modelPhotoPreview!!,
          ...auditUpdOrNew(adminId, originalModel)
        }, adminId)
      onSubmitCompleteAction(newModel.id, newModel);
    } catch (error) {
      setErrorMessage('An error occurred while saving the vehicle model.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Model</CardTitle>
        <CardDescription>
          Create reusable models for your vehicles.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid  grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex flex-1 items-top justify-center">
            <div className="w-full">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8"
                  onKeyDown={handleKeyDown}>
                  {/* Model Name */}

                  <div className="flex flex-col items-center gap-4">
                   {/* Image Preview */}
                    <FormLabel
                      htmlFor="photo-upload"
                      className="relative w-32 h-32 rounded-md border-2 border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer"
                    >
                      {modelPhotoPreview ? (
                        <Image
                          src={modelPhotoPreview}
                          alt="Model Photo Preview"
                          layout="fill"
                          objectFit="cover"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm text-center">
                          Upload the example photo
                        </span>
                      )}
                    </FormLabel>

                    {/* File Input */}
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />

                    {modelPhotoPreview && (
                      <div className="flex flex-row gap-2 items-center">
                        {/* View Button */}
                        <Button
                          variant="outline"
                          onClick={(e) => {
                            e.preventDefault();
                            window.open(modelPhotoPreview, '_blank');
                          }}
                        >
                          <EyeIcon className="h-4 w-4" />
                          <span className="hidden md:inline">View Full Photo</span>
                        </Button>

                        {/* Delete Button */}
                        <Button
                          variant="destructive"
                          onClick={handleRemovePhoto}
                        >
                          <TrashIcon className="h-4 w-4" />
                          <span className="hidden md:inline">Remove</span>
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-gray-300" />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter model name" {...field} />
                        </FormControl>
                        <FormDescription>
                          The name of the vehicle model (e.g., "Tesla Model 3").
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />


                  {/* Fuel Type */}
                  <FormField
                    control={form.control}
                    name="fuelType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fuel Type</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className="w-full justify-between"
                              >
                                {field.value
                                  ? fuelTypes.find((type) => type.value === field.value)?.label
                                  : 'Select the fuel type'}
                                <ChevronsUpDown className="opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Search for a fuel type..." className="h-9" />
                              <CommandList>
                                <CommandEmpty>No fuel type found.</CommandEmpty>
                                <CommandGroup>
                                  {fuelTypes.map((type) => (
                                    <CommandItem
                                      key={type.value}
                                      onSelect={() => form.setValue('fuelType', type.value as FuelType)}
                                    >
                                      {type.label}
                                      <Check
                                        className={cn(
                                          'ml-auto',
                                          type.value === field.value ? 'opacity-100' : 'opacity-0'
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
                          Select the fuel type for your vehicle.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* luggageSpaceType Field */}
                  <FormField
                    control={form.control}
                    name="luggageSpaces"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Available luggage spaces positions</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className="w-full justify-between"
                              >
                                {field.value.length > 0 ? (
                                  <div className="flex flex-wrap gap-2">
                                    {field.value.map((value) => (
                                      <Badge
                                        key={value}
                                        variant={'secondary'}
                                        className="flex items-center gap-3 py-1"
                                        onClick={(e) => {
                                          e.preventDefault(); // Prevent the popover from opening
                                          e.stopPropagation(); // Prevent the popover from opening
                                          field.onChange(field.value.filter((v) => v !== value));
                                        }}

                                      >
                                        {luggageSpaces.find((type) => type.value === value)?.label}
                                      </Badge>
                                    ))}
                                  </div>
                                ) : (
                                  'No position selected'
                                )}
                                <ChevronsUpDown className="opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Search for a position..." className="h-9" />
                              <CommandList>
                                <CommandEmpty>No position found.</CommandEmpty>
                                <CommandGroup>
                                  {luggageSpaces.map((type) => (
                                    <CommandItem
                                      key={type.value}
                                      onSelect={() => {
                                        const currentValues = field.value;
                                        if (currentValues.includes(type.value as LuggageSpace)) {
                                          // Remove if already selected
                                          field.onChange(currentValues.filter((v) => v !== type.value));
                                        } else {
                                          // Add if not selected
                                          field.onChange([...currentValues, type.value]);
                                        }
                                      }}
                                    >
                                      {type.label}
                                      <Check
                                        className={cn(
                                          'ml-auto',
                                          field.value.includes(type.value as LuggageSpace) ? 'opacity-100' : 'opacity-0'
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
                          List all positions where your vehicle can keep luggages
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Number of Seats */}
                  <FormField
                    control={form.control}
                    name="seatCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Seats</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter number of seats" {...field} disabled />
                        </FormControl>
                        <FormDescription>
                          This will be automatically calculated based on the layout.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <Button type="submit" className='py-4' disabled={isPending}>
                    {isPending ? 'Saving...' : 'Save Vehicle Model'}
                  </Button>

                  {/* Error Dialog */}
                  <ErrorDialog
                    isOpen={errorMessage !== ''}
                    onCloseAction={() => setErrorMessage('')}
                    title="Error Occurred"
                    description={errorMessage}
                  />
                </form>
              </Form>
            </div>
          </div>
        </div>

        {/* Vehicle Layout Editor Section */}
<div className="relative rounded-lg border overflow-x-auto flex justify-center items-center w-full">
  <VehicleModelLayoutEditor
    editable={true}
    matrix={matrix}
    setSeatCountChangeAction={(count) => form.setValue('seatCount', count)}
    setMatrixChangeAction={setMatrix}
  />
</div>
      </CardContent>    </Card>
  );
}
