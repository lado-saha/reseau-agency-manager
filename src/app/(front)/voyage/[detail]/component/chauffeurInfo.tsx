import { User } from 'lucide-react';
import RatingStars from '@/app-front/voyage/[detail]/component/ratingStars';
import Image from 'next/image';

interface ChauffeurInfoProps {
  nom: string;
  image: string;
  rating: number;
}

export default function ChauffeurInfo({ nom, image, rating }: ChauffeurInfoProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 transition-transform hover:scale-[1.02]">
      <h2 className="text-2xl font-bold text-[#0A2463] mb-4 border-b-2 border-orange-500 pb-2 flex items-center gap-2">
        <User className="text-orange-500" />
        Informations sur le chauffeur
      </h2>
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative w-24 h-24 overflow-hidden rounded-full">
          <Image
            src={image}
            alt={nom}
            width={500}  height={460}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-[#0A2463]">
            {nom}
          </h3>
          <RatingStars rating={rating} />
        </div>
      </div>
    </div>
  );
}