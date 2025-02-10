'use client'
import { PlaceAddress } from "@/lib/repo/osm-place-repo";
import { LatLngExpression, LatLngTuple } from "leaflet";
import { MapContainer, TileLayer, Marker, Tooltip, Popup, useMapEvent } from "react-leaflet";
import { StationMapTooltip, StationGridItem } from "./station/item-station";
import { PropsStations } from "./station/table-station";
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

export interface MapProps {
  posix: LatLngExpression | LatLngTuple;
  zoom?: number;
  onCenterChangeAction: (lat: number, lon: number) => void;
  onZoomChangeAction: (zoom: number) => void;
}

function LocationListener({
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

function MapStationsComponent({
  stations,
  posix,
  zoom = 13,
  onCenterChangeAction: onCenterChange,
  onZoomChangeAction: onZoomChange,
  deleteAction,
  navToDetailsAction
}: PropsStations & MapProps) {
  return (
    <div className="w-full h-[calc(100vh-64px)]">
      <MapContainer
        center={posix}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationListener
          onCenterChangeAction={onCenterChange}
          onZoomChangeAction={onZoomChange}
        />
        {stations.map((station) => {
          const position: LatLngTuple = [
            (station.address as PlaceAddress).latitude,
            (station.address as PlaceAddress).longitude
          ];

          return (
            <Marker
              key={station.id}
              position={position}
            >
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
          );
        })}
      </MapContainer>
    </div>
  );
}

// Dynamically import the component with no SSR
const MapStations = dynamic(() => Promise.resolve(MapStationsComponent), {
  ssr: false
});

export default MapStations;