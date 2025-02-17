'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowDown, ArrowRight, MinusCircleIcon, PlusCircleIcon } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { convertBitmaskToMatrix, Driver, Vehicle, VehicleModel } from '@/lib/models/resource';
import { Passenger, TripResource } from '@/lib/models/trip';
import { User } from '@/lib/models/user';
import { fetchStationById, fetchVehicleById } from '@/lib/actions';
import { AgencyEmployee } from '@/lib/models/employee';

export default function InteractiveSeatLayout({
  editable = false,
  tripResource,
}: {
  editable: boolean;
  tripResource?: TripResource;
}) {
  const [selectedSeat, setSelectedSeat] = useState<Passenger | undefined>();
  const [selectedDriver, setSelectedDriver] = useState<Driver | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [vehicleModel, setVehicleModel] = useState<VehicleModel | undefined>()

  useEffect(() => {
    const seed = async () => {
      const model = (await fetchVehicleById('123'))?.model as VehicleModel
      setMatrix(convertBitmaskToMatrix(model))
    }
    seed()
  }, [])

  const [matrix, setMatrix] = useState<number[][]>([])

  const handleSeatClick = (rowIndex: number, colIndex: number) => {
    if (rowIndex === 0 && colIndex === 0) {
      //setSelectedDriver(tripResource.driver as Driver);
      setIsDialogOpen(true);
    } else {
      const seatNumber = matrix[rowIndex][colIndex];
      //const passenger = tripResource.passengers.find(p => p.seatNumber === seatNumber);
      //if (passenger) {
      //setSelectedSeat(passenger);
      setIsDialogOpen(true);
      //}
    }
  };

  const renderSeat = (rowIndex: number, colIndex: number) => {
    const isDriverSeat = rowIndex === 0 && colIndex === 0;
    const seatNumber = matrix[rowIndex][colIndex];
    const isOccupied = tripResource?.passengers.some(p => p.seatNumber === seatNumber) || false;

    return (
      <Card
        key={`${rowIndex}-${colIndex}`}
        onClick={() => handleSeatClick(rowIndex, colIndex)}
        className={`relative flex items-center justify-center w-10 h-10 rounded-md ${isDriverSeat ? 'bg-yellow-200' : isOccupied ? 'bg-green-200' : 'bg-gray-200'
          }`}
      >
        {isDriverSeat ? (
          <span className="text-xs font-semibold">D</span>
        ) : (
          <span className="text-xs font-semibold">{seatNumber}</span>
        )}
      </Card>
    );
  };
  const user = (selectedDriver?.employee as AgencyEmployee)?.user as User
  return (
    <div
      className="grid gap-2 p-2 border w-fit rounded-md"
      style={{
        gridTemplateColumns: `repeat(${matrix[0]?.length || 0}, 40px)`,
        justifyContent: 'center'
      }}
    >
      {matrix.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-2">
          {row.map((_, colIndex) => renderSeat(rowIndex, colIndex))}
        </div>
      ))}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedDriver ? 'Driver Details' : 'Passenger Details'}</DialogTitle>
          </DialogHeader>
          {selectedDriver ? (
            <div>
              <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
            </div>
          ) : selectedSeat ? (
            <div>
              <p>Name: {user.name}</p>
              <p>Seat Number: {selectedSeat.seatNumber}</p>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
