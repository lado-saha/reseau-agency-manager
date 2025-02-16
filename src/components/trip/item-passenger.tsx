import Image from 'next/image';
import { TableCell, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { User } from '@/lib/models/user';
import { Passenger } from '@/lib/models/trip';


interface PassengerItemProps {
  passenger: Passenger;
}

export function PassengerTableItem({
  passenger
}: PassengerItemProps) {
  const user = passenger.user as User
  const isDriver = passenger.seatNumber === 0
  return (
    <TableRow>
      <TableCell>{isDriver ?'Driver'  :passenger.seatNumber  }</TableCell>
      {/* Vehicle Image */}
      <TableCell className="hidden sm:table-cell">
        <Image
          alt="photo"
          className="aspect-square rounded-md object-cover"
          height="64"
          src={user.photo as string || '/placeholder.svg'}
          width="64"
        />
      </TableCell>

      {/* Vehicle Details */}
      <TableCell className="font-medium">{user.name}</TableCell>
      <TableCell>{user.sex}</TableCell>
      <TableCell>{user.email}</TableCell>
    </TableRow>
  );
}

export function PassengerGridItem({
  passenger
}: PassengerItemProps) {
  const user = passenger.user as User
  return (
    <Card className="relative overflow-hidden shadow-md">
      <div className="relative h-32 w-32">
        <Image
          src={user.photo as string || '/placeholder.svg'}
          alt="None"
          fill
          className="object-cover" /> </div>
      {/* Card Content */}
      <CardContent className="flex flex-col items-center space-y-0 gap-4 text-center">
        {/* Vehicle Details */}
        <CardTitle>{user.name}</CardTitle>
        <div className="text-md text-muted-foreground py-1">
          <span className="font-semibold ml-1">{passenger.seatNumber}</span> </div>

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-4 items-center text-sm mt-3 w-full">
          <div>
            <span className="block text-muted-foreground">Email</span>
            <span>{user.email}</span>
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

