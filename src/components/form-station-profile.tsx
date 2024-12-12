'use client';

import { format } from 'date-fns';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// import { toast } from 'src/components/hooks/use-toast';
import { Button } from 'src/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from 'src/components/ui/form';
import { Input } from 'src/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from 'src/components/ui/select';
import { cn } from 'src/lib/utils';
import {
  CalendarIcon,
  Calendar,
  Check,
  ChevronsUpDown,
  Command
} from 'lucide-react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from 'src/components/ui/popover';
import {
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from 'src/components/ui/command';

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Station name must be at least 2 characters.' })
    .max(30, {
      message: 'Station name must not be longer than 30 characters.'
    }),
  region: z.string({ message: 'A region must be selected for location' }),
  city: z.string({ message: 'A city must be selected for location' }),
  quarter: z.string({ message: 'A quarter must be selected for location' }),

  creationDate: z.date({
    required_error: 'A date of birth is required.'
  }),

  pobox: z
    .string()
    .min(1, { message: 'BP must not be empty.' })
    .max(20, { message: 'BP must not be longer than 20 characters.' }),
  supportPhones: z
    .array(
      z.string().regex(/^\+?[0-9]{7,15}$/, {
        message: 'Please enter a valid phone number.'
      })
    )
    .min(1, { message: 'At least one support phone is required.' })
    .max(4, { message: 'You can add up to 4 support phone numbers.' }),
  supportEmails: z
    .array(z.string().email({ message: 'Please enter a valid email address.' }))
    .min(1, { message: 'At least one support email is required.' })
    .max(4, { message: 'You can add up to 4 support email addresses.' }),
  gpsCoordinates: z.object({
    latitude: z.number({ required_error: 'Latitude is required.' }),
    longitude: z.number({ required_error: 'Longitude is required.' })
  }),
  serviceHours: z.string().regex(/^[0-9]{2}:[0-9]{2}-[0-9]{2}:[0-9]{2}$/, {
    message: 'Service hours must be in the format HH:MM-HH:MM.'
  }),
  serviceDays: z
    .array(
      z
        .string()
        .min(3, { message: 'Each service day must be at least 3 characters.' })
    )
    .min(1, { message: 'At least one service day is required.' }),
  socialLinks: z
    .object({
      facebook: z
        .string()
        .url({ message: 'Please enter a valid Facebook URL.' })
        .optional(),
      x: z
        .string()
        .url({ message: 'Please enter a valid X (Twitter) URL.' })
        .optional(),
      instagram: z
        .string()
        .url({ message: 'Please enter a valid Instagram URL.' })
        .optional()
    })
    .optional(),
  website: z
    .string()
    .url({ message: 'Please enter a valid website URL.' })
    .optional()
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// This can come from your database or API.
const defaultFormValues = {
  name: 'Yaounde Main Station',
  pobox: 'BP 12345',
  supportPhones: ['+237612345678', '+237690123456'],
  supportEmails: ['support@stationyaounde.cm', 'info@stationyaounde.cm'],
  gpsCoordinates: {
    latitude: 3.848,
    longitude: 11.5021
  },
  serviceHours: '08:00-18:00',
  serviceDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  socialLinks: {
    facebook: 'https://facebook.com/stationyaounde',
    x: 'https://x.com/stationyaounde',
    instagram: 'https://instagram.com/stationyaounde'
  },
  website: 'https://stationyaounde.cm'
} as Partial<ProfileFormValues>;

const regions = [
  {
    label: 'Adamawa',
    value: 'adamawa',
    cities: [
      { value: 'garoua', label: 'Garoua' },
      { value: 'ngaoundéré', label: 'Ngaoundéré' },
      { value: 'banyo', label: 'Banyo' }
    ]
  },
  {
    label: 'Center',
    value: 'center',
    cities: [
      { value: 'yaounde', label: 'Yaoundé' },
      { value: 'bertoua', label: 'Bertoua' },
      { value: 'obala', label: 'Obala' }
    ]
  },
  {
    label: 'East',
    value: 'east',
    cities: [
      { value: 'kribi', label: 'Kribi' },
      { value: 'batouri', label: 'Batouri' },
      { value: 'dimako', label: 'Dimako' }
    ]
  },
  {
    label: 'Littoral',
    value: 'littoral',
    cities: [
      { value: 'douala', label: 'Douala' },
      { value: 'limbe', label: 'Limbe' },
      { value: 'edea', label: 'Edea' }
    ]
  },
  {
    label: 'North',
    value: 'north',
    cities: [
      { value: 'garoua', label: 'Garoua' },
      { value: 'maroua', label: 'Maroua' },
      { value: 'tournour', label: 'Tournour' }
    ]
  },
  {
    label: 'North-West',
    value: 'north-west',
    cities: [
      { value: 'bamenda', label: 'Bamenda' },
      { value: 'kumbo', label: 'Kumbo' },
      { value: 'bafut', label: 'Bafut' }
    ]
  },
  {
    label: 'South',
    value: 'south',
    cities: [
      { value: 'kribi', label: 'Kribi' },
      { value: 'ebolowa', label: 'Ebolowa' },
      { value: 'minta', label: 'Minta' }
    ]
  },
  {
    label: 'South-West',
    value: 'south-west',
    cities: [
      { value: 'buea', label: 'Buea' },
      { value: 'limbe', label: 'Limbe' },
      { value: 'tiko', label: 'Tiko' }
    ]
  },
  {
    label: 'West',
    value: 'west',
    cities: [
      { value: 'bafoussam', label: 'Bafoussam' },
      { value: 'dschang', label: 'Dschang' },
      { value: 'foumbot', label: 'Foumbot' }
    ]
  }
];

export default function ProfileForm() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: defaultFormValues
  });

  // const { fields: phoneFields, append: appendPhone } = useFieldArray({
  //   name: 'supportPhones',
  //   control: form.control
  // });

  // const { fields: emailFields, append: appendEmail } = useFieldArray({
  //   name: 'supportEmails',
  //   control: form.control
  // });

  function onSubmit(data: ProfileFormValues) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      )
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="name" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name. Default is City, Quater e.g
                Yaounde, Biyemassi
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="creationDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of Creation</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[240px] pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date('1900-01-01')
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Your date of birth is used to calculate your age.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="region"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Region or State</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'w-[200px] justify-between',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value
                        ? regions.find(
                            (region) => region.value === region.value
                          )?.label
                        : 'Select Region'}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search region..." />
                    <CommandList>
                      <CommandEmpty>No region found.</CommandEmpty>
                      <CommandGroup>
                        {regions.map((region) => (
                          <CommandItem
                            value={region.label}
                            key={region.value}
                            onSelect={() => {
                              form.setValue('region', region.value);
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2',
                                region.value === field.value
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            {region.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Select the admistrative region in which your station is located
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>City</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'w-[200px] justify-between',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value
                        ? regions.find(
                            (region) => region.value === region.value
                          )?.label
                        : 'Select city'}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search city..." />
                    <CommandList>
                      <CommandEmpty>No city found</CommandEmpty>
                      <CommandGroup>
                        {regions.map((region) => (
                          <CommandItem
                            value={region.label}
                            key={region.value}
                            onSelect={() => {
                              form.setValue('region', region.value);
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2',
                                region.value === field.value
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            {region.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Select a city found in the region you selected where your
                station is found
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update profile</Button>
      </form>
    </Form>
  );
}
