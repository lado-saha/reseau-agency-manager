import Search from '@/app/ui/search';
import Table from '@/app/ui/table';
import { searchTrips } from '@/app/lib/data';

interface SearchParamsType {
  departure?: string;
  destination?: string;
  agency?: string;
  heure?: string;
  date?: string;
  typeVoyage?: string;
}

export default async function Page({
  searchParams = {},
}: {
  searchParams?: SearchParamsType;
}) {
  // Pas besoin de Promise.resolve ici car searchParams est déjà un objet
  
  const ceci = await Promise.resolve(searchParams || {});
  const departure = ceci?.departure || '';
  const destination = ceci?.destination || '';
  const agency = ceci?.agency || '';
  const heure = ceci?.heure || '';
  const date = ceci?.date || '';
  const typeVoyage = ceci?.typeVoyage || '';

  const trips = await searchTrips(departure, destination, agency, heure, date, typeVoyage);
  
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold text-blue-900 mb-8">Recherche de voyages</h1>
      <div className="space-y-8">
        
        
        <Search />
        {trips.length > 0 ? (
          <Table trips={trips} />
        ) : (
          <p className="text-center text-gray-500">Aucun voyage trouvé</p>
        )}
      </div>
    </main>
  );
}