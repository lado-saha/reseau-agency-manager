import Image from 'next/image';
import {
  Check} from 'lucide-react';
import { Driver } from '@/lib/models/resource';
import {
  Card,
  CardContent,
  CardTitle
} from '@/components/ui/card';
import { SearchItemProps } from '@/lib/utils';
import { AgencyEmployee } from '@/lib/models/employee';
import { User } from '@/lib/models/user';
import { renderHealthBadge } from '../vehicle/item-vehicle';



export function DriverSearchItem({
  item, isSelected, onCheckedChange
}: SearchItemProps<Driver>) {
  const empl = item.employee as AgencyEmployee
  const user = empl.user as User;
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
          {renderHealthBadge(item.healthStatus)}
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
