import Search from '@/app-front/ui/search';
import Table from '@/app-front/ui/table';
import { searchTrips } from '@/app-front/lib/data';

interface SearchParamsType {
  departure?: string;
  destination?: string;
  agency?: string;
  heure?: string;
  date?: string;
  typeVoyage?: string;
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParamsType>;
}) {
  // Await the searchParams promise
  const params = await searchParams;

  // Destructure the resolved searchParams
  const departure = params.departure || '';
  const destination = params.destination || '';
  const agency = params.agency || '';
  const heure = params.heure || '';
  const date = params.date || '';
  const typeVoyage = params.typeVoyage || '';

  // Fetch trips based on search parameters
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