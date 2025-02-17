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
import { PropsVehicles } from '@/components/vehicle/table-vehicles';
import { VehicleGridItem, VehicleMapTooltip } from './vehicle/item-vehicle';

export interface MapProps {
  posix: LatLngExpression | LatLngTuple;
  zoom?: number;
  onCenterChangeAction: (lat: number, lon: number) => void;
  onZoomChangeAction: (zoom: number) => void;
}

/**
 * Listens to changes done to the map(drag, zoom) and update the variable which holds
 */
export function LocationListener({
  onZoomChangeAction,
  onCenterChangeAction,
}: {
  onZoomChangeAction: (zoom: number) => void;
  onCenterChangeAction: (lat: number, lon: number) => void;
}) {
  const map1 = useMapEvent('dragend', () => {
    onCenterChangeAction(map1.getCenter().lat, map1.getCenter().lng);
  });

  const map2 = useMapEvent('zoomend', () => {
    onZoomChangeAction(map2.getZoom());
  });

  return null;
}

export default function MapVehicles({
  vehicles,
  offset,
  totalVehicles,
  viewOnMapAction,
  tab,
  currentId, detailsAction,
  posix,
  zoom,
  onCenterChangeAction: onCenterChange,
  onZoomChangeAction: onZoomChange
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
        onCenterChangeAction={onCenterChange}
        onZoomChangeAction={onZoomChange}
      />

      {/* Vehicle Markers */}
      {vehicles.map((vehicle) => (
        <Marker
          key={vehicle.registrationNumber}
          position={
            [vehicle.latitude, vehicle.longitude] ||
            posix
          } // Fallback to map center if location is undefined
        >
          {/* Tooltip with Vehicle Info */}
          <Tooltip permanent direction="top" offset={[-15, 0]}>
            <VehicleMapTooltip
              currentId={currentId}
              vehicle={vehicle}
              tab={tab}
              viewOnMapAction={() => { }}
              detailsAction={detailsAction}
            />
          </Tooltip>
          <Popup keepInView={true} closeButton={false} autoPan={true}>
            <VehicleGridItem
              viewOnMapAction={viewOnMapAction}
              key={vehicle.registrationNumber}
              vehicle={vehicle}
              tab={tab}
              currentId={currentId}
              detailsAction={detailsAction}
            />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
