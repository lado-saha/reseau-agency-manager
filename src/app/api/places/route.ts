import { PlaceAddress } from '@/lib/repo/osm-place-repo';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get('lat') || '');
  const lon = parseFloat(searchParams.get('lon') || '');

  if (isNaN(lat) || isNaN(lon)) {
    return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
  }

  const deltas = [0, 0.0005, -0.0005, 0.0007, -0.0007]; // Small offsets for nearby locations
  const uniqueCoords = new Set<string>();

  const fetchPlace = async (latitude: number, longitude: number) => {
    const coordKey = `${latitude.toFixed(6)},${longitude.toFixed(6)}`;
    if (uniqueCoords.has(coordKey)) return null;
    uniqueCoords.add(coordKey);

    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
    const data = await res.json();

    if (data && data.address) {

      return {
        id: crypto.randomUUID(),
        latitude: data.lat,
        longitude: data.lon,
        road: data.address?.road,
        suburb: data.address?.suburb,
        city: data.address?.city,
        state: data.address?.state,
        country: data.address?.country,
      } satisfies PlaceAddress;

    }

    return null;
  };

  const requests = deltas.map((delta) => fetchPlace(lat + delta, lon + delta));
  const places = (await Promise.all(requests)).filter((place) => place !== null);

  if (places.length === 0) {
    return NextResponse.json({ error: 'No nearby places found' }, { status: 404 });
  }


  return NextResponse.json(places);
}
