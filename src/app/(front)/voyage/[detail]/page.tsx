import { fetchDetail } from "@/app-front/lib/data";
import { notFound } from 'next/navigation';
import VoyageHeader from '@/app-front/voyage/[detail]/component/voyageHeader';
import AgenceInfo from '@/app-front/voyage/[detail]/component/agenceInfo';
import BusInfo from '@/app-front/voyage/[detail]/component/busInfo';
import VoyageInfo from '@/app-front/voyage/[detail]/component/voyageInfo';
import ChauffeurInfo from '@/app-front/voyage/[detail]/component/chauffeurInfo';
import SelectSeatButton from '@/app-front/voyage/[detail]/component/selectseatButton';

export default async function Page({ params }: { params: Promise<{ detail: string }> }) {
  const { detail } = await params;
  const tableau = await fetchDetail(detail);

  if (!tableau || tableau.length === 0) {
    notFound();
  }

  return (
    <div className="max-w-7xl pt-20 mx-auto px-4 py-8">
      {tableau.map((element) => (
        <div key={element.id} className="space-y-8">
          <VoyageHeader 
            departure={element.departure}
            destination={element.destination}
          />

          <div className="flex justify-center mt-8">
            <SelectSeatButton 
              id={element.id}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AgenceInfo 
              agency={element.agency}
              image={element.image_agence}
              location={element.localisation}
            />

            <BusInfo 
              bus={element.bus}
              immatriculation={element.immatriculation}
              nbPlace={element.nb_place}
              imageBus={element.image_bus}
            />

            <VoyageInfo 
              departure={element.departure}
              destination={element.destination}
              arret={element.arret}
              heure={element.heure}
              date={element.date}
              price={element.price}
              typeVoyage={element.typeVoyage}
            />

            <ChauffeurInfo 
              nom={element.nom_chauffeur}
              image={element.image_chauffeur}
              rating={element.rating}
            />
          </div>
        </div>
      ))}
    </div>
  );
}