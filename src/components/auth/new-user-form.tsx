'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
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
  TrashIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User } from '@/lib/models/user';
import { createUserAction } from '@/lib/actions';
import { phoneNumberValidator } from '@/lib/mobile-validation';
import { Switch } from '../ui/switch';
import { ErrorDialog } from '../dialogs/dialog-error';

// Define the schema for the signup form using zod
const schema = z.object({
  name: z.string().nonempty('Please enter your name.'),
  email: z
    .string()
    .email({ message: 'Please enter a valid email address.' })
    .nonempty({ message: 'Email is required.' }),
  recruitable: z.boolean({ message: 'Empty' }), // Ensuring it defaults to fals
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long.' })
    .nonempty({ message: 'Password is required.' }),
  sex: z.enum(['male', 'female'], { message: 'Pick your sex.' }),

  photo: z.string().optional(),
  phone: phoneNumberValidator,
});

type CreateUserFormValue = z.infer<typeof schema>;

const sexes = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' }
];

/**
 * Signup mode means the user is actually signing-up while the create means someone is creating his account for him
 */
export type NewUserFormMode = 'signup' | 'create';
export function NewUserForm({
  className,
  mode,
  newEmail,
  callbackUrl,
  ...props
}: {
  className?: string;
  mode: NewUserFormMode,
  newEmail: string,
  callbackUrl: string
  // mode: UserCreationMode
} & React.ComponentPropsWithoutRef<'form'>) {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isPending, setIsPending] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);

  const router = useRouter()
  // Set up useForm with zod resolver for validation
  const form = useForm<CreateUserFormValue>({
    resolver: zodResolver(schema),
    defaultValues: {
      sex: 'male',
      phone: { mobile: '' },
      recruitable: mode === 'create',
      email: mode === 'create' ? newEmail : ''
    }
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedPhoto(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
      form.setValue('photo', file.name);
    }
  };

  const onSubmit = async (data: CreateUserFormValue) => {
    setIsPending(true);
    try {
      if (!selectedPhoto && mode === 'signup') {
        setErrorMessage('Please select a profile picture');
        return
      }
      console.log("Was called")
      const newUser = await createUserAction({
        id: 'new',
        name: data.name,
        email: data.email,
        passwordHash: data.password,
        sex: data.sex,
        photo: selectedPhoto ?? '', // Send actual file object
        phone: data.phone.mobile.replaceAll(' ', '').replace('-', ''),
        signupComplete: mode === 'signup',
        recruitable: data.recruitable
      });
      console.log(newUser)

      if (newUser) {
        if (mode === 'signup')
          router.push(callbackUrl); // Navigates to the callback URL without a full page reload
        else {
          const url = new URL(callbackUrl, window.location.origin);
          const params = new URLSearchParams(url.search);
          params.set('email', data.email); // Append or update the email parameter
          router.replace(`${url.pathname}?${params.toString()}`);
        }
      }
    } catch (error) {
      setErrorMessage(`${(error as Error).message}`);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Form {...form}>
      <form
        className={cn('flex flex-col gap-6', className)}
        onSubmit={form.handleSubmit(onSubmit)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-muted-foreground">
            Enter your details below to sign up
          </p>
        </div>

        <div className="grid gap-6">
          {/* Image Picker */}
          <div className="flex flex-col items-center gap-4">
            <label
              htmlFor="photo-upload"
              className="relative w-32 h-32 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer"
            >
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Profile Preview"
                  layout="fill"
                  objectFit="cover"
                />
              ) : (
                <span className="text-gray-400 text-sm">Pick Photo</span>
              )}
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="flex flex-row gap-2 items-center">
                {/* View Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(imagePreview, '_blank')}
                >
                  <EyeIcon className="h-4 w-4" />
                  <span className="hidden md:inline">View Full Photo</span>
                </Button>

                {/* Delete Button */}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setImagePreview(null); // Clear the image preview
                    form.setValue('photo', ''); // Clear the form field value
                  }}
                >
                  <TrashIcon className="h-4 w-4 " />
                  <span className="hidden md:inline">Remove</span>
                </Button>
              </div>
            )}
          </div>

          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    {...field}
                    className="border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            disabled={mode === 'create'}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    placeholder="johndoe@example.com"
                    {...field}
                    className="border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={form.control}
            name={`phone.mobile`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    id="phone"
                    placeholder="+237 6 77 77 77 77"
                    // type=""
                    {...field}
                    className="border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    id="password"
                    type="password"
                    {...field}
                    className="border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Sex Selection */}
          <FormField
            control={form.control}
            name="sex"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Sex</FormLabel>
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
                          ? sexes.find((s) => s.value === field.value)?.label
                          : 'Select gender'}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search gender..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>No gender found.</CommandEmpty>
                        <CommandGroup>
                          {sexes.map((s) => (
                            <CommandItem
                              key={s.value}
                              onSelect={() => form.setValue('sex', s.value as 'male' | 'female')}
                            >
                              {s.label}
                              <Check
                                className={cn(
                                  'ml-auto',
                                  s.value === field.value
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
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="recruitable"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg py-2 ">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Can be Recruited?</FormLabel>
                  <FormDescription>
                    Enable to make your profile visible to travel agencies for recruiting opportunities.
                    This can be updated later in your account settings.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {/* Submit Button */}
          <Button className="w-full" type="submit" aria-disabled={isPending}>
            {mode === 'signup' ? "Signup" : "Create User"}
          </Button>

          {/* Error Message */}
          <ErrorDialog
            isOpen={errorMessage !== ''}
            onCloseAction={() => setErrorMessage('')}
            title="Error Occurred"
            description={errorMessage}
          />

          {/* Already have an account */}
          {mode === 'signup' && (
            <>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Already have an account?
                </span>
              </div>

              <Link href="/auth/login">
                <Button
                  variant="outline"
                  className="w-full"
                  aria-disabled={isPending}
                >
                  Login Instead
                </Button>
              </Link></>
          )}
        </div>
      </form>
    </Form>
  );
}
