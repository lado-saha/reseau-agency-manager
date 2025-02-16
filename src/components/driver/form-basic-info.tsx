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
import { HEALTH_STATUS, HEALTH_STATUS_OPTIONS, Driver } from '@/lib/models/resource';
import { ErrorDialog } from '../dialogs/dialog-error';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { cn } from '@/lib/utils';
import { User } from '@/lib/models/user';
import { AgencyEmployee } from '@/lib/models/employee';
import { saveDriverInfo } from '@/lib/actions';

// Define the form schema using zod
const schema = z.object({
  license: z
    .string()
    .trim()
    .min(1, { message: 'Drivers license number is required.' }),

  healthStatus: z.enum(HEALTH_STATUS, {
    message: 'Please select the health status.'
  }),
});

type FormValues = z.infer<typeof schema>;

export function DriverBasicInfoForm({
  id,
  driver,
  onSubmitCompleteAction,
  adminId,
  agencyId,
}: {
  id: string;
  driver: Driver;
  onSubmitCompleteAction: (newId: string, data: Driver) => void;
  adminId: string;
  agencyId: string;
}) {
  const [employee, setEmployee] = useState<AgencyEmployee>(driver.employee as AgencyEmployee);
  const [user, setUser] = useState<User>(employee.user as User);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, setIsPending] = useState<boolean>(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'all',
    defaultValues: {
      license: driver?.license || '',
      healthStatus: driver?.healthStatus || 'good'
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsPending(true);
    try {
      const newDriver = await saveDriverInfo(id, {
        ...driver, license: data.license, healthStatus: data.healthStatus
      }, adminId)
      onSubmitCompleteAction(newDriver.id, newDriver);
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
        <CardTitle>Driver Basic Information</CardTitle>
        <CardDescription>
          Please provide details about the driver.
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
              {/* Driver  Section */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-32 h-32 rounded-lg border-2 border-gray-300 flex items-center justify-center overflow-hidden">
                  {user ? (
                    <Image
                      src={user?.photo as string}
                      alt="Driver Photo"
                      layout="fill"
                      objectFit="cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm text-center">
                      No photo available
                    </span>
                  )}
                </div>

                {user && (
                  <div className="text-center">
                    <p className="text-lg font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email} | {user.phone} </p>
                    <p className="text-sm text-gray-500">{employee?.salary} FCFA/Month </p>
                  </div>
                )}
              </div>

              {/* Registration Number */}
              <FormField
                control={form.control}
                name="license"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Driving license</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter the driver's license number"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The driver's license number of the driver.
                    </FormDescription> <FormMessage />
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
                              : 'Select Health Status'}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0 ">
                        <Command>
                          <CommandInput
                            placeholder="Search status..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>
                              Nothing found.
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
      </CardContent>
    </Card >
  );
}
