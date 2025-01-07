import { useState } from "react";
import { Card } from "@/components/ui/card";

export default function CreateVehicleModel() {
  const defaultRows = 5; // Set initial number of rows
  const defaultCols = 8; // Set initial number of columns

  // Initialize the matrix (seat grid) state
  const [matrix, setMatrix] = useState(
    Array(defaultRows)
      .fill(null)
      .map(() => Array(defaultCols).fill(1)) // 1 means seat, initially all are seats
  );

  // Handle toggle of seat/empty space
  const handleCellClick = (rowIndex: number, colIndex: number) => {
    setMatrix((prevMatrix) => {
      const newMatrix = [...prevMatrix];
      newMatrix[rowIndex][colIndex] =
        newMatrix[rowIndex][colIndex] === 1 ? 0 : 1; // Toggle between seat (1) and empty (0)
      return newMatrix;
    });
  };

  // Handle the change in grid size (Add or remove rows and columns while preserving data)
  const handleGridSizeChange = (rows: number, cols: number) => {
    setMatrix((prevMatrix) => {
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

      {/* Bus Grid */}
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
                onClick={() => handleCellClick(rowIndex, colIndex)}
                className={`relative flex items-center justify-center w-10 h-10 rounded-md  ${
                  isSeat
                    ? 'cursor-not-allowed'
                    : 'border-none shadow-none cursor-cell'
                }`}
              >
                {isSeat && (
                  <span className="text-xs font-semibold">{seatNumber}</span>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* Save Button */}
      <button
        onClick={() => console.log(matrix)} // Here you can save the matrix to your backend or local storage
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Save Layout
      </button>
    </div>
  );
}
