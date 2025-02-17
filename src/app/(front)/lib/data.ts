// app/lib/data.ts
export type Trip = {
  id: string;
  departure: string;
  destination: string;
  agency: string;
  price: number;
  date: string;
  image: string;
  image_bus: string;
  image_agence: string;
  heure: string;
  typeVoyage: string;
  bus: string;
  immatriculation: string;
  nb_place: number;
  nom_chauffeur: string;
  rating: number;
  arret: string;
  image_chauffeur: string;
  localisation: string;


};

export const agencies: string[] = [
  "General",
  "Noblesse",
  "Global",
  "Touristique"
];

export const trips: Trip[] = [
  {
    id: "1",
    departure: "Bangangte",
    destination: "Douala",
    agency: "Noblesse",
    price: 5000,
    date: "2024-02-15",
    image: "/front/douala.jpeg",
    image_bus: "/noblesse.jpeg",
  image_agence: "/noblesse.jpeg",
  heure: "18:00",
  typeVoyage: "classique",
  bus: "Mercedes",
  immatriculation: "LT023GH",
  nb_place: 70,
  nom_chauffeur: "Babana",
  rating: 5,
  arret: "Melon",
  image_chauffeur: "/chauffeur.jpeg",
  localisation: "Douala-Akwa, Yaounde-Mvan"
  },
  {
    id: "2",
    departure: "Limbe",
    destination: "Ebolowa",
    agency: "General",
    price: 3500,
    date: "2024-03-20",
    image: "/front/ebolowa.jpg",
    image_bus: "/busgeneral.jpg",
  image_agence: "/general.jpeg",
   heure: "11:00",
   typeVoyage: "classique",
  bus: "Mercedes",
  immatriculation: "LT023GH",
  nb_place: 70,
  nom_chauffeur: "Babana",
  rating: 5,
  arret: "Melon",
  image_chauffeur: "/chauffeur.jpeg",
  localisation: "Douala-Akwa, Yaounde-Mvan"
  },
  {
    id: "3",
    departure: "Bafoussam",
    destination: "Yaounde",
    agency: "General",
    price: 4000,
    date: "2024-04-10",
    image: "/front/yaounde.jpeg",
    image_bus:  "/busgeneral.jpg",
  image_agence: "/general.jpeg",
   heure: "22:00",
   typeVoyage: "classique",
  bus: "Mercedes",
  immatriculation: "LT023GH",
  nb_place: 70,
  nom_chauffeur: "Babana",
  rating: 5,
  arret: "Melon",
  image_chauffeur: "/chauffeur.jpeg",
  localisation: "Douala-Akwa, Yaounde-Mvan"

  },
  {
    id: "4",
    departure: "Garoua",
    destination: "Maroua",
    agency: "Touristique",
    price: 10000,
    date: "2024-04-10",
    image: "/front/maroua.jpg",
    image_bus: "/bustouristique.jpg",
    image_agence: "/touristique.jpg",
     heure: "14:00",
     typeVoyage: "classique",
  bus: "Mercedes",
  immatriculation: "LT023GH",
  nb_place: 70,
  nom_chauffeur: "Babana",
  rating: 5,
  arret: "Melon",
  image_chauffeur: "/chauffeur.jpeg",
  localisation: "Douala-Akwa, Yaounde-Mvan"
    
  },
  {
    id: "5",
    departure: "Bertoua",
    destination: "Limbe",
    agency: "Global",
    price: 8000,
    date: "2024-04-10",
    image: "/front/limbe.jpg",
    image_bus: "/busglobal.jpg",
  image_agence: "/global.jpeg",
   heure: "06:30",
   typeVoyage: "vip",
  bus: "Mercedes",
  immatriculation: "LT023GH",
  nb_place: 70,
  nom_chauffeur: "Babana",
  rating: 5,
  arret: "Melon",
  image_chauffeur: "/chauffeur.jpeg",
  localisation: "Douala-Akwa, Yaounde-Mvan"
    
  },
  {
    id: "6",
    departure: "Bamenda",
    destination: "Buea",
    agency: "Global",
    price: 3000,
    date: "2024-04-10",
    image: "/front/buea.webp",
    image_bus: "/busglobal.jpg",
  image_agence: "/global.jpeg",
   heure: "08:00",
   typeVoyage: "classique",
  bus: "Mercedes",
  immatriculation: "LT023GH",
  nb_place: 70,
  nom_chauffeur: "Babana",
  rating: 5,
  arret: "Melon",
  image_chauffeur: "/chauffeur.jpeg",
  localisation: "Douala-Akwa, Yaounde-Mvan"
    
  },
  {
    id: "7",
    departure: "Bafoussam",
    destination: "Dschang",
    agency: "General",
    price: 3500,
    date: "2024-04-10",
    image: "/front/dschang.jpg",
    image_bus: "/busgeneral.jpg",
  image_agence:  "/general.jpeg",
   heure: "12:00",
   typeVoyage: "classique",
  bus: "Mercedes",
  immatriculation: "LT023GH",
  nb_place: 70,
  nom_chauffeur: "Babana",
  rating: 5,
  arret: "Melon",
  image_chauffeur: "/chauffeur.jpeg",
  localisation: "Douala-Akwa, Yaounde-Mvan"
  },
  {
    id: "8",
    departure: "Bafoussam",
    destination: "Bangangte",
    agency: "Noblesse",
    price: 2000,
    date: "2024-04-10",
    image: "/front/bangangte.jpeg",
    image_bus: "/noblesse.jpeg",
  image_agence: "/noblesse.jpeg",
     heure: "10:30",
     typeVoyage: "vip",
  bus: "Mercedes",
  immatriculation: "LT023GH",
  nb_place: 70,
  nom_chauffeur: "Babana",
  rating: 5,
  arret: "Melon",
  image_chauffeur: "/chauffeur.jpeg",
  localisation: "Douala-Akwa, Yaounde-Mvan"
     
  }

];

export async function searchTrips(
  departureQuery: string = "",
  destinationQuery: string = "",
  agencyQuery: string = "",
  heureQuery: string = "",
  dateQuery: string = "",
  typeVoyageQuery: string = ""
) {
  const filteredTrips = trips.filter(trip => {
    const matchDeparture = !departureQuery ||
      trip.departure.toLowerCase().includes(departureQuery.toLowerCase());
    
    const matchDestination = !destinationQuery ||
      trip.destination.toLowerCase().includes(destinationQuery.toLowerCase());
    
    const matchAgency = !agencyQuery ||
      trip.agency.toLowerCase().includes(agencyQuery.toLowerCase());
    
    const matchHeure = !heureQuery ||
      trip.heure.includes(heureQuery);
    
    const matchDate = !dateQuery ||
      new Date(trip.date).toISOString().split('T')[0] === dateQuery;
    
    const matchTypeVoyage = !typeVoyageQuery ||
      trip.typeVoyage.toLowerCase() === typeVoyageQuery.toLowerCase();

    return matchDeparture && matchDestination && matchAgency && 
           matchHeure && matchDate && matchTypeVoyage;
  });

  // Simuler un délai d'API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return filteredTrips;
}

export async function fetchDetail(numb: string) {
  const filterId = trips.filter(trip =>{
    const matchId = trip.id.includes(numb);

    return matchId;
  })
  await new Promise(resolve => setTimeout(resolve, 500));

  return filterId;
}

