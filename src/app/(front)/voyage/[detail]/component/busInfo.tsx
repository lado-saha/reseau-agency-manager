import { Bus, Info, Hash, Users } from 'lucide-react';
import Image from 'next/image';

interface BusInfoProps {
  bus: string;
  immatriculation: string;
  nbPlace: number;
  imageBus: string;
}

export default function BusInfo({ bus, immatriculation, nbPlace, imageBus }: BusInfoProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 transition-transform hover:scale-[1.02]">
      <h2 className="text-2xl font-bold text-[#0A2463] mb-4 border-b-2 border-orange-500 pb-2 flex items-center gap-2">
        <Bus className="text-orange-500" />
        Informations sur le bus
      </h2>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Info className="w-5 h-5 text-orange-500" />
          <p className="text-lg">
            <span className="font-semibold text-[#0A2463]">Type :</span>{" "}
            <span className="text-gray-700">{bus}</span>
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Hash className="w-5 h-5 text-orange-500" />
          <p className="text-lg">
            <span className="font-semibold text-[#0A2463]">Immatriculation :</span>{" "}
            <span className="text-gray-700">{immatriculation}</span>
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-orange-500" />
          <p className="text-lg">
            <span className="font-semibold text-[#0A2463]">Places :</span>{" "}
            <span className="text-gray-700">{nbPlace} sièges</span>
          </p>
        </div>
        <div className="relative h-48 w-full overflow-hidden rounded-lg mt-4">
          <Image
            src={imageBus}
            alt="Bus"
            width={500}  height={460}
            className="w-full h-full object-cover rounded-lg transition-transform hover:scale-110"
          />
        </div>
      </div>
    </div>
  );
}