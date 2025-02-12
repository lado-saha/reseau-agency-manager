'use client'

import { useState } from 'react';
import { Card } from '@/components/ui/card';

export default function CreateVehicleModel() {
  const defaultRows = 5; // Set initial number of rows
  const defaultCols = 8; // Set initial number of columns

  const initializeMatrix = (rows: number, cols: number): number[][] =>
    Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(1)); // 1 means seat, initially all are seats

  // Initialize the matrix (seat grid) state
  const [matrix, setMatrix] = useState(() =>
    initializeMatrix(defaultRows, defaultCols)
  );

  // Handle toggle of seat/empty space
  const handleCellClick = (rowIndex: number, colIndex: number) => {
    setMatrix((prevMatrix) => {
      const newMatrix = prevMatrix.map((row, rIdx) =>
        rIdx === rowIndex
          ? row.map((cell, cIdx) =>
              cIdx === colIndex ? (cell === 1 ? 0 : 1) : cell
            )
          : row
      );
      return newMatrix;
    });
  };

  // Handle the change in grid size (Add or remove rows and columns while preserving data)
  const handleGridSizeChange = (rows: number, cols: number) => {
    if (rows < 1 || cols < 1) return; // Prevent invalid values

    setMatrix((prevMatrix) => {
      let newMatrix = [...prevMatrix];

      // Adjust rows
      if (rows > prevMatrix.length) {
        // Add rows
        newMatrix = [
          ...newMatrix,
          ...initializeMatrix(rows - prevMatrix.length, cols)
        ];
      } else if (rows < prevMatrix.length) {
        // Remove excess rows
        newMatrix = newMatrix.slice(0, rows);
      }

      // Adjust columns
      newMatrix = newMatrix.map((row) =>
        cols > row.length
          ? [...row, ...Array(cols - row.length).fill(1)]
          : row.slice(0, cols)
      );

      return newMatrix;
    });
  };

  // Calculate seat numbers in the grid based on seat (1) positions
  let seatCounter = 1;
  const seatNumberMatrix = matrix.map((row) =>
    row.map((cell) => (cell === 1 ? seatCounter++ : null))
  );

  // Export layout as JSON
  const exportLayout = () => {
    const layoutJSON = JSON.stringify(matrix);
    const blob = new Blob([layoutJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vehicle-layout.json';
    link.click();
  };

  // Reusable SeatGrid component for cleaner rendering
  const SeatGrid = ({
    matrix,
    seatNumberMatrix,
    onCellClick
  }: {
    matrix: number[][];
    seatNumberMatrix: (number | null)[][];
    onCellClick: (rowIndex: number, colIndex: number) => void;
  }) => (
    <div
      className="grid gap-2 p-2 border rounded-md w-fit"
      style={{
        gridTemplateColumns: `repeat(${matrix[0]?.length || 0}, 40px)`,
        justifyContent: 'center'
      }}
    >
      {matrix.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isSeat = cell === 1;
          const seatNumber = seatNumberMatrix[rowIndex][colIndex];

          return (
            <Card
              key={`${rowIndex}-${colIndex}`}
              onClick={() => onCellClick(rowIndex, colIndex)}
              className={`relative flex items-center justify-center w-10 h-10 rounded-md ${
                isSeat ? 'bg-green-500 cursor-pointer' : 'bg-gray-300'
              }`}
            >
              {isSeat && (
                <span className="text-xs font-semibold text-white">
                  {seatNumber}
                </span>
              )}
            </Card>
          );
        })
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Grid Size Controls */}
      <div className="flex justify-between items-center space-x-4">
        <div>
          <label>Rows:</label>
          <input
            type="number"
            min={1}
            value={matrix.length}
            onChange={(e) =>
              handleGridSizeChange(Number(e.target.value), matrix[0].length)
            }
            className="w-20 border rounded-md p-2"
          />
        </div>
        <div>
          <label>Columns:</label>
          <input
            type="number"
            min={1}
            value={matrix[0].length}
            onChange={(e) =>
              handleGridSizeChange(matrix.length, Number(e.target.value))
            }
            className="w-20 border rounded-md p-2"
          />
        </div>
      </div>

      {/* Seat Grid */}
      <SeatGrid
        matrix={matrix}
        seatNumberMatrix={seatNumberMatrix}
        onCellClick={handleCellClick}
      />

      {/* Actions */}
      <div className="flex space-x-4">
        <button
          onClick={() => console.log(matrix)} // You can replace this with a save function
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Save Layout
        </button>
        <button
          onClick={exportLayout}
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          Export Layout
        </button>
      </div>
    </div>
  );
}
