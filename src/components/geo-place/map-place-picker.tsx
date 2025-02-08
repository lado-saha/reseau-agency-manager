'use client';

import { MapContainer, TileLayer, Marker, useMapEvent } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import { GPSPosition } from '@/lib/repo/osm-place-repo';

interface MapProps {
  initialPosition: GPSPosition;
  selectedPosition: GPSPosition | null;
  onPositionSelectAction: (pos: GPSPosition) => void;
}

function MapEventHandler({ onPositionSelectAction }: { onPositionSelectAction: (pos: GPSPosition) => void }) {
  useMapEvent('dblclick', (ev) => {
    onPositionSelectAction({ latitude: ev.latlng.lat, longitude: ev.latlng.lng });
  });
  return null;
}

export default function MapComponent({ initialPosition, selectedPosition, onPositionSelectAction }: MapProps) {
  return (
    <MapContainer center={[initialPosition.latitude, initialPosition.longitude]} zoom={14} style={{ height: '300px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapEventHandler onPositionSelectAction={onPositionSelectAction} />
      {selectedPosition && <Marker position={[selectedPosition.latitude, selectedPosition.longitude]} />}
    </MapContainer>
  );
}
