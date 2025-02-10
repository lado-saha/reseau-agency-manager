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
  PlusIcon,
  SearchIcon
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
} from '@/components/ui/card';
import { User } from '@/lib/models/user';
import { Employee, EmployeeRole, roleLabels } from '@/lib/models/employee';
import { saveEmployee, searchUserByEmail } from '@/lib/actions';
import { auditCreate } from '@/lib/models/helpers';
import { ErrorDialog } from '../dialogs/dialog-error';
import { usePathname, useRouter } from 'next/navigation';

// Fix the schema to dynamically select the correct one based on the provided roles
const getRoleSchema = <T extends EmployeeRole>(roles: T[]) => {
  return z.enum(roles); // Dynamically creates the enum schema based on the roles array
};

const roleMap = <T extends EmployeeRole>(
  roles: T[]
): { value: T; label: string }[] => {
  return roles.map((role) => ({
    value: role,
    label: roleLabels[role]!! // Add fallback in case roleLabel is missing
  }));
};

const employeeSchema = <T extends EmployeeRole>(roles: T[]) =>
  z.object({
    role: getRoleSchema(roles),
    salary: z.coerce
      .number()
      .min(0, 'Salary must be a number greater or equals to 0'), // Ensures salary is positive
    email: z.string().email({ message: 'Please enter a valid email address' })
  });

export type EmployeeFormValue<T extends EmployeeRole> = z.infer<
  ReturnType<typeof employeeSchema<T>>
>;

export function EmployeeForm<T extends EmployeeRole>({
  id,
  oldEmployee,
  onSubmitCompleteAction,
  orgId,
  adminId,
  emailParam,
  roles // Dynamic roles passed as prop
}: {
  id: string;
  oldEmployee?: Employee<T>;
  onSubmitCompleteAction: (newId: string, data: Employee<T>) => void;
  adminId: string;
  emailParam?: string;
  orgId: string;
  roles: T[]; // This will be either agencyEmplRoles or stationEmplRoles
}) {
  const [user, setUser] = useState<User | undefined>(
    oldEmployee?.user as User | undefined
  );
  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter()
  const pathname = usePathname(); // Get the current pathname
  const form = useForm<EmployeeFormValue<T>>({
    resolver: zodResolver(employeeSchema(roles)), // Dynamically use the roles array for schema
    mode: 'all',
    defaultValues: {
      role: oldEmployee?.role ?? roles[0], // Set default role to the first role in the list
      email: emailParam || user?.email,
      salary: oldEmployee?.salary
    }
  });

  const searchUser = async () => {
    const isValid = await form.trigger('email');
    if (isValid) {
      setIsPending(true)
      const email = form.getValues('email');
      const newUser = await searchUserByEmail(email);
      if (!newUser) {
        setUser(undefined);
        setErrorMessage(`No user found with the email: ${email}.`);
      } else {
        setUser(newUser);
        setErrorMessage('');
      }
      setIsPending(false)
    }
  };

  const navToCreateUser = async () => {
    const isValid = await form.trigger('email');
    if (isValid) {
      const email = form.getValues('email');
      const newUserUrl = `/auth/new-user?mode=create&email=${encodeURIComponent(email)}&callbackUrl=${encodeURIComponent(pathname)}`;
      router.push(newUserUrl)
    }
  };

  const onSubmit = async (data: EmployeeFormValue<T>) => {
    setIsPending(true);
    try {
      if (user) {
        const newEmpl = await saveEmployee<T>(
          {
            id: id,
            role: data.role as T,
            orgId: orgId,
            salary: data.salary,
            user: user.id,
            ...auditCreate(adminId)
          },
          roles,
          adminId
        );
        onSubmitCompleteAction(id, newEmpl); // Pass back the data when successful
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee Registration</CardTitle>
        <CardDescription>
          Add an employee by entering their email, selecting a role, and
          specifying a salary.
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
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-32 h-32 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden">
                  {user?.photo ? (
                    <Image
                      src={user.photo as string}
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

                {user && (
                  <div className="text-center">
                    <p className="text-lg font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.phone}</p>
                  </div>
                )}

                {user?.photo && (
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(user.photo as string, '_blank');
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
                    <FormLabel>Employee Email</FormLabel>
                    <FormControl>
                      <div className="flex w-full items-center space-x-2">
                        <Input
                          type="email"
                          placeholder="Enter employee's email"
                          {...field}
                        />
                        {(!user || user?.email !== form.getValues('email')) && <>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={navToCreateUser}
                          >
                            <PlusIcon className="h-4 w-4" />
                            <span className="hidden md:inline">Create</span>
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            onClick={searchUser}
                          >
                            <SearchIcon className="h-4 w-4" />
                            <span className="hidden md:inline">Search</span>
                          </Button>
                        </>}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Enter a valid email address and click "Search" to find an
                      existing employee or "Create" to register the employee before searching
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="border-t border-gray-300"></div>
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee Role</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full justify-between"
                          >
                            {field.value
                              ? roleMap(roles).find(
                                (ls) => ls.value === field.value
                              )?.label
                              : 'Select a role'}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search for a role..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>No roles found.</CommandEmpty>
                            <CommandGroup>
                              {roleMap(roles).map((ls) => (
                                <CommandItem
                                  key={ls.value}
                                  onSelect={() =>
                                    form.setValue('role', ls.value)
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
                      Select the role assigned to the employee.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary (FCFA)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter salary amount"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Specify the employee's monthly salary in FCFA.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending}>
                Save Employee
              </Button>
              <ErrorDialog
                isOpen={errorMessage !== ''}
                onCloseAction={() => setErrorMessage('')}
                title="Error Occurred"
                description={errorMessage}
              />
              {/* {errorMessage && (
                <div className="text-red-500 text-sm flex items-center gap-2">
                  <MessageSquareWarningIcon className="h-5 w-5" />
                  <p>{errorMessage}</p>
                </div>
              )} */}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
