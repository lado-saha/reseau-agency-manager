'use client'
import { useState } from "react";
/*import { useRouter } from "next/navigation";*/

export default function Grid({valeur}:
  {valeur: number;}
) {
  
  const rows = 15;
  const cols = 6;
  const [clicked, setClicked] = useState(Array(rows * cols).fill(false));
  const [validated, setValidated] = useState(false);
  const [compt, setCompt] = useState(0);
  {/*const router= useRouter();*/}

  const hiddenIndices = new Set([
    ...Array.from({ length: rows - 1 }, (_, i) => (i * cols) + 3), // Masquer la colonne 4 sauf la dernière ligne
    0, 1, 2, 22, 23, 70, 71 // Masquer les cases 2, 3, 23, 24, 71, 72 (indices ajustés)
  ]);

  let visibleIndex = 0;

  const handleClick = (index) => {
    if (!validated) {
      const newClicked = [...clicked];
      newClicked[index] = !newClicked[index];
      setClicked(newClicked);
      setCompt((prevCompt) => prevCompt + valeur);
    }
  };

  const handleValidate = () => {
    setValidated(true);
    {/*router.push("@/app/recherche");*/}
  };

  return (
    <div className="flex flex-col pt-20 items-center mt-10">
      <div className="flex flex-wrap w-[230px]"> {/* Largeur ajustée pour aligner les carrés sans grille */}
        {Array.from({ length: rows * cols }, (_, index) => {
          if (hiddenIndices.has(index)) {
            return <div key={index} className="w-8 h-8 m-[2px] invisible"></div>;
          }
          visibleIndex++;
          return (
            <div
              key={index}
              className={`w-8 h-8 m-[2px] flex items-center justify-center text-white font-bold border cursor-pointer transition-colors duration-300 rounded-lg ${
                validated && clicked[index] ? "bg-gray-500" :
                clicked[index] ? "bg-green-500" : "bg-blue-500"
              }`}
              onClick={() => handleClick(index)}
            >
              {visibleIndex}
            </div>
          );
        })}
      </div>
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-1000 transition duration-300"
        onClick={handleValidate}
        disabled={validated}
      >
        Valider
      </button>
      <div className="mt-4 p-4 bg-blue-300 text-black font-bold rounded-lg">
        Prix: {compt} FCFA
      </div>
    </div>
  );
}
