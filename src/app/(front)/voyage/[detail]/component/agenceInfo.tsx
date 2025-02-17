import { Building, Info, MapPinned } from 'lucide-react';
import Image from 'next/image';

export default function AgenceInfo({ 
  agency, 
  image, 
  location 
}: {
  agency: string;
  image: string;
  location: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 transition-transform hover:scale-[1.02]">
      <h2 className="text-2xl font-bold text-[#0A2463] mb-4 border-b-2 border-orange-500 pb-2 flex items-center gap-2">
        <Building className="text-orange-500" />
        Informations sur l&apos;agence
      </h2>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Info className="w-5 h-5 text-orange-500" />
          <p className="text-lg">
            <span className="font-semibold text-[#0A2463]">Agence :</span>{" "}
            <span className="text-gray-700">{agency}</span>
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <MapPinned className="w-5 h-5 text-orange-500" />
          <p className="text-lg">
            <span className="font-semibold text-[#0A2463]">Localisation :</span>{" "}
            <span className="text-gray-700">{location}</span>
          </p>
        </div>
        <div className="relative h-48 w-full overflow-hidden rounded-lg mt-4">
          <Image
            src={image}
            alt={`Agence ${agency}`}
            width={500}  height={460}
            className="w-full h-full object-cover rounded-lg transition-transform hover:scale-110"
          />
        </div>
      </div>
    </div>
  );
}