import { MapPin, Route, Clock, Calendar, CreditCard, Bus, Info } from 'lucide-react';

interface VoyageInfoProps {
  departure: string;
  destination: string;
  arret: string;
  heure: string;
  date: string;
  price: number;
  typeVoyage: string;
}

export default function VoyageInfo({ 
  departure, 
  destination, 
  arret, 
  heure, 
  date, 
  price, 
  typeVoyage 
}: VoyageInfoProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 transition-transform hover:scale-[1.02]">
      <h2 className="text-2xl font-bold text-[#0A2463] mb-4 border-b-2 border-orange-500 pb-2 flex items-center gap-2">
        <Info className="text-orange-500" />
        Détails du voyage
      </h2>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-orange-500" />
          <p className="text-lg">
            <span className="font-semibold text-[#0A2463]">Départ :</span>{" "}
            <span className="text-gray-700">{departure}</span>
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-orange-500" />
          <p className="text-lg">
            <span className="font-semibold text-[#0A2463]">Destination :</span>{" "}
            <span className="text-gray-700">{destination}</span>
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Route className="w-5 h-5 text-orange-500" />
          <p className="text-lg">
            <span className="font-semibold text-[#0A2463]">Arrêts :</span>{" "}
            <span className="text-gray-700">{arret}</span>
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-orange-500" />
          <p className="text-lg">
            <span className="font-semibold text-[#0A2463]">Heure de départ :</span>{" "}
            <span className="text-gray-700">{heure}</span>
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-orange-500" />
          <p className="text-lg">
            <span className="font-semibold text-[#0A2463]">Date :</span>{" "}
            <span className="text-gray-700">
              {new Date(date).toLocaleDateString()}
            </span>
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <CreditCard className="w-5 h-5 text-orange-500" />
          <p className="text-lg">
            <span className="font-semibold text-[#0A2463]">Prix :</span>{" "}
            <span className="text-gray-700">{price} FCFA</span>
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Bus className="w-5 h-5 text-orange-500" />
          <p className="text-lg">
            <span className="font-semibold text-[#0A2463]">Type de voyage :</span>{" "}
            <span className="text-gray-700">{typeVoyage}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
