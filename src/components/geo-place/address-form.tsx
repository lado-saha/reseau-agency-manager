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
import { ErrorDialog } from '../dialogs/dialog-error';
import { PlaceAddress } from '@/lib/repo/osm-place-repo';
import { useState, useEffect } from 'react';

const placeSchema = z.object({
  road: z.string().optional(),
  suburb: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
});

interface AddressFormProps {
  id: string,
  originalAddress?: PlaceAddress;
  onSaveAction: (data: PlaceAddress) => void;
}

export default function AddressForm({ id, originalAddress, onSaveAction }: AddressFormProps) {
  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, setIsPending] = useState<boolean>(false);

  const form = useForm<PlaceAddress>({
    resolver: zodResolver(placeSchema),
    defaultValues: {
      city: originalAddress?.city || '',
      country: originalAddress?.country || '',
      road: originalAddress?.road || '',
      state: originalAddress?.state || '',
      suburb: originalAddress?.state || '',
    }
  });

  // Ensure the form updates when the originalAddress changes
  useEffect(() => {
    if (originalAddress) {
      form.reset({
        city: originalAddress.city,
        country: originalAddress.country,
        road: originalAddress.road || '',
        state: originalAddress.state || '',
        suburb: originalAddress.suburb || '',
      });
    }
  }, [originalAddress, form]);

  const handleSubmit = (data: PlaceAddress) => {
    setIsPending(true);
    onSaveAction({ ...data, latitude: originalAddress?.latitude ?? 0, longitude: originalAddress?.longitude ?? 0, id: id });
    setIsPending(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6"
      >
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="road"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Road</FormLabel>
                <FormDescription>
                  Enter the road name (optional, but helpful).
                </FormDescription>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter road name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="suburb"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Suburb</FormLabel>
                <FormDescription>
                  Provide the suburb name (optional, but helpful).
                </FormDescription>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter suburb"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormDescription>
                  The city where the address is located. This is required.
                </FormDescription>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter city"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormDescription>
                  Provide the state if applicable (optional).
                </FormDescription>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter state"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormDescription>
                  The country of the address. This is required.
                </FormDescription>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter country"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Show Save button only when the form is valid */}
          <Button
            type="submit"
            disabled={isPending}
          >
            Save Address
          </Button>
        </div>
      </form>

      <ErrorDialog
        isOpen={errorMessage !== ''}
        onCloseAction={() => setErrorMessage('')}
        title="Error Occurred"
        description={errorMessage}
      />

    </Form>
  );
}
