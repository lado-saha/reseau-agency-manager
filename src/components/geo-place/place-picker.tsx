'use client';

import { GPSPosition, PlaceAddress } from '@/lib/repo/osm-place-repo';
import { useEffect, useState } from 'react';
import AddressForm from './address-form';
import MapComponent from './map-place-picker';
import NearbyPlacesList from './nearby-place-list';
import { ErrorDialog } from '../dialogs/dialog-error';
import { Progress } from '../ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export interface AddressSelectionProps {
  title: string,
  description: string,
  onSaveAction: (place: PlaceAddress) => void,
  oldPlace?: PlaceAddress
}

export default function AddressSelection(
  { description, title, onSaveAction, oldPlace }: AddressSelectionProps
) {
  const [currentLocation, setCurrentLocation] = useState<GPSPosition>(oldPlace ? { latitude: oldPlace.latitude, longitude: oldPlace.longitude } : { latitude: 3.848, longitude: 11.502 });
  const [selectedPosition, setSelectedPosition] = useState<GPSPosition | null>(oldPlace ? { latitude: oldPlace.latitude, longitude: oldPlace.longitude } : null);
  const [places, setPlaces] = useState<PlaceAddress[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceAddress | null>(oldPlace || null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isPending, setIsPending] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCurrentLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        () => setErrorMessage('Location access denied')
      );
    }
  }, []);

  async function fetchNearbyPlaces(position: GPSPosition) {
    setIsPending(true); // Start loading
    setProgress(0); // Reset progress at the start

    // Simulate progress incrementally
    let progressInterval: NodeJS.Timeout;
    progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval); // Stop the interval when progress reaches 90%
          return 90; // Set progress to 90%
        }
        return Math.min(prev + 10, 90); // Increase progress by 10% every 100ms
      });
    }, 500);

    try {
      const response = await fetch(`/api/places?lat=${position.latitude}&lon=${position.longitude}`);
      const data = await response.json();

      if (data.error) {
        setErrorMessage(data.error);
        setPlaces([]); // Clear places in case of error
      } else if (data.length === 0) {
        setErrorMessage('No nearby places found');
        setPlaces([]);
      } else {
        setErrorMessage('');
        setPlaces(data);
        setSelectedPlace(places[0])
      }
    } catch (error) {
      setErrorMessage('An error occurred while fetching places');
      setPlaces([]);
    } finally {
      setProgress(100); // Ensure progress reaches 100 when request finishes
      setIsPending(false); // End loading
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <MapComponent
            initialPosition={currentLocation}
            selectedPosition={selectedPosition}
            onPositionSelectAction={(pos) => {
              setSelectedPosition(pos);
              fetchNearbyPlaces(pos);
            }}
          />
          <ErrorDialog
            isOpen={errorMessage !== ''}
            onCloseAction={() => setErrorMessage('')}
            title="Error Occurred"
            description={errorMessage}
          />
          {isPending && (
            <div className="w-full">
              <Progress value={progress} className="w-full" />
            </div>
          )}
          {places.length > 0 && !isPending && (
            <NearbyPlacesList
              places={places}
              onSelectPlaceAction={(place) => {
                const pos = { latitude: place.latitude, longitude: place.longitude }
                setSelectedPlace(place); // Update selected place
                setCurrentLocation(pos)
                setSelectedPosition(pos)
                // fetchNearbyPlaces({latitude: place.latitude, longitude: place.longitude }); // Refetch nearby places (optional)
              }}
              selectedPlaceId={selectedPlace?.id} // Pass the selected place to highlight it
            />
          )}
          <AddressForm id={oldPlace?.id || 'new'} originalAddress={selectedPlace || undefined} onSaveAction={onSaveAction} />
        </div>
      </CardContent>
    </Card>
  );
}
