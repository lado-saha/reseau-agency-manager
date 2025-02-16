import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Check,
  CrownIcon,
  Delete,
  LucideIcon,
  MoreHorizontal,
  MoreVertical,
  ShieldIcon,
  TruckIcon
} from 'lucide-react';
import { TabsEmployee } from '@/lib/models/helpers';
import { format } from 'date-fns';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Employee, EmployeeRole, getRoleLabel } from '@/lib/models/employee';
import {
  UserIcon,
  CarIcon,
  MapPinIcon,
  UsersIcon,
  QrCodeIcon
} from 'lucide-react'; // Import icons from lucide-react
import { User } from '@/lib/models/user';
import { TableCell, TableRow } from '@/components/ui/table';
import { JSX, useState } from 'react';
import { DeleteDialog } from '@/components/dialogs/dialog-delete';
import { SearchItemProps } from '@/lib/utils';

interface EmployeeItemProps<T extends EmployeeRole> {
  item: Employee<T>;
  currentTab: TabsEmployee<T>;
  detailsAction: (id: string) => void;
  deleteAction: (id: string) => void;
}
export const roleIcons: Record<EmployeeRole, JSX.Element> = {
  owner: <CrownIcon className="mx-1 w-4 h-4" />,
  manager: <UserIcon className="mx-1 w-4 h-4" />,
  driver: <TruckIcon className="mx-1 w-4 h-4" />,
  'station-chief': <ShieldIcon className="mx-1 w-4 h-4" />,
  other: <UserIcon className="mx-1 w-4 h-4" />,
  chief: <ShieldIcon className="mx-1 w-4 h-4" />,
  scanner: <QrCodeIcon className="mx-1 w-4 h-4" />
};
const renderRoleBadge = (role: EmployeeRole) => {
  return (
    <Badge variant="outline" className="items-center">
      {roleIcons[role]}
      <span className="text-sm">{getRoleLabel(role)}</span>
    </Badge>
  );
};
/**
 * Order: Photo, Name, role, sex,email, phone,
 * @param param0 OR
 * @returns
 */
export function EmployeeTableItem<T extends EmployeeRole>({
  item: employee,
  currentTab,
  detailsAction,
  deleteAction
}: EmployeeItemProps<T>) {
  const user = employee.user as User;
  return (
    <TableRow>
      {/* Vehicle Image */}
      <TableCell className="hidden sm:table-cell">
        <Image
          alt="Vehicle image"
          className="aspect-square rounded-md object-cover"
          height="72"
          src={(user.photo as string) || '/placeholder.svg'}
          width="72"
        />
      </TableCell>

      {/* Vehicle Details */}
      <TableCell className="font-medium">{user.name}</TableCell>
      {currentTab === 'all' ? (
        <TableCell>{renderRoleBadge(employee.role)}</TableCell>
      ) : (
        <></>
      )}
      <TableCell>{user.sex[0].toLocaleUpperCase()}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.phone}</TableCell>
      <TableCell>{format(employee.updatedOn, 'PP')}</TableCell>

      {/* Action Menu */}
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          {DropdownMenuEmployee(employee, detailsAction, deleteAction)}
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

export function DropdownMenuEmployee<T extends EmployeeRole>(
  employee: Employee<T>,
  detailsAction: (id: string) => void,
  deleteAction: (id: string) => void
) {
  return (
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem
        className="cursor-pointer h-8 my-1"
        onClick={() => detailsAction(employee.id)}
      >
        <span className="w-full h-full text-start my-2">Details</span>
      </DropdownMenuItem>

      <DeleteDialog
        mode='archive'
        title="Fire Employee"
        triggerText='Fire Employee'
        description={`Are you sure you want to fire ${(employee?.user as User).name}? This action cannot be undone.`}
        onDeleteAction={() => {
          deleteAction(employee.id);
        }}
      />
    </DropdownMenuContent>
  );
}

export function EmployeeGridItem<T extends EmployeeRole>({
  item: employee,
  currentTab,
  detailsAction,
  deleteAction
}: EmployeeItemProps<T>) {
  const user = employee.user as User;
  return (
    <Card className="relative overflow-hidden shadow-md">
      {/* More Button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-2 right-2 z-10 p-1 rounded-full shadow-md"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        {DropdownMenuEmployee<T>(employee, detailsAction, deleteAction)}
      </DropdownMenu>

      {/* Employee Image */}
      <div className="relative w-full h-32">
        <Image
          src={(user.photo as string) || '/placeholder.svg'}
          alt={"user's picture"}
          fill
          className="object-cover"
          onClick={(e) => {
            e.preventDefault();
            window.open(user.photo as string, '_blank');
          }}

        />
      </div>

      {/* Card Content */}
      <CardContent className="flex flex-col items-center space-y-1 text-center">
        {/* Status Badge */}
        <div className="py-2">
          {currentTab === 'all' ? renderRoleBadge(employee.role) : null}
        </div>

        {/* Employee Details */}
        <CardTitle>{user.name}</CardTitle>
        <div className="text-md text-muted-foreground">{user.email}</div>

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-4 items-center text-sm mt-3 w-full">
          <div>
            <span className="block text-muted-foreground">Phone</span>
            <span>{user.phone}</span>
          </div>
          <div>
            <span className="block text-muted-foreground">Sex</span>
            <span>{user.sex}</span>
          </div>
        </div>
      </CardContent>

      {/* Footer Metadata */}
      <div className="border-t mt-1 py-1 text-xs  flex flex-col px-4 ">
        <div className="flex justify-between text-muted-foreground">
          <span>Recruited On</span>
          <span>Last Updated On</span>
        </div>
        <div className="flex justify-between">
          <span>{format(employee.createdOn, 'PP')}</span>
          <span className="text-end">{format(employee.updatedOn, 'Pp')}</span>
        </div>
      </div>
    </Card>
  );
}

export function EmployeeSearchItem<T extends EmployeeRole>({
  item, isSelected, onCheckedChange
}: SearchItemProps<Employee<T>>) {
  const user = item.user as User;
  return (
    <Card
      className={`relative overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 ${isSelected ? 'border-2 border-primary' : 'border'
        }`}
      onClick={() => onCheckedChange(!isSelected)} // Toggle selection on card click
    >
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 z-10 bg-primary rounded-full p-1">
          <Check className="h-4 w-4 text-white" /> {/* Checkmark icon */}
        </div>
      )}

      {/* Employee Image */}
      <div className="relative w-full h-32">
        <Image
          src={(user.photo as string) || '/placeholder.svg'}
          alt={"user's picture"}
          fill
          className="object-cover"
          onClick={(e) => {
            e.preventDefault();
            window.open(user.photo as string, '_blank');
          }}

        />
      </div>

      {/* Card Content */}
      <CardContent className="flex flex-col items-center space-y-1 text-center">
        {/* Status Badge */}
        <div className="py-2">
          renderRoleBadge(item.role) : null
        </div>
        {/* Employee Details */}
        <CardTitle>{user.name}</CardTitle>
        <div className="text-md text-muted-foreground">{user.email}</div>

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-4 items-center text-sm mt-3 w-full">
          <div>
            <span className="block text-muted-foreground">Phone</span>
            <span>{user.phone}</span>
          </div>
          <div>
            <span className="block text-muted-foreground">Sex</span>
            <span>{user.sex}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
