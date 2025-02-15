'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
} from '@/components/ui/card'; // Assuming Card component from your Shadcn UI library
import {
  ArrowDown,
  ArrowRight,
  MinusCircleIcon,
  PlusCircleIcon,
  ShipWheelIcon
} from 'lucide-react';

import { Dispatch, SetStateAction } from 'react';

export type CellAction = 'add' | 'delete';
// We should perform the action on what? the row or the column
export type ActionDomain = 'row' | 'column';
// Assuming the BusModel class is imported from your model file

export default function VehicleModelLayoutEditor({
  editable = true,
  matrix,
  setMatrixChangeAction,
  setSeatCountChangeAction
}: {
  editable: boolean;
  matrix: number[][];
  setMatrixChangeAction: Dispatch<SetStateAction<number[][]>>;
  setSeatCountChangeAction: (newCount: number) => void
}) {
  let seatCounter = 1;
  const seatNumberMatrix = matrix.map(
    (row) => row.map((cell) => (cell === 1 ? seatCounter++ : null)) // Assign seat number to cells that are seats
  );
  // Initialize the matrix (seat grid) state
  const handleColumnAction = (colIndex: number, action: CellAction) => {
    if (!editable) return;
    setSeatCountChangeAction(seatCounter)

    setMatrixChangeAction((prevMatrix) => {
      if (prevMatrix[0].length === 1 && action === 'delete') {
        return prevMatrix; // Do nothing
      }
      const newMatrix = prevMatrix.map((row) => {
        const newRow = [...row]; // Copy the current row

        if (action === 'add') {
          // Insert a new column (default value `1`) at the specified index
          newRow.splice(colIndex, 0, 1);
        } else if (action === 'delete') {
          // Remove the column at the specified index
          if (colIndex >= 0 && colIndex < newRow.length) {
            newRow.splice(colIndex, 1);
          }
        }

        return newRow;
      });

      return newMatrix; // Return the updated matrix
    });
  };

  const handleRowAction = (rowIndex: number, action: CellAction) => {
    if (!editable) return;
    setSeatCountChangeAction(seatCounter)

    setMatrixChangeAction((prevMatrix) => {
      if (prevMatrix.length === 1 && action === 'delete') {
        return prevMatrix; // Do nothing
      }
      let newMatrix = [...prevMatrix]; // Copy the current matrix

      if (action === 'add') {
        // Create a new row with the same number of columns as the existing rows
        const newRow = Array(prevMatrix[0]?.length || 0).fill(1);

        // Insert the new row at the specified index
        newMatrix.splice(rowIndex, 0, newRow);
      } else if (action === 'delete') {
        // Remove the row at the specified index
        if (rowIndex >= 0 && rowIndex < prevMatrix.length) {
          newMatrix.splice(rowIndex, 1);
        }
      }

      return newMatrix; // Return the updated matrix
    });
  };

  // Handle toggle of seat/empty space
  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (!editable) return

    setSeatCountChangeAction(seatCounter)
    setMatrixChangeAction((prevMatrix) => {
      const newMatrix = [...prevMatrix];
      newMatrix[rowIndex][colIndex] =
        newMatrix[rowIndex][colIndex] === 1 ? 0 : 1; // Toggle between seat (1) and empty (0)
      return newMatrix;
    });
  };

  // Calculate seat numbers in the grid based on seat (1) positions



  const renderActionCell = (
    action: CellAction,
    domain: ActionDomain,
    row: number,
    col: number
  ) => {
    if (!editable) return <div></div>; // Explicitly return an empty fragment

    return (
      <Button
        variant="ghost"
        key={`h${row}-${col}`}
        onClick={() => {
          if (domain === "column") handleColumnAction(col, action);
          else handleRowAction(row, action);
        }}
        className="relative flex items-center justify-center w-10 h-10 rounded-lg"
      >
        {action === "add" ? (
          <div className="relative flex items-center">
            <PlusCircleIcon className="text-blue-500" />
            {domain === "column" ? (
              <ArrowRight className="text-blue-500" /> // Horizontal bar for column
            ) : (
              <ArrowDown className="text-blue-500" /> // Vertical bar for row
            )}
          </div>
        ) : (
          <MinusCircleIcon className="text-red-500" />
        )}
      </Button>
    );
  };


  return (
    <div
      className="grid gap-2 p-2 border w-fit rounded-md"
      style={{
        gridTemplateColumns: `repeat(${2 + matrix[0]?.length || 0}, 40px)`,
        justifyContent: 'center'
      }}
    >
      {matrix.map((row, rowIndex) => (
        <>
          {rowIndex == 0 && (
            <>
              {[0, ...row].map((_, colIndex) => {
                return colIndex == 0 ? (
                  <div></div>
                ) : (
                  renderActionCell('add', 'column', rowIndex, colIndex - 1)
                );
              })}

              {<div></div>}
            </>
          )}

          {row.map((cell, colIndex) => {
            const isSeat = cell === 1;
            const seatNumber = seatNumberMatrix[rowIndex][colIndex];
            if (colIndex == 0) {
              renderActionCell('add', 'row', rowIndex, -colIndex);
            }

            return (
              <>
                {colIndex == 0 &&
                  renderActionCell('add', 'row', rowIndex, -colIndex)}

                <Card
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  className={`relative flex items-center justify-center w-10 h-10 rounded-md  ${isSeat
                    ? 'cursor-no-drop'
                    : 'border-none shadow-none cursor-cell'
                    }`}
                >
                  {isSeat && (
                    <span className="text-xs font-semibold">
                      {seatNumber}
                    </span>
                  )}
                </Card>

                {colIndex == matrix[0].length - 1 &&
                  renderActionCell('delete', 'row', rowIndex, -colIndex)}
              </>
            );
          })}

          {rowIndex == matrix.length - 1 && (
            <>
              {<div></div>}

              {[...row, 0].map((_, colIndex) => {
                return colIndex == matrix[0].length ? (
                  <div></div>
                ) : (
                  renderActionCell('delete', 'column', rowIndex, colIndex)
                );
              })}
            </>
          )}
        </>
      ))}
    </div>
  );
}

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"; // Import shadcn Popover
import Image from 'next/image';

