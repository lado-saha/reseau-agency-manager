import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Search() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-blue-900">
              Destination
            </label>
            <input
              type="text"
              name="destination"
              id="destination"
              placeholder="Ville d'arrivée"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          <div>
            <label htmlFor="departure" className="block text-sm font-medium text-blue-900">
              Départ
            </label>
            <input
              type="text"
              name="departure"
              id="departure"
              placeholder="Ville de départ"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          

          <div>
            <label htmlFor="agency" className="block text-sm font-medium text-blue-900">
              Agence
            </label>
            <input
              type="text"
              name="agency"
              id="agency"
              placeholder="Nom de l'agence"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-blue-900">
              Date
            </label>
            <input
              type="date"
              name="date"
              id="date"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          <div>
            <label htmlFor="heure" className="block text-sm font-medium text-blue-900">
              Heure
            </label>
            <input
              type="time"
              name="heure"
              id="heure"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          <div>
            <label htmlFor="typeVoyage" className="block text-sm font-medium text-blue-900">
              Type de voyage
            </label>
            <select
              name="typeVoyage"
              id="typeVoyage"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-orange-500"
            >
              <option value="">Tous</option>
              <option value="vip">VIP</option>
              <option value="classique">Classique</option>
            </select>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
            Rechercher
          </button>
        </div>
      </form>
    </div>
  );
}