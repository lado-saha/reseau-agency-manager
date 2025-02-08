'use client';

import { PlaceAddress } from '@/lib/repo/osm-place-repo';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';

interface NearbyPlacesListProps {
  places: PlaceAddress[];
  selectedPlaceId?: string
  onSelectPlaceAction: (place: PlaceAddress) => void;
}


export default function NearbyPlacesList({ places, selectedPlaceId, onSelectPlaceAction }: NearbyPlacesListProps) {
  return (
    <div className="overflow-x-hidden"> {/* Prevent horizontal scroll on the parent */}
      <ScrollArea className="w-4/5 overflow-x-auto whitespace-nowrap rounded-md border">
        <div className="flex space-x-4 p-2">
          {places.map((place) => (
            <Card
              key={place.id}
              className={`flex flex-col items-center p-4 border rounded-lg shadow-md space-y-2 cursor-pointer ${selectedPlaceId === place.id ? 'border-blue-500' : ''
                }`}
            >
              <CardTitle className="text-lg">
                {place.road || place.suburb || place.city || place.state || place.country || 'Unknown place'}
              </CardTitle>
              <CardContent className="text-sm text-gray-500 ">
                {place.city && <div>City: {place.city}</div>}
                {place.suburb && <div>Suburb: {place.suburb}</div>}
                {place.state && <div>State: {place.state}</div>}
                {place.country && <div>Country: {place.country}</div>}
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => onSelectPlaceAction(place)} className="mt-2">
                  Select This Place
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
