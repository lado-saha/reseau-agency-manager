'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge, Check, UserRound, UserRoundIcon, X, XIcon } from 'lucide-react';

const matrix = [
  [1, 0, 0, 0, 1, 1],
  [1, 1, 1, 0, 1, 1],
  [1, 1, 1, 0, 1, 1],
  [1, 1, 1, 0, 1, 1],
  [1, 1, 1, 0, 0, 0],
  [1, 1, 1, 0, 1, 1],
  [1, 1, 1, 0, 1, 1],
  [1, 1, 1, 0, 1, 1],
  [1, 1, 1, 0, 1, 1],
  [1, 1, 1, 0, 1, 1],
  [1, 1, 1, 0, 1, 1],
  [1, 1, 1, 0, 1, 1],
  [1, 1, 1, 0, 0, 0],
  [1, 1, 1, 0, 1, 1],
  [1, 1, 1, 1, 1, 1]
];
// Helper function to get random booking status
const getRandomBookingStatus = () => {
  const status = Math.random();
  if (status < 0.1) return 'bookedByUs'; // 33% chance
  if (status < 0.5) return 'bookedBySomeone'; // 33% chance
  return 'available'; // 33% chance
};

export default function VehicleDetailsPage() {
  let seatCounter = 1;
  return (
    <div
      className="grid gap-3"
      style={{
        gridTemplateColumns: `repeat(${matrix[0]?.length || 0}, 40px)`,
        justifyContent: 'center' // Centers the layout
      }}
    >
      {matrix.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          if (cell === 1) {
            // Increment seat number for seats.
            const seatNumber = seatCounter++;
            const bookingStatus = getRandomBookingStatus(); // Get random booking status for each seat

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="relative flex flex-col items-center justify-center w-10 h-10"
              >
                {/* Card representing the seat */}
                <Card className="relative flex items-center justify-center w-10 h-10 rounded-md border">
                  {/* Seat status */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {bookingStatus === 'bookedBySomeone' && <UserRoundIcon />}
                    {bookingStatus === 'bookedByUs' && <Check />}
                    {bookingStatus === 'available' && null}{' '}
                    {/* No icon for available seats */}
                  </div>
                </Card>

                {/* Badge showing the seat number */}
                <Badge  className="absolute top-[-8px] right-[-8px] ">
                  <span>{seatNumber}</span>
                </Badge>
              </div>
            );
          } else {
            // For non-seat cells, we just render empty spaces
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="w-10 h-10 border-none"
              />
            );
          }
        })
      )}
    </div>
  );
}
