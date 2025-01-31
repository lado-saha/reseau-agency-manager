import { useForm, SubmitHandler, Form } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { VehicleModel } from '@/lib/models/resource';
import { Button } from 'react-day-picker';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Input } from '../ui/input';

type DetailViewMode = 'edit-mode' | 'creation-mode';

const vehicleFormSchema = z.object({
  id: z.string().min(1, { message: 'ID is required.' }),
  manufacturer: z
    .string()
    .min(2, { message: 'Manufacturer name must be at least 2 characters.' }),
  modelName: z
    .string()
    .min(2, { message: 'Model name must be at least 2 characters.' }),
  fuelType: z.enum(['Gasoline', 'Diesel', 'Electric', 'Hybrid'], {
    message: 'Please select a valid fuel type.'
  }),
  numberSeats: z
    .number()
    .min(1, { message: 'Number of seats must be at least 1.' }),
  auditInfo: z.object({
    createdBy: z.string().min(2, { message: 'Created by is required.' }),
    createdAt: z.date({ required_error: 'Creation date is required.' })
  })
});

export function VehicleModelForm({
  originalModel
}: {
  originalModel: VehicleModel | undefined;
}) {
  const mode: DetailViewMode =
    originalModel !== undefined ? 'edit-mode' : 'creation-mode';

  const form = useForm<VehicleModel>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: originalModel || {
      id: 'sdfd',
      manufacturer: '',
      modelName: '',
      fuelType: 'Gasoline',
      numberSeats: 1,
      auditInfo: {
        createdBy: '',
        createdOn: new Date()
      }
    }
  });

  const onSubmit: SubmitHandler<VehicleModel> = (data) => {
    // toast({
    //   title: `${mode === 'creation-mode' ? 'Vehicle Created' : 'Vehicle Updated'}`,
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   )
    // });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Manufacturer */}
        <FormField
          control={form.control}
          name="manufacturer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Manufacturer</FormLabel>
              <FormControl>
                <Input placeholder="Manufacturer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Model Name */}
        <FormField
          control={form.control}
          name="modelName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model Name</FormLabel>
              <FormControl>
                <Input placeholder="Model Name" {...field} />
              </FormControl>
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
              <FormControl>
                <select {...field} className="w-full p-2 border rounded">
                  <option value="Gasoline">Gasoline</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Number of Seats */}
        <FormField
          control={form.control}
          name="numberSeats"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Seats</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Seats" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Submit Button */}
        {/* <div className="flex justify-end">
          <Button type="submit">
            {mode === 'creation-mode' ? 'Create Vehicle' : 'Update Vehicle'}
          </Button>
        </div> */}
      </form>
    </Form>
  );
}
