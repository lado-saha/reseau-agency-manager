'use client';

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import { cn } from '@/lib/utils';
import { toast } from '@/components/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Station name must be at least 2 characters.' })
    .max(30, {
      message: 'Station name must not be longer than 30 characters.'
    }),
  state: z
    .string()
    .min(2, { message: 'State/Region must be at least 2 characters.' })
    .max(50, {
      message: 'State/Region must not be longer than 50 characters.'
    }),
  city: z
    .string()
    .min(2, { message: 'City must be at least 2 characters.' })
    .max(50, { message: 'City must not be longer than 50 characters.' }),
  quarter: z
    .string()
    .min(2, { message: 'Quarter must be at least 2 characters.' })
    .max(50, { message: 'Quarter must not be longer than 50 characters.' }),
  bp: z
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
  state: 'Center',
  city: 'Yaounde',
  quarter: 'Biyemassi',
  bp: 'BP 12345',
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
};

const cameroon = {
  regions: {
    adamawa: [
      { value: 'garoua', label: 'Garoua' },
      { value: 'Ngaoundéré', label: 'Ngaoundéré' },
      { value: 'Banyo', label: 'Banyo' }
    ],
    center: [
      { value: 'yaounde', label: 'Yaoundé' },
      { value: 'Bertoua', label: 'Bertoua' },
      { value: 'Obala', label: 'Obala' }
    ],
    east: [
      { value: 'kribi', label: 'Kribi' },
      { value: 'Batouri', label: 'Batouri' },
      { value: 'Dimako', label: 'Dimako' }
    ],
    littoral: [
      { value: 'douala', label: 'Douala' },
      { value: 'Limbe', label: 'Limbe' },
      { value: 'Edea', label: 'Edea' }
    ],
    north: [
      { value: 'garoua', label: 'Garoua' },
      { value: 'Maroua', label: 'Maroua' },
      { value: 'Tournour', label: 'Tournour' }
    ],
    'north-west': [
      { value: 'bamenda', label: 'Bamenda' },
      { value: 'kumbo', label: 'Kumbo' },
      { value: 'Bafut', label: 'Bafut' }
    ],
    south: [
      { value: 'kribi', label: 'Kribi' },
      { value: 'Ebolowa', label: 'Ebolowa' },
      { value: 'Minta', label: 'Minta' }
    ],
    'south-west': [
      { value: 'buea', label: 'Buea' },
      { value: 'Limbe', label: 'Limbe' },
      { value: 'Tiko', label: 'Tiko' }
    ],
    west: [
      { value: 'bafoussam', label: 'Bafoussam' },
      { value: 'Dschang', label: 'Dschang' },
      { value: 'Foumbot', label: 'Foumbot' }
    ]
  }
};

export default function ProfileForm() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: defaultFormValues,
    mode: 'onChange'
  });

  const { fields: phoneFields, append: appendPhone } = useFieldArray({
    name: 'supportPhones',
    control: form.control
  });

  const { fields: emailFields, append: appendEmail } = useFieldArray({
    name: 'supportEmails',
    control: form.control
  });

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
  
  const x = cameroon.regions['adamawa'];
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
        {/* State */}
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Region or State</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select the region or state this station is located in" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.keys(cameroon.regions).map((region) => (
                    <SelectItem key={region} value={region}>
                      {region.charAt(0).toUpperCase() + region.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                You can manage verified email addresses in your{' '}
                <Link href="/examples/forms">email settings</Link>.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          disabled={form.getFieldState('state').isTouched}
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a city in this region" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cameroon.regions.adamawa.map((city: any) => (
                    <SelectItem key={city.value} value={city.value}>
                      {city.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                You can manage verified email addresses in your{' '}
                <Link href="/examples/forms">email settings</Link>.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Region or State name</FormLabel>
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

        {/* <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="m@example.com">m@example.com</SelectItem>
                  <SelectItem value="m@google.com">m@google.com</SelectItem>
                  <SelectItem value="m@support.com">m@support.com</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                You can manage verified email addresses in your{' '}
                <Link href="/examples/forms">email settings</Link>.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can <span>@mention</span> other users and organizations to
                link to them.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`urls.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && 'sr-only')}>
                    URLs
                  </FormLabel>
                  <FormDescription className={cn(index !== 0 && 'sr-only')}>
                    Add links to your website, blog, or social media profiles.
                  </FormDescription>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => append({ value: '' })}
          >
            Add URL
          </Button>
        </div> */}
        <Button type="submit">Update profile</Button>
      </form>
    </Form>
  );
}
