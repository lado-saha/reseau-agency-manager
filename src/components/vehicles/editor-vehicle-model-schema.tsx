'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'; // Assuming Card component from your Shadcn UI library
import { VehicleModel } from '@/lib/models/resource';
import {
  ArrowDown,
  ArrowRight,
  MinusCircleIcon,
  PlusCircleIcon
} from 'lucide-react';

import { Dispatch, SetStateAction, useState } from 'react';

export type CellAction = 'add' | 'delete';
// We should perform the action on what? the row or the column
export type ActionDomain = 'row' | 'column';
// Assuming the BusModel class is imported from your model file

export default function VehicleModelSchemaEditor({
  rows = 5,
  columns = 8,
  matrix,
  setMatrixChange,
  setRowsChange,
  setColumnsChange
}: {
  rows: number;
  columns: number;
  matrix: number[][];
  setMatrixChange: Dispatch<SetStateAction<number[][]>>;
  setRowsChange: (newRows: number) => void;
  setColumnsChange: (newColumns: number) => void;
}) {
  // Initialize the matrix (seat grid) state

  const handleColumnAction = (colIndex: number, action: CellAction) => {
    setMatrixChange((prevMatrix) => {
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
    setMatrixChange((prevMatrix) => {
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
    setMatrixChange((prevMatrix) => {
      const newMatrix = [...prevMatrix];
      newMatrix[rowIndex][colIndex] =
        newMatrix[rowIndex][colIndex] === 1 ? 0 : 1; // Toggle between seat (1) and empty (0)
      return newMatrix;
    });
  };

  // Handle the change in grid size (Add or remove rows and columns while preserving data)
  const handleGridSizeChange = (rows: number, cols: number) => {
    setMatrixChange((prevMatrix) => {
      let newMatrix = [...prevMatrix];

      // Decreasing rows: Trim excess rows
      if (rows < prevMatrix.length) {
        newMatrix = newMatrix.slice(0, rows);
      }

      // Decreasing columns: Trim excess columns in each row
      if (cols < prevMatrix[0].length) {
        newMatrix = newMatrix.map((row) => row.slice(0, cols));
      }

      // Increasing rows: Add new rows filled with seats (1)
      if (rows > prevMatrix.length) {
        for (let i = prevMatrix.length; i < rows; i++) {
          newMatrix.push(Array(cols).fill(1)); // New rows with all seats
        }
      }

      // Increasing columns: Add new columns filled with seats (1)
      if (cols > prevMatrix[0].length) {
        newMatrix = newMatrix.map((row) => {
          row.push(...Array(cols - row.length).fill(1)); // Add new columns with all seats
          return row;
        });
      }

      return newMatrix;
    });
  };

  // Calculate seat numbers in the grid based on seat (1) positions
  let seatCounter = 1;
  const seatNumberMatrix = matrix.map(
    (row) => row.map((cell) => (cell === 1 ? seatCounter++ : null)) // Assign seat number to cells that are seats
  );

  // Function to convert matrix to bitmask string and create BusModel
  const createBusModel = () => {
    const cellsPerRow = matrix[0].length;
    const seatBitmask = matrix.map((row) => row.join('')).join(''); // Convert matrix to bitmask string

    const busModel = new VehicleModel(
      'bus-id', // Use actual ID here
      'Manufacturer Name', // Use actual manufacturer here
      'Bus Model X', // Use actual model name here
      seatBitmask,
      cellsPerRow,
      'gasoline'
    );

    busModel.matrix = null;

    console.log(busModel); // Log the BusModel object (can be saved or sent to backend)
    return busModel;
  };

  const renderActionCell = (
    action: CellAction,
    domain: ActionDomain,
    row: number,
    col: number
  ) => (
    <Button
      variant="ghost"
      key={`h${row}-${col}`}
      onClick={() => {
        if (domain === 'column') handleColumnAction(col, action);
        else handleRowAction(row, action);
      }}
      className="relative flex items-center justify-center w-10 h-10 rounded-lg"
    >
      {action === 'add' ? (
        <div className="relative flex items-center">
          <PlusCircleIcon className="text-blue-500" />
          {domain === 'column' ? (
            <ArrowRight className="text-blue-500" /> // Horizontal bar for column
          ) : (
            <ArrowDown className=" text-blue-500" /> // Horizontal bar for column
          )}
        </div>
      ) : (
        <MinusCircleIcon className="text-red-500" />
      )}
    </Button>
  );

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Seats Schema</CardTitle>
        <CardDescription>
          Manage your fleet and monitor vehicle statuses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Grid Size Controls */}
        <div
          className="grid gap-2 p-2 rounded-md"
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
                      className={`relative flex items-center justify-center w-10 h-10 rounded-md  ${
                        isSeat
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
      </CardContent>
    </Card>
  );
}