export function VehicleModelLiveView({
  matrix,
  setMatrixChangeAction,
  setSeatCountChangeAction,
}: {
  matrix: number[][];
  setMatrixChangeAction: Dispatch<SetStateAction<number[][]>>;
  setSeatCountChangeAction: (newCount: number) => void;
}) {
  let seatCounter = 1;
  const seatNumberMatrix = matrix.map((row) =>
    row.map((cell) => (cell === 1 ? seatCounter++ : null))
  );

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    setSeatCountChangeAction(seatCounter);
    setMatrixChangeAction((prevMatrix) => {
      const newMatrix = [...prevMatrix];
      newMatrix[rowIndex][colIndex] = newMatrix[rowIndex][colIndex] === 1 ? 0 : 1;
      return newMatrix;
    });
  };

  return (
    <div
      className="grid gap-2 p-2 border w-fit rounded-md"
      style={{
        gridTemplateColumns: `repeat(${matrix[0]?.length || 0}, 40px)`,
        justifyContent: "center",
      }}
    >
      {matrix.map((row, rowIndex) => (
        <>
          {row.map((cell, colIndex) => {
            const isSeat = cell === 1;
            const seatNumber = seatNumberMatrix[rowIndex][colIndex];
            const isOccupied = Math.random() < 0.5;

            if (colIndex === 0 && rowIndex === 0) {
              return (
                <Popover key="driver">
                  <PopoverTrigger asChild>
                    <Card
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      className={`relative flex items-center justify-center w-10 h-10 rounded-md cursor-pointer`}
                    >
                      <ShipWheelIcon className="text-red-500" />
                    </Card>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2">
                    <div className="flex flex-col items-center gap-2">
                      <img
                        src="/path/to/driver-image.jpg" // Replace with your image path
                        alt="Driver"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <h3 className="text-sm font-semibold">Driver</h3>
                      <p className="text-xs ">Seat 1</p>
                    </div>
                  </PopoverContent>
                </Popover>
              );
            }

            return (
              <Popover key={`${rowIndex}-${colIndex}`}>
                <PopoverTrigger asChild>
                  <Card
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    className={`relative flex items-center justify-center w-10 h-10 rounded-md transition-all duration-200 
                      ${isSeat
                        ? `cursor-pointer ${isOccupied && "bg-green-400 hover:bg-green-500 border-none"}`
                        : "border-none shadow-none cursor-cell"
                      }`}
                  >
                    {isSeat && (
                      <span className={`text-xs font-semibold`}>
                        {seatNumber}
                      </span>
                    )}
                  </Card>
                </PopoverTrigger>
                <PopoverContent className="w-32 p-2">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative w-16 h-16 rounded-full border flex items-center justify-center overflow-hidden">
                      <Image
                        src={"/path/image"}
                        alt="No"
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                    <h3 className="text-sm font-semibold">Seat {seatNumber}</h3>
                    <p className="text-xs">
                      {isOccupied ? "Occupied" : "Available"}
                    </p>

                  </div>
                </PopoverContent>
              </Popover>
            );
          })}
        </>
      ))}
    </div>
  );
}
