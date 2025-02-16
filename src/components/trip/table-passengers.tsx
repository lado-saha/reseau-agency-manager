import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Passenger, TripResource } from '@/lib/models/trip';
import { PassengerTableItem } from './item-passenger';
import { User } from '@/lib/models/user';
import { Driver, Vehicle, VehicleModel } from '@/lib/models/resource';
import { AgencyEmployee } from '@/lib/models/employee';

export interface PropsPassengers {
  tripResource: TripResource;
}

export function vehiclePassengerSortingOptions() {
  // Default options for 'all' tab
  const defaultOptions = [
    { displayName: 'SeatNumber', fieldName: 'seatNumber' },
    { displayName: 'Photo', fieldName: 'user.photo' },
    { display: 'Name', fieldname: 'user.name' },
    { displayName: 'Sex', fieldName: 'user.sex' },
    { displayName: 'Contact', fieldName: 'user.email' },
  ];

  // Additional options for specific tabs
  return defaultOptions;
}

function VehicleFillStats({
  seatCount,
  passengerCount
}: {
  passengerCount: number;
  seatCount: number;
}) {
  const fillPercentage = (passengerCount / seatCount) * 100;

  return (
    <CardFooter className="p-4">
      <div className="flex flex-col w-full gap-2">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${fillPercentage}%` }}
          ></div>
        </div>

        {/* Stats Text */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            <strong>{passengerCount}</strong> of <strong>{seatCount}</strong> seats filled
          </div>
          <div className="font-semibold">
            {fillPercentage.toFixed(1)}% Full
          </div>
        </div>
      </div>
    </CardFooter>
  );
}// Reusable function to render headers
export function TableVehiclePassengers({
  tripResource,
}: PropsPassengers) {
  const vehicle = tripResource.vehicle as Vehicle
  const model = vehicle.model as VehicleModel
  const driver = tripResource.driver as Driver
  const totalPassengers = tripResource.passengers.length

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Passengers</CardTitle>
      </CardHeader>
      <CardDescription>
        <div className="space-y-1 px-10 py-4">
          <p>
            <strong>Vehicle:</strong> {vehicle.manufacturer} {model.name} ({vehicle.registrationNumber})
          </p>
          <p>
            <strong>Model:</strong> {model.name} (model.fuelType, {model.seatCount} seats)
          </p>
          <p>
            <strong>Production Year:</strong> {vehicle.productionYear}
          </p>
        </div>
      </CardDescription>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Seat Number</TableHead>
              <TableHead>
                Photo              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Sex</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {driver?.id && <PassengerTableItem passenger={{ user: (driver.employee as AgencyEmployee).user as User, seatNumber: 0 }} />}

            {tripResource.passengers.map((passenger) => (
              <PassengerTableItem
                key={(passenger.user as User).id}
                passenger={passenger}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <VehicleFillStats seatCount={((tripResource.vehicle as Vehicle).model as VehicleModel).seatCount} passengerCount={totalPassengers} />
    </Card>
  );
}
