/*import RatingStars from '@/app-front/voyage/[detail]/component/ratingStars';*/

export default function VoyageHeader({ 
  departure, 
  destination, 
   
}: { 
  departure: string; 
  destination: string; 
  
}) {
  return (
    <div className="bg-white  rounded-lg shadow-lg p-6">
      <h1 className="text-3xl font-bold text-[#0A2463] mb-4">
        Voyage {departure} - {destination}
      </h1>
      
    </div>
  );
}