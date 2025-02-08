
'use client'

import { PlaceAddress } from "@/lib/repo/osm-place-repo";
import { TileLayer, Marker, Tooltip, Popup, LatLngExpression, LatLngTuple } from "leaflet";
import { MapContainer, useMapEvent } from "react-leaflet";
import { StationMapTooltip, StationGridItem } from "./station/item-station";
import { PropsStations } from "./station/table-station";

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
export interface MapProps {
  posix: LatLngExpression | LatLngTuple;
  zoom?: number;
  onCenterChangeAction: (lat: number, lon: number) => void;
  onZoomChangeAction: (zoom: number) => void;
}

export function LocationListener({
  onZoomChangeAction,
  onCenterChangeAction,
}: {
  onZoomChangeAction: (zoom: number) => void;
  onCenterChangeAction: (lat: number, lon: number) => void;
}) {
  useMapEvent('moveend', (event) => {
    onCenterChangeAction(event.target.getCenter().lat, event.target.getCenter().lng);
    onZoomChangeAction(event.target.getZoom());
  });

  return null;
}

export default function MapStations({
  stations,
  posix,
  zoom,
  onCenterChangeAction: onCenterChange,
  onZoomChangeAction: onZoomChange, deleteAction, offset, totalStations, navToDetailsAction
}: PropsStations & MapProps) {
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
      {stations.map((station) => (
        <Marker
          key={station.id}
          position={
            [(station.address as PlaceAddress).latitude, (station.address as PlaceAddress).longitude] ||
            posix
          } // Fallback to map center if location is undefined
        >
          {/* <Popup>Hey ! I study here</Popup> */}
          {/* Tooltip with Vehicle Info */}
          <Tooltip permanent direction="top" offset={[-15, 0]}>
            <StationMapTooltip
              station={station}
              viewOnMap={() => { }}
              deleteAction={deleteAction}
              navToDetails={navToDetailsAction}
            />
          </Tooltip>
          <Popup keepInView={true} closeButton={false} autoPan={true}>
            <StationGridItem
              viewOnMap={() => { }}
              station={station}
              deleteAction={deleteAction}
              navToDetails={navToDetailsAction}
            />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}