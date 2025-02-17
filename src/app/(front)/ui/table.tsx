// app/ui/table.tsx


import { Trip } from '@/app-front/lib/data';
import Link from 'next/link';
import Image from 'next/image';

export default function Table({ trips }: { trips: Trip[] }) {
  return (
    <div className="mt-6">
      {trips.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          Aucun voyage trouvé
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition hover:scale-105"
            >
              {/* Image de destination */}
              <div className="relative h-48">
                <Image
                  src={trip.image}
                  alt={`Vue de ${trip.destination}`}
                  width={500}  height={460}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Informations du voyage */}
              <div className="p-4">
                {/* En-tête avec prix et agence */}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-2xl font-bold text-blue-600">
                    {trip.price}FCFA
                  </span>
                  <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {trip.agency}
                  </span>
                </div>

                {/* Trajet */}
                <div className="mb-3">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                    </svg>
                    <span className="font-medium">{trip.departure}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                    </svg>
                    <span className="font-medium">{trip.destination}</span>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span>{new Date(trip.date).toLocaleDateString()}</span>
                </div>
                <div>
                  <span>Heure de depart: </span><span>{trip.heure}</span>
                </div>

                {/* Bouton détails */}
                <Link
                  href={`/voyage/${trip.id}`}
                  className="block w-full text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
                >
                  Voir les détails
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}