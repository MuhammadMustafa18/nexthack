"use client";

import LeafletClientSetup from "@/app/LeafletClientSetup";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import LocationMarker from "./LocationMarker";
interface propTypes{
  setMapCoordinates: (coords: [number,number] | null) => void
}
export default function Map({setMapCoordinates}: propTypes) {
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
        {/* Example marker */}
        <LocationMarker setMapCordinates={setMapCoordinates}/>
      </MapContainer>
    </div>
  );
}
