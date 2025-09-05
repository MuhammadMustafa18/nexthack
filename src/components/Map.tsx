"use client";

import LeafletClientSetup from "@/app/LeafletClientSetup";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import LocationMarker from "./LocationMarker";
import SearchBox from "./SearchBox";

interface propTypes {
  mapCoordinates: [number, number] | null; // ✅ receives from parent (sidebar or click)

  setMapCoordinates: (coords: [number, number] | null) => void;
}
export default function Map({ mapCoordinates, setMapCoordinates }: propTypes) {
  return (
    <div className="h-screen w-screen bg-[#D4DADC]">
      <LeafletClientSetup />

      <MapContainer
        key="main-map"
        center={[24.8607, 67.0011]} // Karachi coords
        zoom={2}
        // scrollWheelZoom={true}
        className="h-full w-full"
      >
        {/* OpenStreetMap tiles */}
        {/* <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        /> */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>, &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />
        {/* ✅ add search bar */}
        <SearchBox setMapCoordinates={setMapCoordinates} />
        {/* Example marker */}
        <LocationMarker mapCoordinates={mapCoordinates} setMapCordinates={setMapCoordinates} />
      </MapContainer>
    </div>
  );
}
