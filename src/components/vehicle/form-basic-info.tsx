'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form, FormControl, FormField, FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Check, ChevronsUpDown, EyeIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { convertBitmaskToMatrix, HEALTH_STATUS, HEALTH_STATUS_OPTIONS, Vehicle, VehicleModel } from '@/lib/models/resource';
import { ErrorDialog } from '../dialogs/dialog-error';
import VehicleModelLayoutEditor from '../vehicle-model/editor-vehicle-model-schema';
import { auditUpdOrNew } from '@/lib/models/helpers';
import { saveVehicleBasicInfo, searchVehicleModel } from '@/lib/actions';
import { SearchDialogGeneric } from '../dialogs/search-dialog';
import { VehicleModelSearchItem } from '../vehicle-model/item-vehicle-model';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { cn } from '@/lib/utils';

// Define the form schema using zod
const schema = z.object({
  registrationNumber: z
    .string()
    .trim()
    .min(1, { message: 'Registration number is required.' }),

  manufacturer: z
    .string()
    .trim()
    .min(1, { message: 'Manufacturer is required.' }),

  healthStatus: z.enum(HEALTH_STATUS, {
    message: 'Please select the health status.'
  }),

  productionYear: z
    .coerce
    .number()
    .int({ message: 'Production year must be an integer.' })
    .min(1886, { message: 'Enter a valid year (first car was made in 1886).' }) // Cars were first manufactured in 1886
    .max(new Date().getFullYear(), { message: 'Production year cannot be in the future.' }),
});

type FormValues = z.infer<typeof schema>;

export function VehicleBasicInfoForm({
  id,
  oldVehicle: originalVehicle,
  onSubmitCompleteAction,
  adminId,
  agencyId,
}: {
  id: string;
  oldVehicle?: Vehicle;
  onSubmitCompleteAction: (newId: string, data: Partial<Vehicle>) => void;
  adminId: string;
  agencyId: string;
}) {
  const [vehicleModel, setVehicleModel] = useState<VehicleModel | undefined>(originalVehicle?.model as VehicleModel);
  const [errorMessage, setErrorMessage] = useState('')
  const [isPending, setIsPending] = useState<boolean>(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'all',
    defaultValues: {
      manufacturer: originalVehicle?.manufacturer || '',
      productionYear: originalVehicle?.productionYear || 1887,
      registrationNumber: originalVehicle?.registrationNumber || '',
      healthStatus: originalVehicle?.healthStatus || 'good'
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsPending(true);
    try {
      if (!vehicleModel) {
        setErrorMessage('Please select a vehicle model.');
        return;
      }

      const newVehicle = await saveVehicleBasicInfo(id, {
        id: id,
        manufacturer: data.manufacturer, productionYear: data.productionYear, registrationNumber: data.registrationNumber, healthStatus: data.healthStatus,
        model: vehicleModel.id,
        ...auditUpdOrNew(adminId, originalVehicle)

      }, adminId)

      onSubmitCompleteAction(newVehicle.id!, newVehicle);
    } catch (error) {
      setErrorMessage((error as Error).message);
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
        <CardTitle>Vehicle Basic Information</CardTitle>
        <CardDescription>
          Please provide details about the vehicle and its model.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <Form {...form}>
            <form
              onKeyDown={handleKeyDown}
              className="flex flex-col gap-6"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              {/* Vehicle Model Section */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-32 h-32 rounded-lg border-2 border-gray-300 flex items-center justify-center overflow-hidden">
                  {vehicleModel?.modelPhoto ? (
                    <Image
                      src={vehicleModel.modelPhoto as string}
                      alt="Vehicle Model Photo"
                      layout="fill"
                      objectFit="cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm text-center">
                      No model photo available
                    </span>
                  )}
                </div>

                {vehicleModel && (
                  <div className="text-center">
                    <p className="text-lg font-medium">{vehicleModel.name}</p>
                    <p className="text-sm text-gray-500">{vehicleModel.seatCount} Seats</p>
                    <p className="text-sm text-gray-500">{vehicleModel.fuelType} Engine</p>
                  </div>
                )}

                <div className="flex flex-row gap-2 items-center">
                  {/* Delete Button */}

                  {vehicleModel ? (
                    <Button
                      variant="destructive"
                      onClick={(e) => {
                        e.preventDefault();
                        setVehicleModel(undefined)
                      }}
                    >
                      <TrashIcon className="h-4 w-4 " />
                      <span className="hidden md:inline">Remove</span>
                    </Button>
                  ) :
                    <SearchDialogGeneric
                      triggerText="Select Model"
                      fetchItemsAction={searchVehicleModel} // Pass function instead of repo
                      onSelectAction={(selectedItems) => setVehicleModel(selectedItems[0])}
                      renderItemAction={(item, isSelected, onCheckedChange) => (
                        <VehicleModelSearchItem
                          key={item.id}
                          item={item}
                          isSelected={isSelected}
                          onCheckedChange={onCheckedChange}
                        />
                      )}
                    />
                  }

                  {vehicleModel && (
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(vehicleModel.modelPhoto as string, '_blank');
                      }}
                    >
                      <EyeIcon className="h-4 w-4" />
                      <span className="hidden md:inline">View Full Photo</span>
                    </Button>
                  )}
                </div>

              </div>

              {/* Registration Number */}
              <FormField
                control={form.control}
                name="registrationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Number</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter the registration number"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The unique registration number of the vehicle.
                    </FormDescription> <FormMessage />
                  </FormItem>
                )}
              />

              {/* Manufacturer */}
              <FormField
                control={form.control}
                name="manufacturer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manufacturer</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter the manufacturer"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The manufacturer of the vehicle.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Production Year */}
              <FormField
                control={form.control}
                name="productionYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Production Year</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter the production year"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The year the vehicle was manufactured.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="healthStatus"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Health Status</FormLabel>
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
                              ? HEALTH_STATUS_OPTIONS.find(
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
                              {HEALTH_STATUS_OPTIONS.map((ls) => (
                                <CommandItem
                                  key={ls.value}
                                  onSelect={() =>
                                    form.setValue('healthStatus', ls.value)
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
                      Whats is the health status of your resource?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />



              {/* Submit Button */}
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving...' : 'Save'}
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

        {/* Vehicle Model Layout Editor */}
        <div className="relative rounded-lg border overflow-x-scroll flex justify-center items-center">
          {vehicleModel && (
            <VehicleModelLayoutEditor
              editable={false}
              matrix={convertBitmaskToMatrix(vehicleModel)}
              setSeatCountChangeAction={(_) => { }}
              setMatrixChangeAction={(_) => { }}
            />
          )}
        </div>
      </CardContent>
    </Card >
  );
}
