'use client';

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  ZoomControl,
  useMapEvents,
  useMapEvent
} from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

import { LatLngExpression, LatLngTuple } from 'leaflet';
import { PropsVehicles } from '@/components/vehicles/table-vehicles';
import {
  VehicleGridItem,
  VehicleMapTooltip,
  VehicleTableItem
} from '@/components/vehicles/item-vehicle';

export interface MapProps {
  posix: LatLngExpression | LatLngTuple;
  zoom?: number;
  onCenterChange: (lat: number, lon: number) => void;
  onZoomChange: (zoom: number) => void;
}

/**
 * Listens to changes done to the map(drag, zoom) and update the variable which holds
 */
function LocationListener({
  onZoomChange,
  onCenterChange
}: {
  onZoomChange: (zoom: number) => void;
  onCenterChange: (lat: number, lon: number) => void;
}) {
  const map1 = useMapEvent('dragend', () => {
    onCenterChange(map1.getCenter().lat, map1.getCenter().lng);
  });

  const map2 = useMapEvent('zoomend', () => {
    onZoomChange(map2.getZoom());
  });

  return null;
}

export default function MapVehicles({
  vehicles,
  offset,
  totalVehicles,
  currentTab,
  posix,
  zoom,
  onCenterChange,
  onZoomChange
}: PropsVehicles & MapProps) {
  return (
    <MapContainer
      center={posix}
      zoom={zoom}
      scrollWheelZoom={false}
      // style={{ height: '100%', width: '100%' }}
      // style={{ height: '400px', width: '100%' }}
      style={{ height: 'calc(100vh - 64px)', width: '100%' }}
    >
      {/* OpenStreetMap Tile Layer */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationListener
        onCenterChange={onCenterChange}
        onZoomChange={onZoomChange}
      />

      {/* Vehicle Markers */}
      {vehicles.map((vehicle) => (
        <Marker
          key={vehicle.immatriculation}
          position={
            [vehicle.positionGps.latitude, vehicle.positionGps.longitude] ||
            posix
          } // Fallback to map center if location is undefined
        >
          {/* <Popup>Hey ! I study here</Popup> */}
          {/* Tooltip with Vehicle Info */}
          <Tooltip permanent direction="top" offset={[-15, 0]}>
            <VehicleMapTooltip
              vehicle={vehicle}
              currentTab={currentTab}
              viewOnMap={() => {}}
            />
          </Tooltip>
          <Popup keepInView={true} closeButton={false} autoPan={true}>
            <VehicleGridItem
              viewOnMap={() => {}}
              vehicle={vehicle}
              currentTab={currentTab}
            />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
